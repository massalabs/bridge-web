import { ReactNode } from 'react';

import { FiPauseCircle } from 'react-icons/fi';

import { Spinner, ErrorCheck, WarningCheck, SuccessCheck } from '@/components';
import { StateType } from '@/const';

interface ILoading {
  loading: ReactNode;
  error: ReactNode;
  warning: ReactNode;
  success: ReactNode;
  none: ReactNode;
}

export function loadingState(state: StateType, size?: 'md' | 'sm' | 'lg') {
  const loading: ILoading = {
    loading: <Spinner size={size} />,
    error: <ErrorCheck size={size} />,
    warning: <WarningCheck size={size} />,
    success: <SuccessCheck size={size} />,
    none: <FiPauseCircle size={24} />,
  };

  return loading[state];
}
