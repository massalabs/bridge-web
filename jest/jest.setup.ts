// to fix "ReferenceError: TextEncoder is not defined":
import { TextEncoder, TextDecoder } from 'util';
Object.assign(global, { TextDecoder, TextEncoder });

// to fix "ReferenceError: jest is not defined":
import { jest } from '@jest/globals';
global.jest = jest;

import { initAccountStoreMock } from './__ mocks __/accountStore';
import { initTokenStoreMock } from './__ mocks __/tokensStore';

initTokenStoreMock();
initAccountStoreMock();
