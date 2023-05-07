import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function fetchMintWallet(username: string) {
  return axios
    .get(`${process.env.NEXT_PUBLIC_URL}/api/wallet/mint`, {
      params: {
        username,
      },
    })
    .then((result) => {
      return result?.data;
    })
    .catch((error) => {
      throw error;
    });
}

export const useGetMintWalletInfo = (username?: string) => {
  return useQuery({
    queryKey: ["mint-wallet", username],
    queryFn: () => (username ? fetchMintWallet(username) : undefined),
    enabled: !!username,
  });
};
