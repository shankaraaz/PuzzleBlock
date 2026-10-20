import React from 'react';
import { ActiveBooster } from '../types/game';
import { Pause, Volume2, VolumeX, RefreshCw, Undo2, Zap, Trophy, Target, Flame, Sparkles, Home } from 'lucide-react';
import { sound } from '../utils/audio';

export const ComboChainIndicator: React.FC<{ combo: number }> = ({ combo }) => {
  const isActive = combo > 0;
  const isMulti = combo >= 2;

  // Scale multiplier: base 1.0, scales up as player hits consecutive lines (1.08 -> 1.16 -> 1.24 -> 1.32)
  const scale = isActive ? Math.min(1 + Math.max(0, combo - 1) * 0.08, 1.32) : 1;

  // Tier styling based on active combo streak
  let tier = {
    label: 'CHAIN',
    multiplierText: combo >= 2 ? `x${combo}` : combo === 1 ? 'x1' : 'x1',
    badgeClass: 'border-slate-800 bg-slate-900/60 text-slate-400',
    flameClass: 'text-slate-600',
    multiplierClass: 'text-slate-500',
    pipActiveClass: 'bg-slate-500',
  };

  if (combo === 1) {
    tier = {
      label: 'STREAK',
      multiplierText: 'x1',
      badgeClass:
        'border-amber-500/60 bg-gradient-to-r from-amber-500/15 to-yellow-500/10 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.25)]',
      flameClass: 'text-amber-400',
      multiplierClass: 'text-amber-300 font-black',
      pipActiveClass: 'bg-amber-400 shadow-[0_0_6px_rgba(245,158,11,0.8)]',
    };
  } else if (combo === 2) {
    tier = {
      label: 'COMBO',
      multiplierText: 'x2',
      badgeClass:
        'border-orange-500/80 bg-gradient-to-r from-amber-500/20 via-orange-500/25 to-amber-500/20 text-orange-200 shadow-[0_0_15px_rgba(249,115,22,0.35)] ring-1 ring-orange-400/50',
      flameClass: 'text-orange-400 animate-flame-flicker',
      multiplierClass: 'text-amber-200 font-black',
      pipActiveClass: 'bg-orange-400 shadow-[0_0_8px_rgba(249,115,22,0.9)]',
    };
  } else if (combo === 3) {
    tier = {
      label: 'SUPER COMBO',
      multiplierText: 'x3',
      badgeClass:
        'border-rose-500/90 bg-gradient-to-r from-orange-500/25 via-rose-500/30 to-amber-500/20 text-white shadow-[0_0_18px_rgba(244,63,94,0.45)] ring-1 ring-rose-400/60',
      flameClass: 'text-rose-400 animate-flame-flicker',
      multiplierClass: 'text-white font-black',
      pipActiveClass: 'bg-rose-400 shadow-[0_0_10px_rgba(244,63,94,1)]',
    };
  } else if (combo === 4) {
    tier = {
      label: 'MEGA COMBO',
      multiplierText: 'x4',
      badgeClass:
        'border-red-400 bg-gradient-to-r from-rose-600/35 via-amber-500/30 to-red-600/35 text-yellow-100 shadow-[0_0_22px_rgba(239,68,68,0.55)] ring-2 ring-amber-400/70',
      flameClass: 'text-amber-300 animate-flame-flicker',
      multiplierClass: 'text-yellow-200 font-black',
      pipActiveClass: 'bg-yellow-300 shadow-[0_0_10px_rgba(253,224,71,1)]',
    };
  } else if (combo >= 5) {
    tier = {
      label: 'ULTRA COMBO',
      multiplierText: `x${combo}`,
      badgeClass:
        'border-purple-400 bg-gradient-to-r from-purple-600/40 via-rose-500/35 to-amber-400/40 text-yellow-100 shadow-[0_0_26px_rgba(168,85,247,0.65)] ring-2 ring-yellow-400 animate-streak-shimmer',
      flameClass: 'text-yellow-300 animate-flame-flicker',
      multiplierClass: 'text-yellow-200 font-black',
      pipActiveClass: 'bg-gradient-to-r from-yellow-300 to-rose-400 shadow-[0_0_12px_rgba(253,224,71,1)]',
    };
  }

  return (
    <div
      key={combo}
      style={{
        transform: `scale(${scale})`,
        transformOrigin: 'left center',
      }}
      className={`relative flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-xl border transition-all duration-300 select-none ${tier.badgeClass} ${
        isActive ? 'animate-combo-pop' : 'opacity-60'
      }`}
      title={isActive ? `Active Combo Chain: ${tier.multiplierText} (${combo} consecutive)` : 'Combo Chain: Clear consecutive lines to build multiplier!'}
    >
      {/* Flame Icon */}
      <Flame className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 transition-all ${tier.flameClass}`} />

      {/* Chain Status & Multiplier Details */}
      <div className="flex flex-col leading-tight">
        <div className="flex items-center gap-1">
          <span className="text-[7.5px] sm:text-[8px] font-black tracking-wider uppercase opacity-90 leading-none">
            {tier.label}
          </span>
          {isMulti && (
            <span className="text-[7px] font-extrabold px-1 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40 leading-none uppercase">
              CHAIN
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`text-xs sm:text-sm font-black font-game tracking-tight leading-none ${tier.multiplierClass}`}>
            {tier.multiplierText}
          </span>

          {/* Consecutive Lines Chain Pips */}
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((pip) => (
              <span
                key={pip}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
                  combo >= pip ? tier.pipActiveClass : 'bg-slate-700/50'
                }`}
              />
            ))}
            {combo > 5 && (
              <span className="text-[8px] font-black text-amber-300 ml-0.5 leading-none">
                +{combo - 5}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

interface BlockBlastTopProps {
  onPause: () => void;
  onRestart: () => void;
  onGoHome?: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  highScore: number;
  score: number;
  combo: number;
  activeBooster: ActiveBooster;
  setActiveBooster: (b: ActiveBooster) => void;
  boosters: {
    hammer: number;
    lineBlast: number;
    colorSweep: number;
    shuffle: number;
    undo: number;
  };
  onShuffle: () => void;
  onUndo: () => void;
  onOpenAdForBooster: () => void;
  onOpenLeaderboard: () => void;
  onOpenChallenges: () => void;
  canUndo: boolean;
}

export const BlockBlastTop: React.FC<BlockBlastTopProps> = ({
  onPause,
  onRestart,
  onGoHome,
  soundEnabled,
  onToggleSound,
  highScore,
  score,
  combo,
  activeBooster,
  setActiveBooster,
  boosters,
  onShuffle,
  onUndo,
  onOpenAdForBooster,
  onOpenLeaderboard,
  onOpenChallenges,
  canUndo,
}) => {
  return (
    <header className="w-full max-w-[420px] flex flex-col gap-1.5 select-none shrink-0 pt-0.5">
      {/* Row 1: Essential Controls & Status fixed at top */}
      <div className="w-full flex items-center justify-between gap-1.5 px-0.5">
        {/* Left: Home, Pause, Sound, Restart */}
        <div className="flex items-center gap-1.5">
          {onGoHome && (
            <button
              onClick={() => {
                sound.playClick();
                onGoHome();
              }}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#141d33] hover:bg-[#1a2642] active:scale-90 border border-slate-700/70 flex items-center justify-center text-amber-400 transition-transform cursor-pointer shadow"
              title="Return to Home Menu"
              aria-label="Home"
            >
              <Home className="w-3.5 h-3.5 text-amber-400" />
            </button>
          )}

          <button
            onClick={() => {
              sound.playClick();
              onPause();
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#141d33] hover:bg-[#1a2642] active:scale-90 border border-slate-700/70 flex items-center justify-center text-slate-200 transition-transform cursor-pointer shadow"
            title="Pause game"
            aria-label="Pause"
          >
            <Pause className="w-3.5 h-3.5 fill-slate-200" />
          </button>

          <button
            onClick={onToggleSound}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#141d33] hover:bg-[#1a2642] active:scale-90 border border-slate-700/70 flex items-center justify-center text-slate-200 transition-transform cursor-pointer shadow"
            title="Toggle Sound"
            aria-label="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-sky-400" />
            ) : (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            )}
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#141d33] hover:bg-[#1a2642] active:scale-90 border border-slate-700/70 flex items-center justify-center text-slate-200 transition-transform cursor-pointer shadow"
            title="Restart Game"
            aria-label="Restart Game"
          >
            <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
          </button>
        </div>

        {/* Center: Block Blast Puzzle Brand Badge with Real Logo */}
        <div className="flex items-center gap-1.5 bg-[#141d33]/90 border border-slate-700/60 px-2 sm:px-2.5 py-1 rounded-xl shadow">
          <img
            src="/logo.png"
            alt="Block Blast Puzzle"
            className="w-4 h-4 sm:w-4.5 sm:h-4.5 rounded-md object-cover shadow-sm border border-amber-400/40"
          />
          <span className="text-[10px] sm:text-[11px] font-black text-white tracking-wider font-game uppercase">
            BLOCK BLAST
          </span>
        </div>

        {/* Right: High Score & Modals (Leaderboard & Quests) */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              sound.playClick();
              onOpenLeaderboard();
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#141d33] hover:bg-[#1a2642] active:scale-90 border border-slate-700/70 flex items-center justify-center text-amber-400 transition-transform cursor-pointer shadow"
            title="Leaderboard"
          >
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onOpenChallenges();
            }}
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#141d33] hover:bg-[#1a2642] active:scale-90 border border-slate-700/70 flex items-center justify-center text-emerald-400 transition-transform cursor-pointer shadow"
            title="Daily Quests"
          >
            <Target className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          <div className="flex items-center gap-1 bg-[#141d33] border border-slate-700/70 px-2 py-1 rounded-xl shadow">
            <span className="text-amber-400 text-[10px]">🏆</span>
            <span className="text-[11px] sm:text-xs font-black text-amber-300 font-game">
              {highScore.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Fixed Top Score & Boosters Header (Merged to preserve screen height) */}
      <div className="w-full bg-[#11192b]/95 border border-slate-800/90 rounded-2xl px-2.5 py-1.5 flex items-center justify-between gap-2 shadow-inner">
        {/* Score & Active Combo Chain Multiplier Indicator */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <div>
            <div className="text-[8px] font-extrabold uppercase tracking-wider text-slate-400 leading-none">
              SCORE
            </div>
            <div className="text-xl sm:text-2xl font-black text-white font-game leading-tight">
              {score.toLocaleString()}
            </div>
          </div>

          <ComboChainIndicator combo={combo} />
        </div>

        {/* Essential Power Boosters fixed at the top */}
        <div className="flex items-center gap-1">
          {/* Hammer Booster */}
          <button
            onClick={() => {
              sound.playClick();
              setActiveBooster(activeBooster === 'hammer' ? 'none' : 'hammer');
            }}
            title="Hammer: smash any single block"
            className={`relative p-1.5 rounded-lg border transition-all cursor-pointer active:scale-95 ${
              activeBooster === 'hammer'
                ? 'bg-amber-500/30 border-amber-400 scale-105 ring-1 ring-amber-400'
                : 'bg-slate-800/60 border-slate-700/50 hover:bg-slate-700/60'
            }`}
          >
            <span className="text-xs sm:text-sm">🔨</span>
            <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 font-black text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white shadow">
              {boosters.hammer}
            </span>
          </button>

          {/* Line Blast Booster */}
          <button
            onClick={() => {
              sound.playClick();
              setActiveBooster(activeBooster === 'line_blast' ? 'none' : 'line_blast');
            }}
            title="Line Blast: clear row or column"
            className={`relative p-1.5 rounded-lg border transition-all cursor-pointer active:scale-95 ${
              activeBooster === 'line_blast'
                ? 'bg-sky-500/30 border-sky-400 scale-105 ring-1 ring-sky-400'
                : 'bg-slate-800/60 border-slate-700/50 hover:bg-slate-700/60'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-sky-400" />
            <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 font-black text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white shadow">
              {boosters.lineBlast}
            </span>
          </button>

          {/* Shuffle Booster */}
          <button
            onClick={() => {
              sound.playClick();
              onShuffle();
            }}
            title="Shuffle pieces"
            className="relative p-1.5 rounded-lg bg-slate-800/60 border border-slate-700/50 hover:bg-slate-700/60 transition-all cursor-pointer active:scale-95"
          >
            <span className="text-xs sm:text-sm">🔀</span>
            <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 font-black text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white shadow">
              {boosters.shuffle}
            </span>
          </button>

          {/* Undo Booster */}
          <button
            disabled={!canUndo}
            onClick={() => {
              sound.playClick();
              onUndo();
            }}
            title="Undo previous move"
            className={`relative p-1.5 rounded-lg border transition-all ${
              canUndo
                ? 'bg-slate-800/60 border-slate-700/50 hover:bg-slate-700/60 cursor-pointer active:scale-95'
                : 'opacity-30 border-transparent cursor-not-allowed'
            }`}
          >
            <Undo2 className="w-3.5 h-3.5 text-indigo-400" />
            <span className="absolute -top-1 -right-1 bg-amber-500 text-stone-950 font-black text-[8px] w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white shadow">
              {boosters.undo}
            </span>
          </button>

          {/* +1 AD Free Reward */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenAdForBooster();
            }}
            title="Watch short ad to refill boosters"
            className="relative px-2 py-1 rounded-lg bg-amber-500/20 border border-amber-400/60 hover:bg-amber-500/30 flex items-center gap-1 transition-all cursor-pointer active:scale-95 animate-pulse"
          >
            <span className="text-[11px]">🎁</span>
            <span className="text-[9px] font-black text-amber-300">+1 AD</span>
          </button>
        </div>
      </div>
    </header>
  );
};
