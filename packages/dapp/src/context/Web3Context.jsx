import { ethers } from 'ethers';
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import Web3 from 'web3';
// import {
//   useConnectModal,
//   useAccountModal,
//   useChainModal,
// } from '@rainbow-me/rainbowkit';

import { theme } from '../theme';
import { SUPPORTED_NETWORKS } from '../utils/constants';
import { getRpcUrl, logError } from '../utils/helpers';

// const web3Modal = new Web3Modal({
//   cacheProvider: true,
//   providerOptions,
//   theme: {
//     background: theme.colors.background,
//     main: theme.colors.red[500],
//     secondary: theme.colors.white,
//     hover: theme.colors.black30,
//   },
// });

export const Web3Context = createContext();
export const useWeb3 = () => useContext(Web3Context);

export const Web3ContextProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [{ account, provider, chainId }, setWeb3] = useState({});

  const setWeb3Provider = async (prov, initialCall = false) => {
    console.log('setWeb3Provider prov: ', prov);
    if (!prov) return;
    if (prov) {
      const web3Provider = new Web3(prov);
      const gotProvider = new ethers.providers.Web3Provider(
        web3Provider.currentProvider,
      );
      const gotChainId = Number(prov.chain.id);
      if (initialCall) {
        const signer = gotProvider.getSigner();
        console.log('signer: ', signer);
        const gotAccount = await signer.getAddress();
        console.log('gotAccount: ', gotAccount);
        console.log('gotChainId: ', gotChainId);

        setWeb3({
          provider: gotProvider,
          chainId: gotChainId,
          account: gotAccount,
        });
      } else {
        setWeb3(_provider => ({
          ..._provider,
          provider: gotProvider,
          chainId: gotChainId,
        }));
      }
    }
  };

  useEffect(() => {
    if (SUPPORTED_NETWORKS.indexOf(chainId) === -1) {
      // TODO show error alert that invalid network is connected
    }
  }, [chainId]);

  const connectWeb3 = useCallback(async provider => {
    console.log('connect web3 called provider: ', provider);
    try {
      setLoading(true);
      // const modalProvider = await web3Modal.requestProvider();

      await setWeb3Provider(provider, true);

      const isGnosisSafe = !!provider.safe;
      console.log('isGnosisSafe: ', isGnosisSafe, provider.safe);

      // if (!isGnosisSafe) {
      // provider.on('accountsChanged', accounts => {
      //   setWeb3(_provider => ({
      //     ..._provider,
      //     account: accounts[0],
      //   }));
      // });
      // provider.on('chainChanged', () => {
      //   setWeb3Provider(provider);
      // });
      // }
      // setWeb3(({
      //   ...provider,
      // }));
    } catch (web3ModalError) {
      logError({ web3ModalError });
      throw web3ModalError;
    } finally {
      setLoading(false);
    }
  }, []);

  const disconnect = useCallback(async () => {
    // web3Modal.clearCachedProvider();
    setWeb3({});
  }, []);

  // useEffect(() => {
  //   if (window.ethereum) {
  //     window.ethereum.autoRefreshOnNetworkChange = false;
  //   }
  //   (async function load() {
  //     if ((await web3Modal.canAutoConnect()) || web3Modal.cachedProvider) {
  //       connectWeb3();
  //     } else {
  //       setLoading(false);
  //     }
  //   })();
  // }, [connectWeb3]);

  return (
    <Web3Context.Provider
      value={{
        loading,
        account,
        provider,
        chainId,
        connectAccount: connectWeb3,
        disconnect,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
