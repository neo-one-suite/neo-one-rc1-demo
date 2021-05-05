/* @hash c5c884711ce5e3e7d3599de04113b94b */
// tslint:disable
/* eslint-disable */
import {
  AddressString,
  BufferString,
  Client,
  Event,
  GetOptions,
  InvokeReceipt,
  SmartContract,
  Transaction,
  TransactionOptions,
  TransactionResult,
} from '@neo-one/client';
import BigNumber from 'bignumber.js';

export interface TestTokenTransferEventParameters {
  readonly from: AddressString | undefined;
  readonly to: AddressString | undefined;
  readonly amount: BigNumber;
}
export interface TestTokenTransferEvent extends Event<'Transfer', TestTokenTransferEventParameters> {}
export interface TestTokenApproveSendTransferEventParameters {
  readonly from: AddressString;
  readonly to: AddressString;
  readonly amount: BigNumber;
}
export interface TestTokenApproveSendTransferEvent
  extends Event<'approveSendTransfer', TestTokenApproveSendTransferEventParameters> {}
export interface TestTokenRevokeSendTransferEventParameters {
  readonly from: AddressString;
  readonly to: AddressString;
  readonly amount: BigNumber;
}
export interface TestTokenRevokeSendTransferEvent
  extends Event<'revokeSendTransfer', TestTokenRevokeSendTransferEventParameters> {}
export type TestTokenEvent =
  | TestTokenTransferEvent
  | TestTokenApproveSendTransferEvent
  | TestTokenRevokeSendTransferEvent;

export interface TestTokenSmartContract<TClient extends Client = Client>
  extends SmartContract<TClient, TestTokenEvent> {
  readonly approveReceiveTransfer: {
    (from: AddressString, amount: BigNumber, asset: AddressString, options?: TransactionOptions): Promise<
      TransactionResult<InvokeReceipt<boolean, TestTokenEvent>>
    >;
    readonly confirmed: (
      from: AddressString,
      amount: BigNumber,
      asset: AddressString,
      options?: TransactionOptions & GetOptions,
    ) => Promise<InvokeReceipt<boolean, TestTokenEvent> & { readonly transaction: Transaction }>;
  };
  readonly approveSendTransfer: {
    (from: AddressString, to: AddressString, amount: BigNumber, options?: TransactionOptions): Promise<
      TransactionResult<InvokeReceipt<boolean, TestTokenEvent>>
    >;
    readonly confirmed: (
      from: AddressString,
      to: AddressString,
      amount: BigNumber,
      options?: TransactionOptions & GetOptions,
    ) => Promise<InvokeReceipt<boolean, TestTokenEvent> & { readonly transaction: Transaction }>;
  };
  readonly approvedTransfer: (from: AddressString, to: AddressString) => Promise<BigNumber>;
  readonly balanceOf: (address: AddressString) => Promise<BigNumber>;
  readonly decimals: () => Promise<BigNumber>;
  readonly deploy: {
    (owner: AddressString, options?: TransactionOptions): Promise<
      TransactionResult<InvokeReceipt<boolean, TestTokenEvent>>
    >;
    readonly confirmed: (
      owner: AddressString,
      options?: TransactionOptions & GetOptions,
    ) => Promise<InvokeReceipt<boolean, TestTokenEvent> & { readonly transaction: Transaction }>;
  };
  readonly name: () => Promise<string>;
  readonly onNEP17Payment: {
    (from: AddressString, amount: BigNumber, data: BufferString, options?: TransactionOptions): Promise<
      TransactionResult<InvokeReceipt<undefined, TestTokenEvent>>
    >;
    readonly confirmed: (
      from: AddressString,
      amount: BigNumber,
      data: BufferString,
      options?: TransactionOptions & GetOptions,
    ) => Promise<InvokeReceipt<undefined, TestTokenEvent> & { readonly transaction: Transaction }>;
  };
  readonly onRevokeSendTransfer: {
    (from: AddressString, amount: BigNumber, asset: AddressString, options?: TransactionOptions): Promise<
      TransactionResult<InvokeReceipt<undefined, TestTokenEvent>>
    >;
    readonly confirmed: (
      from: AddressString,
      amount: BigNumber,
      asset: AddressString,
      options?: TransactionOptions & GetOptions,
    ) => Promise<InvokeReceipt<undefined, TestTokenEvent> & { readonly transaction: Transaction }>;
  };
  readonly owner: () => Promise<AddressString>;
  readonly revokeSendTransfer: {
    (from: AddressString, to: AddressString, amount: BigNumber, options?: TransactionOptions): Promise<
      TransactionResult<InvokeReceipt<boolean, TestTokenEvent>>
    >;
    readonly confirmed: (
      from: AddressString,
      to: AddressString,
      amount: BigNumber,
      options?: TransactionOptions & GetOptions,
    ) => Promise<InvokeReceipt<boolean, TestTokenEvent> & { readonly transaction: Transaction }>;
  };
  readonly symbol: () => Promise<string>;
  readonly totalSupply: () => Promise<BigNumber>;
  readonly transfer: {
    (from: AddressString, to: AddressString, amount: BigNumber, options?: TransactionOptions): Promise<
      TransactionResult<InvokeReceipt<boolean, TestTokenEvent>>
    >;
    readonly confirmed: (
      from: AddressString,
      to: AddressString,
      amount: BigNumber,
      options?: TransactionOptions & GetOptions,
    ) => Promise<InvokeReceipt<boolean, TestTokenEvent> & { readonly transaction: Transaction }>;
  };
}

