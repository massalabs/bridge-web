import { useState } from 'react';
import { Button, Money } from '@massalabs/react-ui-kit';
import { FiArrowRight } from 'react-icons/fi';
import {
  EVMHeader,
  EVMMiddle,
} from '../IndexPage/Layouts/BridgeRedeemLayout/BoxLayoutComponents/EvmBoxComponents';
import Intl from '@/i18n/i18n';
import { useGlobalStatusesStore } from '@/store/globalStatusesStore';
import { useTokenStore } from '@/store/tokenStore';

export function DaoPage() {
  const { amountError } = useGlobalStatusesStore();
  const [amount, setAmount] = useState('');
  const { selectedToken: token } = useTokenStore();

  return (
    <div
      className="p-10 max-w-3xl w-full border border-tertiary rounded-2xl
            bg-secondary/50 text-f-primary mb-5"
    >
      <EVMHeader />
      <Money
        name="amount"
        value={amount}
        onValueChange={(o) => setAmount(o.value)}
        placeholder={Intl.t('index.input.placeholder.amount')}
        suffix=""
        decimalScale={token?.decimals}
        error={amountError}
      />
      <EVMMiddle />

      <Button posIcon={<FiArrowRight />}>Bridge</Button>
    </div>
  );
}
