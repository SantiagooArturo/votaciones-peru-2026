import { fetchElectionData } from "@/core/elections/data/api";
import { ElectionDashboard } from "@/core/elections/client/ui/pages/election-dashboard";

/**
 * Home page — Election results dashboard.
 * Server component that fetches initial data and passes to client for live updates.
 */
export default async function HomePage() {
    const data = await fetchElectionData();

    return <ElectionDashboard initialData={data} />;
}
