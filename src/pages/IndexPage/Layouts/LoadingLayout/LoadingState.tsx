import { ReactNode } from 'react';

import { FiPauseCircle } from 'react-icons/fi';

import { Spinner, ErrorCheck, WarningCheck, SuccessCheck } from '@/components';
import { Status } from '@/store/globalStatusesStore';

export interface Loading {
  loading: ReactNode;
  error: ReactNode;
  warning: ReactNode;
  success: ReactNode;
  none: ReactNode;
}

interface LoadingStateProps {
  state: Status;
  size?: 'md' | 'sm' | 'lg';
}

export function LoadingState(props: LoadingStateProps) {
  const { state, size } = props;
  const loading: Loading = {
    loading: <Spinner size={size} />,
    error: <ErrorCheck size={size} />,
    warning: <WarningCheck size={size} />,
    success: <SuccessCheck size={size} />,
    none: <FiPauseCircle size={24} />,
  };

  return loading[state];
}
