/**
 * lib/auth.ts — Server-side JWT verification helper
 *
 * Used by all protected API routes to verify that the request
 * includes a valid "Authorization: Bearer <token>" header.
 */

import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

// Shape of the data we store inside each JWT
export type JwtPayload = {
  userId: string;
  role: string;
  email: string;
};

/**
 * Reads the Authorization header from the request, verifies the JWT,
 * and returns the decoded payload.
 *
 * Returns null if:
 *  - The header is missing or not in "Bearer <token>" format
 *  - The token is expired or has an invalid signature
 */
export function verifyAuth(req: Request): JwtPayload | null {
  const authHeader = req.headers.get("Authorization");

  // Check header format
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;

  // Strip "Bearer " prefix to get the raw token string
  const token = authHeader.slice(7);

  try {
    // jwt.verify throws if the token is invalid or expired
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
    return decoded as JwtPayload;
  } catch {
    return null; // Invalid or expired token
  }
}

/**
 * Returns a standard 401 Unauthorized JSON response.
 * Call this from any API route when verifyAuth() returns null.
 */
export function unauthorized(message = "Unauthorized. Please log in.") {
  return NextResponse.json({ message }, { status: 401 });
}
