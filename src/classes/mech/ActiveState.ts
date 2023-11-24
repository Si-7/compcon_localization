/* eslint-disable @typescript-eslint/indent */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
// defines the pilot's relationship to the mech for actvive mode. does not hold active mech info (eg heat, destroyed status)
// but associated logic should be handled by this class (eg. ride-along conditions)

import { store } from '../../store'
import {
  Mech,
  Deployable,
  Pilot,
  MechEquipment,
  MechWeapon,
  Mount,
  ActivationType,
} from '../../class'
import { Action } from '../../interface'
import { IDeployableData, IDeployedData } from '../components/feature/deployable/Deployable'
import { mission } from '../../io/Generators'
import { Duration } from '../enums'
import { ActivePeriod } from '../Action'

enum Stage {
  Narrative = 'Narrative',
  Combat = 'Combat',
  Rest = 'Rest',
}

interface ICombatLogData {
  id: string
  timestamp: string
  mission: number
  encounter: number
  round: number
  event: string
  detail: string
  undoAction: Action
}

interface ICombatStats {
  moves: number
  kills: number
  damage: number
  hp_damage: number
  structure_damage: number
  overshield: number
  heat_damage: number
  reactor_damage: number
  overcharge_uses: number
  core_uses: number
}

interface IActiveStateData {
  active_mech_id: string
  remote_mech_id: string
  stage: string
  mission: number
  turn: number
  actions: number
  braced: boolean
  overcharged: boolean
  prepare: boolean
  bracedCooldown: boolean
  redundant: boolean
  mounted: boolean
  stats: ICombatStats
  deployed: IDeployedData[]
}

class ActiveState {
  public readonly SyncIgnore: string[] = ['remoteMech']
  private _deployed: Deployable[]
  public _stage: Stage
  public InTurn: boolean

  private _log: ICombatLogData[] // write this to a pilot log after mission is ended

  private _pilot_mounted: boolean
  private _pilot_move: number

  private _pilot: Pilot
  private _mech: Mech | null
  private _remoteMech: Mech | null

  private _round: number
  private _encounter: number
  private _mission: number

  private _actions: number

  private _barrageSelections: MechWeapon[]
  private _barrageMounts: Mount[]
  private _shBarrageSelection: MechWeapon
  private _shBarrageMount: Mount

  private _self_destruct_counter: number

  public StabilizeMajor: string
  private _last_stabilize_major: string
  public StabilizeMinor: string
  private _last_stabilize_minor: string

  private _cachedBurnDamage: number
  private _cachedBurnStructure: number

  private _stabilizeUndo: {
    heat: number
    hp: number
    reloads: string[]
    burn: number
    exposed: boolean
  }

  public OverchargeHeat: number
  private _overchargeUndo: string[]

  private _shutDownUndo: {
    heat: number
    cascade: string[]
    statuses: string[]
    conditions: string[]
  }

  private _jockeying: boolean
  private _braced: boolean
  private _overcharged: boolean
  private _prepare: boolean
  private _bracedCooldown: boolean
  private _redundant: boolean

  private _stageNextTurnCoreEnd: boolean
  private _stageNextRoundCoreEnd: boolean

  private _stats: ICombatStats

  public constructor(pilot: Pilot) {
    this._pilot = pilot
    this._mech = null
    this._remoteMech = null
    this._stage = Stage.Narrative
    this._self_destruct_counter = -1
    this._round = 1
    this._encounter = 1
    this._pilot_move = pilot.Speed
    this._actions = 2
    this._barrageSelections = []
    this._barrageMounts = []
    this._braced = false
    this._overcharged = false
    this._prepare = false
    this._bracedCooldown = false
    this._redundant = false
    this._deployed = []
    this._log = []
    this._stats = ActiveState.NewCombatStats()
    this.InTurn = true
    this._cachedBurnDamage = 0
    this._cachedBurnStructure = 0
  }

  public static NewCombatStats(): ICombatStats {
    return {
      moves: 0,
      kills: 0,
      damage: 0,
      hp_damage: 0,
      structure_damage: 0,
      overshield: 0,
      heat_damage: 0,
      reactor_damage: 0,
      overcharge_uses: 0,
      core_uses: 0,
    }
  }

  private save(): void {
    store.dispatch('set_pilot_dirty')
  }

  public get Stats(): ICombatStats {
    return this._stats
  }

  public get Move(): number {
    if (this._pilot_mounted && this.ActiveMech.IsShutDown) return 0
    return !this._pilot_mounted ? this._pilot_move : this.ActiveMech.CurrentMove
  }

  public get MaxMove(): number {
    if (this._pilot_mounted && this.ActiveMech.IsShutDown) return 0
    return !this._pilot_mounted ? this._pilot.Speed : this.ActiveMech.Speed
  }

  public get Actions(): number {
    return this._actions
  }

  public set Actions(val: number) {
    this._actions = val
    if (this._actions > 3) this._actions = 3
  }

  public get IsProtocolAvailable(): boolean {
    return this.Move === this.MaxMove && this.Actions === 2 && !this._overcharged
  }

  public get IsSkirmishAvailable(): boolean {
    return this.Actions > 0 && !this.AllActions.find(x => x.ID === 'act_skirmish').Used
  }

  public get IsJockeying(): boolean {
    return this._jockeying
  }

  public set IsJockeying(val: boolean) {
    this._jockeying = val
  }

  public get IsBraceCooldown(): boolean {
    return this._bracedCooldown
  }

  public get SelfDestructCounter(): number {
    return this._self_destruct_counter
  }

  public StartSelfDestruct(): void {
    this._self_destruct_counter = 3
  }

  public ReactorCriticalDestruct(): void {
    this._self_destruct_counter = 1
  }

  public CancelSelfDestruct(): void {
    this._self_destruct_counter = -1
  }

