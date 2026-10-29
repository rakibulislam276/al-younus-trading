import LogoutButton from "./logout-button";

const modules = [
  { title: "Products & inventory", detail: "Catalogue records, prices, stock quantities and low-stock warnings.", href: "/admin/products", label: "Open products" },
  { title: "Categories", detail: "Create and review product categories.", href: "/admin/categories", label: "Open categories" },
  { title: "Customer CRM", detail: "Record enquiries, contact details and follow-up dates.", href: "/admin/leads", label: "Open leads" },
  { title: "Orders & sales", detail: "Review order records and payment/status information.", href: "/admin/orders", label: "Open orders" }
];

export default function AdminDashboard() {
  return <main className="admin-shell">
    <div className="admin-header">
      <div><div className="eyebrow">AL YOUNUS · ADMIN</div><h1>Business dashboard</h1><p className="muted">Manage the core business modules from one place. Live records require the PostgreSQL database to be configured.</p></div>
      <div style={{display:"flex",gap:10,flexWrap:"wrap"}}><a className="button" href="/">View storefront</a><LogoutButton /></div>
    </div>
    <section className="grid" style={{gridTemplateColumns:"repeat(auto-fit,minmax(230px,1fr))"}}>
      {modules.map(module=><article className="card" key={module.href}><div className="eyebrow">ADMIN MODULE</div><h3>{module.title}</h3><p>{module.detail}</p><a className="button" href={module.href}>{module.label} ↗</a></article>)}
    </section>
    <section className="card" style={{marginTop:28}}>
      <h2>Activation checklist</h2>
      <ol style={{lineHeight:1.9,color:"#53666b"}}>
        <li>Create a PostgreSQL database and add its connection string to a private local <code>.env</code> file.</li>
        <li>Set a unique <code>AUTH_SECRET</code> and administrator credentials in that private file.</li>
        <li>Run the Prisma setup and seed the first admin account using the README instructions.</li>
        <li>Test authentication, product creation and database-backed pages locally before deploying.</li>
      </ol>
      <p className="muted">Do not commit or share your .env file, database password or admin password.</p>
    </section>
  </main>;
}
