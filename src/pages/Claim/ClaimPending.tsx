import { Spinner } from '@/components';

export function ClaimPending({ ...args }) {
  const { opId } = args;
  return (
    <div
      key={opId}
      className="flex justify-between items-center
          bg-secondary/50 backdrop-blur-lg text-f-primary 
          w-1/4 h-fit border border-tertiary mas-menu-active rounded-2xl p-10 text-menu-active"
    >
      <p>Claim Pending</p>
      <Spinner size="md" />
    </div>
  );
}
