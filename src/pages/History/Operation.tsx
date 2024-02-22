import { FiImage } from 'react-icons/fi';
import { SuccessCheck } from '@/components';

export function Operation() {
  return (
    <div className="grid grid-cols-6 mas-body2">
      <div className="flex items-center gap-2">
        <div>
          <FiImage />
        </div>
        <div>Massa</div>
      </div>
      <div className="flex items-center gap-2">
        <div>
          <FiImage />
        </div>
        <div>Ethereum</div>
      </div>
      <div className="flex items-center">10.10.2021</div>
      <div className="flex items-center">123.121313 tDAI</div>
      <div className="flex items-center gap-2">
        <div>
          <SuccessCheck size={'sm'} />
        </div>
        <div>Done</div>
      </div>
      <div className="flex items-center">
        <a href="https://foo-bar.com">
          <u>0000...0000</u>
        </a>
      </div>
    </div>
  );
}
