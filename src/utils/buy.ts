import Web3 from "web3";
import { TransactionConfig } from "web3-core";

const { default: axios } = require("axios");
const qs = require("qs");

const URL = "https://api.0x.org/swap/v1/quote?";
const headers = { "0x-api-key": "e6ed53c0-9703-4ca8-8a8b-f0dbb2a50542" }; // This is a placeholder. Get your live API key from the 0x Dashboard (https://dashboard.0x.org/apps)

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://eth-mainnet.alchemyapi.io/v2/I_sxcii5QK4RlyRpojPokYW8_WuC0i7d"
  )
);

const MAINNET_CHAIN_ID = 1;

export const realTx = async (
  buyToken: string,
  gwei: string,
  amountEth: any,
  address: string,
  privateKey: string
) => {
  console.log("buyToken", buyToken);
  console.log("gwei", gwei);
  console.log("amountEth", amountEth);
  console.log("address", address);
  console.log("privateKey", privateKey);

  const exchangeList = "Uniswap_V2";
  const params = {
    buyToken,
    sellToken: "ETH",
    sellAmount: Number.parseFloat(amountEth) * Math.pow(10, 18),
    includedSources: exchangeList,
    takerAddress: address,
    // slippagePercentage: 1,
  };

  let response;

  try {
    response = await axios.get(`${URL}${qs.stringify(params)}`, { headers });

    const txConfig: TransactionConfig = {
      to: response?.data?.to,
      from: address,
      value: response?.data?.value,
      gas: response?.data?.gas,
      gasPrice: web3.utils.toWei(gwei, "gwei"), // set gas price to 30 Gwei
      data: response?.data?.data,
      chainId: MAINNET_CHAIN_ID, // set the chain id to Ethereum mainnet network id
    };

    const signedTx = await web3.eth.accounts.signTransaction(
      txConfig,
      privateKey
    );

    console.log("signedTx", signedTx);

    try {
      const txHash = await sendTransactionToFlashbots(
        signedTx.rawTransaction ?? ""
      );
      console.log("Transaction sent to Flashbots with hash", txHash);

      return txHash;
    } catch (err) {
      console.error(`Error sending transaction to Flashbots: ${err}`);
      return err;
    }
  } catch (err: any) {
    console.error(err);
    throw err?.response?.data?.reason;
  }
};

const sendTransactionToFlashbots = async (signedTx: string) => {
  const flashbotsRelayEndpoint = "https://relay.flashbots.net";
  const response = await axios.post(flashbotsRelayEndpoint, {
    method: "eth_sendBundle",
    params: [signedTx],
    id: 1,
  });

  return response.data.result;
};
