// import { Spinner, SuccessCheck } from '@/components';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ErrorCheck, Spinner, SuccessCheck } from '@/components';
import Intl from '@/i18n/i18n';

interface StatusProps {
  isConfirmed: boolean;
  outputConfirmations: number | null;
  outputTxId: string | null;
  error: string | null;
  state: string;
}

type StatusTypes = 'done' | 'pending' | 'claimable' | 'error' | 'none';

enum Status {
  done = 'done',
  pending = 'pending',
  claimable = 'claimable',
  error = 'error',
  none = 'none',
}

export function ShowStatus({ ...props }: StatusProps) {
  const { isConfirmed, outputConfirmations, outputTxId, error, state } = props;

  const [status, setStatus] = useState<StatusTypes>(Status.none);

  useEffect(() => {
    getStatus();
  }, [isConfirmed, outputConfirmations, outputTxId, error]);

  // These are basic Status,
  // we might want to show more like processing state, finalizing etc

  function getStatus() {
    if (
      isConfirmed &&
      outputConfirmations !== null &&
      outputConfirmations >= 3
    ) {
      setStatus(Status.done);
    } else if (state === 'processing' && !isConfirmed && outputTxId !== null) {
      setStatus(Status.pending);
    } else if (outputTxId === null) {
      setStatus(Status.claimable);
    } else if (error !== null) {
      setStatus(Status.error);
    }
  }

  return (
    <div className="flex items-center gap-2">
      {(() => {
        switch (status) {
          case Status.done:
            return (
              <div className="flex items-center gap-2">
                <SuccessCheck size="sm" />
                <p> {Intl.t(`history.operation-status.${status}`)}</p>
              </div>
            );
          case Status.pending:
            return (
              <div className="flex items-center gap-2">
                <Spinner size="sm" />
                <p> {Intl.t(`history.operation-status.${status}`)}</p>
              </div>
            );
          case Status.claimable:
            return (
              <div className="flex items-center gap-2">
                <Link to="/claim">
                  <u> {Intl.t(`history.operation-status.${status}`)}</u>
                </Link>
              </div>
            );
          case Status.error:
            return (
              <div className="flex items-center gap-2">
                <ErrorCheck size="sm" />
                <p> {Intl.t(`history.operation-status.${status}`)}</p>
              </div>
            );
          default:
            return null;
        }
      })()}
    </div>
  );
}
