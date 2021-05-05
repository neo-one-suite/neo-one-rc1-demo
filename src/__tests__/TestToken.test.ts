import { privateKeyToAddress } from '@neo-one/client';
import { withContracts } from '../neo-one/test';
import BigNumber from 'bignumber.js';

const TO = {
  PRIVATE_KEY: '536f1e9f0466f6cd5b2ea5374d00f038786daa0f0e892161d6b0cb4d6b154740',
  PUBLIC_KEY: '03463b7a0afc41ff1f6a386190f99bafd1deca48f4026aeac95435731af278cb7d',
};

const ZERO = {
  PRIVATE_KEY: '9c111f04a34b3a07600fe701d308dce6e20c86268c105f21c2f30e9fef7e7968',
  PUBLIC_KEY: '027f73dbc47133b08a4bc0fc04589fc76525baaf3bebe71bdd78053d559c41db70',
};

jest.setTimeout(30000);

describe('Test TestToken methods', () => {
  test('smart contract', async () => {
    await withContracts(async ({ testToken, client, networkName, masterAccountID }) => {
      const transferValue = new BigNumber('10');
      const issueValue = new BigNumber('100');

      expect(testToken).toBeDefined();

      const [nameResult, decimalsResult, symbolResult, wallet0] = await Promise.all([
        testToken.name(),
        testToken.decimals(),
        testToken.symbol(),
        client.providers.memory.keystore.addUserAccount({
          network: networkName,
          name: 'wallet0',
          privateKey: TO.PRIVATE_KEY,
        }),
      ]);
      expect(nameResult).toEqual('TestToken');
      expect(decimalsResult.toString()).toEqual('8');
      expect(symbolResult).toEqual('TT');

      const account0 = wallet0.userAccount.id;

      const [issueBalance, issueTotalSupply, transferResult] = await Promise.all([
        testToken.balanceOf(masterAccountID.address),
        testToken.totalSupply(),
        testToken.transfer(masterAccountID.address, account0.address, transferValue, { from: masterAccountID }),
      ]);
      expect(issueBalance.toString()).toEqual(issueValue.toString());
      expect(issueTotalSupply.toString()).toEqual(issueValue.toString());

      const transferReceipt = await transferResult.confirmed({
        timeoutMS: 2500,
      });

      if (transferReceipt.result.state !== 'HALT') {
        throw new Error(transferReceipt.result.message);
      }

      expect(transferReceipt.result.gasConsumed.toString()).toMatchSnapshot('transfer consume');
      expect(transferReceipt.events).toHaveLength(1);
      const event = transferReceipt.events[0];
      expect(event.name).toEqual('Transfer');
      expect(event.parameters.from).toEqual(masterAccountID.address);
      expect(event.parameters.to).toEqual(account0.address);
      if (event.parameters.amount === undefined) {
        expect(event.parameters.amount).toBeTruthy();
        throw new Error('For TS');
      }

      expect(event.parameters.amount.toString()).toEqual(transferValue.toString());

      const [
        transferMasterBalance,
        transferAccountBalance,
        transferTotalSupply,
        transferZeroBalance,
      ] = await Promise.all([
        testToken.balanceOf(masterAccountID.address),
        testToken.balanceOf(account0.address),
        testToken.totalSupply(),
        testToken.balanceOf(privateKeyToAddress(ZERO.PRIVATE_KEY)),
      ]);

      const remainingValue = issueValue.minus(transferValue);
      expect(transferMasterBalance.toString()).toEqual(remainingValue.toString());
      expect(transferAccountBalance.toString()).toEqual(transferValue.toString());
      expect(transferTotalSupply.toString()).toEqual(issueValue.toString());
      expect(transferZeroBalance.toString()).toEqual('0');

      const readClient = client.read(networkName);
      const contract = await readClient.getContract(testToken.definition.networks[networkName].address);

      expect(contract.id).toEqual(1);
      expect(contract.updateCounter).toEqual(0);
      expect(contract.nef.compiler).toEqual('neo-one 3.0.0-rc1');
      expect(contract.manifest.abi.events).toMatchSnapshot('contract events');
      expect(contract.manifest.abi.methods).toMatchSnapshot('contract methods');
      expect(contract.manifest.name).toEqual('TestToken');
      expect(contract.manifest.supportedStandards).toContain('NEP-17');
      expect(contract.manifest.trusts).toEqual('*');
      expect(contract.manifest.extra).toEqual({});
      expect(contract.manifest.groups).toEqual([]);
      expect(contract.manifest.permissions).toEqual([]);
    });
  });
});
