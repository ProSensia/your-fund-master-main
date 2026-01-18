import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Funds from "./pages/Funds";
import Reports from "./pages/Reports";
import Personal from "./pages/Personal";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { toast } from "sonner";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Test API connection on app startup
    const testConnection = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/health');
        if (response.ok) {
          toast.success('✅ MySQL Database Connected');
        } else {
          toast.error('❌ Failed to connect to database');
        }
      } catch (error) {
        toast.error('❌ API server not running. Start it with: npm run server');
        console.error('API connection error:', error);
      }
    };

    // Small delay to let toasts stack nicely
    setTimeout(testConnection, 500);
  }, []);

  return (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/expenses" element={<Expenses />} />
          <Route path="/funds" element={<Funds />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/personal" element={<Personal />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  );
};

export default App;
