import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/tokens/${req.query?.tokenAddress}`
    );
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    return res.status(400).json(err);
  }
}
