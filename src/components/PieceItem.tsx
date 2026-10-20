import React from 'react';
import { BlockColor, BlockPiece } from '../types/game';

interface PieceItemProps {
  piece: BlockPiece | null;
  isSelected: boolean;
  canPlaceAnywhere: boolean;
  onClick: () => void;
  onPointerDown?: (e: React.PointerEvent) => void;
  animationDelay?: string;
}

export const PieceItem: React.FC<PieceItemProps> = ({
  piece,
  isSelected,
  canPlaceAnywhere,
  onClick,
  onPointerDown,
  animationDelay = '0s',
}) => {
  if (!piece) {
    return <div className="w-16 h-16 opacity-0" />;
  }

  const { matrix, color } = piece;
  const rows = matrix.length;
  const cols = matrix[0].length;

  const getColorClass = (col: BlockColor) => {
    switch (col) {
      case 'red':
        return 'bg-gradient-to-b from-[#ff6b8b] via-[#f43f5e] to-[#be123c] border-t-2 border-t-rose-300 border-b-2 border-b-rose-900 shadow-[0_2px_8px_rgba(244,63,94,0.5)]';
      case 'blue':
        return 'bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#0369a1] border-t-2 border-t-sky-200 border-b-2 border-b-sky-950 shadow-[0_2px_8px_rgba(2,132,199,0.5)]';
      case 'yellow':
        return 'bg-gradient-to-b from-[#fde047] via-[#eab308] to-[#a16207] border-t-2 border-t-amber-100 border-b-2 border-b-amber-950 shadow-[0_2px_8px_rgba(234,179,8,0.5)]';
      case 'green':
        return 'bg-gradient-to-b from-[#4ade80] via-[#16a34a] to-[#14532d] border-t-2 border-t-emerald-200 border-b-2 border-b-emerald-950 shadow-[0_2px_8px_rgba(22,163,74,0.5)]';
      case 'purple':
        return 'bg-gradient-to-b from-[#c084fc] via-[#9333ea] to-[#581c87] border-t-2 border-t-purple-200 border-b-2 border-b-purple-950 shadow-[0_2px_8px_rgba(147,51,234,0.5)]';
      case 'orange':
        return 'bg-gradient-to-b from-[#fb923c] via-[#ea580c] to-[#9a3412] border-t-2 border-t-orange-200 border-b-2 border-b-orange-950 shadow-[0_2px_8px_rgba(234,88,12,0.5)]';
      case 'cyan':
        return 'bg-gradient-to-b from-[#22d3ee] via-[#0891b2] to-[#164e63] border-t-2 border-t-cyan-200 border-b-2 border-b-cyan-950 shadow-[0_2px_8px_rgba(8,145,178,0.5)]';
      case 'pink':
        return 'bg-gradient-to-b from-[#f472b6] via-[#db2777] to-[#831843] border-t-2 border-t-pink-200 border-b-2 border-b-pink-950 shadow-[0_2px_8px_rgba(219,39,119,0.5)]';
      case 'lime':
        return 'bg-gradient-to-b from-[#a3e635] via-[#65a30d] to-[#365314] border-t-2 border-t-lime-200 border-b-2 border-b-lime-950 shadow-[0_2px_8px_rgba(101,163,13,0.5)]';
    }
  };

  const isBreathing = canPlaceAnywhere && !isSelected;

  return (
    <div
      onPointerDown={onPointerDown}
      onClick={onClick}
      style={isBreathing ? { animationDelay } : undefined}
      className={`
        relative p-1.5 rounded-2xl flex items-center justify-center transition-all duration-150 select-none cursor-grab active:cursor-grabbing touch-none
        ${isBreathing ? 'animate-subtle-breathe' : ''}
        ${
          isSelected
            ? 'ring-2 ring-sky-400 bg-sky-950/60 scale-105 shadow-[0_0_15px_rgba(56,189,248,0.4)]'
            : 'hover:bg-slate-800/40 hover:scale-102'
        }
        ${!canPlaceAnywhere ? 'opacity-35 grayscale-[50%]' : 'opacity-100'}
      `}
    >
      <div
        className="grid gap-1 items-center justify-center pointer-events-none"
        style={{
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {matrix.map((row, r) =>
          row.map((active, c) => {
            if (!active) {
              return <div key={`${r}-${c}`} className="w-5 h-5 sm:w-6 sm:h-6" />;
            }
            return (
              <div
                key={`${r}-${c}`}
                className={`w-5 h-5 sm:w-6 sm:h-6 rounded-lg ${getColorClass(color)} relative flex items-center justify-center shadow-md`}
              >
                <div className="absolute top-0.5 left-1 right-1 h-0.5 bg-white/45 rounded-full" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
