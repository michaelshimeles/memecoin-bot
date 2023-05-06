import { useQuery } from "@tanstack/react-query";
import axios from "axios";

function fetchGasPrice() {
  return axios
    .get(`${process.env.NEXT_PUBLIC_URL}/api/gas`)
    .then((result) => {
      return result?.data;
    })
    .catch((error) => {
      console.log("Error", error);
      throw error;
    });
}

export const useGasPrice = () => {
  return useQuery({
    queryKey: ["gas-price"],
    queryFn: () => fetchGasPrice(),
  });
};
