"use client";

import { useMemo, useState } from "react";
import type { Job } from "@/lib/jobs";

const TIER_STYLES: Record<number, string> = {
  1: "bg-ink text-inverse-ink",
  2: "bg-surface-2 text-ink",
  3: "bg-surface-1 text-ink-muted",
};

// Carbon text input: gray field, square corners, thin bottom rule that
// becomes a 2px primary underline on focus (border + inset shadow).
const FIELD =
  "border-b border-ink-subtle bg-surface-1 px-4 py-1.5 text-sm text-ink outline-none " +
  "placeholder:text-ink-subtle focus:border-primary focus:shadow-[inset_0_-1px_0_0_var(--color-primary)]";

const LOCATION_MAX = 40;

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}

function daysAgo(iso: string | null): number | null {
  if (!iso) return null;
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}

function Age({ iso }: { iso: string | null }) {
  if (!iso) return <span className="text-ink-subtle">—</span>;
  const date = new Date(iso);
  return <span>{`${date.getMonth() + 1}/${date.getDate()}`}</span>;
}

export function JobsTable({ jobs }: { jobs: Job[] }) {
  const [query, setQuery] = useState("");
  const [season, setSeason] = useState("all");
  const [category, setCategory] = useState("all");
  const [tier, setTier] = useState("all");
  const [f1Only, setF1Only] = useState(false);

  const seasons = useMemo(
    () => [...new Set(jobs.map((j) => j.season).filter(Boolean))] as string[],
    [jobs],
  );
  const categories = useMemo(
    () => [...new Set(jobs.map((j) => j.category).filter(Boolean))].sort() as string[],
    [jobs],
  );

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs
      .filter((j) => {
        if (q && !`${j.company} ${j.title} ${j.location}`.toLowerCase().includes(q)) return false;
        if (season !== "all" && j.season !== season) return false;
        if (category !== "all" && j.category !== category) return false;
        if (tier === "tiered" && j.tier === null) return false;
        if (["1", "2", "3"].includes(tier) && j.tier !== Number(tier)) return false;
        if (f1Only && (j.sponsorship === "citizens-only" || j.sponsorship === "no-sponsorship"))
          return false;
        return true;
      })
      .sort(
        (a, b) => new Date(b.first_seen_at).getTime() - new Date(a.first_seen_at).getTime(),
      );
  }, [jobs, query, season, category, tier, f1Only]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search company, role, location…"
          className={`w-64 ${FIELD}`}
        />
        <select
          value={season}
          onChange={(e) => setSeason(e.target.value)}
          className={FIELD}
        >
          <option value="all">All cycles</option>
          {seasons.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={FIELD}
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value)}
          className={FIELD}
        >
          <option value="all">All companies</option>
          <option value="tiered">My targets only</option>
          <option value="1">Tier 1</option>
          <option value="2">Tier 2</option>
          <option value="3">Tier 3</option>
        </select>
        <label className="flex cursor-pointer items-center gap-1.5 text-sm">
          <input
            type="checkbox"
            checked={f1Only}
            onChange={(e) => setF1Only(e.target.checked)}
            className="accent-primary"
          />
          F-1 friendly
        </label>
        <span className="ml-auto text-sm text-ink-muted">
          {rows.length} of {jobs.length} open roles
        </span>
      </div>

      <div className="overflow-x-auto border border-hairline">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-hairline bg-surface-1">
            <tr>
              <th className="px-4 py-3 font-semibold">Company</th>
              <th className="px-4 py-3 font-semibold">Role</th>
              <th className="px-4 py-3 font-semibold">Location</th>
              <th className="px-4 py-3 font-semibold">Cycle</th>
              <th className="px-4 py-3 font-semibold">Spotted</th>
              <th className="px-4 py-3 font-semibold">Visa</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline">
            {rows.map((j) => (
              <tr key={j.id} className="hover:bg-surface-1">
                <td className="whitespace-nowrap px-4 py-2.5 font-semibold">
                  {j.url ? (
                    <a
                      href={j.url}
                      target="_blank"
                      rel="noreferrer"
                      className="hover:text-primary hover:underline"
                    >
                      {j.company}
                    </a>
                  ) : (
                    j.company
                  )}
                  {j.tier !== null && (
                    <span
                      className={`ml-2 px-1.5 py-0.5 text-[10px] font-semibold ${TIER_STYLES[j.tier] ?? ""}`}
                    >
                      T{j.tier}
                    </span>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  {j.title}
                  {(daysAgo(j.first_seen_at) ?? 99) < 2 && (
                    <span className="ml-2 bg-success-tint px-1.5 py-0.5 text-[10px] font-semibold text-success-ink">
                      New
                    </span>
                  )}
                </td>
                <td
                  className="whitespace-nowrap px-4 py-2.5 text-ink-muted"
                  title={j.location.length > LOCATION_MAX ? j.location : undefined}
                >
                  {truncate(j.location, LOCATION_MAX)}
                </td>
                <td className="whitespace-nowrap px-4 py-2.5">{j.season ?? "—"}</td>
                <td className="whitespace-nowrap px-4 py-2.5 text-ink-muted">
                  <Age iso={j.first_seen_at} />
                </td>
                <td className="whitespace-nowrap px-4 py-2.5" title={j.sponsorship}>
                  {j.sponsorship === "offers" && "🛂✓"}
                  {j.sponsorship === "citizens-only" && "🇺🇸"}
                  {j.sponsorship === "no-sponsorship" && "🚫"}
                  {j.sponsorship === "unknown" && <span className="text-ink-subtle">—</span>}
                </td>
                <td className="px-4 py-2.5">
                  {j.url && (
                    <a
                      href={j.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-primary hover:text-primary-hover hover:underline"
                    >
                      Apply
                    </a>
                  )}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-ink-muted">
                  {jobs.length === 0
                    ? "No data yet — check the Supabase env vars and that the scraper has synced a run."
                    : "Nothing matches these filters."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
