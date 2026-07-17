import { fetchOpenJobs } from "@/lib/jobs";
import { JobsTable } from "@/components/jobs-table";

// Re-fetch from Supabase at most every 5 minutes. Data updates flow through
// automatically — the site only rebuilds when the code changes.
export const revalidate = 300;

export default async function Home() {
  const jobs = await fetchOpenJobs();
  const tiered = jobs.filter((j) => j.tier !== null).length;

  return (
    <>
      <header className="border-b border-hairline">
        <div className="mx-auto flex h-12 w-full max-w-6xl items-center px-4">
          <span className="text-sm">
            <span className="font-semibold">Tech</span> Internships
          </span>
          <span className="ml-auto text-xs text-ink-muted">
            Refreshed every few hours
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16">
        <section className="py-12">
          <h1 className="max-w-3xl text-[2.625rem] font-light leading-[1.2] tracking-normal">
            Tech internships for Summer 2027 &amp; Fall 2026
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-normal tracking-normal text-ink-muted">
            A live feed from public ATS job boards Greenhouse, Lever, Ashby, Workday, and
            more. {jobs.length} roles open right now, {tiered} at target companies. Postings
            disappear two weeks after they close.
          </p>
        </section>
        <JobsTable jobs={jobs} />
      </main>

      <footer className="mt-16 bg-inverse-canvas">
        <div className="mx-auto w-full max-w-6xl px-4 py-12">
          <p className="text-sm font-semibold text-inverse-ink">Reading the visa column</p>
          <p className="mt-2 max-w-2xl text-sm text-inverse-ink-muted">
            🛂✓ sponsorship offered · 🚫 no sponsorship · 🇺🇸 U.S. citizens only · — unstated
          </p>
          <p className="mt-6 text-xs text-inverse-ink-muted">
            Data is collected from each company&apos;s own public job feed.
          </p>
        </div>
      </footer>
    </>
  );
}
