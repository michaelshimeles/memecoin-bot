// import { NextApiRequest, NextApiResponse } from "next";
// import { ethers } from "ethers";

// export default async (req: NextApiRequest, res: NextApiResponse) => {

//   const network = "homestead"; // use Ethereum mainnet
//   const provider = ethers.getDefaultProvider(network);

//   return provider
//     .getBalance(req.query.address)
//     .then((balance) => {
//       // convert a currency unit from wei to ether
//       const balanceInEth = ethers.utils.formatEther(balance);
//       console.log(`balance: ${balanceInEth} ETH`);

//       return res.status(200).json(balanceInEth);
//     })
//     .catch((error) => {
//       return res.status(400).json(error);
//     });
// };
