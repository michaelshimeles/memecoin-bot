import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      authorization:
        "Basic emtfZGV2XzFmZjFhN2M0NjM4MTQ0YzZhY2MyZWRjOGFkNzI3ZmRkOg==",
    },
  };

  fetch(
    `https://api.zerion.io/v1/wallets/${req?.query?.address}/positions/`,
    options
  )
    .then((response) => response.json())
    .then((response) => res.status(200).json(response))
    .catch((err) => res.status(400).json(err));
};
