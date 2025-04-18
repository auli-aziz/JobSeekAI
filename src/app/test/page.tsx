import { getJobAndResume } from "~/server/db/queries"


export default async function Page() {
  const similiartyScore = await getJobAndResume(1185979, "402c091e-db8c-45f4-9b31-a5f13260ef96")
  console.log(similiartyScore)

  return (
    <p>berrr patapim</p>
  )
}

