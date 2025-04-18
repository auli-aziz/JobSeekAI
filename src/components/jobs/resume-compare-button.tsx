"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { FileText } from "lucide-react";
import { useRouter } from "next/navigation";

interface ResumeCompareButtonProps {
  jobId: number;
}

export default function ResumeCompareButton({ jobId }: ResumeCompareButtonProps) {
  const [isComparing, setIsComparing] = useState(false);
  const router = useRouter();

  const handleCompare = async () => {
    try {
      setIsComparing(true);
      
      // Simulate API call to generate comparison
      // In a real implementation, this would call your backend API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Refresh the page to show results
      router.refresh();
      
      // Alternatively navigate to compatibility tab
      const tabElement = document.querySelector('[value="compatibility"]');
      if (tabElement instanceof HTMLElement) {
        tabElement.click();
      }
    } catch (error) {
      console.error("Error comparing resume:", error);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <Button 
      variant="default" 
      className="w-full" 
      onClick={handleCompare}
      disabled={isComparing}
    >
      <FileText className="mr-2 h-4 w-4" />
      {isComparing ? "Analyzing Resume..." : "Compare with My Resume"}
    </Button>
  );
} 