import React, { useState, useEffect, useRef } from 'react';
import { ActiveBooster, BlockPiece, GridCell } from '../types/game';
import { BlockBlastCell } from './BlockBlastCell';
import { ParticleCanvas } from './ParticleCanvas';
import { canPlacePiece, hasValidMoveForPiece } from '../utils/shapes';
import { sound } from '../utils/audio';
import { particleEngine } from '../utils/particleEngine';

interface BlockBlastBoardProps {
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  combo: number;
  setCombo: React.Dispatch<React.SetStateAction<number>>;
  activeBooster: ActiveBooster;
  setActiveBooster: (b: ActiveBooster) => void;
  selectedPiece: BlockPiece | null;
  onPiecePlaced: () => void;
  onGameOver: () => void;
  pieces: (BlockPiece | null)[];
  holdPiece: BlockPiece | null;
  grid: (GridCell | null)[][];
  setGrid: React.Dispatch<React.SetStateAction<(GridCell | null)[][]>>;
  onSaveUndoState: () => void;
  onProgressChallenge?: (type: 'lines' | 'score' | 'combo' | 'booster', amount: number) => void;
  onBoosterUsed: (type: 'hammer' | 'lineBlast' | 'colorSweep') => void;
  // External drag preview coordinate from mouse / touch drag
  dragPreviewCoord?: { r: number; c: number } | null;
  boardRefOut?: React.RefObject<HTMLDivElement | null>;
  clearingCells?: Set<string>;
  isBoardShaking?: boolean;
}

