import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  HomeIcon,
  CalendarIcon,
  BookOpenIcon,
  BellIcon,
  BarChartIcon,
  MoonIcon,
  SettingsIcon,
  LogOutIcon,
  XIcon
} from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  user: {
    name: string;
    email: string;
    image: string;
  };
}

export default function Sidebar({ open, onClose, user }: SidebarProps) {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  const overlayRef = useRef<HTMLDivElement>(null);
  
  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && event.target === overlayRef.current) {
        onClose();
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);
  
  // Prevent scrolling when sidebar is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);
  
  const toggleDarkMode = () => {
    setTheme(isDark ? "light" : "dark");
  };
  
  const sidebarVariants = {
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };
  
  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    },
    open: {
      opacity: 0.5,
      transition: {
        duration: 0.3
      }
    }
  };
  
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            ref={overlayRef}
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            className="fixed inset-0 z-40 bg-black pointer-events-auto"
          />
          
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={sidebarVariants}
            className="fixed top-0 left-0 h-full w-64 md:w-80 bg-card z-50 shadow-xl"
          >
            <div className="flex flex-col h-full p-5">
              <div className="pb-6 border-b border-border">
                <div className="flex items-center mb-4">
                  <Avatar className="h-14 w-14 mr-3 border-2 border-primary">
                    <AvatarImage src={user.image} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                  onClick={onClose}
                >
                  <XIcon className="h-5 w-5" />
                </Button>
              </div>
              
              <nav className="py-6 flex-grow">
                <ul className="space-y-2">
                  <li>
                    <Link href="/" className="flex items-center p-3 rounded-lg text-primary bg-primary/10 font-medium">
                      <HomeIcon className="h-5 w-5 mr-3" />
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link href="/schedule" className="flex items-center p-3 rounded-lg hover:bg-muted transition-colors">
                      <CalendarIcon className="h-5 w-5 mr-3" />
                      Schedule
                    </Link>
                  </li>
                  <li>
                    <Link href="/books" className="flex items-center p-3 rounded-lg hover:bg-muted transition-colors">
                      <BookOpenIcon className="h-5 w-5 mr-3" />
                      My Books
                    </Link>
                  </li>
                  <li>
                    <Link href="/notifications" className="flex items-center p-3 rounded-lg hover:bg-muted transition-colors">
                      <BellIcon className="h-5 w-5 mr-3" />
                      Notifications
                    </Link>
                  </li>
                  <li>
                    <Link href="/analytics" className="flex items-center p-3 rounded-lg hover:bg-muted transition-colors">
                      <BarChartIcon className="h-5 w-5 mr-3" />
                      Analytics
                    </Link>
                  </li>
                </ul>
              </nav>
              
              <div className="pt-4 border-t border-border">
                <div className="flex items-center justify-between py-3">
                  <div className="flex items-center">
                    <MoonIcon className="h-5 w-5 mr-3" />
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                  </div>
                  <Switch 
                    id="dark-mode"
                    checked={isDark}
                    onCheckedChange={toggleDarkMode} 
                  />
                </div>
                <Link href="/settings" className="flex items-center p-3 rounded-lg hover:bg-muted transition-colors mt-2">
                  <SettingsIcon className="h-5 w-5 mr-3" />
                  Settings
                </Link>
                <Link href="/logout" className="flex items-center p-3 rounded-lg hover:bg-muted transition-colors text-destructive">
                  <LogOutIcon className="h-5 w-5 mr-3" />
                  Logout
                </Link>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
