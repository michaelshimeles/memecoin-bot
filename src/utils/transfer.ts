import { ethers } from "ethers";

export const sweep = async (privateKey: string, newAddress: string) => {
  const network = "homestead"; // use Ethereum mainnet

  const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_ID; // replace with your Alchemy API key
  const provider = new ethers.providers.AlchemyProvider(network, apiKey);

  let wallet = new ethers.Wallet(privateKey, provider);

  // Make sure we are sweeping to an EOA, not a contract. The gas required
  // to send to a contract cannot be certain, so we may leave dust behind
  // or not set a high enough gas limit, in which case the transaction will
  // fail.
  let code = await provider.getCode(newAddress);
  if (code !== "0x") {
    throw new Error("Cannot sweep to a contract");
  }

  // Get the current balance
  let balance = await wallet.getBalance();

  // Normally we would let the Wallet populate this for us, but we
  // need to compute EXACTLY how much value to send
  let gasPrice = await provider.getGasPrice();

  // The exact cost (in gas) to send to an Externally Owned Account (EOA)
  let gasLimit = 21000;

  // The balance less exactly the txfee in wei
  let value = balance.sub(gasPrice.mul(gasLimit));

  try {
    let tx = await wallet.sendTransaction({
      gasLimit: gasLimit,
      gasPrice: gasPrice,
      to: newAddress,
      value: value,
    });
    console.log("Sent in Transaction: " + tx.hash);
    return tx.hash;
  } catch (error: any) {
    throw error?.response;
  }
};
