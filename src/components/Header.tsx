import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { TrendingUp, Menu, X, ChevronDown, CreditCard, Receipt, Wallet, Home, ArrowLeftRight } from "lucide-react";
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
    <header className="sticky top-0 z-50 border-b border-border/60 bg-card/70 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 font-bold text-lg tracking-tight text-foreground font-display">
          <div className="h-8 w-8 rounded-lg hero-gradient flex items-center justify-center">
            <TrendingUp className="h-4 w-4 text-primary-foreground" />
          </div>
          1StepAhead
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5 text-sm font-medium">
          <Link
            to="/"
            className={`px-3 py-2 rounded-lg transition-colors ${location.pathname === "/" ? "text-primary bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
          >
            Home
          </Link>
          {navCategories.map((cat) => (
            <DropdownMenu key={cat.label}>
              <DropdownMenuTrigger asChild>
                <button className={`flex items-center gap-1 px-3 py-2 rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-muted`}>
                  {cat.label}
                  <ChevronDown className="h-3 w-3 opacity-50" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56 rounded-xl p-1">
                {cat.items.map((item) => (
                  <DropdownMenuItem key={item.href} asChild>
                    <Link to={item.href} className="w-full cursor-pointer rounded-lg">
                      {item.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
          <Link
            to="/currency-converter"
            className={`px-3 py-2 rounded-lg transition-colors ${location.pathname === "/currency-converter" ? "text-primary bg-accent" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}
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
        <div className="lg:hidden border-t border-border/60 bg-card max-h-[75vh] overflow-y-auto">
          <div className="container py-5 space-y-5">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block font-semibold text-foreground font-display">
              Home
            </Link>
            {navCategories.map((cat) => (
              <div key={cat.label}>
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                  <cat.icon className="h-3.5 w-3.5 text-primary" />
                  {cat.label}
                </div>
                <div className="pl-5 space-y-2 border-l-2 border-border ml-1.5">
                  {cat.items.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link to="/currency-converter" onClick={() => setMobileOpen(false)} className="block text-sm text-muted-foreground hover:text-primary">
              Currency Converter
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
