import { useState } from "react";
import { Link } from "wouter";
import Sidebar from "@/components/sidebar/sidebar";
import { MenuIcon, BellIcon, RefreshCcwIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrentDate } from "@/lib/utils";

interface MainLayoutProps {
  children: React.ReactNode;
  user: {
    name: string;
    email: string;
    image: string;
  };
}

export default function MainLayout({ children, user }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const firstName = user.name.split(" ")[0];
  const timeOfDay = getTimeOfDay();
  
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Sidebar 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
        user={user}
      />
      
      <main className="container mx-auto px-4 py-6 max-w-5xl">
        <header className="mb-8">
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center space-x-4">
              <Link href="/notifications">
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  <BellIcon className="h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <RefreshCcwIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          <div className="mt-6">
            <h1 className="text-2xl md:text-3xl font-semibold">
              {timeOfDay}, {firstName}!
            </h1>
            <p className="text-muted-foreground mt-1">{formatCurrentDate()}</p>
          </div>
        </header>
        
        {children}
      </main>
    </div>
  );
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}
