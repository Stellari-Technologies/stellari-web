import { useState } from 'react';
import { useNfcScan } from '../hooks/useNfcScan';
import { CurrencyDisplay } from '../components/CurrencyDisplay';

interface Participant {
  id: string;
  name: string;
  balance: number;
  weeklyEarned: number;
}

// TODO: replace with the real lookup once the backend endpoint exists.
// Should resolve a scanned card UID to the participant's current balance.
async function resolveParticipantByCardId(cardId: string): Promise<Participant> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    id: cardId,
    name: 'Sample Ninja',
    balance: 1280,
    weeklyEarned: 250,
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
    } catch {
      setState({ status: 'error', message: 'Card not recognized — try again' });
    }
  };

  const { inputProps, simulateScan } = useNfcScan({ onScan: handleScan });

  return (
    <div className="scan-screen">
      {/* Hidden field that captures the reader's keystrokes */}
      <input {...inputProps} />

      {state.status === 'idle' && <p className="scan-prompt">Tap your card to scan</p>}
      {state.status === 'loading' && <p className="scan-prompt">Scanning…</p>}
      {state.status === 'error' && <p className="scan-error">{state.message}</p>}
      {state.status === 'resolved' && (
        <CurrencyDisplay participant={state.participant} />
      )}

      {/* Remove once real hardware is confirmed working */}
      <button
        className="scan-simulate-btn"
        onClick={() => simulateScan('TEST-CARD-001')}
      >
        Simulate scan (dev only)
      </button>
    </div>
  );
}