import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X } from 'lucide-react';
import { sound } from '../utils/audio';

interface LuckyWheelModalProps {
  onClose: () => void;
  onWinPrize: (prize: { label: string; coins?: number; booster?: 'hammer' | 'rocket' | 'rainbow'; amount: number }) => void;
  canSpinFree: boolean;
}

const PRIZES = [
  { label: '100 Coins', color: '#eab308', coins: 100, amount: 100 },
  { label: '1 Hammer', color: '#3b82f6', booster: 'hammer' as const, amount: 1 },
  { label: '250 Coins', color: '#f97316', coins: 250, amount: 250 },
  { label: '1 Rocket', color: '#ef4444', booster: 'rocket' as const, amount: 1 },
  { label: '500 Coins', color: '#8b5cf6', coins: 500, amount: 500 },
  { label: '1 Rainbow', color: '#ec4899', booster: 'rainbow' as const, amount: 1 },
  { label: '75 Coins', color: '#10b981', coins: 75, amount: 75 },
  { label: 'JACKPOT! 1,000 Coins', color: '#f59e0b', coins: 1000, amount: 1000 },
];

export const LuckyWheelModal: React.FC<LuckyWheelModalProps> = ({
  onClose,
  onWinPrize,
}) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonPrize, setWonPrize] = useState<(typeof PRIZES)[0] | null>(null);

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setWonPrize(null);
    sound.playRocket();

    // Pick a random wedge
    const prizeIndex = Math.floor(Math.random() * PRIZES.length);
    const wedgeAngle = 360 / PRIZES.length;
    // Calculate rotation with 5 to 7 full spins
    const extraSpins = 360 * 5;
    const targetAngle = extraSpins + (360 - prizeIndex * wedgeAngle - wedgeAngle / 2);

    setRotation((prev) => prev + targetAngle);

    setTimeout(() => {
      setSpinning(false);
      const prize = PRIZES[prizeIndex];
      setWonPrize(prize);
      sound.playWin();

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
    }, 4000);
  };

  const handleClaim = () => {
    if (wonPrize) {
      sound.playCoin();
      onWinPrize(wonPrize);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-sky-900 via-indigo-950 to-stone-950 border-4 border-amber-400 rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center font-bold shadow cursor-pointer transition-transform active:scale-90"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-2xl font-black font-game text-amber-300 drop-shadow">
          Lucky Spin
        </h2>
        <p className="text-xs text-sky-200 mt-0.5 font-game">
          Spin the wheel to win power-ups & coins!
        </p>

        {/* Wheel Container */}
        <div className="relative my-6 w-64 h-64 flex items-center justify-center">
          {/* Top Indicator Arrow */}
          <div className="absolute -top-3 z-30 flex flex-col items-center">
            <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" />
          </div>

          {/* Rotating Wheel */}
          <div
            className="w-full h-full rounded-full border-4 border-amber-300 overflow-hidden relative shadow-2xl transition-transform duration-[4000ms] ease-[cubic-bezier(0.15,0.9,0.25,1)]"
            style={{ transform: `rotate(${rotation}deg)` }}
          >
            {PRIZES.map((p, idx) => {
              const angle = (360 / PRIZES.length) * idx;
              return (
                <div
                  key={p.label}
                  className="absolute inset-0 origin-center"
                  style={{
                    transform: `rotate(${angle}deg)`,
                  }}
                >
                  <div
                    className="absolute top-0 left-1/2 -ml-16 w-32 h-32 flex flex-col items-center pt-2 origin-bottom text-white font-game font-bold text-[10px] drop-shadow"
                    style={{
                      backgroundColor: p.color,
                      clipPath: 'polygon(50% 100%, 0 0, 100% 0)',
                    }}
                  >
                    <span className="truncate max-w-[80px]">{p.label}</span>
                  </div>
                </div>
              );
            })}

            {/* Center Cap */}
            <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-gradient-to-t from-amber-500 to-amber-200 border-2 border-white shadow-lg flex items-center justify-center z-20">
              <span className="text-lg">⭐</span>
            </div>
          </div>
        </div>

        {/* Result & Spin Button */}
        {wonPrize ? (
          <div className="w-full space-y-3 animate-pop-in">
            <div className="bg-amber-400/20 border border-amber-400 rounded-2xl p-2.5">
              <span className="text-xs text-amber-200 font-game">You won:</span>
              <div className="text-lg font-black text-amber-300 font-game">{wonPrize.label}!</div>
            </div>
            <button
              onClick={handleClaim}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 text-stone-900 font-black font-game text-sm rounded-2xl shadow-lg btn-3d cursor-pointer"
            >
              Collect Prize!
            </button>
          </div>
        ) : (
          <button
            onClick={spinWheel}
            disabled={spinning}
            className={`w-full py-3 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-stone-900 font-black font-game text-sm rounded-2xl shadow-lg btn-3d cursor-pointer ${
              spinning ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {spinning ? 'Spinning...' : 'Spin for Free!'}
          </button>
        )}
      </div>
    </div>
  );
};
