import React from 'react';
import { X, Download, Smartphone, Share2, PlusSquare, CheckCircle2 } from 'lucide-react';
import { sound } from '../utils/audio';

interface InstallAppModalProps {
  onClose: () => void;
  onNativeInstall?: () => void;
  canNativeInstall: boolean;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({
  onClose,
  onNativeInstall,
  canNativeInstall,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 via-sky-950 to-indigo-950 border-4 border-amber-400 rounded-3xl p-5 shadow-2xl flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center shadow cursor-pointer transition-transform active:scale-90"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Big Official App Icon Showcase */}
        <div className="relative my-2">
          <div className="w-24 h-24 rounded-3xl p-1 bg-gradient-to-b from-amber-400 to-rose-600 shadow-[0_8px_30px_rgba(245,158,11,0.5)] border-2 border-yellow-200">
            <img
              src="/logo.png"
              alt="Block Blast Puzzle"
              className="w-full h-full object-cover rounded-[20px]"
            />
          </div>
          <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full bg-emerald-500 text-[10px] font-black text-white uppercase shadow font-game">
            HD APP
          </span>
        </div>

        {/* Title & Package Info */}
        <h2 className="text-2xl font-black font-game text-white tracking-wide uppercase drop-shadow">
          Install App
        </h2>
        <div className="text-xs font-black text-amber-300 font-game mt-0.5">
          Block Blast Puzzle
        </div>
        <div className="text-[10px] font-mono text-slate-400 mt-0.5">
          com.blockblastpuzzle.game
        </div>

        {/* Features Checklist */}
        <div className="w-full bg-slate-900/80 border border-slate-700/70 rounded-2xl p-3 my-3 text-left space-y-1.5 text-xs font-game text-slate-200">
          <div className="flex items-center gap-2 text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Play offline anytime without internet</span>
          </div>
          <div className="flex items-center gap-2 text-sky-300">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Fast instant launch from your Home Screen</span>
          </div>
          <div className="flex items-center gap-2 text-amber-300">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Full-screen arcade gaming experience</span>
          </div>
        </div>

        {/* Install Action */}
        {canNativeInstall ? (
          <button
            onClick={() => {
              sound.playClick();
              if (onNativeInstall) onNativeInstall();
              onClose();
            }}
            className="w-full py-3.5 bg-gradient-to-r from-emerald-500 via-green-500 to-emerald-600 hover:from-emerald-400 text-stone-900 font-black font-game text-sm rounded-2xl shadow-lg btn-3d cursor-pointer flex items-center justify-center gap-2 border-2 border-emerald-200"
          >
            <Download className="w-5 h-5 fill-stone-900" />
            <span>INSTALL NOW</span>
          </button>
        ) : (
          <div className="w-full bg-sky-950/60 border border-sky-500/40 rounded-2xl p-3 text-left text-xs font-game text-sky-100 space-y-2">
            <div className="flex items-start gap-2">
              <Smartphone className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300">Android / Chrome:</strong> Tap the browser menu (⋮) and select <span className="underline font-bold">"Install app"</span> or "Add to Home Screen".
              </div>
            </div>
            <div className="flex items-start gap-2 pt-1 border-t border-sky-800/60">
              <Share2 className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-300">iPhone / Safari:</strong> Tap the Share button <Share2 className="inline w-3 h-3 text-sky-300" /> then choose <span className="underline font-bold">"Add to Home Screen"</span> <PlusSquare className="inline w-3 h-3 text-sky-300" />.
              </div>
            </div>
          </div>
        )}

        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="mt-3 text-xs text-slate-400 hover:text-white font-game py-1 cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};
