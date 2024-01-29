import { RedeemOperationToClaim } from '@/utils/lambdaApi';

interface FailedClaimProps {
  operation: RedeemOperationToClaim;
  symbol: string | undefined;
}

// TODO: add correct wording and design

export function RejectedClaim(args: FailedClaimProps) {
  const { symbol } = args;
  return (
    <div
      className="flex justify-between items-center
          bg-secondary/50 backdrop-blur-lg text-f-primary 
          w-[520px] h-12 border border-tertiary rounded-2xl px-10 py-14"
    >
      <h1>Claim Rejected NNN,NNN,NNN {symbol}</h1>
    </div>
  );
}
