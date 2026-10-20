import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { X, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface RewardChestModalProps {
  chestImg: string;
  onClose: () => void;
  onClaimRewards: (rewards: { coins: number; hammer: number; rocket: number; rainbow: number }) => void;
}

export const RewardChestModal: React.FC<RewardChestModalProps> = ({
  chestImg,
  onClose,
  onClaimRewards,
}) => {
  const [opened, setOpened] = useState(false);
  const [rewards, setRewards] = useState<{ coins: number; hammer: number; rocket: number; rainbow: number } | null>(null);

  const handleOpenChest = () => {
    if (opened) return;
    sound.playWin();

    // Trigger colorful confetti shower
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#facc15', '#ef4444', '#38bdf8', '#a855f7', '#22c55e'],
    });

    const newRewards = {
      coins: 250,
      hammer: 1,
      rocket: 1,
      rainbow: 1,
    };
    setRewards(newRewards);
    setOpened(true);
  };

  const handleClaim = () => {
    if (rewards) {
      sound.playCoin();
      onClaimRewards(rewards);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-gradient-to-b from-amber-900 via-sky-950 to-indigo-950 border-4 border-amber-400 rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center">
        {/* Close Button */}
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center font-bold shadow cursor-pointer transition-transform active:scale-90"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <h2 className="text-2xl font-black font-game text-amber-300 drop-shadow">
          {opened ? 'Chest Unlocked!' : 'Star Reward Chest'}
        </h2>
        <p className="text-xs text-sky-200 mt-1 font-game">
          {opened ? 'Your rewards have arrived!' : 'Tap the magical chest to reveal your treasures!'}
        </p>

        {/* Chest Visual */}
        <div className="my-5 relative flex items-center justify-center">
          <div className={`relative w-48 h-48 rounded-2xl overflow-hidden border-2 border-amber-400/60 shadow-2xl ${opened ? 'scale-105' : 'animate-bounce cursor-pointer'}`}
               onClick={handleOpenChest}
          >
            <img
              src={chestImg}
              alt="Treasure Chest"
              className="w-full h-full object-cover"
            />
            {!opened && (
              <div className="absolute inset-0 bg-black/20 hover:bg-transparent flex items-center justify-center">
                <span className="bg-amber-400 text-stone-900 px-3 py-1 rounded-full text-xs font-black font-game shadow-lg animate-pulse">
                  Tap to Open!
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Rewards List */}
        {opened && rewards && (
          <div className="w-full bg-sky-950/80 border border-amber-400/40 rounded-2xl p-3 mb-4 animate-pop-in">
            <div className="grid grid-cols-4 gap-2">
              <div className="flex flex-col items-center bg-black/40 p-2 rounded-xl border border-sky-800">
                <span className="text-2xl">🪙</span>
                <span className="text-xs font-black font-game text-amber-300 mt-1">+{rewards.coins}</span>
                <span className="text-[10px] text-sky-300">Coins</span>
              </div>
              <div className="flex flex-col items-center bg-black/40 p-2 rounded-xl border border-sky-800">
                <span className="text-2xl">🔨</span>
                <span className="text-xs font-black font-game text-amber-300 mt-1">+{rewards.hammer}</span>
                <span className="text-[10px] text-sky-300">Hammer</span>
              </div>
              <div className="flex flex-col items-center bg-black/40 p-2 rounded-xl border border-sky-800">
                <span className="text-2xl">🚀</span>
                <span className="text-xs font-black font-game text-amber-300 mt-1">+{rewards.rocket}</span>
                <span className="text-[10px] text-sky-300">Rocket</span>
              </div>
              <div className="flex flex-col items-center bg-black/40 p-2 rounded-xl border border-sky-800">
                <span className="text-2xl">🌈</span>
                <span className="text-xs font-black font-game text-amber-300 mt-1">+{rewards.rainbow}</span>
                <span className="text-[10px] text-sky-300">Rainbow</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        {opened ? (
          <button
            onClick={handleClaim}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 text-stone-900 font-black font-game text-sm rounded-2xl shadow-lg btn-3d cursor-pointer"
          >
            Claim All Rewards!
          </button>
        ) : (
          <button
            onClick={handleOpenChest}
            className="w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-stone-900 font-black font-game text-sm rounded-2xl shadow-lg btn-3d cursor-pointer"
          >
            Unlock Now!
          </button>
        )}
      </div>
    </div>
  );
};
