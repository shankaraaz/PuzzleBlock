import React, { useState, useEffect } from 'react';
import { Volume2, Sparkles, ExternalLink, Gift, X } from 'lucide-react';
import { sound } from '../utils/audio';

interface TopAdBannerProps {
  onClaimRewardAd?: () => void;
}

const AD_CAMPAIGNS = [
  {
    id: 'ad-1',
    appTitle: 'Block Master: Royal Match 3D',
    tagline: '⭐ 4.9 • Free Download • #1 Puzzle Game',
    badge: 'AD',
    iconEmoji: '👑',
    accentColor: 'from-amber-500/20 to-yellow-600/10',
    borderColor: 'border-amber-500/30',
    btnColor: 'bg-gradient-to-r from-amber-400 to-yellow-500 text-stone-950',
    rewardText: '🎁 Free Gift',
  },
  {
    id: 'ad-2',
    appTitle: 'Gem Blast: Crystal Legend',
    tagline: '⭐ 4.8 • Blast Gems & Win Real Rewards',
    badge: 'AD',
    iconEmoji: '💎',
    accentColor: 'from-cyan-500/20 to-blue-600/10',
    borderColor: 'border-cyan-500/30',
    btnColor: 'bg-gradient-to-r from-cyan-400 to-sky-500 text-stone-950',
    rewardText: '🎁 Claim Coins',
  },
  {
    id: 'ad-3',
    appTitle: 'Super Brain IQ: Tile Connect',
    tagline: '⭐ 4.9 • Train Your Mind with Daily Puzzles',
    badge: 'AD',
    iconEmoji: '🧠',
    accentColor: 'from-purple-500/20 to-indigo-600/10',
    borderColor: 'border-purple-500/30',
    btnColor: 'bg-gradient-to-r from-purple-400 to-pink-500 text-white',
    rewardText: '🎁 +1 Booster',
  },
];

export const TopAdBanner: React.FC<TopAdBannerProps> = ({ onClaimRewardAd }) => {
  const [currentAdIdx, setCurrentAdIdx] = useState(0);
  const [claimedNotice, setClaimedNotice] = useState<string | null>(null);

  // Cycle ad every 25 seconds for realism
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAdIdx((prev) => (prev + 1) % AD_CAMPAIGNS.length);
    }, 25000);
    return () => clearInterval(timer);
  }, []);

  const ad = AD_CAMPAIGNS[currentAdIdx];

  const handleAdClick = () => {
    sound.playClick();
    if (onClaimRewardAd) {
      onClaimRewardAd();
    } else {
      setClaimedNotice('+50 Bonus Coins Claimed!');
      setTimeout(() => setClaimedNotice(null), 2500);
    }
  };

  return (
    <div className="w-full max-w-[440px] shrink-0 select-none px-0.5">
      <div
        onClick={handleAdClick}
        className={`w-full h-[44px] sm:h-[48px] rounded-xl bg-gradient-to-r ${ad.accentColor} bg-[#0d1424]/95 border ${ad.borderColor} flex items-center justify-between px-2.5 py-1 shadow-md hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer relative overflow-hidden`}
      >
        {/* Subtle shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_3s_infinite] pointer-events-none" />

        {/* Left: Ad Badge & App Icon */}
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex flex-col items-center shrink-0">
            <span className="text-[9px] font-black leading-none bg-amber-400 text-stone-950 px-1 py-0.5 rounded font-mono tracking-wider">
              {ad.badge}
            </span>
          </div>

          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-slate-900/90 border border-slate-700/60 flex items-center justify-center text-base sm:text-lg shadow-inner shrink-0">
            {ad.iconEmoji}
          </div>

          <div className="flex flex-col min-w-0 justify-center">
            <div className="flex items-center gap-1.5 leading-tight">
              <span className="text-xs sm:text-[13px] font-bold text-white truncate max-w-[170px] sm:max-w-[210px]">
                {ad.appTitle}
              </span>
            </div>
            <span className="text-[10px] text-slate-300/80 truncate max-w-[170px] sm:max-w-[210px] leading-tight">
              {ad.tagline}
            </span>
          </div>
        </div>

        {/* Right: Install / Reward Button */}
        <div className="flex items-center gap-1.5 shrink-0 pl-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleAdClick();
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] sm:text-xs font-black shadow-md transition-transform active:scale-95 cursor-pointer flex items-center gap-1 ${ad.btnColor}`}
          >
            <span>INSTALL</span>
            <ExternalLink className="w-2.5 h-2.5" />
          </button>
        </div>

        {/* Pop-up claim feedback if triggered */}
        {claimedNotice && (
          <div className="absolute inset-0 bg-emerald-600/95 flex items-center justify-center text-xs font-bold text-white animate-fade-in z-20">
            <Sparkles className="w-4 h-4 mr-1 text-yellow-300 animate-spin" />
            {claimedNotice}
          </div>
        )}
      </div>
    </div>
  );
};
