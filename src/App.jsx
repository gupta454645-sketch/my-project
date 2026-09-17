import React, { useEffect, useMemo, useState } from "react";

const STATUS_LABEL = {
  success: "success",
  failed: "failed",
  warning: "warning",
};

function formatTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function App() {
  const [events, setEvents] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (query) params.set("q", query);
      if (status !== "all") params.set("status", status);
      const qs = params.toString();
      const res = await fetch(`/api/audit-log${qs ? `?${qs}` : ""}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setEvents(data.events);
      setTotal(data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const id = setTimeout(load, 200);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, status]);

  const stats = useMemo(() => {
    const uniqueIps = new Set(events.map((e) => e.ip));
    return {
      total: events.length,
      success: events.filter((e) => e.status === "success").length,
      failed: events.filter((e) => e.status === "failed").length,
      ips: uniqueIps.size,
    };
  }, [events]);

  return (
    <div className="page">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">A</div>
          <div>
            <div className="brand-title">Account Audit Log</div>
            <div className="brand-sub">Security &amp; Compliance</div>
          </div>
        </div>
        <div className="live">
          <span className="live-dot" />
          {loading ? "Loading…" : `Live · ${total} events`}
        </div>
      </header>

      <div className="stats">
        <div className="stat-card">
          <div className="stat-label">Total Events</div>
          <div className="stat-value">{stats.total}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Successful</div>
          <div className="stat-value" style={{ color: "var(--success)" }}>
            {stats.success}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Failed / Blocked</div>
          <div className="stat-value" style={{ color: "var(--failed)" }}>
            {stats.failed}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Unique IPs</div>
          <div className="stat-value">{stats.ips}</div>
        </div>
      </div>

      <div className="toolbar">
        <input
          className="input"
          placeholder="Search actor, action, IP, detail…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select
          className="select"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="all">All statuses</option>
          <option value="success">Success</option>
          <option value="failed">Failed</option>
          <option value="warning">Warning</option>
        </select>
        <div className="spacer" />
        <button className="button" onClick={load}>
          Refresh
        </button>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Category</th>
              <th>IP Address</th>
              <th>Status</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {error && (
              <tr>
                <td colSpan="7" className="empty">
                  Failed to load: {error}
                </td>
              </tr>
            )}
            {!error &&
              !loading &&
              events.map((e) => (
                <tr key={e.id}>
                  <td className="muted mono">{formatTime(e.timestamp)}</td>
                  <td className="actor">{e.actor}</td>
                  <td className="action">{e.action.replaceAll("_", " ")}</td>
                  <td className="muted">{e.category}</td>
                  <td className="mono muted">{e.ip}</td>
                  <td>
                    <span className={`badge ${STATUS_LABEL[e.status]}`}>
                      {e.status}
                    </span>
                  </td>
                  <td className="muted">{e.detail}</td>
                </tr>
              ))}
            {!error && !loading && events.length === 0 && (
              <tr>
                <td colSpan="7" className="empty">
                  No matching events.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="footer-note">
        Demo dataset served by the Express API (<code>/api/audit-log</code>).
      </p>
    </div>
  );
}