export interface TestTokenMigrationSmartContract {
  readonly approveReceiveTransfer: (
    from: AddressString | Promise<AddressString>,
    amount: BigNumber | Promise<BigNumber>,
    asset: AddressString | Promise<AddressString>,
    options?: TransactionOptions & GetOptions,
  ) => Promise<InvokeReceipt<boolean, TestTokenEvent> & { readonly transaction: Transaction }>;
  readonly approveSendTransfer: (
    from: AddressString | Promise<AddressString>,
    to: AddressString | Promise<AddressString>,
    amount: BigNumber | Promise<BigNumber>,
    options?: TransactionOptions & GetOptions,
  ) => Promise<InvokeReceipt<boolean, TestTokenEvent> & { readonly transaction: Transaction }>;
  readonly approvedTransfer: (
    from: AddressString | Promise<AddressString>,
    to: AddressString | Promise<AddressString>,
  ) => Promise<BigNumber>;
  readonly balanceOf: (address: AddressString | Promise<AddressString>) => Promise<BigNumber>;
  readonly decimals: () => Promise<BigNumber>;
  readonly deploy: (
    owner: AddressString | Promise<AddressString>,
    options?: TransactionOptions & GetOptions,
  ) => Promise<InvokeReceipt<boolean, TestTokenEvent> & { readonly transaction: Transaction }>;
  readonly name: () => Promise<string>;
  readonly onNEP17Payment: (
    from: AddressString | Promise<AddressString>,
    amount: BigNumber | Promise<BigNumber>,
    data: BufferString | Promise<BufferString>,
    options?: TransactionOptions & GetOptions,
  ) => Promise<InvokeReceipt<undefined, TestTokenEvent> & { readonly transaction: Transaction }>;
  readonly onRevokeSendTransfer: (
    from: AddressString | Promise<AddressString>,
    amount: BigNumber | Promise<BigNumber>,
    asset: AddressString | Promise<AddressString>,
    options?: TransactionOptions & GetOptions,
  ) => Promise<InvokeReceipt<undefined, TestTokenEvent> & { readonly transaction: Transaction }>;
  readonly owner: () => Promise<AddressString>;
  readonly revokeSendTransfer: (
    from: AddressString | Promise<AddressString>,
    to: AddressString | Promise<AddressString>,
    amount: BigNumber | Promise<BigNumber>,
    options?: TransactionOptions & GetOptions,
  ) => Promise<InvokeReceipt<boolean, TestTokenEvent> & { readonly transaction: Transaction }>;
  readonly symbol: () => Promise<string>;
  readonly totalSupply: () => Promise<BigNumber>;
  readonly transfer: (
    from: AddressString | Promise<AddressString>,
    to: AddressString | Promise<AddressString>,
    amount: BigNumber | Promise<BigNumber>,
    options?: TransactionOptions & GetOptions,
  ) => Promise<InvokeReceipt<boolean, TestTokenEvent> & { readonly transaction: Transaction }>;
}