  public SelfDestruct(): void {
    this.ActiveMech.CurrentHP = 0
    this.ActiveMech.CurrentStructure = 0
    this.ActiveMech.CurrentStress = 0
    this.ActiveMech.Destroyed = true
    this.ActiveMech.ReactorDestroyed = true
    this._self_destruct_counter = 0
    if (this._pilot_mounted) this.ActiveMech.Pilot.Kill()
  }

  public get Stage(): Stage {
    return this._stage
  }

  public get Encounter(): number {
    return this._encounter
  }

  public get Mission(): number {
    return this._mission
  }

  public get Round(): number {
    return this._round
  }

  public StartCombat(): void {
    this._stage = Stage.Combat
    this._pilot_mounted = true
    this._round = 0
    this._encounter++
    this._deployed = []
    this.SetLog({
      id: 'start_combat',
      event: 'LOG.INIT',
      detail: 'БОЕВОЙ РЕЖИМ АКТИВИРОВАН',
    })
    this.NextRound()
    this.InTurn = true
  }

  public UndoEndTurn(): void {
    if (this._cachedBurnDamage) {
      this.ActiveMech.Burn = this._cachedBurnDamage
      this.ActiveMech.CurrentHP += this._cachedBurnDamage
    }
    if (this._cachedBurnStructure) this.ActiveMech.CurrentStructure += this._cachedBurnStructure
    this.InTurn = true
  }

  public EndTurn(burnHp: number, burnStr: number): void {
    this._cachedBurnDamage = burnHp
    this._cachedBurnStructure = burnStr
    if (this.ActiveMech.Frame.CoreSystem.Duration === Duration.Turn)
      this.ActiveMech.IsCoreActive = false
    if (this.ActiveMech.Frame.CoreSystem.Duration === Duration.NextTurn) {
      if (this._stageNextTurnCoreEnd) {
        this.ActiveMech.IsCoreActive = false
        this._stageNextTurnCoreEnd = false
      } else this._stageNextTurnCoreEnd = true
    }
    this.InTurn = false
  }

  public ResetActions(event: ActivePeriod): void {
    this.AllActions.forEach(a => a.Reset(event))
    this.AllItemTechActions.forEach(a => a.Reset(event))
    this.AllBaseTechActions.forEach(a => a.Reset(event))
    this.Deployed.forEach(d => d.Actions.forEach(a => a.Reset(event)))

    if (event == ActivePeriod.Scene || event == ActivePeriod.Mission) {
      if (this.ActiveMech.Frame.CoreSystem.PassiveActions)
        this.ActiveMech.Frame.CoreSystem.PassiveActions.forEach(a => a.Reset(event))
      if (this.ActiveMech.Frame.CoreSystem.DeployActions)
        this.ActiveMech.Frame.CoreSystem.DeployActions.forEach(a => a.Reset(event))
    }
  }

  public NextRound(): void {
    this._round++
    if (this.SelfDestructCounter > 0) this._self_destruct_counter -= 1
    if (this.SelfDestructCounter === 0) this.SelfDestruct()
    if (this._bracedCooldown) this._bracedCooldown = false
    if (this._braced) this._braced = true
    this._actions = this._braced ? 1 : 2
    this._pilot_move = this._pilot.Speed
    this._barrageSelections = []
    this._barrageMounts = []
    this.ResetActions(ActivePeriod.Round)
    this.ActiveMech.MechLoadoutController.ActiveLoadout.Equipment.forEach(e => e.Reset())
    this.ActiveMech.Pilot.PilotLoadoutController.Loadout.Equipment.forEach(e => e.Reset())
    this.ActiveMech.CurrentMove = this._braced ? 0 : this.ActiveMech.MaxMove
    this._braced = false
    this.SetLog({
      id: 'start_combat',
      event: 'LOG.ROUND',
      detail: 'РАУНД НАЧАТ',
    })
    if (this.ActiveMech.Frame.CoreSystem.Duration === Duration.Round)
      this.ActiveMech.IsCoreActive = false
    if (this.ActiveMech.Frame.CoreSystem.Duration === Duration.NextRound) {
      if (this._stageNextRoundCoreEnd) {
        this.ActiveMech.IsCoreActive = false
        this._stageNextRoundCoreEnd = false
      } else this._stageNextRoundCoreEnd = true
    }
    this.InTurn = true
    this.save()
  }

  public StartRest(): void {
    this._stage = Stage.Rest
    this._pilot.CurrentHP += Math.ceil(this._pilot.MaxHP / 2)
    this.ActiveMech.CurrentHeat = 0
    this.ActiveMech.Conditions.splice(0, this.ActiveMech.Conditions.length)
    this.ActiveMech.Statuses.splice(0, this.ActiveMech.Statuses.length)
    this._deployed.splice(0, this._deployed.length)
    this.ResetActions(ActivePeriod.Scene)
    if (this.ActiveMech.Pilot.IsDownAndOut)
      this.ActiveMech.Pilot.CurrentHP = Math.ceil(this.ActiveMech.Pilot.MaxHP / 2)
    this.SetLog({
      id: 'start_combat',
      event: 'LOG.END',
      detail: 'БОЙ ЗАКОНЧЕН. БОЕВОЙ РЕЖИМ ДЕАКТИВИРОВАН.',
    })
    if (this.ActiveMech.Frame.CoreSystem.Duration === Duration.Scene)
      this.ActiveMech.IsCoreActive = false
    this.InTurn = true
    this.save()
  }

  public StartMission(): void {
    this._mission += 1
    this._stats = ActiveState.NewCombatStats()
    this._pilot.FullRestore()
    this.RepairMech('full')
    this.SetLog({
      id: 'start_mission',
      event: 'MISSION.START',
      detail: `НАЧИНАЮ МИССИЮ//${this.timestamp}::${mission()}`,
    })
    this._deployed.splice(0, this._deployed.length)
    this.InTurn = true
    this.StartCombat()
  }

