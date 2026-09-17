import React, { useEffect, useMemo, useState } from "react";

const STATUS_CLASS = {
  success: "success",
  failed: "failed",
  warning: "warning",
};

const SESSION_CLASS = {
  SECURE: "secure",
  ALIVE: "alive",
  EXPIRED: "expired",
};

const TABS = [
  { id: "activity", label: "Activity" },
  { id: "sessions", label: "Login Sessions" },
  { id: "alerts", label: "Alerts" },
  { id: "referrals", label: "Referrals" },
];

function formatTime(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatFull(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const CIRC = 2 * Math.PI * 54;

export default function App() {
  const [tab, setTab] = useState("activity");
  const [events, setEvents] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadEvents() {
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
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const id = setTimeout(loadEvents, 200);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, status]);

  useEffect(() => {
    fetch("/api/sessions")
      .then((r) => r.json())
      .then((d) => setSessions(d.sessions || []))
      .catch(() => {});
  }, []);

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
            <div className="brand-title">Aurum</div>
            <div className="brand-sub">Account Security</div>
          </div>
        </div>

        <nav className="nav">
          <a href="#" className="nav-link active">
            <span>◈</span> Overview
          </a>
          <a href="#" className="nav-link">
            <span>≣</span> History
          </a>
          <a href="#" className="nav-link">
            <span>◉</span> Sessions
          </a>
          <a href="#" className="nav-link">
            <span>?</span> Support
          </a>
        </nav>

        <div className="hdr-right">
          <div className="bell">🔔</div>
          <div className="profile">
            <div className="avatar">AM</div>
            <span className="profile-name">Alex Moore</span>
          </div>
        </div>
      </header>

      <div className="banner">
        <span>
          Welcome back — two-factor authentication is now available for all
          accounts, enable it from Login Sessions for stronger account
          security.&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;Review your recent
          activity regularly to keep your account protected
          against unauthorized access.
        </span>
      </div>

      <div className="content">
        <section className="security">
          <div className="card score-card">
            <div className="gauge">
              <svg width="200" height="200" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="54"
                  fill="none"
                  stroke="#232838"
                  strokeWidth="11"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="54"
                  fill="none"
                  stroke="#facc15"
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeDasharray={CIRC}
                  strokeDashoffset={0}
                />
              </svg>
              <div className="gauge-center">
                <div className="gauge-num">100</div>
                <div className="gauge-max">/ 100 MAX</div>
              </div>
            </div>
            <div className="medal">★ SUPREME PLATINUM TRUST</div>
            <p className="score-micro">
              Ultimate high trust standing. Eligible for premium account
              features and priority verification.
            </p>
          </div>

          <div className="score-cards">
            <div className="card">
              <h3 style={{ color: "var(--red)" }}>Score Deductions</h3>
              <div className="rule neg">
                <span className="mark">!</span>
                <span>
                  <b>Repeated failed login attempts</b> from unrecognized
                  devices.
                </span>
              </div>
              <div className="rule neg">
                <span className="mark">!</span>
                <span>
                  <b>Unverified identity information</b> when confirming account
                  changes.
                </span>
              </div>
              <div className="rule neg">
                <span className="mark">!</span>
                <span>
                  <b>Active sessions left open</b> on shared or public
                  terminals.
                </span>
              </div>
            </div>

            <div className="card">
              <h3 style={{ color: "var(--cyan)" }}>Score Restoration</h3>
              <div className="rule pos">
                <span className="mark">✓</span>
                <span>
                  <b>Complete identity verification</b> and enable 2FA.
                </span>
              </div>
              <div className="rule pos">
                <span className="mark">✓</span>
                <span>
                  <b>Review and close</b> unknown active sessions.
                </span>
              </div>
              <div className="rule pos">
                <span className="mark">✓</span>
                <span>
                  <b>Keep contact details current</b> for security notices.
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="portal">
          <div className="portal-head">
            <h2 className="portal-title">Account Audit History Log</h2>
          </div>
          <div className="tabs">
            {TABS.map((t) => (
              <button
                key={t.id}
                className={`tab ${tab === t.id ? "active" : ""}`}
                onClick={() => setTab(t.id)}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="tab-body">
            {tab === "activity" && (
              <>
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
                  <button className="button" onClick={loadEvents}>
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
                              <span className={`badge ${STATUS_CLASS[e.status]}`}>
                                {e.status}
                              </span>
                            </td>
                            <td className="muted">{e.detail}</td>
                          </tr>
                        ))}
                      {!error && !loading && events.length === 0 && (
                        <tr>
                          <td colSpan="7" className="empty">
                            No activity recorded. New events will appear here.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {tab === "sessions" && (
              <div className="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Terminal / Device</th>
                      <th>IP Address</th>
                      <th>Last Active</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessions.map((s) => (
                      <tr key={s.id}>
                        <td>
                          <div className="actor">{s.ip.replace(/:\d+$/, "")}</div>
                          <div className="muted" style={{ fontStyle: "italic", fontSize: 13 }}>
                            {s.device}
                          </div>
                        </td>
                        <td className="mono muted">{s.ip}</td>
                        <td className="muted mono">{formatFull(s.timestamp)}</td>
                        <td>
                          <span className={`badge ${SESSION_CLASS[s.status] || "expired"}`}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {tab === "alerts" && (
              <div className="empty">
                <span className="icon">🔕</span>
                No alerts logged.
              </div>
            )}

            {tab === "referrals" && (
              <div className="empty">
                <span className="icon">👥</span>
                No referrals found under your code yet.
                <br />
                Share your invitation link to grow your network.
              </div>
            )}
          </div>
        </section>
      </div>

      <div className="dock">
        <div className="dock-item active">
          <span className="d-icon">⌂</span> Home
        </div>
        <div className="dock-item">
          <span className="d-icon">≣</span> Activity
        </div>
        <div className="dock-item">
          <span className="d-icon">◉</span> Sessions
        </div>
        <div className="dock-item">
          <span className="d-icon">●</span> Profile
        </div>
      </div>
    </div>
  );
}