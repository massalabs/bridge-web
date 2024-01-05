// Define the layout types
export type LayoutType = 'massaToEvm' | 'evmToMassa';

export type StateType = 'loading' | 'warning' | 'error' | 'success' | 'none';

export interface LoadingState {
  [key: string]: StateType;
}

export interface Operation {
  [key: string]: string;
}