  public EndMission(skipSave?: boolean): void {
    this.ActiveMech.IsCoreActive = false
    if (!skipSave) this._pilot.UpdateCombatStats(this._stats)
    this.ResetActions(ActivePeriod.Mission)
    this.SetLog({
      id: 'end_mission',
      event: 'MISSION.COMPLETE',
      detail: `ЗАП::МИССИЯ ЗАВЕРШЕНА В ${this.timestamp}`,
    })
    this._deployed.splice(0, this._deployed.length)
    this._stage = Stage.Narrative
    this.save()
  }

  RepairHP(): void {
    this.ActiveMech.CurrentHP = this.ActiveMech.MaxHP
    this.ActiveMech.CurrentRepairs -= 1
  }

  RepairStructure(): void {
    this.ActiveMech.CurrentStructure += 1
    const cheap = this.ActiveMech.FeatureController.Bonuses.some(x => x.ID === 'cheap_struct')
    this.ActiveMech.CurrentRepairs -= cheap ? 1 : 2
  }

  RepairStress(): void {
    this.ActiveMech.CurrentStress += 1
    if (this.ActiveMech.CurrentStress > this.ActiveMech.MaxStress)
      this.ActiveMech.CurrentStress = this.ActiveMech.MaxStress
    const cheap = this.ActiveMech.FeatureController.Bonuses.some(x => x.ID === 'cheap_stress')
    this.ActiveMech.CurrentRepairs -= cheap ? 1 : 2
  }

  RepairSystem(w: MechEquipment): void {
    w.Repair()
    this.ActiveMech.CurrentRepairs -= 1
  }

  RepairDestroyed(selfRepairPts: number): void {
    this.ActiveMech.CurrentRepairs -= selfRepairPts
    this.RepairMech()
  }

  RepairMech(repairType?: string): void {
    this.CancelSelfDestruct()
    switch (repairType) {
      case 'full':
        this.ActiveMech.FullRepair()
        break
      case 'basic_w_reactor':
        this.ActiveMech.BasicRepair(true)
        break
      case 'basic_wo_reactor':
        this.ActiveMech.BasicRepair(false)
        break
      default:
        this.ActiveMech.Repair()
        break
    }
  }

  public set ActiveMech(mech: Mech | null) {
    this._mech = mech
    this.save()
  }

  public get ActiveMech(): Mech | null {
    return this._mech
  }

  public get IsMounted() {
    return this._pilot_mounted
  }

  public set IsMounted(val: boolean) {
    this._pilot_mounted = val
    this.save()
  }

  // -- Barrage Staging ---------------------------------------------------------------------------

  public get BarrageSelections(): MechWeapon[] {
    return this._barrageSelections
  }

  public get SHBarrageSelection(): MechWeapon {
    return this._shBarrageSelection
  }

  public get BarrageMounts(): Mount[] {
    return this._barrageMounts
  }

  public get SHBarrageMount(): Mount {
    return this._shBarrageMount
  }

  public SelectShBarrage(w: MechWeapon, m: Mount) {
    this._shBarrageSelection = w
    this._shBarrageMount = m
  }

  public ClearShBarrage() {
    this._shBarrageSelection = null
    this._shBarrageMount = null
  }

  public SelectBarrage(w: MechWeapon, m: Mount) {
    if (this._barrageSelections.length < 2) this._barrageSelections.push(w)
    if (this._barrageMounts.length < 2) this._barrageMounts.push(m)
  }

  public RemoveBarrage(w: MechWeapon, m: Mount) {
    const idx = this._barrageSelections.findIndex(x => x.ID === w.ID)
    if (idx > -1) this._barrageSelections.splice(idx, 1)
    const midx = this._barrageMounts.findIndex(x => x.ID === m.ID)
    if (midx > -1) this._barrageMounts.splice(idx, 1)
  }

  public ClearBarrageSelections() {
    this._barrageSelections = []
    this._barrageMounts = []
  }

  public RegisterBarrage(free?: boolean) {
    this.CommitAction(
      this.AllActions.find(x => x.ID === 'act_barrage'),
      free
    )
  }

  public RegisterSkirmish(free?: boolean) {
    this.CommitAction(
      this.AllActions.find(x => x.ID === 'act_skirmish'),
      free
    )
  }

  public get AvailableAmmoUses(): number {
    const ac = this.ActiveMech.MechLoadoutController.ActiveLoadout.IntegratedSystems.find(x =>
      x.ID.includes('walking_armory')
    )
    if (!ac) return 0
    else return ac.Uses
  }

  public SpendAmmoCost(cost: number) {
    const ac = this.ActiveMech.MechLoadoutController.ActiveLoadout.IntegratedSystems.find(x =>
      x.ID.includes('walking_armory')
    )
    if (ac) ac.Uses -= cost
  }

  public RefundAmmoCost(cost: number) {
    const ac = this.ActiveMech.MechLoadoutController.ActiveLoadout.IntegratedSystems.find(x =>
      x.ID.includes('walking_armory')
    )
    if (ac) ac.Uses += cost
  }

  // -- Actions -----------------------------------------------------------------------------------
  private get timestamp(): string {
    const d = new Date()
    return `${d.getFullYear() + 3000}.${d.getMonth() + 1}.${d
      .getDate()
      .toString()
      .padStart(2, '0')}//${d.getHours().toString().padStart(2, '0')}:${d
      .getMinutes()
      .toString()
      .padStart(2, '0')}:${d.getMilliseconds().toString().padStart(2, '0')}`
  }

