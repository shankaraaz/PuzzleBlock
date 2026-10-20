import React from 'react';
import { BlockColor, GridCell } from '../types/game';

// 9 distinct iconic designs for the 9 colors!
export const renderBlockIcon = (color: BlockColor) => {
  switch (color) {
    case 'red': // 1. Ruby Heart
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-rose-100/90 drop-shadow-[0_1px_2px_rgba(159,18,57,0.9)] pointer-events-none" fill="currentColor">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      );

    case 'blue': // 2. Sapphire Diamond
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-sky-100/90 drop-shadow-[0_1px_2px_rgba(3,105,161,0.9)] pointer-events-none" fill="currentColor">
          <path d="M12 2L2 12l10 10 10-10L12 2z" />
        </svg>
      );

    case 'yellow': // 3. Golden Star
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-amber-100/95 drop-shadow-[0_1px_2px_rgba(161,98,7,0.9)] pointer-events-none" fill="currentColor">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      );

    case 'green': // 4. Emerald 4-leaf Clover
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-emerald-100/90 drop-shadow-[0_1px_2px_rgba(21,128,61,0.9)] pointer-events-none" fill="currentColor">
          <path d="M12 2a3.5 3.5 0 0 0-3.5 3.5c0 .65.18 1.26.5 1.78A3.5 3.5 0 0 0 5.5 10a3.5 3.5 0 0 0 3.5 3.5c.34 0 .66-.05.97-.14l-.97 5.64h6l-.97-5.64c.31.09.63.14.97.14a3.5 3.5 0 0 0 3.5-3.5 3.5 3.5 0 0 0-3.5-3.5c.32-.52.5-1.13.5-1.78A3.5 3.5 0 0 0 12 2z" />
        </svg>
      );

    case 'purple': // 5. Amethyst Blossom / 4-petal flower
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-purple-100/90 drop-shadow-[0_1px_2px_rgba(107,33,168,0.9)] pointer-events-none" fill="currentColor">
          <path d="M12 2a4 4 0 0 0-4 4c0 1.25.57 2.37 1.46 3.1A4 4 0 0 0 6 12a4 4 0 0 0 3.46 2.9A4 4 0 0 0 8 18a4 4 0 0 0 8 0 4 4 0 0 0-1.46-3.1A4 4 0 0 0 18 12a4 4 0 0 0-3.46-2.9A4 4 0 0 0 16 6a4 4 0 0 0-4-4z" />
        </svg>
      );

    case 'orange': // 6. Amber Crown
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-orange-100/95 drop-shadow-[0_1px_2px_rgba(154,52,18,0.9)] pointer-events-none" fill="currentColor">
          <path d="M5 16L3 5l5.5 5L12 4l3.5 6L21 5l-2 11H5zm14 3c0 .6-.4 1-1 1H6c-.6 0-1-.4-1-1v-1h14v1z" />
        </svg>
      );

    case 'cyan': // 7. Ice Snowflake
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-cyan-100/95 drop-shadow-[0_1px_2px_rgba(8,145,178,0.9)] pointer-events-none" fill="currentColor">
          <path d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
          <circle cx="12" cy="12" r="2.5" fill="currentColor" />
        </svg>
      );

    case 'pink': // 8. Rose Ribbon / Butterfly
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-pink-100/95 drop-shadow-[0_1px_2px_rgba(131,24,67,0.9)] pointer-events-none" fill="currentColor">
          <path d="M12 11c-1.5-3-5-4-7-2-2.5 2.5-1 7 2 7 2.5 0 4.5-2.5 5-4.5.5 2 2.5 4.5 5 4.5 3 0 4.5-4.5 2-7-2-2-5.5-1-7 2z" />
          <circle cx="12" cy="11" r="1.5" fill="#fff" />
        </svg>
      );

    case 'lime': // 9. Energy Bolt
      return (
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-lime-100/95 drop-shadow-[0_1px_2px_rgba(54,83,20,0.9)] pointer-events-none" fill="currentColor">
          <path d="M13 2L3 14h7v8l11-13h-8l3-7z" />
        </svg>
      );
  }
};

interface BlockBlastCellProps {
  cell: GridCell | null;
  isPreview?: boolean;
  previewColor?: BlockColor;
  isClearing?: boolean;
  onClick?: () => void;
  onMouseEnter?: () => void;
  sizeClass?: string;
  dataCoord?: string;
}

