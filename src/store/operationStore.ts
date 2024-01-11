import { RedeemOperationToClaim } from '@/utils/lambdaApi';

export interface OperationStoreState {
  burnedOpList: RedeemOperationToClaim[];
  setBurnedOpList: (operationsToRedeem: RedeemOperationToClaim[]) => void;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const operationStore = (set: any, _get: any) => ({
  burnedOpList: [],
  setBurnedOpList: (operationsToRedeem: RedeemOperationToClaim[]) =>
    set({ burnedOpList: operationsToRedeem }),
});

export default operationStore;
