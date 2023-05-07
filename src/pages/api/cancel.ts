import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: 1,
        jsonrpc: "2.0",
        method: "eth_cancelPrivateTransaction",
        params: [{ txHash: req.query.hash }],
      }),
    };

    const response = await fetch(
      `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ID}`,
      options
    );
    const data = await response.json();

    console.log(data);
    return res.status(200).json(data);
  } catch (error) {
    console.error(error);
    return res.status(400).json(error);
  }
};
