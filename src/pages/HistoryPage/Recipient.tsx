import { MassaLogo } from '@massalabs/react-ui-kit';
import { getEvmChainName, getEvmNetworkIcon } from '..';
import { Blockchain } from '@/const';
import { useBridgeModeStore } from '@/store/store';
import { Entities, OperationHistoryItem } from '@/utils/lambdaApi';

interface RecipientProps {
  operation: OperationHistoryItem;
}
export function Recipient(props: RecipientProps) {
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
              return <MassaLogo size={24} />;
            case Entities.Burn:
              return getEvmNetworkIcon(operation.evmChainId, 24);
          }
        })()}
      </div>
      <div>
        {(() => {
          switch (operation.entity) {
            case Entities.ReleaseMAS:
            case Entities.Lock:
              return `${Blockchain.MASSA} ${currentMassaNetwork}`;
            case Entities.Burn:
              return getEvmChainName(operation.evmChainId);
          }
        })()}
      </div>
    </div>
  );
}
