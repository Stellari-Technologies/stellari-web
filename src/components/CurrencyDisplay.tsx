import { useEffect, useState } from 'react'

interface Participant {
  id: string
  name: string
  balance: number
  weeklyEarned: number
  nextMilestone: number
}

export function CurrencyDisplay({ participant }: { participant: Participant }) {
  const [displayedBalance, setDisplayedBalance] = useState(0)

  // Counts up to the real balance on mount instead of snapping straight to it
  useEffect(() => {
    const duration = 900
    const start = performance.now()
    const to = participant.balance

    let frame: number
    function tick(now: number) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplayedBalance(Math.round(to * eased))
      if (progress < 1) {
        frame = requestAnimationFrame(tick)
      }
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [participant.balance])

  const remaining = Math.max(participant.nextMilestone - participant.balance, 0)
  const progressPercent = Math.min(
    (participant.balance / participant.nextMilestone) * 100,
    100
  )

  return (
    <div className="currency-display">
      <p className="currency-welcome">Welcome back</p>
      <h2 className="currency-name">{participant.name}</h2>

      <div className="currency-balance">
        <span className="currency-amount">{displayedBalance.toLocaleString()}</span>
      </div>
      <p className="currency-label">points</p>

      <div className="currency-milestone">
        <div className="currency-progress-track">
          <div
            className="currency-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="currency-progress-meta">
          <span>{remaining} points to your next milestone</span>
          <span>Next: {participant.nextMilestone}</span>
        </div>
      </div>

      {participant.weeklyEarned > 0 && (
        <p className="currency-delta">+{participant.weeklyEarned} earned this week</p>
      )}
    </div>
  )
}