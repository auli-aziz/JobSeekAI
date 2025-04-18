"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Card, CardContent } from "~/components/ui/card"
import { X } from "lucide-react"
import { addEducation } from "~/app/api/profile-edit/actions"
import { useRouter } from "next/navigation"

interface AddEducationFormProps {
  profileId: number
  onCancel: () => void
}

export function AddEducationForm({ profileId, onCancel }: AddEducationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const data = {
      degree: formData.get("degree") as string,
      institution: formData.get("institution") as string,
      period: formData.get("period") as string,
    }

    try {
      await addEducation(profileId, data)
      router.refresh()
      onCancel()
    } catch (error) {
      console.error("Failed to add education:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Add Education</h3>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="degree" className="text-sm font-medium">
              Degree
            </label>
            <Input id="degree" name="degree" required placeholder="e.g. Bachelor of Science in Computer Science" />
          </div>

          <div className="space-y-2">
            <label htmlFor="institution" className="text-sm font-medium">
              Institution
            </label>
            <Input id="institution" name="institution" required placeholder="e.g. Stanford University" />
          </div>

          <div className="space-y-2">
            <label htmlFor="period" className="text-sm font-medium">
              Period
            </label>
            <Input id="period" name="period" required placeholder="e.g. 2016 - 2020" />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Education"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
