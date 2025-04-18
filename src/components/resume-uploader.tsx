"use client"

import type React from "react"

import { useState, useRef, useActionState, startTransition } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { FileIcon, UploadCloudIcon, FileUpIcon, XIcon, LoaderIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { cn } from "~/lib/utils"
import { extractDataFromResume } from "~/actions/extract-resume"




const initialState = {
  success: false,
  message: "",
}



export function ResumeUploadDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [uint8Array, setUint8Array] = useState<Uint8Array | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [extractState, extractAction, extractIsPending] = useActionState(extractDataFromResume, initialState)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null
    setFile(selectedFile)
    setUint8Array(null)
    setError(null)

    if (!selectedFile) return

    if (!selectedFile.type.includes("pdf")) {
      setError("Please select a valid PDF file")
      return
    }


    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer
        const uint8Array = new Uint8Array(arrayBuffer)
        setUint8Array(uint8Array)
      } catch (err) {
        setError("Failed to convert file to Uint8Array")
      }
    }

    reader.onerror = () => {
      setError("Error reading the file")
    }

    reader.readAsArrayBuffer(selectedFile)
  }




  const handleRemoveFile = () => {
    setFile(null)
    setUint8Array(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }


  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      handleRemoveFile()
    }
    setOpen(newOpen)
  }
  const handleUpload = async () => {
    if (uint8Array) {
      startTransition(() => {
        extractAction(uint8Array)
      })
    }
    console.log(uint8Array)
  }


  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload your resume</DialogTitle>
          <DialogDescription>Upload your resume to get AI-powered job matches based on your skills and experience.</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            {!file ? (
              <div
                className={cn(
                  "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
                  error && "border-destructive/50 bg-destructive/5",
                )}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="flex flex-col items-center justify-center space-y-3">
                  <div
                    className={cn(
                      "p-3 rounded-full",
                      error && "bg-destructive/10",
                    )}
                  >
                    <UploadCloudIcon
                      className={cn(
                        "h-6 w-6",
                        error && "text-destructive",
                      )}
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium">
                      {error ? "Please select a valid PDF file" : "Click to upload your resume"}
                    </p>
                    <p className="text-xs text-muted-foreground">PDF files only (max 10MB)</p>
                  </div>
                </div>
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="bg-muted/50 border rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-background rounded-md border">
                    <FileIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium truncate max-w-[180px] sm:max-w-[250px]">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB • PDF Document</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={handleRemoveFile} className="h-8 w-8">
                  <XIcon className="h-4 w-4" />
                  <span className="sr-only">Remove file</span>
                </Button>
              </div>
            )}

            {error && !file && (
              <p className="text-sm text-destructive flex items-center">
                <AlertCircleIcon className="h-4 w-4 mr-1" />
                {error}
              </p>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          {false ? (
            <Button onClick={() => handleOpenChange(false)} className="w-full sm:w-auto">
              Close
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={() => handleOpenChange(false)}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={!file || extractIsPending}
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                <span className="flex items-center">
                  {extractIsPending ? (
                    <>
                      Uploading...
                      <LoaderIcon className="ml-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    <>
                      Upload Resume
                      <FileUpIcon className="ml-2 h-4 w-4" />
                    </>
                  )}
                </span>
              </Button>

            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function AlertCircleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  )
}

