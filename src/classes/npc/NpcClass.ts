import { store } from '@/store'
import { INpcClassStats, NpcClassStats } from './NpcClassStats'
import { NpcFeature } from './'

export interface INpcClassData {
  id: string
  name: string
  role: string
  info: { flavor: string; tactics: string }
  stats: INpcClassStats
  base_features: string[]
  optional_features: string[]
  brew: string
}

export class NpcClass {
  public readonly LcpName: string
  public readonly InLcp: boolean
  private _id: string
  private _name: string
  private _role: string
  private _info: {
    flavor: string
    tactics: string
  }
  private _stats: NpcClassStats
  private _base_features: string[]
  private _optional_features: string[]
  private _brew: string

  public constructor(data: INpcClassData, packName?: string) {
    this._id = data.id
    this._name = data.name
    this._role = data.role
    this._info = data.info
    this._stats = new NpcClassStats(data.stats)
    this._base_features = data.base_features
    this._optional_features = data.optional_features
    this._brew = data.brew || 'CORE'
    this.LcpName = packName || 'Lancer CORE NPCs'
    this.InLcp = this.LcpName != 'Lancer CORE NPCs' ? true : false
  }

  public get ID(): string {
    return this._id
  }

  public get Name(): string {
    return this._name
  }

  public get Role(): string {
    return this._role
  }

  public get RoleIcon(): string {
    if (this._role.toLowerCase() === 'биологический') return 'mdi-heart-pulse'
    console.log(this._role)
    switch (this._role) {
      case 'нападающий':
        return 'cci-role-striker'
      case 'поддерживающий':
        return 'cci-role-support'
      case 'оператор':
        return 'cci-role-controller'
      case 'защитник':
        return 'cci-role-defender'
      case 'артиллерист':
        return 'cci-role-artillery'
    }
    return `cci-role-${this._role}`
  }

  public get Color(): string {
    switch (this._role) {
      case 'нападающий':
        return 'role--striker'
      case 'поддерживающий':
        return 'role--support'
      case 'оператор':
        return 'role--controller'
      case 'защитник':
        return 'role--defender'
      case 'артиллерист':
        return 'role--artillery'
      case 'биологический':
        return 'role--biological'
    }
    return `role--${this._role}`
  }

  public get Flavor(): string {
    return this._info.flavor
  }

  public get Tactics(): string {
    return this._info.tactics
  }

  public get BaseFeatures(): NpcFeature[] {
    return this._base_features.map(x => store.getters.referenceByID('NpcFeatures', x))
  }

  public get OptionalFeatures(): NpcFeature[] {
    return this._optional_features.map(x => store.getters.referenceByID('NpcFeatures', x))
  }

  public get Stats(): NpcClassStats {
    return this._stats
  }

  public get ItemType(): string {
    return 'NPC Class'
  }

  public get Brew(): string {
    return this._brew
  }
}
