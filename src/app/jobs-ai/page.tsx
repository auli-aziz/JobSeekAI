import JobDashboard from "~/components/jobs/AI/job-dashboard"
import { auth } from "~/server/auth"
import { hasResume } from "~/server/db/queries";
export default async function Home() {
  //make sure in this page user have auth
  const session = await auth();
  if (!session) {
    console.log("User unidentified")
  }
  const userId = session ? session.user.id : "something"
  const hasResumeVector = await hasResume(userId ?? "")



  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <JobDashboard hasResumeVector={hasResumeVector} userId={userId} />
    </main>
  )
}