  public SetLog(entry: { id: string; event: string; detail: string }, action?: Action) {
    this._log.push({
      id: entry.id,
      timestamp: this.timestamp,
      encounter: this._encounter,
      mission: this._mission,
      round: this._round,
      event: entry.event,
      detail: entry.detail,
      undoAction: action,
    })
  }

  public CommitAction(action: Action, free?: boolean) {
    let activationCost = 0
    if (!free) {
      const act = action.Activation
      if (act === ActivationType.Quick || act === ActivationType.QuickTech) activationCost = 1
      else if (act === ActivationType.Full || act === ActivationType.FullTech) activationCost = 2
    }

    if (this.Actions < activationCost) return

    free ? action.UseFree() : action.Use()

    this.Actions -= activationCost
    if (action.HeatCost) this.ActiveMech.CurrentHeat += action.HeatCost

    if (action.Deployable) {
      const instances = action.Deployable.instances || 1
      for (let i = 0; i < instances; i++) {
        this.Deploy(action.Deployable)
      }
    }

    if (action.ID === 'act_boost') this.AddBoost()
    if (action.ID === 'core_active_activate') this.SetCorePower(0)
    if (action.ID === 'act_overcharge') this.CommitOvercharge()
    if (action.ID === 'act_stabilize') this.CommitStabilize()
    if (action.ID === 'act_jockey') this.IsJockeying = true
    else this.IsJockeying = false
    if (action.ID === 'act_self_destruct') this.StartSelfDestruct()
    if (action.ID === 'act_shut_down') this.CommitShutDown()
    if (action.ID === 'act_boot_up') this.CommitBootUp()
    if (action.ID === 'act_brace') this._braced = true
    if (action.ID === 'act_dismount') this._pilot_mounted = false
    if (action.ID === 'act_mount') this._pilot_mounted = true
    if (action.ID === 'act_hide') this.ActiveMech.AddStatus('HIDDEN')
    if (action.ID === 'act_eject') {
      this.ActiveMech.AddCondition('IMPAIRED')
      this._pilot_mounted = false
    }

    this.SetLog(
      {
        id: action.LogID,
        event: action.Activation.toUpperCase(),
        detail: action.Log ? action.Log : action.Name.toUpperCase(),
      },
      action
    )
  }

  public UndoAction(action: Action) {
    const act = action.LastUse
    if (act === ActivationType.Quick || act === ActivationType.QuickTech) this.Actions += 1
    else if (act === ActivationType.Full || act === ActivationType.FullTech) this.Actions += 2

    action.Undo()

    if (action.HeatCost) this.ActiveMech.CurrentHeat -= action.HeatCost

    const idx = this._log.map(x => x.id === action.LogID).lastIndexOf(true)
    if (idx > -1) this._log.splice(idx, 1)

    if (action.ID === 'act_overcharge') this.UndoOvercharge()
    if (action.ID === 'act_stabilize') this.UndoStabilize()
    if (action.ID === 'act_jockey') this.IsJockeying = false
    if (action.ID === 'act_self_destruct') this.CancelSelfDestruct()
    if (action.ID === 'act_shut_down') this.UndoShutDown()
    if (action.ID === 'act_boot_up') this.UndoBootUp()
    if (action.ID === 'act_brace') this._braced = false
    if (action.ID === 'act_dismount') this._pilot_mounted = true
    if (action.ID === 'act_mount') this._pilot_mounted = false
    if (action.ID === 'act_hide') this.ActiveMech.RemoveStatus('HIDDEN')
    if (action.ID === 'act_eject') {
      this.ActiveMech.RemoveCondition('IMPAIRED')
      this._pilot_mounted = true
    }
  }

  public SetMove(val: number) {
    this._stats.moves += this.ActiveMech.CurrentMove - val
    this.ActiveMech.CurrentMove = val
    if (this.ActiveMech.CurrentMove > this.ActiveMech.MaxMove)
      this.ActiveMech.CurrentMove = this.ActiveMech.MaxMove
    this.SetLog({
      id: `set_move`,
      event: 'ПЕРЕМЕЩЕНИЕ',
      detail: `${
        val > 0 ? `FRAME/COMMIT.TAC: ${val} ПРОСТРАНСТВ` : `FRAME/RESCIND.TAC: ${Math.abs(val)} ПРОСТРАНСТВ`
      }`,
    })
  }

  public SetStatusCondition(statuses: string[], isStatus?: boolean) {
    const scType = isStatus ? 'Statuses' : 'Conditions'
    if (!statuses.length) {
      this.ActiveMech[scType] = statuses
      this.SetLog({
        id: `clear_status`,
        event: 'СТАТУС',
        detail: `FRAME/СТАТУС.ОЧИЩЕН ++ТРЕВОГИ.ВЫКЛ.ВСЕ++`,
      })
      return
    }
    const added = statuses.find(x => !this.ActiveMech[scType].includes(x))
    const removed = this.ActiveMech[scType].find(x => !statuses.includes(x))
    const sstr = added ? added : removed
    this.ActiveMech[scType] = statuses
    this.SetLog({
      id: `set_status`,
      event: 'СТАТУС',
      detail: `${added ? '' : '!ТРЕВОГА! '}FRAME/СТАТУС.${sstr.toUpperCase()} ++ТРЕВОГА.${
        removed ? 'ВЫКЛ' : 'ВКЛ'
      }++`,
    })
  }

  public SetResistance(resistances: string[]) {
    if (!resistances.length) {
      this.ActiveMech.Resistances = resistances
      this.SetLog({
        id: `clear_resist`,
        event: 'СОПРОТИВЛЕНИЕ',
        detail: `FRAME/ЗАЩ.СОПР ++СОПР.КОНЕЦ.ВСЕ++`,
      })
      return
    }
    const added = resistances.find(x => !this.ActiveMech.Resistances.includes(x))
    const removed = this.ActiveMech.Resistances.find(x => !resistances.includes(x))
    const sstr = added ? added : removed
    this.ActiveMech.Resistances = resistances
    this.SetLog({
      id: `set_res`,
      event: 'СОПРОТИВЛЕНИЕ',
      detail: `FRAME/ЗАЩ.СОПР::${sstr.toUpperCase()}${removed ? '++СОПР.КОНЕЦ++' : ''}`,
    })
  }

