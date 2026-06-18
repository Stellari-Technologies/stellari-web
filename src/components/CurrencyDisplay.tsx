interface Participant {
  id: string;
  name: string;
  balance: number;
  weeklyEarned: number;
}

export function CurrencyDisplay({ participant }: { participant: Participant }) {
  return (
    <div className="currency-display">
      <h2 className="currency-name">{participant.name}</h2>
      <div className="currency-balance">
        <span className="currency-amount">{participant.balance.toLocaleString()}</span>
        <span className="currency-label">points</span>
      </div>
      {participant.weeklyEarned > 0 && (
        <p className="currency-delta">+{participant.weeklyEarned} earned this week</p>
      )}
    </div>
  );
}