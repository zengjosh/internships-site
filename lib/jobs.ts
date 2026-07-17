import { createClient } from "@supabase/supabase-js";

export type Job = {
  id: string;
  company: string;
  title: string;
  location: string;
  url: string | null;
  category: string | null;
  season: string | null;
  sponsorship: "offers" | "no-sponsorship" | "citizens-only" | "unknown";
  tier: number | null;
  posted_at: string | null;
  first_seen_at: string;
};

const COLUMNS =
  "id, company, title, location, url, category, season, sponsorship, tier, posted_at, first_seen_at";

/** All open roles, newest-spotted first. Returns [] when the Supabase env
 *  vars are missing or the query fails, so the page always renders. */
export async function fetchOpenJobs(): Promise<Job[]> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return [];
  try {
    const supabase = createClient(url, key);
    const { data, error } = await supabase
      .from("jobs")
      .select(COLUMNS)
      .eq("is_open", true)
      .order("first_seen_at", { ascending: false })
      .limit(2000);
    if (error) return [];
    return (data as Job[]) ?? [];
  } catch {
    return [];
  }
}
