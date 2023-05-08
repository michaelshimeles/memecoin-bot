import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function fetchPortfolio(address: string) {
  return axios
    .get(`${process.env.NEXT_PUBLIC_URL}/api/wallet/portfolio`, {
      params: {
        address,
      },
    })
    .then((result) => {
      return result?.data;
    })
    .catch((error) => {
      return error;
    });
}

export const usePortfolio = (address?: string) => {
  return useQuery({
    queryKey: ["portfolio", address],
    queryFn: () => (address ? fetchPortfolio(address) : undefined),
    enabled: !!address,
  });
};
