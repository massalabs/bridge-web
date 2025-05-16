// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { ComponentPropsWithoutRef, ReactNode } from 'react';
import {
  createBridgedFt,
  createNativeFt,
  Eth,
  EthBridged,
  Sepolia,
  SepoliaBridged,
} from '@massalabs/react-ui-kit';
import { mainnet } from 'viem/chains';

export interface SVGProps extends ComponentPropsWithoutRef<'svg'> {
  size?: number;
}

/* eslint-disable max-len */
export function WBTC(props: SVGProps) {
  let { size } = props;
  return (
    <div>
      <img
        width={size ?? 20}
        height={size ?? 20}
        src="https://coin-images.coingecko.com/coins/images/7598/large/wrapped_bitcoin_wbtc.png"
        alt="WBTC"
      />
    </div>
  );
}

export function getWBTCIcons(
  originChainId?: number,
  isNative = true,
  size?: number,
): ReactNode {
  if (!originChainId) {
    return createNativeFt(WBTC, size);
  }
  let originChainIcon: React.FC<SVGProps>;
  if (originChainId === mainnet.id) {
    originChainIcon = isNative ? Eth : EthBridged;
  } else {
    originChainIcon = isNative ? Sepolia : SepoliaBridged;
  }

  return createBridgedFt(originChainIcon, WBTC, size);
}
