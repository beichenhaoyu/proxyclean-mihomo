import { writeFile } from "node:fs/promises";

const SRC = process.env.SRC
  ?? "https://raw.githubusercontent.com/HankNovic/ProxyClean/refs/heads/main/SOCKS5.txt";

const res = await fetch(SRC, { signal: AbortSignal.timeout(30_000) });
if (!res.ok) throw new Error(`upstream fetch failed: HTTP ${res.status}`);
const txt = await res.text();

const seen = new Set();
const names = new Set();
const proxies = [];
for (const raw of txt.split(/\r?\n/)) {
  // 行尾 "#cc" 注释会让 mihomo 的 url.Parse 失败并整行丢弃，必须先剥掉
  const line = raw.trim().replace(/\s+#.*$/, "");
  const m = line.match(/^(?:socks5:\/\/)?([^:/\s]+):(\d{1,5})$/);
  if (!m) continue;
  const key = `${m[1]}:${m[2]}`;
  if (seen.has(key)) continue;
  seen.add(key);

  const cc = (raw.match(/#\s*([a-z]{2})\s*$/i)?.[1] ?? "").toLowerCase();
  let name = `s5-${cc ? cc + "-" : ""}${m[1]}`;
  if (names.has(name)) name += `-${m[2]}`;
  names.add(name);

  proxies.push(`  - {name: ${name}, type: socks5, server: ${m[1]}, port: ${m[2]}}`);
}

if (proxies.length < 10) throw new Error(`only ${proxies.length} proxies parsed, aborting`);

await writeFile("proxyclean.yaml", "proxies:\n" + proxies.join("\n") + "\n");
console.log(`wrote proxyclean.yaml with ${proxies.length} proxies`);
