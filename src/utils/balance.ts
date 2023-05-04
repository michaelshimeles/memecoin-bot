import { ethers } from "ethers";

export const getBalance = (address: string) => {
  const network = "homestead"; // use Ethereum mainnet
  const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_ID; // replace with your Alchemy API key
  const provider = new ethers.providers.AlchemyProvider(network, apiKey);

  return provider.getBalance(address).then((balance) => {
    // convert a currency unit from wei to ether
    const balanceInEth = ethers.utils.formatEther(balance);

    return balanceInEth;
  });
};
