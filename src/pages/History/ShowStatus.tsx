// import { Spinner, SuccessCheck } from '@/components';
import { Link } from 'react-router-dom';
import { ErrorCheck, Spinner, SuccessCheck } from '@/components';
import Intl from '@/i18n/i18n';
import { OperationStatus } from '@/utils/lambdaApi';

export function ShowStatus({ ...props }) {
  const { status: operationStatus } = props;

  return (
    <div className="flex items-center gap-2">
      {(() => {
        switch (operationStatus) {
          case OperationStatus.done:
            return (
              <div className="flex items-center gap-2">
                <SuccessCheck size="sm" />
                <p> {Intl.t(`history.operation-status.${operationStatus}`)}</p>
              </div>
            );
          case OperationStatus.pending:
            return (
              <div className="flex items-center gap-2">
                <Spinner size="sm" />
                <p> {Intl.t(`history.operation-status.${operationStatus}`)}</p>
              </div>
            );
          case OperationStatus.claimable:
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
          case OperationStatus.error:
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
