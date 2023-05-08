import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function fetchChangeMintWallet(username: string, public_key: string) {
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
      return error;
    });
}

export const useChangeMintWallet = (username: string, public_key?: string) => {
  return useQuery({
    queryKey: ["change-wallet", username, public_key],
    queryFn: () => (username && public_key ? fetchChangeMintWallet(username, public_key) : undefined),
    enabled: !!public_key,
  });
};
