import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// JWT payload
export type JwtPayload = {
  userId: string;
  role: string;
  email: string;
};

export function verifyAuth(req: Request): JwtPayload | null {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.slice(7);
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded as JwtPayload;
  } catch {
    return null;
  }
}

export function unauthorized(message = "Unauthorized. Please log in.") {
  return NextResponse.json({ message }, { status: 401 });
}
