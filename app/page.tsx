"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";

type ResultKey = "notFollowingBack" | "mutuals" | "fans";
type Theme = "dark" | "light";

type CheckResult = {
  followers: string[];
  following: string[];
  notFollowingBack: string[];
  mutuals: string[];
  fans: string[];
  duplicates: number;
};

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const tabs: { key: ResultKey; label: string; empty: string }[] = [
  { key: "notFollowingBack", label: "Tidak follow balik", empty: "Belum ada akun yang perlu dicek." },
  { key: "mutuals", label: "Mutual", empty: "Belum ada mutual yang cocok." },
  { key: "fans", label: "Fans", empty: "Belum ada followers yang tidak kamu follow balik." },
];

function cleanUsername(value: unknown) {
  if (typeof value !== "string") return "";
  return value
    .trim()
    .replace(/^@/, "")
    .replace(/^https?:\/\/(www\.)?instagram\.com\/(?:_u\/)?/i, "")
    .split(/[/?#]/)[0]
    .toLowerCase();
}

function unique(values: string[]) {
  const seen = new Set<string>();
  let duplicates = 0;

  for (const value of values) {
    const username = cleanUsername(value);
    if (!username) continue;
    if (seen.has(username)) duplicates += 1;
    seen.add(username);
  }

  return { values: [...seen].sort(), duplicates };
}

function collectInstagramValues(value: unknown, output: string[]) {
  if (!value || typeof value !== "object") return;

  if (Array.isArray(value)) {
    for (const item of value) collectInstagramValues(item, output);
    return;
  }

  const record = value as Record<string, unknown>;
  const title = typeof record.title === "string" && record.title.trim() ? record.title : "";

  const listData = record.string_list_data;
  if (Array.isArray(listData)) {
    for (const entry of listData) {
      if (!entry || typeof entry !== "object") continue;
      const row = entry as Record<string, unknown>;
      const username = typeof row.value === "string" ? row.value : row.href;
      output.push(typeof username === "string" ? username : title);
      return;
    }
  }

  if (title) output.push(title);
  if (Array.isArray(record.relationships_following)) collectInstagramValues(record.relationships_following, output);
}

function parseUsernames(raw: string) {
  const trimmed = raw.trim();
  if (!trimmed) return { values: [], duplicates: 0 };

  try {
    const parsed = JSON.parse(trimmed) as unknown;
    const values: string[] = [];
    collectInstagramValues(parsed, values);
    return unique(values);
  } catch {
    if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
      throw new Error("JSON rusak atau format tidak valid.");
    }
  }

  return unique(trimmed.split(/[\n,\s]+/));
}

function compare(followers: string[], following: string[]): CheckResult {
  const followerSet = new Set(followers);
  const followingSet = new Set(following);

  return {
    followers,
    following,
    notFollowingBack: following.filter((username) => !followerSet.has(username)),
    mutuals: following.filter((username) => followerSet.has(username)),
    fans: followers.filter((username) => !followingSet.has(username)),
    duplicates: 0,
  };
}

async function readFile(file: File) {
  if (file.size > MAX_FILE_SIZE) throw new Error("Ukuran file maksimal 50MB.");
  return file.text();
}

function downloadFile(name: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  link.click();
  URL.revokeObjectURL(url);
}

function toCsv(usernames: string[]) {
  return ["username,profile", ...usernames.map((username) => `${username},https://instagram.com/${username}`)].join("\n");
}

export default function Home() {
  const [followersText, setFollowersText] = useState("");
  const [followingText, setFollowingText] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<ResultKey>("notFollowingBack");
  const [query, setQuery] = useState("");
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "dark";
    const stored = localStorage.getItem("ig-checker-theme") as Theme | null;
    return stored === "light" || stored === "dark" ? stored : "dark";
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("ig-checker-theme", nextTheme);
    document.documentElement.dataset.theme = nextTheme;
  }

  async function handleFile(event: ChangeEvent<HTMLInputElement>, target: "followers" | "following") {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setError("");
      const text = await readFile(file);
      if (target === "followers") setFollowersText(text);
      else setFollowingText(text);
    } catch (fileError) {
      setError(fileError instanceof Error ? fileError.message : "File gagal dibaca.");
    }
  }

  function processData() {
    try {
      setError("");
      const followers = parseUsernames(followersText);
      const following = parseUsernames(followingText);

      if (!followers.values.length) throw new Error("Data followers kosong.");
      if (!following.values.length) throw new Error("Data following kosong.");

      setResult({ ...compare(followers.values, following.values), duplicates: followers.duplicates + following.duplicates });
      setActiveTab("notFollowingBack");
      setQuery("");
    } catch (processError) {
      setResult(null);
      setError(processError instanceof Error ? processError.message : "Data gagal diproses.");
    }
  }

  const visibleUsers = useMemo(() => {
    const users = result?.[activeTab] ?? [];
    const needle = cleanUsername(query);
    return needle ? users.filter((username) => username.includes(needle)) : users;
  }, [activeTab, query, result]);

  const activeLabel = tabs.find((tab) => tab.key === activeTab)?.label ?? "hasil";

  function exportResult(format: "csv" | "txt") {
    const users = result?.[activeTab] ?? [];
    if (!users.length) return;
    const basename = `instagram-${activeTab}`;
    if (format === "csv") downloadFile(`${basename}.csv`, toCsv(users), "text/csv;charset=utf-8");
    else downloadFile(`${basename}.txt`, users.join("\n"), "text/plain;charset=utf-8");
  }

  return (
    <>
      <a href="#checker" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-white">
        Lewati ke checker
      </a>
      <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
          <nav className="flex items-center justify-between" aria-label="Navigasi utama">
            <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold shadow-sm">
              IG Unfollow Checker
            </span>
            <button className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-semibold" onClick={toggleTheme} type="button">
              {theme === "dark" ? "Light" : "Dark"}
            </button>
          </nav>

          <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="rounded-[2rem] border border-[var(--border)] bg-[color-mix(in_srgb,var(--surface)_88%,transparent)] p-6 shadow-2xl shadow-black/10 sm:p-10">
              <p className="mb-4 inline-flex rounded-full bg-[color-mix(in_srgb,var(--ok)_18%,transparent)] px-4 py-2 text-sm font-semibold text-[var(--ok)]">
                100% proses di browser. Tanpa login.
              </p>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-6xl">
                Cek siapa yang tidak follow balik Instagram kamu.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
                Upload data Instagram atau paste username. Hasil langsung muncul, data tetap di perangkat kamu.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a className="rounded-full bg-[var(--accent)] px-6 py-3 text-center font-bold text-white shadow-lg shadow-pink-500/20" href="#checker">
                  Mulai cek sekarang
                </a>
                <a className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-6 py-3 text-center font-bold" href="#tutorial">
                  Lihat cara ambil data
                </a>
              </div>
            </div>

            <aside className="grid gap-4" aria-label="Keunggulan privasi">
              {[
                ["01", "Tidak pakai password Instagram"],
                ["02", "Tidak ada backend untuk proses data"],
                ["03", "Bisa export CSV dan TXT"],
              ].map(([number, text]) => (
                <div className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-5" key={number}>
                  <span className="font-mono text-sm text-[var(--accent)]">{number}</span>
                  <p className="mt-2 text-xl font-bold">{text}</p>
                </div>
              ))}
            </aside>
          </section>

          <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]" id="checker">
            <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-black">Masukkan data</h2>
                  <p className="mt-2 text-sm text-[var(--muted)]">Pilih file JSON atau paste username satu per baris.</p>
                </div>
                <span className="rounded-full bg-[var(--surface-2)] px-3 py-1 text-xs font-bold text-[var(--muted)]">Max 50MB</span>
              </div>

              <div className="mt-6 grid gap-5">
                <label className="grid gap-2">
                  <span className="font-bold">Followers</span>
                  <input aria-label="Upload followers JSON" className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-2)] p-4" type="file" accept=".json,application/json,text/plain" onChange={(event) => handleFile(event, "followers")} />
                  <textarea className="min-h-32 rounded-2xl border border-[var(--border)] bg-transparent p-4 font-mono text-sm" value={followersText} onChange={(event) => setFollowersText(event.target.value)} placeholder="followers_1.json atau username per baris" />
                </label>

                <label className="grid gap-2">
                  <span className="font-bold">Following</span>
                  <input aria-label="Upload following JSON" className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--surface-2)] p-4" type="file" accept=".json,application/json,text/plain" onChange={(event) => handleFile(event, "following")} />
                  <textarea className="min-h-32 rounded-2xl border border-[var(--border)] bg-transparent p-4 font-mono text-sm" value={followingText} onChange={(event) => setFollowingText(event.target.value)} placeholder="following.json atau username per baris" />
                </label>
              </div>

              <button className="mt-6 w-full rounded-2xl bg-[var(--accent)] px-5 py-4 font-black text-white shadow-lg shadow-pink-500/20" onClick={processData} type="button">
                Proses data lokal
              </button>
              <p className="mt-3 text-center text-sm text-[var(--muted)]">File dibaca dengan FileReader. Data tidak dikirim ke server.</p>
              <p aria-live="polite" className="mt-3 min-h-6 text-sm font-semibold text-[var(--danger)]">{error}</p>
            </div>

            <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-5 sm:p-6" aria-live="polite">
              <h2 className="text-2xl font-black">Hasil</h2>
              {!result ? (
                <div className="mt-6 rounded-3xl border border-dashed border-[var(--border)] bg-[var(--surface-2)] p-8 text-center text-[var(--muted)]">
                  Hasil akan tampil setelah followers dan following diproses.
                </div>
              ) : (
                <>
                  <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
                    {[
                      ["Followers", result.followers.length],
                      ["Following", result.following.length],
                      ["Tidak balik", result.notFollowingBack.length],
                      ["Mutual", result.mutuals.length],
                      ["Fans", result.fans.length],
                    ].map(([label, value]) => (
                      <div className="rounded-2xl bg-[var(--surface-2)] p-4" key={label}>
                        <p className="text-xs font-bold uppercase text-[var(--muted)]">{label}</p>
                        <p className="mt-1 text-2xl font-black">{value}</p>
                      </div>
                    ))}
                  </div>

                  {result.duplicates > 0 && <p className="mt-3 text-sm text-[var(--muted)]">{result.duplicates} duplikat diabaikan.</p>}

                  <div className="mt-6 flex flex-wrap gap-2" role="tablist" aria-label="Kategori hasil">
                    {tabs.map((tab) => (
                      <button className={`rounded-full px-4 py-2 text-sm font-bold ${activeTab === tab.key ? "bg-[var(--accent)] text-white" : "bg-[var(--surface-2)]"}`} key={tab.key} onClick={() => setActiveTab(tab.key)} role="tab" aria-selected={activeTab === tab.key} type="button">
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                    <input className="min-h-12 flex-1 rounded-2xl border border-[var(--border)] bg-transparent px-4" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Cari ${activeLabel.toLowerCase()}`} aria-label="Cari username" />
                    <button className="rounded-2xl border border-[var(--border)] px-4 py-3 font-bold" onClick={() => exportResult("csv")} type="button">CSV</button>
                    <button className="rounded-2xl border border-[var(--border)] px-4 py-3 font-bold" onClick={() => exportResult("txt")} type="button">TXT</button>
                  </div>

                  <div className="mt-4 max-h-[28rem] overflow-auto rounded-3xl border border-[var(--border)]">
                    {visibleUsers.length ? (
                      visibleUsers.map((username) => (
                        <a className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3 last:border-b-0 hover:bg-[var(--surface-2)]" href={`https://instagram.com/${username}`} key={username} target="_blank" rel="noreferrer">
                          <span className="font-mono font-bold">@{username}</span>
                          <span className="text-sm text-[var(--muted)]">Buka profil</span>
                        </a>
                      ))
                    ) : (
                      <p className="p-6 text-center text-[var(--muted)]">{tabs.find((tab) => tab.key === activeTab)?.empty}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-6" id="tutorial">
            <h2 className="text-2xl font-black">Cara ambil data Instagram</h2>
            <ol className="mt-5 grid gap-3 md:grid-cols-3">
              {[
                "Buka Accounts Center, lalu Your information and permissions.",
                "Pilih Download your information, lalu minta data followers dan following dalam format JSON.",
                "Upload followers_1.json dan following.json di checker ini.",
              ].map((step, index) => (
                <li className="rounded-2xl bg-[var(--surface-2)] p-5" key={step}>
                  <span className="font-mono text-sm text-[var(--accent)]">0{index + 1}</span>
                  <p className="mt-2 font-semibold">{step}</p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </main>
    </>
  );
}


