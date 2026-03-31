import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search, Calculator, Receipt, ArrowLeftRight, TrendingUp, BarChart3,
  Wallet, Home, GraduationCap, Car, CreditCard, Target, PiggyBank,
  DollarSign, Percent, Building, ArrowRight, CheckCircle2, Zap, Shield, Star
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const tools = [
  { title: "Compound Interest Calculator", description: "Visualize how your investments grow over time with interactive charts.", icon: Calculator, href: "/compound-interest", category: "Calculators" },
  { title: "Freelance Tax Estimator", description: "Estimate your self-employment taxes with a simple step-by-step form.", icon: Receipt, href: "/tax-estimator", category: "Tax Tools" },
  { title: "Currency Converter", description: "Convert between 150+ world currencies with live exchange rates.", icon: ArrowLeftRight, href: "/currency-converter", category: "Converters" },
  { title: "Student Loan Calculator", description: "Estimate monthly payments and total interest on student loans.", icon: GraduationCap, href: "/student-loan", category: "Loan & Debt" },
  { title: "Auto Loan Calculator", description: "Calculate monthly car payments with down payment and interest.", icon: Car, href: "/auto-loan", category: "Loan & Debt" },
  { title: "Personal Loan Calculator", description: "Compare payment plans for personal loans at various rates.", icon: CreditCard, href: "/personal-loan", category: "Loan & Debt" },
  { title: "Debt Payoff Calculator", description: "Compare Snowball vs Avalanche strategies to get debt-free faster.", icon: CreditCard, href: "/debt-payoff", category: "Loan & Debt" },
  { title: "Investment Goal Calculator", description: "Find how much to save monthly to reach your financial target.", icon: Target, href: "/investment-goal", category: "Investing" },
  { title: "Retirement Savings Calculator", description: "Project retirement savings and income with the 4% rule.", icon: PiggyBank, href: "/retirement", category: "Investing" },
  { title: "Stock Return Calculator", description: "Calculate total and annualized returns including dividends.", icon: TrendingUp, href: "/stock-return", category: "Investing" },
  { title: "DRIP Calculator", description: "See how dividend reinvestment accelerates portfolio growth.", icon: TrendingUp, href: "/drip-calculator", category: "Investing" },
  { title: "Tax Bracket Calculator", description: "Visualize 2024 federal tax brackets and your effective rate.", icon: Percent, href: "/tax-bracket", category: "Tax Tools" },
  { title: "Capital Gains Tax Calculator", description: "Estimate taxes on investment gains—short-term vs long-term.", icon: DollarSign, href: "/capital-gains-tax", category: "Tax Tools" },
  { title: "Paycheck Tax Calculator", description: "Estimate take-home pay after federal taxes and deductions.", icon: Receipt, href: "/paycheck-tax", category: "Tax Tools" },
  { title: "50/30/20 Budget Planner", description: "Allocate income with the popular 50/30/20 budgeting rule.", icon: Wallet, href: "/budget-planner", category: "Budgeting" },
  { title: "Net Worth Calculator", description: "Calculate net worth by totaling assets minus liabilities.", icon: BarChart3, href: "/net-worth", category: "Budgeting" },
  { title: "Cost of Living Calculator", description: "Compare cost of living between US cities and equivalent salaries.", icon: Building, href: "/cost-of-living", category: "Budgeting" },
  { title: "Rent vs. Buy Calculator", description: "Compare the true cost of renting vs buying a home over time.", icon: Home, href: "/rent-vs-buy", category: "Real Estate" },
  { title: "Mortgage Amortization Calculator", description: "View full mortgage amortization schedule and interest breakdown.", icon: Home, href: "/mortgage-amortization", category: "Real Estate" },
];

const categories = [
  { name: "All", icon: Calculator, count: tools.length },
  { name: "Loan & Debt", icon: CreditCard, count: tools.filter(t => t.category === "Loan & Debt").length },
  { name: "Investing", icon: TrendingUp, count: tools.filter(t => t.category === "Investing").length },
  { name: "Tax Tools", icon: Receipt, count: tools.filter(t => t.category === "Tax Tools").length },
  { name: "Budgeting", icon: Wallet, count: tools.filter(t => t.category === "Budgeting").length },
  { name: "Real Estate", icon: Home, count: tools.filter(t => t.category === "Real Estate").length },
  { name: "Calculators", icon: Calculator, count: tools.filter(t => t.category === "Calculators").length },
  { name: "Converters", icon: ArrowLeftRight, count: tools.filter(t => t.category === "Converters").length },
];

const popularTools = tools.slice(0, 6);

const features = [
  { icon: Zap, title: "Instant Results", description: "Get real-time calculations as you type — no page reloads or waiting." },
  { icon: Shield, title: "Privacy First", description: "All calculations run in your browser. We never store your financial data." },
  { icon: Star, title: "Expert-Grade Formulas", description: "Built with industry-standard financial formulas used by CPAs and advisors." },
  { icon: CheckCircle2, title: "100% Free Forever", description: "No sign-ups, no subscriptions, no hidden fees. Every tool is completely free." },
];

const faqs = [
  { q: "Are these financial calculators really free?", a: "Yes — every tool on 1StepAhead is 100% free with no sign-up required. We're supported by non-intrusive advertising so you can access professional-grade calculators at no cost." },
  { q: "How accurate are the results?", a: "Our calculators use industry-standard financial formulas — the same math used by banks, CPAs, and financial advisors. However, results are estimates for educational purposes. Always consult a qualified professional for major financial decisions." },
  { q: "Is my financial data safe?", a: "Absolutely. All calculations happen directly in your browser. We never transmit, store, or have access to any numbers you enter. Your data stays on your device." },
  { q: "Can I use these tools on my phone?", a: "Yes! Every calculator is fully responsive and optimized for mobile, tablet, and desktop. Charts and inputs adapt automatically to your screen size." },
  { q: "How often are tax rates and formulas updated?", a: "We update tax brackets, standard deductions, and contribution limits annually to reflect the latest IRS guidelines. Our 2024 rates are currently active across all tax-related tools." },
  { q: "Do you offer tools for business finances?", a: "Currently our tools focus on personal finance, investing, and tax estimation. Business-oriented tools like profit margin calculators and cash flow projectors are on our roadmap — stay tuned!" },
];

