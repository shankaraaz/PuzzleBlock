import React, { useState, useEffect } from 'react';
import { X, Play, DollarSign, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/audio';

interface RewardedAdModalProps {
  rewardType: 'moves' | 'coins' | 'booster';
  onRewardGranted: () => void;
  onClose: () => void;
  onTrackAdRevenue: (amount: number) => void;
  totalAdRevenue: number;
}

export const RewardedAdModal: React.FC<RewardedAdModalProps> = ({
  rewardType,
  onRewardGranted,
  onClose,
  onTrackAdRevenue,
  totalAdRevenue,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(5);
  const [canClose, setCanClose] = useState(false);
  const [rewardClaimed, setRewardClaimed] = useState(false);
  const [adSound, setAdSound] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClaim = () => {
    if (rewardClaimed) return;
    setRewardClaimed(true);
    sound.playWin();
    // Simulate $0.035 to $0.05 revenue generated per rewarded video impression!
    const revenueEarned = 0.04;
    onTrackAdRevenue(revenueEarned);
    onRewardGranted();
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const getRewardLabel = () => {
    switch (rewardType) {
      case 'moves':
        return '+5 Extra Moves!';
      case 'coins':
        return '+150 Free Coins!';
      case 'booster':
        return '+1 Free Hammer Booster!';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-stone-900 via-stone-950 to-neutral-900 border-2 border-stone-700 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
        {/* Top Ad Network Status Bar */}
        <div className="bg-stone-950 px-4 py-2 flex items-center justify-between text-xs text-stone-300 border-b border-stone-800">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-300 font-extrabold px-1.5 py-0.5 rounded text-[10px]">
              AD
            </span>
            <span className="font-semibold text-stone-300">Unity Rewarded Ads</span>
          </div>

          <div className="flex items-center gap-2">
            {canClose ? (
              <button
                onClick={() => {
                  sound.playClick();
                  onClose();
                }}
                className="w-6 h-6 rounded-full bg-stone-700 hover:bg-stone-600 text-white flex items-center justify-center cursor-pointer"
                aria-label="Skip Ad"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            ) : (
              <span className="font-mono text-amber-400 font-bold">
                Reward in {secondsLeft}s
              </span>
            )}
          </div>
        </div>

        {/* Video Simulation Screen */}
        <div className="relative aspect-[4/3] bg-gradient-to-tr from-indigo-900 via-purple-900 to-rose-700 p-4 flex flex-col justify-between overflow-hidden">
          {/* Animated decorative game ad visuals */}
          <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-sky-400/20 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between">
            <span className="text-[10px] bg-black/50 px-2 py-0.5 rounded-full text-white backdrop-blur-sm">
              Sponsored Game Preview
            </span>
            <button
              onClick={() => setAdSound(!adSound)}
              className="w-7 h-7 bg-black/40 rounded-full flex items-center justify-center text-white"
            >
              {adSound ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5 text-stone-400" />}
            </button>
          </div>

          <div className="relative z-10 text-center my-auto">
            <div className="text-4xl animate-bounce">🏰⚔️💎</div>
            <h3 className="text-xl font-black font-game text-white drop-shadow mt-1">
              Royal Blast Kingdoms
            </h3>
            <p className="text-xs text-amber-200 mt-0.5 font-medium">
              Over 50,000,000 downloads worldwide!
            </p>
            <div className="mt-3 flex items-center justify-center gap-1">
              <span className="text-amber-300 text-xs">★★★★★</span>
              <span className="text-[11px] text-white/80">(4.8 rating)</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative z-10 w-full bg-black/40 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-400 h-full transition-all duration-1000 ease-linear"
              style={{ width: `${((5 - secondsLeft) / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Ad Developer Revenue & Reward Box */}
        <div className="p-4 bg-stone-900 flex flex-col gap-3">
          {/* Revenue Generation Telemetry for User/Creator */}
          <div className="bg-emerald-950/60 border border-emerald-500/30 rounded-xl p-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <div className="font-bold text-emerald-300">Creator Ad Monetization</div>
                <div className="text-[10px] text-emerald-200/80">Est. eCPM: $18.50 / 1000 views</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-mono font-bold text-emerald-400 text-xs">
                ${(totalAdRevenue + 0.04).toFixed(3)}
              </div>
              <div className="text-[9px] text-emerald-300/70">Total Revenue</div>
            </div>
          </div>

          {/* User Reward Outcome */}
          <div className="text-center">
            <div className="text-xs text-stone-400">Your Reward:</div>
            <div className="text-lg font-black font-game text-amber-400">
              {getRewardLabel()}
            </div>
          </div>

          {/* Claim or Wait Button */}
          {canClose ? (
            <button
              onClick={handleClaim}
              className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 text-stone-900 font-black font-game text-sm rounded-2xl shadow-lg btn-3d cursor-pointer flex items-center justify-center gap-2 animate-bounce"
            >
              <Sparkles className="w-4 h-4" />
              <span>Claim Your Reward!</span>
            </button>
          ) : (
            <button
              disabled
              className="w-full py-3 bg-stone-800 text-stone-400 font-black font-game text-xs rounded-2xl cursor-not-allowed"
            >
              Reward unlocks in {secondsLeft} seconds...
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
