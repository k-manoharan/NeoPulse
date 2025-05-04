import { motion } from "framer-motion";
import Dial from "@/components/ui/dial";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BatteryFullIcon, DumbbellIcon } from "lucide-react";
import { useNeopack } from "@/hooks/use-neopack";

export default function StatusSection() {
  const { battery, weight } = useNeopack();
  
  const getBatteryLevel = (percentage: number): "high" | "medium" | "low" => {
    if (percentage > 60) return "high";
    if (percentage > 20) return "medium";
    return "low";
  };
  
  const getWeightLevel = (kg: number): "high" | "medium" | "low" => {
    if (kg > 5) return "low";
    if (kg > 3) return "medium";
    return "high";
  };
  
  const estimateRemainingHours = (percentage: number): number => {
    return Math.round((percentage / 100) * 14); // Assuming full battery lasts 14 hours
  };
  
  const getWeightDescription = (kg: number): string => {
    if (kg > 5) return "Heavy load";
    if (kg > 3) return "Moderate load";
    return "Light load";
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>NeoPack Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-6">
            <Dial
              value={battery.percentage}
              icon={<BatteryFullIcon className="h-6 w-6" />}
              label="Battery"
              description={`~ ${estimateRemainingHours(battery.percentage)} hrs remaining`}
              statusText={`${battery.percentage}%`}
              level={getBatteryLevel(battery.percentage)}
            />
            
            <Dial
              value={weight.percentage}
              icon={<DumbbellIcon className="h-6 w-6" />}
              label="Weight"
              description={getWeightDescription(weight.value)}
              statusText={weight.value.toFixed(1)}
              unit=" kg"
              level={getWeightLevel(weight.value)}
            />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
