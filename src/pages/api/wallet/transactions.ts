import { NextApiRequest, NextApiResponse } from "next";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const supabase = createServerSupabaseClient({
    req,
    res,
  });

  let { data: transactions, error } = await supabase
    .from("transactions")
    .select("*")
    .eq("username", req.query?.username)
    .order("created_at", {
      ascending: false
    })

  if (transactions) {
    return res.status(200).json(transactions);
  }

  if (error) {
    return res.status(400).json(error);
  }
};
