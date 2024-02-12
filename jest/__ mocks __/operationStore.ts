import { OperationStoreState } from '../../src/store/operationStore';
import { useOperationStore } from '../../src/store/store';

export let operationStoreMock: jest.SpyInstance<OperationStoreState>;

export const initOperationStoreMock = () => {
  operationStoreMock = jest
    .spyOn(useOperationStore, 'getState')
    .mockImplementation(
      (): OperationStoreState =>
        ({
          lockTxId: 'mockLockTxId',
          setLockTxId: jest.fn(),

          mintTxId: 'mockMintTxId',
          setMintTxId: jest.fn(),

          burnTxId: 'mockBurnTxId',
          setBurnTxId: jest.fn(),

          claimTxId: 'mockClaimTxId',
          setClaimTxId: jest.fn(),
        } as any as OperationStoreState),
    );
};
