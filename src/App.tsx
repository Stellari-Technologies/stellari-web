import './App.css'

function App() {
  return (
    <main className="app-shell">
      {/* START HERE: Replace this hero with your real page shell or route layout. */}
      <header className="hero">
        <p className="eyebrow">Stellari Frontend</p>
        <h1>React foundation for your rewards platform</h1>
        <p className="lead">
          Built with TypeScript, Vite, and a modern CSS token system designed for
          clean scaling across admin and user experiences.
        </p>
        <div className="cta-row">
          <a className="button primary" href="https://react.dev" target="_blank" rel="noreferrer">
            React Docs
          </a>
          <a className="button ghost" href="https://vite.dev" target="_blank" rel="noreferrer">
            Vite Docs
          </a>
        </div>
      </header>

      {/* Template cards. Keep one as a reusable pattern, then swap content. */}
      <section className="feature-grid" aria-label="Starter highlights">
        <article className="feature-card">
          <h2>Design Tokens</h2>
          <p>
            Centralized color, spacing, radius, and typography variables in one
            place for consistent UI decisions.
          </p>
        </article>
        <article className="feature-card">
          <h2>Composable Layout</h2>
          <p>
            Card and grid primitives that adapt across mobile and desktop without
            heavy utility class churn.
          </p>
        </article>
        <article className="feature-card">
          <h2>API Ready</h2>
          <p>
            Use <code>VITE_API_BASE_URL</code> to target local, containerized, or
            deployed API endpoints.
          </p>
        </article>
      </section>
    </main>
  )
}

export default App