  public SetBurn(val: number) {
    this.ActiveMech.Burn = val
    this.SetLog({
      id: `set_burn`,
      event: 'ГОРЕНИЕ',
      detail: `${
        val > 0
          ? `!ТРЕВОГА! FRAME/УРОН.ПРОДОЛЖАЮЩИЙСЯ: ${val} ++ТРЕВОГА.ВКЛ++`
          : `FRAME/УРОН.СМЯГЧЕН: ${Math.abs(val)} ${
              this.ActiveMech.Burn > 0 ? '++ТРЕВОГА.ВКЛ++' : '++ТРЕВОГА.ВЫКЛ++'
            }`
      }`,
    })
  }

  public CommitFullRepair() {
    this.RepairMech('full')
    this.SetLog({
      id: `full_repair`,
      event: 'ПОЛНЫЙ РЕМОНТ',
      detail: `FRAME/КОРЕНЬ::ПОЛНЫЙ РЕМОНТ`,
    })
  }

  public SetStructure(val: number) {
    this._stats.structure_damage += this.ActiveMech.CurrentStructure - val
    this.ActiveMech.CurrentStructure = val
    const pct = (this.ActiveMech.CurrentStructure / this.ActiveMech.MaxStructure).toFixed(2)
    this.SetLog({
      id: `set_str`,
      event: 'СТРУКТУРНЫЙ УРОН',
      detail: `!КРИТИЧЕСКОЕ! FRAME.СТРУКТ::ЦЕЛОСТНОСТЬ НАРУШЕНА ++${pct}++`,
    })
  }

  public SetStress(val: number) {
    this._stats.reactor_damage += this.ActiveMech.CurrentStress - val
    this.ActiveMech.CurrentStress = val
    const pct = (this.ActiveMech.CurrentStress / this.ActiveMech.MaxStress).toFixed(2)
    this.SetLog({
      id: `set_stress`,
      event: 'НАГРУЗКА',
      detail: `!КРИТИЧЕСКОЕ! FRAME.РЕАКТОР::ЦЕЛОСТНОСТЬ НАРУШЕНА ++${pct}++`,
    })
  }

  public SetOvershield(val: number) {
    this._stats.overshield += this.ActiveMech.Overshield - val
    this.ActiveMech.Overshield = val
    this.SetLog({
      id: `set_overshield`,
      event: 'OVERSHIELD',
      detail: `FRAME.REMOTE::OVERSHIELD.SET ++${val}++`,
    })
  }

  public SetHp(val: number) {
    this._stats.hp_damage += this.ActiveMech.CurrentHP - val
    if (val > this.ActiveMech.CurrentHP) {
      this.ActiveMech.CurrentHP = val
      this.SetLog({
        id: `rep_dmg`,
        event: 'РЕМОНТ',
        detail: `FRAME/РЕМ.ПРОЦЕСС:: ${val} ПЗ ВОССТАНОВЛЕНО`,
      })
    } else {
      const str = this.ActiveMech.CurrentStructure
      this.ActiveMech.CurrentHP = val
      this.SetLog({
        id: `add_dmg`,
        event: 'УРОН',
        detail: `!ПРЕДУПРЕЖДЕНИЕ! ВХОД:: ${val} ПЗ УРОНА`,
      })
      if (this.ActiveMech.CurrentStructure < str) {
        const pct = (this.ActiveMech.CurrentStructure / this.ActiveMech.MaxStructure).toFixed(2)
        this.SetLog({
          id: `set_str`,
          event: 'СТРУКТУРНЫЙ УРОН',
          detail: `!КРИТИЧЕСКОЕ! FRAME.СТРУКТ::ЦЕЛОСТНОСТЬ НАРУШЕНА ++${pct}++`,
        })
      }
    }
  }

  public SetHeat(val: number) {
    this._stats.heat_damage += val
    if (val < this.ActiveMech.CurrentHeat) {
      const dz = this.ActiveMech.IsInDangerZone
      this.ActiveMech.CurrentHeat = val
      this.SetLog({
        id: `clear_heat`,
        event: 'СБРОС НАГРЕВА',
        detail: `FRAME/РЕАКТОР.ВЕНТИЛЯЦИЯ:: ${val} НАГРЕВА СБРОШЕНО`,
      })
      if (dz && !this.ActiveMech.IsInDangerZone) {
        this.SetLog({
          id: `out_dangerzone`,
          event: 'УРОВЕНЬ НАГРЕВА В НОРМЕ',
          detail: `FRAME/РЕАКТОР:: ++ТЕМП.ОК++`,
        })
      }
    } else {
      const str = this.ActiveMech.CurrentStress
      this.ActiveMech.CurrentHeat = val
      this.SetLog({
        id: `add_heat`,
        event: 'НАГРЕВ',
        detail: `!ПРЕДУПРЕЖДЕНИЕ! FRAME/РЕАКТОР.УРОВЕНЬ_НАГРЕВА:: ${val} НАГРЕВА`,
      })
      if (this.ActiveMech.IsInDangerZone) {
        this.SetLog({
          id: `dangerzone`,
          event: 'ТРЕВОГА НАГРЕВА',
          detail: `!ALERT! FRAME/РЕАКТОР:: ++ТЕМП.КРИТИЧЕСКАЯ++`,
        })
      }
      if (this.ActiveMech.CurrentStress < str) {
        const pct = (this.ActiveMech.CurrentStress / this.ActiveMech.MaxStress).toFixed(2)
        this.SetLog({
          id: `set_stress`,
          event: 'НАГРУЗКА',
          detail: `!КРИТИЧЕСКОЕ! FRAME.РЕАКТОР::ЦЕЛОСТНОСТЬ НАРУШЕНА ++${pct}++`,
        })
      }
    }
  }

