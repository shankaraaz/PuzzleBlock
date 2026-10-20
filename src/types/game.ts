export type BlockColor =
  | 'red'
  | 'blue'
  | 'yellow'
  | 'green'
  | 'purple'
  | 'orange'
  | 'cyan'
  | 'pink'
  | 'lime';

export interface GridCell {
  color: BlockColor;
  id: string;
}

export type BlockShapeMatrix = boolean[][];

export interface BlockPiece {
  id: string;
  color: BlockColor;
  matrix: BlockShapeMatrix;
  name: string;
}

export type ActiveBooster = 'none' | 'hammer' | 'line_blast' | 'color_sweep';

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  icon: 'lines' | 'score' | 'combo' | 'booster' | 'blast' | 'rocket' | 'star';
  current: number;
  target: number;
  completed: boolean;
  rewardType: 'coins' | 'hammer' | 'shuffle' | 'undo' | 'rocket' | 'rainbow';
  rewardAmount: number;
  claimed: boolean;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  score: number;
  badge?: string;
  level?: number;
  stars?: number;
  isUser?: boolean;
}

export interface PlayerProfile {
  highScore: number;
  currentScore: number;
  coins: number;
  boosters: {
    hammer: number;
    lineBlast: number;
    colorSweep: number;
    shuffle: number;
    undo: number;
  };
  totalLinesCleared: number;
  adsWatched: number;
  adRevenueSimulated: number;
}
