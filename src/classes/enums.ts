enum Duration {
  Free = 'Free',
  Turn = 'Turn',
  NextTurn = 'Next Turn',
  Round = 'Round',
  NextRound = 'Next Round',
  Scene = 'Scene',
  Encounter = 'Encounter',
  Mission = 'Mission',
}

enum ActivationType {
  None = 'Нет',
  Free = 'Свободное',
  Passive = 'Пассивное',
  Protocol = 'Протокол',
  Move = 'Перемещение',
  Quick = 'Быстрое',
  Full = 'Полное',
  Invade = 'Вторжение',
  FullTech = 'Полная Технология',
  QuickTech = 'Быстрая технология',
  Reaction = 'Реакция',
  Other = 'Прочее',
  Downtime = 'Отдыха',
}

enum MountType {
  Main = 'Main',
  Heavy = 'Heavy',
  AuxAux = 'Aux/Aux',
  Aux = 'Aux',
  MainAux = 'Main/Aux',
  Flex = 'Flex',
  Integrated = 'Integrated',
}

// governs what can be added to a mount (weapon slot)
enum FittingSize {
  Auxiliary = 'Auxiliary',
  Main = 'Main',
  Flex = 'Flex',
  Heavy = 'Heavy',
  Integrated = 'Integrated',
}

enum WeaponSize {
  Aux = 'Auxiliary',
  Main = 'Main',
  Heavy = 'Heavy',
  Superheavy = 'Superheavy',
}

enum WeaponType {
  Rifle = 'Rifle',
  Cannon = 'Cannon',
  Launcher = 'Launcher',
  CQB = 'CQB',
  Nexus = 'Nexus',
  Melee = 'Melee',
  All = '???',
}

enum ItemType {
  None = '',
  Action = 'Action',
  CoreBonus = 'CoreBonus',
  Frame = 'Frame',
  PilotArmor = 'PilotArmor',
  PilotWeapon = 'PilotWeapon',
  PilotGear = 'PilotGear',
  Skill = 'Skill',
  Talent = 'Talent',
  Tag = 'Tag',
  MechWeapon = 'MechWeapon',
  MechSystem = 'MechSystem',
  WeaponMod = 'WeaponMod',
  SystemMod = 'SystemMod',
  NpcFeature = 'NpcFeature',
}

enum SystemType {
  System = 'Система',
  AI = 'ИИ',
  Shield = 'Щит',
  Deployable = 'Развертываемый объект',
  Drone = 'Дрон',
  Tech = 'Технология',
  Armor = 'Броня',
  FlightSystem = 'Система Полета',
  Integrated = 'Интегрированная',
  Mod = 'Мод',
}

enum SkillFamily {
  str = 'str',
  dex = 'dex',
  int = 'int',
  cha = 'cha',
}

enum RangeType {
  Range = 'Дальность',
  Threat = 'Угроза',
  Thrown = 'Метательное',
  Line = 'Линия',
  Cone = 'Конус',
  Blast = 'Взрыв',
  Burst = 'Разрыв',
}

enum DamageType {
  Kinetic = 'Кинетический',
  Energy = 'Энергетический',
  Explosive = 'Взрывной',
  Heat = 'Нагрев',
  Burn = 'Горение',
  Variable = 'Различный',
}

enum MechType {
  Balanced = 'Сбалансированная',
  Artillery = 'Артиллерист',
  Striker = 'Нападающая',
  Controller = 'Оператор',
  Support = 'Поддерживающая',
  Defender = 'Защищающая',
}

enum HASE {
  H = 'hull',
  A = 'agi',
  S = 'sys',
  E = 'eng',
}

enum ReserveType {
  Resources = 'Ресурс',
  Tactical = 'Тактический',
  Mech = 'Мех',
  Project = 'Проект',
  Organization = 'Организация',
  Bonus = 'Бонус',
}

enum OrgType {
  Military = 'Military',
  Scientific = 'Scientific',
  Academic = 'Academic',
  Criminal = 'Criminal',
  Humanitarian = 'Humanitarian',
  Industrial = 'Industrial',
  Entertainment = 'Entertainment',
  Political = 'Political',
}

enum EncounterSide {
  Enemy = 'Enemy',
  Ally = 'Ally',
  Neutral = 'Neutral',
}

enum ImageTag {
  Pilot = 'pilot',
  NPC = 'npc',
  Enemy = 'enemy',
  Frame = 'frame',
  Mech = 'mech',
  Map = 'map',
  Location = 'location',
  Object = 'object',
  Logo = 'logo',
  Misc = 'misc',
}

export {
  Duration,
  ActivationType,
  MountType,
  FittingSize,
  WeaponSize,
  WeaponType,
  ItemType,
  SystemType,
  SkillFamily,
  RangeType,
  DamageType,
  HASE,
  MechType,
  ReserveType,
  OrgType,
  EncounterSide,
  ImageTag,
}
