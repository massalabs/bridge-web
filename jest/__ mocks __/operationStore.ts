import { OperationStoreState } from '../../src/store/operationStore';
import { useOperationStore } from '../../src/store/store';

export let operationStoreMock: jest.SpyInstance<OperationStoreState>;

export const initOperationStoreMock = () => {
  operationStoreMock = jest
    .spyOn(useOperationStore, 'getState')
    .mockImplementation(
      (): OperationStoreState =>
        ({
          opToRedeem: [],
          setOpToRedeem: jest.fn(),
          updateOpToRedeemByInputOpId: jest.fn(),
          pushNewOpToRedeem: jest.fn(),
          getOpToRedeemByInputOpId: jest.fn(),
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
