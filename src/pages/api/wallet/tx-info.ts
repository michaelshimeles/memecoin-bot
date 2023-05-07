import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const response = await fetch(`https://protect.flashbots.net/tx/${req.query?.hash}`);
    const data = await response.json();
    return res.status(200).json(data);
  } catch (err) {
    console.error(err);
    return res.status(400).json(err);
  }
};
