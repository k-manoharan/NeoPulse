import { Route, Switch } from "wouter";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import Home from "@/pages/home";
import Books from "@/pages/books";
import Schedule from "@/pages/schedule";
import Notifications from "@/pages/notifications";
import Analytics from "@/pages/analytics";
import Settings from "@/pages/settings";
import Security from "@/pages/security";
import AccountPreferences from "@/pages/account-preferences";
import Logout from "@/pages/logout";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="neopulse-theme">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/books" component={Books} />
          <Route path="/schedule" component={Schedule} />
          <Route path="/notifications" component={Notifications} />
          <Route path="/analytics" component={Analytics} />
          <Route path="/settings" component={Settings} />
          <Route path="/security" component={Security} />
          <Route path="/account-preferences" component={AccountPreferences} />
          <Route path="/logout" component={Logout} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
