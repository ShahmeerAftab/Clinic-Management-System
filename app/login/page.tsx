// "use client" is required because we use useState and useRouter,
// which are browser-only features (not available on the server).
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // lets us navigate to other pages in code

export default function LoginPage() {
  // ─────────────────────────────────────────────────────────────────
  // STATE — each useState holds one value that the page can change.
  // When any state changes, React automatically re-renders the page.
  // ─────────────────────────────────────────────────────────────────

  const router = useRouter(); // we use this to redirect after login

  const [email, setEmail] = useState("");           // user's typed email
  const [password, setPassword] = useState("");     // user's typed password
  const [role, setRole] = useState("doctor");       // which role button is selected (default: doctor)
  const [showPassword, setShowPassword] = useState(false); // show/hide password toggle
  const [rememberMe, setRememberMe] = useState(false);     // remember me checkbox
  const [isLoading, setIsLoading] = useState(false);       // true while "signing in" is happening
  const [error, setError] = useState("");           // red error text (empty = no error shown)

  // ─────────────────────────────────────────────────────────────────
  // HANDLE SUBMIT — runs when the user clicks the "Sign in" button
  // ─────────────────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); // prevents the browser from doing a full page reload

    setError("");       // clear any old error message
    setIsLoading(true); // change button text to "Signing in…"

    // Basic validation — make sure the user actually filled in both fields
    if (!email || !password) {
      setError("Please enter both email and password.");
      setIsLoading(false);
      return; // stop here — don't go further
    }

    // ── SIMULATED LOGIN ──────────────────────────────────────────
    // We wait 1 second to mimic a real API call.
    // Later you will replace this block with a real fetch/axios call.
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // ── SAVE SESSION TO localStorage ────────────────────────────
    // localStorage is like a mini key-value store built into every browser.
    // Data saved here survives page refreshes but stays on this device.
    //
    // ⚠️ WARNING: This is for learning only — NOT secure for production.
    //             Real apps use JWT tokens sent from a backend server.
    localStorage.setItem("userRole", role);    // e.g. "admin", "doctor", "receptionist", "patient"
    localStorage.setItem("userEmail", email);  // e.g. "shahmeer@clinic.com"

    // ── REDIRECT TO CORRECT DASHBOARD ───────────────────────────
    // role = "admin"        → goes to /admin
    // role = "doctor"       → goes to /doctor
    // role = "receptionist" → goes to /receptionist
    // role = "patient"      → goes to /patient
    router.push("/" + role);
  }

  // ─────────────────────────────────────────────────────────────────
  // UI — split screen: left branding panel + right login card
  // ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex">

      {/* ═══════════════════════════════════════════════════════════
          LEFT PANEL — branding / marketing
          `hidden`  = not visible on mobile screens
          `lg:flex` = visible as a flex column on large screens (1024px+)
          ═══════════════════════════════════════════════════════════ */}
      <div className="hidden lg:flex w-1/2 relative flex-col items-center justify-center p-16 overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500">

        {/* Soft glowing circles — purely decorative background blobs */}
        <div className="absolute top-[-80px] left-[-80px] w-80 h-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute bottom-[-100px] right-[-60px] w-96 h-96 rounded-full bg-cyan-300/20 blur-3xl" />

        {/* Text content sits above the blobs (z-10 = layer above blobs) */}
        <div className="relative z-10 text-center text-white max-w-sm">

          {/* App logo icon */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center">
              {/* Medical cross SVG — no icon library needed */}
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 3a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H8a1 1 0 110-2h3V7a1 1 0 011-1z" />
              </svg>
            </div>
          </div>

          {/* App name and tagline */}
          <h1 className="text-4xl font-bold">MediCare Pro</h1>
          <p className="mt-2 text-blue-100 text-lg">Clinic Management System</p>
          <p className="mt-5 text-blue-200 text-sm leading-relaxed">
            Manage appointments, patient records, billing, and your entire clinic
            team — all in one place.
          </p>

          {/* Stats — written out one by one so they are easy to read */}
          <div className="mt-12 grid grid-cols-3 divide-x divide-white/20 border border-white/20 rounded-2xl bg-white/10 overflow-hidden">
            <div className="py-5">
              <p className="text-2xl font-bold">500+</p>
              <p className="text-blue-200 text-xs mt-1">Clinics</p>
            </div>
            <div className="py-5">
              <p className="text-2xl font-bold">2k+</p>
              <p className="text-blue-200 text-xs mt-1">Doctors</p>
            </div>
            <div className="py-5">
              <p className="text-2xl font-bold">50k+</p>
              <p className="text-blue-200 text-xs mt-1">Patients</p>
            </div>
          </div>

          {/* Trust badges using emoji — simple, no library */}
          <div className="mt-10 flex justify-center gap-6 text-blue-200 text-xs">
            <span>🔒 HIPAA Compliant</span>
            <span>🛡️ 256-bit Encrypted</span>
            <span>✅ 99.9% Uptime</span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          RIGHT PANEL — the actual login form
          `flex-1` fills all remaining width (full screen on mobile)
          ═══════════════════════════════════════════════════════════ */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 px-6 py-12">

        {/* Mobile-only logo — shows only when the left panel is hidden */}
        <div className="lg:hidden flex items-center gap-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 3a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H8a1 1 0 110-2h3V7a1 1 0 011-1z" />
            </svg>
          </div>
          <span className="text-xl font-bold text-gray-900">MediCare Pro</span>
        </div>

        {/* White login card — max width 420px, centered */}
        <div className="w-full max-w-[420px]">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">

            {/* Heading */}
            <h2 className="text-2xl font-bold text-gray-900">Welcome back</h2>
            <p className="text-gray-500 text-sm mt-1">Sign in to your clinic account</p>

            {/* ── THE FORM ── */}
            <form onSubmit={handleSubmit} className="mt-7 space-y-5">

              {/* ── ROLE SELECTOR ─────────────────────────────────────
                  Four buttons in a 2×2 grid.
                  Clicking a button sets the `role` state.
                  The selected button gets a blue highlight style.
                  ────────────────────────────────────────────────────── */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sign in as
                </label>

                <div className="grid grid-cols-2 gap-2">

                  {/* Admin button */}
                  <button
                    type="button"
                    onClick={() => setRole("admin")}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                      role === "admin"
                        ? "bg-blue-50 border-blue-500 text-blue-700"         // selected
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50" // not selected
                    }`}
                  >
                    🛡️ Admin
                  </button>

                  {/* Doctor button */}
                  <button
                    type="button"
                    onClick={() => setRole("doctor")}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                      role === "doctor"
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    👨‍⚕️ Doctor
                  </button>

                  {/* Receptionist button */}
                  <button
                    type="button"
                    onClick={() => setRole("receptionist")}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                      role === "receptionist"
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    🗂️ Receptionist
                  </button>

                  {/* Patient button */}
                  <button
                    type="button"
                    onClick={() => setRole("patient")}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
                      role === "patient"
                        ? "bg-blue-50 border-blue-500 text-blue-700"
                        : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    🏥 Patient
                  </button>
                </div>

                {/* Hidden <select> — the buttons above are visual.
                    This invisible select holds the real form value.
                    aria-hidden and tabIndex=-1 hide it from keyboard/screen readers. */}
                <select
                  name="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  aria-hidden="true"
                  tabIndex={-1}
                  className="sr-only"
                >
                  <option value="admin">Admin</option>
                  <option value="doctor">Doctor</option>
                  <option value="receptionist">Receptionist</option>
                  <option value="patient">Patient</option>
                </select>
              </div>

              {/* ── EMAIL INPUT ────────────────────────────────────────
                  type="email" → mobile keyboards show @ symbol
                  autoComplete="email" → browser can autofill
                  ────────────────────────────────────────────────────── */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@clinic.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)} // every keystroke updates state
                  className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* ── PASSWORD INPUT ─────────────────────────────────────
                  type switches between "password" (dots) and "text" (visible)
                  based on the showPassword state.
                  ────────────────────────────────────────────────────── */}
              <div>
                {/* Label row: label on left, forgot password link on right */}
                <div className="flex items-center justify-between mb-1.5">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <a href="#" className="text-xs font-medium text-blue-600 hover:text-blue-700">
                    Forgot password?
                  </a>
                </div>

                {/* Input + Show/Hide button inside one bordered box */}
                <div className="flex border border-gray-300 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"} // "text" = visible, "password" = dots
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="flex-1 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 bg-white focus:outline-none"
                  />
                  {/* Clicking this flips showPassword between true and false */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="px-3.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-gray-50 border-l border-gray-200 shrink-0"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* ── REMEMBER ME CHECKBOX ───────────────────────────────
                  htmlFor="remember" links the label to the checkbox.
                  Clicking the label text also ticks/unticks the checkbox.
                  ────────────────────────────────────────────────────── */}
              <div className="flex items-center gap-2">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)} // e.target.checked = true or false
                  className="h-4 w-4 rounded border-gray-300 accent-blue-600"
                />
                <label htmlFor="remember" className="text-sm text-gray-600 cursor-pointer select-none">
                  Remember me for 30 days
                </label>
              </div>

              {/* ── ERROR BANNER ───────────────────────────────────────
                  This block only appears when `error` is not empty.
                  React skips rendering it completely when error = "".
                  ────────────────────────────────────────────────────── */}
              {error && (
                <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                  <svg className="w-5 h-5 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              {/* ── SUBMIT BUTTON ──────────────────────────────────────
                  disabled while loading to prevent double-clicking.
                  Text changes based on isLoading state.
                  ────────────────────────────────────────────────────── */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {isLoading ? "Signing in…" : "Sign in"}
              </button>

            </form>

            {/* Footer link */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Need access?{" "}
              <a href="#" className="font-medium text-blue-600 hover:text-blue-700">
                Contact your administrator
              </a>
            </p>

          </div>

          {/* Copyright below the card */}
          <p className="mt-6 text-center text-xs text-gray-400">
            &copy; 2026 MediCare Pro &middot; HIPAA Compliant &middot; Secure Login
          </p>
        </div>
      </div>

    </div>
  );
}
