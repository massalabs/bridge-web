import { MassaLogo } from '@massalabs/react-ui-kit';
import { getEvmChainName, getEvmNetworkIcon } from '..';
import { Blockchain } from '@/const';
import { useBridgeModeStore } from '@/store/store';
import { Entities, OperationHistoryItem } from '@/utils/lambdaApi';

interface EmitterProps {
  operation: OperationHistoryItem;
}
export function Emitter(props: EmitterProps) {
  const { operation } = props;
  const { massaNetwork } = useBridgeModeStore();
  const currentMassaNetwork = massaNetwork();
  return (
    <div className="flex items-center gap-2">
      <div>
        {(() => {
          switch (operation.entity) {
            case Entities.ReleaseMAS:
            case Entities.Lock:
              return getEvmNetworkIcon(operation.evmChainId, 24);
            case Entities.Burn:
              return <MassaLogo size={24} />;
          }
        })()}
      </div>
      <div>
        {(() => {
          switch (operation.entity) {
            case Entities.ReleaseMAS:
            case Entities.Lock:
              return getEvmChainName(operation.evmChainId);
            case Entities.Burn:
              return `${Blockchain.MASSA} ${currentMassaNetwork}`;
          }
        })()}
      </div>
    </div>
  );
}
