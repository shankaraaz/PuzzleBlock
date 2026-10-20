import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Star, ArrowRight, Play, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface VictoryModalProps {
  levelNumber: number;
  score: number;
  movesLeft: number;
  starsEarned: number;
  onNextLevel: () => void;
  onWatchAdForDouble: () => void;
  mascotImg: string;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  levelNumber,
  score,
  movesLeft,
  starsEarned,
  onNextLevel,
  onWatchAdForDouble,
  mascotImg,
}) => {
  const baseCoins = 50 + movesLeft * 10;

  useEffect(() => {
    // Launch celebratory confetti
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
      colors: ['#facc15', '#ef4444', '#38bdf8', '#22c55e', '#a855f7'],
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-amber-900 via-sky-950 to-indigo-950 border-4 border-amber-400 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
        {/* Mascot Avatar Top */}
        <div className="relative -mt-16 w-24 h-24 rounded-full border-4 border-amber-300 shadow-xl overflow-hidden bg-amber-400">
          <img
            src={mascotImg}
            alt="Cheering Mascot"
            className="w-full h-full object-cover"
          />
        </div>

        <h2 className="text-2xl font-black font-game text-amber-300 drop-shadow mt-3">
          Level {levelNumber} Cleared!
        </h2>
        <p className="text-xs text-sky-200 font-game">
          Super blast mastery achieved!
        </p>

        {/* 3 Stars Animation */}
        <div className="my-4 flex items-center justify-center gap-3">
          {[1, 2, 3].map((s) => {
            const hasStar = s <= starsEarned;
            return (
              <div
                key={s}
                className={`relative transition-all duration-300 ${
                  hasStar ? 'scale-110 animate-bounce' : 'opacity-40 scale-90'
                }`}
                style={{ animationDelay: `${s * 150}ms` }}
              >
                <Star
                  className={`w-12 h-12 ${
                    hasStar
                      ? 'fill-amber-300 text-amber-400 drop-shadow-[0_4px_8px_rgba(250,204,21,0.6)]'
                      : 'fill-stone-700 text-stone-500'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Score & Rewards Card */}
        <div className="w-full bg-sky-950/70 border border-amber-400/30 rounded-2xl p-3 mb-4 space-y-1.5 font-game">
          <div className="flex justify-between text-xs text-sky-200">
            <span>Score:</span>
            <span className="font-black text-amber-300">{score.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-xs text-sky-200">
            <span>Remaining Moves Bonus:</span>
            <span className="font-black text-emerald-400">+{movesLeft * 10} Coins</span>
          </div>
          <div className="flex justify-between text-xs text-sky-200 pt-1 border-t border-sky-800">
            <span className="font-bold text-white">Total Earned:</span>
            <span className="font-black text-amber-300 text-sm">+{baseCoins} 🪙</span>
          </div>
        </div>

        {/* Ad Double Reward Button */}
        <button
          onClick={() => {
            sound.playClick();
            onWatchAdForDouble();
          }}
          className="w-full py-2.5 mb-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 text-stone-900 font-black font-game text-xs rounded-2xl shadow-md btn-3d cursor-pointer flex items-center justify-center gap-2 border border-amber-200"
        >
          <Sparkles className="w-4 h-4" />
          <span>Watch Ad to 2x Rewards (+{baseCoins * 2} 🪙)</span>
        </button>

        {/* Next Level Button */}
        <button
          onClick={() => {
            sound.playClick();
            onNextLevel();
          }}
          className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 text-stone-900 font-black font-game text-sm rounded-2xl shadow-lg btn-3d cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Next Level</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
