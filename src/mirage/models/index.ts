import { Model } from 'miragejs';
import { ModelDefinition } from 'miragejs/-types';

import { AccountObject } from '../../models/AccountModel';
import { NetworkModel } from '../../models/NetworkModel';

const accountModel: ModelDefinition<AccountObject> = Model.extend({});

const networkModel: ModelDefinition<NetworkModel> = Model.extend({});

const questModel: ModelDefinition = Model.extend({});

export const models = {
  account: accountModel,
  network: networkModel,
  quest: questModel,
};
