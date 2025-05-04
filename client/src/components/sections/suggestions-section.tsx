import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDownIcon, SunIcon, ClockIcon, BatteryChargingIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useExpandable } from "@/hooks/use-expandable";
import { useNeopack } from "@/hooks/use-neopack";

export default function SuggestionsSection() {
  const { isExpanded, toggle } = useExpandable(true);
  const { suggestions } = useNeopack();

  const getIconForType = (type: string) => {
    switch (type) {
      case "weather":
        return <SunIcon className="h-5 w-5 text-accent" />;
      case "schedule":
        return <ClockIcon className="h-5 w-5 text-accent" />;
      case "battery":
        return <BatteryChargingIcon className="h-5 w-5 text-accent" />;
      default:
        return <SunIcon className="h-5 w-5 text-accent" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={toggle}
          >
            <CardTitle>Smart Suggestions</CardTitle>
            <ChevronDownIcon 
              className={cn(
                "h-5 w-5 transition-transform duration-300",
                isExpanded ? "rotate-0" : "-rotate-90"
              )}
            />
          </div>
          <CardDescription>Personalized recommendations</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className={cn("expandable", isExpanded && "expanded")}>
            {suggestions.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">No suggestions available</p>
            ) : (
              <div className="space-y-4">
                {suggestions.map((suggestion) => (
                  <div 
                    key={suggestion.id}
                    className="bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg p-4"
                  >
                    <div className="flex items-start">
                      {getIconForType(suggestion.type)}
                      <div className="ml-3">
                        <h3 className="font-medium">{suggestion.title}</h3>
                        <p className="text-sm mt-1">{suggestion.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
