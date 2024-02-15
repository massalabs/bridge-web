import { create } from 'zustand';
import Intl from '@/i18n/i18n';
export enum Status {
  None = 'none',
  Loading = 'loading',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
}

interface redeemLabel {
  burn?: string | undefined;
  claim?: string | undefined;
}

export interface GlobalStatusesStoreState {
  box: Status;
  approve: Status;
  burn: Status;
  claim: Status;
  lock: Status;
  mint: Status;

  setBox: (status: Status) => void;
  setApprove: (status: Status) => void;
  setBurn: (status: Status) => void;
  setClaim: (status: Status) => void;
  setLock: (status: Status) => void;
  setMint: (status: Status) => void;

  redeemLabels: redeemLabel;
  setRedeemLabels: (labels: redeemLabel) => void;

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

    setBox: (box: Status) => set({ box }),
    setApprove: (approve: Status) => set({ approve }),
    setBurn: (burn: Status) => set({ burn }),
    setClaim: (claim: Status) => set({ claim }),
    setLock: (lock: Status) => set({ lock }),
    setMint: (mint: Status) => set({ mint }),

    redeemLabels: {
      burn: Intl.t('index.loading-box.burn'),
      claim: undefined,
    },
    setRedeemLabels: (labels: redeemLabel) => set({ redeemLabels: labels }),

    reset: () =>
      set({
        box: Status.None,
        approve: Status.None,
        burn: Status.None,
        claim: Status.None,
        lock: Status.None,
        mint: Status.None,
      }),
  }),
);
