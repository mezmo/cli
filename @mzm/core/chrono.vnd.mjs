// deno-coverage-ignore-file
// deno-fmt-ignore-file
// deno-lint-ignore-file
// deno:https://esm.sh/chrono-node@2.9.0/denonext/chrono-node.mjs
// This code was bundled using `deno bundle` and it's not recommended to edit it manually
var Hm = Object.defineProperty
var H = (s8, e) => {
  for (var t in e) {
    Hm(s8, t, {
      get: e[t],
      enumerable: true,
    })
  }
}
var bo = {}
H(bo, {
  Chrono: () => g,
  GB: () => eu,
  Meridiem: () => u,
  ParsingComponents: () => c,
  ParsingResult: () => x,
  ReferenceWithTimezone: () => E,
  Weekday: () => y,
  casual: () => Yt,
  configuration: () => ts,
  parse: () => tu,
  parseDate: () => ru,
  strict: () => Us,
})
var u
;(function (s8) {
  s8[s8.AM = 0] = 'AM', s8[s8.PM = 1] = 'PM'
})(u || (u = {}))
var y
;(function (s8) {
  s8[s8.SUNDAY = 0] = 'SUNDAY',
    s8[s8.MONDAY = 1] = 'MONDAY',
    s8[s8.TUESDAY = 2] = 'TUESDAY',
    s8[s8.WEDNESDAY = 3] = 'WEDNESDAY',
    s8[s8.THURSDAY = 4] = 'THURSDAY',
    s8[s8.FRIDAY = 5] = 'FRIDAY',
    s8[s8.SATURDAY = 6] = 'SATURDAY'
})(y || (y = {}))
var K
;(function (s8) {
  s8[s8.JANUARY = 1] = 'JANUARY',
    s8[s8.FEBRUARY = 2] = 'FEBRUARY',
    s8[s8.MARCH = 3] = 'MARCH',
    s8[s8.APRIL = 4] = 'APRIL',
    s8[s8.MAY = 5] = 'MAY',
    s8[s8.JUNE = 6] = 'JUNE',
    s8[s8.JULY = 7] = 'JULY',
    s8[s8.AUGUST = 8] = 'AUGUST',
    s8[s8.SEPTEMBER = 9] = 'SEPTEMBER',
    s8[s8.OCTOBER = 10] = 'OCTOBER',
    s8[s8.NOVEMBER = 11] = 'NOVEMBER',
    s8[s8.DECEMBER = 12] = 'DECEMBER'
})(K || (K = {}))
function R(s8, e) {
  s8.assign('day', e.getDate()), s8.assign('month', e.getMonth() + 1), s8.assign('year', e.getFullYear())
}
function Hn(s8, e) {
  s8.assign('hour', e.getHours()),
    s8.assign('minute', e.getMinutes()),
    s8.assign('second', e.getSeconds()),
    s8.assign('millisecond', e.getMilliseconds()),
    s8.assign('meridiem', e.getHours() < 12 ? u.AM : u.PM)
}
function pe(s8, e) {
  s8.imply('day', e.getDate()), s8.imply('month', e.getMonth() + 1), s8.imply('year', e.getFullYear())
}
function O(s8, e) {
  s8.imply('hour', e.getHours()),
    s8.imply('minute', e.getMinutes()),
    s8.imply('second', e.getSeconds()),
    s8.imply('millisecond', e.getMilliseconds()),
    s8.imply('meridiem', e.getHours() < 12 ? u.AM : u.PM)
}
var qm = {
  ACDT: 630,
  ACST: 570,
  ADT: -180,
  AEDT: 660,
  AEST: 600,
  AFT: 270,
  AKDT: -480,
  AKST: -540,
  ALMT: 360,
  AMST: -180,
  AMT: -240,
  ANAST: 720,
  ANAT: 720,
  AQTT: 300,
  ART: -180,
  AST: -240,
  AWDT: 540,
  AWST: 480,
  AZOST: 0,
  AZOT: -60,
  AZST: 300,
  AZT: 240,
  BNT: 480,
  BOT: -240,
  BRST: -120,
  BRT: -180,
  BST: 60,
  BTT: 360,
  CAST: 480,
  CAT: 120,
  CCT: 390,
  CDT: -300,
  CEST: 120,
  CET: {
    timezoneOffsetDuringDst: 120,
    timezoneOffsetNonDst: 60,
    dstStart: (s8) => oo(s8, K.MARCH, y.SUNDAY, 2),
    dstEnd: (s8) => oo(s8, K.OCTOBER, y.SUNDAY, 3),
  },
  CHADT: 825,
  CHAST: 765,
  CKT: -600,
  CLST: -180,
  CLT: -240,
  COT: -300,
  CST: -360,
  CT: {
    timezoneOffsetDuringDst: -300,
    timezoneOffsetNonDst: -360,
    dstStart: (s8) => Te(s8, K.MARCH, y.SUNDAY, 2, 2),
    dstEnd: (s8) => Te(s8, K.NOVEMBER, y.SUNDAY, 1, 2),
  },
  CVT: -60,
  CXT: 420,
  ChST: 600,
  DAVT: 420,
  EASST: -300,
  EAST: -360,
  EAT: 180,
  ECT: -300,
  EDT: -240,
  EEST: 180,
  EET: 120,
  EGST: 0,
  EGT: -60,
  EST: -300,
  ET: {
    timezoneOffsetDuringDst: -240,
    timezoneOffsetNonDst: -300,
    dstStart: (s8) => Te(s8, K.MARCH, y.SUNDAY, 2, 2),
    dstEnd: (s8) => Te(s8, K.NOVEMBER, y.SUNDAY, 1, 2),
  },
  FJST: 780,
  FJT: 720,
  FKST: -180,
  FKT: -240,
  FNT: -120,
  GALT: -360,
  GAMT: -540,
  GET: 240,
  GFT: -180,
  GILT: 720,
  GMT: 0,
  GST: 240,
  GYT: -240,
  HAA: -180,
  HAC: -300,
  HADT: -540,
  HAE: -240,
  HAP: -420,
  HAR: -360,
  HAST: -600,
  HAT: -90,
  HAY: -480,
  HKT: 480,
  HLV: -210,
  HNA: -240,
  HNC: -360,
  HNE: -300,
  HNP: -480,
  HNR: -420,
  HNT: -150,
  HNY: -540,
  HOVT: 420,
  ICT: 420,
  IDT: 180,
  IOT: 360,
  IRDT: 270,
  IRKST: 540,
  IRKT: 540,
  IRST: 210,
  IST: 330,
  JST: 540,
  KGT: 360,
  KRAST: 480,
  KRAT: 480,
  KST: 540,
  KUYT: 240,
  LHDT: 660,
  LHST: 630,
  LINT: 840,
  MAGST: 720,
  MAGT: 720,
  MART: -510,
  MAWT: 300,
  MDT: -360,
  MESZ: 120,
  MEZ: 60,
  MHT: 720,
  MMT: 390,
  MSD: 240,
  MSK: 180,
  MST: -420,
  MT: {
    timezoneOffsetDuringDst: -360,
    timezoneOffsetNonDst: -420,
    dstStart: (s8) => Te(s8, K.MARCH, y.SUNDAY, 2, 2),
    dstEnd: (s8) => Te(s8, K.NOVEMBER, y.SUNDAY, 1, 2),
  },
  MUT: 240,
  MVT: 300,
  MYT: 480,
  NCT: 660,
  NDT: -90,
  NFT: 690,
  NOVST: 420,
  NOVT: 360,
  NPT: 345,
  NST: -150,
  NUT: -660,
  NZDT: 780,
  NZST: 720,
  OMSST: 420,
  OMST: 420,
  PDT: -420,
  PET: -300,
  PETST: 720,
  PETT: 720,
  PGT: 600,
  PHOT: 780,
  PHT: 480,
  PKT: 300,
  PMDT: -120,
  PMST: -180,
  PONT: 660,
  PST: -480,
  PT: {
    timezoneOffsetDuringDst: -420,
    timezoneOffsetNonDst: -480,
    dstStart: (s8) => Te(s8, K.MARCH, y.SUNDAY, 2, 2),
    dstEnd: (s8) => Te(s8, K.NOVEMBER, y.SUNDAY, 1, 2),
  },
  PWT: 540,
  PYST: -180,
  PYT: -240,
  RET: 240,
  SAMT: 240,
  SAST: 120,
  SBT: 660,
  SCT: 240,
  SGT: 480,
  SRT: -180,
  SST: -660,
  TAHT: -600,
  TFT: 300,
  TJT: 300,
  TKT: 780,
  TLT: 540,
  TMT: 300,
  TVT: 720,
  ULAT: 480,
  UTC: 0,
  UYST: -120,
  UYT: -180,
  UZT: 300,
  VET: -210,
  VLAST: 660,
  VLAT: 660,
  VUT: 660,
  WAST: 120,
  WAT: 60,
  WEST: 60,
  WESZ: 60,
  WET: 0,
  WEZ: 0,
  WFT: 720,
  WGST: -120,
  WGT: -180,
  WIB: 420,
  WIT: 540,
  WITA: 480,
  WST: 780,
  WT: 0,
  YAKST: 600,
  YAKT: 600,
  YAPT: 600,
  YEKST: 360,
  YEKT: 360,
}
function Te(s8, e, t, r, n = 0) {
  let i = 0, o = 0
  for (; o < r;) i++, new Date(s8, e - 1, i).getDay() === t && o++
  return new Date(s8, e - 1, i, n)
}
function oo(s8, e, t, r = 0) {
  let n = t === 0 ? 7 : t, i = new Date(s8, e - 1 + 1, 1, 12), o = i.getDay() === 0 ? 7 : i.getDay(), a
  return o === n ? a = 7 : o < n ? a = 7 + o - n : a = o - n,
    i.setDate(i.getDate() - a),
    new Date(s8, e - 1, i.getDate(), r)
}
function zn(s8, e, t = {}) {
  if (s8 == null) return null
  if (typeof s8 == 'number') return s8
  let r = t[s8] ?? qm[s8]
  return r == null
    ? null
    : typeof r == 'number'
    ? r
    : e == null
    ? null
    : e > r.dstStart(e.getFullYear()) && !(e > r.dstEnd(e.getFullYear()))
    ? r.timezoneOffsetDuringDst
    : r.timezoneOffsetNonDst
}
var ao = {
  day: 0,
  second: 0,
  millisecond: 0,
}
function w(s8, e) {
  let t = new Date(s8)
  if (
    e.y && (e.year = e.y, delete e.y),
      e.mo && (e.month = e.mo, delete e.mo),
      e.M && (e.month = e.M, delete e.M),
      e.w && (e.week = e.w, delete e.w),
      e.d && (e.day = e.d, delete e.d),
      e.h && (e.hour = e.h, delete e.h),
      e.m && (e.minute = e.m, delete e.m),
      e.s && (e.second = e.s, delete e.s),
      e.ms && (e.millisecond = e.ms, delete e.ms),
      'year' in e
  ) {
    let r = Math.floor(e.year)
    t.setFullYear(t.getFullYear() + r)
    let n = e.year - r
    n > 0 && (e.month = e?.month ?? 0, e.month += n * 12)
  }
  if ('quarter' in e) {
    let r = Math.floor(e.quarter)
    t.setMonth(t.getMonth() + r * 3)
  }
  if ('month' in e) {
    let r = Math.floor(e.month)
    t.setMonth(t.getMonth() + r)
    let n = e.month - r
    n > 0 && (e.week = e?.week ?? 0, e.week += n * 4)
  }
  if ('week' in e) {
    let r = Math.floor(e.week)
    t.setDate(t.getDate() + r * 7)
    let n = e.week - r
    n > 0 && (e.day = e?.day ?? 0, e.day += Math.round(n * 7))
  }
  if ('day' in e) {
    let r = Math.floor(e.day)
    t.setDate(t.getDate() + r)
    let n = e.day - r
    n > 0 && (e.hour = e?.hour ?? 0, e.hour += Math.round(n * 24))
  }
  if ('hour' in e) {
    let r = Math.floor(e.hour)
    t.setHours(t.getHours() + r)
    let n = e.hour - r
    n > 0 && (e.minute = e?.minute ?? 0, e.minute += Math.round(n * 60))
  }
  if ('minute' in e) {
    let r = Math.floor(e.minute)
    t.setMinutes(t.getMinutes() + r)
    let n = e.minute - r
    n > 0 && (e.second = e?.second ?? 0, e.second += Math.round(n * 60))
  }
  if ('second' in e) {
    let r = Math.floor(e.second)
    t.setSeconds(t.getSeconds() + r)
    let n = e.second - r
    n > 0 && (e.millisecond = e?.millisecond ?? 0, e.millisecond += Math.round(n * 1e3))
  }
  if ('millisecond' in e) {
    let r = Math.floor(e.millisecond)
    t.setMilliseconds(t.getMilliseconds() + r)
  }
  return t
}
function D(s8) {
  let e = {}
  for (let t in s8) e[t] = -s8[t]
  return e
}
var E = class s {
  instant
  timezoneOffset
  constructor(e, t) {
    this.instant = e ?? /* @__PURE__ */ new Date(), this.timezoneOffset = t ?? null
  }
  static fromDate(e) {
    return new s(e)
  }
  static fromInput(e, t) {
    if (e instanceof Date) return s.fromDate(e)
    let r = e?.instant ?? /* @__PURE__ */ new Date(), n = zn(e?.timezone, r, t)
    return new s(r, n)
  }
  getDateWithAdjustedTimezone() {
    let e = new Date(this.instant)
    return this.timezoneOffset !== null &&
      e.setMinutes(e.getMinutes() - this.getSystemTimezoneAdjustmentMinute(this.instant)),
      e
  }
  getSystemTimezoneAdjustmentMinute(e, t) {
    ;(!e || e.getTime() < 0) && (e = /* @__PURE__ */ new Date())
    let r = -e.getTimezoneOffset(), n = t ?? this.timezoneOffset ?? r
    return r - n
  }
  getTimezoneOffset() {
    return this.timezoneOffset ?? -this.instant.getTimezoneOffset()
  }
}
var c = class s2 {
  knownValues
  impliedValues
  reference
  _tags = /* @__PURE__ */ new Set()
  constructor(e, t) {
    if (this.reference = e, this.knownValues = {}, this.impliedValues = {}, t) {
      for (let n in t) this.knownValues[n] = t[n]
    }
    let r = e.getDateWithAdjustedTimezone()
    this.imply('day', r.getDate()),
      this.imply('month', r.getMonth() + 1),
      this.imply('year', r.getFullYear()),
      this.imply('hour', 12),
      this.imply('minute', 0),
      this.imply('second', 0),
      this.imply('millisecond', 0)
  }
  static createRelativeFromReference(e, t = ao) {
    let r = w(e.getDateWithAdjustedTimezone(), t), n = new s2(e)
    return n.addTag('result/relativeDate'),
      'hour' in t || 'minute' in t || 'second' in t || 'millisecond' in t
        ? (n.addTag('result/relativeDateAndTime'),
          Hn(n, r),
          R(n, r),
          n.assign('timezoneOffset', e.getTimezoneOffset()))
        : (O(n, r),
          n.imply('timezoneOffset', e.getTimezoneOffset()),
          'day' in t
            ? (n.assign('day', r.getDate()),
              n.assign('month', r.getMonth() + 1),
              n.assign('year', r.getFullYear()),
              n.assign('weekday', r.getDay()))
            : 'week' in t
            ? (n.assign('day', r.getDate()),
              n.assign('month', r.getMonth() + 1),
              n.assign('year', r.getFullYear()),
              n.imply('weekday', r.getDay()))
            : (n.imply('day', r.getDate()),
              'month' in t
                ? (n.assign('month', r.getMonth() + 1), n.assign('year', r.getFullYear()))
                : (n.imply('month', r.getMonth() + 1),
                  'year' in t ? n.assign('year', r.getFullYear()) : n.imply('year', r.getFullYear())))),
      n
  }
  get(e) {
    return e in this.knownValues
      ? this.knownValues[e]
      : e in this.impliedValues
      ? this.impliedValues[e]
      : null
  }
  isCertain(e) {
    return e in this.knownValues
  }
  getCertainComponents() {
    return Object.keys(this.knownValues)
  }
  imply(e, t) {
    return e in this.knownValues ? this : (this.impliedValues[e] = t, this)
  }
  assign(e, t) {
    return this.knownValues[e] = t, delete this.impliedValues[e], this
  }
  addDurationAsImplied(e) {
    let t = this.dateWithoutTimezoneAdjustment(), r = w(t, e)
    return ('day' in e || 'week' in e || 'month' in e || 'year' in e) && (this.delete([
      'day',
      'weekday',
      'month',
      'year',
    ]),
      this.imply('day', r.getDate()),
      this.imply('weekday', r.getDay()),
      this.imply('month', r.getMonth() + 1),
      this.imply('year', r.getFullYear())),
      ('second' in e || 'minute' in e || 'hour' in e) && (this.delete([
        'second',
        'minute',
        'hour',
      ]),
        this.imply('second', r.getSeconds()),
        this.imply('minute', r.getMinutes()),
        this.imply('hour', r.getHours())),
      this
  }
  delete(e) {
    typeof e == 'string' && (e = [
      e,
    ])
    for (let t of e) delete this.knownValues[t], delete this.impliedValues[t]
  }
  clone() {
    let e = new s2(this.reference)
    e.knownValues = {}, e.impliedValues = {}
    for (let t in this.knownValues) e.knownValues[t] = this.knownValues[t]
    for (let t in this.impliedValues) e.impliedValues[t] = this.impliedValues[t]
    return e
  }
  isOnlyDate() {
    return !this.isCertain('hour') && !this.isCertain('minute') && !this.isCertain('second')
  }
  isOnlyTime() {
    return !this.isCertain('weekday') && !this.isCertain('day') && !this.isCertain('month') &&
      !this.isCertain('year')
  }
  isOnlyWeekdayComponent() {
    return this.isCertain('weekday') && !this.isCertain('day') && !this.isCertain('month')
  }
  isDateWithUnknownYear() {
    return this.isCertain('month') && !this.isCertain('year')
  }
  isValidDate() {
    let e = this.dateWithoutTimezoneAdjustment()
    return !(e.getFullYear() !== this.get('year') || e.getMonth() !== this.get('month') - 1 ||
      e.getDate() !== this.get('day') || this.get('hour') != null && e.getHours() != this.get('hour') ||
      this.get('minute') != null && e.getMinutes() != this.get('minute'))
  }
  toString() {
    return `[ParsingComponents {
            tags: ${JSON.stringify(Array.from(this._tags).sort())}, 
            knownValues: ${JSON.stringify(this.knownValues)}, 
            impliedValues: ${JSON.stringify(this.impliedValues)}}, 
            reference: ${JSON.stringify(this.reference)}]`
  }
  date() {
    let e = this.dateWithoutTimezoneAdjustment(),
      t = this.reference.getSystemTimezoneAdjustmentMinute(e, this.get('timezoneOffset'))
    return new Date(e.getTime() + t * 6e4)
  }
  addTag(e) {
    return this._tags.add(e), this
  }
  addTags(e) {
    for (let t of e) this._tags.add(t)
    return this
  }
  tags() {
    return new Set(this._tags)
  }
  dateWithoutTimezoneAdjustment() {
    let e = new Date(
      this.get('year'),
      this.get('month') - 1,
      this.get('day'),
      this.get('hour'),
      this.get('minute'),
      this.get('second'),
      this.get('millisecond'),
    )
    return e.setFullYear(this.get('year')), e
  }
}
var x = class s3 {
  refDate
  index
  text
  reference
  start
  end
  constructor(e, t, r, n, i) {
    this.reference = e,
      this.refDate = e.instant,
      this.index = t,
      this.text = r,
      this.start = n || new c(e),
      this.end = i
  }
  clone() {
    let e = new s3(this.reference, this.index, this.text)
    return e.start = this.start ? this.start.clone() : null, e.end = this.end ? this.end.clone() : null, e
  }
  date() {
    return this.start.date()
  }
  addTag(e) {
    return this.start.addTag(e), this.end && this.end.addTag(e), this
  }
  addTags(e) {
    return this.start.addTags(e), this.end && this.end.addTags(e), this
  }
  tags() {
    let e = new Set(this.start.tags())
    if (this.end) { for (let t of this.end.tags()) e.add(t) }
    return e
  }
  toString() {
    let e = Array.from(this.tags()).sort()
    return `[ParsingResult {index: ${this.index}, text: '${this.text}', tags: ${JSON.stringify(e)} ...}]`
  }
}
function U(s8, e, t = '\\s{0,5},?\\s{0,5}') {
  let r = e.replace(/\((?!\?)/g, '(?:')
  return `${s8}${r}(?:${t}${r}){0,10}`
}
function Vm(s8) {
  let e
  return s8 instanceof Array
    ? e = [
      ...s8,
    ]
    : s8 instanceof Map
    ? e = Array.from(s8.keys())
    : e = Object.keys(s8),
    e
}
function p(s8) {
  return `(?:${Vm(s8).sort((t, r) => r.length - t.length).join('|').replace(/\./g, '\\.')})`
}
function S(s8) {
  return s8 < 100 && (s8 > 50 ? s8 = s8 + 1900 : s8 = s8 + 2e3), s8
}
function P(s8, e, t) {
  let r = new Date(s8)
  r.setMonth(t - 1), r.setDate(e)
  let n = w(r, {
      year: 1,
    }),
    i = w(r, {
      year: -1,
    })
  return Math.abs(n.getTime() - s8.getTime()) < Math.abs(r.getTime() - s8.getTime())
    ? r = n
    : Math.abs(i.getTime() - s8.getTime()) < Math.abs(r.getTime() - s8.getTime()) && (r = i),
    r.getFullYear()
}
var qn = {
  sunday: 0,
  sun: 0,
  'sun.': 0,
  monday: 1,
  mon: 1,
  'mon.': 1,
  tuesday: 2,
  tue: 2,
  'tue.': 2,
  wednesday: 3,
  wed: 3,
  'wed.': 3,
  thursday: 4,
  thurs: 4,
  'thurs.': 4,
  thur: 4,
  'thur.': 4,
  thu: 4,
  'thu.': 4,
  friday: 5,
  fri: 5,
  'fri.': 5,
  saturday: 6,
  sat: 6,
  'sat.': 6,
}
var Ms = {
  january: 1,
  february: 2,
  march: 3,
  april: 4,
  may: 5,
  june: 6,
  july: 7,
  august: 8,
  september: 9,
  october: 10,
  november: 11,
  december: 12,
}
var Z = {
  ...Ms,
  jan: 1,
  'jan.': 1,
  feb: 2,
  'feb.': 2,
  mar: 3,
  'mar.': 3,
  apr: 4,
  'apr.': 4,
  jun: 6,
  'jun.': 6,
  jul: 7,
  'jul.': 7,
  aug: 8,
  'aug.': 8,
  sep: 9,
  'sep.': 9,
  sept: 9,
  'sept.': 9,
  oct: 10,
  'oct.': 10,
  nov: 11,
  'nov.': 11,
  dec: 12,
  'dec.': 12,
}
var Ns = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
  ten: 10,
  eleven: 11,
  twelve: 12,
}
var _s = {
  first: 1,
  second: 2,
  third: 3,
  fourth: 4,
  fifth: 5,
  sixth: 6,
  seventh: 7,
  eighth: 8,
  ninth: 9,
  tenth: 10,
  eleventh: 11,
  twelfth: 12,
  thirteenth: 13,
  fourteenth: 14,
  fifteenth: 15,
  sixteenth: 16,
  seventeenth: 17,
  eighteenth: 18,
  nineteenth: 19,
  twentieth: 20,
  'twenty first': 21,
  'twenty-first': 21,
  'twenty second': 22,
  'twenty-second': 22,
  'twenty third': 23,
  'twenty-third': 23,
  'twenty fourth': 24,
  'twenty-fourth': 24,
  'twenty fifth': 25,
  'twenty-fifth': 25,
  'twenty sixth': 26,
  'twenty-sixth': 26,
  'twenty seventh': 27,
  'twenty-seventh': 27,
  'twenty eighth': 28,
  'twenty-eighth': 28,
  'twenty ninth': 29,
  'twenty-ninth': 29,
  thirtieth: 30,
  'thirty first': 31,
  'thirty-first': 31,
}
var fo = {
  second: 'second',
  seconds: 'second',
  minute: 'minute',
  minutes: 'minute',
  hour: 'hour',
  hours: 'hour',
  day: 'day',
  days: 'day',
  week: 'week',
  weeks: 'week',
  month: 'month',
  months: 'month',
  quarter: 'quarter',
  quarters: 'quarter',
  year: 'year',
  years: 'year',
}
var pt = {
  s: 'second',
  sec: 'second',
  second: 'second',
  seconds: 'second',
  m: 'minute',
  min: 'minute',
  mins: 'minute',
  minute: 'minute',
  minutes: 'minute',
  h: 'hour',
  hr: 'hour',
  hrs: 'hour',
  hour: 'hour',
  hours: 'hour',
  d: 'day',
  day: 'day',
  days: 'day',
  w: 'week',
  week: 'week',
  weeks: 'week',
  mo: 'month',
  mon: 'month',
  mos: 'month',
  month: 'month',
  months: 'month',
  qtr: 'quarter',
  quarter: 'quarter',
  quarters: 'quarter',
  y: 'year',
  yr: 'year',
  year: 'year',
  years: 'year',
  ...fo,
}
var uo = `(?:${
  p(Ns)
}|[0-9]+|[0-9]+\\.[0-9]+|half(?:\\s{0,2}an?)?|an?\\b(?:\\s{0,2}few)?|few|several|the|a?\\s{0,2}couple\\s{0,2}(?:of)?)`
function Km(s8) {
  let e = s8.toLowerCase()
  return Ns[e] !== void 0
    ? Ns[e]
    : e === 'a' || e === 'an' || e == 'the'
    ? 1
    : e.match(/few/)
    ? 3
    : e.match(/half/)
    ? 0.5
    : e.match(/couple/)
    ? 2
    : e.match(/several/)
    ? 7
    : parseFloat(e)
}
var Le = `(?:${p(_s)}|[0-9]{1,2}(?:st|nd|rd|th)?)`
function je(s8) {
  let e = s8.toLowerCase()
  return _s[e] !== void 0 ? _s[e] : (e = e.replace(/(?:st|nd|rd|th)$/i, ''), parseInt(e))
}
var ye = '(?:[1-9][0-9]{0,3}\\s{0,2}(?:BE|AD|BC|BCE|CE)|[1-2][0-9]{3}|[5-9][0-9]|2[0-5])'
function he(s8) {
  if (/BE/i.test(s8)) return s8 = s8.replace(/BE/i, ''), parseInt(s8) - 543
  if (/BCE?/i.test(s8)) return s8 = s8.replace(/BCE?/i, ''), -parseInt(s8)
  if (/(AD|CE)/i.test(s8)) return s8 = s8.replace(/(AD|CE)/i, ''), parseInt(s8)
  let e = parseInt(s8)
  return S(e)
}
var lo = `(${uo})\\s{0,3}(${p(pt)})`
var mo = new RegExp(lo, 'i')
var Xm = `(${uo})\\s{0,3}(${p(fo)})`
var co = '\\s{0,5},?(?:\\s*and)?\\s{0,5}'
var de = U('(?:(?:about|around)\\s{0,3})?', lo, co)
var Re = U('(?:(?:about|around)\\s{0,3})?', Xm, co)
function J(s8) {
  let e = {}, t = s8, r = mo.exec(t)
  for (; r;) Zm(e, r), t = t.substring(r[0].length).trim(), r = mo.exec(t)
  return Object.keys(e).length == 0 ? null : e
}
function Zm(s8, e) {
  if (e[0].match(/^[a-zA-Z]+$/)) return
  let t = Km(e[1]), r = pt[e[2].toLowerCase()]
  s8[r] = t
}
var f = class {
  innerPatternHasChange(e, t) {
    return this.innerPattern(e) !== t
  }
  patternLeftBoundary() {
    return '(\\W|^)'
  }
  cachedInnerPattern = null
  cachedPattern = null
  pattern(e) {
    return this.cachedInnerPattern && !this.innerPatternHasChange(e, this.cachedInnerPattern)
      ? this.cachedPattern
      : (this.cachedInnerPattern = this.innerPattern(e),
        this.cachedPattern = new RegExp(
          `${this.patternLeftBoundary()}${this.cachedInnerPattern.source}`,
          this.cachedInnerPattern.flags,
        ),
        this.cachedPattern)
  }
  extract(e, t) {
    let r = t[1] ?? ''
    t.index = t.index + r.length, t[0] = t[0].substring(r.length)
    for (let n = 2; n < t.length; n++) t[n - 1] = t[n]
    return this.innerExtract(e, t)
  }
}
var Jm = new RegExp(
  `(?:(?:within|in|for)\\s*)?(?:(?:about|around|roughly|approximately|just)\\s*(?:~\\s*)?)?(${de})(?=\\W|$)`,
  'i',
)
var Qm = new RegExp(
  `(?:within|in|for)\\s*(?:(?:about|around|roughly|approximately|just)\\s*(?:~\\s*)?)?(${de})(?=\\W|$)`,
  'i',
)
var ef = new RegExp(
  `(?:within|in|for)\\s*(?:(?:about|around|roughly|approximately|just)\\s*(?:~\\s*)?)?(${Re})(?=\\W|$)`,
  'i',
)
var dt = class extends f {
  strictMode
  constructor(e) {
    super(), this.strictMode = e
  }
  innerPattern(e) {
    return this.strictMode ? ef : e.option.forwardDate ? Jm : Qm
  }
  innerExtract(e, t) {
    if (t[0].match(/^for\s*the\s*\w+/)) return null
    let r = J(t[1])
    return r ? c.createRelativeFromReference(e.reference, r) : null
  }
}
var tf = new RegExp(
  `(?:on\\s{0,3})?(${Le})(?:\\s{0,3}(?:to|\\-|\\\u2013|until|through|till)?\\s{0,3}(${Le}))?(?:-|/|\\s{0,3}(?:of)?\\s{0,3})(${
    p(Z)
  })(?:(?:-|/|,?\\s{0,3})(${ye}(?!\\w)))?(?=\\W|$)`,
  'i',
)
var po = 1
var go = 2
var rf = 3
var To = 4
var gt = class extends f {
  innerPattern() {
    return tf
  }
  innerExtract(e, t) {
    let r = e.createParsingResult(t.index, t[0]), n = Z[t[rf].toLowerCase()], i = je(t[po])
    if (i > 31) return t.index = t.index + t[po].length, null
    if (r.start.assign('month', n), r.start.assign('day', i), t[To]) {
      let o = he(t[To])
      r.start.assign('year', o)
    } else {
      let o = P(e.refDate, i, n)
      r.start.imply('year', o)
    }
    if (t[go]) {
      let o = je(t[go])
      r.end = r.start.clone(), r.end.assign('day', o)
    }
    return r
  }
}
var nf = new RegExp(
  `(${
    p(Z)
  })(?:-|/|\\s*,?\\s*)(${Le})(?!\\s*(?:am|pm))\\s*(?:(?:to|\\-)\\s*(${Le})\\s*)?(?:(?:-|/|\\s*,\\s*|\\s+)(${ye}))?(?=\\W|$)(?!\\:\\d)`,
  'i',
)
var sf = 1
var yo = 2
var Os = 3
var Cs = 4
var Tt = class extends f {
  shouldSkipYearLikeDate
  constructor(e) {
    super(), this.shouldSkipYearLikeDate = e
  }
  innerPattern() {
    return nf
  }
  innerExtract(e, t) {
    let r = Z[t[sf].toLowerCase()], n = je(t[yo])
    if (n > 31 || this.shouldSkipYearLikeDate && !t[Os] && !t[Cs] && t[yo].match(/^2[0-5]$/)) return null
    let i = e.createParsingComponents({
      day: n,
      month: r,
    }).addTag('parser/ENMonthNameMiddleEndianParser')
    if (t[Cs]) {
      let m = he(t[Cs])
      i.assign('year', m)
    } else {
      let m = P(e.refDate, n, r)
      i.imply('year', m)
    }
    if (!t[Os]) return i
    let o = je(t[Os]), a = e.createParsingResult(t.index, t[0])
    return a.start = i, a.end = i.clone(), a.end.assign('day', o), a
  }
}
var of = new RegExp(
  `((?:in)\\s*)?(${p(Z)})\\s*(?:(?:,|-|of)?\\s*(${ye})?)?(?=[^\\s\\w]|\\s+[^0-9]|\\s+$|$)`,
  'i',
)
var af = 1
var mf = 2
var ho = 3
var yt = class extends f {
  innerPattern() {
    return of
  }
  innerExtract(e, t) {
    let r = t[mf].toLowerCase()
    if (t[0].length <= 3 && !Ms[r]) return null
    let n = e.createParsingResult(t.index + (t[af] || '').length, t.index + t[0].length)
    n.start.imply('day', 1), n.start.addTag('parser/ENMonthNameParser')
    let i = Z[r]
    if (n.start.assign('month', i), t[ho]) {
      let o = he(t[ho])
      n.start.assign('year', o)
    } else {
      let o = P(e.refDate, 1, i)
      n.start.imply('year', o)
    }
    return n
  }
}
var ff = new RegExp(`([0-9]{4})[-\\.\\/\\s](?:(${p(Z)})|([0-9]{1,2}))[-\\.\\/\\s]([0-9]{1,2})(?=\\W|$)`, 'i')
var uf = 1
var lf = 2
var Ro = 3
var cf = 4
var ht = class extends f {
  strictMonthDateOrder
  constructor(e) {
    super(), this.strictMonthDateOrder = e
  }
  innerPattern() {
    return ff
  }
  innerExtract(e, t) {
    let r = parseInt(t[uf]), n = parseInt(t[cf]), i = t[Ro] ? parseInt(t[Ro]) : Z[t[lf].toLowerCase()]
    if (i < 1 || i > 12) {
      if (this.strictMonthDateOrder) return null
      n >= 1 && n <= 12 && ([i, n] = [
        n,
        i,
      ])
    }
    return n < 1 || n > 31 ? null : {
      day: n,
      month: i,
      year: r,
    }
  }
}
var pf = new RegExp('([0-9]|0[1-9]|1[012])/([0-9]{4})', 'i')
var df = 1
var gf = 2
var Rt = class extends f {
  innerPattern() {
    return pf
  }
  innerExtract(e, t) {
    let r = parseInt(t[gf]), n = parseInt(t[df])
    return e.createParsingComponents().imply('day', 1).assign('month', n).assign('year', r)
  }
}
function Tf(s8, e, t, r) {
  return new RegExp(
    `${s8}${e}(\\d{1,4})(?:(?:\\.|:|\uFF1A)(\\d{1,2})(?:(?::|\uFF1A)(\\d{2})(?:\\.(\\d{1,6}))?)?)?(?:\\s*(a\\.m\\.|p\\.m\\.|am?|pm?))?${t}`,
    r,
  )
}
function yf(s8, e) {
  return new RegExp(
    `^(${s8})(\\d{1,4})(?:(?:\\.|\\:|\\\uFF1A)(\\d{1,2})(?:(?:\\.|\\:|\\\uFF1A)(\\d{1,2})(?:\\.(\\d{1,6}))?)?)?(?:\\s*(a\\.m\\.|p\\.m\\.|am?|pm?))?${e}`,
    'i',
  )
}
var Is = 2
var Ee = 3
var Vn = 4
var Kn = 5
var He = 6
var k = class {
  strictMode
  constructor(e = false) {
    this.strictMode = e
  }
  patternFlags() {
    return 'i'
  }
  primaryPatternLeftBoundary() {
    return '(^|\\s|T|\\b)'
  }
  primarySuffix() {
    return '(?!/)(?=\\W|$)'
  }
  followingSuffix() {
    return '(?!/)(?=\\W|$)'
  }
  pattern(e) {
    return this.getPrimaryTimePatternThroughCache()
  }
  extract(e, t) {
    let r = this.extractPrimaryTimeComponents(e, t)
    if (!r) return t[0].match(/^\d{4}/) ? (t.index += 4, null) : (t.index += t[0].length, null)
    let n = t.index + t[1].length, i = t[0].substring(t[1].length), o = e.createParsingResult(n, i, r)
    t.index += t[0].length
    let a = e.text.substring(t.index), l = this.getFollowingTimePatternThroughCache().exec(a)
    return i.match(/^\d{3,4}/) && l &&
        (l[0].match(/^\s*([+-])\s*\d{2,4}$/) || l[0].match(/^\s*([+-])\s*\d{2}\W\d{2}/))
      ? null
      : !l || l[0].match(/^\s*([+-])\s*\d{3,4}$/)
      ? this.checkAndReturnWithoutFollowingPattern(o)
      : (o.end = this.extractFollowingTimeComponents(e, l, o),
        o.end && (o.text += l[0]),
        this.checkAndReturnWithFollowingPattern(o))
  }
  extractPrimaryTimeComponents(e, t, r = false) {
    let n = e.createParsingComponents(), i = 0, o = null, a = parseInt(t[Is])
    if (a > 100) {
      if (t[Is].length == 4 && t[Ee] == null && !t[He] || this.strictMode || t[Ee] != null) return null
      i = a % 100, a = Math.floor(a / 100)
    }
    if (a > 24) return null
    if (t[Ee] != null) {
      if (t[Ee].length == 1 && !t[He]) return null
      i = parseInt(t[Ee])
    }
    if (i >= 60) return null
    if (a > 12 && (o = u.PM), t[He] != null) {
      if (a > 12) return null
      let m = t[He][0].toLowerCase()
      m == 'a' && (o = u.AM, a == 12 && (a = 0)), m == 'p' && (o = u.PM, a != 12 && (a += 12))
    }
    if (
      n.assign('hour', a),
        n.assign('minute', i),
        o !== null ? n.assign('meridiem', o) : a < 12 ? n.imply('meridiem', u.AM) : n.imply('meridiem', u.PM),
        t[Kn] != null
    ) {
      let m = parseInt(t[Kn].substring(0, 3))
      if (m >= 1e3) return null
      n.assign('millisecond', m)
    }
    if (t[Vn] != null) {
      let m = parseInt(t[Vn])
      if (m >= 60) return null
      n.assign('second', m)
    }
    return n
  }
  extractFollowingTimeComponents(e, t, r) {
    let n = e.createParsingComponents()
    if (t[Kn] != null) {
      let m = parseInt(t[Kn].substring(0, 3))
      if (m >= 1e3) return null
      n.assign('millisecond', m)
    }
    if (t[Vn] != null) {
      let m = parseInt(t[Vn])
      if (m >= 60) return null
      n.assign('second', m)
    }
    let i = parseInt(t[Is]), o = 0, a = -1
    if (
      t[Ee] != null ? o = parseInt(t[Ee]) : i > 100 && (o = i % 100, i = Math.floor(i / 100)),
        o >= 60 || i > 24
    ) return null
    if (i >= 12 && (a = u.PM), t[He] != null) {
      if (i > 12) return null
      let m = t[He][0].toLowerCase()
      m == 'a' && (a = u.AM, i == 12 && (i = 0, n.isCertain('day') || n.imply('day', n.get('day') + 1))),
        m == 'p' && (a = u.PM, i != 12 && (i += 12)),
        r.start.isCertain('meridiem') ||
        (a == u.AM
          ? (r.start.imply('meridiem', u.AM), r.start.get('hour') == 12 && r.start.assign('hour', 0))
          : (r.start.imply('meridiem', u.PM),
            r.start.get('hour') != 12 && r.start.assign('hour', r.start.get('hour') + 12)))
    }
    return n.assign('hour', i),
      n.assign('minute', o),
      a >= 0
        ? n.assign('meridiem', a)
        : r.start.isCertain('meridiem') && r.start.get('hour') > 12
        ? r.start.get('hour') - 12 > i
          ? n.imply('meridiem', u.AM)
          : i <= 12 && (n.assign('hour', i + 12), n.assign('meridiem', u.PM))
        : i > 12
        ? n.imply('meridiem', u.PM)
        : i <= 12 && n.imply('meridiem', u.AM),
      n.date().getTime() < r.start.date().getTime() && n.imply('day', n.get('day') + 1),
      n
  }
  checkAndReturnWithoutFollowingPattern(e) {
    if (e.text.match(/^\d$/) || e.text.match(/^\d\d\d+$/) || e.text.match(/\d[apAP]$/)) return null
    let t = e.text.match(/[^\d:.](\d[\d.]+)$/)
    if (t) {
      let r = t[1]
      if (this.strictMode || r.includes('.') && !r.match(/\d(\.\d{2})+$/) || parseInt(r) > 24) return null
    }
    return e
  }
  checkAndReturnWithFollowingPattern(e) {
    if (e.text.match(/^\d+-\d+$/)) return null
    let t = e.text.match(/[^\d:.](\d[\d.]+)\s*-\s*(\d[\d.]+)$/)
    if (t) {
      if (this.strictMode) return null
      let r = t[1], n = t[2]
      if (n.includes('.') && !n.match(/\d(\.\d{2})+$/)) return null
      let i = parseInt(n), o = parseInt(r)
      if (i > 24 || o > 24) return null
    }
    return e
  }
  cachedPrimaryPrefix = null
  cachedPrimarySuffix = null
  cachedPrimaryTimePattern = null
  getPrimaryTimePatternThroughCache() {
    let e = this.primaryPrefix(), t = this.primarySuffix()
    return this.cachedPrimaryPrefix === e && this.cachedPrimarySuffix === t
      ? this.cachedPrimaryTimePattern
      : (this.cachedPrimaryTimePattern = Tf(this.primaryPatternLeftBoundary(), e, t, this.patternFlags()),
        this.cachedPrimaryPrefix = e,
        this.cachedPrimarySuffix = t,
        this.cachedPrimaryTimePattern)
  }
  cachedFollowingPhase = null
  cachedFollowingSuffix = null
  cachedFollowingTimePatten = null
  getFollowingTimePatternThroughCache() {
    let e = this.followingPhase(), t = this.followingSuffix()
    return this.cachedFollowingPhase === e && this.cachedFollowingSuffix === t
      ? this.cachedFollowingTimePatten
      : (this.cachedFollowingTimePatten = yf(e, t),
        this.cachedFollowingPhase = e,
        this.cachedFollowingSuffix = t,
        this.cachedFollowingTimePatten)
  }
}
var Pt = class extends k {
  constructor(e) {
    super(e)
  }
  followingPhase() {
    return '\\s*(?:\\-|\\\u2013|\\~|\\\u301C|to|until|through|till|\\?)\\s*'
  }
  primaryPrefix() {
    return '(?:(?:at|from)\\s*)??'
  }
  primarySuffix() {
    return '(?:\\s*(?:o\\W*clock|at\\s*night|in\\s*the\\s*(?:morning|afternoon)))?(?!/)(?=\\W|$)'
  }
  extractPrimaryTimeComponents(e, t) {
    let r = super.extractPrimaryTimeComponents(e, t)
    if (!r) return r
    if (t[0].endsWith('night')) {
      let n = r.get('hour')
      n >= 6 && n < 12
        ? (r.assign('hour', r.get('hour') + 12), r.assign('meridiem', u.PM))
        : n < 6 && r.assign('meridiem', u.AM)
    }
    if (t[0].endsWith('afternoon')) {
      r.assign('meridiem', u.PM)
      let n = r.get('hour')
      n >= 0 && n <= 6 && r.assign('hour', r.get('hour') + 12)
    }
    return t[0].endsWith('morning') &&
      (r.assign('meridiem', u.AM), r.get('hour') < 12 && r.assign('hour', r.get('hour'))),
      r.addTag('parser/ENTimeExpressionParser')
  }
  extractFollowingTimeComponents(e, t, r) {
    let n = super.extractFollowingTimeComponents(e, t, r)
    return n && n.addTag('parser/ENTimeExpressionParser'), n
  }
}
var hf = new RegExp(`(${de})\\s{0,5}(?:ago|before|earlier)(?=\\W|$)`, 'i')
var Rf = new RegExp(`(${Re})\\s{0,5}(?:ago|before|earlier)(?=\\W|$)`, 'i')
var xt = class extends f {
  strictMode
  constructor(e) {
    super(), this.strictMode = e
  }
  innerPattern() {
    return this.strictMode ? Rf : hf
  }
  innerExtract(e, t) {
    let r = J(t[1])
    return r ? c.createRelativeFromReference(e.reference, D(r)) : null
  }
}
var Pf = new RegExp(`(${de})\\s{0,5}(?:later|after|from now|henceforth|forward|out)(?=(?:\\W|$))`, 'i')
var xf = new RegExp(`(${Re})\\s{0,5}(later|after|from now)(?=\\W|$)`, 'i')
var Ef = 1
var Et = class extends f {
  strictMode
  constructor(e) {
    super(), this.strictMode = e
  }
  innerPattern() {
    return this.strictMode ? xf : Pf
  }
  innerExtract(e, t) {
    let r = J(t[Ef])
    return r ? c.createRelativeFromReference(e.reference, r) : null
  }
}
var ze = class {
  refine(e, t) {
    return t.filter((r) => this.isValid(e, r))
  }
}
var B = class {
  refine(e, t) {
    if (t.length < 2) return t
    let r = [], n = t[0], i = null
    for (let o = 1; o < t.length; o++) {
      i = t[o]
      let a = e.text.substring(n.index + n.text.length, i.index)
      if (!this.shouldMergeResults(a, n, i, e)) r.push(n), n = i
      else {
        let m = n, l = i, d = this.mergeResults(a, m, l, e)
        e.debug(() => {
          console.log(`${this.constructor.name} merged ${m} and ${l} into ${d}`)
        }), n = d
      }
    }
    return n != null && r.push(n), r
  }
}
var _ = class extends B {
  shouldMergeResults(e, t, r) {
    return !t.end && !r.end && e.match(this.patternBetween()) != null
  }
  mergeResults(e, t, r) {
    if (
      !t.start.isOnlyWeekdayComponent() && !r.start.isOnlyWeekdayComponent() &&
      (r.start.getCertainComponents().forEach((i) => {
        t.start.isCertain(i) || t.start.imply(i, r.start.get(i))
      }),
        t.start.getCertainComponents().forEach((i) => {
          r.start.isCertain(i) || r.start.imply(i, t.start.get(i))
        })), t.start.date() > r.start.date()
    ) {
      let i = t.start.date(), o = r.start.date()
      r.start.isOnlyWeekdayComponent() && w(o, {
            day: 7,
          }) > i
        ? (o = w(o, {
          day: 7,
        }),
          r.start.imply('day', o.getDate()),
          r.start.imply('month', o.getMonth() + 1),
          r.start.imply('year', o.getFullYear()))
        : t.start.isOnlyWeekdayComponent() && w(i, {
              day: -7,
            }) < o
        ? (i = w(i, {
          day: -7,
        }),
          t.start.imply('day', i.getDate()),
          t.start.imply('month', i.getMonth() + 1),
          t.start.imply('year', i.getFullYear()))
        : r.start.isDateWithUnknownYear() && w(o, {
              year: 1,
            }) > i
        ? (o = w(o, {
          year: 1,
        }),
          r.start.imply('year', o.getFullYear()))
        : t.start.isDateWithUnknownYear() && w(i, {
              year: -1,
            }) < o
        ? (i = w(i, {
          year: -1,
        }),
          t.start.imply('year', i.getFullYear()))
        : [r, t] = [
          t,
          r,
        ]
    }
    let n = t.clone()
    return n.start = t.start,
      n.end = r.start,
      n.index = Math.min(t.index, r.index),
      t.index < r.index ? n.text = t.text + e + r.text : n.text = r.text + e + t.text,
      n
  }
}
var Dt = class extends _ {
  patternBetween() {
    return /^\s*(to|-|–|until|through|till)\s*$/i
  }
}
function bs(s8, e) {
  let t = s8.clone(), r = s8.start, n = e.start
  if (t.start = Po(r, n), s8.end != null || e.end != null) {
    let i = s8.end == null ? s8.start : s8.end, o = e.end == null ? e.start : e.end, a = Po(i, o)
    if (s8.end == null && a.date().getTime() < t.start.date().getTime()) {
      let m = new Date(a.date().getTime())
      m.setDate(m.getDate() + 1), a.isCertain('day') ? R(a, m) : pe(a, m)
    }
    t.end = a
  }
  return t
}
function Po(s8, e) {
  let t = s8.clone()
  return e.isCertain('hour')
    ? (t.assign('hour', e.get('hour')),
      t.assign('minute', e.get('minute')),
      e.isCertain('second')
        ? (t.assign('second', e.get('second')),
          e.isCertain('millisecond')
            ? t.assign('millisecond', e.get('millisecond'))
            : t.imply('millisecond', e.get('millisecond')))
        : (t.imply('second', e.get('second')), t.imply('millisecond', e.get('millisecond'))))
    : (t.imply('hour', e.get('hour')),
      t.imply('minute', e.get('minute')),
      t.imply('second', e.get('second')),
      t.imply('millisecond', e.get('millisecond'))),
    e.isCertain('timezoneOffset') && t.assign('timezoneOffset', e.get('timezoneOffset')),
    e.isCertain('meridiem')
      ? t.assign('meridiem', e.get('meridiem'))
      : e.get('meridiem') != null && t.get('meridiem') == null && t.imply('meridiem', e.get('meridiem')),
    t.get('meridiem') == u.PM && t.get('hour') < 12 &&
    (e.isCertain('hour') ? t.assign('hour', t.get('hour') + 12) : t.imply('hour', t.get('hour') + 12)),
    t.addTags(s8.tags()),
    t.addTags(e.tags()),
    t
}
var M = class extends B {
  shouldMergeResults(e, t, r) {
    return (t.start.isOnlyDate() && r.start.isOnlyTime() || r.start.isOnlyDate() && t.start.isOnlyTime()) &&
      e.match(this.patternBetween()) != null
  }
  mergeResults(e, t, r) {
    let n = t.start.isOnlyDate() ? bs(t, r) : bs(r, t)
    return n.index = t.index, n.text = t.text + e + r.text, n
  }
}
var qe = class extends M {
  patternBetween() {
    return new RegExp('^\\s*(T|at|after|before|on|of|,|-|\\.|\u2219|:)?\\s*$')
  }
}
var Df = new RegExp('^\\s*,?\\s*\\(?([A-Z]{2,4})\\)?(?=\\W|$)', 'i')
var At = class {
  timezoneOverrides
  constructor(e) {
    this.timezoneOverrides = e
  }
  refine(e, t) {
    let r = e.option.timezones ?? {}
    return t.forEach((n) => {
      let i = e.text.substring(n.index + n.text.length), o = Df.exec(i)
      if (!o) return
      let a = o[1].toUpperCase(),
        m = n.start.date() ?? n.refDate ?? /* @__PURE__ */ new Date(),
        l = {
          ...this.timezoneOverrides,
          ...r,
        },
        d = zn(a, m, l)
      if (d == null) return
      e.debug(() => {
        console.log(`Extracting timezone: '${a}' into: ${d} for: ${n.start}`)
      })
      let T = n.start.get('timezoneOffset')
      T !== null && d != T && (n.start.isCertain('timezoneOffset') || a != o[1]) ||
        n.start.isOnlyDate() && a != o[1] ||
        (n.text += o[0],
          n.start.isCertain('timezoneOffset') || n.start.assign('timezoneOffset', d),
          n.end != null && !n.end.isCertain('timezoneOffset') && n.end.assign('timezoneOffset', d))
    }),
      t
  }
}
var Af = new RegExp('^\\s*(?:\\(?(?:GMT|UTC)\\s?)?([+-])(\\d{1,2})(?::?(\\d{2}))?\\)?', 'i')
var wf = 1
var Nf = 2
var _f = 3
var oe = class {
  refine(e, t) {
    return t.forEach(function (r) {
      if (r.start.isCertain('timezoneOffset')) return
      let n = e.text.substring(r.index + r.text.length), i = Af.exec(n)
      if (!i) return
      e.debug(() => {
        console.log(`Extracting timezone: '${i[0]}' into : ${r}`)
      })
      let o = parseInt(i[Nf]), a = parseInt(i[_f] || '0'), m = o * 60 + a
      m > 840 ||
        (i[wf] === '-' && (m = -m),
          r.end != null && r.end.assign('timezoneOffset', m),
          r.start.assign('timezoneOffset', m),
          r.text += i[0])
    }),
      t
  }
}
var Pe = class {
  refine(e, t) {
    if (t.length < 2) return t
    let r = [], n = t[0]
    for (let i = 1; i < t.length; i++) {
      let o = t[i]
      if (o.index >= n.index + n.text.length) {
        r.push(n), n = o
        continue
      }
      let a = null, m = null
      o.text.length > n.text.length ? (a = o, m = n) : (a = n, m = o),
        e.debug(() => {
          console.log(`${this.constructor.name} remove ${m} by ${a}`)
        }),
        n = a
    }
    return n != null && r.push(n), r
  }
}
var wt = class {
  refine(e, t) {
    return e.option.forwardDate && t.forEach((r) => {
      let n = e.reference.getDateWithAdjustedTimezone()
      if (r.start.isOnlyTime() && e.reference.instant > r.start.date()) {
        let i = e.reference.getDateWithAdjustedTimezone(), o = new Date(i)
        o.setDate(o.getDate() + 1),
          pe(r.start, o),
          e.debug(() => {
            console.log(
              `${this.constructor.name} adjusted ${r} time from the ref date (${i}) to the following day (${o})`,
            )
          }),
          r.end && r.end.isOnlyTime() &&
          (pe(r.end, o), r.start.date() > r.end.date() && (o.setDate(o.getDate() + 1), pe(r.end, o)))
      }
      if (r.start.isOnlyWeekdayComponent() && n > r.start.date()) {
        let i = r.start.get('weekday') - n.getDay()
        if (
          i <= 0 && (i += 7),
            n = w(n, {
              day: i,
            }),
            pe(r.start, n),
            e.debug(() => {
              console.log(`${this.constructor.name} adjusted ${r} weekday (${r.start})`)
            }),
            r.end && r.end.isOnlyWeekdayComponent()
        ) {
          let o = r.end.get('weekday') - n.getDay()
          o <= 0 && (o += 7),
            n = w(n, {
              day: o,
            }),
            pe(r.end, n),
            e.debug(() => {
              console.log(`${this.constructor.name} adjusted ${r} weekday (${r.end})`)
            })
        }
      }
      if (r.start.isDateWithUnknownYear() && n > r.start.date()) {
        for (let i = 0; i < 3 && n > r.start.date(); i++) {
          r.start.imply('year', r.start.get('year') + 1),
            e.debug(() => {
              console.log(`${this.constructor.name} adjusted ${r} year (${r.start})`)
            }),
            r.end && !r.end.isCertain('year') && (r.end.imply('year', r.end.get('year') + 1),
              e.debug(() => {
                console.log(`${this.constructor.name} adjusted ${r} month (${r.start})`)
              }))
        }
      }
    }),
      t
  }
}
var Nt = class extends ze {
  strictMode
  constructor(e) {
    super(), this.strictMode = e
  }
  isValid(e, t) {
    return t.text.replace(' ', '').match(/^\d*(\.\d*)?$/)
      ? (e.debug(() => {
        console.log(`Removing unlikely result '${t.text}'`)
      }),
        false)
      : t.start.isValidDate()
      ? t.end && !t.end.isValidDate()
        ? (e.debug(() => {
          console.log(`Removing invalid result: ${t} (${t.end})`)
        }),
          false)
        : this.strictMode
        ? this.isStrictModeValid(e, t)
        : true
      : (e.debug(() => {
        console.log(`Removing invalid result: ${t} (${t.start})`)
      }),
        false)
  }
  isStrictModeValid(e, t) {
    return t.start.isOnlyWeekdayComponent()
      ? (e.debug(() => {
        console.log(`(Strict) Removing weekday only component: ${t} (${t.end})`)
      }),
        false)
      : true
  }
}
var Mf = new RegExp(
  '([0-9]{4})\\-([0-9]{1,2})\\-([0-9]{1,2})(?:T([0-9]{1,2}):([0-9]{1,2})(?::([0-9]{1,2})(?:\\.(\\d{1,4}))?)?(Z|([+-]\\d{2}):?(\\d{2})?)?)?(?=\\W|$)',
  'i',
)
var Of = 1
var Cf = 2
var If = 3
var xo = 4
var bf = 5
var Eo = 6
var Do = 7
var Wf = 8
var Ao = 9
var wo = 10
var ae = class extends f {
  innerPattern() {
    return Mf
  }
  innerExtract(e, t) {
    let r = e.createParsingComponents({
      year: parseInt(t[Of]),
      month: parseInt(t[Cf]),
      day: parseInt(t[If]),
    })
    if (
      t[xo] != null &&
      (r.assign('hour', parseInt(t[xo])),
        r.assign('minute', parseInt(t[bf])),
        t[Eo] != null && r.assign('second', parseInt(t[Eo])),
        t[Do] != null && r.assign('millisecond', parseInt(t[Do])),
        t[Wf] != null)
    ) {
      let n = 0
      if (t[Ao]) {
        let i = parseInt(t[Ao]), o = 0
        t[wo] != null && (o = parseInt(t[wo])), n = i * 60, n < 0 ? n -= o : n += o
      }
      r.assign('timezoneOffset', n)
    }
    return r.addTag('parser/ISOFormatParser')
  }
}
var De = class extends B {
  mergeResults(e, t, r) {
    let n = r.clone()
    return n.index = t.index,
      n.text = t.text + e + n.text,
      n.start.assign('weekday', t.start.get('weekday')),
      n.end && n.end.assign('weekday', t.start.get('weekday')),
      n
  }
  shouldMergeResults(e, t, r) {
    return t.start.isOnlyWeekdayComponent() && !t.start.isCertain('hour') && r.start.isCertain('day') &&
      e.match(/^,?\s*$/) != null
  }
}
function N(s8, e = false) {
  return s8.parsers.unshift(new ae()),
    s8.refiners.unshift(new De()),
    s8.refiners.unshift(new oe()),
    s8.refiners.unshift(new Pe()),
    s8.refiners.push(new At()),
    s8.refiners.push(new Pe()),
    s8.refiners.push(new wt()),
    s8.refiners.push(new Nt(e)),
    s8
}
function Y(s8) {
  let e = s8.getDateWithAdjustedTimezone(), t = new c(s8, {})
  return R(t, e),
    Hn(t, e),
    t.assign('timezoneOffset', s8.getTimezoneOffset()),
    t.addTag('casualReference/now'),
    t
}
function W(s8) {
  let e = s8.getDateWithAdjustedTimezone(), t = new c(s8, {})
  return R(t, e), O(t, e), t.delete('meridiem'), t.addTag('casualReference/today'), t
}
function $(s8) {
  return Ae(s8, 1).addTag('casualReference/yesterday')
}
function F(s8) {
  return fe(s8, 1).addTag('casualReference/tomorrow')
}
function Ae(s8, e) {
  return fe(s8, -e)
}
function fe(s8, e) {
  let t = s8.getDateWithAdjustedTimezone(), r = new c(s8, {}), n = new Date(t.getTime())
  return n.setDate(n.getDate() + e), R(r, n), O(r, n), r.delete('meridiem'), r
}
function Xn(s8, e = 22) {
  let t = s8.getDateWithAdjustedTimezone(), r = new c(s8, {})
  return R(r, t), r.imply('hour', e), r.imply('meridiem', u.PM), r.addTag('casualReference/tonight'), r
}
function Zn(s8, e = 0) {
  let t = s8.getDateWithAdjustedTimezone(), r = new c(s8, {})
  return t.getHours() < 6 && (t = new Date(t.getTime() - 1440 * 60 * 1e3)), R(r, t), r.imply('hour', e), r
}
function Ve(s8, e = 20) {
  let t = new c(s8, {})
  return t.imply('meridiem', u.PM), t.imply('hour', e), t.addTag('casualReference/evening'), t
}
function Jn(s8, e = 20) {
  let t = s8.getDateWithAdjustedTimezone(), r = new c(s8, {})
  return t = new Date(t.getTime() - 1440 * 60 * 1e3),
    R(r, t),
    r.imply('hour', e),
    r.imply('meridiem', u.PM),
    r.addTag('casualReference/yesterday'),
    r.addTag('casualReference/evening'),
    r
}
function we(s8) {
  let e = new c(s8, {})
  return s8.getDateWithAdjustedTimezone().getHours() > 2 && e.addDurationAsImplied({
    day: 1,
  }),
    e.assign('hour', 0),
    e.imply('minute', 0),
    e.imply('second', 0),
    e.imply('millisecond', 0),
    e.addTag('casualReference/midnight'),
    e
}
function Ke(s8, e = 6) {
  let t = new c(s8, {})
  return t.imply('meridiem', u.AM),
    t.imply('hour', e),
    t.imply('minute', 0),
    t.imply('second', 0),
    t.imply('millisecond', 0),
    t.addTag('casualReference/morning'),
    t
}
function No(s8, e = 15) {
  let t = new c(s8, {})
  return t.imply('meridiem', u.PM),
    t.imply('hour', e),
    t.imply('minute', 0),
    t.imply('second', 0),
    t.imply('millisecond', 0),
    t.addTag('casualReference/afternoon'),
    t
}
function Xe(s8) {
  let e = new c(s8, {})
  return e.imply('meridiem', u.AM),
    e.assign('hour', 12),
    e.imply('minute', 0),
    e.imply('second', 0),
    e.imply('millisecond', 0),
    e.addTag('casualReference/noon'),
    e
}
var Uf = /(now|today|tonight|tomorrow|overmorrow|tmr|tmrw|yesterday|last\s*night)(?=\W|$)/i
var _t = class extends f {
  innerPattern(e) {
    return Uf
  }
  innerExtract(e, t) {
    let r = e.refDate, n = t[0].toLowerCase(), i = e.createParsingComponents()
    switch (n) {
      case 'now':
        i = Y(e.reference)
        break
      case 'today':
        i = W(e.reference)
        break
      case 'yesterday':
        i = $(e.reference)
        break
      case 'tomorrow':
      case 'tmr':
      case 'tmrw':
        i = F(e.reference)
        break
      case 'tonight':
        i = Xn(e.reference)
        break
      case 'overmorrow':
        i = fe(e.reference, 2)
        break
      default:
        if (n.match(/last\s*night/)) {
          if (r.getHours() > 6) {
            let o = new Date(r.getTime())
            o.setDate(o.getDate() - 1), r = o
          }
          R(i, r), i.imply('hour', 0)
        }
        break
    }
    return i.addTag('parser/ENCasualDateParser'), i
  }
}
var kf = /(?:this)?\s{0,3}(morning|afternoon|evening|night|midnight|midday|noon)(?=\W|$)/i
var Mt = class extends f {
  innerPattern() {
    return kf
  }
  innerExtract(e, t) {
    let r = null
    switch (t[1].toLowerCase()) {
      case 'afternoon':
        r = No(e.reference)
        break
      case 'evening':
      case 'night':
        r = Ve(e.reference)
        break
      case 'midnight':
        r = we(e.reference)
        break
      case 'morning':
        r = Ke(e.reference)
        break
      case 'noon':
      case 'midday':
        r = Xe(e.reference)
        break
    }
    return r && r.addTag('parser/ENCasualTimeParser'), r
  }
}
function I(s8, e, t) {
  let r = s8.getDateWithAdjustedTimezone(), n = Yf(r, e, t), i = new c(s8)
  return i = i.addDurationAsImplied({
    day: n,
  }),
    i.assign('weekday', e),
    i
}
function Yf(s8, e, t) {
  let r = s8.getDay()
  switch (t) {
    case 'this':
      return Qn(s8, e)
    case 'last':
      return _o(s8, e)
    case 'next':
      return r == y.SUNDAY
        ? e == y.SUNDAY ? 7 : e
        : r == y.SATURDAY
        ? e == y.SATURDAY ? 7 : e == y.SUNDAY ? 8 : 1 + e
        : e < r && e != y.SUNDAY
        ? Qn(s8, e)
        : Qn(s8, e) + 7
  }
  return Sf(s8, e)
}
function Sf(s8, e) {
  let t = _o(s8, e), r = Qn(s8, e)
  return r < -t ? r : t
}
function Qn(s8, e) {
  let t = s8.getDay(), r = e - t
  return r < 0 && (r += 7), r
}
function _o(s8, e) {
  let t = s8.getDay(), r = e - t
  return r >= 0 && (r -= 7), r
}
var $f = new RegExp(
  `(?:(?:\\,|\\(|\\\uFF08)\\s*)?(?:on\\s*?)?(?:(this|last|past|next)\\s*)?(${
    p(qn)
  }|weekend|weekday)(?:\\s*(?:\\,|\\)|\\\uFF09))?(?:\\s*(this|last|past|next)\\s*week)?(?=\\W|$)`,
  'i',
)
var Ff = 1
var Gf = 2
var vf = 3
var Ot = class extends f {
  innerPattern() {
    return $f
  }
  innerExtract(e, t) {
    let r = t[Ff], n = t[vf], i = r || n
    i = i || '', i = i.toLowerCase()
    let o = null
    i == 'last' || i == 'past' ? o = 'last' : i == 'next' ? o = 'next' : i == 'this' && (o = 'this')
    let a = t[Gf].toLowerCase(), m
    if (qn[a] !== void 0) m = qn[a]
    else if (a == 'weekend') m = o == 'last' ? y.SUNDAY : y.SATURDAY
    else if (a == 'weekday') {
      let l = e.reference.getDateWithAdjustedTimezone().getDay()
      l == y.SUNDAY || l == y.SATURDAY
        ? m = o == 'last' ? y.FRIDAY : y.MONDAY
        : (m = l - 1, m = o == 'last' ? m - 1 : m + 1, m = m % 5 + 1)
    } else return null
    return I(e.reference, m, o)
  }
}
var Bf = new RegExp(`(this|last|past|next|after\\s*this)\\s*(${p(pt)})(?=\\s*)(?=\\W|$)`, 'i')
var Lf = 1
var jf = 2
var Ct = class extends f {
  innerPattern() {
    return Bf
  }
  innerExtract(e, t) {
    let r = t[Lf].toLowerCase(), n = t[jf].toLowerCase(), i = pt[n]
    if (r == 'next' || r.startsWith('after')) {
      let m = {}
      return m[i] = 1, c.createRelativeFromReference(e.reference, m)
    }
    if (r == 'last' || r == 'past') {
      let m = {}
      return m[i] = -1, c.createRelativeFromReference(e.reference, m)
    }
    let o = e.createParsingComponents(), a = new Date(e.reference.instant.getTime())
    return n.match(/week/i)
      ? (a.setDate(a.getDate() - a.getDay()),
        o.imply('day', a.getDate()),
        o.imply('month', a.getMonth() + 1),
        o.imply('year', a.getFullYear()))
      : n.match(/month/i)
      ? (a.setDate(1),
        o.imply('day', a.getDate()),
        o.assign('year', a.getFullYear()),
        o.assign('month', a.getMonth() + 1))
      : n.match(/year/i) &&
        (a.setDate(1),
          a.setMonth(0),
          o.imply('day', a.getDate()),
          o.imply('month', a.getMonth() + 1),
          o.assign('year', a.getFullYear())),
      o
  }
}
var Hf = new RegExp(
  '([^\\d]|^)([0-3]{0,1}[0-9]{1})[\\/\\.\\-]([0-3]{0,1}[0-9]{1})(?:[\\/\\.\\-]([0-9]{4}|[0-9]{2}))?(\\W|$)',
  'i',
)
var zf = 1
var qf = 5
var Mo = 2
var Oo = 3
var Ws = 4
var b = class {
  groupNumberMonth
  groupNumberDay
  constructor(e) {
    this.groupNumberMonth = e ? Oo : Mo, this.groupNumberDay = e ? Mo : Oo
  }
  pattern() {
    return Hf
  }
  extract(e, t) {
    let r = t.index + t[zf].length, n = t.index + t[0].length - t[qf].length
    if (
      r > 0 && e.text.substring(0, r).match('\\d/?$') ||
      n < e.text.length && e.text.substring(n).match('^/?\\d')
    ) return
    let i = e.text.substring(r, n)
    if (i.match(/^\d\.\d$/) || i.match(/^\d\.\d{1,2}\.\d{1,2}\s*$/) || !t[Ws] && i.indexOf('/') < 0) return
    let o = e.createParsingResult(r, i),
      a = parseInt(t[this.groupNumberMonth]),
      m = parseInt(t[this.groupNumberDay])
    if ((a < 1 || a > 12) && a > 12) {
      if (m >= 1 && m <= 12 && a <= 31) {
        ;[m, a] = [
          a,
          m,
        ]
      } else return null
    }
    if (m < 1 || m > 31) return null
    if (o.start.assign('day', m), o.start.assign('month', a), t[Ws]) {
      let l = parseInt(t[Ws]), d = S(l)
      o.start.assign('year', d)
    } else {
      let l = P(e.refDate, m, a)
      o.start.imply('year', l)
    }
    return o.addTag('parser/SlashDateFormatParser')
  }
}
var Vf = new RegExp(`(this|last|past|next|after|\\+|-)\\s*(${de})(?=\\W|$)`, 'i')
var Kf = new RegExp(`(this|last|past|next|after|\\+|-)\\s*(${Re})(?=\\W|$)`, 'i')
var It = class extends f {
  allowAbbreviations
  constructor(e = true) {
    super(), this.allowAbbreviations = e
  }
  innerPattern() {
    return this.allowAbbreviations ? Vf : Kf
  }
  innerExtract(e, t) {
    let r = t[1].toLowerCase(), n = J(t[2])
    if (!n) return null
    switch (r) {
      case 'last':
      case 'past':
      case '-':
        n = D(n)
        break
    }
    return c.createRelativeFromReference(e.reference, n)
  }
}
function Xf(s8) {
  return s8.text.match(/^[+-]/i) != null
}
function Co(s8) {
  return s8.text.match(/^-/i) != null
}
var bt = class extends B {
  shouldMergeResults(e, t, r) {
    return e.match(/^\s*$/i) ? Xf(r) || Co(r) : false
  }
  mergeResults(e, t, r, n) {
    let i = J(r.text)
    Co(r) && (i = D(i))
    let o = c.createRelativeFromReference(E.fromDate(t.start.date()), i)
    return new x(t.reference, t.index, `${t.text}${e}${r.text}`, o)
  }
}
function Io(s8) {
  return s8.text.match(/\s+(before|from)$/i) != null
}
function Zf(s8) {
  return s8.text.match(/\s+(after|since)$/i) != null
}
var Wt = class extends B {
  patternBetween() {
    return /^\s*$/i
  }
  shouldMergeResults(e, t, r) {
    return !e.match(this.patternBetween()) || !Io(t) && !Zf(t)
      ? false
      : !!r.start.get('day') && !!r.start.get('month') && !!r.start.get('year')
  }
  mergeResults(e, t, r) {
    let n = J(t.text)
    Io(t) && (n = D(n))
    let i = c.createRelativeFromReference(E.fromDate(r.start.date()), n)
    return new x(r.reference, t.index, `${t.text}${e}${r.text}`, i)
  }
}
var Jf = new RegExp(`^\\s*(${ye})`, 'i')
var Qf = 1
var Ut = class {
  refine(e, t) {
    return t.forEach(function (r) {
      if (!r.start.isDateWithUnknownYear()) return
      let n = e.text.substring(r.index + r.text.length), i = Jf.exec(n)
      if (!i || i[0].trim().length <= 3) return
      e.debug(() => {
        console.log(`Extracting year: '${i[0]}' into : ${r}`)
      })
      let o = he(i[Qf])
      r.end != null && r.end.assign('year', o), r.start.assign('year', o), r.text += i[0]
    }),
      t
  }
}
var kt = class extends ze {
  constructor() {
    super()
  }
  isValid(e, t) {
    let r = t.text.trim()
    return r === e.text.trim()
      ? true
      : r.toLowerCase() === 'may' && !e.text.substring(0, t.index).trim().match(/\b(in)$/i)
      ? (e.debug(() => {
        console.log(`Removing unlikely result: ${t}`)
      }),
        false)
      : r.toLowerCase().endsWith('the second')
      ? (e.text.substring(t.index + t.text.length).trim().length > 0 && e.debug(() => {
        console.log(`Removing unlikely result: ${t}`)
      }),
        false)
      : true
  }
}
var Ne = class {
  createCasualConfiguration(e = false) {
    let t = this.createConfiguration(false, e)
    return t.parsers.push(new _t()),
      t.parsers.push(new Mt()),
      t.parsers.push(new yt()),
      t.parsers.push(new Ct()),
      t.parsers.push(new It()),
      t.refiners.push(new kt()),
      t
  }
  createConfiguration(e = true, t = false) {
    let r = N({
      parsers: [
        new b(t),
        new dt(e),
        new gt(),
        new Tt(t),
        new Ot(),
        new Rt(),
        new Pt(e),
        new xt(e),
        new Et(e),
      ],
      refiners: [
        new qe(),
      ],
    }, e)
    return r.parsers.unshift(new ht(e)),
      r.refiners.unshift(new Wt()),
      r.refiners.unshift(new bt()),
      r.refiners.unshift(new Pe()),
      r.refiners.push(new qe()),
      r.refiners.push(new Ut()),
      r.refiners.push(new Dt()),
      r
  }
}
var g = class s4 {
  parsers
  refiners
  defaultConfig = new Ne()
  constructor(e) {
    e = e || this.defaultConfig.createCasualConfiguration(),
      this.parsers = [
        ...e.parsers,
      ],
      this.refiners = [
        ...e.refiners,
      ]
  }
  clone() {
    return new s4({
      parsers: [
        ...this.parsers,
      ],
      refiners: [
        ...this.refiners,
      ],
    })
  }
  parseDate(e, t, r) {
    let n = this.parse(e, t, r)
    return n.length > 0 ? n[0].start.date() : null
  }
  parse(e, t, r) {
    let n = new es(e, t, r), i = []
    return this.parsers.forEach((o) => {
      let a = s4.executeParser(n, o)
      i = i.concat(a)
    }),
      i.sort((o, a) => o.index - a.index),
      this.refiners.forEach(function (o) {
        i = o.refine(n, i)
      }),
      i
  }
  static executeParser(e, t) {
    let r = [], n = t.pattern(e), i = e.text, o = e.text, a = n.exec(o)
    for (; a;) {
      let m = a.index + i.length - o.length
      a.index = m
      let l = t.extract(e, a)
      if (!l) {
        o = i.substring(a.index + 1), a = n.exec(o)
        continue
      }
      let d = null
      l instanceof x
        ? d = l
        : l instanceof c
        ? (d = e.createParsingResult(a.index, a[0]), d.start = l)
        : d = e.createParsingResult(a.index, a[0], l)
      let T = d.index, jn = d.text
      e.debug(() => console.log(`${t.constructor.name} extracted (at index=${T}) '${jn}'`)),
        r.push(d),
        o = i.substring(T + jn.length),
        a = n.exec(o)
    }
    return r
  }
}
var es = class {
  text
  option
  reference
  refDate
  constructor(e, t, r) {
    this.text = e,
      this.option = r ?? {},
      this.reference = E.fromInput(t, this.option.timezones),
      this.refDate = this.reference.instant
  }
  createParsingComponents(e) {
    return e instanceof c ? e : new c(this.reference, e)
  }
  createParsingResult(e, t, r, n) {
    let i = typeof t == 'string' ? t : this.text.substring(e, t),
      o = r ? this.createParsingComponents(r) : null,
      a = n ? this.createParsingComponents(n) : null
    return new x(this.reference, e, i, o, a)
  }
  debug(e) {
    this.option.debug &&
      (this.option.debug instanceof Function ? this.option.debug(e) : this.option.debug.debug(e))
  }
}
var ts = new Ne()
var Yt = new g(ts.createCasualConfiguration(false))
var Us = new g(ts.createConfiguration(true, false))
var eu = new g(ts.createCasualConfiguration(true))
function tu(s8, e, t) {
  return Yt.parse(s8, e, t)
}
function ru(s8, e, t) {
  return Yt.parseDate(s8, e, t)
}
var zo = {}
H(zo, {
  Chrono: () => g,
  Meridiem: () => u,
  ParsingComponents: () => c,
  ParsingResult: () => x,
  ReferenceWithTimezone: () => E,
  Weekday: () => y,
  casual: () => Gs,
  createCasualConfiguration: () => Ho,
  createConfiguration: () => vs,
  parse: () => yu,
  parseDate: () => hu,
  strict: () => Tu,
})
var St = class extends k {
  primaryPrefix() {
    return '(?:(?:um|von)\\s*)?'
  }
  followingPhase() {
    return '\\s*(?:\\-|\\\u2013|\\~|\\\u301C|bis)\\s*'
  }
  extractPrimaryTimeComponents(e, t) {
    return t[0].match(/^\s*\d{4}\s*$/) ? null : super.extractPrimaryTimeComponents(e, t)
  }
}
var Ys = {
  sonntag: 0,
  so: 0,
  montag: 1,
  mo: 1,
  dienstag: 2,
  di: 2,
  mittwoch: 3,
  mi: 3,
  donnerstag: 4,
  do: 4,
  freitag: 5,
  fr: 5,
  samstag: 6,
  sa: 6,
}
var Ss = {
  januar: 1,
  jänner: 1,
  janner: 1,
  jan: 1,
  'jan.': 1,
  februar: 2,
  feber: 2,
  feb: 2,
  'feb.': 2,
  märz: 3,
  maerz: 3,
  mär: 3,
  'm\xE4r.': 3,
  mrz: 3,
  'mrz.': 3,
  april: 4,
  apr: 4,
  'apr.': 4,
  mai: 5,
  juni: 6,
  jun: 6,
  'jun.': 6,
  juli: 7,
  jul: 7,
  'jul.': 7,
  august: 8,
  aug: 8,
  'aug.': 8,
  september: 9,
  sep: 9,
  'sep.': 9,
  sept: 9,
  'sept.': 9,
  oktober: 10,
  okt: 10,
  'okt.': 10,
  november: 11,
  nov: 11,
  'nov.': 11,
  dezember: 12,
  dez: 12,
  'dez.': 12,
}
var ks = {
  eins: 1,
  eine: 1,
  einem: 1,
  einen: 1,
  einer: 1,
  zwei: 2,
  drei: 3,
  vier: 4,
  fünf: 5,
  fuenf: 5,
  sechs: 6,
  sieben: 7,
  acht: 8,
  neun: 9,
  zehn: 10,
  elf: 11,
  zwölf: 12,
  zwoelf: 12,
}
var $t = {
  sek: 'second',
  sekunde: 'second',
  sekunden: 'second',
  min: 'minute',
  minute: 'minute',
  minuten: 'minute',
  h: 'hour',
  std: 'hour',
  stunde: 'hour',
  stunden: 'hour',
  tag: 'day',
  tage: 'day',
  tagen: 'day',
  woche: 'week',
  wochen: 'week',
  monat: 'month',
  monate: 'month',
  monaten: 'month',
  monats: 'month',
  quartal: 'quarter',
  quartals: 'quarter',
  quartale: 'quarter',
  quartalen: 'quarter',
  a: 'year',
  j: 'year',
  jr: 'year',
  jahr: 'year',
  jahre: 'year',
  jahren: 'year',
  jahres: 'year',
}
var $s = `(?:${p(ks)}|[0-9]+|[0-9]+\\.[0-9]+|halb?|halbe?|einigen?|wenigen?|mehreren?)`
function Fs(s8) {
  let e = s8.toLowerCase()
  return ks[e] !== void 0
    ? ks[e]
    : e === 'ein' || e === 'einer' || e === 'einem' || e === 'einen' || e === 'eine'
    ? 1
    : e.match(/wenigen/)
    ? 2
    : e.match(/halb/) || e.match(/halben/)
    ? 0.5
    : e.match(/einigen/)
    ? 3
    : e.match(/mehreren/)
    ? 7
    : parseFloat(e)
}
var Uo =
  '(?:[0-9]{1,4}(?:\\s*[vn]\\.?\\s*(?:C(?:hr)?|(?:u\\.?|d\\.?(?:\\s*g\\.?)?)?\\s*Z)\\.?|\\s*(?:u\\.?|d\\.?(?:\\s*g\\.)?)\\s*Z\\.?)?)'
