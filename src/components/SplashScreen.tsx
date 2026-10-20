import React from 'react';
import { Play, Trophy, Target, Sparkles, Volume2, VolumeX, Download } from 'lucide-react';
import { sound } from '../utils/audio';

interface SplashScreenProps {
  onPlay: () => void;
  highScore: number;
  coins: number;
  onOpenLeaderboard: () => void;
  onOpenChallenges: () => void;
  onOpenLuckyWheel: () => void;
  onOpenInstall?: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  onPlay,
  highScore,
  coins,
  onOpenLeaderboard,
  onOpenChallenges,
  onOpenLuckyWheel,
  onOpenInstall,
  soundEnabled,
  onToggleSound,
}) => {
  const handleStartGame = () => {
    sound.playRainbow();
    onPlay();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between px-4 py-4 sm:py-6 bg-[#070b14] overflow-hidden select-none">
      {/* Dynamic Ambient Background Lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-sky-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -left-20 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-10 -right-20 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      {/* Floating Decorative 3D Blocks in Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Top-left floating piece */}
        <div className="absolute top-16 left-4 sm:left-12 animate-float-gentle opacity-75">
          <div className="grid grid-cols-2 gap-1 p-1 bg-black/20 rounded-xl backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg block-3d-red shadow-lg" />
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg block-3d-red shadow-lg" />
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg block-3d-red shadow-lg" />
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg bg-transparent" />
          </div>
        </div>

        {/* Top-right floating piece */}
        <div className="absolute top-20 right-4 sm:right-12 animate-float-alt opacity-75">
          <div className="grid grid-cols-2 gap-1 p-1 bg-black/20 rounded-xl backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg block-3d-yellow shadow-lg" />
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg block-3d-yellow shadow-lg" />
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg block-3d-yellow shadow-lg" />
            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg block-3d-yellow shadow-lg" />
          </div>
        </div>

        {/* Bottom-left floating piece */}
        <div className="absolute bottom-32 left-3 sm:left-10 animate-float-alt opacity-65">
          <div className="flex flex-col gap-1 p-1 bg-black/20 rounded-xl backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg block-3d-blue shadow-lg" />
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg block-3d-blue shadow-lg" />
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg block-3d-blue shadow-lg" />
          </div>
        </div>

        {/* Bottom-right floating piece */}
        <div className="absolute bottom-36 right-3 sm:right-10 animate-float-gentle opacity-65">
          <div className="grid grid-cols-2 gap-1 p-1 bg-black/20 rounded-xl backdrop-blur-sm">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg block-3d-purple shadow-lg" />
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg block-3d-green shadow-lg" />
          </div>
        </div>
      </div>

      {/* TOP BAR: Brand, Install, Sound, Coins */}
      <div className="relative z-10 w-full max-w-md flex items-center justify-between pt-1 px-1">
        {/* Brand pill with real logo */}
        <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-700/80 px-2.5 py-1 rounded-2xl shadow-lg backdrop-blur-md">
          <img
            src="/logo.png"
            alt="Block Blast"
            className="w-5 h-5 rounded-md object-cover shadow border border-amber-400/40"
          />
          <span className="text-[11px] sm:text-xs font-black tracking-wider text-white font-game">
            BLOCK BLAST PUZZLE
          </span>
        </div>

        {/* Right Side: Install, Sound Toggle & Coins Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {onOpenInstall && (
            <button
              onClick={() => {
                sound.playClick();
                onOpenInstall();
              }}
              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 text-stone-900 font-black font-game text-[10px] sm:text-xs shadow-md border border-emerald-300/80 active:scale-95 transition-transform cursor-pointer"
              title="Install Game"
              aria-label="Install Game"
            >
              <Download className="w-3.5 h-3.5 fill-stone-900" />
              <span>Install</span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={() => {
              sound.playClick();
              onToggleSound();
            }}
            className="w-8 h-8 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-200 transition-transform active:scale-90 cursor-pointer shadow-lg backdrop-blur-md"
            title="Toggle Sound"
            aria-label="Toggle Sound"
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-sky-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-rose-400" />
            )}
          </button>

          {/* Coins Badge */}
          <div className="flex items-center gap-1 bg-gradient-to-r from-amber-950/80 to-slate-900/90 border border-amber-500/50 px-2.5 py-1 rounded-2xl shadow-lg backdrop-blur-md">
            <span className="text-xs">🪙</span>
            <span className="text-xs font-black text-amber-300 font-game">
              {coins.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* CENTER HERO: Official Logo Emblem & High Score */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full max-w-sm my-auto text-center px-2">
        {/* Official 3D Glossy App Logo Display */}
        <div className="relative my-2 sm:my-3 group">
          {/* Ambient Glowing Aura */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-amber-500/40 via-sky-500/20 to-purple-600/35 rounded-[38px] blur-2xl opacity-90 animate-pulse pointer-events-none" />
          
          <div className="relative w-44 h-44 sm:w-52 sm:h-52 rounded-[32px] p-1.5 bg-gradient-to-b from-amber-400 via-yellow-300 to-amber-600 shadow-[0_16px_40px_rgba(0,0,0,0.85),0_0_35px_rgba(245,158,11,0.5)] border-2 border-yellow-100 overflow-hidden transform transition-all duration-300 hover:scale-105 active:scale-98">
            <img
              src="/logo.png"
              alt="Block Blast Puzzle"
              className="w-full h-full object-cover rounded-[26px] shadow-inner select-none pointer-events-none"
            />
            {/* Shimmer sweep effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/25 to-transparent pointer-events-none animate-shine-sweep" />
          </div>

          {/* Floating Sparkle Badge */}
          <div className="absolute -top-2 -right-2 w-9 h-9 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 border-2 border-white flex items-center justify-center text-stone-900 shadow-xl animate-bounce">
            <Sparkles className="w-5 h-5 text-amber-950 fill-amber-950" />
          </div>
        </div>

        {/* High Score Trophy Card */}
        <div className="w-full max-w-[280px] bg-gradient-to-r from-amber-950/70 via-slate-900/90 to-amber-950/70 border border-amber-500/40 rounded-2xl px-4 py-2 flex items-center justify-between shadow-lg backdrop-blur-sm mt-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/50 flex items-center justify-center text-amber-300 shadow">
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-left leading-tight">
              <div className="text-[9px] font-extrabold uppercase tracking-wider text-amber-400/90">
                BEST RECORD
              </div>
              <div className="text-base sm:text-lg font-black text-white font-game">
                {highScore.toLocaleString()} PTS
              </div>
            </div>
          </div>
          <span className="text-xs">🏆</span>
        </div>
      </div>

      {/* BOTTOM SECTION: MAIN PLAY BUTTON & QUICK ACTIONS */}
      <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-3 pb-2">
        {/* THE HERO PLAY BUTTON */}
        <button
          onClick={handleStartGame}
          className="relative w-full max-w-[320px] h-16 rounded-2xl bg-gradient-to-b from-emerald-400 via-green-500 to-emerald-600 hover:from-emerald-300 hover:to-emerald-500 border-2 border-emerald-200 border-b-[6px] border-b-emerald-800 active:border-b-2 active:translate-y-1 transition-all duration-150 shadow-[0_12px_28px_rgba(16,185,129,0.45)] cursor-pointer flex items-center justify-center gap-3 group overflow-hidden animate-play-pulse"
          title="Play Super Blast Puzzle"
          aria-label="Play Now"
        >
          {/* Light Sweep Animation */}
          <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none animate-shine-sweep" />

          {/* Big Play Triangle */}
          <div className="w-10 h-10 rounded-xl bg-stone-950/20 border border-white/40 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 fill-white text-white ml-0.5" />
          </div>

          {/* Text labels */}
          <div className="flex flex-col text-left leading-none">
            <span className="text-xl sm:text-2xl font-black font-game text-white tracking-wider uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
              PLAY NOW
            </span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-100/90 font-game mt-0.5">
              TAP TO BLAST
            </span>
          </div>

          <Sparkles className="w-5 h-5 text-yellow-200 animate-spin-rainbow ml-auto mr-2 shrink-0" />
        </button>

        {/* Quick Features Row: Leaderboard, Lucky Spin, Daily Quests */}
        <div className="w-full max-w-[320px] grid grid-cols-3 gap-2">
          {/* Leaderboard */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenLeaderboard();
            }}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 active:scale-95 transition-all cursor-pointer shadow"
            title="Global Leaderboard"
          >
            <Trophy className="w-4 h-4 text-amber-400 mb-0.5" />
            <span className="text-[10px] font-black font-game text-slate-200">
              Rankings
            </span>
          </button>

          {/* Lucky Spin Wheel */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenLuckyWheel();
            }}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-gradient-to-b from-amber-500/20 to-slate-900/90 hover:from-amber-500/30 border border-amber-500/50 active:scale-95 transition-all cursor-pointer shadow"
            title="Lucky Spin Wheel"
          >
            <span className="text-sm mb-0.5">🎡</span>
            <span className="text-[10px] font-black font-game text-amber-300">
              Lucky Spin
            </span>
          </button>

          {/* Daily Quests */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenChallenges();
            }}
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 active:scale-95 transition-all cursor-pointer shadow"
            title="Daily Quests"
          >
            <Target className="w-4 h-4 text-emerald-400 mb-0.5" />
            <span className="text-[10px] font-black font-game text-slate-200">
              Quests
            </span>
          </button>
        </div>

        {/* Micro Footer Hint & Package Identifier */}
        <div className="flex flex-col items-center gap-0.5 text-center">
          <p className="text-[10px] text-slate-400 font-game tracking-wide">
            Drag shapes • Clear rows & columns • Create combo blasts!
          </p>
          <span className="text-[9px] font-mono font-medium text-slate-500 tracking-wider">
            com.blockblastpuzzle.game • v1.0.0
          </span>
        </div>
      </div>
    </div>
  );
};
