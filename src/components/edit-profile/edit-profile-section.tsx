"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Card, CardContent } from "~/components/ui/card"
import { AddExperienceForm } from "./add-experience-form"
import { AddEducationForm } from "./add-education-form"
import { AddCertificationForm } from "./add-certification-form"
import { Plus, Edit, X } from "lucide-react"

interface Skill {
  id: number
  name: string
}

interface Experience {
  id: number
  profileDetailsId: number
  role: string
  company: string
  period: string
  description: string | null
}

interface Education {
  id: number
  profileDetailsId: number
  degree: string
  institution: string
  period: string
}

interface Certification {
  id: number
  profileDetailsId: number
  name: string
  issuer: string | null
  date: string | null
}

interface EditProfileSectionProps {
  profileId: number
  skills: Skill[]
  experiences: Experience[]
  educations: Education[]
  certifications: Certification[]
}


interface EditProfileSectionProps {
  profileId: number
  skills: Skill[]
  experiences: Experience[]
  educations: Education[]
  certifications: Certification[]
}


export function EditProfileSection({
  profileId,
  skills,
  experiences,
  educations,
  certifications,
}: EditProfileSectionProps) {
  const [showAddExperience, setShowAddExperience] = useState(false)
  const [showAddEducation, setShowAddEducation] = useState(false)
  const [showAddCertification, setShowAddCertification] = useState(false)
  const [newSkill, setNewSkill] = useState("")

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {skills && skills.length > 0 ? (
              skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full">
                  <span>{skill.name}</span>
                  <button type="button" className="text-slate-500 hover:text-slate-700">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No skills added yet.</p>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Add a new skill"
              className="max-w-xs"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
            />
            <Button variant="outline" size="sm">
              Add
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Experience</h3>
            <Button size="sm" onClick={() => setShowAddExperience(true)} disabled={showAddExperience}>
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </div>

          {showAddExperience && (
            <div className="mb-4">
              <AddExperienceForm profileId={profileId} onCancel={() => setShowAddExperience(false)} />
            </div>
          )}

          {experiences && experiences.length > 0 ? (
            <div className="space-y-4">
              {experiences.map((exp) => (
                <Card key={exp.id} className="border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">{exp.role}</h4>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">
                      {exp.company} · {exp.period}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No experience added yet.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Education</h3>
            <Button size="sm" onClick={() => setShowAddEducation(true)} disabled={showAddEducation}>
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </div>

          {showAddEducation && (
            <div className="mb-4">
              <AddEducationForm profileId={profileId} onCancel={() => setShowAddEducation(false)} />
            </div>
          )}

          {educations && educations.length > 0 ? (
            <div className="space-y-4">
              {educations.map((edu) => (
                <Card key={edu.id} className="border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">{edu.degree}</h4>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                          <X className="h-4 w-4" />
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
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Certifications</h3>
            <Button size="sm" onClick={() => setShowAddCertification(true)} disabled={showAddCertification}>
              <Plus className="h-4 w-4 mr-2" />
              Add Certification
            </Button>
          </div>

          {showAddCertification && (
            <div className="mb-4">
              <AddCertificationForm profileId={profileId} onCancel={() => setShowAddCertification(false)} />
            </div>
          )}

          {certifications && certifications.length > 0 ? (
            <div className="space-y-4">
              {certifications.map((cert) => (
                <Card key={cert.id} className="border-slate-200">
                  <CardContent className="p-4">
                    <div className="flex justify-between mb-2">
                      <h4 className="font-medium">{cert.name}</h4>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">
                      {cert.issuer} · {cert.date}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No certifications added yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
