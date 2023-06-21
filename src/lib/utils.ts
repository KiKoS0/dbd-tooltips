export function getTimeout(ttl: number | string | Date): number {
  const ttlDate: Date = new Date(ttl)
  const now: Date = new Date(Date.now())
  const diff: number = ttlDate.getTime() - now.getTime()
  return diff
}

export function getRandom(max: number): number {
  return Math.random() * max
}

export const lessThanFourMinsAgo = (date: number): boolean => {
  const FOUR_MINS: number = 60 * 4 * 1000 /* ms */
  const anHourAgo: number = Date.now() - FOUR_MINS

  return date > anHourAgo
}

export function checkForContainer(name: string): boolean {
  return document.getElementsByClassName(name).length > 0
}
