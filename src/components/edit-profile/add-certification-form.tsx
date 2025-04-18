"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Card, CardContent } from "~/components/ui/card"
import { X } from "lucide-react"
import { addCertification } from "~/app/api/profile-edit/actions"
import { useRouter } from "next/navigation"

interface AddCertificationFormProps {
  profileId: number
  onCancel: () => void
}

export function AddCertificationForm({ profileId, onCancel }: AddCertificationFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)

    const formData = new FormData(event.currentTarget)
    const data = {
      name: formData.get("name") as string,
      issuer: formData.get("issuer") as string,
      date: formData.get("date") as string,
    }

    try {
      await addCertification(profileId, data)
      router.refresh()
      onCancel()
    } catch (error) {
      console.error("Failed to add certification:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Add Certification</h3>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              Certification Name
            </label>
            <Input id="name" name="name" required placeholder="e.g. AWS Certified Solutions Architect" />
          </div>

          <div className="space-y-2">
            <label htmlFor="issuer" className="text-sm font-medium">
              Issuer
            </label>
            <Input id="issuer" name="issuer" placeholder="e.g. Amazon Web Services" />
          </div>

          <div className="space-y-2">
            <label htmlFor="date" className="text-sm font-medium">
              Date
            </label>
            <Input id="date" name="date" placeholder="e.g. May 2022" />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Certification"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
