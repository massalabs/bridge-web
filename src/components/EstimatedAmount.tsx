import { useState, useEffect } from 'react';
import { FetchingLine } from '@massalabs/react-ui-kit';

interface FeesEstimationProps {
  amount?: string;
  symbol?: string;
}

export function EstimatedAmount(props: FeesEstimationProps) {
  const { amount, symbol } = props;

  const [fade, setFade] = useState(false);
  const [amountCopy, setAmountCopy] = useState(amount);

  useEffect(() => {
    setFade(true);
    const timeout = setTimeout(() => {
      setFade(false);
      setAmountCopy(amount);
    }, 500);
    return () => clearTimeout(timeout);
  }, [amount, setFade, setAmountCopy]);

  return (
    <div className="flex items-center">
      {amount && symbol ? (
        <span
          className={`transition-opacity duration-500 ease-in-out ${
            fade ? 'opacity-0' : 'opacity-100'
          }`}
        >
          {amountCopy} {symbol}
        </span>
      ) : (
        <FetchingLine width={52} height={2} />
      )}
    </div>
  );
}
