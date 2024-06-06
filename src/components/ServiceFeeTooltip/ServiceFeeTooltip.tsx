import { Tooltip } from '@massalabs/react-ui-kit';

export interface ServiceFeeToolipProps {
  input: string | undefined;
  serviceFee: string;
  output: string | undefined;
  symbol: string;
}

export function ServiceFeeToolip(props: ServiceFeeToolipProps) {
  const { input, serviceFee, output, symbol } = props;
  const serviceFeeTooltipBody = (
    <>
      <div>this is a servcie fee body</div>
      <div>input: {input}</div>
      <div>service fee: {serviceFee}</div>
      <div>output: {output}</div>
    </>
  );

  return (
    <div className="flex items-center gap-2">
      to receive: {output} {symbol}
      <Tooltip body={serviceFeeTooltipBody} />
    </div>
  );
}
