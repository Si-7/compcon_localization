export default [
  {
    id: 'skill_point',
    title: 'Триггер пилота',
    detail: "{INC_DEC} сумму доступных пилоту Триггеров на {VAL}",
  },
  {
    id: 'mech_skill_point',
    title: 'Очко Навыка Мехов (КМСИ)',
    detail: "{INC_DEC} сумму доступных пилоту Навыков Мехов на {VAL}",
  },
  {
    id: 'talent_point',
    title: 'Талант пилота',
    detail: "{INC_DEC} сумму доступных пилоту Талантов на {VAL}",
  },
  {
    id: 'license_point',
    title: 'Лицензия пилота',
    detail: "{INC_DEC} сумму доступных пилоту лицензий на {VAL}",
  },
  {
    id: 'cb_point',
    title: 'Бонус Ядра пилота',
    detail: "{INC_DEC} сумму доступных пилоту Бонусов Ядра на {VAL}",
  },
  {
    id: 'pilot_gear',
    title: 'Лимит снаряжения пилота',
    detail: "{INC_DEC} лимит снаряжения пилота на {VAL}",
  },
  {
    id: 'range',
    title: 'Модифицированная дальность оружия',
    detail:
      '{INC_DEC} {RANGE_TYPES} оружия на {VAL} для {DAMAGE_TYPES}{WEAPON_TYPES}{WEAPON_SIZES} оружия',
  },
  {
    id: 'damage',
    title: 'Модифицированный урон оружия',
    detail: '{INC_DEC}{DAMAGE_TYPES} урон оружия на {VAL} для {WEAPON_TYPES}{WEAPON_SIZES} оружия',
  },
  {
    id: 'hp',
    title: 'ПЗ меха',
    detail: '{INC_DEC} Пункты Здоровья меха на {VAL}',
  },
  {
    id: 'armor',
    title: 'Броня меха',
    detail: '{INC_DEC} Броню меха на {VAL}',
  },
  {
    id: 'structure',
    title: 'Структура меха',
    detail: '{INC_DEC} Структуру меха на {VAL}',
  },
  {
    id: 'stress',
    title: 'Нагрузка меха',
    detail: '{INC_DEC} Нагрузку меха на {VAL}',
  },
  {
    id: 'heatcap',
    title: 'Тепловой Максимум меха',
    detail: '{INC_DEC} Тепловой Максимум меха на {VAL}',
  },
  {
    id: 'repcap',
    title: 'Лимит Ремонта меха',
    detail: '{INC_DEC} Лимит Ремонта меха на {VAL}',
  },
  {
    id: 'core_power',
    title: 'Мощь Ядра меха',
    detail: '{INC_DEC} Мощь Ядра меха на {VAL}',
  },
  {
    id: 'speed',
    title: 'Скорость меха',
    detail: '{INC_DEC} Скорость меха на {VAL}',
  },
  {
    id: 'evasion',
    title: 'Уклонение меха',
    detail: '{INC_DEC} Уклонение меха на {VAL}',
  },
  {
    id: 'edef',
    title: 'Э-Защиту меха',
    detail: '{INC_DEC} Э-Защиту меха на {VAL}',
  },
  {
    id: 'sensor',
    title: 'Дальность Сенсоров меха',
    detail: '{INC_DEC} Дальность Сенсоров меха на {VAL}',
  },
  {
    id: 'tech_attack',
    title: 'Техническая Атака меха',
    detail: '{INC_DEC} Техническая Атака меха на {VAL}',
  },
  {
    id: 'save',
    title: 'Спасбросок Цели меха',
    detail: '{INC_DEC} Спасбросок Цели меха на {VAL}',
  },
  {
    id: 'sp',
    title: 'СП меха',
    detail: '{INC_DEC} СП меха на {VAL}',
  },
  {
    id: 'size',
    title: 'Модифицированный Размер меха',
    detail: '{INC_DEC} Размер меха на {VAL}',
  },
  {
    id: 'ai_cap',
    title: 'Лимит ИИ',
    detail: '{INC_DEC} Лимит ИИ на {VAL}',
  },
  {
    id: 'cheap_struct',
    title: 'Половина цены за Структурный ремонт',
    detail: 'Структурный ремонт требует 1 Ремонт вместо 2',
  },
  {
    id: 'cheap_stress',
    title: 'Половина цены за ремонт Реактора',
    detail: 'Ремонт Реактора требует 1 Ремонт вместо 2',
  },
  {
    id: 'overcharge',
    title: 'Модифицированный \"дорожка\" Перегрузки',
    detail: 'Модифицирует \"дорожку\" цены Перегрузки',
  },
  {
    id: 'limited_bonus',
    title: 'Использования Ограниченного снаряжения',
    detail: '{INC_DEC} использования снаряжения с меткой "Ограниченное X" на {VAL}',
  },
  {
    id: 'pilot_hp',
    title: 'ПЗ пилота',
    detail: '{INC_DEC} ПЗ пилота на {VAL}',
  },
  {
    id: 'pilot_armor',
    title: 'Броня пилота',
    detail: '{INC_DEC} Броню пилота на {VAL}',
  },
  {
    id: 'pilot_evasion',
    title: 'Уклонение пилота',
    detail: '{INC_DEC} Уклонение пилота на {VAL}',
  },
  {
    id: 'pilot_edef',
    title: 'Э-Защита пилота',
    detail: '{INC_DEC} Э-Защиту пилота на {VAL}',
  },
  {
    id: 'pilot_speed',
    title: 'Скорость пилота',
    detail: '{INC_DEC} Скорость пилота на {VAL}',
  },
  {
    id: 'deployable_hp',
    title: 'ПЗ всех Дронов и размещаемых объектов',
    detail: '{INC_DEC} ПЗ всех Дронов и размещаемых объектов на {VAL}',
  },
  {
    id: 'deployable_size',
    title: 'Размер всех Дронов и размещаемых объектов',
    detail: '{INC_DEC} Размер всех Дронов и размещаемых объектов на {VAL}',
  },
  {
    id: 'deployable_charges',
    title: 'Заряды всех Дронов и размещаемых объектов',
    detail: '{INC_DEC} заряды всех Дронов и размещаемых объектов на {VAL}',
  },
  {
    id: 'deployable_armor',
    title: 'Броня всех Дронов и размещаемых объектов',
    detail: '{INC_DEC} Броню всех Дронов и размещаемых объектов на {VAL}',
  },
  {
    id: 'deployable_evasion',
    title: 'Уклонение всех Дронов и размещаемых объектов',
    detail: '{INC_DEC} Уклонение всех Дронов и размещаемых объектов на {VAL}',
  },
  {
    id: 'deployable_edef',
    title: 'Э-Защита всех Дронов и размещаемых объектов',
    detail: '{INC_DEC} Э-Защиту всех Дронов и размещаемых объектов на {VAL}',
  },
  {
    id: 'deployable_heatcap',
    title: 'Тепловой Максимум всех Дронов и размещаемых объектов',
    detail: '{INC_DEC} Тепловой Максимум всех Дронов и размещаемых объектов на {VAL}',
  },
  {
    id: 'deployable_repcap',
    title: 'Лимит Ремонта всех Дронов и размещаемых объектов',
    detail: '{INC_DEC} Лимит Ремонта всех Дронов и размещаемых объектов на {VAL}',
  },
  {
    id: 'deployable_sensor_range',
    title: 'Дальность Сенсоров всех Дронов и размещаемых объектов',
    detail: '{INC_DEC} Дальность Сенсоров всех Дронов и размещаемых объектов на {VAL}',
  },
  {
    id: 'deployable_tech_attack',
    title: 'Техническая Атака всех Дронов и размещаемых объектов',
    detail: '{INC_DEC} Техническую Атаку всех Дронов и размещаемых объектов на {VAL}',
  },
  {
    id: 'deployable_save',
    title: 'Спасбросок Цели всех Дронов и размещаемых объектов',
    detail: '{INC_DEC} Спасбросок Цели всех Дронов и размещаемых объектов на {VAL}',
  },
  {
    id: 'deployable_speed',
    title: 'Скорость всех Дронов и размещаемых объектов',
    detail: '{INC_DEC} Скорость всех Дронов и размещаемых объектов {VAL}',
  },
  {
    id: 'drone_hp',
    title: 'ПЗ всех Дронов',
    detail: '{INC_DEC} ПЗ всех Дронов на {VAL}',
  },
  {
    id: 'drone_size',
    title: 'Размер всех Дронов',
    detail: '{INC_DEC} Размер всех Дронов на {VAL}',
  },
  {
    id: 'drone_charges',
    title: 'Заряды всех Дронов и размещаемых объектов',
    detail: '{INC_DEC} Заряды всех Дронов и размещаемых объектов на {VAL}',
  },
  {
    id: 'drone_armor',
    title: 'Броня всех Дронов',
    detail: '{INC_DEC} Броню всех Дронов на {VAL}',
  },
  {
    id: 'drone_evasion',
    title: 'Уклонение всех Дронов',
    detail: '{INC_DEC} Уклонение всех Дронов на {VAL}',
  },
  {
    id: 'drone_edef',
    title: 'Э-Защита всех Дронов',
    detail: '{INC_DEC} Э-Защиту всех Дронов на {VAL}',
  },
  {
    id: 'drone_heatcap',
    title: 'Тепловой Максимум всех Дронов',
    detail: '{INC_DEC} Тепловой Максимум всех Дронов на {VAL}',
  },
  {
    id: 'drone_repcap',
    title: 'Лимит Ремонта всех Дронов',
    detail: '{INC_DEC} Лимит Ремонта всех Дронов на {VAL}',
  },
  {
    id: 'drone_sensor_range',
    title: 'Дальность Сенсоров всех Дронов',
    detail: '{INC_DEC} Дальность Сенсоров всех Дронов на {VAL}',
  },
  {
    id: 'drone_tech_attack',
    title: 'Техническая Атака всех Дронов',
    detail: '{INC_DEC} Техническую Атаку всех Дронов на {VAL}',
  },
  {
    id: 'drone_save',
    title: 'Спасбросок Цели всех Дронов',
    detail: '{INC_DEC} Спасбросок Цели всех Дронов на {VAL}',
  },
  {
    id: 'drone_speed',
    title: 'Скорость всех Дронов',
    detail: '{INC_DEC} Скорость всех Дронов на {VAL}',
  },
]
