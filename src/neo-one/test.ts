/* @hash ab6704f8b9f2320fffe2284a559cfcf1 */
// tslint:disable
/* eslint-disable */
import { createWithContracts, TestOptions, WithContractsOptions } from '@neo-one/smart-contract-test';
import { Contracts } from './contracts';
import * as path from 'path';

export const withContracts: (
  test: (contracts: Contracts & TestOptions) => Promise<void>,
  options?: WithContractsOptions,
) => Promise<void> = createWithContracts([
  { name: 'TestToken', filePath: path.resolve(__dirname, '../../neo-one/contracts/TestToken.ts') },
]);
