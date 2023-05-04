import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const supabase = createServerSupabaseClient({
    req,
    res,
  });

  const { data: wallets, error } = await supabase
    .from("wallets")
    .select()
    .eq("username", req.query?.username)
    .order("active", { ascending: true });

  if (wallets) {
    return res.status(200).json(wallets);
  }

  if (error) {
    return res.status(400).json(error);
  }
};
