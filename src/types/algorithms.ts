export interface Algorithm {
  id: string;
  name: string;
  category: 'search' | 'sorting';
  description: string;
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
