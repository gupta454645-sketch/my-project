import React, { useEffect, useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);
  const [health, setHealth] = useState(null);
  const [apiCount, setApiCount] = useState(null);
  const [apiError, setApiError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadBackend() {
      try {
        const [healthRes, countRes] = await Promise.all([
          fetch("/api/health"),
          fetch("/api/count"),
        ]);
        if (!healthRes.ok || !countRes.ok) {
          throw new Error(`HTTP ${healthRes.status}`);
        }
        const healthData = await healthRes.json();
        const countData = await countRes.json();
        if (!cancelled) {
          setHealth(healthData);
          setApiCount(countData.count);
        }
      } catch (err) {
        if (!cancelled) setApiError(err.message);
      }
    }

    loadBackend();
    return () => {
      cancelled = true;
    };
  }, []);

  async function incrementApi() {
    try {
      const res = await fetch("/api/count", { method: "POST" });
      const data = await res.json();
      setApiCount(data.count);
    } catch (err) {
      setApiError(err.message);
    }
  }

  const backendStatus =
    health?.status === "ok" ? "Connected" : apiError ? "Error" : "Loading...";

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: 560,
          background: "#ffffff",
          border: "1px solid #e3e7ed",
          borderRadius: 12,
          padding: 32,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: 0.8,
              textTransform: "uppercase",
              color: "#5a6b80",
            }}
          >
            my-project
          </span>
          <h1 style={{ margin: 0, fontSize: 30, lineHeight: 1.2 }}>
            Development environment is running
          </h1>
          <p style={{ margin: 0, color: "#4a5a6e", lineHeight: 1.6 }}>
            This React + Vite frontend talks to a Node + Express API. Edit{" "}
            <code>src/App.jsx</code> or <code>api/server.js</code> and the page
            will hot reload.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button
            onClick={() => setCount((c) => c + 1)}
            style={{
              background: "#1f5fd6",
              color: "#ffffff",
              border: "none",
              borderRadius: 8,
              padding: "10px 18px",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Increment
          </button>
          <span style={{ color: "#4a5a6e", fontSize: 15 }}>
            Clicks: <strong>{count}</strong>
          </span>
        </div>

        <div
          style={{
            borderTop: "1px solid #e3e7ed",
            paddingTop: 16,
            display: "flex",
            flexDirection: "column",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: "#5a6b80", fontSize: 14 }}>Backend:</span>
            <strong style={{ fontSize: 14 }}>{backendStatus}</strong>
            {health?.status === "ok" && (
              <span style={{ color: "#5a6b80", fontSize: 13 }}>
                ({health.service} @ {health.time})
              </span>
            )}
            {apiError && (
              <span style={{ color: "#c0392b", fontSize: 13 }}>{apiError}</span>
            )}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={incrementApi}
              style={{
                background: "#17894b",
                color: "#ffffff",
                border: "none",
                borderRadius: 8,
                padding: "10px 18px",
                fontSize: 15,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Increment (server)
            </button>
            <span style={{ color: "#4a5a6e", fontSize: 15 }}>
              Server count:{" "}
              <strong>{apiCount === null ? "…" : apiCount}</strong>
            </span>
          </div>
        </div>
      </section>
    </main>
  );
}