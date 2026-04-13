import { NextResponse } from "next/server";
import { fetchElectionData } from "@/core/elections/data/api";

/**
 * API route that proxies ONPE data for client-side polling.
 * Hides actual ONPE endpoints from the browser's network tab.
 */
export async function GET() {
    const data = await fetchElectionData();
    return NextResponse.json(data);
}
