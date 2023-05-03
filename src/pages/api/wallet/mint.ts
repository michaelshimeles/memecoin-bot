import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const supabase = createServerSupabaseClient({
    req,
    res,
  });

  let { data: walletInfo, error } = await supabase
    .from("wallet")
    .select("*")
    .eq("username", req.query?.username);

  if (walletInfo) {
    return res.status(200).json(walletInfo[0]);
  }

  if (error) {
    return res.status(400).json(error);
  }
};
