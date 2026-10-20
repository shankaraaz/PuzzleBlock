import React from 'react';
import { X, Play, RefreshCw, MapPin, Volume2, VolumeX, Home } from 'lucide-react';
import { sound } from '../utils/audio';

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onOpenMap: () => void;
  onGoHome?: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  adRevenue: number;
  adsWatched: number;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onOpenMap,
  onGoHome,
  soundEnabled,
  onToggleSound,
  adRevenue,
  adsWatched,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xs bg-gradient-to-b from-sky-900 via-sky-950 to-indigo-950 border-4 border-amber-400 rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onResume();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center font-bold shadow cursor-pointer transition-transform active:scale-90"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Game Logo Badge */}
        <div className="relative mb-2">
          <img
            src="/logo.png"
            alt="Block Blast Puzzle"
            className="w-14 h-14 rounded-2xl object-cover shadow-xl border-2 border-amber-400/90"
          />
        </div>

        <h2 className="text-xl font-black font-game text-amber-300 drop-shadow mb-3">
          Game Paused
        </h2>

        {/* Buttons List */}
        <div className="w-full space-y-2.5">
          <button
            onClick={() => {
              sound.playClick();
              onResume();
            }}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 text-stone-900 font-black font-game text-sm rounded-2xl shadow-lg btn-3d cursor-pointer flex items-center justify-center gap-2"
          >
            <Play className="w-4 h-4 fill-stone-900" />
            <span>Resume Game</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onRestart();
            }}
            className="w-full py-2.5 bg-sky-700 hover:bg-sky-600 text-white font-black font-game text-xs rounded-2xl border border-sky-400/50 shadow btn-3d cursor-pointer flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Restart Level</span>
          </button>

          {onGoHome && (
            <button
              onClick={() => {
                sound.playClick();
                onGoHome();
              }}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-black font-game text-xs rounded-2xl border border-slate-600 shadow btn-3d cursor-pointer flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4 text-amber-400" />
              <span>Main Menu</span>
            </button>
          )}

          <button
            onClick={() => {
              sound.playClick();
              onOpenMap();
            }}
            className="w-full py-2.5 bg-indigo-700 hover:bg-indigo-600 text-white font-black font-game text-xs rounded-2xl border border-indigo-400/50 shadow btn-3d cursor-pointer flex items-center justify-center gap-2"
          >
            <MapPin className="w-4 h-4" />
            <span>Level Map</span>
          </button>

          <button
            onClick={onToggleSound}
            className="w-full py-2.5 bg-stone-800 hover:bg-stone-700 text-amber-200 font-bold font-game text-xs rounded-2xl border border-stone-700 shadow flex items-center justify-center gap-2 cursor-pointer"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400" />
                <span>Sound Effects: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-rose-400" />
                <span>Sound Effects: MUTED</span>
              </>
            )}
          </button>
        </div>

        {/* Ad Monetization Status */}
        <div className="mt-4 w-full bg-black/40 border border-emerald-500/30 rounded-xl p-2.5 text-[11px] text-emerald-200">
          <div className="flex items-center justify-between font-game">
            <span>Ad Revenue Generated:</span>
            <span className="font-bold text-emerald-400 font-mono">${adRevenue.toFixed(3)}</span>
          </div>
          <div className="flex items-center justify-between text-stone-400 text-[10px] mt-0.5">
            <span>Rewarded Ads Watched:</span>
            <span>{adsWatched} ads</span>
          </div>
        </div>
      </div>
    </div>
  );
};
