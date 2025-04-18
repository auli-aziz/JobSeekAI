"use client"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { X, Plus } from "lucide-react"
import { addSkill, deleteSkill } from "~/app/api/profile-edit/actions"
// import { useRouter } from "next/navigation"
import { useToast } from "~/hooks/use-toast"

interface Skill {
  id: number
  name: string
}

interface SkillManagerProps {
  profileId: number
  skills: Skill[]
}

export function SkillManager({ profileId, skills }: SkillManagerProps) {
  const [newSkill, setNewSkill] = useState("")
  const [isAdding, setIsAdding] = useState(false)
  const [isDeleting, setIsDeleting] = useState<number | null>(null)
  // const router = useRouter()
  const { toast } = useToast()

  async function handleAddSkill() {
    if (!newSkill.trim()) return

    setIsAdding(true)
    try {
      await addSkill(profileId, newSkill.trim())
      setNewSkill("")
      toast({
        title: "Skill added",
        description: `${newSkill} has been added to your profile.`,
      })
    } catch (error) {
      console.error("Failed to add skill:", error)
      toast({
        title: "Error",
        description: "Failed to add skill. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsAdding(false)
    }
  }

  async function handleDeleteSkill(skillId: number) {
    setIsDeleting(skillId)
    try {
      await deleteSkill(skillId)
      toast({
        title: "Skill removed",
        description: "The skill has been removed from your profile.",
      })
    } catch (error) {
      console.error("Failed to delete skill:", error)
      toast({
        title: "Error",
        description: "Failed to remove skill. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Skills</h3>
        <div className="flex items-center gap-2">
        <Input
          placeholder="Add a new skill"
          className="max-w-xs"
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleAddSkill().catch(error => console.error("Failed to add skill:", error)); // Handle promise rejection
            }
          }}
        />
          <Button variant="outline" size="sm" onClick={handleAddSkill} disabled={isAdding || !newSkill.trim()}>
            {isAdding ? (
              <span className="flex items-center gap-1">
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Adding...
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Plus className="h-3 w-3" />
                Add
              </span>
            )}
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {skills && skills.length > 0 ? (
          skills.map((skill) => (
            <div key={skill.id} className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full">
              <span>{skill.name}</span>
              <button
                type="button"
                className="text-slate-500 hover:text-slate-700 disabled:opacity-50"
                onClick={() => handleDeleteSkill(skill.id)}
                disabled={isDeleting === skill.id}
              >
                {isDeleting === skill.id ? (
                  <span className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <X className="h-3 w-3" />
                )}
              </button>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No skills added yet.</p>
        )}
      </div>
    </div>
  )
}
