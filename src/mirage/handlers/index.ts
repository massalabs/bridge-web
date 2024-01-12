import { routesForAccounts } from './account';
import { routesForNetwork } from './network';

const handlers = {
  accounts: routesForAccounts,
  network: routesForNetwork,
};

export { handlers };
