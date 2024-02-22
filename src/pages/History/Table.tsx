import { Categories } from './Categories';
import { Operation } from './Operation';
import { Hr } from '@/components/Hr';
import Intl from '@/i18n/i18n';

export function Table() {
  return (
    <div
      className="flex flex-col w-3/4 px-16 py-12 bg-secondary/50 
    backdrop-blur-lg text-f-primary border border-tertiary rounded-2xl "
    >
      <div
        className="mas-subtitle flex 
        justify-center mb-12"
      >
        {Intl.t('history.title')}
      </div>

      <Hr />
      <Categories />
      <Hr />

      <div className="flex flex-col gap-8 py-4 mt-8">
        <Operation />
        <Operation />
        <Operation />
        <Operation />
        <Operation />
      </div>
    </div>
  );
}
