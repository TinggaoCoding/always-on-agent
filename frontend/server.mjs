// Lokaler Dev-Server für das Ops-Dashboard. Keine Abhängigkeiten.
// Start: node frontend/server.mjs [port]   (Standard 8080)
// Liest issues/, deploys/ und compliance-findings/ bei jedem Aufruf von /data.json frisch ein,
// dazu per `gh` die letzten Compliance-Drift-Läufe und offene Drift-PRs.
import { createServer } from "node:http";
import { readFile, readdir } from "node:fs/promises";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

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

// GitHub-Stand über das lokal angemeldete `gh`: letzte Workflow-Läufe und offene, noch nicht gemergte Compliance-PRs.
const gh = async (...args) => (await promisify(execFile)("gh", args, { cwd: root, timeout: 15000 })).stdout;

async function loadGitHub() {
  try {
    const runs = JSON.parse(await gh("run", "list", "--workflow", "Compliance Drift", "-L", "5",
      "--json", "databaseId,event,status,conclusion,createdAt,url"));
    const prs = JSON.parse(await gh("pr", "list", "--state", "open", "--json", "number,title,url,headRefName,files"));
    const pending = [];
    for (const pr of prs.filter((p) => p.headRefName.startsWith("claude/compliance-"))) {
      for (const { path } of pr.files.filter((f) => /^compliance-findings\/[\w.-]+\.md$/.test(f.path))) {
        const md = await gh("api", "-H", "Accept: application/vnd.github.raw",
          `repos/{owner}/{repo}/contents/${path}?ref=${encodeURIComponent(pr.headRefName)}`);
        pending.push({ pr: { number: pr.number, url: pr.url }, file: basename(path), ...parseFinding(md) });
      }
    }
    return { runs, pending, error: null };
  } catch (err) {
    // Ohne gh/Netz läuft das Dashboard mit den lokalen Dateien weiter.
    return { runs: [], pending: [], error: String(err.message || err).split("\n")[0] };
  }
}

// Cron-Zeile des Workflows, damit die Seite "nächster Lauf" anzeigen kann.
async function loadSchedule() {
  const yml = await readFile(join(root, ".github", "workflows", "compliance-drift.yml"), "utf8").catch(() => "");
  return (yml.match(/cron:\s*"([^"]+)"/) || [])[1] ?? null;
}

async function loadData() {
  const [issues, deploys, compliance, github, schedule] =
    await Promise.all([loadIssues(), loadDeploys(), loadCompliance(), loadGitHub(), loadSchedule()]);
  return { generated_at: new Date().toISOString(), issues, deploys, compliance, github, schedule };
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
