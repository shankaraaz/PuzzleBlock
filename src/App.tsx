import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { LuckyWheelModal } from './components/LuckyWheelModal';
import { InstallAppModal } from './components/InstallAppModal';
import { TopAdBanner } from './components/TopAdBanner';
import { BlockBlastTop } from './components/BlockBlastHUD';
import { BlockBlastBoard } from './components/BlockBlastBoard';
import { BlockBlastBottom } from './components/BlockBlastBottom';
import { DailyChallengesModal } from './components/DailyChallengesModal';
import { LeaderboardModal } from './components/LeaderboardModal';
import { RewardedAdModal } from './components/RewardedAdModal';
import { PauseModal } from './components/PauseModal';
import { GameOverModal } from './components/GameOverModal';
import { renderBlockIcon } from './components/BlockBlastCell';
import { ActiveBooster, BlockColor, BlockPiece, DailyChallenge, GridCell, PlayerProfile } from './types/game';
import { canPlacePiece, generateInitialPieces, generateRandomPiece, hasValidMoveForPiece, rotatePieceClockwise } from './utils/shapes';
import { sound } from './utils/audio';
import { particleEngine } from './utils/particleEngine';
import confetti from 'canvas-confetti';

const INITIAL_PLAYER_PROFILE: PlayerProfile = {
  highScore: 161,
  currentScore: 0,
  coins: 450,
  boosters: {
    hammer: 3,
    lineBlast: 2,
    colorSweep: 1,
    shuffle: 2,
    undo: 3,
  },
  totalLinesCleared: 0,
  adsWatched: 2,
  adRevenueSimulated: 0.08,
};

const INITIAL_DAILY_CHALLENGES: DailyChallenge[] = [
  {
    id: 'c-1',
    title: 'Line Crusher',
    description: 'Clear 10 full lines on the 8x8 board',
    icon: 'lines',
    current: 0,
    target: 10,
    completed: false,
    rewardType: 'coins',
    rewardAmount: 200,
    claimed: false,
  },
  {
    id: 'c-2',
    title: 'Combo Prodigy',
    description: 'Trigger a Combo x2 or higher',
    icon: 'combo',
    current: 0,
    target: 1,
    completed: false,
    rewardType: 'hammer',
    rewardAmount: 2,
    claimed: false,
  },
  {
    id: 'c-3',
    title: 'High Scorer',
    description: 'Reach a score of 300 in one game',
    icon: 'score',
    current: 0,
    target: 300,
    completed: false,
    rewardType: 'shuffle',
    rewardAmount: 2,
    claimed: false,
  },
];

// Start game with a 100% EMPTY 8x8 grid as requested!
function createEmptyGrid(): (GridCell | null)[][] {
  return Array.from({ length: 8 }, () => Array(8).fill(null));
}

