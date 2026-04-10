"use client";

import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "duplicate" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("success");
        setEmail("");
      } else if (data.alreadySubscribed) {
        setStatus("duplicate");
      } else {
        setStatus("error");
        setErrorMsg(data.error ?? "Something went wrong.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Please try again.");
    }
  }

  return (
    <footer style={{ backgroundColor: "#1a2f5e" }} className="text-white">
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left */}
        <div className="text-center md:text-left">
          <p className="font-bold text-base uppercase tracking-wide text-white mb-1">
            Stay in the Loop
          </p>
          <p className="text-gray-300 text-sm max-w-sm">
            Get the latest startup stories, insights, and job opportunities from Nagpur delivered to your inbox.
          </p>
        </div>

        {/* Right — form */}
        <div className="w-full md:w-auto">
          {status === "success" ? (
            <div className="bg-green-500/20 border border-green-400 text-green-300 px-5 py-3 rounded-sm text-sm font-medium">
              You are subscribed! Welcome to the hub.
            </div>
          ) : status === "duplicate" ? (
            <div className="bg-yellow-500/20 border border-yellow-400 text-yellow-300 px-5 py-3 rounded-sm text-sm font-medium">
              You are already subscribed.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={status === "loading"}
                className="px-4 py-2.5 rounded-sm bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:border-orange-400 transition w-full sm:w-64 text-sm"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold text-sm uppercase tracking-wide px-5 py-2.5 rounded-sm transition whitespace-nowrap"
              >
                {status === "loading" ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
          )}
          {status === "error" && (
            <p className="text-red-400 text-xs mt-2">{errorMsg}</p>
          )}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 text-center text-gray-500 text-xs py-3 px-4">
        &copy; {new Date().getFullYear()} Nagpur Startup Hub. All rights reserved.
      </div>
    </footer>
  );
}