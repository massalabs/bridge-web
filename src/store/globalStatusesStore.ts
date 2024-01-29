import { create } from 'zustand';

export enum Status {
  None = 'none',
  Loading = 'loading',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}

export interface GlobalStatusesStoreState {
  box: Status;
  approve: Status;
  burn: Status;
  claim: Status;
  lock: Status;
  mint: Status;
  error: Status;

  setBox: (status: Status) => void;
  setApprove: (status: Status) => void;
  setBurn: (status: Status) => void;
  setClaim: (status: Status) => void;
  setLock: (status: Status) => void;
  setMint: (status: Status) => void;
  setError: (status: Status) => void;

  reset: () => void;
}

export const useGlobalStatusesStore = create<GlobalStatusesStoreState>(
  (set, _) => ({
    box: Status.None,
    approve: Status.None,
    burn: Status.None,
    claim: Status.None,
    lock: Status.None,
    mint: Status.None,
    error: Status.None,

    setBox: (box: Status) => set({ box }),
    setApprove: (approve: Status) => set({ approve }),
    setBurn: (burn: Status) => set({ burn }),
    setClaim: (claim: Status) => set({ claim }),
    setLock: (lock: Status) => set({ lock }),
    setMint: (mint: Status) => set({ mint }),
    setError: (error: Status) => set({ error }),

    reset: () =>
      set({
        box: Status.None,
        approve: Status.None,
        burn: Status.None,
        claim: Status.None,
        lock: Status.None,
        mint: Status.None,
        error: Status.None,
      }),
  }),
);