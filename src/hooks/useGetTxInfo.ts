import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function fetchTransactions(hash: string) {
  return axios
    .get(`${process.env.NEXT_PUBLIC_URL}/api/wallet/tx-info`, {
      params: {
        hash,
      },
    })
    .then((result) => {
      return result?.data;
    })
    .catch((error) => {
      console.log("Error", error);
      throw error;
    });
}

export const useGetTxInfo = (hash?: string) => {
  return useQuery({
    queryKey: ["tx-info", hash],
    queryFn: () => (hash ? fetchTransactions(hash) : undefined),
    enabled: !!hash,
  });
};
