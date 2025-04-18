  // app/profile/edit/page.tsx or similar path

  import { redirect } from "next/navigation"
  import { auth } from "~/server/auth"
  import { getProfileByUserId, updateProfileDetails } from "~/server/db/queries"
  import { Input } from "~/components/ui/input"
  import { Textarea } from "~/components/ui/textarea"
  import { Button } from "~/components/ui/button"

  export default async function EditProfilePage() {
    const session = await auth()
    if (!session) return redirect("/login")

    const user = session.user
    const profile = await getProfileByUserId(user.id)

    if (!profile) {
      return <div>Profile not found</div>
    }

    return (
      <form
        className="max-w-md mx-auto mt-10 space-y-4"
        action={async (formData) => {
          "use server"

          const data = {
            title: formData.get("title") as string,
            location: formData.get("location") as string,
            phone: formData.get("phone") as string,
            about: formData.get("about") as string,
          }

          await updateProfileDetails(user.id, data)
          redirect("/profile")
        }}
      >
        <h1 className="text-2xl font-semibold">Edit Profile</h1>

        <label className="block">
          <span className="text-sm text-gray-600">Title</span>
          <Input name="title" defaultValue={profile.title ?? ""} />
        </label>

        <label className="block">
          <span className="text-sm text-gray-600">Location</span>
          <Input name="location" defaultValue={profile.location ?? ""} />
        </label>

        <label className="block">
          <span className="text-sm text-gray-600">Phone</span>
          <Input name="phone" defaultValue={profile.phone ?? ""} />
        </label>

        <label className="block">
          <span className="text-sm text-gray-600">About</span>
          <Textarea name="about" defaultValue={profile.about ?? ""} />
        </label>

        <Button type="submit">Save Changes</Button>
      </form>
    )
  }
