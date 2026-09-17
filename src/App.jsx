import React, { useState } from "react";

export default function App() {
  const [count, setCount] = useState(0);

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
            This React + Vite app is served by the checked-in Alloy Docker
            Compose setup. Edit <code>src/App.jsx</code> and the page will hot
            reload.
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
      </section>
    </main>
  );
}
