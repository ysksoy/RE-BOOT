// Server Component: Supabaseからデータを取得してクライアントコンポーネントに渡す
import { fetchJobs } from "@/lib/fetchJobs";
import JobsPage from "./JobsPage";

export const revalidate = 3600; // 1時間ごとに再検証（ISR）

export default async function Home() {
  const jobs = await fetchJobs();
  return <JobsPage jobs={jobs} />;
}