export default function Index() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = useMemo(
    () => tools.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "All" || t.category === activeCategory;
      return matchesSearch && matchesCategory;
    }),
    [search, activeCategory]
  );

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient py-20 md:py-32">
        <div className="container text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary-foreground/15 text-primary-foreground text-sm font-medium mb-6 backdrop-blur-sm">
            19 Free Financial Tools — No Sign-Up Required
          </span>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-primary-foreground leading-tight">
            Smart Finance Tools,<br className="hidden sm:block" /> One Step Ahead
          </h1>
          <p className="mt-5 text-primary-foreground/80 max-w-2xl mx-auto text-lg md:text-xl">
            Professional-grade calculators for loans, taxes, investing, budgeting, and real estate — all free, private, and instant.
          </p>
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search 19 financial tools…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 rounded-full bg-card border-0 shadow-lg text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-primary-foreground/70">
            <span>Popular:</span>
            {["Compound Interest", "Debt Payoff", "Tax Bracket", "Retirement"].map(name => {
              const tool = tools.find(t => t.title.includes(name));
              return tool ? (
                <Link key={tool.href} to={tool.href} className="underline underline-offset-2 hover:text-primary-foreground transition-colors">
                  {name}
                </Link>
              ) : null;
            })}
          </div>
        </div>
      </section>

      {/* Leaderboard Ad */}
      <div className="container mt-8">
        <div className="ad-slot rounded-lg p-3 flex items-center justify-center h-[90px] text-muted-foreground text-sm">
          <span className="text-xs">Advertisement — 728×90 Leaderboard</span>
        </div>
      </div>

      {/* Why 1StepAhead */}
      <section className="container mt-16">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Why 1StepAhead?</h2>
          <p className="mt-2 text-muted-foreground max-w-xl mx-auto">
            Trusted by thousands of users to make smarter financial decisions every day.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="surface-elevated rounded-xl p-6 text-center">
              <div className="h-12 w-12 rounded-xl bg-accent flex items-center justify-center mx-auto mb-4">
                <f.icon className="h-6 w-6 text-accent-foreground" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Popular Tools */}
      <section className="container mt-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Most Popular Tools</h2>
          <Button variant="ghost" size="sm" className="text-primary" onClick={() => { setActiveCategory("All"); document.getElementById("all-tools")?.scrollIntoView({ behavior: "smooth" }); }}>
            View all <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularTools.map((tool) => (
            <Link
              key={tool.href}
              to={tool.href}
              className="surface-elevated rounded-xl p-6 group hover:ring-2 hover:ring-primary/20 transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                  <tool.icon className="h-5 w-5 text-accent-foreground" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{tool.category}</span>
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{tool.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
              <span className="inline-flex items-center mt-3 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Try it free <ArrowRight className="h-3.5 w-3.5 ml-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* In-content Ad */}
      <div className="container mt-12">
        <div className="ad-slot rounded-lg p-3 flex items-center justify-center h-[90px] text-muted-foreground text-sm">
          <span className="text-xs">Advertisement — 728×90 In-Content</span>
        </div>
      </div>

      {/* Categories */}
      <section className="container mt-12" id="all-tools">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-foreground">Browse by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`surface-elevated rounded-xl p-4 text-center transition-all cursor-pointer ${activeCategory === cat.name ? "ring-2 ring-primary" : "hover:ring-2 hover:ring-primary/20"}`}
            >
              <cat.icon className="h-5 w-5 mx-auto text-primary mb-1.5" />
              <div className="text-xs font-medium text-foreground">{cat.name}</div>
              <div className="text-[10px] text-muted-foreground">{cat.count} tool{cat.count !== 1 ? "s" : ""}</div>
            </button>
          ))}
        </div>
      </section>

      {/* All Tools Grid */}
      <section className="container mt-12">
        <h2 className="text-xl font-semibold mb-6 text-foreground">
          {activeCategory === "All" ? "All Tools" : activeCategory} <span className="text-muted-foreground font-normal text-base">({filtered.length})</span>
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tool, i) => (
            <Link
              key={tool.href}
              to={tool.href}
              className="surface-elevated rounded-xl p-6 group hover:ring-2 hover:ring-primary/20 transition-all animate-fade-in"
              style={{ animationDelay: `${i * 40}ms` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-accent flex items-center justify-center">
                  <tool.icon className="h-5 w-5 text-accent-foreground" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{tool.category}</span>
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{tool.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
            </Link>
          ))}
          {filtered.length === 0 && (
            <p className="text-muted-foreground col-span-full text-center py-8">No tools match your search.</p>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mt-16 pb-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-2">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-center mb-8">Everything you need to know about 1StepAhead's free finance tools.</p>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`}>
                <AccordionTrigger className="text-left text-foreground">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA */}
      <section className="container mt-12 pb-16">
        <div className="hero-gradient rounded-2xl p-10 md:p-16 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground">Ready to Take Control of Your Finances?</h2>
          <p className="mt-3 text-primary-foreground/80 max-w-lg mx-auto">
            Pick any tool and start making smarter money decisions in seconds — completely free.
          </p>
          <Button asChild size="lg" className="mt-6 bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full px-8">
            <Link to="/compound-interest">
              Get Started <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
