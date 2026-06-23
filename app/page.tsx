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
  { key: "notFollowingBack", label: "Tidak follow balik", empty: "Tidak ada akun di kategori ini." },
  { key: "mutuals", label: "Mutual", empty: "Belum ada mutual yang cocok." },
  { key: "fans", label: "Fans", empty: "Belum ada fans di data ini." },
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
  const [theme, setTheme] = useState<Theme>("dark");
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("ig-checker-theme") as Theme | null;
    const nextTheme = stored === "light" || stored === "dark" ? stored : "dark";
    document.documentElement.dataset.theme = nextTheme;
    queueMicrotask(() => {
      setTheme(nextTheme);
      setIsMounted(true);
    });
  }, []);

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
      <a className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-white" href="#checker">
        Lewati ke checker
      </a>

      <main>
        <div className="app-shell">
          <nav className="topbar" aria-label="Navigasi utama">
            <span className="brand-pill">IG Unfollow Checker</span>
            <button className="theme-toggle" onClick={toggleTheme} type="button" aria-label="Ganti tema warna">
              {isMounted && theme === "light" ? "Dark" : "Light"}
            </button>
          </nav>

          <section className="hero" aria-labelledby="hero-title">
            <div className="hero-copy">
              <p className="eyebrow">Private checker. Tanpa login. Tanpa server.</p>
              <h1 id="hero-title">Unfollow list yang bersih dalam sekali upload.</h1>
              <p>
                Masukkan data Instagram resmi. Browser kamu menghitung mutual, fans, dan akun yang tidak follow balik.
              </p>
              <div className="hero-actions">
                <a className="primary-link" href="#checker">Cek sekarang</a>
                <a className="secondary-link" href="#tutorial">Cara ambil data</a>
              </div>
            </div>

            <aside className="hero-rail" aria-label="Ringkasan fitur">
              {[
                ["01", "Password Instagram tidak pernah diminta."],
                ["02", "File hanya dibaca di perangkat kamu."],
                ["03", "Hasil bisa diunduh sebagai CSV atau TXT."],
              ].map(([number, text]) => (
                <div className="rail-item" key={number}>
                  <span className="rail-index">{number}</span>
                  <p>{text}</p>
                </div>
              ))}
            </aside>
          </section>

          <section className="workspace" id="checker" aria-label="Instagram checker">
            <div className="panel input-panel">
              <div className="panel-head">
                <div>
                  <h2>Masukkan data</h2>
                  <p className="panel-subtitle">Upload JSON atau paste username per baris.</p>
                </div>
                <span className="limit-pill">Max 50MB</span>
              </div>

              <label className="field-group">
                <span className="field-title">Followers</span>
                <input className="dropzone" type="file" accept=".json,application/json,text/plain" aria-label="Upload followers JSON" onChange={(event) => handleFile(event, "followers")} />
                <textarea className="textarea" value={followersText} onChange={(event) => setFollowersText(event.target.value)} placeholder="followers_1.json atau username per baris" />
              </label>

              <label className="field-group">
                <span className="field-title">Following</span>
                <input className="dropzone" type="file" accept=".json,application/json,text/plain" aria-label="Upload following JSON" onChange={(event) => handleFile(event, "following")} />
                <textarea className="textarea" value={followingText} onChange={(event) => setFollowingText(event.target.value)} placeholder="following.json atau username per baris" />
              </label>

              <button className="action-button" onClick={processData} type="button">Proses data lokal</button>
              <p className="privacy-note">File dibaca di browser. Tidak ada request saat proses data.</p>
              <p className="error-text" aria-live="polite">{error}</p>
            </div>

            <div className="panel result-panel" aria-live="polite">
              <div className="panel-head">
                <div>
                  <h2>Hasil</h2>
                  <p className="panel-subtitle">Pilih kategori, cari username, lalu export.</p>
                </div>
                {result && <span className="count-pill">{result.notFollowingBack.length} tidak balik</span>}
              </div>

              {!result ? (
                <div className="empty-state">
                  <p>Hasil muncul setelah followers dan following diproses.</p>
                </div>
              ) : (
                <>
                  <div className="stats-grid">
                    {[
                      ["Followers", result.followers.length],
                      ["Following", result.following.length],
                      ["Tidak balik", result.notFollowingBack.length],
                      ["Mutual", result.mutuals.length],
                      ["Fans", result.fans.length],
                    ].map(([label, value]) => (
                      <div className="stat" key={label}>
                        <p className="stat-label">{label}</p>
                        <p className="stat-value">{value}</p>
                      </div>
                    ))}
                  </div>

                  {result.duplicates > 0 && <p className="duplicate-note">{result.duplicates} duplikat diabaikan.</p>}

                  <div className="result-toolbar" role="tablist" aria-label="Kategori hasil">
                    {tabs.map((tab) => (
                      <button className={`tab-button ${activeTab === tab.key ? "active" : ""}`} key={tab.key} onClick={() => setActiveTab(tab.key)} role="tab" aria-selected={activeTab === tab.key} type="button">
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <div className="result-actions">
                    <input className="search-input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={`Cari ${activeLabel.toLowerCase()}`} aria-label="Cari username" />
                    <button className="export-button" onClick={() => exportResult("csv")} type="button">CSV</button>
                    <button className="export-button" onClick={() => exportResult("txt")} type="button">TXT</button>
                  </div>

                  <div className="result-list">
                    {visibleUsers.length ? (
                      visibleUsers.map((username) => (
                        <a className="result-row" href={`https://instagram.com/${username}`} key={username} target="_blank" rel="noreferrer">
                          <span className="username">@{username}</span>
                          <span className="profile-link">Buka profil</span>
                        </a>
                      ))
                    ) : (
                      <p className="empty-state">{tabs.find((tab) => tab.key === activeTab)?.empty}</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="panel tutorial-panel" id="tutorial" aria-labelledby="tutorial-title">
            <h2 id="tutorial-title">Cara ambil data Instagram</h2>
            <div className="steps">
              {[
                "Buka Accounts Center, lalu Your information and permissions.",
                "Pilih Download your information, lalu minta data followers dan following dalam format JSON.",
                "Upload followers_1.json dan following.json di checker ini.",
              ].map((step, index) => (
                <div className="step" key={step}>
                  <span>0{index + 1}</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}


