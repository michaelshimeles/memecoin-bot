import Web3 from "web3";

export const sweep = async (
  privateKey: any,
  newAddress: any,
  tokenAddress: any,
  amount: any
) => {
  // Use Ethereum mainnet
  const network = "mainnet";
  const rpcUrl = `https://eth-mainnet.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`; // replace with your Alchemy API URL
  const web3 = new Web3(rpcUrl);

  const tokenContract = new web3.eth.Contract(
    [
      // ABI of the ERC-20 token contract
      {
        inputs: [
          {
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "transfer",
        outputs: [
          {
            internalType: "bool",
            name: "",
            type: "bool",
          },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "account",
            type: "address",
          },
        ],
        name: "balanceOf",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
    ],
    tokenAddress
  );

  // Get the account object from the private key
  const account = web3.eth.accounts.privateKeyToAccount(privateKey);

  // Get the current token balance for the account
  const tokenBalance = await tokenContract.methods.balanceOf(account.address).call();

  // Make sure we are transferring to an EOA, not a contract. The gas required
  // to send to a contract cannot be certain, so we may leave dust behind
  // or not set a high enough gas limit, in which case the transaction will
  // fail.
  const code = await web3.eth.getCode(newAddress);
  if (code !== "0x") {
    throw new Error("Cannot transfer to a contract");
  }

  // The exact cost (in gas) to transfer tokens to an Externally Owned Account (EOA)
  const gasLimit = 100000;

  // The gas price
  const gasPrice = await web3.eth.getGasPrice();

  // The total cost (in gas) of the transaction
  const txCost = gasLimit * gasPrice;

  // Check if the token balance is sufficient to transfer the amount with gas fee
  if (tokenBalance < amount) {
    throw new Error("Insufficient balance");
   }

  try {
    // Transfer the tokens
    const tx = await tokenContract.methods.transfer(newAddress, amount).send({
      from: privateKey,
      gas: gasLimit,
      gasPrice: gasPrice,
    });

    console.log("Sent in Transaction: " + tx.transactionHash);
    return tx.transactionHash;
  } catch (error) {
    throw error;
  }
};