function ko(s8) {
  if (/v/i.test(s8)) return -parseInt(s8.replace(/[^0-9]+/gi, ''))
  if (/n/i.test(s8)) return parseInt(s8.replace(/[^0-9]+/gi, ''))
  if (/z/i.test(s8)) return parseInt(s8.replace(/[^0-9]+/gi, ''))
  let e = parseInt(s8)
  return S(e)
}
var Yo = `(${$s})\\s{0,5}(${p($t)})\\s{0,5}`
var Wo = new RegExp(Yo, 'i')
var So = U('', Yo)
function $o(s8) {
  let e = {}, t = s8, r = Wo.exec(t)
  for (; r;) nu(e, r), t = t.substring(r[0].length), r = Wo.exec(t)
  return e
}
function nu(s8, e) {
  let t = Fs(e[1]), r = $t[e[2].toLowerCase()]
  s8[r] = t
}
var su = new RegExp(
  `(?:(?:\\,|\\(|\\\uFF08)\\s*)?(?:a[mn]\\s*?)?(?:(diese[mn]|letzte[mn]|n(?:\xE4|ae)chste[mn])\\s*)?(${
    p(Ys)
  })(?:\\s*(?:\\,|\\)|\\\uFF09))?(?:\\s*(diese|letzte|n(?:\xE4|ae)chste)\\s*woche)?(?=\\W|$)`,
  'i',
)
var iu = 1
var ou = 3
var au = 2
var Ft = class extends f {
  innerPattern() {
    return su
  }
  innerExtract(e, t) {
    let r = t[au].toLowerCase(), n = Ys[r], i = t[iu], o = t[ou], a = i || o
    a = a || '', a = a.toLowerCase()
    let m = null
    return a.match(/letzte/) ? m = 'last' : a.match(/chste/) ? m = 'next' : a.match(/diese/) && (m = 'this'),
      I(e.reference, n, m)
  }
}
var mu = new RegExp(
  '(^|\\s|T)(?:(?:um|von)\\s*)?(\\d{1,2})(?:h|:)?(?:(\\d{1,2})(?:m|:)?)?(?:(\\d{1,2})(?:s)?)?(?:\\s*Uhr)?(?:\\s*(morgens|vormittags|nachmittags|abends|nachts|am\\s+(?:Morgen|Vormittag|Nachmittag|Abend)|in\\s+der\\s+Nacht))?(?=\\W|$)',
  'i',
)
var fu = new RegExp(
  '^\\s*(\\-|\\\u2013|\\~|\\\u301C|bis(?:\\s+um)?|\\?)\\s*(\\d{1,2})(?:h|:)?(?:(\\d{1,2})(?:m|:)?)?(?:(\\d{1,2})(?:s)?)?(?:\\s*Uhr)?(?:\\s*(morgens|vormittags|nachmittags|abends|nachts|am\\s+(?:Morgen|Vormittag|Nachmittag|Abend)|in\\s+der\\s+Nacht))?(?=\\W|$)',
  'i',
)
var uu = 2
var Fo = 3
var Go = 4
var vo = 5
var Gt = class s5 {
  pattern(e) {
    return mu
  }
  extract(e, t) {
    let r = e.createParsingResult(t.index + t[1].length, t[0].substring(t[1].length))
    if (r.text.match(/^\d{4}$/) || (r.start = s5.extractTimeComponent(r.start.clone(), t), !r.start)) {
      return t.index += t[0].length, null
    }
    let n = e.text.substring(t.index + t[0].length), i = fu.exec(n)
    return i && (r.end = s5.extractTimeComponent(r.start.clone(), i), r.end && (r.text += i[0])), r
  }
  static extractTimeComponent(e, t) {
    let r = 0, n = 0, i = null
    if (r = parseInt(t[uu]), t[Fo] != null && (n = parseInt(t[Fo])), n >= 60 || r > 24) return null
    if (r >= 12 && (i = u.PM), t[vo] != null) {
      if (r > 12) return null
      let o = t[vo].toLowerCase()
      o.match(/morgen|vormittag/) && (i = u.AM, r == 12 && (r = 0)),
        o.match(/nachmittag|abend/) && (i = u.PM, r != 12 && (r += 12)),
        o.match(/nacht/) && (r == 12 ? (i = u.AM, r = 0) : r < 6 ? i = u.AM : (i = u.PM, r += 12))
    }
    if (
      e.assign('hour', r),
        e.assign('minute', n),
        i !== null ? e.assign('meridiem', i) : r < 12 ? e.imply('meridiem', u.AM) : e.imply('meridiem', u.PM),
        t[Go] != null
    ) {
      let o = parseInt(t[Go])
      if (o >= 60) return null
      e.assign('second', o)
    }
    return e
  }
}
var vt = class extends _ {
  patternBetween() {
    return /^\s*(bis(?:\s*(?:am|zum))?|-)\s*$/i
  }
}
var Bt = class extends M {
  patternBetween() {
    return new RegExp('^\\s*(T|um|am|,|-)?\\s*$')
  }
}
var _e = class s6 extends f {
  innerPattern(e) {
    return /(diesen)?\s*(morgen|vormittag|mittags?|nachmittag|abend|nacht|mitternacht)(?=\W|$)/i
  }
  innerExtract(e, t) {
    let r = e.refDate, n = t[2].toLowerCase(), i = e.createParsingComponents()
    return O(i, r), s6.extractTimeComponents(i, n)
  }
  static extractTimeComponents(e, t) {
    switch (t) {
      case 'morgen':
        e.imply('hour', 6), e.imply('minute', 0), e.imply('second', 0), e.imply('meridiem', u.AM)
        break
      case 'vormittag':
        e.imply('hour', 9), e.imply('minute', 0), e.imply('second', 0), e.imply('meridiem', u.AM)
        break
      case 'mittag':
      case 'mittags':
        e.imply('hour', 12), e.imply('minute', 0), e.imply('second', 0), e.imply('meridiem', u.AM)
        break
      case 'nachmittag':
        e.imply('hour', 15), e.imply('minute', 0), e.imply('second', 0), e.imply('meridiem', u.PM)
        break
      case 'abend':
        e.imply('hour', 18), e.imply('minute', 0), e.imply('second', 0), e.imply('meridiem', u.PM)
        break
      case 'nacht':
        e.imply('hour', 22), e.imply('minute', 0), e.imply('second', 0), e.imply('meridiem', u.PM)
        break
      case 'mitternacht':
        e.get('hour') > 1 && e.addDurationAsImplied({
          day: 1,
        }),
          e.imply('hour', 0),
          e.imply('minute', 0),
          e.imply('second', 0),
          e.imply('meridiem', u.AM)
        break
    }
    return e
  }
}
var lu = new RegExp(
  '(jetzt|heute|morgen|\xFCbermorgen|uebermorgen|gestern|vorgestern|letzte\\s*nacht)(?:\\s*(morgen|vormittag|mittags?|nachmittag|abend|nacht|mitternacht))?(?=\\W|$)',
  'i',
)
var cu = 1
var pu = 2
var Lt = class extends f {
  innerPattern(e) {
    return lu
  }
  innerExtract(e, t) {
    let r = e.reference.getDateWithAdjustedTimezone(),
      n = (t[cu] || '').toLowerCase(),
      i = (t[pu] || '').toLowerCase(),
      o = e.createParsingComponents()
    switch (n) {
      case 'jetzt':
        o = Y(e.reference)
        break
      case 'heute':
        o = W(e.reference)
        break
      case 'morgen':
        r = w(r, {
          day: 1,
        }),
          R(o, r),
          O(o, r)
        break
      case '\xFCbermorgen':
      case 'uebermorgen':
        r = w(r, {
          day: 2,
        }),
          R(o, r),
          O(o, r)
        break
      case 'gestern':
        r = w(r, {
          day: -1,
        }),
          R(o, r),
          O(o, r)
        break
      case 'vorgestern':
        r = w(r, {
          day: -2,
        }),
          R(o, r),
          O(o, r)
        break
      default:
        n.match(/letzte\s*nacht/) && (r.getHours() > 6 && (r = w(r, {
          day: -1,
        })),
          R(o, r),
          o.imply('hour', 0))
        break
    }
    return i && (o = _e.extractTimeComponents(o, i)), o
  }
}
var du = new RegExp(
  `(?:am\\s*?)?(?:den\\s*?)?([0-9]{1,2})\\.(?:\\s*(?:bis(?:\\s*(?:am|zum))?|\\-|\\\u2013|\\s)\\s*([0-9]{1,2})\\.?)?\\s*(${
    p(Ss)
  })(?:(?:-|/|,?\\s*)(${Uo}(?![^\\s]\\d)))?(?=\\W|$)`,
  'i',
)
var Bo = 1
var Lo = 2
var gu = 3
var jo = 4
var jt = class extends f {
  innerPattern() {
    return du
  }
  innerExtract(e, t) {
    let r = e.createParsingResult(t.index, t[0]), n = Ss[t[gu].toLowerCase()], i = parseInt(t[Bo])
    if (i > 31) return t.index = t.index + t[Bo].length, null
    if (r.start.assign('month', n), r.start.assign('day', i), t[jo]) {
      let o = ko(t[jo])
      r.start.assign('year', o)
    } else {
      let o = P(e.refDate, i, n)
      r.start.imply('year', o)
    }
    if (t[Lo]) {
      let o = parseInt(t[Lo])
      r.end = r.start.clone(), r.end.assign('day', o)
    }
    return r
  }
}
var Ht = class extends f {
  constructor() {
    super()
  }
  innerPattern() {
    return new RegExp(
      `(?:\\s*((?:n\xE4chste|kommende|folgende|letzte|vergangene|vorige|vor(?:her|an)gegangene)(?:s|n|m|r)?|vor|in)\\s*)?(${$s})?(?:\\s*(n\xE4chste|kommende|folgende|letzte|vergangene|vorige|vor(?:her|an)gegangene)(?:s|n|m|r)?)?\\s*(${
        p($t)
      })`,
      'i',
    )
  }
  innerExtract(e, t) {
    let r = t[2] ? Fs(t[2]) : 1, n = $t[t[4].toLowerCase()], i = {}
    i[n] = r
    let o = t[1] || t[3] || ''
    if (o = o.toLowerCase(), !!o) {
      return (/vor/.test(o) || /letzte/.test(o) || /vergangen/.test(o)) && (i = D(i)),
        c.createRelativeFromReference(e.reference, i)
    }
  }
}
var zt = class extends f {
  innerPattern() {
    return new RegExp(`(?:in|f\xFCr|w\xE4hrend)\\s*(${So})(?=\\W|$)`, 'i')
  }
  innerExtract(e, t) {
    let r = $o(t[1])
    return c.createRelativeFromReference(e.reference, r)
  }
}
var Gs = new g(Ho())
var Tu = new g(vs(true))
function yu(s8, e, t) {
  return Gs.parse(s8, e, t)
}
function hu(s8, e, t) {
  return Gs.parseDate(s8, e, t)
}
function Ho(s8 = true) {
  let e = vs(false, s8)
  return e.parsers.unshift(new _e()), e.parsers.unshift(new Lt()), e.parsers.unshift(new Ht()), e
}
function vs(s8 = true, e = true) {
  return N({
    parsers: [
      new ae(),
      new b(e),
      new St(),
      new Gt(),
      new jt(),
      new Ft(),
      new zt(),
    ],
    refiners: [
      new vt(),
      new Bt(),
    ],
  }, s8)
}
var sa = {}
H(sa, {
  Chrono: () => g,
  Meridiem: () => u,
  ParsingComponents: () => c,
  ParsingResult: () => x,
  ReferenceWithTimezone: () => E,
  Weekday: () => y,
  casual: () => Ks,
  createCasualConfiguration: () => na,
  createConfiguration: () => Xs,
  parse: () => Ou,
  parseDate: () => Cu,
  strict: () => Mu,
})
var qt = class extends f {
  innerPattern(e) {
    return /(maintenant|aujourd'hui|demain|hier|cette\s*nuit|la\s*veille)(?=\W|$)/i
  }
  innerExtract(e, t) {
    let r = e.refDate, n = t[0].toLowerCase(), i = e.createParsingComponents()
    switch (n) {
      case 'maintenant':
        return Y(e.reference)
      case "aujourd'hui":
        return W(e.reference)
      case 'hier':
        return $(e.reference)
      case 'demain':
        return F(e.reference)
      default:
        if (n.match(/cette\s*nuit/)) R(i, r), i.imply('hour', 22), i.imply('meridiem', u.PM)
        else if (n.match(/la\s*veille/)) {
          let o = new Date(r.getTime())
          o.setDate(o.getDate() - 1), R(i, o), i.imply('hour', 0)
        }
    }
    return i
  }
}
var Vt = class extends f {
  innerPattern(e) {
    return /(cet?)?\s*(matin|soir|après-midi|aprem|a midi|à minuit)(?=\W|$)/i
  }
  innerExtract(e, t) {
    let r = t[2].toLowerCase(), n = e.createParsingComponents()
    switch (r) {
      case 'apr\xE8s-midi':
      case 'aprem':
        n.imply('hour', 14), n.imply('minute', 0), n.imply('meridiem', u.PM)
        break
      case 'soir':
        n.imply('hour', 18), n.imply('minute', 0), n.imply('meridiem', u.PM)
        break
      case 'matin':
        n.imply('hour', 8), n.imply('minute', 0), n.imply('meridiem', u.AM)
        break
      case 'a midi':
        n.imply('hour', 12), n.imply('minute', 0), n.imply('meridiem', u.AM)
        break
      case '\xE0 minuit':
        n.imply('hour', 0), n.imply('meridiem', u.AM)
        break
    }
    return n
  }
}
var Kt = class extends k {
  primaryPrefix() {
    return '(?:(?:[\xE0a])\\s*)?'
  }
  followingPhase() {
    return '\\s*(?:\\-|\\\u2013|\\~|\\\u301C|[\xE0a]|\\?)\\s*'
  }
  extractPrimaryTimeComponents(e, t) {
    return t[0].match(/^\s*\d{4}\s*$/) ? null : super.extractPrimaryTimeComponents(e, t)
  }
}
var Xt = class extends M {
  patternBetween() {
    return new RegExp('^\\s*(T|\xE0|a|au|vers|de|,|-)?\\s*$')
  }
}
var Zt = class extends _ {
  patternBetween() {
    return /^\s*(à|a|au|-)\s*$/i
  }
}
var Ls = {
  dimanche: 0,
  dim: 0,
  lundi: 1,
  lun: 1,
  mardi: 2,
  mar: 2,
  mercredi: 3,
  mer: 3,
  jeudi: 4,
  jeu: 4,
  vendredi: 5,
  ven: 5,
  samedi: 6,
  sam: 6,
}
var js = {
  janvier: 1,
  jan: 1,
  'jan.': 1,
  février: 2,
  fév: 2,
  'f\xE9v.': 2,
  fevrier: 2,
  fev: 2,
  'fev.': 2,
  mars: 3,
  mar: 3,
  'mar.': 3,
  avril: 4,
  avr: 4,
  'avr.': 4,
  mai: 5,
  juin: 6,
  jun: 6,
  juillet: 7,
  juil: 7,
  jul: 7,
  'jul.': 7,
  août: 8,
  aout: 8,
  septembre: 9,
  sep: 9,
  'sep.': 9,
  sept: 9,
  'sept.': 9,
  octobre: 10,
  oct: 10,
  'oct.': 10,
  novembre: 11,
  nov: 11,
  'nov.': 11,
  décembre: 12,
  decembre: 12,
  dec: 12,
  'dec.': 12,
}
var Bs = {
  un: 1,
  deux: 2,
  trois: 3,
  quatre: 4,
  cinq: 5,
  six: 6,
  sept: 7,
  huit: 8,
  neuf: 9,
  dix: 10,
  onze: 11,
  douze: 12,
  treize: 13,
}
var Jt = {
  sec: 'second',
  seconde: 'second',
  secondes: 'second',
  min: 'minute',
  mins: 'minute',
  minute: 'minute',
  minutes: 'minute',
  h: 'hour',
  hr: 'hour',
  hrs: 'hour',
  heure: 'hour',
  heures: 'hour',
  jour: 'day',
  jours: 'day',
  semaine: 'week',
  semaines: 'week',
  mois: 'month',
  trimestre: 'quarter',
  trimestres: 'quarter',
  ans: 'year',
  année: 'year',
  années: 'year',
}
var Hs = `(?:${p(Bs)}|[0-9]+|[0-9]+\\.[0-9]+|une?\\b|quelques?|demi-?)`
function zs(s8) {
  let e = s8.toLowerCase()
  return Bs[e] !== void 0
    ? Bs[e]
    : e === 'une' || e === 'un'
    ? 1
    : e.match(/quelques?/)
    ? 3
    : e.match(/demi-?/)
    ? 0.5
    : parseFloat(e)
}
var qs = '(?:[0-9]{1,2}(?:er)?)'
function Vs(s8) {
  let e = s8.toLowerCase()
  return e = e.replace(/(?:er)$/i, ''), parseInt(e)
}
var Vo = '(?:[1-9][0-9]{0,3}\\s*(?:AC|AD|p\\.\\s*C(?:hr?)?\\.\\s*n\\.)|[1-2][0-9]{3}|[5-9][0-9])'
function Ko(s8) {
  if (/AC/i.test(s8)) return s8 = s8.replace(/BC/i, ''), -parseInt(s8)
  if (/AD/i.test(s8) || /C/i.test(s8)) return s8 = s8.replace(/[^\d]+/i, ''), parseInt(s8)
  let e = parseInt(s8)
  return e < 100 && (e > 50 ? e = e + 1900 : e = e + 2e3), e
}
var Xo = `(${Hs})\\s{0,5}(${p(Jt)})\\s{0,5}`
var qo = new RegExp(Xo, 'i')
var rs = U('', Xo)
function ns(s8) {
  let e = {}, t = s8, r = qo.exec(t)
  for (; r;) Ru(e, r), t = t.substring(r[0].length), r = qo.exec(t)
  return e
}
function Ru(s8, e) {
  let t = zs(e[1]), r = Jt[e[2].toLowerCase()]
  s8[r] = t
}
var Pu = new RegExp(
  `(?:(?:\\,|\\(|\\\uFF08)\\s*)?(?:(?:ce)\\s*)?(${
    p(Ls)
  })(?:\\s*(?:\\,|\\)|\\\uFF09))?(?:\\s*(dernier|prochain)\\s*)?(?=\\W|\\d|$)`,
  'i',
)
var xu = 1
var Eu = 2
var Qt = class extends f {
  innerPattern() {
    return Pu
  }
  innerExtract(e, t) {
    let r = t[xu].toLowerCase(), n = Ls[r]
    if (n === void 0) return null
    let i = t[Eu]
    i = i || '', i = i.toLowerCase()
    let o = null
    return i == 'dernier' ? o = 'last' : i == 'prochain' && (o = 'next'), I(e.reference, n, o)
  }
}
var Du = new RegExp(
  '(^|\\s|T)(?:(?:[\xE0a])\\s*)?(\\d{1,2})(?:h|:)?(?:(\\d{1,2})(?:m|:)?)?(?:(\\d{1,2})(?:s|:)?)?(?:\\s*(A\\.M\\.|P\\.M\\.|AM?|PM?))?(?=\\W|$)',
  'i',
)
var Au = new RegExp(
  '^\\s*(\\-|\\\u2013|\\~|\\\u301C|[\xE0a]|\\?)\\s*(\\d{1,2})(?:h|:)?(?:(\\d{1,2})(?:m|:)?)?(?:(\\d{1,2})(?:s|:)?)?(?:\\s*(A\\.M\\.|P\\.M\\.|AM?|PM?))?(?=\\W|$)',
  'i',
)
var wu = 2
var Zo = 3
var Jo = 4
var Qo = 5
var er = class s7 {
  pattern(e) {
    return Du
  }
  extract(e, t) {
    let r = e.createParsingResult(t.index + t[1].length, t[0].substring(t[1].length))
    if (r.text.match(/^\d{4}$/) || (r.start = s7.extractTimeComponent(r.start.clone(), t), !r.start)) {
      return t.index += t[0].length, null
    }
    let n = e.text.substring(t.index + t[0].length), i = Au.exec(n)
    return i && (r.end = s7.extractTimeComponent(r.start.clone(), i), r.end && (r.text += i[0])), r
  }
  static extractTimeComponent(e, t) {
    let r = 0, n = 0, i = null
    if (r = parseInt(t[wu]), t[Zo] != null && (n = parseInt(t[Zo])), n >= 60 || r > 24) return null
    if (r >= 12 && (i = u.PM), t[Qo] != null) {
      if (r > 12) return null
      let o = t[Qo][0].toLowerCase()
      o == 'a' && (i = u.AM, r == 12 && (r = 0)), o == 'p' && (i = u.PM, r != 12 && (r += 12))
    }
    if (
      e.assign('hour', r),
        e.assign('minute', n),
        i !== null ? e.assign('meridiem', i) : r < 12 ? e.imply('meridiem', u.AM) : e.imply('meridiem', u.PM),
        t[Jo] != null
    ) {
      let o = parseInt(t[Jo])
      if (o >= 60) return null
      e.assign('second', o)
    }
    return e
  }
}
var Nu = new RegExp(
  `(?:on\\s*?)?(${qs})(?:\\s*(?:au|\\-|\\\u2013|jusqu'au?|\\s)\\s*(${qs}))?(?:-|/|\\s*(?:de)?\\s*)(${
    p(js)
  })(?:(?:-|/|,?\\s*)(${Vo}(?![^\\s]\\d)))?(?=\\W|$)`,
  'i',
)
var ea = 1
var ta = 2
var _u = 3
var ra = 4
var tr = class extends f {
  innerPattern() {
    return Nu
  }
  innerExtract(e, t) {
    let r = e.createParsingResult(t.index, t[0]), n = js[t[_u].toLowerCase()], i = Vs(t[ea])
    if (i > 31) return t.index = t.index + t[ea].length, null
    if (r.start.assign('month', n), r.start.assign('day', i), t[ra]) {
      let o = Ko(t[ra])
      r.start.assign('year', o)
    } else {
      let o = P(e.refDate, i, n)
      r.start.imply('year', o)
    }
    if (t[ta]) {
      let o = Vs(t[ta])
      r.end = r.start.clone(), r.end.assign('day', o)
    }
    return r
  }
}
var rr = class extends f {
  constructor() {
    super()
  }
  innerPattern() {
    return new RegExp(`il y a\\s*(${rs})(?=(?:\\W|$))`, 'i')
  }
  innerExtract(e, t) {
    let r = ns(t[1]), n = D(r)
    return c.createRelativeFromReference(e.reference, n)
  }
}
var nr = class extends f {
  innerPattern() {
    return new RegExp(`(?:dans|en|pour|pendant|de)\\s*(${rs})(?=\\W|$)`, 'i')
  }
  innerExtract(e, t) {
    let r = ns(t[1])
    return c.createRelativeFromReference(e.reference, r)
  }
}
var sr = class extends f {
  constructor() {
    super()
  }
  innerPattern() {
    return new RegExp(
      `(?:les?|la|l'|du|des?)\\s*(${Hs})?(?:\\s*(prochaine?s?|derni[e\xE8]re?s?|pass[\xE9e]e?s?|pr[\xE9e]c[\xE9e]dents?|suivante?s?))?\\s*(${
        p(Jt)
      })(?:\\s*(prochaine?s?|derni[e\xE8]re?s?|pass[\xE9e]e?s?|pr[\xE9e]c[\xE9e]dents?|suivante?s?))?`,
      'i',
    )
  }
  innerExtract(e, t) {
    let r = t[1] ? zs(t[1]) : 1, n = Jt[t[3].toLowerCase()], i = {}
    i[n] = r
    let o = t[2] || t[4] || ''
    if (o = o.toLowerCase(), !!o) {
      return (/derni[eè]re?s?/.test(o) || /pass[ée]e?s?/.test(o) || /pr[ée]c[ée]dents?/.test(o)) &&
        (i = D(i)),
        c.createRelativeFromReference(e.reference, i)
    }
  }
}
var Ks = new g(na())
var Mu = new g(Xs(true))
function Ou(s8, e, t) {
  return Ks.parse(s8, e, t)
}
function Cu(s8, e, t) {
  return Ks.parseDate(s8, e, t)
}
function na(s8 = true) {
  let e = Xs(false, s8)
  return e.parsers.unshift(new qt()), e.parsers.unshift(new Vt()), e.parsers.unshift(new sr()), e
}
function Xs(s8 = true, e = true) {
  return N({
    parsers: [
      new b(e),
      new tr(),
      new Kt(),
      new er(),
      new rr(),
      new nr(),
      new Qt(),
    ],
    refiners: [
      new Xt(),
      new Zt(),
    ],
  }, s8)
}
var da = {}
H(da, {
  Chrono: () => g,
  Meridiem: () => u,
  ParsingComponents: () => c,
  ParsingResult: () => x,
  ReferenceWithTimezone: () => E,
  Weekday: () => y,
  casual: () => Js,
  createCasualConfiguration: () => pa,
  createConfiguration: () => Qs,
  parse: () => qu,
  parseDate: () => Vu,
  strict: () => zu,
})
var ue = {
  零: 0,
  '\u3007': 0,
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
  十: 10,
}
var Ze = {
  日: 0,
  月: 1,
  火: 2,
  水: 3,
  木: 4,
  金: 5,
  土: 6,
}
function Q(s8) {
  return String(s8).replace(/\u2019/g, "'").replace(/\u201D/g, '"').replace(/\u3000/g, ' ').replace(
    /\uFFE5/g,
    '\xA5',
  ).replace(
    /[\uFF01\uFF03-\uFF06\uFF08\uFF09\uFF0C-\uFF19\uFF1C-\uFF1F\uFF21-\uFF3B\uFF3D\uFF3F\uFF41-\uFF5B\uFF5D\uFF5E]/g,
    Iu,
  )
}
function Iu(s8) {
  return String.fromCharCode(s8.charCodeAt(0) - 65248)
}
function ss(s8) {
  let e = 0
  for (let t = 0; t < s8.length; t++) {
    let r = s8[t]
    r === '\u5341' ? e = e === 0 ? ue[r] : e * ue[r] : e += ue[r]
  }
  return e
}
var bu =
  /(?:(?:([同今本])|((昭和|平成|令和)?([0-9０-９]{1,4}|元)))年\s*)?([0-9０-９]{1,2})月\s*([0-9０-９]{1,2})日/i
var ia = 1
var Wu = 2
var Zs = 3
var Uu = 4
var ku = 5
var Yu = 6
var ir = class {
  pattern() {
    return bu
  }
  extract(e, t) {
    let r = parseInt(Q(t[ku])),
      n = parseInt(Q(t[Yu])),
      i = e.createParsingComponents({
        day: n,
        month: r,
      })
    if (
      t[ia] && t[ia].match('\u540C|\u4ECA|\u672C') &&
      i.assign('year', e.reference.getDateWithAdjustedTimezone().getFullYear()), t[Wu]
    ) {
      let o = t[Uu], a = o == '\u5143' ? 1 : parseInt(Q(o))
      t[Zs] == '\u4EE4\u548C'
        ? a += 2018
        : t[Zs] == '\u5E73\u6210'
        ? a += 1988
        : t[Zs] == '\u662D\u548C' && (a += 1925), i.assign('year', a)
    } else {
      let o = P(e.refDate, n, r)
      i.imply('year', o)
    }
    return i
  }
}
var or = class extends _ {
  patternBetween() {
    return /^\s*(から|－|ー|-|～|~)\s*$/i
  }
}
var Su =
  /今日|きょう|本日|ほんじつ|昨日|きのう|明日|あした|今夜|こんや|今夕|こんゆう|今晩|こんばん|今朝|けさ/i
function $u(s8) {
  switch (s8) {
    case '\u304D\u3087\u3046':
      return '\u4ECA\u65E5'
    case '\u307B\u3093\u3058\u3064':
      return '\u672C\u65E5'
    case '\u304D\u306E\u3046':
      return '\u6628\u65E5'
    case '\u3042\u3057\u305F':
      return '\u660E\u65E5'
    case '\u3053\u3093\u3084':
      return '\u4ECA\u591C'
    case '\u3053\u3093\u3086\u3046':
      return '\u4ECA\u5915'
    case '\u3053\u3093\u3070\u3093':
      return '\u4ECA\u6669'
    case '\u3051\u3055':
      return '\u4ECA\u671D'
    default:
      return s8
  }
}
var ar = class {
  pattern() {
    return Su
  }
  extract(e, t) {
    let r = $u(t[0]), n = e.createParsingComponents()
    switch (r) {
      case '\u6628\u65E5':
        return $(e.reference)
      case '\u660E\u65E5':
        return F(e.reference)
      case '\u672C\u65E5':
      case '\u4ECA\u65E5':
        return W(e.reference)
    }
    r == '\u4ECA\u591C' || r == '\u4ECA\u5915' || r == '\u4ECA\u6669'
      ? (n.imply('hour', 22), n.assign('meridiem', u.PM))
      : r.match('\u4ECA\u671D') && (n.imply('hour', 6), n.assign('meridiem', u.AM))
    let i = e.refDate
    return n.assign('day', i.getDate()),
      n.assign('month', i.getMonth() + 1),
      n.assign('year', i.getFullYear()),
      n
  }
}
var Fu = new RegExp(
  '((?<prefix>\u524D\u306E|\u6B21\u306E|\u4ECA\u9031))?(?<weekday>' + Object.keys(Ze).join('|') +
    ')(?:\u66DC\u65E5|\u66DC)',
  'i',
)
var mr = class {
  pattern() {
    return Fu
  }
  extract(e, t) {
    let r = t.groups.weekday, n = Ze[r]
    if (n === void 0) return null
    let i = t.groups.prefix || '', o = null
    return i.match(/前の/) ? o = 'last' : i.match(/次の/) ? o = 'next' : i.match(/今週/) && (o = 'this'),
      I(e.reference, n, o)
  }
}
var Gu = new RegExp(
  '([0-9\uFF10-\uFF19]{4}[\\/|\\\uFF0F])?([0-1\uFF10-\uFF11]{0,1}[0-9\uFF10-\uFF19]{1})(?:[\\/|\\\uFF0F]([0-3\uFF10-\uFF13]{0,1}[0-9\uFF10-\uFF19]{1}))',
  'i',
)
var oa = 1
var vu = 2
var Bu = 3
var fr = class {
  pattern() {
    return Gu
  }
  extract(e, t) {
    let r = e.createParsingComponents(), n = parseInt(Q(t[vu])), i = parseInt(Q(t[Bu]))
    if (n < 1 || n > 12 || i < 1 || i > 31) return null
    if (r.assign('day', i), r.assign('month', n), t[oa]) {
      let o = parseInt(Q(t[oa])), a = S(o)
      r.assign('year', a)
    } else {
      let o = P(e.reference.instant, i, n)
      r.imply('year', o)
    }
    return r
  }
}
var Lu = new RegExp(
  '(?:(\u5348\u524D|\u5348\u5F8C|A.M.|P.M.|AM|PM))?(?:[\\s,\uFF0C\u3001]*)(?:([0-9\uFF10-\uFF19]+|[' +
    Object.keys(ue).join('') +
    ']+)(?:\\s*)(?:\u6642(?!\u9593)|:|\uFF1A)(?:\\s*)([0-9\uFF10-\uFF19]+|\u534A|[' +
    Object.keys(ue).join('') + ']+)?(?:\\s*)(?:\u5206|:|\uFF1A)?(?:\\s*)([0-9\uFF10-\uFF19]+|[' +
    Object.keys(ue).join('') + ']+)?(?:\\s*)(?:\u79D2)?)(?:\\s*(A.M.|P.M.|AM?|PM?))?',
  'i',
)
var ju = new RegExp(
  '(?:^\\s*(?:\u304B\u3089|\\-|\\\u2013|\\\uFF0D|\\~|\\\u301C)\\s*)(?:(\u5348\u524D|\u5348\u5F8C|A.M.|P.M.|AM|PM))?(?:[\\s,\uFF0C\u3001]*)(?:([0-9\uFF10-\uFF19]+|[' +
    Object.keys(ue).join('') + ']+)(?:\\s*)(?:\u6642|:|\uFF1A)(?:\\s*)([0-9\uFF10-\uFF19]+|\u534A|[' +
    Object.keys(ue).join('') + ']+)?(?:\\s*)(?:\u5206|:|\uFF1A)?(?:\\s*)([0-9\uFF10-\uFF19]+|[' +
    Object.keys(ue).join('') + ']+)?(?:\\s*)(?:\u79D2)?)(?:\\s*(A.M.|P.M.|AM?|PM?))?',
  'i',
)
var aa = 1
var ma = 2
var fa = 3
var ua = 4
var la = 5
var ur = class extends f {
  innerPattern() {
    return Lu
  }
  innerExtract(e, t) {
    if (t.index > 0 && e.text[t.index - 1].match(/\w/)) return null
    let r = e.createParsingResult(t.index, t[0])
    return r.start = ca(e, t[ma], t[fa], t[ua], t[aa] ?? t[la]),
      r.start
        ? (t = ju.exec(e.text.substring(r.index + r.text.length)),
          t
            ? (r.text = r.text + t[0],
              r.end = ca(e, t[ma], t[fa], t[ua], t[aa] ?? t[la]),
              r.end
                ? (!r.end.isCertain('meridiem') && r.start.isCertain('meridiem') &&
                  (r.end.imply('meridiem', r.start.get('meridiem')),
                    r.start.get('meridiem') === u.PM && (r.start.get('hour') - 12 > r.end.get('hour')
                      ? r.end.imply('meridiem', u.AM)
                      : r.end.get('hour') < 12 && r.end.assign('hour', r.end.get('hour') + 12))),
                  r.end.date().getTime() < r.start.date().getTime() &&
                  r.end.imply('day', r.end.get('day') + 1),
                  r)
                : null)
            : r)
        : (t.index += t[0].length, null)
  }
}
function ca(s8, e, t, r, n) {
  let i = 0, o = -1, a = s8.createParsingComponents()
  if (i = parseInt(Q(e)), isNaN(i) && (i = ss(e)), i > 24) return null
  if (t) {
    let m
    if (t === '\u534A' ? m = 30 : (m = parseInt(Q(t)), isNaN(m) && (m = ss(t))), m >= 60) return null
    a.assign('minute', m)
  }
  if (r) {
    let m = parseInt(Q(r))
    if (isNaN(m) && (m = ss(r)), m >= 60) return null
    a.assign('second', m)
  }
  if (n) {
    if (i > 12) return null
    let m = n
    m === '\u5348\u524D' || m[0].toLowerCase() === 'a'
      ? (o = u.AM, i === 12 && (i = 0))
      : (m === '\u5348\u5F8C' || m[0].toLowerCase() === 'p') && (o = u.PM, i != 12 && (i += 12))
  }
  return a.assign('hour', i),
    o >= 0 ? a.assign('meridiem', o) : i < 12 ? a.imply('meridiem', u.AM) : a.imply('meridiem', u.PM),
    a
}
var lr = class extends M {
  patternBetween() {
    return /^\s*(の)?\s*$/i
  }
}
var cr = class extends B {
  mergeResults(e, t, r) {
    let n = t.clone()
    return n.text = t.text + e + r.text,
      n.start.assign('weekday', r.start.get('weekday')),
      n.end && n.end.assign('weekday', r.start.get('weekday')),
      n
  }
  shouldMergeResults(e, t, r) {
    return t.start.isCertain('day') && r.start.isOnlyWeekdayComponent() && !r.start.isCertain('hour') &&
      e.match(/^[,、の]?\s*$/) !== null
  }
}
var Hu = new RegExp('(?:\\(|\\\uFF08)(?<weekday>' + Object.keys(Ze).join('|') + ')(?:\\)|\\\uFF09)', 'i')
var pr = class {
  pattern() {
    return Hu
  }
  extract(e, t) {
    let r = t.groups.weekday, n = Ze[r]
    return n === void 0 ? null : I(e.reference, n)
  }
}
var Js = new g(pa())
var zu = new g(Qs(true))
function qu(s8, e, t) {
  return Js.parse(s8, e, t)
}
function Vu(s8, e, t) {
  return Js.parseDate(s8, e, t)
}
function pa() {
  let s8 = Qs(false)
  return s8.parsers.unshift(new ar()), s8
}
function Qs(s8 = true) {
  let e = N({
    parsers: [
      new ir(),
      new mr(),
      new pr(),
      new fr(),
      new ur(),
    ],
    refiners: [
      new cr(),
      new lr(),
      new or(),
    ],
  }, s8)
  return e.refiners = e.refiners.filter((t) => !(t instanceof De)), e
}
var xa = {}
H(xa, {
  Chrono: () => g,
  Meridiem: () => u,
  ParsingComponents: () => c,
  ParsingResult: () => x,
  ReferenceWithTimezone: () => E,
  Weekday: () => y,
  casual: () => ri,
  createCasualConfiguration: () => Pa,
  createConfiguration: () => ni,
  parse: () => rl,
  parseDate: () => nl,
  strict: () => tl,
})
var ei = {
  domingo: 0,
  dom: 0,
  segunda: 1,
  'segunda-feira': 1,
  seg: 1,
  terça: 2,
  'ter\xE7a-feira': 2,
  ter: 2,
  quarta: 3,
  'quarta-feira': 3,
  qua: 3,
  quinta: 4,
  'quinta-feira': 4,
  qui: 4,
  sexta: 5,
  'sexta-feira': 5,
  sex: 5,
  sábado: 6,
  sabado: 6,
  sab: 6,
}
var ti = {
  janeiro: 1,
  jan: 1,
  'jan.': 1,
  fevereiro: 2,
  fev: 2,
  'fev.': 2,
  março: 3,
  mar: 3,
  'mar.': 3,
  abril: 4,
  abr: 4,
  'abr.': 4,
  maio: 5,
  mai: 5,
  'mai.': 5,
  junho: 6,
  jun: 6,
  'jun.': 6,
  julho: 7,
  jul: 7,
  'jul.': 7,
  agosto: 8,
  ago: 8,
  'ago.': 8,
  setembro: 9,
  set: 9,
  'set.': 9,
  outubro: 10,
  out: 10,
  'out.': 10,
  novembro: 11,
  nov: 11,
  'nov.': 11,
  dezembro: 12,
  dez: 12,
  'dez.': 12,
}
var ga = '[0-9]{1,4}(?![^\\s]\\d)(?:\\s*[a|d]\\.?\\s*c\\.?|\\s*a\\.?\\s*d\\.?)?'
function Ta(s8) {
  if (s8.match(/^[0-9]{1,4}$/)) {
    let e = parseInt(s8)
    return e < 100 && (e > 50 ? e = e + 1900 : e = e + 2e3), e
  }
  return s8.match(/a\.?\s*c\.?/i) ? (s8 = s8.replace(/a\.?\s*c\.?/i, ''), -parseInt(s8)) : parseInt(s8)
}
var Ku = new RegExp(
  `(?:(?:\\,|\\(|\\\uFF08)\\s*)?(?:(este|esta|passado|pr[o\xF3]ximo)\\s*)?(${
    p(ei)
  })(?:\\s*(?:\\,|\\)|\\\uFF09))?(?:\\s*(este|esta|passado|pr[\xF3o]ximo)\\s*semana)?(?=\\W|\\d|$)`,
  'i',
)
var Xu = 1
var Zu = 2
var Ju = 3
var dr = class extends f {
  innerPattern() {
    return Ku
  }
  innerExtract(e, t) {
    let r = t[Zu].toLowerCase(), n = ei[r]
    if (n === void 0) return null
    let i = t[Xu], o = t[Ju], a = i || o || ''
    a = a.toLowerCase()
    let m = null
    return a == 'passado'
      ? m = 'this'
      : a == 'pr\xF3ximo' || a == 'proximo'
      ? m = 'next'
      : a == 'este' && (m = 'this'),
      I(e.reference, n, m)
  }
}
var gr = class extends k {
  primaryPrefix() {
    return '(?:(?:ao?|\xE0s?|das|da|de|do)\\s*)?'
  }
  followingPhase() {
    return '\\s*(?:\\-|\\\u2013|\\~|\\\u301C|a(?:o)?|\\?)\\s*'
  }
}
var Tr = class extends M {
  patternBetween() {
    return new RegExp('^\\s*(?:,|\xE0)?\\s*$')
  }
}
var yr = class extends _ {
  patternBetween() {
    return /^\s*(?:-)\s*$/i
  }
}
var Qu = new RegExp(
  `([0-9]{1,2})(?:\xBA|\xAA|\xB0)?(?:\\s*(?:desde|de|\\-|\\\u2013|ao?|\\s)\\s*([0-9]{1,2})(?:\xBA|\xAA|\xB0)?)?\\s*(?:de)?\\s*(?:-|/|\\s*(?:de|,)?\\s*)(${
    p(ti)
  })(?:\\s*(?:de|,)?\\s*(${ga}))?(?=\\W|$)`,
  'i',
)
var ya = 1
var ha = 2
var el = 3
var Ra = 4
var hr = class extends f {
  innerPattern() {
    return Qu
  }
  innerExtract(e, t) {
    let r = e.createParsingResult(t.index, t[0]), n = ti[t[el].toLowerCase()], i = parseInt(t[ya])
    if (i > 31) return t.index = t.index + t[ya].length, null
    if (r.start.assign('month', n), r.start.assign('day', i), t[Ra]) {
      let o = Ta(t[Ra])
      r.start.assign('year', o)
    } else {
      let o = P(e.refDate, i, n)
      r.start.imply('year', o)
    }
    if (t[ha]) {
      let o = parseInt(t[ha])
      r.end = r.start.clone(), r.end.assign('day', o)
    }
    return r
  }
}
var Rr = class extends f {
  innerPattern(e) {
    return /(agora|hoje|amanha|amanhã|ontem)(?=\W|$)/i
  }
  innerExtract(e, t) {
    let r = t[0].toLowerCase(), n = e.createParsingComponents()
    switch (r) {
      case 'agora':
        return Y(e.reference)
      case 'hoje':
        return W(e.reference)
      case 'amanha':
      case 'amanh\xE3':
        return F(e.reference)
      case 'ontem':
        return $(e.reference)
    }
    return n
  }
}
var Pr = class extends f {
  innerPattern() {
    return /(?:esta\s*)?(manha|manhã|tarde|meia-noite|meio-dia|noite)(?=\W|$)/i
  }
  innerExtract(e, t) {
    let r = e.refDate, n = e.createParsingComponents()
    switch (t[1].toLowerCase()) {
      case 'tarde':
        n.imply('meridiem', u.PM), n.imply('hour', 15)
        break
      case 'noite':
        n.imply('meridiem', u.PM), n.imply('hour', 22)
        break
      case 'manha':
      case 'manh\xE3':
        n.imply('meridiem', u.AM), n.imply('hour', 6)
        break
      case 'meia-noite':
        let i = new Date(r.getTime())
        i.setDate(i.getDate() + 1),
          R(n, i),
          O(n, i),
          n.imply('hour', 0),
          n.imply('minute', 0),
          n.imply('second', 0)
        break
      case 'meio-dia':
        n.imply('meridiem', u.AM), n.imply('hour', 12)
        break
    }
    return n
  }
}
var ri = new g(Pa())
var tl = new g(ni(true))
function rl(s8, e, t) {
  return ri.parse(s8, e, t)
}
function nl(s8, e, t) {
  return ri.parseDate(s8, e, t)
}
function Pa(s8 = true) {
  let e = ni(false, s8)
  return e.parsers.push(new Rr()), e.parsers.push(new Pr()), e
}
function ni(s8 = true, e = true) {
  return N({
    parsers: [
      new b(e),
      new dr(),
      new gr(),
      new hr(),
    ],
    refiners: [
      new Tr(),
      new yr(),
    ],
  }, s8)
}
var Ca = {}
H(Ca, {
  Chrono: () => g,
  Meridiem: () => u,
  ParsingComponents: () => c,
  ParsingResult: () => x,
  ReferenceWithTimezone: () => E,
  Weekday: () => y,
  casual: () => fi,
  createCasualConfiguration: () => Oa,
  createConfiguration: () => ui,
  parse: () => $l,
  parseDate: () => Fl,
  strict: () => Sl,
})
var xr = class extends _ {
  patternBetween() {
    return /^\s*(tot|-)\s*$/i
  }
}
var Er = class extends M {
  patternBetween() {
    return new RegExp('^\\s*(om|na|voor|in de|,|-)?\\s*$')
  }
}
var Dr = class extends f {
  innerPattern(e) {
    return /(nu|vandaag|morgen|morgend|gisteren)(?=\W|$)/i
  }
  innerExtract(e, t) {
    let r = t[0].toLowerCase(), n = e.createParsingComponents()
    switch (r) {
      case 'nu':
        return Y(e.reference)
      case 'vandaag':
        return W(e.reference)
      case 'morgen':
      case 'morgend':
        return F(e.reference)
      case 'gisteren':
        return $(e.reference)
    }
    return n
  }
}
var sl = 1
var il = 2
var Ar = class extends f {
  innerPattern() {
    return /(deze)?\s*(namiddag|avond|middernacht|ochtend|middag|'s middags|'s avonds|'s ochtends)(?=\W|$)/i
  }
  innerExtract(e, t) {
    let r = e.refDate, n = e.createParsingComponents()
    switch (
      t[sl] === 'deze' &&
      (n.assign('day', e.refDate.getDate()),
        n.assign('month', e.refDate.getMonth() + 1),
        n.assign('year', e.refDate.getFullYear())), t[il].toLowerCase()
    ) {
      case 'namiddag':
      case "'s namiddags":
        n.imply('meridiem', u.PM), n.imply('hour', 15)
        break
      case 'avond':
      case "'s avonds'":
        n.imply('meridiem', u.PM), n.imply('hour', 20)
        break
      case 'middernacht':
        let i = new Date(r.getTime())
        i.setDate(i.getDate() + 1),
          R(n, i),
          O(n, i),
          n.imply('hour', 0),
          n.imply('minute', 0),
          n.imply('second', 0)
        break
      case 'ochtend':
      case "'s ochtends":
        n.imply('meridiem', u.AM), n.imply('hour', 6)
        break
      case 'middag':
      case "'s middags":
        n.imply('meridiem', u.AM), n.imply('hour', 12)
        break
    }
    return n
  }
}
var oi = {
  zondag: 0,
  zon: 0,
  'zon.': 0,
  zo: 0,
  'zo.': 0,
  maandag: 1,
  ma: 1,
  'ma.': 1,
  dinsdag: 2,
  din: 2,
  'din.': 2,
  di: 2,
  'di.': 2,
  woensdag: 3,
  woe: 3,
  'woe.': 3,
  wo: 3,
  'wo.': 3,
  donderdag: 4,
  dond: 4,
  'dond.': 4,
  do: 4,
  'do.': 4,
  vrijdag: 5,
  vrij: 5,
  'vrij.': 5,
  vr: 5,
  'vr.': 5,
  zaterdag: 6,
  zat: 6,
  'zat.': 6,
  za: 6,
  'za.': 6,
}
var ge = {
  januari: 1,
  jan: 1,
  'jan.': 1,
  februari: 2,
  feb: 2,
  'feb.': 2,
  maart: 3,
  mar: 3,
  'mar.': 3,
  mrt: 3,
  'mrt.': 3,
  april: 4,
  apr: 4,
  'apr.': 4,
  mei: 5,
  juni: 6,
  jun: 6,
  'jun.': 6,
  juli: 7,
  jul: 7,
  'jul.': 7,
  augustus: 8,
  aug: 8,
  'aug.': 8,
  september: 9,
  sep: 9,
  'sep.': 9,
  sept: 9,
  'sept.': 9,
  oktober: 10,
  okt: 10,
  'okt.': 10,
  november: 11,
  nov: 11,
  'nov.': 11,
  december: 12,
  dec: 12,
  'dec.': 12,
}
var si = {
  een: 1,
  twee: 2,
  drie: 3,
  vier: 4,
  vijf: 5,
  zes: 6,
  zeven: 7,
  acht: 8,
  negen: 9,
  tien: 10,
  elf: 11,
  twaalf: 12,
}
var ii = {
  eerste: 1,
  tweede: 2,
  derde: 3,
  vierde: 4,
  vijfde: 5,
  zesde: 6,
  zevende: 7,
  achtste: 8,
  negende: 9,
  tiende: 10,
  elfde: 11,
  twaalfde: 12,
  dertiende: 13,
  veertiende: 14,
  vijftiende: 15,
  zestiende: 16,
  zeventiende: 17,
  achttiende: 18,
  negentiende: 19,
  twintigste: 20,
  eenentwintigste: 21,
  tweeëntwintigste: 22,
  drieentwintigste: 23,
  vierentwintigste: 24,
  vijfentwintigste: 25,
  zesentwintigste: 26,
  zevenentwintigste: 27,
  achtentwintig: 28,
  negenentwintig: 29,
  dertigste: 30,
  eenendertigste: 31,
}
var wr = {
  sec: 'second',
  second: 'second',
  seconden: 'second',
  min: 'minute',
  mins: 'minute',
  minute: 'minute',
  minuut: 'minute',
  minuten: 'minute',
  minuutje: 'minute',
  h: 'hour',
  hr: 'hour',
  hrs: 'hour',
  uur: 'hour',
  u: 'hour',
  uren: 'hour',
  dag: 'day',
  dagen: 'day',
  week: 'week',
  weken: 'week',
  maand: 'month',
  maanden: 'month',
  jaar: 'year',
  jr: 'year',
  jaren: 'year',
}
var ol = `(?:${p(si)}|[0-9]+|[0-9]+[\\.,][0-9]+|halve?|half|paar)`
function al(s8) {
  let e = s8.toLowerCase()
  return si[e] !== void 0
    ? si[e]
    : e === 'paar'
    ? 2
    : e === 'half' || e.match(/halve?/)
    ? 0.5
    : parseFloat(e.replace(',', '.'))
}
var ai = `(?:${p(ii)}|[0-9]{1,2}(?:ste|de)?)`
function mi(s8) {
  let e = s8.toLowerCase()
  return ii[e] !== void 0 ? ii[e] : (e = e.replace(/(?:ste|de)$/i, ''), parseInt(e))
}
var is = '(?:[1-9][0-9]{0,3}\\s*(?:voor Christus|na Christus)|[1-2][0-9]{3}|[5-9][0-9])'
function os(s8) {
  if (/voor Christus/i.test(s8)) return s8 = s8.replace(/voor Christus/i, ''), -parseInt(s8)
  if (/na Christus/i.test(s8)) return s8 = s8.replace(/na Christus/i, ''), parseInt(s8)
  let e = parseInt(s8)
  return S(e)
}
var Da = `(${ol})\\s{0,5}(${p(wr)})\\s{0,5}`
var Ea = new RegExp(Da, 'i')
var le = U('(?:(?:binnen|in)\\s*)?', Da)
function xe(s8) {
  let e = {}, t = s8, r = Ea.exec(t)
  for (; r;) ml(e, r), t = t.substring(r[0].length), r = Ea.exec(t)
  return e
}
function ml(s8, e) {
  let t = al(e[1]), r = wr[e[2].toLowerCase()]
  s8[r] = t
}
var Nr = class extends f {
  innerPattern() {
    return new RegExp('(?:binnen|in|binnen de|voor)\\s*(' + le + ')(?=\\W|$)', 'i')
  }
  innerExtract(e, t) {
    let r = xe(t[1])
    return c.createRelativeFromReference(e.reference, r)
  }
}
var fl = new RegExp(
  `(?:(?:\\,|\\(|\\\uFF08)\\s*)?(?:op\\s*?)?(?:(deze|vorige|volgende)\\s*(?:week\\s*)?)?(${p(oi)})(?=\\W|$)`,
  'i',
)
var ul = 1
var ll = 2
var cl = 3
var _r = class extends f {
  innerPattern() {
    return fl
  }
  innerExtract(e, t) {
    let r = t[ll].toLowerCase(), n = oi[r], i = t[ul], o = t[cl], a = i || o
    a = a || '', a = a.toLowerCase()
    let m = null
    return a == 'vorige' ? m = 'last' : a == 'volgende' ? m = 'next' : a == 'deze' && (m = 'this'),
      I(e.reference, n, m)
  }
}
var pl = new RegExp(
  `(?:on\\s*?)?(${ai})(?:\\s*(?:tot|\\-|\\\u2013|until|through|till|\\s)\\s*(${ai}))?(?:-|/|\\s*(?:of)?\\s*)(` +
    p(ge) + `)(?:(?:-|/|,?\\s*)(${is}(?![^\\s]\\d)))?(?=\\W|$)`,
  'i',
)
var dl = 3
var Aa = 1
var wa = 2
var Na = 4
var Mr = class extends f {
  innerPattern() {
    return pl
  }
  innerExtract(e, t) {
    let r = ge[t[dl].toLowerCase()], n = mi(t[Aa])
    if (n > 31) return t.index = t.index + t[Aa].length, null
    let i = e.createParsingComponents({
      day: n,
      month: r,
    })
    if (t[Na]) {
      let m = os(t[Na])
      i.assign('year', m)
    } else {
      let m = P(e.refDate, n, r)
      i.imply('year', m)
    }
    if (!t[wa]) return i
    let o = mi(t[wa]), a = e.createParsingResult(t.index, t[0])
    return a.start = i, a.end = i.clone(), a.end.assign('day', o), a
  }
}
var gl = new RegExp(`(${p(ge)})\\s*(?:[,-]?\\s*(${is})?)?(?=[^\\s\\w]|\\s+[^0-9]|\\s+$|$)`, 'i')
var Tl = 1
var _a = 2
var Je = class extends f {
  innerPattern() {
    return gl
  }
  innerExtract(e, t) {
    let r = e.createParsingComponents()
    r.imply('day', 1)
    let n = t[Tl], i = ge[n.toLowerCase()]
    if (r.assign('month', i), t[_a]) {
      let o = os(t[_a])
      r.assign('year', o)
    } else {
      let o = P(e.refDate, 1, i)
      r.imply('year', o)
    }
    return r
  }
}
var yl = new RegExp('([0-9]|0[1-9]|1[012])/([0-9]{4})', 'i')
var hl = 1
var Rl = 2
var Or = class extends f {
  innerPattern() {
    return yl
  }
  innerExtract(e, t) {
    let r = parseInt(t[Rl]), n = parseInt(t[hl])
    return e.createParsingComponents().imply('day', 1).assign('month', n).assign('year', r)
  }
}
var Cr = class extends k {
  primaryPrefix() {
    return '(?:(?:om)\\s*)?'
  }
  followingPhase() {
    return '\\s*(?:\\-|\\\u2013|\\~|\\\u301C|om|\\?)\\s*'
  }
  primarySuffix() {
    return '(?:\\s*(?:uur))?(?!/)(?=\\W|$)'
  }
  extractPrimaryTimeComponents(e, t) {
    return t[0].match(/^\s*\d{4}\s*$/) ? null : super.extractPrimaryTimeComponents(e, t)
  }
}
var Pl = new RegExp(`([0-9]{4})[\\.\\/\\s](?:(${p(ge)})|([0-9]{1,2}))[\\.\\/\\s]([0-9]{1,2})(?=\\W|$)`, 'i')
var xl = 1
var El = 2
var Ma = 3
var Dl = 4
var Ir = class extends f {
  innerPattern() {
    return Pl
  }
  innerExtract(e, t) {
    let r = t[Ma] ? parseInt(t[Ma]) : ge[t[El].toLowerCase()]
    if (r < 1 || r > 12) return null
    let n = parseInt(t[xl])
    return {
      day: parseInt(t[Dl]),
      month: r,
      year: n,
    }
  }
}
var Al = 1
var wl = 2
var br = class extends f {
  innerPattern(e) {
    return /(gisteren|morgen|van)(ochtend|middag|namiddag|avond|nacht)(?=\W|$)/i
  }
  innerExtract(e, t) {
    let r = t[Al].toLowerCase(), n = t[wl].toLowerCase(), i = e.createParsingComponents(), o = e.refDate
    switch (r) {
      case 'gisteren':
        let a = new Date(o.getTime())
        a.setDate(a.getDate() - 1), R(i, a)
        break
      case 'van':
        R(i, o)
        break
      case 'morgen':
        let m = new Date(o.getTime())
        m.setDate(m.getDate() + 1), R(i, m), O(i, m)
        break
    }
    switch (n) {
      case 'ochtend':
        i.imply('meridiem', u.AM), i.imply('hour', 6)
        break
      case 'middag':
        i.imply('meridiem', u.AM), i.imply('hour', 12)
        break
      case 'namiddag':
        i.imply('meridiem', u.PM), i.imply('hour', 15)
        break
      case 'avond':
        i.imply('meridiem', u.PM), i.imply('hour', 20)
        break
    }
    return i
  }
}
var Nl = new RegExp(`(dit|deze|vorig|afgelopen|(?:aan)?komend|over|\\+|-)e?\\s*(${le})(?=\\W|$)`, 'i')
var _l = 1
var Ml = 2
var Wr = class extends f {
  innerPattern() {
    return Nl
  }
  innerExtract(e, t) {
    let r = t[_l].toLowerCase(), n = xe(t[Ml])
    switch (r) {
      case 'vorig':
      case 'afgelopen':
      case '-':
        n = D(n)
        break
    }
    return c.createRelativeFromReference(e.reference, n)
  }
}
var Ol = new RegExp(`(dit|deze|(?:aan)?komend|volgend|afgelopen|vorig)e?\\s*(${p(wr)})(?=\\s*)(?=\\W|$)`, 'i')
var Cl = 1
var Il = 2
var Ur = class extends f {
  innerPattern() {
    return Ol
  }
  innerExtract(e, t) {
    let r = t[Cl].toLowerCase(), n = t[Il].toLowerCase(), i = wr[n]
    if (r == 'volgend' || r == 'komend' || r == 'aankomend') {
      let m = {}
      return m[i] = 1, c.createRelativeFromReference(e.reference, m)
    }
    if (r == 'afgelopen' || r == 'vorig') {
      let m = {}
      return m[i] = -1, c.createRelativeFromReference(e.reference, m)
    }
    let o = e.createParsingComponents(), a = new Date(e.reference.instant.getTime())
    return n.match(/week/i)
      ? (a.setDate(a.getDate() - a.getDay()),
        o.imply('day', a.getDate()),
        o.imply('month', a.getMonth() + 1),
        o.imply('year', a.getFullYear()))
      : n.match(/maand/i)
      ? (a.setDate(1),
        o.imply('day', a.getDate()),
        o.assign('year', a.getFullYear()),
        o.assign('month', a.getMonth() + 1))
      : n.match(/jaar/i) &&
        (a.setDate(1),
          a.setMonth(0),
          o.imply('day', a.getDate()),
          o.imply('month', a.getMonth() + 1),
          o.assign('year', a.getFullYear())),
      o
  }
}
var bl = new RegExp('(' + le + ')(?:geleden|voor|eerder)(?=(?:\\W|$))', 'i')
var Wl = new RegExp('(' + le + ')geleden(?=(?:\\W|$))', 'i')
var kr = class extends f {
  strictMode
  constructor(e) {
    super(), this.strictMode = e
  }
  innerPattern() {
    return this.strictMode ? Wl : bl
  }
  innerExtract(e, t) {
    let r = xe(t[1]), n = D(r)
    return c.createRelativeFromReference(e.reference, n)
  }
}
var Ul = new RegExp('(' + le + ')(later|na|vanaf nu|voortaan|vooruit|uit)(?=(?:\\W|$))', 'i')
var kl = new RegExp('(' + le + ')(later|vanaf nu)(?=(?:\\W|$))', 'i')
var Yl = 1
var Yr = class extends f {
  strictMode
  constructor(e) {
    super(), this.strictMode = e
  }
  innerPattern() {
    return this.strictMode ? kl : Ul
  }
  innerExtract(e, t) {
    let r = xe(t[Yl])
    return c.createRelativeFromReference(e.reference, r)
  }
}
var fi = new g(Oa())
var Sl = new g(ui(true))
function $l(s8, e, t) {
  return fi.parse(s8, e, t)
}
function Fl(s8, e, t) {
  return fi.parseDate(s8, e, t)
}
function Oa(s8 = true) {
  let e = ui(false, s8)
  return e.parsers.unshift(new Dr()),
    e.parsers.unshift(new Ar()),
    e.parsers.unshift(new br()),
    e.parsers.unshift(new Je()),
    e.parsers.unshift(new Ur()),
    e.parsers.unshift(new Wr()),
    e
}
function ui(s8 = true, e = true) {
  return N({
    parsers: [
      new b(e),
      new Nr(),
      new Mr(),
      new Je(),
      new _r(),
      new Ir(),
      new Or(),
      new Cr(s8),
      new kr(s8),
      new Yr(s8),
    ],
    refiners: [
      new Er(),
      new xr(),
    ],
  }, s8)
}
var Ba = {}
H(Ba, {
  Chrono: () => g,
  Meridiem: () => u,
  ParsingComponents: () => c,
  ParsingResult: () => x,
  ReferenceWithTimezone: () => E,
  Weekday: () => y,
  casual: () => wi,
  createCasualConfiguration: () => va,
  createConfiguration: () => Ni,
  hans: () => Ai,
  hant: () => Pi,
  parse: () => pc,
  parseDate: () => dc,
  strict: () => cc,
})
var G = {
  零: 0,
  '\u3007': 0,
  一: 1,
  二: 2,
  两: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
  十: 10,
}
var Qe = {
  天: 0,
  日: 0,
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
}
function ee(s8) {
  let e = 0
  for (let t = 0; t < s8.length; t++) {
    let r = s8[t]
    r === '\u5341' ? e = e === 0 ? G[r] : e * G[r] : e += G[r]
  }
  return e
}
function Ia(s8) {
  let e = ''
  for (let t = 0; t < s8.length; t++) {
    let r = s8[t]
    e = e + G[r]
  }
  return parseInt(e)
}
var li = 1
var ba = 2
var ci = 3
var Me = class extends f {
  innerPattern() {
    return new RegExp(
      '(\\d{2,4}|[' + Object.keys(G).join('') + ']{4}|[' + Object.keys(G).join('') +
        ']{2})?(?:\\s*)(?:\u5E74)?(?:[\\s|,|\uFF0C]*)(\\d{1,2}|[' + Object.keys(G).join('') +
        ']{1,3})(?:\\s*)(?:\u6708)(?:\\s*)(\\d{1,2}|[' + Object.keys(G).join('') +
        ']{1,3})?(?:\\s*)(?:\u65E5|\u53F7)?',
    )
  }
  innerExtract(e, t) {
    let r = e.createParsingResult(t.index, t[0]), n = parseInt(t[ba])
    if (isNaN(n) && (n = ee(t[ba])), r.start.assign('month', n), t[ci]) {
      let i = parseInt(t[ci])
      isNaN(i) && (i = ee(t[ci])), r.start.assign('day', i)
    } else r.start.imply('day', e.refDate.getDate())
    if (t[li]) {
      let i = parseInt(t[li])
      isNaN(i) && (i = Ia(t[li])), r.start.assign('year', i)
    } else r.start.imply('year', e.refDate.getFullYear())
    return r
  }
}
var Gl = new RegExp(
  '(\\d+|[' + Object.keys(G).join('') +
    ']+|\u534A|\u51E0)(?:\\s*)(?:\u4E2A)?(\u79D2(?:\u949F)?|\u5206\u949F|\u5C0F\u65F6|\u949F|\u65E5|\u5929|\u661F\u671F|\u793C\u62DC|\u6708|\u5E74)(?:(?:\u4E4B|\u8FC7)?\u540E|(?:\u4E4B)?\u5185)',
  'i',
)
var pi = 1
var vl = 2
var Oe = class extends f {
  innerPattern() {
    return Gl
  }
  innerExtract(e, t) {
    let r = e.createParsingResult(t.index, t[0]), n = parseInt(t[pi])
    if (isNaN(n) && (n = ee(t[pi])), isNaN(n)) {
      let l = t[pi]
      if (l === '\u51E0') n = 3
      else if (l === '\u534A') n = 0.5
      else return null
    }
    let i = {}, a = t[vl][0]
    if (a.match(/[日天星礼月年]/)) {
      a == '\u65E5' || a == '\u5929'
        ? i.day = n
        : a == '\u661F' || a == '\u793C'
        ? i.week = n
        : a == '\u6708'
        ? i.month = n
        : a == '\u5E74' && (i.year = n)
      let l = w(e.refDate, i)
      return r.start.assign('year', l.getFullYear()),
        r.start.assign('month', l.getMonth() + 1),
        r.start.assign('day', l.getDate()),
        r
    }
    a == '\u79D2'
      ? i.second = n
      : a == '\u5206'
      ? i.minute = n
      : (a == '\u5C0F' || a == '\u949F') && (i.hour = n)
    let m = w(e.refDate, i)
    return r.start.imply('year', m.getFullYear()),
      r.start.imply('month', m.getMonth() + 1),
      r.start.imply('day', m.getDate()),
      r.start.assign('hour', m.getHours()),
      r.start.assign('minute', m.getMinutes()),
      r.start.assign('second', m.getSeconds()),
      r
  }
}
var Bl = new RegExp(
  '(?<prefix>\u4E0A|\u4E0B|\u8FD9)(?:\u4E2A)?(?:\u661F\u671F|\u793C\u62DC|\u5468)(?<weekday>' +
    Object.keys(Qe).join('|') + ')',
)
var Ce = class extends f {
  innerPattern() {
    return Bl
  }
  innerExtract(e, t) {
    let r = e.createParsingResult(t.index, t[0]), n = t.groups.weekday, i = Qe[n]
    if (i === void 0) return null
    let o = null, a = t.groups.prefix
    a == '\u4E0A' ? o = 'last' : a == '\u4E0B' ? o = 'next' : a == '\u8FD9' && (o = 'this')
    let m = new Date(e.refDate.getTime()), l = false, d = m.getDay()
    if (o == 'last' || o == 'past') m.setDate(m.getDate() + (i - 7 - d)), l = true
    else if (o == 'next') m.setDate(m.getDate() + (i + 7 - d)), l = true
    else if (o == 'this') m.setDate(m.getDate() + (i - d))
    else {
      let T = i - d
      Math.abs(T - 7) < Math.abs(T) && (T -= 7),
        Math.abs(T + 7) < Math.abs(T) && (T += 7),
        m.setDate(m.getDate() + T)
    }
    return r.start.assign('weekday', i),
      l
        ? (r.start.assign('day', m.getDate()),
          r.start.assign('month', m.getMonth() + 1),
          r.start.assign('year', m.getFullYear()))
        : (r.start.imply('day', m.getDate()),
          r.start.imply('month', m.getMonth() + 1),
          r.start.imply('year', m.getFullYear())),
      r
  }
}
var Ll = new RegExp(
  '(?:\u4ECE|\u81EA)?(?:(\u4ECA|\u660E|\u524D|\u5927\u524D|\u540E|\u5927\u540E|\u6628)(\u65E9|\u671D|\u665A)|(\u4E0A(?:\u5348)|\u65E9(?:\u4E0A)|\u4E0B(?:\u5348)|\u665A(?:\u4E0A)|\u591C(?:\u665A)?|\u4E2D(?:\u5348)|\u51CC(?:\u6668))|(\u4ECA|\u660E|\u524D|\u5927\u524D|\u540E|\u5927\u540E|\u6628)(?:\u65E5|\u5929)(?:[\\s,\uFF0C]*)(?:(\u4E0A(?:\u5348)|\u65E9(?:\u4E0A)|\u4E0B(?:\u5348)|\u665A(?:\u4E0A)|\u591C(?:\u665A)?|\u4E2D(?:\u5348)|\u51CC(?:\u6668)))?)?(?:[\\s,\uFF0C]*)(?:(\\d+|[' +
    Object.keys(G).join('') + ']+)(?:\\s*)(?:\u70B9|\u65F6|:|\uFF1A)(?:\\s*)(\\d+|\u534A|\u6B63|\u6574|[' +
    Object.keys(G).join('') + ']+)?(?:\\s*)(?:\u5206|:|\uFF1A)?(?:\\s*)(\\d+|[' + Object.keys(G).join('') +
    ']+)?(?:\\s*)(?:\u79D2)?)(?:\\s*(A.M.|P.M.|AM?|PM?))?',
  'i',
)
var jl = new RegExp(
  '(?:^\\s*(?:\u5230|\u81F3|\\-|\\\u2013|\\~|\\\u301C)\\s*)(?:(\u4ECA|\u660E|\u524D|\u5927\u524D|\u540E|\u5927\u540E|\u6628)(\u65E9|\u671D|\u665A)|(\u4E0A(?:\u5348)|\u65E9(?:\u4E0A)|\u4E0B(?:\u5348)|\u665A(?:\u4E0A)|\u591C(?:\u665A)?|\u4E2D(?:\u5348)|\u51CC(?:\u6668))|(\u4ECA|\u660E|\u524D|\u5927\u524D|\u540E|\u5927\u540E|\u6628)(?:\u65E5|\u5929)(?:[\\s,\uFF0C]*)(?:(\u4E0A(?:\u5348)|\u65E9(?:\u4E0A)|\u4E0B(?:\u5348)|\u665A(?:\u4E0A)|\u591C(?:\u665A)?|\u4E2D(?:\u5348)|\u51CC(?:\u6668)))?)?(?:[\\s,\uFF0C]*)(?:(\\d+|[' +
    Object.keys(G).join('') + ']+)(?:\\s*)(?:\u70B9|\u65F6|:|\uFF1A)(?:\\s*)(\\d+|\u534A|\u6B63|\u6574|[' +
    Object.keys(G).join('') + ']+)?(?:\\s*)(?:\u5206|:|\uFF1A)?(?:\\s*)(\\d+|[' + Object.keys(G).join('') +
    ']+)?(?:\\s*)(?:\u79D2)?)(?:\\s*(A.M.|P.M.|AM?|PM?))?',
  'i',
)
var as = 1
var ms = 2
var fs = 3
var us = 4
var ls = 5
var cs = 6
var te = 7
var et = 8
var ps = 9
var Ie = class extends f {
  innerPattern() {
    return Ll
  }
  innerExtract(e, t) {
    if (t.index > 0 && e.text[t.index - 1].match(/\w/)) return null
    let r = e.createParsingResult(t.index, t[0]), n = new Date(e.refDate.getTime())
    if (t[as]) {
      let d = t[as]
      d == '\u660E'
        ? e.refDate.getHours() > 1 && n.setDate(n.getDate() + 1)
        : d == '\u6628'
        ? n.setDate(n.getDate() - 1)
        : d == '\u524D'
        ? n.setDate(n.getDate() - 2)
        : d == '\u5927\u524D'
        ? n.setDate(n.getDate() - 3)
        : d == '\u540E'
        ? n.setDate(n.getDate() + 2)
        : d == '\u5927\u540E' && n.setDate(n.getDate() + 3),
        r.start.assign('day', n.getDate()),
        r.start.assign('month', n.getMonth() + 1),
        r.start.assign('year', n.getFullYear())
    } else if (t[us]) {
      let d = t[us]
      d == '\u660E'
        ? n.setDate(n.getDate() + 1)
        : d == '\u6628'
        ? n.setDate(n.getDate() - 1)
        : d == '\u524D'
        ? n.setDate(n.getDate() - 2)
        : d == '\u5927\u524D'
        ? n.setDate(n.getDate() - 3)
        : d == '\u540E'
        ? n.setDate(n.getDate() + 2)
        : d == '\u5927\u540E' && n.setDate(n.getDate() + 3),
        r.start.assign('day', n.getDate()),
        r.start.assign('month', n.getMonth() + 1),
        r.start.assign('year', n.getFullYear())
    } else {r.start.imply('day', n.getDate()),
        r.start.imply('month', n.getMonth() + 1),
        r.start.imply('year', n.getFullYear())}
    let i = 0, o = 0, a = -1
    if (t[et]) {
      let d = parseInt(t[et])
      if (isNaN(d) && (d = ee(t[et])), d >= 60) return null
      r.start.assign('second', d)
    }
    if (
      i = parseInt(t[cs]),
        isNaN(i) && (i = ee(t[cs])),
        t[te]
          ? t[te] == '\u534A'
            ? o = 30
            : t[te] == '\u6B63' || t[te] == '\u6574'
            ? o = 0
            : (o = parseInt(t[te]), isNaN(o) && (o = ee(t[te])))
          : i > 100 && (o = i % 100, i = Math.floor(i / 100)),
        o >= 60 || i > 24
    ) return null
    if (i >= 12 && (a = 1), t[ps]) {
      if (i > 12) return null
      let d = t[ps][0].toLowerCase()
      d == 'a' && (a = 0, i == 12 && (i = 0)), d == 'p' && (a = 1, i != 12 && (i += 12))
    } else if (t[ms]) {
      let T = t[ms][0]
      T == '\u65E9' ? (a = 0, i == 12 && (i = 0)) : T == '\u665A' && (a = 1, i != 12 && (i += 12))
    } else if (t[fs]) {
      let T = t[fs][0]
      T == '\u4E0A' || T == '\u65E9' || T == '\u51CC'
        ? (a = 0, i == 12 && (i = 0))
        : (T == '\u4E0B' || T == '\u665A') && (a = 1, i != 12 && (i += 12))
    } else if (t[ls]) {
      let T = t[ls][0]
      T == '\u4E0A' || T == '\u65E9' || T == '\u51CC'
        ? (a = 0, i == 12 && (i = 0))
        : (T == '\u4E0B' || T == '\u665A') && (a = 1, i != 12 && (i += 12))
    }
    r.start.assign('hour', i),
      r.start.assign('minute', o),
      a >= 0
        ? r.start.assign('meridiem', a)
        : i < 12
        ? r.start.imply('meridiem', 0)
        : r.start.imply('meridiem', 1)
    let m = jl.exec(e.text.substring(r.index + r.text.length))
    if (!m) return r.text.match(/^\d+$/) ? null : r
    let l = new Date(n.getTime())
    if (r.end = e.createParsingComponents(), m[as]) {
      let d = m[as]
      d == '\u660E'
        ? e.refDate.getHours() > 1 && l.setDate(l.getDate() + 1)
        : d == '\u6628'
        ? l.setDate(l.getDate() - 1)
        : d == '\u524D'
        ? l.setDate(l.getDate() - 2)
        : d == '\u5927\u524D'
        ? l.setDate(l.getDate() - 3)
        : d == '\u540E'
        ? l.setDate(l.getDate() + 2)
        : d == '\u5927\u540E' && l.setDate(l.getDate() + 3),
        r.end.assign('day', l.getDate()),
        r.end.assign('month', l.getMonth() + 1),
        r.end.assign('year', l.getFullYear())
    } else if (m[us]) {
      let d = m[us]
      d == '\u660E'
        ? l.setDate(l.getDate() + 1)
        : d == '\u6628'
        ? l.setDate(l.getDate() - 1)
        : d == '\u524D'
        ? l.setDate(l.getDate() - 2)
        : d == '\u5927\u524D'
        ? l.setDate(l.getDate() - 3)
        : d == '\u540E'
        ? l.setDate(l.getDate() + 2)
        : d == '\u5927\u540E' && l.setDate(l.getDate() + 3),
        r.end.assign('day', l.getDate()),
        r.end.assign('month', l.getMonth() + 1),
        r.end.assign('year', l.getFullYear())
    } else {r.end.imply('day', l.getDate()),
        r.end.imply('month', l.getMonth() + 1),
        r.end.imply('year', l.getFullYear())}
    if (i = 0, o = 0, a = -1, m[et]) {
      let d = parseInt(m[et])
      if (isNaN(d) && (d = ee(m[et])), d >= 60) return null
      r.end.assign('second', d)
    }
    if (
      i = parseInt(m[cs]),
        isNaN(i) && (i = ee(m[cs])),
        m[te]
          ? m[te] == '\u534A'
            ? o = 30
            : m[te] == '\u6B63' || m[te] == '\u6574'
            ? o = 0
            : (o = parseInt(m[te]), isNaN(o) && (o = ee(m[te])))
          : i > 100 && (o = i % 100, i = Math.floor(i / 100)),
        o >= 60 || i > 24
    ) return null
    if (i >= 12 && (a = 1), m[ps]) {
      if (i > 12) return null
      let d = m[ps][0].toLowerCase()
      d == 'a' && (a = 0, i == 12 && (i = 0)),
        d == 'p' && (a = 1, i != 12 && (i += 12)),
        r.start.isCertain('meridiem') ||
        (a == 0
          ? (r.start.imply('meridiem', 0), r.start.get('hour') == 12 && r.start.assign('hour', 0))
          : (r.start.imply('meridiem', 1),
            r.start.get('hour') != 12 && r.start.assign('hour', r.start.get('hour') + 12)))
    } else if (m[ms]) {
      let T = m[ms][0]
      T == '\u65E9' ? (a = 0, i == 12 && (i = 0)) : T == '\u665A' && (a = 1, i != 12 && (i += 12))
    } else if (m[fs]) {
      let T = m[fs][0]
      T == '\u4E0A' || T == '\u65E9' || T == '\u51CC'
        ? (a = 0, i == 12 && (i = 0))
        : (T == '\u4E0B' || T == '\u665A') && (a = 1, i != 12 && (i += 12))
    } else if (m[ls]) {
      let T = m[ls][0]
      T == '\u4E0A' || T == '\u65E9' || T == '\u51CC'
        ? (a = 0, i == 12 && (i = 0))
        : (T == '\u4E0B' || T == '\u665A') && (a = 1, i != 12 && (i += 12))
    }
    return r.text = r.text + m[0],
      r.end.assign('hour', i),
      r.end.assign('minute', o),
      a >= 0
        ? r.end.assign('meridiem', a)
        : r.start.isCertain('meridiem') && r.start.get('meridiem') == 1 && r.start.get('hour') > i
        ? r.end.imply('meridiem', 0)
        : i > 12 && r.end.imply('meridiem', 1),
      r.end.date().getTime() < r.start.date().getTime() && r.end.imply('day', r.end.get('day') + 1),
      r
  }
}
var Hl = new RegExp('(?:\u661F\u671F|\u793C\u62DC|\u5468)(?<weekday>' + Object.keys(Qe).join('|') + ')')
var be = class extends f {
  innerPattern() {
    return Hl
  }
  innerExtract(e, t) {
    let r = e.createParsingResult(t.index, t[0]), n = t.groups.weekday, i = Qe[n]
    if (i === void 0) return null
    let o = new Date(e.refDate.getTime()), a = false, m = o.getDay(), l = i - m
    return Math.abs(l - 7) < Math.abs(l) && (l -= 7),
      Math.abs(l + 7) < Math.abs(l) && (l += 7),
      o.setDate(o.getDate() + l),
      r.start.assign('weekday', i),
      a
        ? (r.start.assign('day', o.getDate()),
          r.start.assign('month', o.getMonth() + 1),
          r.start.assign('year', o.getFullYear()))
        : (r.start.imply('day', o.getDate()),
          r.start.imply('month', o.getMonth() + 1),
          r.start.imply('year', o.getFullYear())),
      r
  }
}
var zl = 1
var Wa = 2
var ql = 3
var Ua = 4
var ka = 5
var Vl = 6
var We = class extends f {
  innerPattern(e) {
    return new RegExp(
      '(\u800C\u5BB6|\u7ACB(?:\u523B|\u5373)|\u5373\u523B)|(\u4ECA|\u660E|\u524D|\u5927\u524D|\u5F8C|\u5927\u5F8C|\u807D|\u6628|\u5C0B|\u7434)(\u65E9|\u671D|\u665A)|(\u4E0A(?:\u5348|\u665D)|\u671D(?:\u65E9)|\u65E9(?:\u4E0A)|\u4E0B(?:\u5348|\u665D)|\u664F(?:\u665D)|\u665A(?:\u4E0A)|\u591C(?:\u665A)?|\u4E2D(?:\u5348)|\u51CC(?:\u6668))|(\u4ECA|\u660E|\u524D|\u5927\u524D|\u5F8C|\u5927\u5F8C|\u807D|\u6628|\u5C0B|\u7434)(?:\u65E5|\u5929)(?:[\\s|,|\uFF0C]*)(?:(\u4E0A(?:\u5348|\u665D)|\u671D(?:\u65E9)|\u65E9(?:\u4E0A)|\u4E0B(?:\u5348|\u665D)|\u664F(?:\u665D)|\u665A(?:\u4E0A)|\u591C(?:\u665A)?|\u4E2D(?:\u5348)|\u51CC(?:\u6668)))?',
      'i',
    )
  }
  innerExtract(e, t) {
    let r = t.index, n = e.createParsingResult(r, t[0]), i = e.refDate, o = new Date(i.getTime())
    if (t[zl]) {
      n.start.imply('hour', i.getHours()),
        n.start.imply('minute', i.getMinutes()),
        n.start.imply('second', i.getSeconds()),
        n.start.imply('millisecond', i.getMilliseconds())
    } else if (t[Wa]) {
      let a = t[Wa], m = t[ql]
      a == '\u660E' || a == '\u807D'
        ? i.getHours() > 1 && o.setDate(o.getDate() + 1)
        : a == '\u6628' || a == '\u5C0B' || a == '\u7434'
        ? o.setDate(o.getDate() - 1)
        : a == '\u524D'
        ? o.setDate(o.getDate() - 2)
        : a == '\u5927\u524D'
        ? o.setDate(o.getDate() - 3)
        : a == '\u5F8C'
        ? o.setDate(o.getDate() + 2)
        : a == '\u5927\u5F8C' && o.setDate(o.getDate() + 3),
        m == '\u65E9' || m == '\u671D'
          ? n.start.imply('hour', 6)
          : m == '\u665A' && (n.start.imply('hour', 22), n.start.imply('meridiem', 1))
    } else if (t[Ua]) {
      let m = t[Ua][0]
      m == '\u65E9' || m == '\u671D' || m == '\u4E0A'
        ? n.start.imply('hour', 6)
        : m == '\u4E0B' || m == '\u664F'
        ? (n.start.imply('hour', 15), n.start.imply('meridiem', 1))
        : m == '\u4E2D'
        ? (n.start.imply('hour', 12), n.start.imply('meridiem', 1))
        : m == '\u591C' || m == '\u665A'
        ? (n.start.imply('hour', 22), n.start.imply('meridiem', 1))
        : m == '\u51CC' && n.start.imply('hour', 0)
    } else if (t[ka]) {
      let a = t[ka]
      a == '\u660E' || a == '\u807D'
        ? i.getHours() > 1 && o.setDate(o.getDate() + 1)
        : a == '\u6628' || a == '\u5C0B' || a == '\u7434'
        ? o.setDate(o.getDate() - 1)
        : a == '\u524D'
        ? o.setDate(o.getDate() - 2)
        : a == '\u5927\u524D'
        ? o.setDate(o.getDate() - 3)
        : a == '\u5F8C'
        ? o.setDate(o.getDate() + 2)
        : a == '\u5927\u5F8C' && o.setDate(o.getDate() + 3)
      let m = t[Vl]
      if (m) {
        let l = m[0]
        l == '\u65E9' || l == '\u671D' || l == '\u4E0A'
          ? n.start.imply('hour', 6)
          : l == '\u4E0B' || l == '\u664F'
          ? (n.start.imply('hour', 15), n.start.imply('meridiem', 1))
          : l == '\u4E2D'
          ? (n.start.imply('hour', 12), n.start.imply('meridiem', 1))
          : l == '\u591C' || l == '\u665A'
          ? (n.start.imply('hour', 22), n.start.imply('meridiem', 1))
          : l == '\u51CC' && n.start.imply('hour', 0)
      }
    }
    return n.start.assign('day', o.getDate()),
      n.start.assign('month', o.getMonth() + 1),
      n.start.assign('year', o.getFullYear()),
      n
  }
}
var v = {
  零: 0,
  一: 1,
  二: 2,
  兩: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
  七: 7,
  八: 8,
  九: 9,
  十: 10,
  廿: 20,
  卅: 30,
}
var tt = {
  天: 0,
  日: 0,
  一: 1,
  二: 2,
  三: 3,
  四: 4,
  五: 5,
  六: 6,
}
function re(s8) {
  let e = 0
  for (let t = 0; t < s8.length; t++) {
    let r = s8[t]
    r === '\u5341' ? e = e === 0 ? v[r] : e * v[r] : e += v[r]
  }
  return e
}
function Ya(s8) {
  let e = ''
  for (let t = 0; t < s8.length; t++) {
    let r = s8[t]
    e = e + v[r]
  }
  return parseInt(e)
}
var di = 1
var Sa = 2
var gi = 3
var Ue = class extends f {
  innerPattern() {
    return new RegExp(
      '(\\d{2,4}|[' + Object.keys(v).join('') + ']{4}|[' + Object.keys(v).join('') +
        ']{2})?(?:\\s*)(?:\u5E74)?(?:[\\s|,|\uFF0C]*)(\\d{1,2}|[' + Object.keys(v).join('') +
        ']{1,2})(?:\\s*)(?:\u6708)(?:\\s*)(\\d{1,2}|[' + Object.keys(v).join('') +
        ']{1,2})?(?:\\s*)(?:\u65E5|\u865F)?',
    )
  }
  innerExtract(e, t) {
    let r = e.createParsingResult(t.index, t[0]), n = parseInt(t[Sa])
    if (isNaN(n) && (n = re(t[Sa])), r.start.assign('month', n), t[gi]) {
      let i = parseInt(t[gi])
      isNaN(i) && (i = re(t[gi])), r.start.assign('day', i)
    } else r.start.imply('day', e.refDate.getDate())
    if (t[di]) {
      let i = parseInt(t[di])
      isNaN(i) && (i = Ya(t[di])), r.start.assign('year', i)
    } else r.start.imply('year', e.refDate.getFullYear())
    return r
  }
}
var Kl = new RegExp(
  '(\\d+|[' + Object.keys(v).join('') +
    ']+|\u534A|\u5E7E)(?:\\s*)(?:\u500B)?(\u79D2(?:\u9418)?|\u5206\u9418|\u5C0F\u6642|\u9418|\u65E5|\u5929|\u661F\u671F|\u79AE\u62DC|\u6708|\u5E74)(?:(?:\u4E4B|\u904E)?\u5F8C|(?:\u4E4B)?\u5167)',
  'i',
)
var Ti = 1
var Xl = 2
var ke = class extends f {
  innerPattern() {
    return Kl
  }
  innerExtract(e, t) {
    let r = e.createParsingResult(t.index, t[0]), n = parseInt(t[Ti])
    if (isNaN(n) && (n = re(t[Ti])), isNaN(n)) {
      let l = t[Ti]
      if (l === '\u5E7E') n = 3
      else if (l === '\u534A') n = 0.5
      else return null
    }
    let i = {}, a = t[Xl][0]
    if (a.match(/[日天星禮月年]/)) {
      a == '\u65E5' || a == '\u5929'
        ? i.day = n
        : a == '\u661F' || a == '\u79AE'
        ? i.week = n
        : a == '\u6708'
        ? i.month = n
        : a == '\u5E74' && (i.year = n)
      let l = w(e.refDate, i)
      return r.start.assign('year', l.getFullYear()),
        r.start.assign('month', l.getMonth() + 1),
        r.start.assign('day', l.getDate()),
        r
    }
    a == '\u79D2'
      ? i.second = n
      : a == '\u5206'
      ? i.minute = n
      : (a == '\u5C0F' || a == '\u9418') && (i.hour = n)
    let m = w(e.refDate, i)
    return r.start.imply('year', m.getFullYear()),
      r.start.imply('month', m.getMonth() + 1),
      r.start.imply('day', m.getDate()),
      r.start.assign('hour', m.getHours()),
      r.start.assign('minute', m.getMinutes()),
      r.start.assign('second', m.getSeconds()),
      r
  }
}
var Zl = new RegExp(
  '(?<prefix>\u4E0A|\u4ECA|\u4E0B|\u9019|\u5462)(?:\u500B)?(?:\u661F\u671F|\u79AE\u62DC|\u9031)(?<weekday>' +
    Object.keys(tt).join('|') + ')',
)
var Ye = class extends f {
  innerPattern() {
    return Zl
  }
  innerExtract(e, t) {
    let r = e.createParsingResult(t.index, t[0]), n = t.groups.weekday, i = tt[n]
    if (i === void 0) return null
    let o = null, a = t.groups.prefix
    a == '\u4E0A'
      ? o = 'last'
      : a == '\u4E0B'
      ? o = 'next'
      : (a == '\u4ECA' || a == '\u9019' || a == '\u5462') && (o = 'this')
    let m = new Date(e.refDate.getTime()), l = false, d = m.getDay()
    if (o == 'last' || o == 'past') m.setDate(m.getDate() + (i - 7 - d)), l = true
    else if (o == 'next') m.setDate(m.getDate() + (i + 7 - d)), l = true
    else if (o == 'this') m.setDate(m.getDate() + (i - d))
    else {
      let T = i - d
      Math.abs(T - 7) < Math.abs(T) && (T -= 7),
        Math.abs(T + 7) < Math.abs(T) && (T += 7),
        m.setDate(m.getDate() + T)
    }
    return r.start.assign('weekday', i),
      l
        ? (r.start.assign('day', m.getDate()),
          r.start.assign('month', m.getMonth() + 1),
          r.start.assign('year', m.getFullYear()))
        : (r.start.imply('day', m.getDate()),
          r.start.imply('month', m.getMonth() + 1),
          r.start.imply('year', m.getFullYear())),
      r
  }
}
var Jl = new RegExp(
  '(?:\u7531|\u5F9E|\u81EA)?(?:(\u4ECA|\u660E|\u524D|\u5927\u524D|\u5F8C|\u5927\u5F8C|\u807D|\u6628|\u5C0B|\u7434)(\u65E9|\u671D|\u665A)|(\u4E0A(?:\u5348|\u665D)|\u671D(?:\u65E9)|\u65E9(?:\u4E0A)|\u4E0B(?:\u5348|\u665D)|\u664F(?:\u665D)|\u665A(?:\u4E0A)|\u591C(?:\u665A)?|\u4E2D(?:\u5348)|\u51CC(?:\u6668))|(\u4ECA|\u660E|\u524D|\u5927\u524D|\u5F8C|\u5927\u5F8C|\u807D|\u6628|\u5C0B|\u7434)(?:\u65E5|\u5929)(?:[\\s,\uFF0C]*)(?:(\u4E0A(?:\u5348|\u665D)|\u671D(?:\u65E9)|\u65E9(?:\u4E0A)|\u4E0B(?:\u5348|\u665D)|\u664F(?:\u665D)|\u665A(?:\u4E0A)|\u591C(?:\u665A)?|\u4E2D(?:\u5348)|\u51CC(?:\u6668)))?)?(?:[\\s,\uFF0C]*)(?:(\\d+|[' +
    Object.keys(v).join('') + ']+)(?:\\s*)(?:\u9EDE|\u6642|:|\uFF1A)(?:\\s*)(\\d+|\u534A|\u6B63|\u6574|[' +
    Object.keys(v).join('') + ']+)?(?:\\s*)(?:\u5206|:|\uFF1A)?(?:\\s*)(\\d+|[' + Object.keys(v).join('') +
    ']+)?(?:\\s*)(?:\u79D2)?)(?:\\s*(A.M.|P.M.|AM?|PM?))?',
  'i',
)
var Ql = new RegExp(
  '(?:^\\s*(?:\u5230|\u81F3|\\-|\\\u2013|\\~|\\\u301C)\\s*)(?:(\u4ECA|\u660E|\u524D|\u5927\u524D|\u5F8C|\u5927\u5F8C|\u807D|\u6628|\u5C0B|\u7434)(\u65E9|\u671D|\u665A)|(\u4E0A(?:\u5348|\u665D)|\u671D(?:\u65E9)|\u65E9(?:\u4E0A)|\u4E0B(?:\u5348|\u665D)|\u664F(?:\u665D)|\u665A(?:\u4E0A)|\u591C(?:\u665A)?|\u4E2D(?:\u5348)|\u51CC(?:\u6668))|(\u4ECA|\u660E|\u524D|\u5927\u524D|\u5F8C|\u5927\u5F8C|\u807D|\u6628|\u5C0B|\u7434)(?:\u65E5|\u5929)(?:[\\s,\uFF0C]*)(?:(\u4E0A(?:\u5348|\u665D)|\u671D(?:\u65E9)|\u65E9(?:\u4E0A)|\u4E0B(?:\u5348|\u665D)|\u664F(?:\u665D)|\u665A(?:\u4E0A)|\u591C(?:\u665A)?|\u4E2D(?:\u5348)|\u51CC(?:\u6668)))?)?(?:[\\s,\uFF0C]*)(?:(\\d+|[' +
    Object.keys(v).join('') + ']+)(?:\\s*)(?:\u9EDE|\u6642|:|\uFF1A)(?:\\s*)(\\d+|\u534A|\u6B63|\u6574|[' +
    Object.keys(v).join('') + ']+)?(?:\\s*)(?:\u5206|:|\uFF1A)?(?:\\s*)(\\d+|[' + Object.keys(v).join('') +
    ']+)?(?:\\s*)(?:\u79D2)?)(?:\\s*(A.M.|P.M.|AM?|PM?))?',
  'i',
)
var ds = 1
var gs = 2
var Ts = 3
var ys = 4
var hs = 5
var Rs = 6
var ne = 7
var rt = 8
var Ps = 9
var Se = class extends f {
  innerPattern() {
    return Jl
  }
  innerExtract(e, t) {
    if (t.index > 0 && e.text[t.index - 1].match(/\w/)) return null
    let r = e.createParsingResult(t.index, t[0]), n = new Date(e.refDate.getTime())
    if (t[ds]) {
      let h = t[ds]
      h == '\u660E' || h == '\u807D'
        ? e.refDate.getHours() > 1 && n.setDate(n.getDate() + 1)
        : h == '\u6628' || h == '\u5C0B' || h == '\u7434'
        ? n.setDate(n.getDate() - 1)
        : h == '\u524D'
        ? n.setDate(n.getDate() - 2)
        : h == '\u5927\u524D'
        ? n.setDate(n.getDate() - 3)
        : h == '\u5F8C'
        ? n.setDate(n.getDate() + 2)
        : h == '\u5927\u5F8C' && n.setDate(n.getDate() + 3),
        r.start.assign('day', n.getDate()),
        r.start.assign('month', n.getMonth() + 1),
        r.start.assign('year', n.getFullYear())
    } else if (t[ys]) {
      let h = t[ys]
      h == '\u660E' || h == '\u807D'
        ? n.setDate(n.getDate() + 1)
        : h == '\u6628' || h == '\u5C0B' || h == '\u7434'
        ? n.setDate(n.getDate() - 1)
        : h == '\u524D'
        ? n.setDate(n.getDate() - 2)
        : h == '\u5927\u524D'
        ? n.setDate(n.getDate() - 3)
        : h == '\u5F8C'
        ? n.setDate(n.getDate() + 2)
        : h == '\u5927\u5F8C' && n.setDate(n.getDate() + 3),
        r.start.assign('day', n.getDate()),
        r.start.assign('month', n.getMonth() + 1),
        r.start.assign('year', n.getFullYear())
    } else {r.start.imply('day', n.getDate()),
        r.start.imply('month', n.getMonth() + 1),
        r.start.imply('year', n.getFullYear())}
    let i = 0, o = 0, a = -1
    if (t[rt]) {
      var m = parseInt(t[rt])
      if (isNaN(m) && (m = re(t[rt])), m >= 60) return null
      r.start.assign('second', m)
    }
    if (
      i = parseInt(t[Rs]),
        isNaN(i) && (i = re(t[Rs])),
        t[ne]
          ? t[ne] == '\u534A'
            ? o = 30
            : t[ne] == '\u6B63' || t[ne] == '\u6574'
            ? o = 0
            : (o = parseInt(t[ne]), isNaN(o) && (o = re(t[ne])))
          : i > 100 && (o = i % 100, i = Math.floor(i / 100)),
        o >= 60 || i > 24
    ) return null
    if (i >= 12 && (a = 1), t[Ps]) {
      if (i > 12) return null
      var l = t[Ps][0].toLowerCase()
      l == 'a' && (a = 0, i == 12 && (i = 0)), l == 'p' && (a = 1, i != 12 && (i += 12))
    } else if (t[gs]) {
      var d = t[gs], T = d[0]
      T == '\u671D' || T == '\u65E9'
        ? (a = 0, i == 12 && (i = 0))
        : T == '\u665A' && (a = 1, i != 12 && (i += 12))
    } else if (t[Ts]) {
      var jn = t[Ts], L = jn[0]
      L == '\u4E0A' || L == '\u671D' || L == '\u65E9' || L == '\u51CC'
        ? (a = 0, i == 12 && (i = 0))
        : (L == '\u4E0B' || L == '\u664F' || L == '\u665A') && (a = 1, i != 12 && (i += 12))
    } else if (t[hs]) {
      var jm = t[hs], j = jm[0]
      j == '\u4E0A' || j == '\u671D' || j == '\u65E9' || j == '\u51CC'
        ? (a = 0, i == 12 && (i = 0))
        : (j == '\u4E0B' || j == '\u664F' || j == '\u665A') && (a = 1, i != 12 && (i += 12))
    }
    r.start.assign('hour', i),
      r.start.assign('minute', o),
      a >= 0
        ? r.start.assign('meridiem', a)
        : i < 12
        ? r.start.imply('meridiem', 0)
        : r.start.imply('meridiem', 1)
    let C = Ql.exec(e.text.substring(r.index + r.text.length))
    if (!C) return r.text.match(/^\d+$/) ? null : r
    let A = new Date(n.getTime())
    if (r.end = e.createParsingComponents(), C[ds]) {
      let h = C[ds]
      h == '\u660E' || h == '\u807D'
        ? e.refDate.getHours() > 1 && A.setDate(A.getDate() + 1)
        : h == '\u6628' || h == '\u5C0B' || h == '\u7434'
        ? A.setDate(A.getDate() - 1)
        : h == '\u524D'
        ? A.setDate(A.getDate() - 2)
        : h == '\u5927\u524D'
        ? A.setDate(A.getDate() - 3)
        : h == '\u5F8C'
        ? A.setDate(A.getDate() + 2)
        : h == '\u5927\u5F8C' && A.setDate(A.getDate() + 3),
        r.end.assign('day', A.getDate()),
        r.end.assign('month', A.getMonth() + 1),
        r.end.assign('year', A.getFullYear())
    } else if (C[ys]) {
      let h = C[ys]
      h == '\u660E' || h == '\u807D'
        ? A.setDate(A.getDate() + 1)
        : h == '\u6628' || h == '\u5C0B' || h == '\u7434'
        ? A.setDate(A.getDate() - 1)
        : h == '\u524D'
        ? A.setDate(A.getDate() - 2)
        : h == '\u5927\u524D'
        ? A.setDate(A.getDate() - 3)
        : h == '\u5F8C'
        ? A.setDate(A.getDate() + 2)
        : h == '\u5927\u5F8C' && A.setDate(A.getDate() + 3),
        r.end.assign('day', A.getDate()),
        r.end.assign('month', A.getMonth() + 1),
        r.end.assign('year', A.getFullYear())
    } else {r.end.imply('day', A.getDate()),
        r.end.imply('month', A.getMonth() + 1),
        r.end.imply('year', A.getFullYear())}
    if (i = 0, o = 0, a = -1, C[rt]) {
      let h = parseInt(C[rt])
      if (isNaN(h) && (h = re(C[rt])), h >= 60) return null
      r.end.assign('second', h)
    }
    if (
      i = parseInt(C[Rs]),
        isNaN(i) && (i = re(C[Rs])),
        C[ne]
          ? C[ne] == '\u534A'
            ? o = 30
            : C[ne] == '\u6B63' || C[ne] == '\u6574'
            ? o = 0
            : (o = parseInt(C[ne]), isNaN(o) && (o = re(C[ne])))
          : i > 100 && (o = i % 100, i = Math.floor(i / 100)),
        o >= 60 || i > 24
    ) return null
    if (i >= 12 && (a = 1), C[Ps]) {
      if (i > 12) return null
      var l = C[Ps][0].toLowerCase()
      l == 'a' && (a = 0, i == 12 && (i = 0)),
        l == 'p' && (a = 1, i != 12 && (i += 12)),
        r.start.isCertain('meridiem') ||
        (a == 0
          ? (r.start.imply('meridiem', 0), r.start.get('hour') == 12 && r.start.assign('hour', 0))
          : (r.start.imply('meridiem', 1),
            r.start.get('hour') != 12 && r.start.assign('hour', r.start.get('hour') + 12)))
    } else if (C[gs]) {
      var T = C[gs][0]
      T == '\u671D' || T == '\u65E9'
        ? (a = 0, i == 12 && (i = 0))
        : T == '\u665A' && (a = 1, i != 12 && (i += 12))
    } else if (C[Ts]) {
      var L = C[Ts][0]
      L == '\u4E0A' || L == '\u671D' || L == '\u65E9' || L == '\u51CC'
        ? (a = 0, i == 12 && (i = 0))
        : (L == '\u4E0B' || L == '\u664F' || L == '\u665A') && (a = 1, i != 12 && (i += 12))
    } else if (C[hs]) {
      var j = C[hs][0]
      j == '\u4E0A' || j == '\u671D' || j == '\u65E9' || j == '\u51CC'
        ? (a = 0, i == 12 && (i = 0))
        : (j == '\u4E0B' || j == '\u664F' || j == '\u665A') && (a = 1, i != 12 && (i += 12))
    }
    return r.text = r.text + C[0],
      r.end.assign('hour', i),
      r.end.assign('minute', o),
      a >= 0
        ? r.end.assign('meridiem', a)
        : r.start.isCertain('meridiem') && r.start.get('meridiem') == 1 && r.start.get('hour') > i
        ? r.end.imply('meridiem', 0)
        : i > 12 && r.end.imply('meridiem', 1),
      r.end.date().getTime() < r.start.date().getTime() && r.end.imply('day', r.end.get('day') + 1),
      r
  }
}
var ec = new RegExp('(?:\u661F\u671F|\u79AE\u62DC|\u9031)(?<weekday>' + Object.keys(tt).join('|') + ')')
var $e = class extends f {
  innerPattern() {
    return ec
  }
  innerExtract(e, t) {
    let r = e.createParsingResult(t.index, t[0]), n = t.groups.weekday, i = tt[n]
    if (i === void 0) return null
    let o = new Date(e.refDate.getTime()), a = false, m = o.getDay(), l = i - m
    return Math.abs(l - 7) < Math.abs(l) && (l -= 7),
      Math.abs(l + 7) < Math.abs(l) && (l += 7),
      o.setDate(o.getDate() + l),
      r.start.assign('weekday', i),
      a
        ? (r.start.assign('day', o.getDate()),
          r.start.assign('month', o.getMonth() + 1),
          r.start.assign('year', o.getFullYear()))
        : (r.start.imply('day', o.getDate()),
          r.start.imply('month', o.getMonth() + 1),
          r.start.imply('year', o.getFullYear())),
      r
  }
}
var Fe = class extends _ {
  patternBetween() {
    return /^\s*(至|到|\-|\~|～|－|ー)\s*$/i
  }
}
var Ge = class extends M {
  patternBetween() {
    return /^\s*$/i
  }
}
var Pi = {}
H(Pi, {
  Chrono: () => g,
  Meridiem: () => u,
  ParsingComponents: () => c,
  ParsingResult: () => x,
  ReferenceWithTimezone: () => E,
  Weekday: () => y,
  casual: () => yi,
  createCasualConfiguration: () => hi,
  createConfiguration: () => Ri,
  hant: () => tc,
  parse: () => nc,
  parseDate: () => sc,
  strict: () => rc,
})
var tc = new g(hi())
var yi = new g(hi())
var rc = new g(Ri())
function nc(s8, e, t) {
  return yi.parse(s8, e, t)
}
function sc(s8, e, t) {
  return yi.parseDate(s8, e, t)
}
function hi() {
  let s8 = Ri()
  return s8.parsers.unshift(new We()), s8
}
function Ri() {
  let s8 = N({
    parsers: [
      new Ue(),
      new Ye(),
      new $e(),
      new Se(),
      new ke(),
    ],
    refiners: [
      new Fe(),
      new Ge(),
    ],
  })
  return s8.refiners = s8.refiners.filter((e) => !(e instanceof oe)), s8
}
var Ai = {}
H(Ai, {
  Chrono: () => g,
  Meridiem: () => u,
  ParsingComponents: () => c,
  ParsingResult: () => x,
  ReferenceWithTimezone: () => E,
  Weekday: () => y,
  casual: () => xi,
  createCasualConfiguration: () => Ei,
  createConfiguration: () => Di,
  hans: () => mc,
  parse: () => uc,
  parseDate: () => lc,
  strict: () => fc,
})
var ic = 1
var $a = 2
var oc = 3
var Fa = 4
var Ga = 5
var ac = 6
var Sr = class extends f {
  innerPattern(e) {
    return new RegExp(
      '(\u73B0\u5728|\u7ACB(?:\u523B|\u5373)|\u5373\u523B)|(\u4ECA|\u660E|\u524D|\u5927\u524D|\u540E|\u5927\u540E|\u6628)(\u65E9|\u665A)|(\u4E0A(?:\u5348)|\u65E9(?:\u4E0A)|\u4E0B(?:\u5348)|\u665A(?:\u4E0A)|\u591C(?:\u665A)?|\u4E2D(?:\u5348)|\u51CC(?:\u6668))|(\u4ECA|\u660E|\u524D|\u5927\u524D|\u540E|\u5927\u540E|\u6628)(?:\u65E5|\u5929)(?:[\\s|,|\uFF0C]*)(?:(\u4E0A(?:\u5348)|\u65E9(?:\u4E0A)|\u4E0B(?:\u5348)|\u665A(?:\u4E0A)|\u591C(?:\u665A)?|\u4E2D(?:\u5348)|\u51CC(?:\u6668)))?',
      'i',
    )
  }
  innerExtract(e, t) {
    let r = t.index, n = e.createParsingResult(r, t[0]), i = e.refDate, o = new Date(i.getTime())
    if (t[ic]) {
      n.start.imply('hour', i.getHours()),
        n.start.imply('minute', i.getMinutes()),
        n.start.imply('second', i.getSeconds()),
        n.start.imply('millisecond', i.getMilliseconds())
    } else if (t[$a]) {
      let a = t[$a], m = t[oc]
      a == '\u660E'
        ? i.getHours() > 1 && o.setDate(o.getDate() + 1)
        : a == '\u6628'
        ? o.setDate(o.getDate() - 1)
        : a == '\u524D'
        ? o.setDate(o.getDate() - 2)
        : a == '\u5927\u524D'
        ? o.setDate(o.getDate() - 3)
        : a == '\u540E'
        ? o.setDate(o.getDate() + 2)
        : a == '\u5927\u540E' && o.setDate(o.getDate() + 3),
        m == '\u65E9'
          ? n.start.imply('hour', 6)
          : m == '\u665A' && (n.start.imply('hour', 22), n.start.imply('meridiem', 1))
    } else if (t[Fa]) {
      let m = t[Fa][0]
      m == '\u65E9' || m == '\u4E0A'
        ? n.start.imply('hour', 6)
        : m == '\u4E0B'
        ? (n.start.imply('hour', 15), n.start.imply('meridiem', 1))
        : m == '\u4E2D'
        ? (n.start.imply('hour', 12), n.start.imply('meridiem', 1))
        : m == '\u591C' || m == '\u665A'
        ? (n.start.imply('hour', 22), n.start.imply('meridiem', 1))
        : m == '\u51CC' && n.start.imply('hour', 0)
    } else if (t[Ga]) {
      let a = t[Ga]
      a == '\u660E'
        ? i.getHours() > 1 && o.setDate(o.getDate() + 1)
        : a == '\u6628'
        ? o.setDate(o.getDate() - 1)
        : a == '\u524D'
        ? o.setDate(o.getDate() - 2)
        : a == '\u5927\u524D'
        ? o.setDate(o.getDate() - 3)
        : a == '\u540E'
        ? o.setDate(o.getDate() + 2)
        : a == '\u5927\u540E' && o.setDate(o.getDate() + 3)
      let m = t[ac]
      if (m) {
        let l = m[0]
        l == '\u65E9' || l == '\u4E0A'
          ? n.start.imply('hour', 6)
          : l == '\u4E0B'
          ? (n.start.imply('hour', 15), n.start.imply('meridiem', 1))
          : l == '\u4E2D'
          ? (n.start.imply('hour', 12), n.start.imply('meridiem', 1))
          : l == '\u591C' || l == '\u665A'
          ? (n.start.imply('hour', 22), n.start.imply('meridiem', 1))
          : l == '\u51CC' && n.start.imply('hour', 0)
      }
    }
    return n.start.assign('day', o.getDate()),
      n.start.assign('month', o.getMonth() + 1),
      n.start.assign('year', o.getFullYear()),
      n
  }
}
var $r = class extends _ {
  patternBetween() {
    return /^\s*(至|到|-|~|～|－|ー)\s*$/i
  }
}
var Fr = class extends M {
  patternBetween() {
    return /^\s*$/i
  }
}
var mc = new g(Ei())
var xi = new g(Ei())
var fc = new g(Di())
function uc(s8, e, t) {
  return xi.parse(s8, e, t)
}
function lc(s8, e, t) {
  return xi.parseDate(s8, e, t)
}
function Ei() {
  let s8 = Di()
  return s8.parsers.unshift(new Sr()), s8
}
function Di() {
  let s8 = N({
    parsers: [
      new Me(),
      new Ce(),
      new be(),
      new Ie(),
      new Oe(),
    ],
    refiners: [
      new $r(),
      new Fr(),
    ],
  })
  return s8.refiners = s8.refiners.filter((e) => !(e instanceof oe)), s8
}
var wi = new g(va())
var cc = new g(Ni())
function pc(s8, e, t) {
  return wi.parse(s8, e, t)
}
function dc(s8, e, t) {
  return wi.parseDate(s8, e, t)
}
function va() {
  let s8 = Ni()
  return s8.parsers.unshift(new We()), s8
}
function Ni() {
  let s8 = N({
    parsers: [
      new Ue(),
      new Me(),
      new Ye(),
      new Ce(),
      new $e(),
      new be(),
      new Se(),
      new Ie(),
      new ke(),
      new Oe(),
    ],
    refiners: [
      new Fe(),
      new Ge(),
    ],
  })
  return s8.refiners = s8.refiners.filter((e) => !(e instanceof oe)), s8
}
var Za = {}
H(Za, {
  Chrono: () => g,
  Meridiem: () => u,
  ParsingComponents: () => c,
  ParsingResult: () => x,
  ReferenceWithTimezone: () => E,
  Weekday: () => y,
  casual: () => Ui,
  createCasualConfiguration: () => Xa,
  createConfiguration: () => ki,
  parse: () => Nc,
  parseDate: () => _c,
  strict: () => wc,
})
var X = {
  leftBoundary: '([^\\p{L}\\p{N}_]|^)',
  rightBoundary: '(?=[^\\p{L}\\p{N}_]|$)',
  flags: 'iu',
}
var Ci = {
  воскресенье: 0,
  воскресенья: 0,
  вск: 0,
  '\u0432\u0441\u043A.': 0,
  понедельник: 1,
  понедельника: 1,
  пн: 1,
  '\u043F\u043D.': 1,
  вторник: 2,
  вторника: 2,
  вт: 2,
  '\u0432\u0442.': 2,
  среда: 3,
  среды: 3,
  среду: 3,
  ср: 3,
  '\u0441\u0440.': 3,
  четверг: 4,
  четверга: 4,
  чт: 4,
  '\u0447\u0442.': 4,
  пятница: 5,
  пятницу: 5,
  пятницы: 5,
  пт: 5,
  '\u043F\u0442.': 5,
  суббота: 6,
  субботу: 6,
  субботы: 6,
  сб: 6,
  '\u0441\u0431.': 6,
}
var Ii = {
  январь: 1,
  января: 1,
  январе: 1,
  февраль: 2,
  февраля: 2,
  феврале: 2,
  март: 3,
  марта: 3,
  марте: 3,
  апрель: 4,
  апреля: 4,
  апреле: 4,
  май: 5,
  мая: 5,
  мае: 5,
  июнь: 6,
  июня: 6,
  июне: 6,
  июль: 7,
  июля: 7,
  июле: 7,
  август: 8,
  августа: 8,
  августе: 8,
  сентябрь: 9,
  сентября: 9,
  сентябре: 9,
  октябрь: 10,
  октября: 10,
  октябре: 10,
  ноябрь: 11,
  ноября: 11,
  ноябре: 11,
  декабрь: 12,
  декабря: 12,
  декабре: 12,
}
var nt = {
  ...Ii,
  янв: 1,
  '\u044F\u043D\u0432.': 1,
  фев: 2,
  '\u0444\u0435\u0432.': 2,
  мар: 3,
  '\u043C\u0430\u0440.': 3,
  апр: 4,
  '\u0430\u043F\u0440.': 4,
  авг: 8,
  '\u0430\u0432\u0433.': 8,
  сен: 9,
  '\u0441\u0435\u043D.': 9,
  окт: 10,
  '\u043E\u043A\u0442.': 10,
  ноя: 11,
  '\u043D\u043E\u044F.': 11,
  дек: 12,
  '\u0434\u0435\u043A.': 12,
}
var Mi = {
  один: 1,
  одна: 1,
  одной: 1,
  одну: 1,
  две: 2,
  два: 2,
  двух: 2,
  три: 3,
  трех: 3,
  трёх: 3,
  четыре: 4,
  четырех: 4,
  четырёх: 4,
  пять: 5,
  пяти: 5,
  шесть: 6,
  шести: 6,
  семь: 7,
  семи: 7,
  восемь: 8,
  восьми: 8,
  девять: 9,
  девяти: 9,
  десять: 10,
  десяти: 10,
  одиннадцать: 11,
  одиннадцати: 11,
  двенадцать: 12,
  двенадцати: 12,
}
var Oi = {
  первое: 1,
  первого: 1,
  второе: 2,
  второго: 2,
  третье: 3,
  третьего: 3,
  четвертое: 4,
  четвертого: 4,
  пятое: 5,
  пятого: 5,
  шестое: 6,
  шестого: 6,
  седьмое: 7,
  седьмого: 7,
  восьмое: 8,
  восьмого: 8,
  девятое: 9,
  девятого: 9,
  десятое: 10,
  десятого: 10,
  одиннадцатое: 11,
  одиннадцатого: 11,
  двенадцатое: 12,
  двенадцатого: 12,
  тринадцатое: 13,
  тринадцатого: 13,
  четырнадцатое: 14,
  четырнадцатого: 14,
  пятнадцатое: 15,
  пятнадцатого: 15,
  шестнадцатое: 16,
  шестнадцатого: 16,
  семнадцатое: 17,
  семнадцатого: 17,
  восемнадцатое: 18,
  восемнадцатого: 18,
  девятнадцатое: 19,
  девятнадцатого: 19,
  двадцатое: 20,
  двадцатого: 20,
  '\u0434\u0432\u0430\u0434\u0446\u0430\u0442\u044C \u043F\u0435\u0440\u0432\u043E\u0435': 21,
  '\u0434\u0432\u0430\u0434\u0446\u0430\u0442\u044C \u043F\u0435\u0440\u0432\u043E\u0433\u043E': 21,
  '\u0434\u0432\u0430\u0434\u0446\u0430\u0442\u044C \u0432\u0442\u043E\u0440\u043E\u0435': 22,
  '\u0434\u0432\u0430\u0434\u0446\u0430\u0442\u044C \u0432\u0442\u043E\u0440\u043E\u0433\u043E': 22,
  '\u0434\u0432\u0430\u0434\u0446\u0430\u0442\u044C \u0442\u0440\u0435\u0442\u044C\u0435': 23,
  '\u0434\u0432\u0430\u0434\u0446\u0430\u0442\u044C \u0442\u0440\u0435\u0442\u044C\u0435\u0433\u043E': 23,
  '\u0434\u0432\u0430\u0434\u0446\u0430\u0442\u044C \u0447\u0435\u0442\u0432\u0435\u0440\u0442\u043E\u0435':
    24,
  '\u0434\u0432\u0430\u0434\u0446\u0430\u0442\u044C \u0447\u0435\u0442\u0432\u0435\u0440\u0442\u043E\u0433\u043E':
    24,
  '\u0434\u0432\u0430\u0434\u0446\u0430\u0442\u044C \u043F\u044F\u0442\u043E\u0435': 25,
  '\u0434\u0432\u0430\u0434\u0446\u0430\u0442\u044C \u043F\u044F\u0442\u043E\u0433\u043E': 25,
  '\u0434\u0432\u0430\u0434\u0446\u0430\u0442\u044C \u0448\u0435\u0441\u0442\u043E\u0435': 26,
  '\u0434\u0432\u0430\u0434\u0446\u0430\u0442\u044C \u0448\u0435\u0441\u0442\u043E\u0433\u043E': 26,
  '\u0434\u0432\u0430\u0434\u0446\u0430\u0442\u044C \u0441\u0435\u0434\u044C\u043C\u043E\u0435': 27,
  '\u0434\u0432\u0430\u0434\u0446\u0430\u0442\u044C \u0441\u0435\u0434\u044C\u043C\u043E\u0433\u043E': 27,
  '\u0434\u0432\u0430\u0434\u0446\u0430\u0442\u044C \u0432\u043E\u0441\u044C\u043C\u043E\u0435': 28,
  '\u0434\u0432\u0430\u0434\u0446\u0430\u0442\u044C \u0432\u043E\u0441\u044C\u043C\u043E\u0433\u043E': 28,
  '\u0434\u0432\u0430\u0434\u0446\u0430\u0442\u044C \u0434\u0435\u0432\u044F\u0442\u043E\u0435': 29,
  '\u0434\u0432\u0430\u0434\u0446\u0430\u0442\u044C \u0434\u0435\u0432\u044F\u0442\u043E\u0433\u043E': 29,
  тридцатое: 30,
  тридцатого: 30,
  '\u0442\u0440\u0438\u0434\u0446\u0430\u0442\u044C \u043F\u0435\u0440\u0432\u043E\u0435': 31,
  '\u0442\u0440\u0438\u0434\u0446\u0430\u0442\u044C \u043F\u0435\u0440\u0432\u043E\u0433\u043E': 31,
}
var Gr = {
  сек: 'second',
  секунда: 'second',
  секунд: 'second',
  секунды: 'second',
  секунду: 'second',
  секундочка: 'second',
  секундочки: 'second',
  секундочек: 'second',
  секундочку: 'second',
  мин: 'minute',
  минута: 'minute',
  минут: 'minute',
  минуты: 'minute',
  минуту: 'minute',
  минуток: 'minute',
  минутки: 'minute',
  минутку: 'minute',
  минуточек: 'minute',
  минуточки: 'minute',
  минуточку: 'minute',
  час: 'hour',
  часов: 'hour',
  часа: 'hour',
  часу: 'hour',
  часиков: 'hour',
  часика: 'hour',
  часике: 'hour',
  часик: 'hour',
  день: 'day',
  дня: 'day',
  дней: 'day',
  суток: 'day',
  сутки: 'day',
  неделя: 'week',
  неделе: 'week',
  недели: 'week',
  неделю: 'week',
  недель: 'week',
  недельке: 'week',
  недельки: 'week',
  неделек: 'week',
  месяц: 'month',
  месяце: 'month',
  месяцев: 'month',
  месяца: 'month',
  квартал: 'quarter',
  квартале: 'quarter',
  кварталов: 'quarter',
  год: 'year',
  года: 'year',
  году: 'year',
  годов: 'year',
  лет: 'year',
  годик: 'year',
  годика: 'year',
  годиков: 'year',
}
var gc = `(?:${
  p(Mi)
}|[0-9]+|[0-9]+\\.[0-9]+|\u043F\u043E\u043B|\u043D\u0435\u0441\u043A\u043E\u043B\u044C\u043A\u043E|\u043F\u0430\u0440(?:\u044B|\u0443)|\\s{0,3})`
function Tc(s8) {
  let e = s8.toLowerCase()
  return Mi[e] !== void 0
    ? Mi[e]
    : e.match(/несколько/)
    ? 3
    : e.match(/пол/)
    ? 0.5
    : e.match(/пар/)
    ? 2
    : e === ''
    ? 1
    : parseFloat(e)
}
var bi = `(?:${p(Oi)}|[0-9]{1,2}(?:\u0433\u043E|\u043E\u0433\u043E|\u0435|\u043E\u0435)?)`
function Wi(s8) {
  let e = s8.toLowerCase()
  return Oi[e] !== void 0 ? Oi[e] : parseInt(e)
}
var _i = '(?:\\s+(?:\u0433\u043E\u0434\u0443|\u0433\u043E\u0434\u0430|\u0433\u043E\u0434|\u0433|\u0433.))?'
var xs =
  `(?:[1-9][0-9]{0,3}${_i}\\s*(?:\u043D.\u044D.|\u0434\u043E \u043D.\u044D.|\u043D. \u044D.|\u0434\u043E \u043D. \u044D.)|[1-2][0-9]{3}${_i}|[5-9][0-9]${_i})`
function Es(s8) {
  if (
    /(год|года|г|г.)/i.test(s8) && (s8 = s8.replace(/(год|года|г|г.)/i, '')), /(до н.э.|до н. э.)/i.test(s8)
  ) return s8 = s8.replace(/(до н.э.|до н. э.)/i, ''), -parseInt(s8)
  if (/(н. э.|н.э.)/i.test(s8)) return s8 = s8.replace(/(н. э.|н.э.)/i, ''), parseInt(s8)
  let e = parseInt(s8)
  return S(e)
}
var ja = `(${gc})\\s{0,3}(${p(Gr)})`
var La = new RegExp(ja, 'i')
var st = U(
  '(?:(?:\u043E\u043A\u043E\u043B\u043E|\u043F\u0440\u0438\u043C\u0435\u0440\u043D\u043E)\\s{0,3})?',
  ja,
)
function it(s8) {
  let e = {}, t = s8, r = La.exec(t)
  for (; r;) yc(e, r), t = t.substring(r[0].length).trim(), r = La.exec(t)
  return e
}
function yc(s8, e) {
  let t = Tc(e[1]), r = Gr[e[2].toLowerCase()]
  s8[r] = t
}
var Ha =
  `(?:(?:\u043E\u043A\u043E\u043B\u043E|\u043F\u0440\u0438\u043C\u0435\u0440\u043D\u043E)\\s*(?:~\\s*)?)?(${st})${X.rightBoundary}`
var vr = class extends f {
  patternLeftBoundary() {
    return X.leftBoundary
  }
  innerPattern(e) {
    return e.option.forwardDate ? new RegExp(Ha, X.flags) : new RegExp(
      `(?:\u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0435|\u0432 \u0442\u0435\u0447\u0435\u043D\u0438\u0438)\\s*${Ha}`,
      X.flags,
    )
  }
  innerExtract(e, t) {
    let r = it(t[1])
    return c.createRelativeFromReference(e.reference, r)
  }
}
var ve = class extends f {
  patternLeftBoundary() {
    return X.leftBoundary
  }
  innerPattern(e) {
    return new RegExp(this.innerPatternString(e), X.flags)
  }
  innerPatternHasChange(e, t) {
    return false
  }
}
var q = class extends ve {
  innerPattern(e) {
    return new RegExp(`${this.innerPatternString(e)}${X.rightBoundary}`, X.flags)
  }
}
var za = 1
var qa = 2
var hc = 3
var Va = 4
var Br = class extends q {
  innerPatternString(e) {
    return `(?:\u0441)?\\s*(${bi})(?:\\s{0,3}(?:\u043F\u043E|-|\u2013|\u0434\u043E)?\\s{0,3}(${bi}))?(?:-|\\/|\\s{0,3}(?:of)?\\s{0,3})(${
      p(nt)
    })(?:(?:-|\\/|,?\\s{0,3})(${xs}(?![^\\s]\\d)))?`
  }
  innerExtract(e, t) {
    let r = e.createParsingResult(t.index, t[0]), n = nt[t[hc].toLowerCase()], i = Wi(t[za])
    if (i > 31) return t.index = t.index + t[za].length, null
    if (r.start.assign('month', n), r.start.assign('day', i), t[Va]) {
      let o = Es(t[Va])
      r.start.assign('year', o)
    } else {
      let o = P(e.refDate, i, n)
      r.start.imply('year', o)
    }
    if (t[qa]) {
      let o = Wi(t[qa])
      r.end = r.start.clone(), r.end.assign('day', o)
    }
    return r
  }
}
var Rc = 2
var Ka = 3
var Lr = class extends ve {
  innerPatternString(e) {
    return `((?:\u0432)\\s*)?(${p(nt)})\\s*(?:[,-]?\\s*(${xs})?)?(?=[^\\s\\w]|\\s+[^0-9]|\\s+$|$)`
  }
  innerExtract(e, t) {
    let r = t[Rc].toLowerCase()
    if (t[0].length <= 3 && !Ii[r]) return null
    let n = e.createParsingResult(t.index, t.index + t[0].length)
    n.start.imply('day', 1)
    let i = nt[r]
    if (n.start.assign('month', i), t[Ka]) {
      let o = Es(t[Ka])
      n.start.assign('year', o)
    } else {
      let o = P(e.refDate, 1, i)
      n.start.imply('year', o)
    }
    return n
  }
}
var jr = class extends k {
  constructor(e) {
    super(e)
  }
  patternFlags() {
    return X.flags
  }
  primaryPatternLeftBoundary() {
    return '(^|\\s|T|(?:[^\\p{L}\\p{N}_]))'
  }
  followingPhase() {
    return '\\s*(?:\\-|\\\u2013|\\~|\\\u301C|\u0434\u043E|\u0438|\u043F\u043E|\\?)\\s*'
  }
  primaryPrefix() {
    return '(?:(?:\u0432|\u0441)\\s*)??'
  }
  primarySuffix() {
    return `(?:\\s*(?:\u0443\u0442\u0440\u0430|\u0432\u0435\u0447\u0435\u0440\u0430|\u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u043B\u0443\u0434\u043D\u044F))?(?!\\/)${X.rightBoundary}`
  }
  extractPrimaryTimeComponents(e, t) {
    let r = super.extractPrimaryTimeComponents(e, t)
    if (r) {
      if (t[0].endsWith('\u0432\u0435\u0447\u0435\u0440\u0430')) {
        let n = r.get('hour')
        n >= 6 && n < 12
          ? (r.assign('hour', r.get('hour') + 12), r.assign('meridiem', u.PM))
          : n < 6 && r.assign('meridiem', u.AM)
      }
      if (t[0].endsWith('\u043F\u043E\u0441\u043B\u0435 \u043F\u043E\u043B\u0443\u0434\u043D\u044F')) {
        r.assign('meridiem', u.PM)
        let n = r.get('hour')
        n >= 0 && n <= 6 && r.assign('hour', r.get('hour') + 12)
      }
      t[0].endsWith('\u0443\u0442\u0440\u0430') &&
        (r.assign('meridiem', u.AM), r.get('hour') < 12 && r.assign('hour', r.get('hour')))
    }
    return r
  }
}
var Hr = class extends ve {
  innerPatternString(e) {
    return `(${st})\\s{0,5}\u043D\u0430\u0437\u0430\u0434(?=(?:\\W|$))`
  }
  innerExtract(e, t) {
    let r = it(t[1]), n = D(r)
    return c.createRelativeFromReference(e.reference, n)
  }
}
var zr = class extends _ {
  patternBetween() {
    return /^\s*(и до|и по|до|по|-)\s*$/i
  }
}
var qr = class extends M {
  patternBetween() {
    return new RegExp('^\\s*(T|\u0432|,|-)?\\s*$')
  }
}
var Vr = class extends q {
  innerPatternString(e) {
    return '(?:\u0441|\u0441\u043E)?\\s*(\u0441\u0435\u0433\u043E\u0434\u043D\u044F|\u0432\u0447\u0435\u0440\u0430|\u0437\u0430\u0432\u0442\u0440\u0430|\u043F\u043E\u0441\u043B\u0435\u0437\u0430\u0432\u0442\u0440\u0430|\u043F\u043E\u0441\u043B\u0435\u043F\u043E\u0441\u043B\u0435\u0437\u0430\u0432\u0442\u0440\u0430|\u043F\u043E\u0437\u0430\u043F\u043E\u0437\u0430\u0432\u0447\u0435\u0440\u0430|\u043F\u043E\u0437\u0430\u0432\u0447\u0435\u0440\u0430)'
  }
  innerExtract(e, t) {
    let r = t[1].toLowerCase(), n = e.createParsingComponents()
    switch (r) {
      case '\u0441\u0435\u0433\u043E\u0434\u043D\u044F':
        return W(e.reference)
      case '\u0432\u0447\u0435\u0440\u0430':
        return $(e.reference)
      case '\u0437\u0430\u0432\u0442\u0440\u0430':
        return F(e.reference)
      case '\u043F\u043E\u0441\u043B\u0435\u0437\u0430\u0432\u0442\u0440\u0430':
        return fe(e.reference, 2)
      case '\u043F\u043E\u0441\u043B\u0435\u043F\u043E\u0441\u043B\u0435\u0437\u0430\u0432\u0442\u0440\u0430':
        return fe(e.reference, 3)
      case '\u043F\u043E\u0437\u0430\u0432\u0447\u0435\u0440\u0430':
        return Ae(e.reference, 2)
      case '\u043F\u043E\u0437\u0430\u043F\u043E\u0437\u0430\u0432\u0447\u0435\u0440\u0430':
        return Ae(e.reference, 3)
    }
    return n
  }
}
var Kr = class extends q {
  innerPatternString(e) {
    return '(\u0441\u0435\u0439\u0447\u0430\u0441|\u043F\u0440\u043E\u0448\u043B\u044B\u043C\\s*\u0432\u0435\u0447\u0435\u0440\u043E\u043C|\u043F\u0440\u043E\u0448\u043B\u043E\u0439\\s*\u043D\u043E\u0447\u044C\u044E|\u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439\\s*\u043D\u043E\u0447\u044C\u044E|\u0441\u0435\u0433\u043E\u0434\u043D\u044F\\s*\u043D\u043E\u0447\u044C\u044E|\u044D\u0442\u043E\u0439\\s*\u043D\u043E\u0447\u044C\u044E|\u043D\u043E\u0447\u044C\u044E|\u044D\u0442\u0438\u043C \u0443\u0442\u0440\u043E\u043C|\u0443\u0442\u0440\u043E\u043C|\u0443\u0442\u0440\u0430|\u0432\\s*\u043F\u043E\u043B\u0434\u0435\u043D\u044C|\u0432\u0435\u0447\u0435\u0440\u043E\u043C|\u0432\u0435\u0447\u0435\u0440\u0430|\u0432\\s*\u043F\u043E\u043B\u043D\u043E\u0447\u044C)'
  }
  innerExtract(e, t) {
    let r = e.refDate, n = t[0].toLowerCase(), i = e.createParsingComponents()
    if (n === '\u0441\u0435\u0439\u0447\u0430\u0441') return Y(e.reference)
    if (n === '\u0432\u0435\u0447\u0435\u0440\u043E\u043C' || n === '\u0432\u0435\u0447\u0435\u0440\u0430') {
      return Ve(e.reference)
    }
    if (n.endsWith('\u0443\u0442\u0440\u043E\u043C') || n.endsWith('\u0443\u0442\u0440\u0430')) {
      return Ke(e.reference)
    }
    if (n.match(/в\s*полдень/)) return Xe(e.reference)
    if (n.match(/прошлой\s*ночью/)) return Zn(e.reference)
    if (n.match(/прошлым\s*вечером/)) return Jn(e.reference)
    if (n.match(/следующей\s*ночью/)) {
      let o = r.getHours() < 22 ? 1 : 2, a = new Date(r.getTime())
      a.setDate(a.getDate() + o), R(i, a), i.imply('hour', 0)
    }
    return n.match(/в\s*полночь/) || n.endsWith('\u043D\u043E\u0447\u044C\u044E') ? we(e.reference) : i
  }
}
var Pc = 1
var xc = 2
var Ec = 3
var Xr = class extends q {
  innerPatternString(e) {
    return `(?:(?:,|\\(|\uFF08)\\s*)?(?:\u0432\\s*?)?(?:(\u044D\u0442\u0443|\u044D\u0442\u043E\u0442|\u043F\u0440\u043E\u0448\u043B\u044B\u0439|\u043F\u0440\u043E\u0448\u043B\u0443\u044E|\u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439|\u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0443\u044E|\u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0433\u043E)\\s*)?(${
      p(Ci)
    })(?:\\s*(?:,|\\)|\uFF09))?(?:\\s*\u043D\u0430\\s*(\u044D\u0442\u043E\u0439|\u043F\u0440\u043E\u0448\u043B\u043E\u0439|\u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439)\\s*\u043D\u0435\u0434\u0435\u043B\u0435)?`
  }
  innerExtract(e, t) {
    let r = t[xc].toLowerCase(), n = Ci[r], i = t[Pc], o = t[Ec], a = i || o
    a = a || '', a = a.toLowerCase()
    let m = null
    return a == '\u043F\u0440\u043E\u0448\u043B\u044B\u0439' ||
        a == '\u043F\u0440\u043E\u0448\u043B\u0443\u044E' || a == '\u043F\u0440\u043E\u0448\u043B\u043E\u0439'
      ? m = 'last'
      : a == '\u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0439' ||
          a == '\u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0443\u044E' ||
          a == '\u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439' ||
          a == '\u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0433\u043E'
      ? m = 'next'
      : (a == '\u044D\u0442\u043E\u0442' || a == '\u044D\u0442\u0443' || a == '\u044D\u0442\u043E\u0439') &&
        (m = 'this'),
      I(e.reference, n, m)
  }
}
var Dc = 1
var Ac = 2
var Zr = class extends q {
  innerPatternString(e) {
    return `(\u0432 \u043F\u0440\u043E\u0448\u043B\u043E\u043C|\u043D\u0430 \u043F\u0440\u043E\u0448\u043B\u043E\u0439|\u043D\u0430 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439|\u0432 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u043C|\u043D\u0430 \u044D\u0442\u043E\u0439|\u0432 \u044D\u0442\u043E\u043C)\\s*(${
      p(Gr)
    })`
  }
  innerExtract(e, t) {
    let r = t[Dc].toLowerCase(), n = t[Ac].toLowerCase(), i = Gr[n]
    if (
      r == '\u043D\u0430 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0439' ||
      r == '\u0432 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u043C'
    ) {
      let m = {}
      return m[i] = 1, c.createRelativeFromReference(e.reference, m)
    }
    if (
      r == '\u0432 \u043F\u0440\u043E\u0448\u043B\u043E\u043C' ||
      r == '\u043D\u0430 \u043F\u0440\u043E\u0448\u043B\u043E\u0439'
    ) {
      let m = {}
      return m[i] = -1, c.createRelativeFromReference(e.reference, m)
    }
    let o = e.createParsingComponents(), a = new Date(e.reference.instant.getTime())
    return i.match(/week/i)
      ? (a.setDate(a.getDate() - a.getDay()),
        o.imply('day', a.getDate()),
        o.imply('month', a.getMonth() + 1),
        o.imply('year', a.getFullYear()))
      : i.match(/month/i)
      ? (a.setDate(1),
        o.imply('day', a.getDate()),
        o.assign('year', a.getFullYear()),
        o.assign('month', a.getMonth() + 1))
      : i.match(/year/i) &&
        (a.setDate(1),
          a.setMonth(0),
          o.imply('day', a.getDate()),
          o.imply('month', a.getMonth() + 1),
          o.assign('year', a.getFullYear())),
      o
  }
}
var Jr = class extends q {
  innerPatternString(e) {
    return `(\u044D\u0442\u0438|\u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435|\u043F\u0440\u043E\u0448\u043B\u044B\u0435|\u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0435|\u043F\u043E\u0441\u043B\u0435|\u0441\u043F\u0443\u0441\u0442\u044F|\u0447\u0435\u0440\u0435\u0437|\\+|-)\\s*(${st})`
  }
  innerExtract(e, t) {
    let r = t[1].toLowerCase(), n = it(t[2])
    switch (r) {
      case '\u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435':
      case '\u043F\u0440\u043E\u0448\u043B\u044B\u0435':
      case '-':
        n = D(n)
        break
    }
    return c.createRelativeFromReference(e.reference, n)
  }
}
var Ui = new g(Xa())
var wc = new g(ki(true))
function Nc(s8, e, t) {
  return Ui.parse(s8, e, t)
}
function _c(s8, e, t) {
  return Ui.parseDate(s8, e, t)
}
function Xa() {
  let s8 = ki(false)
  return s8.parsers.unshift(new Vr()),
    s8.parsers.unshift(new Kr()),
    s8.parsers.unshift(new Lr()),
    s8.parsers.unshift(new Zr()),
    s8.parsers.unshift(new Jr()),
    s8
}
function ki(s8 = true) {
  return N({
    parsers: [
      new b(true),
      new vr(),
      new Br(),
      new Xr(),
      new jr(s8),
      new Hr(),
    ],
    refiners: [
      new qr(),
      new zr(),
    ],
  }, s8)
}
var fm = {}
H(fm, {
  Chrono: () => g,
  Meridiem: () => u,
  ParsingComponents: () => c,
  ParsingResult: () => x,
  ReferenceWithTimezone: () => E,
  Weekday: () => y,
  casual: () => Fi,
  createCasualConfiguration: () => mm,
  createConfiguration: () => Gi,
  parse: () => $c,
  parseDate: () => Fc,
  strict: () => Sc,
})
var Si = {
  domingo: 0,
  dom: 0,
  lunes: 1,
  lun: 1,
  martes: 2,
  mar: 2,
  miércoles: 3,
  miercoles: 3,
  mié: 3,
  mie: 3,
  jueves: 4,
  jue: 4,
  viernes: 5,
  vie: 5,
  sábado: 6,
  sabado: 6,
  sáb: 6,
  sab: 6,
}
var $i = {
  enero: 1,
  ene: 1,
  'ene.': 1,
  febrero: 2,
  feb: 2,
  'feb.': 2,
  marzo: 3,
  mar: 3,
  'mar.': 3,
  abril: 4,
  abr: 4,
  'abr.': 4,
  mayo: 5,
  may: 5,
  'may.': 5,
  junio: 6,
  jun: 6,
  'jun.': 6,
  julio: 7,
  jul: 7,
  'jul.': 7,
  agosto: 8,
  ago: 8,
  'ago.': 8,
  septiembre: 9,
  setiembre: 9,
  sep: 9,
  'sep.': 9,
  octubre: 10,
  oct: 10,
  'oct.': 10,
  noviembre: 11,
  nov: 11,
  'nov.': 11,
  diciembre: 12,
  dic: 12,
  'dic.': 12,
}
var Yi = {
  uno: 1,
  dos: 2,
  tres: 3,
  cuatro: 4,
  cinco: 5,
  seis: 6,
  siete: 7,
  ocho: 8,
  nueve: 9,
  diez: 10,
  once: 11,
  doce: 12,
  trece: 13,
}
var Qa = {
  sec: 'second',
  segundo: 'second',
  segundos: 'second',
  min: 'minute',
  mins: 'minute',
  minuto: 'minute',
  minutos: 'minute',
  h: 'hour',
  hr: 'hour',
  hrs: 'hour',
  hora: 'hour',
  horas: 'hour',
  día: 'day',
  días: 'day',
  semana: 'week',
  semanas: 'week',
  mes: 'month',
  meses: 'month',
  cuarto: 'quarter',
  cuartos: 'quarter',
  año: 'year',
  años: 'year',
}
var Mc = `(?:${p(Yi)}|[0-9]+|[0-9]+\\.[0-9]+|un?|uno?|una?|algunos?|unos?|demi-?)`
function Oc(s8) {
  let e = s8.toLowerCase()
  return Yi[e] !== void 0
    ? Yi[e]
    : e === 'un' || e === 'una' || e === 'uno'
    ? 1
    : e.match(/algunos?/) || e.match(/unos?/)
    ? 3
    : e.match(/media?/)
    ? 0.5
    : parseFloat(e)
}
var em = '[0-9]{1,4}(?![^\\s]\\d)(?:\\s*[a|d]\\.?\\s*c\\.?|\\s*a\\.?\\s*d\\.?)?'
function tm(s8) {
  if (s8.match(/^[0-9]{1,4}$/)) {
    let e = parseInt(s8)
    return e < 100 && (e > 50 ? e = e + 1900 : e = e + 2e3), e
  }
  return s8.match(/a\.?\s*c\.?/i) ? (s8 = s8.replace(/a\.?\s*c\.?/i, ''), -parseInt(s8)) : parseInt(s8)
}
var rm = `(${Mc})\\s{0,5}(${p(Qa)})\\s{0,5}`
var Ja = new RegExp(rm, 'i')
var nm = U('', rm)
function sm(s8) {
  let e = {}, t = s8, r = Ja.exec(t)
  for (; r;) Cc(e, r), t = t.substring(r[0].length), r = Ja.exec(t)
  return e
}
function Cc(s8, e) {
  let t = Oc(e[1]), r = Qa[e[2].toLowerCase()]
  s8[r] = t
}
var Ic = new RegExp(
  `(?:(?:\\,|\\(|\\\uFF08)\\s*)?(?:(este|esta|pasado|pr[o\xF3]ximo)\\s*)?(${
    p(Si)
  })(?:\\s*(?:\\,|\\)|\\\uFF09))?(?:\\s*(este|esta|pasado|pr[\xF3o]ximo)\\s*semana)?(?=\\W|\\d|$)`,
  'i',
)
var bc = 1
var Wc = 2
var Uc = 3
var Qr = class extends f {
  innerPattern() {
    return Ic
  }
  innerExtract(e, t) {
    let r = t[Wc].toLowerCase(), n = Si[r]
    if (n === void 0) return null
    let i = t[bc], o = t[Uc], a = i || o || ''
    a = a.toLowerCase()
    let m = null
    return a == 'pasado'
      ? m = 'this'
      : a == 'pr\xF3ximo' || a == 'proximo'
      ? m = 'next'
      : a == 'este' && (m = 'this'),
      I(e.reference, n, m)
  }
}
var en = class extends k {
  primaryPrefix() {
    return '(?:(?:aslas|deslas|las?|al?|de|del)\\s*)?'
  }
  followingPhase() {
    return '\\s*(?:\\-|\\\u2013|\\~|\\\u301C|a(?:l)?|\\?)\\s*'
  }
}
var tn = class extends M {
  patternBetween() {
    return new RegExp('^\\s*(?:,|de|aslas|a)?\\s*$')
  }
}
var rn = class extends _ {
  patternBetween() {
    return /^\s*(?:-)\s*$/i
  }
}
var kc = new RegExp(
  `([0-9]{1,2})(?:\xBA|\xAA|\xB0)?(?:\\s*(?:desde|de|\\-|\\\u2013|ao?|\\s)\\s*([0-9]{1,2})(?:\xBA|\xAA|\xB0)?)?\\s*(?:de)?\\s*(?:-|/|\\s*(?:de|,)?\\s*)(${
    p($i)
  })(?:\\s*(?:de|,)?\\s*(${em}))?(?=\\W|$)`,
  'i',
)
var im = 1
var om = 2
var Yc = 3
var am = 4
var nn = class extends f {
  innerPattern() {
    return kc
  }
  innerExtract(e, t) {
    let r = e.createParsingResult(t.index, t[0]), n = $i[t[Yc].toLowerCase()], i = parseInt(t[im])
    if (i > 31) return t.index = t.index + t[im].length, null
    if (r.start.assign('month', n), r.start.assign('day', i), t[am]) {
      let o = tm(t[am])
      r.start.assign('year', o)
    } else {
      let o = P(e.refDate, i, n)
      r.start.imply('year', o)
    }
    if (t[om]) {
      let o = parseInt(t[om])
      r.end = r.start.clone(), r.end.assign('day', o)
    }
    return r
  }
}
var sn = class extends f {
  innerPattern(e) {
    return /(ahora|hoy|mañana|ayer)(?=\W|$)/i
  }
  innerExtract(e, t) {
    let r = t[0].toLowerCase(), n = e.createParsingComponents()
    switch (r) {
      case 'ahora':
        return Y(e.reference)
      case 'hoy':
        return W(e.reference)
      case 'ma\xF1ana':
        return F(e.reference)
      case 'ayer':
        return $(e.reference)
    }
    return n
  }
}
var on = class extends f {
  innerPattern() {
    return /(?:esta\s*)?(mañana|tarde|medianoche|mediodia|mediodía|noche)(?=\W|$)/i
  }
  innerExtract(e, t) {
    let r = e.refDate, n = e.createParsingComponents()
    switch (t[1].toLowerCase()) {
      case 'tarde':
        n.imply('meridiem', u.PM), n.imply('hour', 15)
        break
      case 'noche':
        n.imply('meridiem', u.PM), n.imply('hour', 22)
        break
      case 'ma\xF1ana':
        n.imply('meridiem', u.AM), n.imply('hour', 6)
        break
      case 'medianoche':
        let i = new Date(r.getTime())
        i.setDate(i.getDate() + 1),
          R(n, i),
          O(n, i),
          n.imply('hour', 0),
          n.imply('minute', 0),
          n.imply('second', 0)
        break
      case 'mediodia':
      case 'mediod\xEDa':
        n.imply('meridiem', u.AM), n.imply('hour', 12)
        break
    }
    return n
  }
}
var an = class extends f {
  innerPattern() {
    return new RegExp(`(?:en|por|durante|de|dentro de)\\s*(${nm})(?=\\W|$)`, 'i')
  }
  innerExtract(e, t) {
    let r = sm(t[1])
    return c.createRelativeFromReference(e.reference, r)
  }
}
var Fi = new g(mm())
var Sc = new g(Gi(true))
function $c(s8, e, t) {
  return Fi.parse(s8, e, t)
}
function Fc(s8, e, t) {
  return Fi.parseDate(s8, e, t)
}
function mm(s8 = true) {
  let e = Gi(false, s8)
  return e.parsers.push(new sn()), e.parsers.push(new on()), e
}
function Gi(s8 = true, e = true) {
  return N({
    parsers: [
      new b(e),
      new Qr(),
      new en(),
      new nn(),
      new an(),
    ],
    refiners: [
      new tn(),
      new rn(),
    ],
  }, s8)
}
var hm = {}
H(hm, {
  Chrono: () => g,
  Meridiem: () => u,
  ParsingComponents: () => c,
  ParsingResult: () => x,
  ReferenceWithTimezone: () => E,
  Weekday: () => y,
  casual: () => Vi,
  createCasualConfiguration: () => ym,
  createConfiguration: () => Ki,
  parse: () => Zc,
  parseDate: () => Jc,
  strict: () => Xc,
})
var se = {
  leftBoundary: '([^\\p{L}\\p{N}_]|^)',
  rightBoundary: '(?=[^\\p{L}\\p{N}_]|$)',
  flags: 'iu',
}
var ji = {
  неділя: 0,
  неділі: 0,
  неділю: 0,
  нд: 0,
  '\u043D\u0434.': 0,
  понеділок: 1,
  понеділка: 1,
  пн: 1,
  '\u043F\u043D.': 1,
  вівторок: 2,
  вівторка: 2,
  вт: 2,
  '\u0432\u0442.': 2,
  середа: 3,
  середи: 3,
  середу: 3,
  ср: 3,
  '\u0441\u0440.': 3,
  четвер: 4,
  четверга: 4,
  четвергу: 4,
  чт: 4,
  '\u0447\u0442.': 4,
  "\u043F'\u044F\u0442\u043D\u0438\u0446\u044F": 5,
  "\u043F'\u044F\u0442\u043D\u0438\u0446\u0456": 5,
  "\u043F'\u044F\u0442\u043D\u0438\u0446\u044E": 5,
  пт: 5,
  '\u043F\u0442.': 5,
  субота: 6,
  суботи: 6,
  суботу: 6,
  сб: 6,
  '\u0441\u0431.': 6,
}
var Hi = {
  січень: 1,
  січня: 1,
  січні: 1,
  лютий: 2,
  лютого: 2,
  лютому: 2,
  березень: 3,
  березня: 3,
  березні: 3,
  квітень: 4,
  квітня: 4,
  квітні: 4,
  травень: 5,
  травня: 5,
  травні: 5,
  червень: 6,
  червня: 6,
  червні: 6,
  липень: 7,
  липня: 7,
  липні: 7,
  серпень: 8,
  серпня: 8,
  серпні: 8,
  вересень: 9,
  вересня: 9,
  вересні: 9,
  жовтень: 10,
  жовтня: 10,
  жовтні: 10,
  листопад: 11,
  листопада: 11,
  листопаду: 11,
  грудень: 12,
  грудня: 12,
  грудні: 12,
}
var ot = {
  ...Hi,
  січ: 1,
  '\u0441\u0456\u0447.': 1,
  лют: 2,
  '\u043B\u044E\u0442.': 2,
  бер: 3,
  '\u0431\u0435\u0440.': 3,
  квіт: 4,
  '\u043A\u0432\u0456\u0442.': 4,
  трав: 5,
  '\u0442\u0440\u0430\u0432.': 5,
  черв: 6,
  '\u0447\u0435\u0440\u0432.': 6,
  лип: 7,
  '\u043B\u0438\u043F.': 7,
  серп: 8,
  '\u0441\u0435\u0440\u043F.': 8,
  сер: 8,
  'c\u0435\u0440.': 8,
  вер: 9,
  '\u0432\u0435\u0440.': 9,
  верес: 9,
  '\u0432\u0435\u0440\u0435\u0441.': 9,
  жовт: 10,
  '\u0436\u043E\u0432\u0442.': 10,
  листоп: 11,
  '\u043B\u0438\u0441\u0442\u043E\u043F.': 11,
  груд: 12,
  '\u0433\u0440\u0443\u0434.': 12,
}
var Bi = {
  один: 1,
  одна: 1,
  одної: 1,
  одну: 1,
  дві: 2,
  два: 2,
  двох: 2,
  три: 3,
  трьох: 3,
  чотири: 4,
  чотирьох: 4,
  "\u043F'\u044F\u0442\u044C": 5,
  "\u043F'\u044F\u0442\u0438": 5,
  шість: 6,
  шести: 6,
  сім: 7,
  семи: 7,
  вісім: 8,
  восьми: 8,
  "\u0434\u0435\u0432'\u044F\u0442\u044C": 9,
  "\u0434\u0435\u0432'\u044F\u0442\u0438": 9,
  десять: 10,
  десяти: 10,
  одинадцять: 11,
  одинадцяти: 11,
  дванадцять: 12,
  дванадцяти: 12,
}
var Li = {
  перше: 1,
  першого: 1,
  друге: 2,
  другого: 2,
  третє: 3,
  третього: 3,
  четверте: 4,
  четвертого: 4,
  "\u043F'\u044F\u0442\u0435": 5,
  "\u043F'\u044F\u0442\u043E\u0433\u043E": 5,
  шосте: 6,
  шостого: 6,
  сьоме: 7,
  сьомого: 7,
  восьме: 8,
  восьмого: 8,
  "\u0434\u0435\u0432'\u044F\u0442\u0435": 9,
  "\u0434\u0435\u0432'\u044F\u0442\u043E\u0433\u043E": 9,
  десяте: 10,
  десятого: 10,
  одинадцяте: 11,
  одинадцятого: 11,
  дванадцяте: 12,
  дванадцятого: 12,
  тринадцяте: 13,
  тринадцятого: 13,
  чотирнадцяте: 14,
  чотинрнадцятого: 14,
  "\u043F'\u044F\u0442\u043D\u0430\u0434\u0446\u044F\u0442\u0435": 15,
  "\u043F'\u044F\u0442\u043D\u0430\u0434\u0446\u044F\u0442\u043E\u0433\u043E": 15,
  шістнадцяте: 16,
  шістнадцятого: 16,
  сімнадцяте: 17,
  сімнадцятого: 17,
  вісімнадцяте: 18,
  вісімнадцятого: 18,
  "\u0434\u0435\u0432'\u044F\u0442\u043D\u0430\u0434\u0446\u044F\u0442\u0435": 19,
  "\u0434\u0435\u0432'\u044F\u0442\u043D\u0430\u0434\u0446\u044F\u0442\u043E\u0433\u043E": 19,
  двадцяте: 20,
  двадцятого: 20,
  '\u0434\u0432\u0430\u0434\u0446\u044F\u0442\u044C \u043F\u0435\u0440\u0448\u0435': 21,
  '\u0434\u0432\u0430\u0434\u0446\u044F\u0442\u044C \u043F\u0435\u0440\u0448\u043E\u0433\u043E': 21,
  '\u0434\u0432\u0430\u0434\u0446\u044F\u0442\u044C \u0434\u0440\u0443\u0433\u0435': 22,
  '\u0434\u0432\u0430\u0434\u0446\u044F\u0442\u044C \u0434\u0440\u0443\u0433\u043E\u0433\u043E': 22,
  '\u0434\u0432\u0430\u0434\u0446\u044F\u0442\u044C \u0442\u0440\u0435\u0442\u0454': 23,
  '\u0434\u0432\u0430\u0434\u0446\u044F\u0442\u044C \u0442\u0440\u0435\u0442\u044C\u043E\u0433\u043E': 23,
  '\u0434\u0432\u0430\u0434\u0446\u044F\u0442\u044C \u0447\u0435\u0442\u0432\u0435\u0440\u0442\u0435': 24,
  '\u0434\u0432\u0430\u0434\u0446\u044F\u0442\u044C \u0447\u0435\u0442\u0432\u0435\u0440\u0442\u043E\u0433\u043E':
    24,
  "\u0434\u0432\u0430\u0434\u0446\u044F\u0442\u044C \u043F'\u044F\u0442\u0435": 25,
  "\u0434\u0432\u0430\u0434\u0446\u044F\u0442\u044C \u043F'\u044F\u0442\u043E\u0433\u043E": 25,
  '\u0434\u0432\u0430\u0434\u0446\u044F\u0442\u044C \u0448\u043E\u0441\u0442\u0435': 26,
  '\u0434\u0432\u0430\u0434\u0446\u044F\u0442\u044C \u0448\u043E\u0441\u0442\u043E\u0433\u043E': 26,
  '\u0434\u0432\u0430\u0434\u0446\u044F\u0442\u044C \u0441\u044C\u043E\u043C\u0435': 27,
  '\u0434\u0432\u0430\u0434\u0446\u044F\u0442\u044C \u0441\u044C\u043E\u043C\u043E\u0433\u043E': 27,
  '\u0434\u0432\u0430\u0434\u0446\u044F\u0442\u044C \u0432\u043E\u0441\u044C\u043C\u0435': 28,
  '\u0434\u0432\u0430\u0434\u0446\u044F\u0442\u044C \u0432\u043E\u0441\u044C\u043C\u043E\u0433\u043E': 28,
  "\u0434\u0432\u0430\u0434\u0446\u044F\u0442\u044C \u0434\u0435\u0432'\u044F\u0442\u0435": 29,
  "\u0434\u0432\u0430\u0434\u0446\u044F\u0442\u044C \u0434\u0435\u0432'\u044F\u0442\u043E\u0433\u043E": 29,
  тридцяте: 30,
  тридцятого: 30,
  '\u0442\u0440\u0438\u0434\u0446\u044F\u0442\u044C \u043F\u0435\u0440\u0448\u0435': 31,
  '\u0442\u0440\u0438\u0434\u0446\u044F\u0442\u044C \u043F\u0435\u0440\u0448\u043E\u0433\u043E': 31,
}
var mn = {
  сек: 'second',
  секунда: 'second',
  секунд: 'second',
  секунди: 'second',
  секунду: 'second',
  секундочок: 'second',
  секундочки: 'second',
  секундочку: 'second',
  хв: 'minute',
  хвилина: 'minute',
  хвилин: 'minute',
  хвилини: 'minute',
  хвилину: 'minute',
  хвилинок: 'minute',
  хвилинки: 'minute',
  хвилинку: 'minute',
  хвилиночок: 'minute',
  хвилиночки: 'minute',
  хвилиночку: 'minute',
  год: 'hour',
  година: 'hour',
  годин: 'hour',
  години: 'hour',
  годину: 'hour',
  годинка: 'hour',
  годинок: 'hour',
  годинки: 'hour',
  годинку: 'hour',
  день: 'day',
  дня: 'day',
  днів: 'day',
  дні: 'day',
  доба: 'day',
  добу: 'day',
  тиждень: 'week',
  тижню: 'week',
  тижня: 'week',
  тижні: 'week',
  тижнів: 'week',
  місяць: 'month',
  місяців: 'month',
  місяці: 'month',
  місяця: 'month',
  квартал: 'quarter',
  кварталу: 'quarter',
  квартала: 'quarter',
  кварталів: 'quarter',
  кварталі: 'quarter',
  рік: 'year',
  року: 'year',
  році: 'year',
  років: 'year',
  роки: 'year',
}
var Gc = `(?:${
  p(Bi)
}|[0-9]+|[0-9]+\\.[0-9]+|\u043F\u0456\u0432|\u0434\u0435\u043A\u0456\u043B\u044C\u043A\u0430|\u043F\u0430\u0440(?:\u0443)|\\s{0,3})`
function vc(s8) {
  let e = s8.toLowerCase()
  return Bi[e] !== void 0
    ? Bi[e]
    : e.match(/декілька/)
    ? 2
    : e.match(/пів/)
    ? 0.5
    : e.match(/пар/)
    ? 2
    : e === ''
    ? 1
    : parseFloat(e)
}
var zi = `(?:${p(Li)}|[0-9]{1,2}(?:\u0433\u043E|\u043E\u0433\u043E|\u0435)?)`
function qi(s8) {
  let e = s8.toLowerCase()
  return Li[e] !== void 0 ? Li[e] : parseInt(e)
}
var vi = '(?:\\s+(?:\u0440\u043E\u043A\u0443|\u0440\u0456\u043A|\u0440|\u0440.))?'
var Ds =
  `(?:[1-9][0-9]{0,3}${vi}\\s*(?:\u043D.\u0435.|\u0434\u043E \u043D.\u0435.|\u043D. \u0435.|\u0434\u043E \u043D. \u0435.)|[1-2][0-9]{3}${vi}|[5-9][0-9]${vi})`
function As(s8) {
  if (
    /(рік|року|р|р.)/i.test(s8) && (s8 = s8.replace(/(рік|року|р|р.)/i, '')), /(до н.е.|до н. е.)/i.test(s8)
  ) return s8 = s8.replace(/(до н.е.|до н. е.)/i, ''), -parseInt(s8)
  if (/(н. е.|н.е.)/i.test(s8)) return s8 = s8.replace(/(н. е.|н.е.)/i, ''), parseInt(s8)
  let e = parseInt(s8)
  return S(e)
}
var lm = `(${Gc})\\s{0,3}(${p(mn)})`
var um = new RegExp(lm, 'i')
var at = U(
  '(?:(?:\u0431\u043B\u0438\u0437\u044C\u043A\u043E|\u043F\u0440\u0438\u0431\u043B\u0438\u0437\u043D\u043E)\\s{0,3})?',
  lm,
)
function mt(s8) {
  let e = {}, t = s8, r = um.exec(t)
  for (; r;) Bc(e, r), t = t.substring(r[0].length).trim(), r = um.exec(t)
  return e
}
function Bc(s8, e) {
  let t = vc(e[1]), r = mn[e[2].toLowerCase()]
  s8[r] = t
}
var cm =
  `(?:(?:\u043F\u0440\u0438\u0431\u043B\u0438\u0437\u043D\u043E|\u043E\u0440\u0456\u0454\u043D\u0442\u043E\u0432\u043D\u043E)\\s*(?:~\\s*)?)?(${at})${se.rightBoundary}`
var fn = class extends f {
  patternLeftBoundary() {
    return se.leftBoundary
  }
  innerPattern(e) {
    return e.option.forwardDate ? new RegExp(cm, 'i') : new RegExp(
      `(?:\u043F\u0440\u043E\u0442\u044F\u0433\u043E\u043C|\u043D\u0430 \u043F\u0440\u043E\u0442\u044F\u0437\u0456|\u043F\u0440\u043E\u0442\u044F\u0433\u043E\u043C|\u0443\u043F\u0440\u043E\u0434\u043E\u0432\u0436|\u0432\u043F\u0440\u043E\u0434\u043E\u0432\u0436)\\s*${cm}`,
      se.flags,
    )
  }
  innerExtract(e, t) {
    let r = mt(t[1])
    return c.createRelativeFromReference(e.reference, r)
  }
}
var Be = class extends f {
  patternLeftBoundary() {
    return se.leftBoundary
  }
  innerPattern(e) {
    return new RegExp(this.innerPatternString(e), se.flags)
  }
  innerPatternHasChange(e, t) {
    return false
  }
}
var V = class extends Be {
  innerPattern(e) {
    return new RegExp(`${this.innerPatternString(e)}${se.rightBoundary}`, se.flags)
  }
}
var pm = 1
var dm = 2
var Lc = 3
var gm = 4
var un = class extends V {
  innerPatternString(e) {
    return `(?:\u0437|\u0456\u0437)?\\s*(${zi})(?:\\s{0,3}(?:\u043F\u043E|-|\u2013|\u0434\u043E)?\\s{0,3}(${zi}))?(?:-|\\/|\\s{0,3}(?:of)?\\s{0,3})(${
      p(ot)
    })(?:(?:-|\\/|,?\\s{0,3})(${Ds}(?![^\\s]\\d)))?`
  }
  innerExtract(e, t) {
    let r = e.createParsingResult(t.index, t[0]), n = ot[t[Lc].toLowerCase()], i = qi(t[pm])
    if (i > 31) return t.index = t.index + t[pm].length, null
    if (r.start.assign('month', n), r.start.assign('day', i), t[gm]) {
      let o = As(t[gm])
      r.start.assign('year', o)
    } else {
      let o = P(e.reference.instant, i, n)
      r.start.imply('year', o)
    }
    if (t[dm]) {
      let o = qi(t[dm])
      r.end = r.start.clone(), r.end.assign('day', o)
    }
    return r
  }
}
var jc = 2
var Tm = 3
var ln = class extends Be {
  innerPatternString(e) {
    return `((?:\u0432|\u0443)\\s*)?(${p(ot)})\\s*(?:[,-]?\\s*(${Ds})?)?(?=[^\\s\\w]|\\s+[^0-9]|\\s+$|$)`
  }
  innerExtract(e, t) {
    let r = t[jc].toLowerCase()
    if (t[0].length <= 3 && !Hi[r]) return null
    let n = e.createParsingResult(t.index, t.index + t[0].length)
    n.start.imply('day', 1)
    let i = ot[r]
    if (n.start.assign('month', i), t[Tm]) {
      let o = As(t[Tm])
      n.start.assign('year', o)
    } else {
      let o = P(e.reference.instant, 1, i)
      n.start.imply('year', o)
    }
    return n
  }
}
var cn = class extends k {
  constructor(e) {
    super(e)
  }
  patternFlags() {
    return se.flags
  }
  primaryPatternLeftBoundary() {
    return '(^|\\s|T|(?:[^\\p{L}\\p{N}_]))'
  }
  followingPhase() {
    return '\\s*(?:\\-|\\\u2013|\\~|\\\u301C|\u0434\u043E|\u0456|\u043F\u043E|\\?)\\s*'
  }
  primaryPrefix() {
    return '(?:(?:\u0432|\u0443|\u043E|\u043E\u0431|\u0437|\u0456\u0437|\u0432\u0456\u0434)\\s*)??'
  }
  primarySuffix() {
    return `(?:\\s*(?:\u0440\u0430\u043D\u043A\u0443|\u0432\u0435\u0447\u043E\u0440\u0430|\u043F\u043E \u043E\u0431\u0456\u0434\u0456|\u043F\u0456\u0441\u043B\u044F \u043E\u0431\u0456\u0434\u0443))?(?!\\/)${se.rightBoundary}`
  }
  extractPrimaryTimeComponents(e, t) {
    let r = super.extractPrimaryTimeComponents(e, t)
    if (r) {
      if (t[0].endsWith('\u0432\u0435\u0447\u043E\u0440\u0430')) {
        let n = r.get('hour')
        n >= 6 && n < 12
          ? (r.assign('hour', r.get('hour') + 12), r.assign('meridiem', u.PM))
          : n < 6 && r.assign('meridiem', u.AM)
      }
      if (
        t[0].endsWith('\u043F\u043E \u043E\u0431\u0456\u0434\u0456') ||
        t[0].endsWith('\u043F\u0456\u0441\u043B\u044F \u043E\u0431\u0456\u0434\u0443')
      ) {
        r.assign('meridiem', u.PM)
        let n = r.get('hour')
        n >= 0 && n <= 6 && r.assign('hour', r.get('hour') + 12)
      }
      t[0].endsWith('\u0440\u0430\u043D\u043A\u0443') &&
        (r.assign('meridiem', u.AM), r.get('hour') < 12 && r.assign('hour', r.get('hour')))
    }
    return r
  }
}
var pn = class extends Be {
  innerPatternString(e) {
    return `(${at})\\s{0,5}\u0442\u043E\u043C\u0443(?=(?:\\W|$))`
  }
  innerExtract(e, t) {
    let r = mt(t[1]), n = D(r)
    return c.createRelativeFromReference(e.reference, n)
  }
}
var dn = class extends _ {
  patternBetween() {
    return /^\s*(і до|і по|до|по|-)\s*$/i
  }
}
var gn = class extends M {
  patternBetween() {
    return new RegExp('^\\s*(T|\u0432|\u0443|\u043E|,|-)?\\s*$')
  }
}
var Tn = class extends V {
  innerPatternString(e) {
    return '(?:\u0437|\u0456\u0437|\u0432\u0456\u0434)?\\s*(\u0441\u044C\u043E\u0433\u043E\u0434\u043D\u0456|\u0432\u0447\u043E\u0440\u0430|\u0437\u0430\u0432\u0442\u0440\u0430|\u043F\u0456\u0441\u043B\u044F\u0437\u0430\u0432\u0442\u0440\u0430|\u043F\u0456\u0441\u043B\u044F\u043F\u0456\u0441\u043B\u044F\u0437\u0430\u0432\u0442\u0440\u0430|\u043F\u043E\u0437\u0430\u043F\u043E\u0437\u0430\u0432\u0447\u043E\u0440\u0430|\u043F\u043E\u0437\u0430\u0432\u0447\u043E\u0440\u0430)'
  }
  innerExtract(e, t) {
    let r = t[1].toLowerCase(), n = e.createParsingComponents()
    switch (r) {
      case '\u0441\u044C\u043E\u0433\u043E\u0434\u043D\u0456':
        return W(e.reference)
      case '\u0432\u0447\u043E\u0440\u0430':
        return $(e.reference)
      case '\u0437\u0430\u0432\u0442\u0440\u0430':
        return F(e.reference)
      case '\u043F\u0456\u0441\u043B\u044F\u0437\u0430\u0432\u0442\u0440\u0430':
        return fe(e.reference, 2)
      case '\u043F\u0456\u0441\u043B\u044F\u043F\u0456\u0441\u043B\u044F\u0437\u0430\u0432\u0442\u0440\u0430':
        return fe(e.reference, 3)
      case '\u043F\u043E\u0437\u0430\u0432\u0447\u043E\u0440\u0430':
        return Ae(e.reference, 2)
      case '\u043F\u043E\u0437\u0430\u043F\u043E\u0437\u0430\u0432\u0447\u043E\u0440\u0430':
        return Ae(e.reference, 3)
    }
    return n
  }
}
var yn = class extends V {
  innerPatternString(e) {
    return '(\u0437\u0430\u0440\u0430\u0437|\u043C\u0438\u043D\u0443\u043B\u043E\u0433\u043E\\s*\u0432\u0435\u0447\u043E\u0440\u0430|\u043C\u0438\u043D\u0443\u043B\u043E\u0457\\s*\u043D\u043E\u0447\u0456|\u043D\u0430\u0441\u0442\u0443\u043F\u043D\u043E\u0457\\s*\u043D\u043E\u0447\u0456|\u0441\u044C\u043E\u0433\u043E\u0434\u043D\u0456\\s*\u0432\u043D\u043E\u0447\u0456|\u0446\u0456\u0454\u0457\\s*\u043D\u043E\u0447\u0456|\u0446\u044C\u043E\u0433\u043E \u0440\u0430\u043D\u043A\u0443|\u0432\u0440\u0430\u043D\u0446\u0456|\u0440\u0430\u043D\u043A\u0443|\u0437\u0440\u0430\u043D\u043A\u0443|\u043E\u043F\u0456\u0432\u0434\u043D\u0456|\u0432\u0432\u0435\u0447\u0435\u0440\u0456|\u0432\u0435\u0447\u043E\u0440\u0430|\u043E\u043F\u0456\u0432\u043D\u043E\u0447\u0456|\u0432\u043D\u043E\u0447\u0456)'
  }
  innerExtract(e, t) {
    let r = e.refDate, n = t[0].toLowerCase(), i = e.createParsingComponents()
    if (n === '\u0437\u0430\u0440\u0430\u0437') return Y(e.reference)
    if (n === '\u0432\u0432\u0435\u0447\u0435\u0440\u0456' || n === '\u0432\u0435\u0447\u043E\u0440\u0430') {
      return Ve(e.reference)
    }
    if (
      n.endsWith('\u0432\u0440\u0430\u043D\u0446\u0456') || n.endsWith('\u0440\u0430\u043D\u043A\u0443') ||
      n.endsWith('\u0437\u0440\u0430\u043D\u043A\u0443')
    ) return Ke(e.reference)
    if (n.endsWith('\u043E\u043F\u0456\u0432\u0434\u043D\u0456')) return Xe(e.reference)
    if (n.match(/минулої\s*ночі/)) return Zn(e.reference)
    if (n.match(/минулого\s*вечора/)) return Jn(e.reference)
    if (n.match(/наступної\s*ночі/)) {
      let o = r.getHours() < 22 ? 1 : 2, a = new Date(r.getTime())
      a.setDate(a.getDate() + o), R(i, a), i.imply('hour', 1)
    }
    return n.match(/цієї\s*ночі/)
      ? we(e.reference)
      : n.endsWith('\u043E\u043F\u0456\u0432\u043D\u043E\u0447\u0456') ||
          n.endsWith('\u0432\u043D\u043E\u0447\u0456')
      ? we(e.reference)
      : i
  }
}
var Hc = 1
var zc = 2
var qc = 3
var hn = class extends V {
  innerPatternString(e) {
    return `(?:(?:,|\\(|\uFF08)\\s*)?(?:\u0432\\s*?)?(?:\u0443\\s*?)?(?:(\u0446\u0435\u0439|\u043C\u0438\u043D\u0443\u043B\u043E\u0433\u043E|\u043C\u0438\u043D\u0443\u043B\u0438\u0439|\u043F\u043E\u043F\u0435\u0440\u0435\u0434\u043D\u0456\u0439|\u043F\u043E\u043F\u0435\u0440\u0435\u0434\u043D\u044C\u043E\u0433\u043E|\u043D\u0430\u0441\u0442\u0443\u043F\u043D\u043E\u0433\u043E|\u043D\u0430\u0441\u0442\u0443\u043F\u043D\u0438\u0439|\u043D\u0430\u0441\u0442\u0443\u043F\u043D\u043E\u043C\u0443)\\s*)?(${
      p(ji)
    })(?:\\s*(?:,|\\)|\uFF09))?(?:\\s*(\u043D\u0430|\u0443|\u0432)\\s*(\u0446\u044C\u043E\u043C\u0443|\u043C\u0438\u043D\u0443\u043B\u043E\u043C\u0443|\u043D\u0430\u0441\u0442\u0443\u043F\u043D\u043E\u043C\u0443)\\s*\u0442\u0438\u0436\u043D\u0456)?`
  }
  innerExtract(e, t) {
    let r = t[zc].toLocaleLowerCase(), n = ji[r], i = t[Hc], o = t[qc], a = i || o
    a = a || '', a = a.toLocaleLowerCase()
    let m = null
    return a == '\u043C\u0438\u043D\u0443\u043B\u043E\u0433\u043E' ||
        a == '\u043C\u0438\u043D\u0443\u043B\u0438\u0439' ||
        a == '\u043F\u043E\u043F\u0435\u0440\u0435\u0434\u043D\u0456\u0439' ||
        a == '\u043F\u043E\u043F\u0435\u0440\u0435\u0434\u043D\u044C\u043E\u0433\u043E'
      ? m = 'last'
      : a == '\u043D\u0430\u0441\u0442\u0443\u043F\u043D\u043E\u0433\u043E' ||
          a == '\u043D\u0430\u0441\u0442\u0443\u043F\u043D\u0438\u0439'
      ? m = 'next'
      : (a == '\u0446\u0435\u0439' || a == '\u0446\u044C\u043E\u0433\u043E' ||
        a == '\u0446\u044C\u043E\u043C\u0443') && (m = 'this'),
      I(e.reference, n, m)
  }
}
var Vc = 1
var Kc = 2
var Rn = class extends V {
  innerPatternString(e) {
    return `(\u0432 \u043C\u0438\u043D\u0443\u043B\u043E\u043C\u0443|\u0443 \u043C\u0438\u043D\u0443\u043B\u043E\u043C\u0443|\u043D\u0430 \u043C\u0438\u043D\u0443\u043B\u043E\u043C\u0443|\u043C\u0438\u043D\u0443\u043B\u043E\u0433\u043E|\u043D\u0430 \u043D\u0430\u0441\u0442\u0443\u043F\u043D\u043E\u043C\u0443|\u0432 \u043D\u0430\u0441\u0442\u0443\u043F\u043D\u043E\u043C\u0443|\u0443 \u043D\u0430\u0441\u0442\u0443\u043F\u043D\u043E\u043C\u0443|\u043D\u0430\u0441\u0442\u0443\u043F\u043D\u043E\u0433\u043E|\u043D\u0430 \u0446\u044C\u043E\u043C\u0443|\u0432 \u0446\u044C\u043E\u043C\u0443|\u0443 \u0446\u044C\u043E\u043C\u0443|\u0446\u044C\u043E\u0433\u043E)\\s*(${
      p(mn)
    })(?=\\s*)`
  }
  innerExtract(e, t) {
    let r = t[Vc].toLowerCase(), n = t[Kc].toLowerCase(), i = mn[n]
    if (
      r == '\u043D\u0430 \u043D\u0430\u0441\u0442\u0443\u043F\u043D\u043E\u043C\u0443' ||
      r == '\u0432 \u043D\u0430\u0441\u0442\u0443\u043F\u043D\u043E\u043C\u0443' ||
      r == '\u0443 \u043D\u0430\u0441\u0442\u0443\u043F\u043D\u043E\u043C\u0443' ||
      r == '\u043D\u0430\u0441\u0442\u0443\u043F\u043D\u043E\u0433\u043E'
    ) {
      let m = {}
      return m[i] = 1, c.createRelativeFromReference(e.reference, m)
    }
    if (
      r == '\u043D\u0430 \u043C\u0438\u043D\u0443\u043B\u043E\u043C\u0443' ||
      r == '\u0432 \u043C\u0438\u043D\u0443\u043B\u043E\u043C\u0443' ||
      r == '\u0443 \u043C\u0438\u043D\u0443\u043B\u043E\u043C\u0443' ||
      r == '\u043C\u0438\u043D\u0443\u043B\u043E\u0433\u043E'
    ) {
      let m = {}
      return m[i] = -1, c.createRelativeFromReference(e.reference, m)
    }
    let o = e.createParsingComponents(), a = new Date(e.reference.instant.getTime())
    return i.match(/week/i)
      ? (a.setDate(a.getDate() - a.getDay()),
        o.imply('day', a.getDate()),
        o.imply('month', a.getMonth() + 1),
        o.imply('year', a.getFullYear()))
      : i.match(/month/i)
      ? (a.setDate(1),
        o.imply('day', a.getDate()),
        o.assign('year', a.getFullYear()),
        o.assign('month', a.getMonth() + 1))
      : i.match(/year/i) &&
        (a.setDate(1),
          a.setMonth(0),
          o.imply('day', a.getDate()),
          o.imply('month', a.getMonth() + 1),
          o.assign('year', a.getFullYear())),
      o
  }
}
var Pn = class extends V {
  innerPatternString(e) {
    return `(\u0446\u0456|\u043E\u0441\u0442\u0430\u043D\u043D\u0456|\u043C\u0438\u043D\u0443\u043B\u0456|\u043C\u0430\u0439\u0431\u0443\u0442\u043D\u0456|\u043D\u0430\u0441\u0442\u0443\u043F\u043D\u0456|\u043F\u0456\u0441\u043B\u044F|\u0447\u0435\u0440\u0435\u0437|\\+|-)\\s*(${at})`
  }
  innerExtract(e, t) {
    let r = t[1].toLowerCase(), n = mt(t[3])
    switch (r) {
      case '\u043E\u0441\u0442\u0430\u043D\u043D\u0456':
      case '\u043C\u0438\u043D\u0443\u043B\u0456':
      case '-':
        n = D(n)
        break
    }
    return c.createRelativeFromReference(e.reference, n)
  }
}
var Vi = new g(ym())
var Xc = new g(Ki(true))
function ym() {
  let s8 = Ki(false)
  return s8.parsers.unshift(new Tn()),
    s8.parsers.unshift(new yn()),
    s8.parsers.unshift(new ln()),
    s8.parsers.unshift(new Rn()),
    s8.parsers.unshift(new Pn()),
    s8
}
function Ki(s8) {
  return N({
    parsers: [
      new ae(),
      new b(true),
      new fn(),
      new un(),
      new hn(),
      new cn(s8),
      new pn(),
    ],
    refiners: [
      new gn(),
      new dn(),
    ],
  }, s8)
}
function Zc(s8, e, t) {
  return Vi.parse(s8, e, t)
}
function Jc(s8, e, t) {
  return Vi.parseDate(s8, e, t)
}
var Cm = {}
H(Cm, {
  GB: () => Yp,
  casual: () => eo,
  createCasualConfiguration: () => Om,
  createConfiguration: () => ws,
  parse: () => Sp,
  parseDate: () => $p,
  strict: () => kp,
})
var Ji = {
  domenica: 0,
  dom: 0,
  lunedì: 1,
  lun: 1,
  martedì: 2,
  mar: 2,
  mercoledì: 3,
  merc: 3,
  giovedì: 4,
  giov: 4,
  venerdì: 5,
  ven: 5,
  sabato: 6,
  sab: 6,
}
var Qi = {}
var ie = {
  ...Qi,
  gennaio: 1,
  gen: 1,
  'gen.': 1,
  febbraio: 2,
  feb: 2,
  'feb.': 2,
  febraio: 2,
  febb: 2,
  'febb.': 2,
  marzo: 3,
  mar: 3,
  'mar.': 3,
  aprile: 4,
  apr: 4,
  'apr.': 4,
  maggio: 5,
  mag: 5,
  giugno: 6,
  giu: 6,
  luglio: 7,
  lug: 7,
  lugl: 7,
  'lug.': 7,
  agosto: 8,
  ago: 8,
  settembre: 9,
  set: 9,
  'set.': 9,
  sett: 9,
  'sett.': 9,
  ottobre: 10,
  ott: 10,
  'ott.': 10,
  novembre: 11,
  nov: 11,
  'nov.': 11,
  dicembre: 12,
  dic: 12,
  dice: 12,
  'dic.': 12,
}
var Xi = {
  uno: 1,
  due: 2,
  tre: 3,
  quattro: 4,
  cinque: 5,
  sei: 6,
  sette: 7,
  otto: 8,
  nove: 9,
  dieci: 10,
  undici: 11,
  dodici: 12,
}
var Zi = {
  primo: 1,
  secondo: 2,
  terzo: 3,
  quarto: 4,
  quinto: 5,
  sesto: 6,
  settimo: 7,
  ottavo: 8,
  nono: 9,
  decimo: 10,
  undicesimo: 11,
  dodicesimo: 12,
  tredicesimo: 13,
  quattordicesimo: 14,
  quindicesimo: 15,
  sedicesimo: 16,
  diciassettesimo: 17,
  diciottesimo: 18,
  diciannovesimo: 19,
  ventesimo: 20,
  ventunesimo: 21,
  ventiduesimo: 22,
  ventitreesimo: 23,
  ventiquattresimo: 24,
  venticinquesimo: 25,
  ventiseiesimo: 26,
  ventisettesimo: 27,
  ventottesimo: 28,
  ventinovesimo: 29,
  trentesimo: 30,
  trentunesimo: 31,
}
var xn = {
  sec: 'second',
  secondo: 'second',
  secondi: 'second',
  min: 'minute',
  mins: 'minute',
  minuti: 'minute',
  h: 'hour',
  hr: 'hour',
  o: 'hour',
  ora: 'hour',
  ore: 'hour',
  giorno: 'day',
  giorni: 'day',
  settimana: 'week',
  settimane: 'week',
  mese: 'month',
  trimestre: 'quarter',
  trimestri: 'quarter',
  anni: 'year',
  anno: 'year',
}
var Qc = `(?:${
  p(Xi)
}|[0-9]+|[0-9]+\\.[0-9]+|half(?:\\s{0,2}un?)?|un?\\b(?:\\s{0,2}qualcuno)?|qualcuno|molti|a?\\s{0,2}alcuni\\s{0,2}(?:of)?)`
function ep(s8) {
  let e = s8.toLowerCase()
  return Xi[e] !== void 0
    ? Xi[e]
    : e === 'un' || e === 'una'
    ? 1
    : e.match(/alcuni/)
    ? 3
    : e.match(/metá/)
    ? 0.5
    : e.match(/paio/)
    ? 2
    : e.match(/molti/)
    ? 7
    : parseFloat(e)
}
var ft = `(?:${p(Zi)}|[0-9]{1,2}(?:mo|ndo|rzo|simo|esimo)?)`
function ut(s8) {
  let e = s8.toLowerCase()
  return Zi[e] !== void 0
    ? Zi[e]
    : (e = e.replace(/(?:imo|ndo|rzo|rto|nto|sto|tavo|nono|cimo|timo|esimo)$/i, ''), parseInt(e))
}
var lt = '(?:[1-9][0-9]{0,3}\\s{0,2}(?:BE|AD|BC|BCE|CE)|[1-2][0-9]{3}|[5-9][0-9])'
function ct(s8) {
  if (/BE/i.test(s8)) return s8 = s8.replace(/BE/i, ''), parseInt(s8) - 543
  if (/BCE?/i.test(s8)) return s8 = s8.replace(/BCE?/i, ''), -parseInt(s8)
  if (/(AD|CE)/i.test(s8)) return s8 = s8.replace(/(AD|CE)/i, ''), parseInt(s8)
  let e = parseInt(s8)
  return S(e)
}
var Pm = `(${Qc})\\s{0,3}(${p(xn)})`
var Rm = new RegExp(Pm, 'i')
var me = U('(?:(?:about|around)\\s{0,3})?', Pm)
function ce(s8) {
  let e = {}, t = s8, r = Rm.exec(t)
  for (; r;) tp(e, r), t = t.substring(r[0].length).trim(), r = Rm.exec(t)
  return e
}
function tp(s8, e) {
  let t = ep(e[1]), r = xn[e[2].toLowerCase()]
  s8[r] = t
}
var rp = new RegExp(
  `(?:within|in|for)\\s*(?:(?:pi\xF9 o meno|intorno|approssimativamente|verso|verso le)\\s*(?:~\\s*)?)?(${me})(?=\\W|$)`,
  'i',
)
var np = new RegExp(
  `(?:(?:pi\xF9 o meno|intorno|approssimativamente|verso|verso le)\\s*(?:~\\s*)?)?(${me})(?=\\W|$)`,
  'i',
)
var En = class extends f {
  innerPattern(e) {
    return e.option.forwardDate ? np : rp
  }
  innerExtract(e, t) {
    let r = ce(t[1])
    return c.createRelativeFromReference(e.reference, r)
  }
}
var sp = new RegExp(
  `(?:on\\s{0,3})?(${ft})(?:\\s{0,3}(?:al|\\-|\\\u2013|fino|alle|allo)?\\s{0,3}(${ft}))?(?:-|/|\\s{0,3}(?:dal)?\\s{0,3})(${
    p(ie)
  })(?:(?:-|/|,?\\s{0,3})(${lt}(?![^\\s]\\d)))?(?=\\W|$)`,
  'i',
)
var xm = 1
var Em = 2
var ip = 3
var Dm = 4
var Dn = class extends f {
  innerPattern() {
    return sp
  }
  innerExtract(e, t) {
    let r = e.createParsingResult(t.index, t[0]), n = ie[t[ip].toLowerCase()], i = ut(t[xm])
    if (i > 31) return t.index = t.index + t[xm].length, null
    if (r.start.assign('month', n), r.start.assign('day', i), t[Dm]) {
      let o = ct(t[Dm])
      r.start.assign('year', o)
    } else {
      let o = P(e.refDate, i, n)
      r.start.imply('year', o)
    }
    if (t[Em]) {
      let o = ut(t[Em])
      r.end = r.start.clone(), r.end.assign('day', o)
    }
    return r
  }
}
var op = new RegExp(
  `(${
    p(ie)
  })(?:-|/|\\s*,?\\s*)(${ft})(?!\\s*(?:am|pm))\\s*(?:(?:al|\\-|\\alle|\\del|\\s)\\s*(${ft})\\s*)?(?:(?:-|/|\\s*,?\\s*)(${lt}))?(?=\\W|$)(?!\\:\\d)`,
  'i',
)
var ap = 1
var mp = 2
var Am = 3
var wm = 4
var An = class extends f {
  innerPattern() {
    return op
  }
  innerExtract(e, t) {
    let r = ie[t[ap].toLowerCase()], n = ut(t[mp])
    if (n > 31) return null
    let i = e.createParsingComponents({
      day: n,
      month: r,
    })
    if (t[wm]) {
      let m = ct(t[wm])
      i.assign('year', m)
    } else {
      let m = P(e.refDate, n, r)
      i.imply('year', m)
    }
    if (!t[Am]) return i
    let o = ut(t[Am]), a = e.createParsingResult(t.index, t[0])
    return a.start = i, a.end = i.clone(), a.end.assign('day', o), a
  }
}
var fp = new RegExp(`((?:in)\\s*)?(${p(ie)})\\s*(?:[,-]?\\s*(${lt})?)?(?=[^\\s\\w]|\\s+[^0-9]|\\s+$|$)`, 'i')
var up = 1
var lp = 2
var Nm = 3
var wn = class extends f {
  innerPattern() {
    return fp
  }
  innerExtract(e, t) {
    let r = t[lp].toLowerCase()
    if (t[0].length <= 3 && !Qi[r]) return null
    let n = e.createParsingResult(t.index + (t[up] || '').length, t.index + t[0].length)
    n.start.imply('day', 1)
    let i = ie[r]
    if (n.start.assign('month', i), t[Nm]) {
      let o = ct(t[Nm])
      n.start.assign('year', o)
    } else {
      let o = P(e.refDate, 1, i)
      n.start.imply('year', o)
    }
    return n
  }
}
var cp = new RegExp(`([0-9]{4})[\\.\\/\\s](?:(${p(ie)})|([0-9]{1,2}))[\\.\\/\\s]([0-9]{1,2})(?=\\W|$)`, 'i')
var pp = 1
var dp = 2
var _m = 3
var gp = 4
var Nn = class extends f {
  innerPattern() {
    return cp
  }
  innerExtract(e, t) {
    let r = t[_m] ? parseInt(t[_m]) : ie[t[dp].toLowerCase()]
    if (r < 1 || r > 12) return null
    let n = parseInt(t[pp])
    return {
      day: parseInt(t[gp]),
      month: r,
      year: n,
    }
  }
}
var Tp = new RegExp('([0-9]|0[1-9]|1[012])/([0-9]{4})', 'i')
var yp = 1
var hp = 2
var _n = class extends f {
  innerPattern() {
    return Tp
  }
  innerExtract(e, t) {
    let r = parseInt(t[hp]), n = parseInt(t[yp])
    return e.createParsingComponents().imply('day', 1).assign('month', n).assign('year', r)
  }
}
var Mn = class extends k {
  constructor(e) {
    super(e)
  }
  followingPhase() {
    return '\\s*(?:\\-|\\\u2013|\\~|\\\u301C|to|\\?)\\s*'
  }
  primaryPrefix() {
    return '(?:(?:alle|dalle)\\s*)??'
  }
  primarySuffix() {
    return '(?:\\s*(?:o\\W*in punto|alle\\s*sera|in\\s*del\\s*(?:mattina|pomeriggio)))?(?!/)(?=\\W|$)'
  }
  extractPrimaryTimeComponents(e, t) {
    let r = super.extractPrimaryTimeComponents(e, t)
    if (r) {
      if (t[0].endsWith('sera')) {
        let n = r.get('hour')
        n >= 6 && n < 12
          ? (r.assign('hour', r.get('hour') + 12), r.assign('meridiem', u.PM))
          : n < 6 && r.assign('meridiem', u.AM)
      }
      if (t[0].endsWith('pomeriggio')) {
        r.assign('meridiem', u.PM)
        let n = r.get('hour')
        n >= 0 && n <= 6 && r.assign('hour', r.get('hour') + 12)
      }
      t[0].endsWith('mattina') &&
        (r.assign('meridiem', u.AM), r.get('hour') < 12 && r.assign('hour', r.get('hour')))
    }
    return r
  }
}
var Rp = new RegExp(`(${me})\\s{0,5}(?:fa|prima|precedente)(?=(?:\\W|$))`, 'i')
var Pp = new RegExp(`(${me})\\s{0,5}fa(?=(?:\\W|$))`, 'i')
var On = class extends f {
  strictMode
  constructor(e) {
    super(), this.strictMode = e
  }
  innerPattern() {
    return this.strictMode ? Pp : Rp
  }
  innerExtract(e, t) {
    let r = ce(t[1]), n = D(r)
    return c.createRelativeFromReference(e.reference, n)
  }
}
var xp = new RegExp(`(${me})\\s{0,5}(?:dopo|pi\xF9 tardi|da adesso|avanti|oltre|a seguire)(?=(?:\\W|$))`, 'i')
var Ep = new RegExp('(' + me + ')(dopo|pi\xF9 tardi)(?=(?:\\W|$))', 'i')
var Dp = 1
var Cn = class extends f {
  strictMode
  constructor(e) {
    super(), this.strictMode = e
  }
  innerPattern() {
    return this.strictMode ? Ep : xp
  }
  innerExtract(e, t) {
    let r = ce(t[Dp])
    return c.createRelativeFromReference(e.reference, r)
  }
}
var In = class extends _ {
  patternBetween() {
    return /^\s*(to|-)\s*$/i
  }
}
var bn = class extends M {
  patternBetween() {
    return new RegExp('^\\s*(T|alle|dopo|prima|il|di|del|delle|,|-)?\\s*$')
  }
}
var Ap = /(ora|oggi|stasera|questa sera|domani|dmn|ieri\s*sera)(?=\W|$)/i
var Wn = class extends f {
  innerPattern(e) {
    return Ap
  }
  innerExtract(e, t) {
    let r = e.refDate, n = t[0].toLowerCase(), i = e.createParsingComponents()
    switch (n) {
      case 'ora':
        return Y(e.reference)
      case 'oggi':
        return W(e.reference)
      case 'ieri':
        return $(e.reference)
      case 'domani':
      case 'dmn':
        return F(e.reference)
      case 'stasera':
      case 'questa sera':
        return Xn(e.reference)
      default:
        if (n.match(/ieri\s*sera/)) {
          if (r.getHours() > 6) {
            let o = new Date(r.getTime())
            o.setDate(o.getDate() - 1), r = o
          }
          R(i, r), i.imply('hour', 0)
        }
        break
    }
    return i
  }
}
var wp = /(?:questo|questa)?\s{0,3}(mattina|pomeriggio|sera|notte|mezzanotte|mezzogiorno)(?=\W|$)/i
var Un = class extends f {
  innerPattern() {
    return wp
  }
  innerExtract(e, t) {
    let r = e.refDate, n = e.createParsingComponents()
    switch (t[1].toLowerCase()) {
      case 'pomeriggio':
        n.imply('meridiem', u.PM), n.imply('hour', 15)
        break
      case 'sera':
      case 'notte':
        n.imply('meridiem', u.PM), n.imply('hour', 20)
        break
      case 'mezzanotte':
        let i = new Date(r.getTime())
        i.setDate(i.getDate() + 1),
          R(n, i),
          O(n, i),
          n.imply('hour', 0),
          n.imply('minute', 0),
          n.imply('second', 0)
        break
      case 'mattina':
        n.imply('meridiem', u.AM), n.imply('hour', 6)
        break
      case 'mezzogiorno':
        n.imply('meridiem', u.AM), n.imply('hour', 12)
        break
    }
    return n
  }
}
var Np = new RegExp(
  `(?:(?:\\,|\\(|\\\uFF08)\\s*)?(?:il\\s*?)?(?:(questa|l'ultima|scorsa|prossima)\\s*)?(${
    p(Ji)
  })(?:\\s*(?:\\,|\\)|\\\uFF09))?(?:\\s*(questa|l'ultima|scorsa|prossima)\\s*settimana)?(?=\\W|$)`,
  'i',
)
var _p = 1
var Mp = 2
var Op = 3
var kn = class extends f {
  innerPattern() {
    return Np
  }
  innerExtract(e, t) {
    let r = t[Mp].toLowerCase(), n = Ji[r], i = t[_p], o = t[Op], a = i || o
    a = a || '', a = a.toLowerCase()
    let m = null
    return a == 'ultima' || a == 'scorsa'
      ? m = 'ultima'
      : a == 'prossima'
      ? m = 'prossima'
      : a == 'questa' && (m = 'questa'),
      I(e.reference, n, m)
  }
}
var Cp = new RegExp(
  `(questo|ultimo|scorso|prossimo|dopo\\s*questo|questa|ultima|scorsa|prossima\\s*questa)\\s*(${
    p(xn)
  })(?=\\s*)(?=\\W|$)`,
  'i',
)
var Ip = 1
var bp = 2
var Yn = class extends f {
  innerPattern() {
    return Cp
  }
  innerExtract(e, t) {
    let r = t[Ip].toLowerCase(), n = t[bp].toLowerCase(), i = xn[n]
    if (r == 'prossimo' || r.startsWith('dopo')) {
      let m = {}
      return m[i] = 1, c.createRelativeFromReference(e.reference, m)
    }
    if (r == 'prima' || r == 'precedente') {
      let m = {}
      return m[i] = -1, c.createRelativeFromReference(e.reference, m)
    }
    let o = e.createParsingComponents(), a = new Date(e.reference.instant.getTime())
    return n.match(/settimana/i)
      ? (a.setDate(a.getDate() - a.getDay()),
        o.imply('day', a.getDate()),
        o.imply('month', a.getMonth() + 1),
        o.imply('year', a.getFullYear()))
      : n.match(/mese/i)
      ? (a.setDate(1),
        o.imply('day', a.getDate()),
        o.assign('year', a.getFullYear()),
        o.assign('month', a.getMonth() + 1))
      : n.match(/anno/i) &&
        (a.setDate(1),
          a.setMonth(0),
          o.imply('day', a.getDate()),
          o.imply('month', a.getMonth() + 1),
          o.assign('year', a.getFullYear())),
      o
  }
}
var Wp = new RegExp(
  `(questo|ultimo|passato|prossimo|dopo|questa|ultima|passata|prossima|\\+|-)\\s*(${me})(?=\\W|$)`,
  'i',
)
var Sn = class extends f {
  innerPattern() {
    return Wp
  }
  innerExtract(e, t) {
    let r = t[1].toLowerCase(), n = ce(t[2])
    switch (r) {
      case 'last':
      case 'past':
      case '-':
        n = D(n)
        break
    }
    return c.createRelativeFromReference(e.reference, n)
  }
}
function Mm(s8) {
  return s8.text.match(/\s+(prima|dal)$/i) != null
}
function Up(s8) {
  return s8.text.match(/\s+(dopo|dal|fino)$/i) != null
}
var $n = class extends B {
  patternBetween() {
    return /^\s*$/i
  }
  shouldMergeResults(e, t, r) {
    return !e.match(this.patternBetween()) || !Mm(t) && !Up(t)
      ? false
      : !!r.start.get('day') && !!r.start.get('month') && !!r.start.get('year')
  }
  mergeResults(e, t, r) {
    let n = ce(t.text)
    Mm(t) && (n = D(n))
    let i = c.createRelativeFromReference(E.fromDate(r.start.date()), n)
    return new x(r.reference, t.index, `${t.text}${e}${r.text}`, i)
  }
}
var eo = new g(Om(false))
var kp = new g(ws(true, false))
var Yp = new g(ws(false, true))
function Sp(s8, e, t) {
  return eo.parse(s8, e, t)
}
function $p(s8, e, t) {
  return eo.parseDate(s8, e, t)
}
function Om(s8 = false) {
  let e = ws(false, s8)
  return e.parsers.unshift(new Wn()),
    e.parsers.unshift(new Un()),
    e.parsers.unshift(new wn()),
    e.parsers.unshift(new Yn()),
    e.parsers.unshift(new Sn()),
    e
}
function ws(s8 = true, e = false) {
  return N({
    parsers: [
      new b(e),
      new En(),
      new Dn(),
      new An(),
      new kn(),
      new Nn(),
      new _n(),
      new Mn(s8),
      new On(s8),
      new Cn(s8),
    ],
    refiners: [
      new $n(),
      new bn(),
      new In(),
    ],
  }, s8)
}
var Bm = {}
H(Bm, {
  Chrono: () => g,
  Meridiem: () => u,
  ParsingComponents: () => c,
  ParsingResult: () => x,
  ReferenceWithTimezone: () => E,
  Weekday: () => y,
  casual: () => so,
  createCasualConfiguration: () => vm,
  createConfiguration: () => io,
  parse: () => rd,
  parseDate: () => nd,
  strict: () => td,
})
var to = {
  söndag: 0,
  sön: 0,
  so: 0,
  måndag: 1,
  mån: 1,
  må: 1,
  tisdag: 2,
  tis: 2,
  ti: 2,
  onsdag: 3,
  ons: 3,
  on: 3,
  torsdag: 4,
  tors: 4,
  to: 4,
  fredag: 5,
  fre: 5,
  fr: 5,
  lördag: 6,
  lör: 6,
  lö: 6,
}
var ro = {
  januari: 1,
  jan: 1,
  'jan.': 1,
  februari: 2,
  feb: 2,
  'feb.': 2,
  mars: 3,
  mar: 3,
  'mar.': 3,
  april: 4,
  apr: 4,
  'apr.': 4,
  maj: 5,
  juni: 6,
  jun: 6,
  'jun.': 6,
  juli: 7,
  jul: 7,
  'jul.': 7,
  augusti: 8,
  aug: 8,
  'aug.': 8,
  september: 9,
  sep: 9,
  'sep.': 9,
  sept: 9,
  oktober: 10,
  okt: 10,
  'okt.': 10,
  november: 11,
  nov: 11,
  'nov.': 11,
  december: 12,
  dec: 12,
  'dec.': 12,
}
var Fp = {
  första: 1,
  andra: 2,
  tredje: 3,
  fjärde: 4,
  femte: 5,
  sjätte: 6,
  sjunde: 7,
  åttonde: 8,
  nionde: 9,
  tionde: 10,
  elfte: 11,
  tolfte: 12,
  trettonde: 13,
  fjortonde: 14,
  femtonde: 15,
  sextonde: 16,
  sjuttonde: 17,
  artonde: 18,
  nittonde: 19,
  tjugonde: 20,
  tjugoförsta: 21,
  tjugoandra: 22,
  tjugotredje: 23,
  tjugofjärde: 24,
  tjugofemte: 25,
  tjugosjätte: 26,
  tjugosjunde: 27,
  tjugoåttonde: 28,
  tjugonionde: 29,
  trettionde: 30,
  trettioförsta: 31,
}
var Fn = {
  en: 1,
  ett: 1,
  två: 2,
  tre: 3,
  fyra: 4,
  fem: 5,
  sex: 6,
  sju: 7,
  åtta: 8,
  nio: 9,
  tio: 10,
  elva: 11,
  tolv: 12,
  tretton: 13,
  fjorton: 14,
  femton: 15,
  sexton: 16,
  sjutton: 17,
  arton: 18,
  nitton: 19,
  tjugo: 20,
  trettiо: 30,
  fyrtio: 40,
  femtio: 50,
  sextio: 60,
  sjuttio: 70,
  åttio: 80,
  nittio: 90,
  hundra: 100,
  tusen: 1e3,
}
var no = {
  sek: 'second',
  sekund: 'second',
  sekunder: 'second',
  min: 'minute',
  minut: 'minute',
  minuter: 'minute',
  tim: 'hour',
  timme: 'hour',
  timmar: 'hour',
  dag: 'day',
  dagar: 'day',
  vecka: 'week',
  veckor: 'week',
  mån: 'month',
  månad: 'month',
  månader: 'month',
  år: 'year',
  kvartаl: 'quarter',
  kvartal: 'quarter',
}
var Gp = {
  sekund: 'second',
  sekunder: 'second',
  minut: 'minute',
  minuter: 'minute',
  timme: 'hour',
  timmar: 'hour',
  dag: 'day',
  dagar: 'day',
  vecka: 'week',
  veckor: 'week',
  månad: 'month',
  månader: 'month',
  år: 'year',
  kvartal: 'quarter',
}
function bm(s8) {
  let e = {}, t = s8, r = Im.exec(t)
  for (; r;) vp(e, r), t = t.substring(r[0].length), r = Im.exec(t)
  return e
}
function vp(s8, e) {
  let t = Lp(e[1]), r = no[e[2].toLowerCase()]
  s8[r] = t
}
var Wm = `(?:${p(Fn)}|\\d+)`
var P_ = `(?:${p(Fp)}|\\d{1,2}(?:e|:e))`
var x_ = `(?:${p(no)})`
var Um = `(${Wm})\\s{0,5}(${p(no)})\\s{0,5}`
var Im = new RegExp(Um, 'i')
var Bp = `(${Wm})\\s{0,5}(${p(Gp)})\\s{0,5}`
var km = U('', Um)
var Ym = U('', Bp)
function Lp(s8) {
  let e = s8.toLowerCase()
  return Fn[e] !== void 0 ? Fn[e] : parseInt(e)
}
function Sm(s8) {
  if (/\d+/.test(s8)) {
    let t = parseInt(s8)
    return t < 100 && (t = S(t)), t
  }
  let e = s8.toLowerCase()
  return Fn[e] !== void 0 ? Fn[e] : parseInt(s8)
}
var jp = new RegExp(
  `(?:(?:\\,|\\(|\\\uFF08)\\s*)?(?:p\xE5\\s*?)?(?:(f\xF6rra|senaste|n\xE4sta|kommande)\\s*)?(${
    p(to)
  })(?:\\s*(?:\\,|\\)|\\\uFF09))?(?:\\s*(f\xF6rra|senaste|n\xE4sta|kommande)\\s*vecka)?(?=\\W|$)`,
  'i',
)
var Hp = 1
var zp = 3
var qp = 2
var Gn = class extends f {
  innerPattern() {
    return jp
  }
  innerExtract(e, t) {
    let r = t[qp].toLowerCase(), n = to[r], i = t[Hp], o = t[zp], a = i || o
    a = a || '', a = a.toLowerCase()
    let m = null
    return a.match(/förra|senaste/) ? m = 'last' : a.match(/nästa|kommande/) && (m = 'next'),
      I(e.reference, n, m)
  }
}
var Vp = new RegExp(
  `(?:den\\s*?)?([0-9]{1,2})(?:\\s*(?:till|\\-|\\\u2013|\\s)\\s*([0-9]{1,2}))?\\s*(${
    p(ro)
  })(?:(?:-|/|,?\\s*)([0-9]{4}(?![^\\s]\\d)))?(?=\\W|$)`,
  'i',
)
var $m = 1
var Fm = 2
var Kp = 3
var Gm = 4
var vn = class extends f {
  innerPattern() {
    return Vp
  }
  innerExtract(e, t) {
    let r = e.createParsingResult(t.index, t[0]), n = ro[t[Kp].toLowerCase()], i = parseInt(t[$m])
    if (i > 31) return t.index = t.index + t[$m].length, null
    if (r.start.assign('month', n), r.start.assign('day', i), t[Gm]) {
      let o = Sm(t[Gm])
      r.start.assign('year', o)
    } else {
      let o = P(e.refDate, i, n)
      r.start.imply('year', o)
    }
    if (t[Fm]) {
      let o = parseInt(t[Fm])
      r.end = r.start.clone(), r.end.assign('day', o)
    }
    return r
  }
}
var Xp = new RegExp(
  `(denna|den h\xE4r|f\xF6rra|passerade|n\xE4sta|kommande|efter|\\+|-)\\s*(${km})(?=\\W|$)`,
  'i',
)
var Zp = new RegExp(
  `(denna|den h\xE4r|f\xF6rra|passerade|n\xE4sta|kommande|efter|\\+|-)\\s*(${Ym})(?=\\W|$)`,
  'i',
)
var Bn = class extends f {
  allowAbbreviations
  constructor(e = true) {
    super(), this.allowAbbreviations = e
  }
  innerPattern() {
    return this.allowAbbreviations ? Xp : Zp
  }
  innerExtract(e, t) {
    let r = t[1].toLowerCase(), n = bm(t[2])
    if (!n) return null
    switch (r) {
      case 'f\xF6rra':
      case 'passerade':
      case '-':
        n = D(n)
        break
    }
    return c.createRelativeFromReference(e.reference, n)
  }
}
var Jp = new RegExp(
  '(nu|idag|imorgon|\xF6vermorgon|ig\xE5r|f\xF6rrg\xE5r|i\\s*f\xF6rrg\xE5r)(?:\\s*(?:p\xE5\\s*)?(morgonen?|f\xF6rmiddagen?|middagen?|eftermiddagen?|kv\xE4llen?|natten?|midnatt))?(?=\\W|$)',
  'i',
)
var Qp = 1
var ed = 2
var Ln = class extends f {
  innerPattern(e) {
    return Jp
  }
  innerExtract(e, t) {
    let r = e.refDate,
      n = (t[Qp] || '').toLowerCase(),
      i = (t[ed] || '').toLowerCase(),
      o = e.createParsingComponents()
    switch (n) {
      case 'nu':
        o = Y(e.reference)
        break
      case 'idag':
        o = W(e.reference)
        break
      case 'imorgon':
      case 'imorn':
        let a = new Date(r.getTime())
        a.setDate(a.getDate() + 1), R(o, a), O(o, a)
        break
      case 'ig\xE5r':
        let m = new Date(r.getTime())
        m.setDate(m.getDate() - 1), R(o, m), O(o, m)
        break
      case 'f\xF6rrg\xE5r':
      case 'i f\xF6rrg\xE5r':
        let l = new Date(r.getTime())
        l.setDate(l.getDate() - 2), R(o, l), O(o, l)
        break
    }
    switch (i) {
      case 'morgon':
      case 'morgonen':
        o.imply('hour', 6), o.imply('minute', 0), o.imply('second', 0), o.imply('millisecond', 0)
        break
      case 'f\xF6rmiddag':
      case 'f\xF6rmiddagen':
        o.imply('hour', 9), o.imply('minute', 0), o.imply('second', 0), o.imply('millisecond', 0)
        break
      case 'middag':
      case 'middagen':
        o.imply('hour', 12), o.imply('minute', 0), o.imply('second', 0), o.imply('millisecond', 0)
        break
      case 'eftermiddag':
      case 'eftermiddagen':
        o.imply('hour', 15), o.imply('minute', 0), o.imply('second', 0), o.imply('millisecond', 0)
        break
      case 'kv\xE4ll':
      case 'kv\xE4llen':
        o.imply('hour', 20), o.imply('minute', 0), o.imply('second', 0), o.imply('millisecond', 0)
        break
      case 'natt':
      case 'natten':
      case 'midnatt':
        i === 'midnatt' ? o.imply('hour', 0) : o.imply('hour', 2),
          o.imply('minute', 0),
          o.imply('second', 0),
          o.imply('millisecond', 0)
        break
    }
    return o
  }
}
var so = new g(vm())
var td = new g(io(true))
function rd(s8, e, t) {
  return so.parse(s8, e, t)
}
function nd(s8, e, t) {
  return so.parseDate(s8, e, t)
}
function vm(s8 = true) {
  let e = io(false, s8)
  return e.parsers.unshift(new Ln()), e
}
function io(s8 = true, e = true) {
  return N({
    parsers: [
      new ae(),
      new b(e),
      new vn(),
      new Gn(),
      new Bn(),
    ],
    refiners: [],
  }, s8)
}
var t2 = Us
var Lm = Yt
function r2(s8, e, t) {
  return Lm.parse(s8, e, t)
}
function n2(s8, e, t) {
  return Lm.parseDate(s8, e, t)
}
export {
  Ba as zh,
  Bm as sv,
  bo as en,
  c as ParsingComponents,
  Ca as nl,
  Cm as it,
  da as ja,
  E as ReferenceWithTimezone,
  es as ParsingContext,
  fm as es,
  g as Chrono,
  hm as uk,
  Lm as casual,
  n2 as parseDate,
  r2 as parse,
  sa as fr,
  t2 as strict,
  u as Meridiem,
  x as ParsingResult,
  xa as pt,
  y as Weekday,
  Za as ru,
  zo as de,
}
