// import type { NextApiRequest, NextApiResponse } from "next";
// import axios from "axios";

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//     console.log("Req", req.query)
//   try {
//     const response = await axios.get("https://api.honeypot.is/v2/IsHoneypot", {
//       params: {
//         address: req.query.address,
//       },
//       //   headers: {
//       //     "X-API-KEY": "{APIKEY}",
//       //   },
//     });

//     console.log("API", response?.data)
//     return res.status(200).json(response?.data);
//   } catch (err) {
//     res.status(400).json(err);
//   }
// }
