import {
    Address,
    constant,
    Contract,
    createEventNotifier,
    Fixed,
    MapStorage,
    SmartContract,
  } from '@neo-one/smart-contract';
  
  interface TokenPayableContract {
    readonly approveReceiveTransfer: (from: Address, amount: Fixed<0>, asset: Address) => boolean;
    readonly onRevokeSendTransfer: (from: Address, amount: Fixed<0>, asset: Address) => void;
    readonly onNEP17Payment: (from: Address, amount: Fixed<0>) => void;
  }
  
  export class TestToken extends SmartContract {
    public readonly owner: Address;
    public readonly name: string = 'TestToken';
    public readonly decimals: 8 = 8;
    public readonly symbol: string = 'TT';
    public readonly properties = {
      trusts: '*',
      groups: [],
      permissions: [],
    };
  
    public constructor(owner: Address) {
      super();
      if (!Address.isCaller(owner)) {
        throw new Error('Sender was not the owner.');
      }
      this.owner = owner;
      this.issue(owner, 100_00000000);
    }
  
    private readonly balances = MapStorage.for<Address, Fixed<8>>();
    private readonly approvedTransfers = MapStorage.for<[Address, Address], Fixed<8>>();
    private mutableSupply: Fixed<8> = 0;
  
    private readonly notifyTransfer = createEventNotifier<Address | undefined, Address | undefined, Fixed<8>>(
      'Transfer',
      'from',
      'to',
      'amount',
    );
    private readonly notifyApproveSendTransfer = createEventNotifier<Address, Address, Fixed<8>>(
      'approveSendTransfer',
      'from',
      'to',
      'amount',
    );
    private readonly notifyRevokeSendTransfer = createEventNotifier<Address, Address, Fixed<8>>(
      'revokeSendTransfer',
      'from',
      'to',
      'amount',
    );
  
    @constant
    public get totalSupply(): Fixed<8> {
      return this.mutableSupply;
    }
  
    @constant
    public balanceOf(address: Address): Fixed<8> {
      const balance = this.balances.get(address);
  
      return balance === undefined ? 0 : balance;
    }
  
    @constant
    public approvedTransfer(from: Address, to: Address): Fixed<8> {
      const approved = this.approvedTransfers.get([from, to]);
  
      return approved === undefined ? 0 : approved;
    }
  
    public transfer(from: Address, to: Address, amount: Fixed<8>): boolean {
      if (amount < 0) {
        throw new Error(`Amount must be greater than 0: ${amount}`);
      }
  
      const fromBalance = this.balanceOf(from);
      if (fromBalance < amount) {
        return false;
      }
  
      const approved = this.approvedTransfer(from, to);
      const reduceApproved = approved >= amount && Address.isCaller(to);
      if (!reduceApproved && !Address.isCaller(from)) {
        return false;
      }
  
      const contract = Contract.for(to);
      if (contract !== undefined && !Address.isCaller(to)) {
        const smartContract = SmartContract.for<TokenPayableContract>(to);
        if (!smartContract.approveReceiveTransfer(from, amount, this.address)) {
          return false;
        }
      }
  
      const toBalance = this.balanceOf(to);
      this.balances.set(from, fromBalance - amount);
      this.balances.set(to, toBalance + amount);
      this.notifyTransfer(from, to, amount);
      if (contract !== undefined) {
        const smartContract = SmartContract.for<TokenPayableContract>(to);
        smartContract.onNEP17Payment(from, amount);
      }
  
      if (reduceApproved) {
        this.approvedTransfers.set([from, to], approved - amount);
      }
  
      return true;
    }
  
    public approveSendTransfer(from: Address, to: Address, amount: Fixed<8>): boolean {
      if (amount < 0) {
        throw new Error(`Amount must be greater than 0: ${amount}`);
      }
  
      if (!Address.isCaller(from)) {
        return false;
      }
  
      this.approvedTransfers.set([from, to], this.approvedTransfer(from, to) + amount);
      this.notifyApproveSendTransfer(from, to, amount);
  
      return true;
    }
  
    public approveReceiveTransfer(_from: Address, _amount: Fixed<8>, _asset: Address): boolean {
      return false;
    }
  
    public onNEP17Payment(_from: Address, _amount: Fixed<8>, _data: Buffer): void {
      throw new Error('This contract cannot receive transfers');
    }
  
    public revokeSendTransfer(from: Address, to: Address, amount: Fixed<8>): boolean {
      if (amount < 0) {
        throw new Error(`Amount must be greater than 0: ${amount}`);
      }
  
      if (!Address.isCaller(from)) {
        return false;
      }
  
      const approved = this.approvedTransfer(from, to);
      if (approved < amount) {
        return false;
      }
  
      this.approvedTransfers.set([from, to], approved - amount);
      this.notifyRevokeSendTransfer(from, to, amount);
  
      const contract = Contract.for(to);
      if (contract !== undefined) {
        const smartContract = SmartContract.for<TokenPayableContract>(to);
        // NOTE: This should catch errors once we have stack isolation
        smartContract.onRevokeSendTransfer(from, amount, this.address);
      }
  
      return true;
    }
  
    public onRevokeSendTransfer(_from: Address, _amount: Fixed<8>, _asset: Address): void {
      // do nothing
    }
  
    protected issue(addr: Address, amount: Fixed<8>): void {
      this.balances.set(addr, this.balanceOf(addr) + amount);
      this.mutableSupply += amount;
      this.notifyTransfer(undefined, addr, amount);
    }
  
    protected burn(addr: Address, amount: Fixed<8>): boolean {
      const balance = this.balanceOf(addr);
      if (balance < amount) {
        return false;
      }
  
      this.balances.set(addr, balance - amount);
      this.mutableSupply -= amount;
      this.notifyTransfer(addr, undefined, amount);
  
      return true;
    }
  }
  