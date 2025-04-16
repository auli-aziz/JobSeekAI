"use client"

import type React from "react"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import { Switch } from "~/components/ui/switch"
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "~/components/ui/select"
import { X } from "lucide-react"
import { cn } from "~/lib/utils"

interface FilterSidebarProps {
  open: boolean
  onClose: () => void
  category: string
  setCategory: (value: string) => void
  companyName: string
  setCompanyName: (value: string) => void
  jobType: string
  setJobType: (value: string) => void
  location: string
  setLocation: (value: string) => void
  showSalaryOnly: boolean
  setShowSalaryOnly: (value: boolean) => void
  resetFilters: () => void
}

export default function FilterSidebar({
  open,
  onClose,
  category,
  setCategory,
  jobType,
  setJobType,
  location,
  setLocation,
  showSalaryOnly,
  setShowSalaryOnly,
  resetFilters,
}: FilterSidebarProps) {
  const categories = [
    { value: "Software Development", label: "Software Development" },
    { value: "Marketing", label: "Marketing" },
    { value: "Design", label: "Design" },
    { value: "Customer Support", label: "Customer Support" },
    { value: "Sales", label: "Sales" },
    { value: "Product", label: "Product" },
    { value: "Business", label: "Business" },
    { value: "Data", label: "Data" },
    { value: "DevOps", label: "DevOps" },
    { value: "Finance", label: "Finance" },
    { value: "Human Resources", label: "Human Resources" },
    { value: "QA", label: "QA" },
    { value: "Writing", label: "Writing" },
    { value: "All Others", label: "All Others" },
  ]

  const jobTypes = [
    { value: "all", label: "All Types" },
    { value: "full_time", label: "Full Time" },
    { value: "part_time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "freelance", label: "Freelance" },
  ]

  const locations = [
    { value: "all", label: "All Locations" },
    { value: "Worldwide", label: "Worldwide" },
    { value: "USA Only", label: "USA Only" },
    { value: "Europe", label: "Europe" },
    { value: "UK", label: "UK" },
    { value: "Canada", label: "Canada" },
    { value: "Asia", label: "Asia" },
  ]

  // Handle click events on the overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity lg:hidden",
          open ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={handleOverlayClick}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 w-[300px] border-r border-t border-border-primary bg-background transition-transform lg:translate-x-0 lg:relative overflow-y-auto lg:h-auto h-screen",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-border-secondary">
          <h2 className="font-semibold">Filter Jobs</h2>
          <Button variant="ghost" size="sm" onClick={onClose} className="lg:hidden">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-4 space-y-6">
          {/* Categories */}
          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Category
            </Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} value={cat.value}>
                    {cat.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Job Type */}
          <div className="space-y-2">
            <Label htmlFor="job-type" className="text-sm font-medium">
              Job Type
            </Label>
            <Select value={jobType} onValueChange={setJobType}>
              <SelectTrigger id="job-type">
                <SelectValue placeholder="Select job type" />
              </SelectTrigger>
              <SelectContent>
                {jobTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="text-sm font-medium">
              Location
            </Label>
            <Select value={location} onValueChange={setLocation}>
              <SelectTrigger id="location">
                <SelectValue placeholder="Select location" />
              </SelectTrigger>
              <SelectContent>
                {locations.map((loc) => (
                  <SelectItem key={loc.value} value={loc.value}>
                    {loc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Salary Filter */}
          <div className="flex items-center justify-between">
            <Label htmlFor="salary-filter" className="text-sm font-medium">
              Show jobs with salary only
            </Label>
            <Switch id="salary-filter" checked={showSalaryOnly} onCheckedChange={setShowSalaryOnly} />
          </div>

          <div className="pt-6 border-t border-border-secondary">
            <Button variant="outline" className="w-full" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}

