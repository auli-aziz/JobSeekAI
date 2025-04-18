"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Card, CardContent } from "~/components/ui/card"
import { X, Plus, Edit } from "lucide-react"
import { addCertification, updateCertification, deleteCertification } from "~/app/api/profile-edit/actions"
import { useToast } from "~/hooks/use-toast"

interface Certification {
  id: number
  name: string
  issuer?: string
  date?: string
}

interface CertificationManagerProps {
  profileId: number
  certifications: Certification[]
}

export function CertificationManager({ profileId, certifications }: CertificationManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    issuer: "",
    date: "",
  })
  // const router = useRouter()
  const { toast } = useToast()

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  function startEditing(certification: Certification) {
    setEditingId(certification.id)
    setFormData({
      name: certification.name,
      issuer: certification.issuer ?? "",
      date: certification.date ?? "",
    })
    setShowAddForm(false)
  }

  function cancelEditing() {
    setEditingId(null)
    setFormData({
      name: "",
      issuer: "",
      date: "",
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (editingId !== null) {
        await updateCertification(editingId, formData)
        toast({
          title: "Certification updated",
          description: "Your certification has been updated successfully.",
        })
        setEditingId(null)
      } else {
        await addCertification(profileId, formData)
        toast({
          title: "Certification added",
          description: "Your certification has been added successfully.",
        })
        setShowAddForm(false)
      }
      setFormData({ name: "", issuer: "", date: "" })
    } catch (error) {
      console.error("Failed to save certification:", error)
      toast({
        title: "Error",
        description: "Failed to save certification. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleDelete(certificationId: number) {
    setIsDeleting(certificationId)
    try {
      await deleteCertification(certificationId)
      toast({
        title: "Certification deleted",
        description: "Your certification has been removed successfully.",
      })
    } catch (error) {
      console.error("Failed to delete certification:", error)
      toast({
        title: "Error",
        description: "Failed to delete certification. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Certifications</h3>
        {!showAddForm && editingId === null && (
          <Button size="sm" onClick={() => setShowAddForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Certification
          </Button>
        )}
      </div>

      {(showAddForm ?? editingId !== null) && (
        <Card className="mb-4">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h4 className="font-medium">{editingId !== null ? "Edit Certification" : "Add Certification"}</h4>
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
                <label htmlFor="name" className="text-sm font-medium">
                  Certification Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. AWS Certified Solutions Architect"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="issuer" className="text-sm font-medium">
                  Issuer
                </label>
                <Input
                  id="issuer"
                  name="issuer"
                  value={formData.issuer}
                  onChange={handleChange}
                  placeholder="e.g. Amazon Web Services"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="date" className="text-sm font-medium">
                  Date
                </label>
                <Input
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  placeholder="e.g. May 2022"
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
                    <>{editingId !== null ? "Update" : "Add"} Certification</>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {certifications && certifications.length > 0 ? (
        <div className="space-y-4">
          {certifications.map((cert) => (
            <Card key={cert.id} className="border-slate-200">
              <CardContent className="p-4">
                <div className="flex justify-between mb-2">
                  <h4 className="font-medium">{cert.name}</h4>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing(cert)}
                      disabled={editingId !== null || showAddForm}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(cert.id)}
                      disabled={isDeleting === cert.id || editingId !== null || showAddForm}
                    >
                      {isDeleting === cert.id ? (
                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-slate-600">
                  {cert.issuer ? `${cert.issuer} · ` : ""}
                  {cert.date ?? "No date provided"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-slate-500">No certifications added yet.</p>
      )}
    </div>
  )
}
