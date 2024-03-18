import { MassaLogo } from '@massalabs/react-ui-kit';
import { mainnet, sepolia, bsc, bscTestnet } from 'viem/chains';
import { EthSvg } from '@/assets/EthSvg';
import { SepoliaSvg } from '@/assets/SepoliaSVG';
import { WMasSvg } from '@/assets/WMasSvg';
import { Blockchain } from '@/const';
import { useBridgeModeStore } from '@/store/store';
import { Entities, OperationHistoryItem } from '@/utils/lambdaApi';

interface EmitterProps {
  operation: OperationHistoryItem;
}
export function Emitter(props: EmitterProps) {
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
              return <WMasSvg size={24} />;
            case Entities.Lock:
              return isMainnet ? (
                <EthSvg size={24} />
              ) : (
                <SepoliaSvg size={24} />
              );
            case Entities.Burn:
              return <MassaLogo size={24} />;
          }
        })()}
      </div>
      <div>
        {(() => {
          switch (operation.entity) {
            case Entities.ReleaseMAS:
              return isMainnet ? bsc.name : bscTestnet.name;
            case Entities.Lock:
              return isMainnet ? mainnet.name : sepolia.name;
            case Entities.Burn:
              return massaSide;
          }
        })()}
      </div>
    </div>
  );
}
