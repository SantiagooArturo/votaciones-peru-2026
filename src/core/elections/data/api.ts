import type { ElectionData } from "../domain/types";

/**
 * Fetches election data from our own API proxy (hides ONPE endpoints from client).
 * Used by both server component (initial load) and client (polling).
 */
export async function fetchElectionData(baseUrl?: string): Promise<ElectionData> {
    const url = baseUrl
        ? `${baseUrl}/api/elections`
        : `${process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3005"}/api/elections`;

    const res = await fetch(url, { cache: "no-store" });
    const json = await res.json();

    return {
        ...json,
        lastUpdated: new Date(json.lastUpdated),
    };
}
