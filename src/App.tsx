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
import StudentLoanCalculator from "./pages/StudentLoanCalculator";
import AutoLoanCalculator from "./pages/AutoLoanCalculator";
import PersonalLoanCalculator from "./pages/PersonalLoanCalculator";
import DebtPayoffCalculator from "./pages/DebtPayoffCalculator";
import InvestmentGoalCalculator from "./pages/InvestmentGoalCalculator";
import RetirementCalculator from "./pages/RetirementCalculator";
import StockReturnCalculator from "./pages/StockReturnCalculator";
import DripCalculator from "./pages/DripCalculator";
import TaxBracketCalculator from "./pages/TaxBracketCalculator";
import CapitalGainsTaxCalculator from "./pages/CapitalGainsTaxCalculator";
import PaycheckTaxCalculator from "./pages/PaycheckTaxCalculator";
import BudgetPlanner from "./pages/BudgetPlanner";
import NetWorthCalculator from "./pages/NetWorthCalculator";
import CostOfLivingCalculator from "./pages/CostOfLivingCalculator";
import RentVsBuyCalculator from "./pages/RentVsBuyCalculator";
import MortgageAmortizationCalculator from "./pages/MortgageAmortizationCalculator";
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
            <Route path="/student-loan" element={<StudentLoanCalculator />} />
            <Route path="/auto-loan" element={<AutoLoanCalculator />} />
            <Route path="/personal-loan" element={<PersonalLoanCalculator />} />
            <Route path="/debt-payoff" element={<DebtPayoffCalculator />} />
            <Route path="/investment-goal" element={<InvestmentGoalCalculator />} />
            <Route path="/retirement" element={<RetirementCalculator />} />
            <Route path="/stock-return" element={<StockReturnCalculator />} />
            <Route path="/drip-calculator" element={<DripCalculator />} />
            <Route path="/tax-bracket" element={<TaxBracketCalculator />} />
            <Route path="/capital-gains-tax" element={<CapitalGainsTaxCalculator />} />
            <Route path="/paycheck-tax" element={<PaycheckTaxCalculator />} />
            <Route path="/budget-planner" element={<BudgetPlanner />} />
            <Route path="/net-worth" element={<NetWorthCalculator />} />
            <Route path="/cost-of-living" element={<CostOfLivingCalculator />} />
            <Route path="/rent-vs-buy" element={<RentVsBuyCalculator />} />
            <Route path="/mortgage-amortization" element={<MortgageAmortizationCalculator />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
