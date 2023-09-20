import { Factory } from 'miragejs';

import { NetworkModel } from '../../models/NetworkModel';
import { NETWORKS } from '@/const';

export const networkFactory = Factory.extend<NetworkModel>({
  availableNetworks() {
    return NETWORKS;
  },
  currentNetwork() {
    return 'buildnet';
  },
});