  public SetRepCap(val: number) {
    this.ActiveMech.CurrentRepairs = val
    this.SetLog({
      id: `set_rep`,
      event: 'ЛИМИТ РЕМОНТА',
      detail: `${
        val < 0 ? `FRAME/ПОДТВЕРДИТЬ.РЕМОНТ: ${val}` : `FRAME/ВОССТАНОВИТЬ.РЕМОНТ: ${Math.abs(val)}`
      }`,
    })
  }

  public SetCorePower(val: number) {
    if (this.ActiveMech.CurrentCoreEnergy > 0 && val === 0) this.ActiveMech.IsCoreActive = true
    this._stats.core_uses += this.ActiveMech.CurrentCoreEnergy - val
    this.ActiveMech.CurrentCoreEnergy = val
    this.SetLog({
      id: `set_core`,
      event: 'МОЩЬ ЯДРА',
      detail: `${
        val > 0 ? `FRAME/ЯДРО:: ВОЗМОЖНОСТИ ВОССТАНОВЛЕНЫ` : `!ТРЕВОГА! АКТИВАЦИЯ ЯДРА РАМЫ !ТРЕВОГА!`
      }`,
    })
  }

  public SetOvercharge(val: number) {
    const inc = this.ActiveMech.CurrentOvercharge < val
    this.ActiveMech.CurrentOvercharge = val
    this.SetLog({
      id: `set_oc`,
      event: 'ПЕРЕГРУЗКА',
      detail: `${
        inc
          ? `!ПРЕДУПРЕЖДЕНИЕ! FRAME/РЕАКТОР.СИС::ПЕРЕНАПРАВЛЕНИЕ МОЩНОСТИ ПОДТВЕРЖДЕНО ++НАГРЕВ.ТРЕВОГА.ВКЛ++`
          : `FRAME/РЕАКТОР.СИС::ПРОТОКОЛ ВОССТАНОВЛЕНИЯ ЗАРЯДА`
      }`,
    })
  }

  public CommitStabilize() {
    this._stabilizeUndo = {
      heat: this.ActiveMech.CurrentHeat,
      hp: this.ActiveMech.CurrentHP,
      reloads: this.ActiveMech.MechLoadoutController.ActiveLoadout.Weapons.filter(
        x => x.IsLoading && !x.Loaded
      ).map(w => w.ID),
      burn: this.ActiveMech.Burn,
      exposed: this.ActiveMech.Statuses.includes('Уязвимость'),
    }
    let str = 'FRAME.КОРЕНЬ.ЗАЩ//СТАБИЛИЗАЦИЯ'
    if (this.StabilizeMajor === 'cool') {
      str += ' ::РЕАКТОР_ВЕНТИЛЯЦИЯ'
      this.ActiveMech.CurrentHeat = 0
      const expIdx = this.ActiveMech.Statuses.indexOf('Уязвимость')
      if (expIdx > -1) this.ActiveMech.Statuses.splice(expIdx, 1)
    } else if (this.StabilizeMajor === 'repair') {
      str += ' ::РЕМОНТ'
      this.ActiveMech.CurrentRepairs -= 1
      this.ActiveMech.CurrentHP = this.ActiveMech.MaxHP
    }

    if (this.StabilizeMinor === 'reload') {
      str += ' ::ПЕРЕЗАРЯДКА'
      this.ActiveMech.MechLoadoutController.ActiveLoadout.Weapons.filter(
        x => x.IsLoading && !x.Loaded
      ).forEach(w => (w.Loaded = true))
    } else if (this.StabilizeMinor === 'end_burn') {
      str += ' ::КОНЕЦ.ГОРЕНИЯ'
      this.ActiveMech.Burn = 0
    } else if (this.StabilizeMinor === 'end_self_condition') str += ' ::СИС.ВОССТАНОВЛЕНИЕ'
    else if (this.StabilizeMinor === 'end_ally_condition') str += ' ::УДАЛЕННАЯ.ПОДДЕРЖКА'

    this.SetLog({
      id: `stabilize`,
      event: 'СТАБИЛИЗАЦИЯ',
      detail: str,
    })

    this._last_stabilize_major = this.StabilizeMajor
    this.StabilizeMajor = null
    this._last_stabilize_minor = this.StabilizeMinor
    this.StabilizeMinor = null
  }

  public UndoStabilize() {
    const idx = this._log.map(x => x.id === 'stabilize').lastIndexOf(true)
    if (idx > -1) this._log.splice(idx, 1)
    if (this._last_stabilize_major === 'cool') {
      this.ActiveMech.CurrentHeat = this._stabilizeUndo.heat
      if (this._stabilizeUndo.exposed) this.ActiveMech.Statuses.push('EXPOSED')
    } else if (this._last_stabilize_major === 'repair') {
      this.ActiveMech.CurrentRepairs += 1
      this.ActiveMech.CurrentHP = this._stabilizeUndo.hp
    }

    if (this._last_stabilize_minor === 'reload') {
      this._stabilizeUndo.reloads.forEach(
        x =>
          (this.ActiveMech.MechLoadoutController.ActiveLoadout.Weapons.find(
            w => w.ID === x
          ).Loaded = false)
      )
    } else if (this._last_stabilize_minor === 'end_burn') {
      this.ActiveMech.Burn = this._stabilizeUndo.burn
    }
  }

  public ClearBurn() {
    this.ActiveMech.Burn = 0
  }

  public TakeBurn() {
    this.ActiveMech.AddDamage(this.ActiveMech.Burn)
  }

