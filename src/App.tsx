import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import CompoundInterest from "./pages/CompoundInterest";
import TaxEstimator from "./pages/TaxEstimator";
import CurrencyConverter from "./pages/CurrencyConverter";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Header />
        <main className="min-h-[calc(100vh-3.5rem)]">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/compound-interest" element={<CompoundInterest />} />
            <Route path="/tax-estimator" element={<TaxEstimator />} />
            <Route path="/currency-converter" element={<CurrencyConverter />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
