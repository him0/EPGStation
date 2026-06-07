export const GUIDE_HOURS = 24
export const HOUR_MS = 60 * 60 * 1000

const WEEKDAYS = ['日', '月', '火', '水', '木', '金', '土']

/** YYYY-MM-DD の当日 00:00 を基準に 24h のレンジを返す(ローカルタイム) */
export function getDayRange(dateStr: string): { startAt: number; endAt: number } {
  const start = new Date(`${dateStr}T00:00:00`)
  const startAt = start.getTime()
  return { startAt, endAt: startAt + GUIDE_HOURS * HOUR_MS }
}

/**
 * 番組表の表示レンジを返す。
 * 今日は「現在の時」の頭から(= 少し前から)開始し、過去の無駄を省く。
 * それ以外の日はその日の 00:00 から。どちらも GUIDE_HOURS 分。
 */
export function getGuideRange(dateStr: string): { startAt: number; endAt: number } {
  if (dateStr === todayStr()) {
    const d = new Date()
    d.setMinutes(0, 0, 0) // 現在の時の頭にスナップ
    const startAt = d.getTime() - HOUR_MS // 1時間前から見えるように
    return { startAt, endAt: startAt + GUIDE_HOURS * HOUR_MS }
  }
  return getDayRange(dateStr)
}

export function todayStr(): string {
  return toDateStr(new Date())
}

export function toDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function addDays(dateStr: string, n: number): string {
  const d = new Date(`${dateStr}T00:00:00`)
  d.setDate(d.getDate() + n)
  return toDateStr(d)
}

/** 曜日(日〜土) */
export function weekdayLabel(dateStr: string): string {
  return WEEKDAYS[new Date(`${dateStr}T00:00:00`).getDay()]
}

/** MM/dd(曜) */
export function formatDateLabel(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`)
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${m}/${day}(${WEEKDAYS[d.getDay()]})`
}

export function formatHM(ms: number): string {
  const d = new Date(ms)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

export function formatRange(startAt: number, endAt: number): string {
  return `${formatHM(startAt)} 〜 ${formatHM(endAt)}`
}

/** AV サービス(テレビ)のみ表示するための判定。データ放送・ラジオ等を除外 */
export function isAudioVideoService(serviceType?: number): boolean {
  switch (serviceType) {
    case 0x01:
    case 0x02:
    case 0xa1:
    case 0xa2:
    case 0xa5:
    case 0xa6:
    case 0xad:
    case null:
    case undefined:
      return true
    default:
      return false
  }
}
