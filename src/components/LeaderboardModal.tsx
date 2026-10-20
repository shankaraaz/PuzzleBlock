import React, { useState } from 'react';
import { LeaderboardUser } from '../types/game';
import { X, Trophy, Medal, Star } from 'lucide-react';
import { sound } from '../utils/audio';

interface LeaderboardModalProps {
  users: LeaderboardUser[];
  onClose: () => void;
  currentUserScore: number;
  currentUserLevel: number;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  users,
  onClose,
  currentUserScore,
  currentUserLevel,
}) => {
  const [activeTab, setActiveTab] = useState<'global' | 'weekly'>('global');

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1:
        return <span className="text-xl">🥇</span>;
      case 2:
        return <span className="text-xl">🥈</span>;
      case 3:
        return <span className="text-xl">🥉</span>;
      default:
        return (
          <span className="w-6 h-6 rounded-full bg-sky-950 text-sky-200 font-game font-bold text-xs flex items-center justify-center border border-sky-700">
            {rank}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-gradient-to-b from-sky-800 via-sky-900 to-indigo-950 border-4 border-amber-500 rounded-3xl p-5 shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-sky-700/60">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="/logo.png"
                alt="Block Blast"
                className="w-10 h-10 rounded-xl object-cover border-2 border-amber-400 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 text-xs">🏆</span>
            </div>
            <div>
              <h2 className="text-xl font-black font-game text-amber-300 drop-shadow">
                Hall of Fame
              </h2>
              <div className="text-xs text-sky-200 font-game">
                Top Blasters Worldwide
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

        {/* Tab Switcher */}
        <div className="mt-3 bg-sky-950/80 p-1 rounded-xl flex gap-1 border border-sky-700/60">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('global');
            }}
            className={`flex-1 py-1.5 text-xs font-game font-black rounded-lg transition-all cursor-pointer ${
              activeTab === 'global'
                ? 'bg-amber-400 text-stone-900 shadow'
                : 'text-sky-200 hover:text-white'
            }`}
          >
            All-Time Global
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('weekly');
            }}
            className={`flex-1 py-1.5 text-xs font-game font-black rounded-lg transition-all cursor-pointer ${
              activeTab === 'weekly'
                ? 'bg-amber-400 text-stone-900 shadow'
                : 'text-sky-200 hover:text-white'
            }`}
          >
            Weekly Tournament
          </button>
        </div>

        {/* Top 3 Podium Cards */}
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {users.slice(0, 3).map((u, i) => {
            const ranks = [2, 1, 3]; // center is rank 1
            const userForPodium = i === 0 ? users[1] : i === 1 ? users[0] : users[2];
            const podiumRank = i === 0 ? 2 : i === 1 ? 1 : 3;

            return (
              <div
                key={userForPodium.name}
                className={`flex flex-col items-center p-2 rounded-2xl border ${
                  podiumRank === 1
                    ? 'bg-amber-500/20 border-amber-400 -translate-y-1 shadow-lg'
                    : 'bg-sky-950/60 border-sky-700/60'
                }`}
              >
                <span className="text-2xl">{userForPodium.avatar}</span>
                <span className="text-[11px] font-bold text-white truncate max-w-[80px] mt-1 font-game">
                  {userForPodium.name.split(' ')[0]}
                </span>
                <span className="text-xs font-black text-amber-300 font-game">
                  {userForPodium.score.toLocaleString()}
                </span>
                <div className="mt-1 flex items-center gap-0.5 text-[10px] text-sky-200">
                  <Star className="w-3 h-3 fill-amber-300 text-amber-300" />
                  <span>{userForPodium.stars ?? 10}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Leaderboard Table */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-2 game-scrollbar pr-1">
          {users.map((u) => {
            const isUser = u.isUser;
            return (
              <div
                key={u.name}
                className={`flex items-center justify-between p-2.5 rounded-xl border transition-all ${
                  isUser
                    ? 'bg-gradient-to-r from-amber-500/30 to-amber-600/30 border-amber-400 ring-2 ring-amber-400/50'
                    : 'bg-sky-950/60 border-sky-700/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 flex justify-center">{getRankBadge(u.rank)}</div>
                  <span className="text-xl">{u.avatar}</span>
                  <div>
                    <div className="text-xs font-bold text-white font-game flex items-center gap-1.5">
                      <span>{u.name}</span>
                      {isUser && (
                        <span className="text-[9px] bg-amber-400 text-stone-900 px-1 rounded font-extrabold">
                          YOU
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-sky-300/80 font-game">
                      Rank #{u.rank} · {u.badge || 'Player'}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black text-amber-300 font-game">
                    {(isUser ? currentUserScore : u.score).toLocaleString()}
                  </div>
                  <div className="text-[9px] text-sky-300/70">Points</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-3 pt-2 border-t border-sky-800 text-center text-xs text-amber-200 font-game">
          Weekly tournament rewards top 3 blasters with 1,000 Coins!
        </div>
      </div>
    </div>
  );
};
