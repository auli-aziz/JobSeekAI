"use client"

import type React from "react"
import { Button } from "../ui/button"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
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
    { value: "software-dev", label: "Software Development" },
    { value: "marketing", label: "Marketing" },
    { value: "design", label: "Design" },
    { value: "customer-support", label: "Customer Support" },
    { value: "sales", label: "Sales" },
    { value: "product", label: "Product" },
    { value: "business", label: "Business" },
    { value: "data", label: "Data" },
    { value: "devops", label: "DevOps" },
    { value: "finance", label: "Finance" },
    { value: "human-resources", label: "Human Resources" },
    { value: "qa", label: "QA" },
    { value: "writing", label: "Writing" },
    { value: "all-others", label: "All Others" },
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
          "fixed top-0 left-0 z-40 h-screen w-[300px] bg-white border-r border-slate-200 transition-transform lg:translate-x-0 lg:relative overflow-y-auto",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <h2 className="font-semibold text-slate-900">Filter Jobs</h2>
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

          <div className="pt-6 border-t border-slate-200">
            <Button variant="outline" className="w-full" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}

