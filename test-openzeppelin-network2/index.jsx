import React, { useState, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { Web3Context, useWeb3Injected, useEphemeralKey } from '@openzeppelin/network';

function App() {
  const signKey = useEphemeralKey();
  const web3Context = useWeb3Injected({ gsn: { signKey } });

  useEffect(() => {
    web3Context.requestAuth()
  }, []);

  const [connected, _setConnected] = useState(false);
  const setConnected = useCallback(name => _setConnected(name), []);

  const [accounts, _setAccounts] = useState(false);
  const setAccounts = useCallback(name => _setAccounts(name), []);

  useEffect(() => {
    web3Context.on(Web3Context.ConnectionChangedEventName, setConnected);
    web3Context.on(Web3Context.AccountsChangedEventName, setAccounts);
    return () => {
      web3Context.off(Web3Context.ConnectionChangedEventName, setConnected);
      web3Context.off(Web3Context.AccountsChangedEventName, setAccounts);
    };
  }, [web3Context]);

  const account = Array.isArray(accounts) && accounts.length > 0
    ? accounts[0]
    : undefined;

  if (connected) {
    return <div>
      <p> { account } </p>
      <Balance web3Context={ web3Context } account={ account } />
    </div>;
  } else {
    return <div>Loading...</div>;
  }
}

function Balance(props) {
  const { web3Context, account } = props;

  const [balance, setBalance] = useState();

  useEffect(() => {
    setBalance(undefined);
    if (account !== undefined) {
      web3Context.lib.eth.getBalance(account).then(setBalance);
    }
  }, [account]);

  if (balance === undefined) {
    return <span>Querying balance...</span>
  } else {
    return <span>{ balance }</span>;
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
);