export const BlockBlastBoard: React.FC<BlockBlastBoardProps> = ({
  score,
  setScore,
  combo,
  setCombo,
  activeBooster,
  setActiveBooster,
  selectedPiece,
  onPiecePlaced,
  onGameOver,
  pieces,
  holdPiece,
  grid,
  setGrid,
  onSaveUndoState,
  onProgressChallenge,
  onBoosterUsed,
  dragPreviewCoord,
  boardRefOut,
  clearingCells,
  isBoardShaking = false,
}) => {
  const [hoverPos, setHoverPos] = useState<{ r: number; c: number } | null>(null);
  const [floatingTexts, setFloatingTexts] = useState<{ id: string; text: string; x: number; y: number }[]>([]);
  const [localClearingCells, setLocalClearingCells] = useState<Set<string>>(new Set());
  const [localShaking, setLocalShaking] = useState<boolean>(false);
  const internalBoardRef = useRef<HTMLDivElement>(null);
  const activeBoardRef = boardRefOut || internalBoardRef;

  const getCellPixelCenter = (r: number, c: number) => {
    const gridEl = document.getElementById('block-blast-grid-inner');
    const boardEl = activeBoardRef.current;
    if (gridEl && boardEl) {
      const gRect = gridEl.getBoundingClientRect();
      const bRect = boardEl.getBoundingClientRect();
      const cellW = gRect.width / 8;
      const cellH = gRect.height / 8;
      return {
        x: gRect.left - bRect.left + c * cellW + cellW / 2,
        y: gRect.top - bRect.top + r * cellH + cellH / 2,
      };
    }
    const rect = activeBoardRef.current?.getBoundingClientRect();
    const cellSize = (rect?.width || 320) / 8;
    return {
      x: c * cellSize + cellSize / 2,
      y: r * cellSize + cellSize / 2,
    };
  };

  const addFloatingText = (text: string, x: number, y: number) => {
    const id = Math.random().toString();
    setFloatingTexts((prev) => [...prev, { id, text, x, y }]);
    setTimeout(() => {
      setFloatingTexts((prev) => prev.filter((t) => t.id !== id));
    }, 1200);
  };

  // Determine active preview coordinate (drag preview takes precedence over mouse hover)
  const effectivePreviewPos = dragPreviewCoord || hoverPos;

  // Calculate preview coordinates for selected piece
  const getPreviewCells = (): Set<string> => {
    const previewSet = new Set<string>();
    if (!selectedPiece || !effectivePreviewPos) return previewSet;

    if (!canPlacePiece(grid, selectedPiece, effectivePreviewPos.r, effectivePreviewPos.c)) {
      return previewSet;
    }

    const rows = selectedPiece.matrix.length;
    const cols = selectedPiece.matrix[0].length;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (selectedPiece.matrix[r][c]) {
          previewSet.add(`${effectivePreviewPos.r + r},${effectivePreviewPos.c + c}`);
        }
      }
    }
    return previewSet;
  };

  const previewCells = getPreviewCells();

  // Check lines (rows and columns) regardless of color, and blast them!
  const checkAndClearLines = (newGrid: (GridCell | null)[][], latestScore: number) => {
    const fullRows: number[] = [];
    const fullCols: number[] = [];

    // Check all 8 rows
    for (let r = 0; r < 8; r++) {
      if (newGrid[r].every((cell) => cell !== null)) {
        fullRows.push(r);
      }
    }

    // Check all 8 columns
    for (let c = 0; c < 8; c++) {
      let isColFull = true;
      for (let r = 0; r < 8; r++) {
        if (newGrid[r][c] === null) {
          isColFull = false;
          break;
        }
      }
      if (isColFull) {
        fullCols.push(c);
      }
    }

    const totalLines = fullRows.length + fullCols.length;

    if (totalLines > 0) {
      sound.playRocket();
      const newCombo = combo + 1;
      setCombo(newCombo);

      // Collect all cells in the completed lines for sprinkle animation
      const sprinkleCells: { x: number; y: number; color?: string }[] = [];

      fullRows.forEach((r) => {
        for (let c = 0; c < 8; c++) {
          const pt = getCellPixelCenter(r, c);
          sprinkleCells.push({ x: pt.x, y: pt.y, color: newGrid[r][c]?.color });
        }
      });

      fullCols.forEach((c) => {
        for (let r = 0; r < 8; r++) {
          const pt = getCellPixelCenter(r, c);
          sprinkleCells.push({ x: pt.x, y: pt.y, color: newGrid[r][c]?.color });
        }
      });

      // Emit festive tumbling sprinkles, stars, and sparklers across the entire blasted lines!
      particleEngine.emitSprinkleLineBlast(sprinkleCells);

      // Bonus points
      const linePoints = totalLines * 100;
      const comboBonus = (newCombo - 1) * 80;
      const pointsEarned = linePoints + comboBonus;
      setScore(latestScore + pointsEarned);

      // Floating celebration banner
      const banner =
        totalLines >= 3
          ? `🔥 TRIPLE BLAST! +${pointsEarned}`
          : totalLines === 2
          ? `⚡ DOUBLE BLAST! +${pointsEarned}`
          : `✨ LINE BLAST! +${pointsEarned}`;

      if (activeBoardRef.current) {
        const rect = activeBoardRef.current.getBoundingClientRect();
        addFloatingText(banner, rect.width / 2 - 60, rect.height / 2 - 20);
      }

      if (onProgressChallenge) {
        onProgressChallenge('lines', totalLines);
        if (newCombo >= 2) onProgressChallenge('combo', 1);
        onProgressChallenge('score', pointsEarned);
      }

      // Animate line blast on board cells first!
      const toClear = new Set<string>();
      fullRows.forEach((r) => {
        for (let c = 0; c < 8; c++) toClear.add(`${r},${c}`);
      });
      fullCols.forEach((c) => {
        for (let r = 0; r < 8; r++) toClear.add(`${r},${c}`);
      });
      setLocalClearingCells(toClear);
      setLocalShaking(true);
      setTimeout(() => setLocalShaking(false), 280);

      // Clear the blasted cells from the board after animation finishes
      const clearedGrid = newGrid.map((row) => [...row]);
      fullRows.forEach((r) => {
        for (let c = 0; c < 8; c++) {
          clearedGrid[r][c] = null;
        }
      });
      fullCols.forEach((c) => {
        for (let r = 0; r < 8; r++) {
          clearedGrid[r][c] = null;
        }
      });

      setTimeout(() => {
        setLocalClearingCells(new Set());
        setGrid(clearedGrid);
        checkValidMovesRemaining(clearedGrid);
      }, 300);
    } else {
      setCombo(0);
      checkValidMovesRemaining(newGrid);
    }
  };

  // Check if any piece can be placed
  const checkValidMovesRemaining = (currentGrid: (GridCell | null)[][]) => {
    setTimeout(() => {
      let canPlaceAny = false;
      for (const p of pieces) {
        if (p && hasValidMoveForPiece(currentGrid, p)) {
          canPlaceAny = true;
          break;
        }
      }
      if (!canPlaceAny && holdPiece && hasValidMoveForPiece(currentGrid, holdPiece)) {
        canPlaceAny = true;
      }

      const activePiecesCount = pieces.filter(Boolean).length;
      if (activePiecesCount > 0 && !canPlaceAny) {
        onGameOver();
      }
    }, 280);
  };

  // Handle cell click (for Tap-to-Place or Boosters)
  const handleCellClick = (r: number, c: number) => {
    // 1. Boosters
    if (activeBooster === 'hammer') {
      const targetCell = grid[r][c];
      if (!targetCell) return;
      onSaveUndoState();
      sound.playHammer();
      const pt = getCellPixelCenter(r, c);
      particleEngine.emitBurst(pt.x, pt.y, targetCell.color, 25, 1.2);

      const nextGrid = grid.map((row) => [...row]);
      nextGrid[r][c] = null;
      setGrid(nextGrid);
      setActiveBooster('none');
      onBoosterUsed('hammer');
      return;
    }

    if (activeBooster === 'line_blast') {
      onSaveUndoState();
      sound.playRocket();
      const nextGrid = grid.map((row) => [...row]);
      for (let i = 0; i < 8; i++) {
        if (nextGrid[r][i]) {
          const pt = getCellPixelCenter(r, i);
          particleEngine.emitBurst(pt.x, pt.y, 'rocket', 14, 1);
          nextGrid[r][i] = null;
        }
        if (nextGrid[i][c]) {
          const pt = getCellPixelCenter(i, c);
          particleEngine.emitBurst(pt.x, pt.y, 'rocket', 14, 1);
          nextGrid[i][c] = null;
        }
      }
      setGrid(nextGrid);
      setActiveBooster('none');
      onBoosterUsed('lineBlast');
      return;
    }

    if (activeBooster === 'color_sweep') {
      const targetCell = grid[r][c];
      if (!targetCell) return;
      onSaveUndoState();
      sound.playRainbow();
      const targetColor = targetCell.color;
      const nextGrid = grid.map((row) => [...row]);

      for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
          if (nextGrid[i][j]?.color === targetColor) {
            const pt = getCellPixelCenter(i, j);
            particleEngine.emitBurst(pt.x, pt.y, targetColor, 18, 1.2);
            nextGrid[i][j] = null;
          }
        }
      }
      setGrid(nextGrid);
      setActiveBooster('none');
      onBoosterUsed('colorSweep');
      return;
    }

    // 2. Normal Piece Placement via Tap
    if (!selectedPiece) return;

    let targetR = r;
    let targetC = c;

    if (!canPlacePiece(grid, selectedPiece, targetR, targetC)) {
      // Try centering the piece around the tapped cell
      const pRows = selectedPiece.matrix.length;
      const pCols = selectedPiece.matrix[0].length;
      const centeredR = Math.max(0, Math.min(8 - pRows, r - Math.floor(pRows / 2)));
      const centeredC = Math.max(0, Math.min(8 - pCols, c - Math.floor(pCols / 2)));
      if (canPlacePiece(grid, selectedPiece, centeredR, centeredC)) {
        targetR = centeredR;
        targetC = centeredC;
      } else {
        // Search immediate neighbors (distance 1)
        let found = false;
        for (let dr = -1; dr <= 1 && !found; dr++) {
          for (let dc = -1; dc <= 1 && !found; dc++) {
            const tr = r + dr;
            const tc = c + dc;
            if (tr >= 0 && tr + pRows <= 8 && tc >= 0 && tc + pCols <= 8) {
              if (canPlacePiece(grid, selectedPiece, tr, tc)) {
                targetR = tr;
                targetC = tc;
                found = true;
              }
            }
          }
        }
        if (!found) {
          sound.playClick();
          return;
        }
      }
    }

    onSaveUndoState();
    sound.playPop(1);

    // Lock piece into grid
    const nextGrid = grid.map((row) => [...row]);
    const pRows = selectedPiece.matrix.length;
    const pCols = selectedPiece.matrix[0].length;
    let placedBlocksCount = 0;

    for (let pr = 0; pr < pRows; pr++) {
      for (let pc = 0; pc < pCols; pc++) {
        if (selectedPiece.matrix[pr][pc]) {
          nextGrid[targetR + pr][targetC + pc] = {
            id: `block-${Date.now()}-${pr}-${pc}`,
            color: selectedPiece.color,
          };
          placedBlocksCount++;
          const pt = getCellPixelCenter(targetR + pr, targetC + pc);
          particleEngine.emitBurst(pt.x, pt.y, selectedPiece.color, 12, 0.8);
        }
      }
    }

    setGrid(nextGrid);
    const addedScore = score + placedBlocksCount * 10;
    setScore(addedScore);
    onPiecePlaced();
    setHoverPos(null);

    // Check lines
    checkAndClearLines(nextGrid, addedScore);
  };

  return (
    <div
      ref={activeBoardRef as React.RefObject<HTMLDivElement>}
      id="block-blast-8x8-board"
      onMouseLeave={() => setHoverPos(null)}
      className={`relative w-full max-w-[min(96vw,54vh,440px)] aspect-square p-2 sm:p-2.5 rounded-2xl sm:rounded-3xl bg-[#0b1220]/95 border-2 border-blue-900/40 shadow-2xl backdrop-blur-md select-none touch-none overflow-hidden transition-transform ${
        (isBoardShaking || localShaking) ? 'animate-board-shake' : ''
      }`}
    >
      {/* High performance Canvas particle layer */}
      <ParticleCanvas />

      {/* 8x8 Grid matching the user's uploaded screenshot */}
      <div id="block-blast-grid-inner" className="grid grid-cols-8 gap-1.5 w-full h-full relative z-10">
        {grid.map((row, r) =>
          row.map((cell, c) => {
            const isPreview = previewCells.has(`${r},${c}`);
            const isClearing = (clearingCells && clearingCells.has(`${r},${c}`)) || localClearingCells.has(`${r},${c}`);
            return (
              <BlockBlastCell
                key={`cell-${r}-${c}`}
                cell={cell}
                isPreview={isPreview}
                isClearing={isClearing}
                previewColor={selectedPiece?.color || 'blue'}
                onClick={() => handleCellClick(r, c)}
                onMouseEnter={() => setHoverPos({ r, c })}
                dataCoord={`${r},${c}`}
              />
            );
          })
        )}
      </div>

      {/* Floating combo / lines text banner */}
      {floatingTexts.map((item) => (
        <div
          key={item.id}
          className="absolute z-40 pointer-events-none font-game font-black text-sm sm:text-base text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] animate-pop-in whitespace-nowrap"
          style={{ left: `${item.x}px`, top: `${item.y}px` }}
        >
          {item.text}
        </div>
      ))}
    </div>
  );
};
