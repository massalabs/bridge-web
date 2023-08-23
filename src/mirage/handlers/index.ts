import { routesForAccounts } from './account';
import { routesForNetwork } from './network';
import { routesForQuest } from './quest';

const handlers = {
  accounts: routesForAccounts,
  network: routesForNetwork,
  quest: routesForQuest,
};

export { handlers };