  public AddBoost() {
    this.ActiveMech.Boost = this.ActiveMech.MaxMove
  }

  public SetBoost(val) {
    this.ActiveMech.Boost = val
  }

  public CommitOvercharge() {
    this._overchargeUndo = []
    this.AllActions.concat(this.TechActions).forEach(a => {
      if (a.Used) this._overchargeUndo.push(a.ID)
      a.Reset()
    })
    this.Actions += 1
    this.ActiveMech.AddHeat(this.OverchargeHeat)
    if (this.ActiveMech.CurrentOvercharge < this.ActiveMech.OverchargeTrack.length)
      this.ActiveMech.CurrentOvercharge += 1
    this.AllActions.find(x => x.ID === 'act_overcharge').Use()
  }

  public UndoOvercharge() {
    this.AllActions.forEach(a => {
      if (this._overchargeUndo.includes(a.ID)) a.Use()
    })
    this.TechActions.forEach(a => {
      if (this._overchargeUndo.includes(a.ID)) a.Use()
    })
    this._overchargeUndo = []
    this.Actions -= 1
    this.ActiveMech.ReduceHeat(this.OverchargeHeat)
    if (this.ActiveMech.CurrentOvercharge > 0) this.ActiveMech.CurrentOvercharge -= 1
    this.OverchargeHeat = 0
  }

  public CommitShutDown() {
    this._shutDownUndo = {
      heat: this.ActiveMech.CurrentHeat,
      cascade: this.ActiveMech.MechLoadoutController.ActiveLoadout.Equipment.filter(
        x => x.IsCascading
      ).map(e => e.ID),
      statuses: this.ActiveMech.Statuses,
      conditions: this.ActiveMech.Conditions,
    }
    this.ActiveMech.CurrentHeat = 0
    this.ActiveMech.RemoveStatus('EXPOSED')
    this.ActiveMech.RemoveCondition('JAMMED')
    this.ActiveMech.RemoveCondition('LOCK ON')
    this.ActiveMech.MechLoadoutController.ActiveLoadout.Equipment.filter(
      x => x.IsCascading
    ).forEach(e => {
      e.IsCascading = false
    })
    this.ActiveMech.AddStatus('SHUT DOWN')
    this.ActiveMech.AddStatus('STUNNED')
  }

  public UndoShutDown() {
    this.ActiveMech.CurrentHeat = this._shutDownUndo.heat
    this.ActiveMech.MechLoadoutController.ActiveLoadout.Equipment.forEach(e => {
      if (this._shutDownUndo.cascade.includes(e.ID)) e.IsCascading = true
    })
    this.ActiveMech.Statuses = this._shutDownUndo.statuses
    this.ActiveMech.Conditions = this._shutDownUndo.conditions
  }

  public CommitBootUp() {
    this.ActiveMech.RemoveStatus('SHUT DOWN')
    this.ActiveMech.RemoveCondition('STUNNED')
  }

  public UndoBootUp() {
    this.ActiveMech.AddStatus('SHUT DOWN')
    this.ActiveMech.AddCondition('STUNNED')
  }

  public LogAttackAction(action: string, weapon: string, damage: number, kill?: boolean) {
    this._stats.damage += damage
    this._stats.kills += kill ? 1 : 0
    this.SetLog({
      id: action,
      event: weapon.toUpperCase(),
      detail: `${action.toUpperCase()}//${weapon.toUpperCase()}::${damage} DMG ${
        kill ? '++УНИЧТОЖЕНИЕ ПОДТВЕРЖДЕНО++' : ''
      }`,
    })
  }

  public UndoLogAttackAction(action: string, weapon: string, damage: number, kill?: boolean) {
    this._stats.damage -= damage
    this._stats.kills -= kill ? 1 : 0
    const idx = this._log
      .map(x => x.id === action && x.event === weapon.toUpperCase())
      .lastIndexOf(true)
    if (idx > -1) this._log.splice(idx, 1)
  }

  public Deploy(d: IDeployableData) {
    const n = this._deployed.filter(x =>
      x.BaseName.toLowerCase().includes(d.name.toLowerCase())
    ).length
    this._deployed.push(new Deployable(d, this.ActiveMech, n))
    this.SetLog({
      id: `deploy`,
      event: 'РАЗМЕЩЕНИЕ СНАРЯЖЕНИЯ',
      detail: `FRAME/УДАЛЕННО::${d.name.toUpperCase().replace(/\s/g, '.')}.${n} ++СТАТУС ОК++`,
    })
    this.save()
  }

  public get Deployed(): Deployable[] {
    return this._deployed
  }

  public RemoveDeployable(id: string) {
    this._deployed.splice(
      this._deployed.findIndex(x => x.ID === id),
      1
    )
    this.save()
  }

  public RecallDeployable(d: Deployable): boolean {
    let activationCost = 0
    if (d.Recall === ActivationType.Quick) activationCost = 1
    else if (d.Recall === ActivationType.Full) activationCost = 2

    if (this.Actions < activationCost) return false
    this._actions -= activationCost

    this.SetLog({
      id: `recall_${d.ID}`,
      event: 'ВОЗВРАТ СНАРЯЖЕНИЯ',
      detail: `РАЗМЕЩЕННЫЙ.ВОЗВРАТ//${d.Name}`,
    })

    d.IsRecalled = true
    this.save()
    return true
  }

  public RedeployDeployable(d: Deployable): boolean {
    let activationCost = 0
    if (d.Redeploy === ActivationType.Quick) activationCost = 1
    else if (d.Redeploy === ActivationType.Full) activationCost = 2

    if (this.Actions < activationCost) return false
    this._actions -= activationCost

    this.SetLog({
      id: `redeploy_${d.ID}`,
      event: 'ПОВТОРНОЕ РАЗМЕЩЕНИЕ',
      detail: `РАЗМЕЩЕНИЕ.ПОВТОРНОЕ//${d.Name}`,
    })

    d.IsRecalled = false
    this.save()
    return true
  }

