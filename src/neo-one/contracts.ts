/* @hash a00f124f9fcefc1169e1794d341102e1 */
// tslint:disable
/* eslint-disable */
import { Client } from '@neo-one/client';

import { TestTokenSmartContract, TestTokenMigrationSmartContract } from './TestToken/types';

import { createTestTokenSmartContract } from './TestToken/contract';

export interface Contracts<TClient extends Client = Client> {
  readonly testToken: TestTokenSmartContract<TClient>;
}
// Refer to the MigrationSmartContract documentation at https://neo-one.io/docs/deployment for more information.
export interface MigrationContracts {
  readonly testToken: TestTokenMigrationSmartContract;
}

export const createContracts = <TClient extends Client>(client: TClient): Contracts<TClient> => ({
  testToken: createTestTokenSmartContract(client),
});
