import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      authorization:
        `Basic ${process.env.NEXT_PUBLIC_ZERION}`,
    },
  };

  try {
    const response = await fetch(
      `https://api.zerion.io/v1/wallets/${req?.query?.address}/positions/`,
      options
    );
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json(err);
  }
}