export const BlockBlastCell: React.FC<BlockBlastCellProps> = ({
  cell,
  isPreview = false,
  previewColor = 'blue',
  isClearing = false,
  onClick,
  onMouseEnter,
  sizeClass = 'w-full aspect-square',
  dataCoord,
}) => {
  // Empty socket
  if (!cell && !isPreview) {
    return (
      <div
        data-cell-coord={dataCoord}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        className={`${sizeClass} rounded-xl md:rounded-2xl bg-[#11192b]/95 border border-slate-800/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.65)] transition-all cursor-pointer hover:border-slate-700/60`}
      />
    );
  }

  const color: BlockColor = cell ? cell.color : previewColor;

  const getColorClasses = () => {
    switch (color) {
      case 'red':
        return isPreview
          ? 'bg-rose-500/80 border-2 border-white ring-2 ring-rose-400/80 shadow-[0_0_12px_rgba(244,63,94,0.6)]'
          : 'bg-gradient-to-b from-[#ff6b8b] via-[#f43f5e] to-[#be123c] border-t-2 border-t-rose-300 border-b-2 border-b-rose-900 shadow-[0_4px_12px_rgba(244,63,94,0.5)]';

      case 'blue':
        return isPreview
          ? 'bg-sky-500/80 border-2 border-white ring-2 ring-sky-400/80 shadow-[0_0_12px_rgba(2,132,199,0.6)]'
          : 'bg-gradient-to-b from-[#38bdf8] via-[#0284c7] to-[#0369a1] border-t-2 border-t-sky-200 border-b-2 border-b-sky-950 shadow-[0_4px_12px_rgba(2,132,199,0.5)]';

      case 'yellow':
        return isPreview
          ? 'bg-amber-400/80 border-2 border-white ring-2 ring-amber-300/80 shadow-[0_0_12px_rgba(234,179,8,0.6)]'
          : 'bg-gradient-to-b from-[#fde047] via-[#eab308] to-[#a16207] border-t-2 border-t-amber-100 border-b-2 border-b-amber-950 shadow-[0_4px_12px_rgba(234,179,8,0.5)]';

      case 'green':
        return isPreview
          ? 'bg-emerald-500/80 border-2 border-white ring-2 ring-emerald-400/80 shadow-[0_0_12px_rgba(22,163,74,0.6)]'
          : 'bg-gradient-to-b from-[#4ade80] via-[#16a34a] to-[#14532d] border-t-2 border-t-emerald-200 border-b-2 border-b-emerald-950 shadow-[0_4px_12px_rgba(22,163,74,0.5)]';

      case 'purple':
        return isPreview
          ? 'bg-purple-500/80 border-2 border-white ring-2 ring-purple-400/80 shadow-[0_0_12px_rgba(147,51,234,0.6)]'
          : 'bg-gradient-to-b from-[#c084fc] via-[#9333ea] to-[#581c87] border-t-2 border-t-purple-200 border-b-2 border-b-purple-950 shadow-[0_4px_12px_rgba(147,51,234,0.5)]';

      case 'orange':
        return isPreview
          ? 'bg-orange-500/80 border-2 border-white ring-2 ring-orange-400/80 shadow-[0_0_12px_rgba(234,88,12,0.6)]'
          : 'bg-gradient-to-b from-[#fb923c] via-[#ea580c] to-[#9a3412] border-t-2 border-t-orange-200 border-b-2 border-b-orange-950 shadow-[0_4px_12px_rgba(234,88,12,0.5)]';

      case 'cyan':
        return isPreview
          ? 'bg-cyan-500/80 border-2 border-white ring-2 ring-cyan-400/80 shadow-[0_0_12px_rgba(8,145,178,0.6)]'
          : 'bg-gradient-to-b from-[#22d3ee] via-[#0891b2] to-[#164e63] border-t-2 border-t-cyan-200 border-b-2 border-b-cyan-950 shadow-[0_4px_12px_rgba(8,145,178,0.5)]';

      case 'pink':
        return isPreview
          ? 'bg-pink-500/80 border-2 border-white ring-2 ring-pink-400/80 shadow-[0_0_12px_rgba(219,39,119,0.6)]'
          : 'bg-gradient-to-b from-[#f472b6] via-[#db2777] to-[#831843] border-t-2 border-t-pink-200 border-b-2 border-b-pink-950 shadow-[0_4px_12px_rgba(219,39,119,0.5)]';

      case 'lime':
        return isPreview
          ? 'bg-lime-500/80 border-2 border-white ring-2 ring-lime-400/80 shadow-[0_0_12px_rgba(101,163,13,0.6)]'
          : 'bg-gradient-to-b from-[#a3e635] via-[#65a30d] to-[#365314] border-t-2 border-t-lime-200 border-b-2 border-b-lime-950 shadow-[0_4px_12px_rgba(101,163,13,0.5)]';
    }
  };

  return (
    <div
      data-cell-coord={dataCoord}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={`
        ${sizeClass} rounded-xl md:rounded-2xl relative flex items-center justify-center
        transition-all duration-150 select-none cursor-pointer
        ${getColorClasses()}
        ${isClearing ? 'animate-block-clearing shadow-[0_0_30px_rgba(255,255,255,1)]' : ''}
      `}
    >
      {/* 3D Specular Highlight pill at top */}
      <div className={`absolute top-1 left-2 right-2 h-1 bg-white/50 rounded-full pointer-events-none ${isPreview ? 'opacity-80' : ''}`} />

      {/* Embossed icon */}
      <div className={`transition-transform duration-100 transform pointer-events-none ${isPreview ? 'opacity-90 scale-95' : 'active:scale-90'}`}>
        {renderBlockIcon(color)}
      </div>
    </div>
  );
};
