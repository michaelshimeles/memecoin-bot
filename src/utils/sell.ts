import Web3 from "web3";
import { TransactionConfig } from "web3-core";
// import qs from "qs";
import { ERC20TokenContract } from "@0x/contract-wrappers";
import { BigNumber } from "ethers";

const URL = "https://api.0x.org/swap/v1/quote?";
const headers = { "0x-api-key": "e6ed53c0-9703-4ca8-8a8b-f0dbb2a50542" }; // This is a placeholder. Get your live API key from the 0x Dashboard (https://dashboard.0x.org/apps)

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
  )
);

const MAINNET_CHAIN_ID = 1;

export const sell = async (
  sellTokenAddress: string,
  gwei: string,
  amountToken: any,
  address: string,
  privateKey: string
) => {
  // const exchangeList = "Uniswap_V2";
  // console.log("sellTokenAddress", sellTokenAddress);
  // const params = {
  //   buyToken: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",
  //   sellToken: sellTokenAddress,
  //   sellAmount: Math.floor(Number.parseFloat(amountToken) * Math.pow(10, 18)),
  //   includedSources: exchangeList,
  //   takerAddress: address,
  //   slippagePercentage: 1, // set slippage to 100%
  // };
  // console.log("Params", params);
  // let response;
  // try {
  //   response = await fetch(`${URL}${qs.stringify(params)}`, { headers });
  //   const json = await response.json();
  //   console.log("RES RES", json);
  //   const tokenAddress = sellTokenAddress;
  //   const tokenContract = new ERC20TokenContract(
  //     tokenAddress,
  //     web3.eth.currentProvider
  //   );
  //   console.log("tokenContract", tokenContract);
  //   const maxApproval = BigNumber.from(2).pow(256).sub(1);
  //   console.log("maxApproval", maxApproval);
  //   const approvalTxData = tokenContract
  //     .approve(json.allowanceTarget, maxApproval)
  //     .getABIEncodedTransactionData();
  //   console.log("approvalTxData", approvalTxData);
  //   await web3.eth.sendTransaction(approvalTxData);
  //   const txConfig: TransactionConfig = {
  //     to: json?.to,
  //     from: address,
  //     value: json?.value,
  //     gas: json?.gas,
  //     gasPrice: web3.utils.toWei(gwei, "gwei"), // set gas price to 30 Gwei
  //     data: json?.data,
  //     chainId: MAINNET_CHAIN_ID, // set the chain id to Ethereum mainnet network id
  //   };
  //   const signedTx = await web3.eth.accounts.signTransaction(
  //     txConfig,
  //     privateKey
  //   );
  //   console.log("signedTx", signedTx);
  //   try {
  //     const txHash = await sendTransaction(signedTx.rawTransaction ?? "");
  //     console.log("Transaction sent to Flashbots with hash", txHash);
  //     return txHash;
  //   } catch (err) {
  //     console.error(`Error sending transaction to Flashbots: ${err}`);
  //     return err;
  //   }
  // } catch (err: any) {
  //   console.error(err);
  //   throw err?.response?.data?.reason;
  // }
};

export const sendTransaction = async (signedTx: string): Promise<string> => {
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
          debug: true, // add debug field to return extra transaction details
        },
      ],
    }),
  };

  try {
    const response = await fetch(
      `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
      options
    );
    const data = await response.json();

    // console.log("Data", data);
    // Wait for the transaction to be mined
    const txHash = data.result;
    let receipt = await web3.eth.getTransactionReceipt(txHash);
    while (receipt == null) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      receipt = await web3.eth.getTransactionReceipt(txHash);
    }

    return txHash;
  } catch (err) {
    console.error(`Error sending transaction to Flashbots: ${err}`);
    throw err;
  }
};
