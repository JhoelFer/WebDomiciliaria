import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Admin from "@/pages/admin";
import { useState, useEffect } from "react";
import { ServerOffline } from "@/components/ServerOffline";

const BACKEND_URL = "https://ab09c429-fccd-49d5-8cac-5b4ea9caf0e9-00-3jgf16yawkg1l.riker.replit.dev";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home}/>
      <Route path="/admin" component={Admin}/>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [serverAvailable, setServerAvailable] = useState(true);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/api/appointments`, {
          method: "GET",
        });
        // Consider server available regardless of status code as long as it responds
        setServerAvailable(true);
      } catch {
        // Only set offline if there's a network error (CORS, connection refused, etc)
        setServerAvailable(false);
      }
    };

    // Check on mount
    checkServer();

    // Check every 10 seconds
    const interval = setInterval(checkServer, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!serverAvailable) {
    return <ServerOffline />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
