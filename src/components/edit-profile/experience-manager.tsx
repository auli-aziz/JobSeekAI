"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Card, CardContent } from "~/components/ui/card"
import { X, Plus, Edit } from "lucide-react"
import { addExperience, updateExperience, deleteExperience } from "~/app/api/profile-edit/actions"
import { useToast } from "~/hooks/use-toast"

interface Experience {
  id: number
  role: string
  company: string
  period: string
  description?: string
}

interface ExperienceManagerProps {
  profileId: number
  experiences: Experience[]
}

export function ExperienceManager({ profileId, experiences }: ExperienceManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    role: "",
    company: "",
    period: "",
    description: "",
  })
  // const router = useRouter()
  const { toast } = useToast()

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function startEditing(experience: Experience) {
    setEditingId(experience.id)
    setFormData({
      role: experience.role,
      company: experience.company,
      period: experience.period,
      description: experience.description ?? "",
    })
    setShowAddForm(false)
  }

  function cancelEditing() {
    setEditingId(null)
    setFormData({
      role: "",
      company: "",
      period: "",
      description: "",
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingId !== null) {
        await updateExperience(editingId, formData)
        toast({
          title: "Experience updated",
          description: "Your experience has been updated successfully.",
        })
        setEditingId(null)
      } else {
        await addExperience(profileId, formData)
        toast({
          title: "Experience added",
          description: "Your experience has been added successfully.",
        })
        setShowAddForm(false)
      }
      setFormData({ role: "", company: "", period: "", description: "" })
    } catch (error) {
      console.error("Failed to save experience:", error)
      toast({
        title: "Error",
        description: "Failed to save experience. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(experienceId: number) {
    setIsDeleting(experienceId)
    try {
      await deleteExperience(experienceId)
      toast({
        title: "Experience deleted",
        description: "Your experience has been removed successfully.",
      })
    } catch (error) {
      console.error("Failed to delete experience:", error)
      toast({
        title: "Error",
        description: "Failed to delete experience. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Experience</h3>
        {!showAddForm && editingId === null && (
          <Button size="sm" onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        )}
      </div>

      {(showAddForm || editingId !== null) && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">{editingId !== null ? "Edit Experience" : "Add Experience"}</h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddForm(false)
                  cancelEditing()
                }}
              >
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
                  className="min-h-[100px]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false)
                    cancelEditing()
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      {editingId !== null ? "Updating..." : "Adding..."}
                    </span>
                  ) : (
                    <>{editingId !== null ? "Update" : "Add"} Experience</>
                  )}
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
                      onClick={() => startEditing(exp)}
                      disabled={editingId !== null || showAddForm}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(exp.id)}
                      disabled={isDeleting === exp.id || editingId !== null || showAddForm}
                    >
                      {isDeleting === exp.id ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
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
