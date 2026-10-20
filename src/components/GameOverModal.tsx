import React from 'react';
import { RefreshCw, Play, Sparkles, X, Home } from 'lucide-react';
import { sound } from '../utils/audio';

interface GameOverModalProps {
  onWatchAdForMoves: () => void;
  onBuyMovesWithCoins: () => void;
  onRetry: () => void;
  onGoHome?: () => void;
  coins: number;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  onWatchAdForMoves,
  onBuyMovesWithCoins,
  onRetry,
  onGoHome,
  coins,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-stone-900 via-sky-950 to-indigo-950 border-4 border-rose-500 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
        {/* Brand header */}
        <div className="flex items-center gap-1.5 mb-2 px-2.5 py-0.5 rounded-full bg-slate-900/90 border border-slate-700/80">
          <img
            src="/logo.png"
            alt="Block Blast"
            className="w-4 h-4 rounded-md object-cover"
          />
          <span className="text-[10px] font-black font-game text-slate-300 uppercase tracking-wider">
            Block Blast Puzzle
          </span>
        </div>

        {/* Sad icon or alarm */}
        <div className="w-14 h-14 rounded-full bg-rose-500/20 border-2 border-rose-400 flex items-center justify-center text-2xl mb-2 shadow">
          ⏰
        </div>

        <h2 className="text-2xl font-black font-game text-rose-400 drop-shadow">
          Out of Moves!
        </h2>
        <p className="text-xs text-sky-200 mt-1 font-game">
          You were so close! Don't let this puzzle slip away.
        </p>

        {/* Action Offers */}
        <div className="w-full my-5 space-y-2.5">
          {/* Watch Ad for +5 Moves (Free) */}
          <button
            onClick={() => {
              sound.playClick();
              onWatchAdForMoves();
            }}
            className="w-full py-3 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 text-stone-900 font-black font-game text-sm rounded-2xl shadow-lg btn-3d cursor-pointer flex items-center justify-center gap-2 border-2 border-amber-200"
          >
            <Play className="w-4 h-4 fill-stone-900" />
            <span>Watch Ad for +5 Moves (FREE!)</span>
          </button>

          {/* Spend 50 Coins for +5 Moves */}
          <button
            disabled={coins < 50}
            onClick={() => {
              sound.playCoin();
              onBuyMovesWithCoins();
            }}
            className={`w-full py-2.5 rounded-2xl font-game font-bold text-xs flex items-center justify-center gap-2 btn-3d cursor-pointer ${
              coins >= 50
                ? 'bg-sky-600 hover:bg-sky-500 text-white border border-sky-300'
                : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
            }`}
          >
            <span>🪙 50 Coins for +5 Moves</span>
            <span className="text-[10px] text-sky-200">({coins} available)</span>
          </button>
        </div>

        {/* Retry / Give Up / Main Menu */}
        <div className="flex items-center gap-4 mt-2">
          <button
            onClick={() => {
              sound.playClick();
              onRetry();
            }}
            className="text-xs text-sky-300 hover:text-white font-game flex items-center gap-1.5 py-1 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restart</span>
          </button>

          {onGoHome && (
            <button
              onClick={() => {
                sound.playClick();
                onGoHome();
              }}
              className="text-xs text-amber-300 hover:text-amber-200 font-game flex items-center gap-1.5 py-1 cursor-pointer transition-colors"
            >
              <Home className="w-3.5 h-3.5 text-amber-400" />
              <span>Main Menu</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
