/**
 * Supabase HTTP PostgREST Client
 * Uses native fetch() against NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 * Works seamlessly in Node.js & Next.js without requiring external package installations.
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://mlnyoxxrazvlsnldycve.supabase.co";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function getHeaders(prefer: string = "") {
  const headers: Record<string, string> = {
    "apikey": SUPABASE_SERVICE_KEY,
    "Authorization": `Bearer ${SUPABASE_SERVICE_KEY}`,
    "Content-Type": "application/json"
  };
  if (prefer) {
    headers["Prefer"] = prefer;
  }
  return headers;
}

export async function supabaseSelect<T = any>(
  table: string,
  query: string = "*",
  limit?: number
): Promise<T[] | null> {
  if (!SUPABASE_SERVICE_KEY) return null;

  try {
    let url = `${SUPABASE_URL}/rest/v1/${table}?select=${encodeURIComponent(query)}`;
    if (limit) {
      url += `&limit=${limit}`;
    }

    const res = await fetch(url, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store"
    });

    if (!res.ok) {
      console.warn(`[Supabase Select] Table '${table}' returned ${res.status}: ${res.statusText}`);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error(`[Supabase Select] Error querying table '${table}':`, err);
    return null;
  }
}

export async function supabaseInsert<T = any>(
  table: string,
  record: any
): Promise<T | null> {
  if (!SUPABASE_SERVICE_KEY) return null;

  try {
    const url = `${SUPABASE_URL}/rest/v1/${table}`;
    const res = await fetch(url, {
      method: "POST",
      headers: getHeaders("return=representation"),
      body: JSON.stringify(record)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`[Supabase Insert] Table '${table}' returned ${res.status}: ${errText}`);
      return null;
    }

    const data = await res.json();
    return Array.isArray(data) ? data[0] : data;
  } catch (err) {
    console.error(`[Supabase Insert] Error inserting into table '${table}':`, err);
    return null;
  }
}

export async function supabaseUpsert<T = any>(
  table: string,
  record: any,
  onConflictKey: string
): Promise<T | null> {
  if (!SUPABASE_SERVICE_KEY) return null;

  try {
    const url = `${SUPABASE_URL}/rest/v1/${table}?on_conflict=${onConflictKey}`;
    const res = await fetch(url, {
      method: "POST",
      headers: getHeaders("resolution=merge-duplicates,return=representation"),
      body: JSON.stringify(record)
    });

    if (!res.ok) {
      const errText = await res.text();
      console.warn(`[Supabase Upsert] Table '${table}' returned ${res.status}: ${errText}`);
      return null;
    }

    const data = await res.json();
    return Array.isArray(data) ? data[0] : data;
  } catch (err) {
    console.error(`[Supabase Upsert] Error upserting table '${table}':`, err);
    return null;
  }
}
