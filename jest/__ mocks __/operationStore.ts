import { OperationStoreState } from '../../src/store/operationStore';
import { useOperationStore } from '../../src/store/store';

export let operationStoreMock: jest.SpyInstance<OperationStoreState>;

export const initOperationStoreMock = () => {
  operationStoreMock = jest
    .spyOn(useOperationStore, 'getState')
    .mockImplementation(
      (): OperationStoreState =>
        ({
          burnOperations: [],
          setBurnRedeemOperations: jest.fn(),
          updateBurnRedeemOperationById: jest.fn(),
          appendBurnRedeemOperation: jest.fn(),
          getBurnRedeemOperationById: jest.fn(),
          getCurrentRedeemOperation: jest.fn(),

          lockTxId: 'mockLockTxId',
          setLockTxId: jest.fn(),

          mintTxId: 'mockMintTxId',
          setMintTxId: jest.fn(),

          burnTxId: 'mockBurnTxId',
          setBurnTxId: jest.fn(),
        } as any as OperationStoreState),
    );
};
