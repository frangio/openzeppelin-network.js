import { Provider } from 'web3/providers';
import { mocked } from 'ts-jest/utils';

import { fromConnection, fromInjected } from './factory';
import Web3Context from './Web3Context';

jest.mock('./Web3Context');

const localConnection = 'http://localhost:7545';
const mockedWeb3Context = mocked(Web3Context);

describe('fromConnection function', (): void => {
  it('creates Web3 context from connection', async (): Promise<void> => {
    const context = await fromConnection(localConnection);

    expect(context).not.toBeNull();
    expect(mockedWeb3Context).toHaveBeenCalled();
    const web3ContextInstance = mocked(Web3Context).mock.instances[0];
    expect(web3ContextInstance.poll).toHaveBeenCalled();
    expect(web3ContextInstance.startPoll).toHaveBeenCalled();
  });
});

describe('fromInjected function', (): void => {
  it('creates Web3 context from injected provider', async (): Promise<void> => {
    const provider = {};
    window.ethereum = provider as Provider;

    const context = await fromInjected();

    expect(context).not.toBeNull();
    expect(mockedWeb3Context).toHaveBeenCalledWith(window.ethereum, undefined);
    const web3ContextInstance = mocked(Web3Context).mock.instances[0];
    expect(web3ContextInstance.poll).toHaveBeenCalled();
    expect(web3ContextInstance.startPoll).toHaveBeenCalled();

    delete window.ethereum;
  });

  it('fails if there is no injected provider', async (): Promise<void> => {
    const context = await fromInjected();

    expect(context).toBeNull();
  });
});
