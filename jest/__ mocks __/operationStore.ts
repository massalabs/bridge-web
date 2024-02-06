import { OperationStoreState } from '../../src/store/operationStore';
import { useOperationStore } from '../../src/store/store';

export let operationStoreMock: jest.SpyInstance<OperationStoreState>;

export const initOperationStoreMock = () => {
  operationStoreMock = jest
    .spyOn(useOperationStore, 'getState')
    .mockImplementation(
      (): OperationStoreState =>
        ({
          currentTxID: 'mockLockTxId',
          setCurrentTxID: jest.fn(),
        } as any as OperationStoreState),
    );
};
