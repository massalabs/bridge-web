import { Button } from '@massalabs/react-ui-kit/src';
import Intl from './i18n/i18n';

function App() {
  // const [state, setState] = useState(0)
  return (
    <div>
      <Button>{Intl.t('main')}</Button>
    </div>
  );
}

export default App;
