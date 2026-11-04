// Lokaler Dev-Server für das Ops-Dashboard. Keine Abhängigkeiten.
// Start: node frontend/server.mjs [port]   (Standard 8080)
// Liest issues/, deploys/ und compliance-findings/ bei jedem Aufruf von /data.json frisch ein.
import { createServer } from "node:http";
import { readFile, readdir } from "node:fs/promises";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.argv[2] || process.env.PORT || 8080);

async function loadIssues() {
  const dir = join(root, "issues");
  const files = (await readdir(dir)).filter((f) => f.endsWith(".json")).sort();
  const issues = await Promise.all(
    files.map(async (f) => JSON.parse(await readFile(join(dir, f), "utf8")))
  );
  return issues.map((i) => ({ ...i, comments: i.comments ?? [] }));
}

async function loadDeploys() {
  const raw = JSON.parse(await readFile(join(root, "deploys", "recent.json"), "utf8"));
  return raw.deploys.sort((a, b) => b.deployed_at.localeCompare(a.deployed_at));
}

// Parst die Markdown-Struktur aus prompts/compliance.md: Kopf, Regeltabelle, Befunde (## + Bullets).
function parseFinding(md) {
  const title = (md.match(/^# Compliance findings:\s*(.+)$/m) || [])[1] ?? "?";
  const source = (md.match(/^Source:\s*`(.+)`/m) || [])[1] ?? "";
  const result = (md.match(/^Result:\s*(.+)$/m) || [])[1] ?? "";
  const rules = [...md.matchAll(/^\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|\s*([^|]+?)\s*\|$/gm)]
    .map((m) => ({ rule: m[1], status: m[2], clause: m[3] }))
    .filter((r) => r.rule !== "Rule" && !/^-+$/.test(r.rule));
  const findings = md
    .split(/^## /m)
    .slice(1)
    .map((block) => {
      const [heading, ...rest] = block.split("\n");
      const fields = {};
      for (const m of rest.join("\n").matchAll(/^- \*\*([^:*]+):\*\*\s*(.*)$/gm)) {
        fields[m[1].trim().toLowerCase()] = m[2].trim();
      }
      return { title: heading.trim(), fields };
    });
  return { title, source, result, rules, findings };
}

async function loadCompliance() {
  const dir = join(root, "compliance-findings");
  const files = (await readdir(dir)).filter((f) => f.endsWith(".md")).sort();
  return Promise.all(files.map(async (f) => parseFinding(await readFile(join(dir, f), "utf8"))));
}

async function loadData() {
  const [issues, deploys, compliance] = await Promise.all([loadIssues(), loadDeploys(), loadCompliance()]);
  return { generated_at: new Date().toISOString(), issues, deploys, compliance };
}

createServer(async (req, res) => {
  try {
    const path = new URL(req.url, "http://x").pathname;
    if (path === "/data.json") {
      res.writeHead(200, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
      res.end(JSON.stringify(await loadData()));
    } else if (path === "/") {
      res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
      res.end(await readFile(join(root, "frontend", "index.html")));
    } else {
      res.writeHead(404).end("Not found");
    }
  } catch (err) {
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" }).end(String(err));
  }
}).listen(port, "127.0.0.1", () => console.log(`Ops-Dashboard: http://localhost:${port}`));
