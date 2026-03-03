// This is the root page — it lives at the "/" route.
// We don't show anything here. We just immediately send the
// user to the login page at "/login".
//
// `redirect` is a Next.js built-in function for server-side redirects.
// No "use client" needed here because redirect works on the server.

import { redirect } from "next/navigation";

export default function Home() {
  redirect("/login");
}
