import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function fetchGetWallets(username: string) {
  return axios
    .get(`${process.env.NEXT_PUBLIC_URL}/api/wallet/wallets`, {
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

export const useGetWalletInfo = (username?: string) => {
  return useQuery({
    queryKey: ["wallets", username],
    queryFn: () => (username ? fetchGetWallets(username) : undefined),
    enabled: !!username,
  });
};
