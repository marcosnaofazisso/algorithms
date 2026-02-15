export interface Algorithm {
  id: string;
  name: string;
  category: 'search' | 'sorting';
  description: string;
  /** What the algorithm is for (shown in "Read more") */
  whatFor?: string;
  /** Best use case and why (shown in "Read more") */
  bestUseCase?: string;
  /** Performance notes: is it slow/fast, when to use (shown in "Read more") */
  performance?: string;
  bestCase: string;
  averageCase: string;
  worstCase: string;
  spaceComplexity: string;
  pythonCode: string;
}

export interface VisualizationState {
  data: number[];
  currentIndex: number;
  targetValue: number | null;
  found: boolean;
  isRunning: boolean;
  isComplete: boolean;
}

export type FlowStep = 
  | 'start'
  | 'init'
  | 'check-length'
  | 'compare'
  | 'found'
  | 'increment'
  | 'not-found';
