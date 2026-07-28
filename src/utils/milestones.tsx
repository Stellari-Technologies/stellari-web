/**
 * Rounds up to the next milestone threshold above the current balance.
 * With the default 500-point increments: 1280 -> 1500, 1500 -> 2000, 0 -> 500.
 */
export function getNextMilestone(balance: number, increment = 500): number {
  if (balance <= 0) return increment
  return Math.ceil((balance + 1) / increment) * increment
}