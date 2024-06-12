import { Button } from '@massalabs/react-ui-kit';
import { FiX } from 'react-icons/fi';

interface ConfirmationLayoutProps {
  prevPage: () => void;
}

export function ConfirmationLayout(props: ConfirmationLayoutProps) {
  const { prevPage } = props;
  return (
    <div>
      <Button onClick={() => prevPage()} variant={'icon'}>
        <FiX />
      </Button>
      <div>im a confirmation layout</div>
    </div>
  );
}
