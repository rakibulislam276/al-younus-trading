import LogoutButton from "./logout-button";

export default function AdminDashboard() {
  return <main className="admin-shell">
    <div className="admin-header">
      <div><div className="eyebrow">AL YOUNUS · ADMIN</div><h1>Business dashboard</h1><p className="muted">Secure admin area foundation. Live metrics will appear after the database is connected and business records are added.</p></div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}><a className="button" href="/">View storefront</a><LogoutButton /></div>
    </div>
    <section className="stats">
      <div className="stat">Product catalogue<strong>→</strong><span className="muted">Create and manage product records</span><p><a href="/admin/products">Open product management ↗</a></p></div>
      <div className="stat">Customer CRM<strong>Next</strong><span className="muted">Leads, follow-ups and customer history</span></div>
      <div className="stat">Orders & reports<strong>Next</strong><span className="muted">Order processing and sales reporting</span></div>
    </section>
    <section className="card">
      <h2>Setup status</h2>
      <p className="muted">Authentication routes, protected admin pages, product API routes and the PostgreSQL data model have been added to the repository. To activate login, configure a private local .env file, provision PostgreSQL, run the Prisma setup and create the first administrator using the documented seed command.</p>
      <p><a className="button" href="/admin/products">Open product management</a></p>
    </section>
  </main>;
}
