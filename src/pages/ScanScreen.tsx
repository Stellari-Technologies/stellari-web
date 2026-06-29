import { useState } from 'react';
import { useNfcScan } from '../hooks/useNfcScan';
import { CurrencyDisplay } from '../components/CurrencyDisplay';
import { getNextMilestone } from '../utils/milestones';
import '../styles/scan.css';

interface Participant {
  id: string;
  name: string;
  balance: number;
  weeklyEarned: number;
  nextMilestone: number;
  stars: number;
  maxStars: number;
}

async function resolveParticipantByCardId(cardId: string): Promise<Participant> {
  await new Promise((resolve) => setTimeout(resolve, 800));
  const balance = 1280;
  return {
    id: cardId,
    name: 'Sample Participant',
    balance,
    weeklyEarned: 250,
    nextMilestone: getNextMilestone(balance),
    stars: 3,
    maxStars: 5,
  };
}

type ScanState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'resolved'; participant: Participant }
  | { status: 'error'; message: string };

export function ScanScreen() {
  const [state, setState] = useState<ScanState>({ status: 'idle' });

  const handleScan = async (cardId: string) => {
    setState({ status: 'loading' });
    try {
      const participant = await resolveParticipantByCardId(cardId);
      setState({ status: 'resolved', participant });
      setTimeout(() => setState({ status: 'idle' }), 8000);
    } catch {
      setState({ status: 'error', message: 'Card not recognized — try again' });
      setTimeout(() => setState({ status: 'idle' }), 3000);
    }
  };

  const { inputProps } = useNfcScan({ onScan: handleScan });

  return (
    <div className="scan-screen">
      <input {...inputProps} />

      {state.status === 'idle' && (
        <div className="scan-idle">
          <div className="nfc-ring-wrap">
            <div className="ring" />
            <div className="ring" />
            <div className="ring" />
            <div className="nfc-icon">
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
                <path d="M15 6C10.03 6 6 10.03 6 15s4.03 9 9 9 9-4.03 9-9" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" />
                <path d="M15 10c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" />
                <circle cx="15" cy="15" r="2" fill="#818cf8" />
                <path d="M22 6l1.5-1.5M24 9h2M21 3V1" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <p className="scan-prompt">Tap your card to scan</p>
          <p className="scan-sub">Hold card near reader</p>
        </div>
      )}

      {state.status === 'loading' && (
        <div className="scan-loading">
          <div className="scan-spinner" />
          <p className="scan-loading-text">Scanning…</p>
        </div>
      )}

      {state.status === 'error' && (
        <div className="scan-error-wrap">
          <div className="scan-error-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 8v5M12 16h.01" stroke="#f87171" strokeWidth="2" strokeLinecap="round" />
              <circle cx="12" cy="12" r="9" stroke="#f87171" strokeWidth="1.5" />
            </svg>
          </div>
          <p className="scan-error">{state.message}</p>
          <p className="scan-error-sub">Try again or contact staff</p>
        </div>
      )}

      {state.status === 'resolved' && (
        <CurrencyDisplay participant={state.participant} />
      )}
    </div>
  );
}