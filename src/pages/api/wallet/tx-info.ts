import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  fetch(`https://protect.flashbots.net/tx/${req.query?.hash}`)
    .then((response) => response.json())
    .then((response) => {
      return res.status(200).json(response);
    })
    .catch((err) => {
      console.error(err);
      return res.status(400).json(err);
    });
  return;
};
