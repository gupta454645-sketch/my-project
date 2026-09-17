import express from "express";
import cors from "cors";

const PORT = process.env.PORT || 4000;
const app = express();

app.use(cors());
app.use(express.json());

let count = 0;

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

app.listen(PORT, "0.0.0.0", () => {
  console.log(`API listening on http://localhost:${PORT}`);
});