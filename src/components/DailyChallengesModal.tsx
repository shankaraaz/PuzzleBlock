import React from 'react';
import { DailyChallenge } from '../types/game';
import { X, CheckCircle2, Clock } from 'lucide-react';
import { sound } from '../utils/audio';

interface DailyChallengesModalProps {
  challenges: DailyChallenge[];
  onClaim: (challengeId: string) => void;
  onClose: () => void;
}

export const DailyChallengesModal: React.FC<DailyChallengesModalProps> = ({
  challenges,
  onClaim,
  onClose,
}) => {
  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'coins':
        return '🪙';
      case 'hammer':
        return '🔨';
      case 'rocket':
        return '🚀';
      case 'rainbow':
        return '🌈';
      default:
        return '🎁';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-b from-sky-800 via-sky-900 to-indigo-950 border-4 border-amber-500 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sky-700/60">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎯</span>
            <div>
              <h2 className="text-xl font-black font-game text-amber-300 drop-shadow">
                Daily Challenges
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-sky-200 font-game">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span>Resets in 14h 22m</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-9 h-9 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center font-bold shadow-md cursor-pointer transition-transform active:scale-90"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Challenges List */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-3 game-scrollbar pr-1">
          {challenges.map((c) => {
            const isFinished = c.current >= c.target;
            const progressPercent = Math.min(100, Math.round((c.current / c.target) * 100));

            return (
              <div
                key={c.id}
                className="bg-sky-950/70 border border-sky-700/50 rounded-2xl p-3.5 flex items-center justify-between gap-3 shadow-md"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-game font-bold text-sm text-white">{c.title}</span>
                    {c.claimed && (
                      <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-400/40">
                        Claimed
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-sky-200/80 mt-0.5">{c.description}</p>

                  {/* Progress Bar */}
                  <div className="mt-2.5 w-full bg-stone-900 rounded-full h-3 border border-sky-800/80 overflow-hidden relative">
                    <div
                      className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full rounded-full transition-all duration-300"
                      style={{ width: `${progressPercent}%` }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-[9px] font-black font-game text-white drop-shadow">
                      {c.current} / {c.target}
                    </div>
                  </div>
                </div>

                {/* Reward & Action */}
                <div className="flex flex-col items-center gap-1 shrink-0">
                  <div className="flex items-center gap-1 font-game font-extrabold text-xs text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-500/30">
                    <span>{getRewardIcon(c.rewardType)}</span>
                    <span>+{c.rewardAmount}</span>
                  </div>

                  {c.claimed ? (
                    <div className="text-emerald-400 flex items-center gap-1 text-xs font-game font-bold py-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Done</span>
                    </div>
                  ) : (
                    <button
                      disabled={!isFinished}
                      onClick={() => {
                        sound.playCoin();
                        onClaim(c.id);
                      }}
                      className={`
                        px-3 py-1.5 rounded-xl font-game font-black text-xs btn-3d cursor-pointer
                        ${
                          isFinished
                            ? 'bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 text-stone-900 shadow-lg animate-pulse'
                            : 'bg-stone-800 text-stone-500 border border-stone-700 cursor-not-allowed'
                        }
                      `}
                    >
                      {isFinished ? 'Claim!' : 'In Progress'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Tip footer */}
        <div className="mt-4 pt-3 border-t border-sky-800/60 text-center text-xs text-sky-300/80">
          Complete all challenges daily to boost your score & booster stash!
        </div>
      </div>
    </div>
  );
};
