"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Card, CardContent } from "~/components/ui/card"
import { X } from "lucide-react"
import { addExperience } from "~/app/api/profile-edit/actions"
import { useRouter } from "next/navigation"

interface AddExperienceFormProps {
  profileId: number
  onCancel: () => void
}

export function AddExperienceForm({ profileId, onCancel }: AddExperienceFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const data = {
      role: formData.get("role") as string,
      company: formData.get("company") as string,
      period: formData.get("period") as string,
      description: formData.get("description") as string,
    }

    try {
      await addExperience(profileId, data)
      router.refresh()
      onCancel()
    } catch (error) {
      console.error("Failed to add experience:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Add Experience</h3>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              Role
            </label>
            <Input id="role" name="role" required placeholder="e.g. Software Engineer" />
          </div>

          <div className="space-y-2">
            <label htmlFor="company" className="text-sm font-medium">
              Company
            </label>
            <Input id="company" name="company" required placeholder="e.g. Acme Inc." />
          </div>

          <div className="space-y-2">
            <label htmlFor="period" className="text-sm font-medium">
              Period
            </label>
            <Input id="period" name="period" required placeholder="e.g. Jan 2020 - Present" />
          </div>

          <div className="space-y-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe your responsibilities and achievements"
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Experience"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
