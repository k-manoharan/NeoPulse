import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookXIcon, ChevronDownIcon, AlertTriangleIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useExpandable } from "@/hooks/use-expandable";
import { useNeopack } from "@/hooks/use-neopack";
import { Button } from "@/components/ui/button";

export default function MissingBooksSection() {
  const { isExpanded, toggle } = useExpandable(true);
  const { missingBooks } = useNeopack();

  const addReminder = (bookId: number) => {
    // Would connect to API to add a reminder in a real app
    console.log(`Adding reminder for book ${bookId}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card>
        <CardHeader className="pb-3">
          <div 
            className="flex justify-between items-center cursor-pointer"
            onClick={toggle}
          >
            <div className="flex items-center">
              <CardTitle>Missing Books Alert</CardTitle>
              {missingBooks.length > 0 && (
                <span className="ml-2 text-xs bg-danger text-white rounded-full px-2 py-0.5">
                  {missingBooks.length}
                </span>
              )}
            </div>
            <ChevronDownIcon 
              className={cn(
                "h-5 w-5 transition-transform duration-300",
                isExpanded ? "rotate-0" : "-rotate-90"
              )}
            />
          </div>
          <CardDescription>Books needed for today's schedule</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <div className={cn("expandable", isExpanded && "expanded")}>
            {missingBooks.length === 0 ? (
              <p className="py-4 text-center text-muted-foreground">No missing books</p>
            ) : (
              missingBooks.map((book) => (
                <div 
                  key={book.id}
                  className="flex items-center p-3 border-b border-gray-100 dark:border-gray-700 last:border-0"
                >
                  <div className="w-10 h-10 rounded-lg bg-danger/10 flex items-center justify-center mr-4">
                    <AlertTriangleIcon className="h-5 w-5 text-danger" />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-medium">{book.title}</h3>
                    <p className="text-xs text-muted-foreground">{book.detail}</p>
                  </div>
                  <Button 
                    size="sm" 
                    variant="default" 
                    className="text-xs rounded-full px-3 py-1.5"
                    onClick={() => addReminder(book.id)}
                  >
                    Add Reminder
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
