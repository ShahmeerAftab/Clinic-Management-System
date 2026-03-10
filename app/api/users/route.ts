import { connectdb } from "@/lib/mongodb";
import User from "@/models/user";
import { NextResponse } from "next/server";
import { verifyAuth, unauthorized } from "@/lib/auth";

export const GET = async (req: Request) => {
  const user = verifyAuth(req);
  if (!user) return unauthorized();

  await connectdb();

  const url = new URL(req.url);
  const role = url.searchParams.get("role");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const filter: Record<string, any> = {};
  if (role) filter.role = role;

  // never expose password hashes
  const users = await User.find(filter)
    .select("name email role specialization")
    .lean();

  return NextResponse.json(users);
};
