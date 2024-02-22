import { SuccessCheck } from '@/components';

interface StatusProps {
  isConfirmed: boolean;
}

// Logic here may depend on the operation state in store (under development)
// A sync with Nathan will be necessary here to determine strategy

// TODO: add logic here once store refacto is merged

export function ShowStatus({ ...props }: StatusProps) {
  const { isConfirmed } = props;

  return (
    <div className="flex items-center gap-2">
      {isConfirmed ? (
        <div className="flex gap-2 items-center">
          <SuccessCheck size={'sm'} />
          <p>Done</p>
        </div>
      ) : (
        <p>foo bar</p>
      )}
    </div>
  );
}
