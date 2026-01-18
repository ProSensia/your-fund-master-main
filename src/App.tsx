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
import { testDatabaseConnection } from "./lib/database";

const queryClient = new QueryClient();

const App = () => {
  useEffect(() => {
    // Test database connection on app startup
    testDatabaseConnection();
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
          <Rou