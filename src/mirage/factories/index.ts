import { accountFactory } from './account';
import { networkFactory } from './mode';

export const factories = {
  account: accountFactory,
  mode: networkFactory,
};
