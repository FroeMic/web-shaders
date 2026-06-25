import { ShaderBackground } from "./react";

export function App() {
  return (
    <main className="page-shell">
      <ShaderBackground
        shader="grainient"
        className="shader-layer"
        aria-label="Grainy orange gradient shader"
      />

      <nav className="topbar" aria-label="Main">
        <a className="mark" href="/" aria-label="Web Shaders home">
          W
        </a>
        <div className="nav-links">
          <span>Welcome, Michael</span>
          <a href="https://www.shadertoy.com/results?query=pixelated+gradient" rel="noreferrer">
            Search
          </a>
        </div>
      </nav>

      <section className="hero" aria-labelledby="hero-title">
        <h1 id="hero-title">
          YC Startup
          <span>Internship</span>
          <span>Expo</span>
        </h1>
        <p>San Francisco&nbsp;&nbsp; August 15 2026</p>
      </section>

      <button className="scroll-indicator" type="button" aria-label="Scroll down">
        <span>Scroll down</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M7 10l5 5 5-5" />
        </svg>
      </button>
    </main>
  );
}
