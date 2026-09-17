import express from "express";
import cors from "cors";

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());

let count = 0;

const seed = [
  { actor: "alex.morgan", action: "login", category: "auth", ip: "203.0.113.42", status: "success", minutesAgo: 2, detail: "Signed in from web (Chrome 126, macOS)" },
  { actor: "priya.nair", action: "failed_login", category: "auth", ip: "198.51.100.17", status: "failed", minutesAgo: 9, detail: "Invalid password (3rd attempt)" },
  { actor: "system", action: "role_change", category: "admin", ip: "10.0.0.2", status: "success", minutesAgo: 14, detail: 'Granted "viewer" to dana.lee' },
  { actor: "dana.lee", action: "password_change", category: "auth", ip: "203.0.113.99", status: "success", minutesAgo: 22, detail: "Self-service password reset" },
  { actor: "omar.haddad", action: "profile_update", category: "profile", ip: "198.51.100.64", status: "success", minutesAgo: 31, detail: "Updated email address" },
  { actor: "lin.chen", action: "mfa_enabled", category: "auth", ip: "203.0.113.7", status: "success", minutesAgo: 47, detail: "Enrolled TOTP authenticator" },
  { actor: "unknown", action: "failed_login", category: "auth", ip: "185.220.101.9", status: "failed", minutesAgo: 71, detail: "Blocked IP after 5 attempts" },
  { actor: "system", action: "account_lock", category: "admin", ip: "10.0.0.2", status: "warning", minutesAgo: 88, detail: "Locked rachel.kim after repeated failures" },
  { actor: "rachel.kim", action: "login", category: "auth", ip: "203.0.113.128", status: "success", minutesAgo: 122, detail: "Signed in from mobile (iPhone, Safari)" },
  { actor: "sana.patel", action: "logout", category: "auth", ip: "198.51.100.3", status: "success", minutesAgo: 140, detail: "Session ended" },
  { actor: "system", action: "api_key_created", category: "admin", ip: "10.0.0.2", status: "success", minutesAgo: 175, detail: "Created key for integration pipeline" },
  { actor: "emma.wright", action: "role_change", category: "admin", ip: "10.0.0.5", status: "success", minutesAgo: 211, detail: 'Granted "editor" to omar.haddad' },
  { actor: "alex.morgan", action: "failed_login", category: "auth", ip: "192.0.2.88", status: "failed", minutesAgo: 260, detail: "Unknown device fingerprint" },
  { actor: "dana.lee", action: "profile_update", category: "profile", ip: "203.0.113.99", status: "success", minutesAgo: 301, detail: "Updated display name" },
  { actor: "lin.chen", action: "login", category: "auth", ip: "203.0.113.7", status: "success", minutesAgo: 355, detail: "Signed in from web (Firefox 127, Linux)" },
  { actor: "system", action: "data_export", category: "admin", ip: "10.0.0.2", status: "success", minutesAgo: 410, detail: "Monthly audit archive generated" },
  { actor: "priya.nair", action: "mfa_disabled", category: "auth", ip: "198.51.100.17", status: "warning", minutesAgo: 460, detail: "SMS backup removed" },
  { actor: "omar.haddad", action: "logout", category: "auth", ip: "198.51.100.64", status: "success", minutesAgo: 520, detail: "Session ended" },
  { actor: "unknown", action: "failed_login", category: "auth", ip: "45.227.253.210", status: "failed", minutesAgo: 590, detail: "Credential stuffing detected" },
  { actor: "sana.patel", action: "login", category: "auth", ip: "198.51.100.3", status: "success", minutesAgo: 660, detail: "Signed in from web (Chrome 126, Windows)" },
];

function buildLog(rows) {
  const now = Date.now();
  return rows.map((e, i) => {
    const { minutesAgo, ...rest } = e;
    return {
      id: rows.length - i,
      timestamp: new Date(now - minutesAgo * 60000).toISOString(),
      ...rest,
    };
  });
}

const auditLog = buildLog(seed);

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "api",
    isAlloy: process.env.IS_ALLOY === "true",
    time: new Date().toISOString(),
  });
});

app.get("/api/count", (req, res) => {
  res.json({ count });
});

app.post("/api/count", (req, res) => {
  count += 1;
  res.json({ count });
});

app.get("/api/audit-log", (req, res) => {
  const q = String(req.query.q || "").toLowerCase();
  const status = String(req.query.status || "");

  let rows = auditLog;
  if (status && status !== "all") {
    rows = rows.filter((r) => r.status === status);
  }
  if (q) {
    rows = rows.filter((r) =>
      [r.actor, r.action, r.category, r.ip, r.detail].some((f) =>
        String(f).toLowerCase().includes(q),
      ),
    );
  }

  res.json({ total: rows.length, events: rows });
});

const sessionSeed = [
  { ip: "192.168.1.20", device: "Chrome on Mac21 (AI Studio Simulated)", status: "SECURE", minutesAgo: 3 },
  { ip: "203.0.113.7", device: "Safari on iPhone 15 Pro", status: "ALIVE", minutesAgo: 41 },
  { ip: "198.51.100.64", device: "Firefox 127 on Linux", status: "SECURE", minutesAgo: 300 },
  { ip: "203.0.113.42", device: "Chrome 126 on macOS", status: "EXPIRED", minutesAgo: 1440 },
];

const sessions = sessionSeed.map((s, i) => {
  const { minutesAgo, ...rest } = s;
  return {
    id: i + 1,
    timestamp: new Date(Date.now() - minutesAgo * 60000).toISOString(),
    ...rest,
  };
});

app.get("/api/sessions", (req, res) => {
  res.json({ total: sessions.length, sessions });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API listening on http://localhost:${PORT}`);
});