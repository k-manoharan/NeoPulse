import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookIcon, ChevronDownIcon, CheckCircleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useExpandable } from "@/hooks/use-expandable";
import { useNeopack } from "@/hooks/use-neopack";

export default function EssentialsSection() {
  const { isExpanded, toggle } = useExpandable(true);
  const { detectedBooks } = useNeopack();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={toggle}
          >
            <CardTitle>Today's Essentials</CardTitle>
            <ChevronDownIcon 
              className={cn(
                "h-5 w-5 transition-transform duration-300",
                isExpanded ? "rotate-0" : "-rotate-90"
              )}
            />
          </div>
          <CardDescription>Books detected in your NeoPack</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className={cn("expandable", isExpanded && "expanded")}>
            {detectedBooks.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">No books detected</p>
            ) : (
              detectedBooks.map((book) => (
                <div 
                  key={book.id}
                  className="flex items-center p-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mr-4">
                    <BookIcon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{book.title}</h3>
                    <p className="text-xs text-muted-foreground">by {book.author}</p>
                  </div>
                  <CheckCircleIcon className="h-5 w-5 text-success" />
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
