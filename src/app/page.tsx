import { fetchElectionData } from "@/core/elections/data/api";
import { ElectionDashboard } from "@/core/elections/client/ui/pages/election-dashboard";

export const dynamic = "force-dynamic";

/**
 * Home page — Election results dashboard.
 * Server component that fetches data and passes to client for live updates.
 */
export default async function HomePage() {
    const data = await fetchElectionData();

    return <ElectionDashboard initialData={data} />;
}
