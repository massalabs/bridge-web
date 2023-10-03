// Define the layout types
export type LayoutType = 'massaToEvm' | 'evmToMassa';

export type StateType = 'loading' | 'warning' | 'error' | 'success' | 'none';

export interface ILoadingState {
  [key: string]: StateType;
}

export interface IOperation {
  [key: string]: string;
}
