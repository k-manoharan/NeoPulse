import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function Logout() {
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    // In a real application, you would implement actual logout logic here
    // Such as clearing tokens, session data, etc.
    
    // Set a timeout to simulate logout processing
    const timer = setTimeout(() => {
      setLocation("/");
    }, 2000);
    
    return () => clearTimeout(timer);
  }, [setLocation]);
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6 flex flex-col items-center text-center">
          <LogOut className="h-12 w-12 text-primary mb-4" />
          <h1 className="text-2xl font-bold mb-2">Logging Out</h1>
          <p className="text-muted-foreground mb-6">
            Please wait while we securely log you out...
          </p>
          <div className="w-full bg-muted rounded-full h-2 mb-6">
            <div className="bg-primary h-2 rounded-full animate-progress"></div>
          </div>
          <Button variant="outline" onClick={() => setLocation("/")}>
            Return to Login
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Add this to your global styles (index.css) if needed
// @keyframes progress {
//   0% { width: 0% }
//   100% { width: 100% }
// }
// .animate-progress {
//   animation: progress 2s ease-in-out;
// }