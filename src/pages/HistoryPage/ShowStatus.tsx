import { Link } from 'react-router-dom';
import { ErrorCheck, Spinner, SuccessCheck } from '@/components';
import Intl from '@/i18n/i18n';
import { HistoryOperationStatus } from '@/utils/lambdaApi';

interface ShowStatusProps {
  status: HistoryOperationStatus;
}

export function ShowStatus(props: ShowStatusProps) {
  const { status: operationStatus } = props;

  return (
    <div className="flex items-center gap-2">
      {(() => {
        switch (operationStatus) {
          case HistoryOperationStatus.Done:
            return (
              <div className="flex items-center gap-2">
                <SuccessCheck size="sm" />
                <p> {Intl.t(`history.operation-status.${operationStatus}`)}</p>
              </div>
            );
          case HistoryOperationStatus.Pending:
            return (
              <div className="flex items-center gap-2">
                <Spinner size="sm" />
                <p> {Intl.t(`history.operation-status.${operationStatus}`)}</p>
              </div>
            );
          case HistoryOperationStatus.Claimable:
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
          case HistoryOperationStatus.Error:
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
