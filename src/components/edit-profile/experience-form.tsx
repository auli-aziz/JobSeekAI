"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Card, CardContent } from "~/components/ui/card"
import { X, Plus } from "lucide-react"
import { addExperience, deleteExperience } from "~/app/api/profile-edit/actions"
import { useRouter } from "next/navigation"

interface Experience {
  id: number
  role: string
  company: string
  period: string
  description?: string
}

interface ExperienceFormProps {
  profileId: number
  experiences: Experience[]
}

export function ExperienceForm({ profileId, experiences }: ExperienceFormProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    period: "",
    description: "",
  })
  const router = useRouter()

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await addExperience(profileId, formData)
      setFormData({ role: "", company: "", period: "", description: "" })
      setShowAddForm(false)
      router.refresh()
    } catch (error) {
      console.error("Failed to add experience:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(experienceId: number) {
    try {
      await deleteExperience(experienceId)
      router.refresh()
    } catch (error) {
      console.error("Failed to delete experience:", error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Experience</h3>
        <Button size="sm" onClick={() => setShowAddForm(true)} disabled={showAddForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">Add Experience</h4>
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">
                  Role
                </label>
                <Input id="role" name="role" value={formData.role} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <label htmlFor="company" className="text-sm font-medium">
                  Company
                </label>
                <Input id="company" name="company" value={formData.company} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <label htmlFor="period" className="text-sm font-medium">
                  Period
                </label>
                <Input
                  id="period"
                  name="period"
                  value={formData.period}
                  onChange={handleChange}
                  placeholder="e.g. Jan 2020 - Present"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your responsibilities and achievements"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Adding..." : "Add Experience"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {experiences && experiences.length > 0 ? (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <Card key={exp.id} className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">{exp.role}</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(exp.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  {exp.company} · {exp.period}
                </p>
                {exp.description && <p className="text-sm text-slate-600 mt-2">{exp.description}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-slate-500">No experience added yet.</p>
      )}
    </div>
  )
}
