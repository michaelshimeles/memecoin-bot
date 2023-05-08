// import { createAlchemyWeb3 } from "@alch/alchemy-web3";

// export const getPendingTokenTransactions = async (tokenAddress: string) => {
//   try {
//     // Create a new web3 instance with Alchemy provider
//     const web3 = createAlchemyWeb3(
//       `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`
//     );

//     // Get the latest block number
//     const blockNumber = await web3.eth.getBlockNumber();

//     console.log("blockNumber", blockNumber);
//     // Get the pending transactions for the latest 100 blocks
//     const pendingTransactions = await Promise.all(
//       Array(Math.min(100, blockNumber))
//         .fill(null)
//         .map((_, i) => web3.eth.getBlock(blockNumber - i, true))
//     ).then((blocks) => {
//       blocks
//         .filter((block) => block.transactions.length > 0)
//         .map((block) =>
//           block.transactions.filter((transaction) => {
//             transaction.to === tokenAddress;

//             console.log("transaction", transaction);

//           })
//         )
//         .flat();
//     });

//     console.log("pendingTransactions", pendingTransactions);

//     // Return the transaction details in a readable format
//     return Promise.all(
//       pendingTransactions?.map(async (transaction: any) => {
//         const transactionDetails = await web3.eth.getTransaction(
//           transaction.hash
//         );
//         console.log("transactionDetails", transactionDetails);
//         return {
//           from: transactionDetails.from,
//           to: transactionDetails.to,
//           value: web3.utils.fromWei(transactionDetails.value, "ether"),
//           gasPrice: web3.utils.fromWei(transactionDetails.gasPrice, "gwei"),
//           gas: transactionDetails.gas,
//           nonce: transactionDetails.nonce,
//           hash: transactionDetails.hash,
//         };
//       })
//     );
//   } catch (error) {
//     console.error(error);
//   }
// };
