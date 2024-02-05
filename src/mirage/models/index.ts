import { Model } from 'miragejs';
import { ModelDefinition } from 'miragejs/-types';

import { AccountObject } from '../../models/AccountModel';
import { ModeModel } from '../../models/Mode';

const accountModel: ModelDefinition<AccountObject> = Model.extend({});

const modeModel: ModelDefinition<ModeModel> = Model.extend({});

export const models = {
  account: accountModel,
  mode: modeModel,
};
