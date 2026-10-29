"use client";
export default function LogoutButton() {
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.assign("/admin/login");
  }
  return <button className="button" onClick={logout} style={{ border: 0, cursor: "pointer", background: "#53666b" }}>Sign out</button>;
}
