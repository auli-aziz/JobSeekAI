"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Save } from "lucide-react"
import { updateProfileDetails } from "~/app/api/profile-edit/actions"
import { useToast } from "~/hooks/use-toast"

interface ProfileFormProps {
  userId: string
  initialData: {
    name?: string
    email?: string
    title?: string
    location?: string
    phone?: string
    about?: string
  }
}

export function ProfileForm({ userId, initialData }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  async function handleSubmit(formData: FormData) {
    setIsSubmitting(true)

    try {
      const data = {
        title: formData.get("title") as string,
        location: formData.get("location") as string,
        phone: formData.get("phone") as string,
        about: formData.get("about") as string,
      }

      await updateProfileDetails(userId, data)

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Failed to update profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Name
            </label>
            <Input id="name" name="name" defaultValue={initialData?.name ?? ""} disabled className="bg-slate-50" />
            <p className="text-xs text-slate-500">Name cannot be changed</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input id="email" name="email" defaultValue={initialData?.email ?? ""} disabled className="bg-slate-50" />
            <p className="text-xs text-slate-500">Email cannot be changed</p>
          </div>

          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              name="title"
              defaultValue={initialData?.title ?? ""}
              placeholder="e.g. Software Engineer"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Location
            </label>
            <Input
              id="location"
              name="location"
              defaultValue={initialData?.location ?? ""}
              placeholder="e.g. San Francisco, CA"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              Phone
            </label>
            <Input
              id="phone"
              name="phone"
              defaultValue={initialData?.phone ?? ""}
              placeholder="e.g. +1 (555) 123-4567"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">About</h3>
        <Textarea
          id="about"
          name="about"
          defaultValue={initialData?.about ?? ""}
          placeholder="Tell us about yourself"
          className="min-h-[150px]"
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="submit" className="gap-2" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Saving...
            </span>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