export default function App() {
  const [player, setPlayer] = useState<PlayerProfile>(() => {
    try {
      const saved = localStorage.getItem('super_blast_block_profile_v4');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_PLAYER_PROFILE;
  });

  const [challenges, setChallenges] = useState<DailyChallenge[]>(() => {
    try {
      const saved = localStorage.getItem('super_blast_block_challenges_v4');
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_DAILY_CHALLENGES;
  });

  // 8x8 Grid starts 100% EMPTY!
  const [grid, setGrid] = useState<(GridCell | null)[][]>(createEmptyGrid);
  const [pieces, setPieces] = useState<(BlockPiece | null)[]>(generateInitialPieces);
  const [selectedPieceIndex, setSelectedPieceIndex] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [activeBooster, setActiveBooster] = useState<ActiveBooster>('none');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Floating celebration banner (e.g. LINE BLAST!, DOUBLE BLAST!)
  const [floatingBanner, setFloatingBanner] = useState<{ text: string; id: number } | null>(null);

  // Drag & Drop State
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [draggedPiece, setDraggedPiece] = useState<BlockPiece | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [pointerPos, setPointerPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [dragPreviewCoord, setDragPreviewCoord] = useState<{ r: number; c: number } | null>(null);
  const lastValidCoordRef = useRef<{ r: number; c: number; time: number } | null>(null);
  const isTouchDrag = useRef<boolean>(false);

  // Board metrics
  const [boardCellSize, setBoardCellSize] = useState<number>(44);
  const boardRef = useRef<HTMLDivElement | null>(null);

  // Game screen state: 'splash' or 'playing'
  const [gameState, setGameState] = useState<'splash' | 'playing'>('splash');

  // Modals
  const [showGameOver, setShowGameOver] = useState<boolean>(false);
  const [showPause, setShowPause] = useState<boolean>(false);
  const [showLeaderboard, setShowLeaderboard] = useState<boolean>(false);
  const [showChallenges, setShowChallenges] = useState<boolean>(false);
  const [showLuckyWheel, setShowLuckyWheel] = useState<boolean>(false);
  const [showAdModal, setShowAdModal] = useState<boolean>(false);
  const [showInstallModal, setShowInstallModal] = useState<boolean>(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  // Line clear animation & board shake states
  const [clearingCells, setClearingCells] = useState<Set<string>>(new Set());
  const [isBoardShaking, setIsBoardShaking] = useState<boolean>(false);

  // Catch PWA install prompt for Android/Chrome
  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
  }, []);

  // Undo history
  const [undoHistory, setUndoHistory] = useState<
    { grid: (GridCell | null)[][]; score: number; pieces: (BlockPiece | null)[] }[]
  >([]);

  // Sync profile & high score
  useEffect(() => {
    try {
      localStorage.setItem('super_blast_block_profile_v4', JSON.stringify(player));
    } catch {}
  }, [player]);

  useEffect(() => {
    if (score > player.highScore) {
      setPlayer((p) => ({ ...p, highScore: score }));
    }
  }, [score, player.highScore]);

  // Keep cell size measured accurately for responsive scaling
  const updateBoardMetrics = useCallback(() => {
    const gridEl = document.getElementById('block-blast-grid-inner');
    if (gridEl) {
      const rect = gridEl.getBoundingClientRect();
      const size = rect.width / 8;
      if (size > 0) setBoardCellSize(size);
    }
  }, []);

  useEffect(() => {
    updateBoardMetrics();
    window.addEventListener('resize', updateBoardMetrics);
    return () => window.removeEventListener('resize', updateBoardMetrics);
  }, [updateBoardMetrics]);

  // Save Undo State
  const saveUndoState = useCallback(() => {
    setUndoHistory((prev) => [
      ...prev.slice(-3),
      {
        grid: grid.map((r) => [...r]),
        score,
        pieces: [...pieces],
      },
    ]);
  }, [grid, score, pieces]);

  // Undo move
  const handleUndo = () => {
    if (undoHistory.length === 0 || player.boosters.undo <= 0) return;
    const previous = undoHistory[undoHistory.length - 1];
    setUndoHistory((prev) => prev.slice(0, -1));
    setGrid(previous.grid);
    setScore(previous.score);
    setPieces(previous.pieces);
    setPlayer((p) => ({
      ...p,
      boosters: { ...p.boosters, undo: Math.max(0, p.boosters.undo - 1) },
    }));
    sound.playPop(1);
  };

  // Shuffle pieces
  const handleShuffle = () => {
    if (player.boosters.shuffle <= 0) return;
    sound.playRocket();
    setPieces([generateRandomPiece(), generateRandomPiece(), generateRandomPiece()]);
    setSelectedPieceIndex(null);
    setPlayer((p) => ({
      ...p,
      boosters: { ...p.boosters, shuffle: Math.max(0, p.boosters.shuffle - 1) },
    }));
  };

  // Booster consumption
  const handleBoosterUsed = (type: 'hammer' | 'lineBlast' | 'colorSweep') => {
    setPlayer((p) => ({
      ...p,
      boosters: {
        ...p.boosters,
        [type]: Math.max(0, p.boosters[type] - 1),
      },
    }));
  };

  // Currently selected piece (for Tap-to-Place or Drag)
  const selectedPiece = useMemo(() => {
    if (draggedPiece) return draggedPiece;
    if (selectedPieceIndex !== null && pieces[selectedPieceIndex]) {
      return pieces[selectedPieceIndex];
    }
    return null;
  }, [draggedPiece, selectedPieceIndex, pieces]);

  // Validity map for pieces
  const validPiecesMap = useMemo(() => {
    return pieces.map((p) => hasValidMoveForPiece(grid, p));
  }, [pieces, grid]);

  // Rotate piece in bottom dock on tap
  const handleRotatePiece = (index: number) => {
    const target = pieces[index];
    if (!target) return;
    const rotated = rotatePieceClockwise(target);
    const nextPieces = [...pieces];
    nextPieces[index] = rotated;
    setPieces(nextPieces);
  };

  // Handle piece placed onto board
  const handlePiecePlaced = () => {
    const targetIdx = draggedIndex !== null ? draggedIndex : selectedPieceIndex;

    if (targetIdx !== null) {
      const nextPieces = [...pieces];
      nextPieces[targetIdx] = null;
      setPieces(nextPieces);

      const remainingCount = nextPieces.filter(Boolean).length;
      if (remainingCount === 0) {
        sound.playWin();
        const fresh = [generateRandomPiece(), generateRandomPiece(), generateRandomPiece()];
        setPieces(fresh);
        setSelectedPieceIndex(null);
      } else {
        setSelectedPieceIndex(null);
      }
    }
  };

  // Check Game Over
  const checkGameOver = useCallback(
    (currentGrid: (GridCell | null)[][]) => {
      setTimeout(() => {
        const remainingPieces = pieces.filter(Boolean);
        if (remainingPieces.length > 0) {
          const canFitAny = remainingPieces.some((p) => p && hasValidMoveForPiece(currentGrid, p));
          if (!canFitAny) {
            setShowGameOver(true);
          }
        }
      }, 280);
    },
    [pieces]
  );

  // CHALLENGE PROGRESS
  const handleProgressChallenge = useCallback(
    (type: 'lines' | 'score' | 'combo' | 'booster', amount: number) => {
      setChallenges((prev) =>
        prev.map((c) => {
          if (c.icon === type && !c.completed) {
            const nextVal = c.current + amount;
            return {
              ...c,
              current: nextVal,
              completed: nextVal >= c.target,
            };
          }
          return c;
        })
      );
    },
    []
  );

  // RESTART
  const handleRestart = () => {
    setGrid(createEmptyGrid());
    setPieces(generateInitialPieces());
    setSelectedPieceIndex(null);
    setScore(0);
    setCombo(0);
    setActiveBooster('none');
    setUndoHistory([]);
    setShowGameOver(false);
    setShowPause(false);
  };

  // DRAG & DROP: Start dragging piece
  const handleStartDrag = (piece: BlockPiece, index: number, e: React.PointerEvent) => {
    updateBoardMetrics();
    isTouchDrag.current = e.pointerType === 'touch';
    setIsDragging(true);
    setDraggedPiece(piece);
    setDraggedIndex(index);
    setSelectedPieceIndex(index);

    // On touch, offset 70px above thumb so finger never covers the piece
    const offsetY = e.pointerType === 'touch' ? 70 : 0;
    setPointerPos({ x: e.clientX, y: e.clientY - offsetY });
    setDragPreviewCoord(null);
    lastValidCoordRef.current = null;
  };

  // DRAG MOVEMENT & SNAPPING
  useEffect(() => {
    if (!isDragging || !draggedPiece) return;

    const handlePointerMove = (e: PointerEvent) => {
      const offsetY = isTouchDrag.current ? 70 : 0;
      const targetX = e.clientX;
      const targetY = e.clientY - offsetY;
      setPointerPos({ x: targetX, y: targetY });

      const gridEl = document.getElementById('block-blast-grid-inner');
      if (gridEl && draggedPiece) {
        const rect = gridEl.getBoundingClientRect();
        const cellW = rect.width / 8;
        const cellH = rect.height / 8;
        const pRows = draggedPiece.matrix.length;
        const pCols = draggedPiece.matrix[0].length;

        // If pointer is far away outside the board, clear preview
        const margin = cellW * 2.0;
        if (
          targetX < rect.left - margin ||
          targetX > rect.right + margin ||
          targetY < rect.top - margin ||
          targetY > rect.bottom + margin
        ) {
          setDragPreviewCoord(null);
          return;
        }

        // Exact position of the piece's top-left in grid coordinates
        const pieceTopLeftX = targetX - (pCols * cellW) / 2;
        const pieceTopLeftY = targetY - (pRows * cellH) / 2;
        const exactCol = (pieceTopLeftX - rect.left) / cellW;
        const exactRow = (pieceTopLeftY - rect.top) / cellH;

        const directCol = Math.round(exactCol);
        const directRow = Math.round(exactRow);
        const clampedCol = Math.max(0, Math.min(8 - pCols, directCol));
        const clampedRow = Math.max(0, Math.min(8 - pRows, directRow));

        // 1. Direct match check
        if (
          clampedRow >= 0 &&
          clampedRow + pRows <= 8 &&
          clampedCol >= 0 &&
          clampedCol + pCols <= 8 &&
          canPlacePiece(grid, draggedPiece, clampedRow, clampedCol) &&
          Math.abs(exactCol - clampedCol) <= 1.5 &&
          Math.abs(exactRow - clampedRow) <= 1.5
        ) {
          setDragPreviewCoord({ r: clampedRow, c: clampedCol });
          lastValidCoordRef.current = { r: clampedRow, c: clampedCol, time: Date.now() };
          return;
        }

        // 2. Proximity search: find closest valid spot on the entire board
        let bestSpot: { r: number; c: number; dist: number } | null = null;
        for (let r = 0; r <= 8 - pRows; r++) {
          for (let c = 0; c <= 8 - pCols; c++) {
            if (canPlacePiece(grid, draggedPiece, r, c)) {
              const d = Math.hypot(r - exactRow, c - exactCol);
              if (!bestSpot || d < bestSpot.dist) {
                bestSpot = { r, c, dist: d };
              }
            }
          }
        }

        const isOverBoard =
          targetX >= rect.left - cellW &&
          targetX <= rect.right + cellW &&
          targetY >= rect.top - cellH &&
          targetY <= rect.bottom + cellH;

        const maxAllowedDist = isOverBoard ? 3.0 : 2.5;

        if (bestSpot && bestSpot.dist <= maxAllowedDist) {
          setDragPreviewCoord({ r: bestSpot.r, c: bestSpot.c });
          lastValidCoordRef.current = { r: bestSpot.r, c: bestSpot.c, time: Date.now() };
        } else {
          setDragPreviewCoord(null);
        }
      }
    };

    // DROP: Piece lock-in & line blast!
    const handlePointerUp = () => {
      // 400ms slip protection: if finger slipped slightly on lift, use last valid target
      const coord =
        dragPreviewCoord ||
        (lastValidCoordRef.current && Date.now() - lastValidCoordRef.current.time < 400
          ? lastValidCoordRef.current
          : null);

      if (coord && draggedPiece && canPlacePiece(grid, draggedPiece, coord.r, coord.c)) {
        // Place piece onto grid!
        saveUndoState();
        sound.playPop(1);

        const nextGrid = grid.map((r) => [...r]);
        const pRows = draggedPiece.matrix.length;
        const pCols = draggedPiece.matrix[0].length;
        let placedCount = 0;

        const gridEl = document.getElementById('block-blast-grid-inner');
        const boardEl = document.getElementById('block-blast-8x8-board');
        let cellW = boardCellSize;
        let cellH = boardCellSize;
        let gRect: DOMRect | null = null;
        let bRect: DOMRect | null = null;

        if (gridEl && boardEl) {
          gRect = gridEl.getBoundingClientRect();
          bRect = boardEl.getBoundingClientRect();
          cellW = gRect.width / 8;
          cellH = gRect.height / 8;
        }

        for (let pr = 0; pr < pRows; pr++) {
          for (let pc = 0; pc < pCols; pc++) {
            if (draggedPiece.matrix[pr][pc]) {
              nextGrid[coord.r + pr][coord.c + pc] = {
                id: `block-${Date.now()}-${pr}-${pc}`,
                color: draggedPiece.color,
              };
              placedCount++;

              if (gRect && bRect) {
                const px = gRect.left - bRect.left + (coord.c + pc) * cellW + cellW / 2;
                const py = gRect.top - bRect.top + (coord.r + pr) * cellH + cellH / 2;
                particleEngine.emitBurst(px, py, draggedPiece.color, 12, 0.8);
              }
            }
          }
        }

        setGrid(nextGrid);
        const addedScore = score + placedCount * 10;
        setScore(addedScore);
        handlePiecePlaced();

        // Check for full horizontal & vertical lines to blast!
        const fullRows: number[] = [];
        const fullCols: number[] = [];
        for (let r = 0; r < 8; r++) {
          if (nextGrid[r].every((c) => c !== null)) fullRows.push(r);
        }
        for (let c = 0; c < 8; c++) {
          let colFull = true;
          for (let r = 0; r < 8; r++) {
            if (nextGrid[r][c] === null) {
              colFull = false;
              break;
            }
          }
          if (colFull) fullCols.push(c);
        }

        const totalLines = fullRows.length + fullCols.length;
        if (totalLines > 0) {
          sound.playRocket();
          const newCombo = combo + 1;
          setCombo(newCombo);
          if (newCombo >= 2) {
            setTimeout(() => sound.playWin(), 120);
          }
          const bonus = totalLines * 100 + (newCombo - 1) * 80;
          setScore(addedScore + bonus);

          // Mark blasting cells for glowing explosive animation!
          const toClear = new Set<string>();
          fullRows.forEach((r) => {
            for (let c = 0; c < 8; c++) toClear.add(`${r},${c}`);
          });
          fullCols.forEach((c) => {
            for (let r = 0; r < 8; r++) toClear.add(`${r},${c}`);
          });
          setClearingCells(toClear);

          // Punchy screen/board recoil shake
          setIsBoardShaking(true);
          setTimeout(() => setIsBoardShaking(false), 280);

          // Celebratory Confetti Burst across viewport
          try {
            confetti({
              particleCount: totalLines >= 2 ? 65 : 40,
              spread: 75,
              origin: { y: 0.55 },
              colors: ['#ff5b79', '#facc15', '#38bdf8', '#4ade80', '#c084fc', '#fb923c'],
            });
          } catch {}

          // Show floating celebration text banner
          const bannerMsg =
            totalLines >= 3
              ? `🔥 TRIPLE BLAST! +${bonus}`
              : totalLines === 2
              ? `⚡ DOUBLE BLAST! +${bonus}`
              : newCombo >= 2
              ? `👑 COMBO x${newCombo}! +${bonus}`
              : `✨ LINE BLAST! +${bonus}`;

          setFloatingBanner({ text: bannerMsg, id: Date.now() });
          setTimeout(() => setFloatingBanner(null), 1600);

          // Emit fireworks & sprinkles across all cells in blasted lines
          if (gRect && bRect) {
            const sprinkleCells: { x: number; y: number; color?: string }[] = [];
            fullRows.forEach((r) => {
              for (let c = 0; c < 8; c++) {
                sprinkleCells.push({
                  x: gRect!.left - bRect!.left + c * cellW + cellW / 2,
                  y: gRect!.top - bRect!.top + r * cellH + cellH / 2,
                  color: nextGrid[r][c]?.color,
                });
              }
            });
            fullCols.forEach((c) => {
              for (let r = 0; r < 8; r++) {
                sprinkleCells.push({
                  x: gRect!.left - bRect!.left + c * cellW + cellW / 2,
                  y: gRect!.top - bRect!.top + r * cellH + cellH / 2,
                  color: nextGrid[r][c]?.color,
                });
              }
            });
            particleEngine.emitSprinkleLineBlast(sprinkleCells);
          }

          // Delay clearing grid so player sees the block blast explosion & sprinkles!
          const cleared = nextGrid.map((row) => [...row]);
          fullRows.forEach((r) => {
            for (let c = 0; c < 8; c++) cleared[r][c] = null;
          });
          fullCols.forEach((c) => {
            for (let r = 0; r < 8; r++) cleared[r][c] = null;
          });

          setTimeout(() => {
            setClearingCells(new Set());
            setGrid(cleared);
            handleProgressChallenge('lines', totalLines);
            if (newCombo >= 2) handleProgressChallenge('combo', 1);
            checkGameOver(cleared);
          }, 300);
        } else {
          setCombo(0);
          checkGameOver(nextGrid);
        }
      } else {
        sound.playClick();
      }

      setIsDragging(false);
      setDraggedPiece(null);
      setDraggedIndex(null);
      setDragPreviewCoord(null);
      lastValidCoordRef.current = null;
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
    };
  }, [
    isDragging,
    draggedPiece,
    dragPreviewCoord,
    grid,
    score,
    combo,
    saveUndoState,
    boardCellSize,
    handleProgressChallenge,
    checkGameOver,
  ]);

  // Color class helper for dragged floating piece
  const getFloatingColorClass = (col: BlockColor) => {
    switch (col) {
      case 'red':
        return 'bg-gradient-to-b from-[#ff6b8b] via-[#f43f5e] to-[#be123c] border-t-2 border-t-rose-300 border-b-2 border-b-rose-900 shadow-[0_4px_12px_rgba(244,63,94,0.6)]';
      case 'blue':
        return 'bg-gradient-to-b from-[#60a5fa] via-[#2563eb] to-[#1e3a8a] border-t-2 border-t-blue-200 border-b-2 border-b-blue-950 shadow-[0_4px_12px_rgba(37,99,235,0.6)]';
      case 'yellow':
        return 'bg-gradient-to-b from-[#fde047] via-[#eab308] to-[#854d0e] border-t-2 border-t-amber-200 border-b-2 border-b-amber-950 shadow-[0_4px_12px_rgba(234,179,8,0.6)]';
      case 'green':
        return 'bg-gradient-to-b from-[#4ade80] via-[#16a34a] to-[#14532d] border-t-2 border-t-emerald-200 border-b-2 border-b-emerald-950 shadow-[0_4px_12px_rgba(22,163,74,0.6)]';
      case 'purple':
        return 'bg-gradient-to-b from-[#c084fc] via-[#9333ea] to-[#581c87] border-t-2 border-t-purple-200 border-b-2 border-b-purple-950 shadow-[0_4px_12px_rgba(147,51,234,0.6)]';
      case 'orange':
        return 'bg-gradient-to-b from-[#fb923c] via-[#ea580c] to-[#9a3412] border-t-2 border-t-orange-200 border-b-2 border-b-orange-950 shadow-[0_4px_12px_rgba(234,88,12,0.6)]';
      case 'cyan':
        return 'bg-gradient-to-b from-[#22d3ee] via-[#0891b2] to-[#164e63] border-t-2 border-t-cyan-200 border-b-2 border-b-cyan-950 shadow-[0_4px_12px_rgba(8,145,178,0.6)]';
      case 'pink':
        return 'bg-gradient-to-b from-[#f472b6] via-[#db2777] to-[#831843] border-t-2 border-t-pink-200 border-b-2 border-b-pink-950 shadow-[0_4px_12px_rgba(219,39,119,0.6)]';
      case 'lime':
        return 'bg-gradient-to-b from-[#a3e635] via-[#65a30d] to-[#365314] border-t-2 border-t-lime-200 border-b-2 border-b-lime-950 shadow-[0_4px_12px_rgba(101,163,13,0.6)]';
    }
  };

  // Compute ghost piece position (follows pointer smoothly)
  const ghostPosition = useMemo(() => {
    if (!draggedPiece) return { left: 0, top: 0 };
    const pRows = draggedPiece.matrix.length;
    const pCols = draggedPiece.matrix[0].length;
    return {
      left: pointerPos.x - (pCols * boardCellSize) / 2,
      top: pointerPos.y - (pRows * boardCellSize) / 2,
    };
  }, [draggedPiece, pointerPos, boardCellSize]);

  return (
    <div className="fixed inset-0 w-full h-[100dvh] max-h-[100dvh] overflow-hidden bg-[#070b14] text-white font-game flex flex-col justify-between items-center p-1 sm:p-2 select-none touch-none">
      {/* Background ambient lighting */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-blue-900/15 via-indigo-900/5 to-transparent pointer-events-none" />

      {/* Splash Screen */}
      {gameState === 'splash' && (
        <SplashScreen
          onPlay={() => {
            setGameState('playing');
            setTimeout(updateBoardMetrics, 50);
            setTimeout(() => {
              particleEngine.resize();
            }, 80);
          }}
          highScore={player.highScore}
          coins={player.coins}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
          onOpenChallenges={() => setShowChallenges(true)}
          onOpenLuckyWheel={() => setShowLuckyWheel(true)}
          onOpenInstall={() => setShowInstallModal(true)}
          soundEnabled={soundEnabled}
          onToggleSound={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            sound.enabled = next;
          }}
        />
      )}

      {/* Main Single-Screen Mobile Frame (No scrollbars on any mobile!) */}
      <div className={`relative z-10 w-full max-w-[440px] h-full flex flex-col justify-between items-center gap-1 sm:gap-1.5 py-0.5 ${gameState === 'splash' ? 'hidden pointer-events-none' : ''}`}>
        {/* Top: Fixed Mobile Game Ads Banner as requested */}
        <TopAdBanner onClaimRewardAd={() => setShowAdModal(true)} />

        {/* 1. Top HUD: Controls, High Score, Score, and Boosters fixed at top */}
        <BlockBlastTop
          onPause={() => setShowPause(true)}
          onRestart={handleRestart}
          onGoHome={() => setGameState('splash')}
          soundEnabled={soundEnabled}
          onToggleSound={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            sound.enabled = next;
          }}
          highScore={player.highScore}
          score={score}
          combo={combo}
          activeBooster={activeBooster}
          setActiveBooster={setActiveBooster}
          boosters={player.boosters}
          onShuffle={handleShuffle}
          onUndo={handleUndo}
          onOpenAdForBooster={() => setShowAdModal(true)}
          onOpenLeaderboard={() => setShowLeaderboard(true)}
          onOpenChallenges={() => setShowChallenges(true)}
          canUndo={undoHistory.length > 0 && player.boosters.undo > 0}
        />

        {/* Active Booster Notification Banner */}
        {activeBooster !== 'none' && (
          <div className="w-full bg-amber-400 text-stone-950 px-3 py-1 rounded-xl font-black text-xs flex items-center justify-between shadow-lg animate-bounce shrink-0">
            <span>
              {activeBooster === 'hammer' && '🔨 Tap any block on the 8x8 grid to smash it!'}
              {activeBooster === 'line_blast' && '⚡ Tap any row or column to clear the line!'}
              {activeBooster === 'color_sweep' && '🌈 Tap any block to clear all blocks of that color!'}
            </span>
            <button
              onClick={() => setActiveBooster('none')}
              className="bg-stone-900 text-white text-[10px] px-2 py-0.5 rounded cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}

        {/* 2. 8x8 Main Board (Full Size, Starts 100% EMPTY, Blasts lines with sprinkles & particles) */}
        <div className="flex-1 min-h-0 w-full flex items-center justify-center relative">
          <BlockBlastBoard
            score={score}
            setScore={setScore}
            combo={combo}
            setCombo={setCombo}
            activeBooster={activeBooster}
            setActiveBooster={setActiveBooster}
            selectedPiece={selectedPiece}
            onPiecePlaced={handlePiecePlaced}
            onGameOver={() => setShowGameOver(true)}
            pieces={pieces}
            holdPiece={null}
            grid={grid}
            setGrid={setGrid}
            onSaveUndoState={saveUndoState}
            onProgressChallenge={handleProgressChallenge}
            onBoosterUsed={handleBoosterUsed}
            dragPreviewCoord={dragPreviewCoord}
            boardRefOut={boardRef}
            clearingCells={clearingCells}
            isBoardShaking={isBoardShaking}
          />

          {/* Floating line blast celebration banner */}
          {floatingBanner && (
            <div className="absolute z-50 pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-950/95 via-stone-900/95 to-amber-950/95 border-3 border-amber-400 px-5 py-2.5 rounded-3xl shadow-[0_0_35px_rgba(245,158,11,0.7)] animate-celebration-banner backdrop-blur-md">
              <span className="font-game font-black text-lg sm:text-2xl text-transparent bg-clip-text bg-gradient-to-b from-yellow-100 via-amber-300 to-orange-400 drop-shadow-[0_2px_10px_rgba(245,158,11,0.9)] whitespace-nowrap uppercase tracking-wider">
                {floatingBanner.text}
              </span>
            </div>
          )}
        </div>

        {/* 3. Bottom Area: Clean 3 Pieces Tray (NO rotation icon! Tap to rotate, drag to place) */}
        <BlockBlastBottom
          pieces={pieces}
          selectedPieceIndex={selectedPieceIndex}
          onSelectPiece={(idx) => setSelectedPieceIndex(idx)}
          validPiecesMap={validPiecesMap}
          onStartDrag={handleStartDrag}
          onRotatePiece={handleRotatePiece}
        />
      </div>

      {/* Floating Ghost Piece that matches the board cell size and follows pointer smoothly */}
      {isDragging && draggedPiece && (
        <div
          className="fixed pointer-events-none z-50 scale-100 opacity-90 transition-none"
          style={{
            left: `${ghostPosition.left}px`,
            top: `${ghostPosition.top}px`,
          }}
        >
          <div
            className="grid gap-1.5"
            style={{
              gridTemplateRows: `repeat(${draggedPiece.matrix.length}, minmax(0, 1fr))`,
              gridTemplateColumns: `repeat(${draggedPiece.matrix[0].length}, minmax(0, 1fr))`,
            }}
          >
            {draggedPiece.matrix.map((row, r) =>
              row.map((active, c) => {
                if (!active) {
                  return (
                    <div
                      key={`ghost-${r}-${c}`}
                      style={{
                        width: `${boardCellSize}px`,
                        height: `${boardCellSize}px`,
                      }}
                    />
                  );
                }
                return (
                  <div
                    key={`ghost-${r}-${c}`}
                    style={{
                      width: `${boardCellSize}px`,
                      height: `${boardCellSize}px`,
                    }}
                    className={`rounded-xl sm:rounded-2xl ${getFloatingColorClass(
                      draggedPiece.color
                    )} relative flex items-center justify-center border-2 border-white/80 shadow-2xl`}
                  >
                    {/* Top Specular Shine */}
                    <div className="absolute top-1 left-1.5 right-1.5 h-1 bg-white/50 rounded-full" />
                    {/* Embossed Symbol */}
                    <div className="transform scale-90 pointer-events-none">
                      {renderBlockIcon(draggedPiece.color)}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {showGameOver && (
        <GameOverModal
          onRetry={handleRestart}
          onGoHome={() => {
            setShowGameOver(false);
            setGameState('splash');
          }}
          coins={player.coins}
          onWatchAdForMoves={() => {
            setShowGameOver(false);
            setShowAdModal(true);
          }}
          onBuyMovesWithCoins={() => {
            if (player.coins >= 100) {
              setPlayer((p) => ({ ...p, coins: p.coins - 100 }));
              setPieces([generateRandomPiece(), generateRandomPiece(), generateRandomPiece()]);
              setShowGameOver(false);
            }
          }}
        />
      )}

      {/* Pause Modal */}
      {showPause && (
        <PauseModal
          onResume={() => setShowPause(false)}
          onRestart={handleRestart}
          onGoHome={() => {
            setShowPause(false);
            setGameState('splash');
          }}
          onOpenMap={() => setShowLeaderboard(true)}
          soundEnabled={soundEnabled}
          onToggleSound={() => {
            const next = !soundEnabled;
            setSoundEnabled(next);
            sound.enabled = next;
          }}
          adRevenue={player.adRevenueSimulated}
          adsWatched={player.adsWatched}
        />
      )}

      {/* Rewarded Ad Modal */}
      {showAdModal && (
        <RewardedAdModal
          rewardType="booster"
          onClose={() => setShowAdModal(false)}
          totalAdRevenue={player.adRevenueSimulated}
          onTrackAdRevenue={(amount) => {
            setPlayer((p) => ({
              ...p,
              adRevenueSimulated: p.adRevenueSimulated + amount,
              adsWatched: p.adsWatched + 1,
            }));
          }}
          onRewardGranted={() => {
            setShowAdModal(false);
            sound.playWin();
            setPlayer((p) => ({
              ...p,
              coins: p.coins + 150,
              boosters: {
                ...p.boosters,
                hammer: p.boosters.hammer + 1,
                shuffle: p.boosters.shuffle + 1,
              },
            }));
          }}
        />
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <LeaderboardModal
          users={[
            { rank: 1, name: 'MasterBlocker', score: 3420, avatar: '👑', badge: 'Grandmaster' },
            { rank: 2, name: 'PuzzleQueen', score: 2890, avatar: '💎', badge: 'Diamond' },
            { rank: 3, name: 'LuckyBlaster (You)', score: Math.max(score, player.highScore), avatar: '⭐', badge: 'Champion', isUser: true },
            { rank: 4, name: 'GridCrusher', score: 1450, avatar: '⚡', badge: 'Gold' },
            { rank: 5, name: 'ZenGamer', score: 980, avatar: '🎯', badge: 'Silver' },
          ]}
          currentUserScore={Math.max(score, player.highScore)}
          currentUserLevel={1}
          onClose={() => setShowLeaderboard(false)}
        />
      )}

      {/* Daily Quests Modal */}
      {showChallenges && (
        <DailyChallengesModal
          challenges={challenges}
          onClaim={(id) => {
            const ch = challenges.find((c) => c.id === id);
            if (!ch || ch.claimed) return;
            setChallenges((prev) =>
              prev.map((c) => (c.id === id ? { ...c, claimed: true } : c))
            );
            setPlayer((p) => ({
              ...p,
              coins: p.coins + ch.rewardAmount,
            }));
          }}
          onClose={() => setShowChallenges(false)}
        />
      )}

      {/* Lucky Spin Wheel Modal */}
      {showLuckyWheel && (
        <LuckyWheelModal
          canSpinFree={true}
          onClose={() => setShowLuckyWheel(false)}
          onWinPrize={(prize) => {
            sound.playWin();
            if (prize.coins) {
              setPlayer((p) => ({ ...p, coins: p.coins + prize.coins! }));
            }
            if (prize.booster) {
              const b = prize.booster === 'rocket' ? 'lineBlast' : prize.booster === 'rainbow' ? 'colorSweep' : prize.booster;
              setPlayer((p) => ({
                ...p,
                boosters: {
                  ...p.boosters,
                  [b]: p.boosters[b as keyof typeof p.boosters] + prize.amount,
                },
              }));
            }
          }}
        />
      )}

      {/* Install App Modal */}
      {showInstallModal && (
        <InstallAppModal
          onClose={() => setShowInstallModal(false)}
          canNativeInstall={!!installPrompt}
          onNativeInstall={() => {
            if (installPrompt) {
              installPrompt.prompt();
              installPrompt.userChoice.then(() => {
                setInstallPrompt(null);
              });
            }
          }}
        />
      )}
    </div>
  );
}
