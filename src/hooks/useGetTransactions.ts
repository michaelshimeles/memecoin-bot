import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function fetchTransactions(username: string) {
  return axios
    .get(`${process.env.NEXT_PUBLIC_URL}/api/wallet/transactions`, {
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

export const useGetTransactions = (username?: string) => {
  return useQuery({
    queryKey: ["transactions", username],
    queryFn: () => (username ? fetchTransactions(username) : undefined),
    enabled: !!username,
  });
};
