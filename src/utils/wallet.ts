import { ethers } from "ethers";

export const createWallets = () => {
  const wallet = ethers.Wallet.createRandom();

  // console.log("address:", wallet.address);
  // console.log("mnemonic:", wallet.mnemonic.phrase);
  // console.log("privateKey:", wallet.privateKey);

  return {
    address: wallet.address,
    private_key: wallet.privateKey,
  };
};
