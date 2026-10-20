import { BlockColor, BlockPiece, BlockShapeMatrix, GridCell } from '../types/game';

export const ALL_9_COLORS: BlockColor[] = [
  'red',
  'blue',
  'yellow',
  'green',
  'purple',
  'orange',
  'cyan',
  'pink',
  'lime',
];

interface ShapeTemplate {
  name: string;
  matrix: BlockShapeMatrix;
  preferredColor?: BlockColor;
}

const TEMPLATES: ShapeTemplate[] = [
  // 1x1 Single Dot
  { name: '1x1', matrix: [[true]] },

  // 1x2 & 2x1
  { name: '2x1_h', matrix: [[true, true]] },
  { name: '2x1_v', matrix: [[true], [true]] },

  // 1x3 & 3x1
  { name: '3x1_h', matrix: [[true, true, true]] },
  { name: '3x1_v', matrix: [[true], [true], [true]] },

  // 1x4 & 4x1
  { name: '4x1_h', matrix: [[true, true, true, true]] },
  { name: '4x1_v', matrix: [[true], [true], [true], [true]] },

  // 1x5 & 5x1
  { name: '5x1_h', matrix: [[true, true, true, true, true]] },
  { name: '5x1_v', matrix: [[true], [true], [true], [true], [true]] },

  // 2x2 & 3x3 Squares
  {
    name: '2x2',
    matrix: [
      [true, true],
      [true, true],
    ],
  },
  {
    name: '3x3',
    matrix: [
      [true, true, true],
      [true, true, true],
      [true, true, true],
    ],
  },

  // 2x2 Corners (3 blocks)
  {
    name: 'corner_br',
    matrix: [
      [true, true],
      [true, false],
    ],
  },
  {
    name: 'corner_bl',
    matrix: [
      [true, true],
      [false, true],
    ],
  },
  {
    name: 'corner_tl',
    matrix: [
      [true, false],
      [true, true],
    ],
  },
  {
    name: 'corner_tr',
    matrix: [
      [false, true],
      [true, true],
    ],
  },

  // L-Shapes (Like in user's uploaded screenshot: 3 tall, 2 bottom)
  {
    name: 'L_tall_right',
    matrix: [
      [true, false],
      [true, false],
      [true, true],
    ],
  },
  {
    name: 'L_tall_left',
    matrix: [
      [false, true],
      [false, true],
      [true, true],
    ],
  },
  {
    name: 'L_tall_top_right',
    matrix: [
      [true, true],
      [true, false],
      [true, false],
    ],
  },
  {
    name: 'L_tall_top_left',
    matrix: [
      [true, true],
      [false, true],
      [false, true],
    ],
  },

  // Wide L-shapes (2 tall, 3 wide)
  {
    name: 'L_wide_1',
    matrix: [
      [true, true, true],
      [true, false, false],
    ],
  },
  {
    name: 'L_wide_2',
    matrix: [
      [true, true, true],
      [false, false, true],
    ],
  },
  {
    name: 'L_wide_3',
    matrix: [
      [true, false, false],
      [true, true, true],
    ],
  },
  {
    name: 'L_wide_4',
    matrix: [
      [false, false, true],
      [true, true, true],
    ],
  },

  // T-Shapes
  {
    name: 'T_up',
    matrix: [
      [false, true, false],
      [true, true, true],
    ],
  },
  {
    name: 'T_down',
    matrix: [
      [true, true, true],
      [false, true, false],
    ],
  },

  // Plus / Cross shape
  {
    name: 'plus',
    matrix: [
      [false, true, false],
      [true, true, true],
      [false, true, false],
    ],
  },
];

export function generateRandomPiece(): BlockPiece {
  const template = TEMPLATES[Math.floor(Math.random() * TEMPLATES.length)];
  const color = ALL_9_COLORS[Math.floor(Math.random() * ALL_9_COLORS.length)];

  return {
    id: `piece-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    color,
    matrix: template.matrix,
    name: template.name,
  };
}

export function generateInitialPieces(): (BlockPiece | null)[] {
  return [
    {
      id: `p1-${Date.now()}`,
      color: 'blue',
      matrix: [[true]],
      name: '1x1',
    },
    {
      id: `p2-${Date.now()}`,
      color: 'red',
      matrix: [
        [true, false],
        [true, false],
        [true, true],
      ],
      name: 'L_tall_right',
    },
    {
      id: `p3-${Date.now()}`,
      color: 'yellow',
      matrix: [
        [false, true],
        [false, true],
        [true, true],
      ],
      name: 'L_tall_left',
    },
  ];
}

// Check if a piece can be placed at (startRow, startCol) on an 8x8 grid
export function canPlacePiece(
  grid: (GridCell | null)[][],
  piece: BlockPiece,
  startRow: number,
  startCol: number
): boolean {
  const rows = piece.matrix.length;
  const cols = piece.matrix[0].length;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (piece.matrix[r][c]) {
        const targetR = startRow + r;
        const targetC = startCol + c;

        // Out of bounds
        if (targetR < 0 || targetR >= 8 || targetC < 0 || targetC >= 8) {
          return false;
        }

        // Cell already occupied
        if (grid[targetR][targetC] !== null) {
          return false;
        }
      }
    }
  }

  return true;
}

// Check if a piece has AT LEAST ONE valid spot anywhere on the 8x8 grid
export function hasValidMoveForPiece(
  grid: (GridCell | null)[][],
  piece: BlockPiece | null
): boolean {
  if (!piece) return false;

  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      if (canPlacePiece(grid, piece, r, c)) {
        return true;
      }
    }
  }
  return false;
}

// Rotate a 2D boolean matrix 90 degrees clockwise
export function rotateMatrixClockwise(matrix: boolean[][]): boolean[][] {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const rotated: boolean[][] = Array.from({ length: cols }, () => Array(rows).fill(false));

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = matrix[r][c];
    }
  }

  return rotated;
}

// Rotate a block piece 90 degrees clockwise
export function rotatePieceClockwise(piece: BlockPiece): BlockPiece {
  return {
    ...piece,
    matrix: rotateMatrixClockwise(piece.matrix),
    id: `piece-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
  };
}
