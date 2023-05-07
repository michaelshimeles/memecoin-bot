import Web3 from "web3";
import { TransactionConfig } from "web3-core";

const { default: axios } = require("axios");
const qs = require("qs");

const URL = "https://api.0x.org/swap/v1/quote?";
const headers = { "0x-api-key": process.env.NEXT_PUBLIC_0X }; 

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
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

  const exchangeList = "Uniswap, Uniswap_V2, Uniswap_V3";
  const params = {
    buyToken,
    sellToken: "ETH",
    sellAmount: Number.parseFloat(amountEth) * Math.pow(10, 18),
    // includedSources: exchangeList,
    takerAddress: address,
    buyTokenPercentageFee: 0.01,
    feeRecipient: "0x944C9EF3Ca71E710388733E6C57974e8923A9020",
    slippagePercentage: 1, // set slippage to 100%
  };

  let response;
  const gasPrice = await web3.eth.getGasPrice();
  const currentNonce = await web3.eth.getTransactionCount(address);

  console.log("gasPrice", gasPrice);

  try {
    response = await axios.get(`${URL}${qs.stringify(params)}`, { headers });
    console.log("RES RES", response?.data);

    const txConfig: TransactionConfig = {
      from: address,
      to: response?.data?.to,
      value: response?.data?.value,
      gas: response?.data?.gas,
      maxFeePerGas: web3.utils.toWei("300", "gwei"), // set max fee per gas to 300 Gwei
      maxPriorityFeePerGas: Number(gwei),
      chainId: MAINNET_CHAIN_ID,
      nonce: currentNonce,
    };

    console.log("maxFeePerGas", web3.utils.toWei("300", "gwei"));
    console.log("maxPriorityFeePerGas", Number(gwei));
    const signedTx = await web3.eth.accounts.signTransaction(
      txConfig,
      privateKey
    );

    try {
      const txHash = await sendTransaction(signedTx.rawTransaction ?? "");
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
          maxBlockNumber: maxBlockNumberHex, // replace with the highest block number in which the transaction should be included, in hex format
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
    return data.result;
  } catch (err) {
    console.error(err);
    throw err;
  }
};
