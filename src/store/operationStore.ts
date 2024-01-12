import { RedeemOperationToClaim } from '@/utils/lambdaApi';

export interface OperationStoreState {
  opToRedeem: RedeemOperationToClaim[];
  setOpToRedeem: (operationsToRedeem: RedeemOperationToClaim[]) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const operationStore = (
  set: (params: Partial<OperationStoreState>) => void,
  _get: () => OperationStoreState,
) => ({
  opToRedeem: [],
  setOpToRedeem: (operationsToRedeem: RedeemOperationToClaim[]) =>
    set({ opToRedeem: operationsToRedeem }),
});

export default operationStore;
