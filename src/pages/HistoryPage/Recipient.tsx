import { MassaLogo } from '@massalabs/react-ui-kit';
import { mainnet, sepolia } from 'viem/chains';
import { EthSvg } from '@/assets/EthSvg';
import { SepoliaSvg } from '@/assets/SepoliaSVG';
import { Blockchain } from '@/const';
import { useBridgeModeStore } from '@/store/store';
import { Entities, OperationHistoryItem } from '@/utils/lambdaApi';

interface RecipientProps {
  operation: OperationHistoryItem;
}
export function Recipient(props: RecipientProps) {
  const { operation } = props;
  const { isMainnet: getIsMainnet } = useBridgeModeStore();

  const isMainnet = getIsMainnet();

  const massaSide = isMainnet
    ? `${Blockchain.MASSA} ${Blockchain.MASSA_MAINNET}`
    : `${Blockchain.MASSA} ${Blockchain.MASSA_BUILDNET}`;

  return (
    <div className="flex items-center gap-2">
      <div>
        {(() => {
          switch (operation.entity) {
            case Entities.ReleaseMAS:
            case Entities.Lock:
              return <MassaLogo size={24} />;
            case Entities.Burn:
              return isMainnet ? (
                <EthSvg size={24} />
              ) : (
                <SepoliaSvg size={24} />
              );
          }
        })()}
      </div>
      <div>
        {(() => {
          switch (operation.entity) {
            case Entities.ReleaseMAS:
            case Entities.Lock:
              return massaSide;
            case Entities.Burn:
              return isMainnet ? mainnet.name : sepolia.name;
          }
        })()}
      </div>
    </div>
  );
}
