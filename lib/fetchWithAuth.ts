/**
 * lib/fetchWithAuth.ts — Client-side fetch wrapper
 *
 * A drop-in replacement for fetch() that automatically:
 *  1. Reads the JWT from localStorage (saved at login time)
 *  2. Adds it as an "Authorization: Bearer <token>" header
 *  3. If the server returns 401, clears localStorage and redirects to /login
 *
 * Usage: replace `fetch(url, options)` with `fetchWithAuth(url, options)`
 */

export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Step 1: Get the token saved when the user logged in
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // Step 2: Build headers — keep any existing headers and add Authorization
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Step 3: Make the actual request
  const res = await fetch(url, { ...options, headers });

  // Step 4: If the server rejects our token (expired/invalid), log the user out
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    window.location.href = "/login";
  }

  return res;
}
