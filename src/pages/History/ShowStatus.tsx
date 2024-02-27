import { Link } from 'react-router-dom';
import { ErrorCheck, Spinner, SuccessCheck } from '@/components';
import Intl from '@/i18n/i18n';
import { HistoryOperationStatus } from '@/utils/bridgeHistory';

interface ShowStatusProps {
  status: HistoryOperationStatus;
}

export function ShowStatus(props: ShowStatusProps) {
  const { status: operationStatus } = props;

  return (
    <div className="flex items-center gap-2">
      {(() => {
        switch (operationStatus) {
          case HistoryOperationStatus.done:
            return (
              <div className="flex items-center gap-2">
                <SuccessCheck size="sm" />
                <p> {Intl.t(`history.operation-status.${operationStatus}`)}</p>
              </div>
            );
          case HistoryOperationStatus.pending:
            return (
              <div className="flex items-center gap-2">
                <Spinner size="sm" />
                <p> {Intl.t(`history.operation-status.${operationStatus}`)}</p>
              </div>
            );
          case HistoryOperationStatus.claimable:
            return (
              <div className="flex items-center gap-2">
                <Link to="/claim">
                  <u>
                    {' '}
                    {Intl.t(`history.operation-status.${operationStatus}`)}
                  </u>
                </Link>
              </div>
            );
          case HistoryOperationStatus.error:
            return (
              <div className="flex items-center gap-2">
                <ErrorCheck size="sm" />
                <p> {Intl.t(`history.operation-status.${operationStatus}`)}</p>
              </div>
            );
          default:
            return null;
        }
      })()}
    </div>
  );
}
