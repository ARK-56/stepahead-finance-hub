import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { TrendingUp, Menu, X, ChevronDown, Calculator, CreditCard, Receipt, Wallet, Home, ArrowLeftRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const navCategories = [
  {
    label: "Loan & Debt",
    icon: CreditCard,
    items: [
      { title: "Student Loan Calculator", href: "/student-loan" },
      { title: "Auto Loan Calculator", href: "/auto-loan" },
      { title: "Personal Loan Calculator", href: "/personal-loan" },
      { title: "Debt Payoff Calculator", href: "/debt-payoff" },
    ],
  },
  {
    label: "Investing",
    icon: TrendingUp,
    items: [
      { title: "Compound Interest", href: "/compound-interest" },
      { title: "Investment Goal", href: "/investment-goal" },
      { title: "Retirement Savings", href: "/retirement" },
      { title: "Stock Return", href: "/stock-return" },
      { title: "DRIP Calculator", href: "/drip-calculator" },
    ],
  },
  {
    label: "Tax Tools",
    icon: Receipt,
    items: [
      { title: "Freelance Tax Estimator", href: "/tax-estimator" },
      { title: "Tax Bracket Calculator", href: "/tax-bracket" },
      { title: "Capital Gains Tax", href: "/capital-gains-tax" },
      { title: "Paycheck Tax", href: "/paycheck-tax" },
    ],
  },
  {
    label: "Budgeting",
    icon: Wallet,
    items: [
      { title: "50/30/20 Budget Planner", href: "/budget-planner" },
      { title: "Net Worth Calculator", href: "/net-worth" },
      { title: "Cost of Living", href: "/cost-of-living" },
    ],
  },
  {
    label: "Real Estate",
    icon: Home,
    items: [
      { title: "Rent vs. Buy", href: "/rent-vs-buy" },
      { title: "Mortgage Amortization", href: "/mortgage-amortization" },
    ],
  },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight text-foreground">
          <TrendingUp className="h-5 w-5 text-primary" />
          1StepAhead
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          <Link
            to="/"
            className={`px-3 py-2 rounded-md transition-colors ${location.pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            Home
          </Link>
          {navCategories.map((cat) => (
            <DropdownMenu key={cat.label}>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 px-3 py-2 rounded-md text-muted-foreground hover:text-foreground transition-colors">
                  {cat.label}
                  <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                {cat.items.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link to={item.href} className="w-full cursor-pointer">
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
          <Link
            to="/currency-converter"
            className={`px-3 py-2 rounded-md transition-colors ${location.pathname === "/currency-converter" ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
          >
            Currency Converter
          </Link>
        </nav>

        {/* Mobile Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="lg:hidden border-t bg-card max-h-[70vh] overflow-y-auto">
          <div className="container py-4 space-y-4">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block font-medium text-foreground">
              Home
            </Link>
            {navCategories.map((cat) => (
              <div key={cat.label}>
                <div className="flex items-center gap-2 text-sm font-semibold text-foreground mb-1.5">
                  <cat.icon className="h-4 w-4 text-primary" />
                  {cat.label}
                </div>
                <div className="pl-6 space-y-1.5">
                  {cat.items.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link to="/currency-converter" onClick={() => setMobileOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground">
              Currency Converter
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
