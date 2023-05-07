import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function fetchTokenInfo(tokenAddress: string) {
  return axios
    .get(`${process.env.NEXT_PUBLIC_URL}/api/token-info`, {
      params: {
        tokenAddress,
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

export const useGetTokenInfo = (tokenAddress: string) => {
  return useQuery({
    queryKey: ["token-info", tokenAddress],
    queryFn: () => fetchTokenInfo(tokenAddress),
  });
};
