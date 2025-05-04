import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type StatusLevel = "high" | "medium" | "low";

interface DialProps {
  value: number;
  icon: React.ReactNode;
  label: string;
  description: string;
  statusText: string;
  level: StatusLevel;
  unit?: string;
}

export default function Dial({
  value,
  icon,
  label,
  description,
  statusText,
  level,
  unit = ""
}: DialProps) {
  const getStatusColor = (level: StatusLevel) => {
    switch (level) {
      case "high":
        return "bg-success";
      case "medium":
        return "bg-warning";
      case "low":
        return "bg-danger";
    }
  };

  const getIconColor = (level: StatusLevel) => {
    switch (level) {
      case "high":
        return "text-success";
      case "medium":
        return "text-warning";
      case "low":
        return "text-danger";
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-24 h-24 md:w-28 md:h-28">
        <div className="absolute inset-0 rounded-full bg-gray-100 dark:bg-gray-800 shadow-inner"></div>
        <div 
          className={cn(
            "absolute bottom-0 left-0 w-full rounded-b-full transition-all duration-700",
            getStatusColor(level)
          )}
          style={{ height: `${value}%` }}
        ></div>
        <motion.div 
          className="absolute inset-0 m-auto w-[85%] h-[85%] rounded-full bg-background shadow-md flex flex-col items-center justify-center"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className={cn("mb-1", getIconColor(level))}>
            {icon}
          </div>
          <motion.span 
            className="font-semibold text-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {statusText}{unit}
          </motion.span>
        </motion.div>
      </div>
      <p className="mt-3 text-center font-medium">{label}</p>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
