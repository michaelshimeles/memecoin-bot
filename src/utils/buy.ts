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
  // console.log("buyToken", buyToken);
  // console.log("gwei", gwei);
  // console.log("amountEth", amountEth);
  // console.log("address", address);
  // console.log("privateKey", privateKey);

  const exchangeList = "Uniswap_V2";
  const params = {
    buyToken,
    sellToken: "ETH",
    sellAmount: Number.parseFloat(amountEth) * Math.pow(10, 18),
    includedSources: exchangeList,
    takerAddress: address,
    slippagePercentage: 1, // set slippage to 100%
  };

  let response;

  try {
    response = await axios.get(`${URL}${qs.stringify(params)}`, { headers });
    // console.log("RES RES", response?.data);

    const txConfig: TransactionConfig = {
      from: address,
      to: response?.data?.to,
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

    // console.log("signedTx", signedTx);

    try {
      const txHash = await sendTransaction(
        signedTx.rawTransaction ?? "",
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

const sendTransaction = async (signedTx: string) => {
  const latestBlockNumber = await web3.eth.getBlockNumber();
  const maxBlockNumber = latestBlockNumber + 10;
  const maxBlockNumberHex = "0x" + maxBlockNumber.toString(16);

  const options = {
    method: "POST",
    headers: { accept: "application/json", "content-type": "application/json" },
    body: JSON.stringify({
      jsonrpc: "2.0",
      id: 1,
      method: "eth_sendPrivateTransaction",
      params: [
        {
          tx: signedTx, // replace with the raw signed transaction hex string
          maxBlockNumber:maxBlockNumberHex, // replace with the highest block number in which the transaction should be included, in hex format
          debug: true, // add debug field to return extra transaction details
        },
      ],
    }),
  };
  try {
    const response = await fetch(
      `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
      options
    );
    const data = await response.json();
    // console.log(data);
    return data.result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