  // -- Action Collection -------------------------------------------------------------------------

  private get baseActions(): Action[] {
    return store.getters.getItemCollection('Actions').filter(x => x)
  }

  public BaseActions(type: string): Action[] {
    return this.baseActions.filter(x => x.Activation === type)
  }

  public ItemActions(type: string): Action[] {
    return [
      ...this.ActiveMech.FeatureController.Actions,
      ...this._pilot.FeatureController.Actions,
    ].filter(x => x.Activation === type)
  }

  public ActionsByType(type: string): Action[] {
    return this.BaseActions(type).concat(this.ItemActions(type))
  }

  private get baseActionTypes() {
    const exclude = ['Перемещение', 'Вторжение', 'Быстрая Технология', 'Полная Технология']
    return Object.keys(ActivationType)
      .map(k => ActivationType[k as string])
      .filter(x => !exclude.includes(x))
  }

  private get techActionTypes() {
    const include = ['Вторжение', 'Быстрая Технология', 'Полная Технология']
    return Object.keys(ActivationType)
      .map(k => ActivationType[k as string])
      .filter(x => include.includes(x))
  }

  public get AllBaseActions(): Action[] {
    return this.baseActionTypes.flatMap(t => this.BaseActions(t))
  }

  public get AllBaseTechActions(): Action[] {
    return this.techActionTypes.flatMap(t => this.BaseActions(t))
  }

  public get AllItemActions(): Action[] {
    return this.baseActionTypes.flatMap(t => this.ItemActions(t))
  }

  public get AllItemTechActions(): Action[] {
    return this.techActionTypes.flatMap(t => this.ItemActions(t))
  }

  public get AllActions(): Action[] {
    return this.AllBaseActions.concat(this.AllItemActions)
  }

  public get AvailableActions(): string[] {
    if (this.Stage === 'Narrative')
      return store.getters
        .getItemCollection('Actions')
        .filter(x => x && x.Activation === 'Отдыха')
        .map(x => x.ID)

    if (!this.IsMounted) {
      const pilotActions = this.AllActions.filter(x => x.IsPilotAction && !x.IsActiveHidden).map(
        x => x.ID
      )
      if (!this.ActiveMech.ReactorDestroyed) return pilotActions
      return pilotActions.filter(x => x !== 'act_mount')
    } else {
      if (this.ActiveMech.IsShutDown) {
        return ['act_boot_up', 'act_dismount', 'act_eject']
      }
      if (this.ActiveMech.IsStunned) {
        return ['act_dismount', 'act_eject']
      }
      if (this.ActiveMech.ReactorDestroyed) {
        return []
      }
      if (this.ActiveMech.Destroyed) {
        return ['act_dismount']
      }

      console.log(this.AllActions.map(x => x.Name))

      const out = this.AllActions.filter(x => x.IsMechAction && !x.IsActiveHidden).map(x => x.ID)
      if (!this.ActiveMech.IsShutDown) out.splice(out.indexOf('act_boot_up'), 1)
      return out
    }
  }

  public get TechActions(): Action[] {
    const exclude = ['БЫСТРАЯ ТЕХНОЛОГИЯ', 'ПОЛНАЯ ТЕХНОЛОГИЯ']
    const out = this.AllBaseTechActions.concat(this.AllItemTechActions)
    return out.filter(x => !exclude.some(y => y === x.Name.toUpperCase()))
  }

  public get DowntimeActions(): Action[] {
    return store.getters.getItemCollection('Actions').filter(x => x && x.Activation === 'Отдыха')
  }

  // -- Log ---------------------------------------------------------------------------------------
  public get Log() {
    return this._log
  }

  // -- I/O ---------------------------------------------------------------------------------------

  public static Serialize(s: ActiveState): IActiveStateData {
    return {
      active_mech_id: s._mech ? s._mech.ID : '',
      remote_mech_id: s._remoteMech ? s._remoteMech.ID : '',
      stage: s._stage,
      turn: s._round,
      mission: s._mission,
      actions: s._actions,
      braced: s._braced,
      overcharged: s._overcharged,
      prepare: s._prepare,
      bracedCooldown: s._bracedCooldown,
      redundant: s._redundant,
      mounted: s._pilot_mounted,
      stats: s._stats,
      deployed: s._deployed.map(x => Deployable.Serialize(x)),
    }
  }

  public static Deserialize(pilot: Pilot, data: IActiveStateData): ActiveState {
    const s = new ActiveState(pilot)
    s.Update(pilot, data)
    return s
  }

  public Update(pilot: Pilot, data: IActiveStateData, sync?: boolean): void {
    if (sync) {
      for (const key in data) {
        if (this.SyncIgnore.includes(key)) data[key] = null
      }
    } else {
      this._remoteMech = pilot.Mechs.find(x => x.ID === data.remote_mech_id)
    }

    this._mech = pilot.Mechs.find(x => x.ID === data.active_mech_id)
    if (!this.ActiveMech) return
    this._stage = (data.stage as Stage) || Stage.Narrative
    this._round = data.turn || 1
    this._mission = data.mission || 0
    this._actions = data.actions || 2
    this._braced = data.braced
    this._overcharged = data.overcharged
    this._prepare = data.prepare
    this._bracedCooldown = data.bracedCooldown
    this._redundant = data.redundant
    this._pilot_mounted = data.mounted
    this._stats = data.stats ? data.stats : ActiveState.NewCombatStats()
    this._deployed = data.deployed
      ? data.deployed.map(x => Deployable.Deserialize(x, this.ActiveMech))
      : []
  }
}

export { ActiveState, IActiveStateData, ICombatStats }
