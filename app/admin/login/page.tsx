"use client";

import { FormEvent, useState } from "react";

export default function AdminLoginPage() {
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.get("email"), password: form.get("password") })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || "Sign-in failed.");
        return;
      }
      window.location.assign(data.redirect || "/admin");
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return <main className="admin-shell" style={{ maxWidth: 480, paddingTop: 70 }}>
    <div className="card">
      <div className="eyebrow">AL YOUNUS · SECURE AREA</div>
      <h1>Admin sign in</h1>
      <p className="muted">Sign in with your authorized admin or staff account.</p>
      <form onSubmit={submit} style={{ display: "grid", gap: 16, marginTop: 24 }}>
        <label>Email address<input name="email" type="email" autoComplete="username" required style={inputStyle} /></label>
        <label>Password<input name="password" type="password" autoComplete="current-password" required style={inputStyle} /></label>
        {error && <p role="alert" style={{ color: "#b42318" }}>{error}</p>}
        <button className="button" disabled={busy} type="submit">{busy ? "Signing in…" : "Sign in securely"}</button>
      </form>
      <p className="muted" style={{ fontSize: 12, marginTop: 20 }}>If no account has been seeded yet, complete the database setup instructions in README first.</p>
      <a href="/" className="muted">← Back to storefront</a>
    </div>
  </main>;
}

const inputStyle = { display: "block", width: "100%", marginTop: 7, padding: "12px 14px", border: "1px solid #cbd8d3", borderRadius: 8, font: "inherit" };
