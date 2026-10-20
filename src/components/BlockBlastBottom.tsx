import React, { useRef, useState } from 'react';
import { BlockPiece } from '../types/game';
import { PieceItem } from './PieceItem';
import { sound } from '../utils/audio';

interface BlockBlastBottomProps {
  pieces: (BlockPiece | null)[];
  selectedPieceIndex: number | null;
  onSelectPiece: (index: number) => void;
  validPiecesMap: boolean[];
  onStartDrag: (piece: BlockPiece, index: number, e: React.PointerEvent) => void;
  onRotatePiece: (index: number) => void;
}

export const BlockBlastBottom: React.FC<BlockBlastBottomProps> = ({
  pieces,
  selectedPieceIndex,
  validPiecesMap,
  onStartDrag,
  onRotatePiece,
}) => {
  const [rotatingIndex, setRotatingIndex] = useState<number | null>(null);

  const dragTrackingRef = useRef<{
    startX: number;
    startY: number;
    startTime: number;
    piece: BlockPiece;
    index: number;
    hasStartedDrag: boolean;
  } | null>(null);

  const handlePointerDown = (piece: BlockPiece, index: number, e: React.PointerEvent) => {
    if (e.button !== 0 && e.pointerType === 'mouse') return;

    dragTrackingRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startTime: Date.now(),
      piece,
      index,
      hasStartedDrag: false,
    };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const track = dragTrackingRef.current;
    if (!track) return;

    if (!track.hasStartedDrag) {
      const dx = e.clientX - track.startX;
      const dy = e.clientY - track.startY;
      const distance = Math.hypot(dx, dy);

      // If finger or mouse moved beyond 5px, transition into active drag
      if (distance > 5) {
        track.hasStartedDrag = true;
        onStartDrag(track.piece, track.index, e);
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    const track = dragTrackingRef.current;
    if (!track) return;

    // If the pointer did NOT drag, it is a clean TAP!
    if (!track.hasStartedDrag) {
      sound.playPop(1);
      setRotatingIndex(track.index);
      setTimeout(() => setRotatingIndex(null), 180);
      onRotatePiece(track.index);
    }

    dragTrackingRef.current = null;
  };

  const handlePointerCancel = () => {
    dragTrackingRef.current = null;
  };

  return (
    <footer className="w-full max-w-[440px] flex items-center justify-around gap-2 select-none touch-none shrink-0 min-h-[92px] sm:min-h-[105px] px-1 py-1">
      {/* Three Pieces Dock */}
      <div className="w-full flex items-center justify-around gap-2 bg-[#0d1424]/90 rounded-2xl p-1.5 border border-slate-800/80 shadow-lg">
        {pieces.map((piece, idx) => (
          <div
            key={piece ? piece.id : `empty-slot-${idx}`}
            onPointerDown={(e) => {
              if (piece) handlePointerDown(piece, idx, e);
            }}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
            className={`flex-1 flex items-center justify-center min-h-[76px] sm:min-h-[86px] rounded-xl transition-transform duration-150 cursor-grab active:cursor-grabbing touch-none select-none ${
              rotatingIndex === idx ? 'scale-110 rotate-12 transition-all duration-150' : ''
            }`}
          >
            {piece ? (
              <PieceItem
                piece={piece}
                isSelected={selectedPieceIndex === idx}
                canPlaceAnywhere={validPiecesMap[idx] ?? true}
                onClick={() => {}}
                animationDelay={`${idx * 0.45}s`}
              />
            ) : (
              <div className="w-12 h-12 rounded-xl border border-dashed border-slate-800/60 flex items-center justify-center opacity-20 pointer-events-none">
                <span className="text-[10px] text-slate-600 font-game">CLEAR</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </footer>
  );
};
