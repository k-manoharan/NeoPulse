import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useExpandable } from "@/hooks/use-expandable";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { useNeopack } from "@/hooks/use-neopack";
import { useTheme } from "@/hooks/use-theme";

export default function ActivitySection() {
  const { isExpanded, toggle } = useExpandable(false);
  const { activityData } = useNeopack();
  const { theme } = useTheme();
  
  const isDark = theme === "dark";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={toggle}
          >
            <CardTitle>Activity Summary</CardTitle>
            <ChevronDownIcon 
              className={cn(
                "h-5 w-5 transition-transform duration-300",
                isExpanded ? "rotate-0" : "-rotate-90"
              )}
            />
          </div>
          <CardDescription>This week's NeoPack usage</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className={cn("expandable", isExpanded && "expanded")}>
            <div className="h-64 w-full py-4">
              {activityData.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <p className="text-muted-foreground">No activity data available</p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={activityData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#333" : "#eee"} />
                    <XAxis 
                      dataKey="day" 
                      tick={{ fill: isDark ? "#e6e6e6" : "#333" }}
                    />
                    <YAxis 
                      tick={{ fill: isDark ? "#e6e6e6" : "#333" }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: isDark ? "#1E1F2A" : "#fff",
                        color: isDark ? "#e6e6e6" : "#333",
                        border: `1px solid ${isDark ? "#333" : "#ddd"}`
                      }} 
                    />
                    <Bar dataKey="weight" name="Avg. Weight (kg)" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="usage" name="Usage (hrs)" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
