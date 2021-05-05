/* @hash 490ea5e085d344818f41353a06f1d4de */
// tslint:disable
/* eslint-disable */
import { Client } from '@neo-one/client';
import { TestTokenSmartContract } from './types';
import { testTokenManifest } from './manifest';
import { sourceMaps } from '../sourceMaps';

const definition = {
  networks: {
    local: {
      address: 'NbF8Q8cQpoyGP9rp4RKBPpR7q2HEn4upMM',
    },
  },
  manifest: testTokenManifest,
  sourceMaps,
};

export const createTestTokenSmartContract = <TClient extends Client>(
  client: TClient,
): TestTokenSmartContract<TClient> => client.smartContract(definition);
