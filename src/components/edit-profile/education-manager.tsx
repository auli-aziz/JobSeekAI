"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Card, CardContent } from "~/components/ui/card"
import { X, Plus, Edit } from "lucide-react"
import { addEducation, updateEducation, deleteEducation } from "~/app/api/profile-edit/actions"
import { useToast } from "~/hooks/use-toast"

interface Education {
  id: number
  degree: string
  institution: string
  period: string
}

interface EducationManagerProps {
  profileId: number
  educations: Education[]
}

export function EducationManager({ profileId, educations }: EducationManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    degree: "",
    institution: "",
    period: "",
  })
  // const router = useRouter()
  const { toast } = useToast()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function startEditing(education: Education) {
    setEditingId(education.id)
    setFormData({
      degree: education.degree,
      institution: education.institution,
      period: education.period,
    })
    setShowAddForm(false)
  }

  function cancelEditing() {
    setEditingId(null)
    setFormData({
      degree: "",
      institution: "",
      period: "",
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingId !== null) {
        await updateEducation(editingId, formData)
        toast({
          title: "Education updated",
          description: "Your education has been updated successfully.",
        })
        setEditingId(null)
      } else {
        await addEducation(profileId, formData)
        toast({
          title: "Education added",
          description: "Your education has been added successfully.",
        })
        setShowAddForm(false)
      }
      setFormData({ degree: "", institution: "", period: "" })
    } catch (error) {
      console.error("Failed to save education:", error)
      toast({
        title: "Error",
        description: "Failed to save education. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(educationId: number) {
    setIsDeleting(educationId)
    try {
      await deleteEducation(educationId)
      toast({
        title: "Education deleted",
        description: "Your education has been removed successfully.",
      })
    } catch (error) {
      console.error("Failed to delete education:", error)
      toast({
        title: "Error",
        description: "Failed to delete education. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Education</h3>
        {!showAddForm && editingId === null && (
          <Button size="sm" onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        )}
      </div>

      {(showAddForm || editingId !== null) && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">{editingId !== null ? "Edit Education" : "Add Education"}</h4>
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
                <label htmlFor="degree" className="text-sm font-medium">
                  Degree
                </label>
                <Input
                  id="degree"
                  name="degree"
                  value={formData.degree}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Bachelor of Science in Computer Science"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="institution" className="text-sm font-medium">
                  Institution
                </label>
                <Input
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Stanford University"
                />
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
                  placeholder="e.g. 2016 - 2020"
                  required
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
                    <>{editingId !== null ? "Update" : "Add"} Education</>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {educations && educations.length > 0 ? (
        <div className="space-y-4">
          {educations.map((edu) => (
            <Card key={edu.id} className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">{edu.degree}</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing(edu)}
                      disabled={editingId !== null || showAddForm}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(edu.id)}
                      disabled={isDeleting === edu.id || editingId !== null || showAddForm}
                    >
                      {isDeleting === edu.id ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  {edu.institution} · {edu.period}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-slate-500">No education added yet.</p>
      )}
    </div>
  )
}
