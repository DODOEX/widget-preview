import { TonConnect } from "@tonconnect/sdk";
import { TonConnectUI } from "@tonconnect/ui";
import { StaticJsonRpcProvider } from "@ethersproject/providers";
import { getHttpEndpoint } from "@orbs-network/ton-access";

export async function createProvider() {
  const rpcUrl = await getHttpEndpoint();
  const connector = new TonConnect();
  const tonConnectUI = new TonConnectUI({
    connector,
  });
  connector.restoreConnection();

  class TonProvider extends StaticJsonRpcProvider {
    constructor() {
      super(rpcUrl);
      // this._network = {
      //   name: connector.account?.chain.
      // }
    }

    public async connect() {
      await tonConnectUI.openModal();
    }

    public async disconnect() {
      await connector.disconnect();
    }

    public async listAccounts() {
      const account = connector.account;
      const accounts = account?.address ? [account?.address] : [];
      return accounts;
    }

    public getAddress() {
      const account = connector.account;
      return Promise.resolve(account?.address ? account?.address : null);
    }
  }

  const provider = new TonProvider();
  return provider;
}
