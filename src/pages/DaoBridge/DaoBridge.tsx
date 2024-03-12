import { Button } from '@massalabs/react-ui-kit';
import { FiArrowRight } from 'react-icons/fi';
import { EVMHeader } from '../Index/Layouts/BridgeRedeemLayout/LayoutComponents/EVMLayoutComponent';

export function DaoBridge() {
  return (
    <div className="bg-blue-500 flex flex-col items-center w-full h-full">
      <EVMHeader />

      <Button posIcon={<FiArrowRight />}>Bridge</Button>
    </div>
  );
}
