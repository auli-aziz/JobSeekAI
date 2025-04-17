import { CircularProgressbar, buildStyles } from "react-circular-progressbar"
import "react-circular-progressbar/dist/styles.css"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "~/components/ui/tooltip"
import { InfoIcon } from "lucide-react"

interface MatchScoreProps {
  score: number
  size?: "sm" | "md" | "lg"
  showLabel?: boolean
}

export default function MatchScore({ score, size = "md", showLabel = true }: MatchScoreProps) {
  // Determine color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "#10b981" // green-500
    if (score >= 60) return "#f97316" // orange-500
    if (score >= 40) return "#eab308" // yellow-500
    return "#ef4444" // red-500
  }

  const color = getScoreColor(score)

  // Size configurations
  const sizeConfig = {
    sm: { width: 32, fontSize: "text-xs", iconSize: "h-3 w-3" },
    md: { width: 44, fontSize: "text-sm", iconSize: "h-3.5 w-3.5" },
    lg: { width: 60, fontSize: "text-base", iconSize: "h-4 w-4" },
  }

  const { width, fontSize, iconSize } = sizeConfig[size]

  return (
    <div className="flex flex-col items-center">
      <div style={{ width: width, height: width }}>
        <CircularProgressbar
          value={score}
          text={`${score}%`}
          styles={buildStyles({
            textSize: "28px",
            pathColor: color,
            textColor: color,
            trailColor: "#e5e7eb",
          })}
        />
      </div>

      {showLabel && (
        <div className="mt-1 flex items-center gap-1">
          <span className={`font-medium ${fontSize}`}>Match</span>
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className={`${iconSize} text-slate-400 cursor-help`} />
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs max-w-[200px]">
                  Match score is calculated based on your resume and the job requirements
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}
    </div>
  )
}
