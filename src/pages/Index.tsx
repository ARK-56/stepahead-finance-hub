import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search, Calculator, Receipt, ArrowLeftRight, TrendingUp, BarChart3,
  Wallet, Home, GraduationCap, Car, CreditCard, Target, PiggyBank,
  DollarSign, Percent, Building, ArrowRight, CheckCircle2, Zap, Shield, Star,
  LineChart, Lock, Sparkles
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
  { icon: Zap, title: "Instant Results", description: "Real-time calculations as you type — zero lag, no reloads.", color: "from-[hsl(228,76%,52%)] to-[hsl(228,76%,42%)]" },
  { icon: Lock, title: "Privacy First", description: "Everything runs locally in your browser. We never touch your data.", color: "from-[hsl(158,64%,42%)] to-[hsl(158,64%,32%)]" },
  { icon: LineChart, title: "Expert Formulas", description: "Industry-standard math used by CPAs, banks, and financial advisors.", color: "from-[hsl(40,90%,52%)] to-[hsl(40,90%,42%)]" },
  { icon: Sparkles, title: "100% Free Forever", description: "No sign-ups, no subscriptions, no hidden fees. Every tool, always free.", color: "from-[hsl(340,75%,55%)] to-[hsl(340,75%,45%)]" },
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
      {/* ─── Hero ─── */}
      <section className="relative overflow-hidden pb-16 md:pb-20 -mt-16">
        {/* Deep finance gradient */}
        <div className="absolute inset-0 hero-gradient" />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 finance-grid opacity-[0.08]" />
        {/* Glow accents */}
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-[hsl(158,64%,42%,0.08)] blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-[hsl(228,76%,62%,0.12)] blur-[100px]" />

        <div className="container relative text-center pt-28 md:pt-40">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-foreground/10 text-primary-foreground/90 text-sm font-medium mb-8 backdrop-blur-sm border border-primary-foreground/10 animate-fade-in">
            <Sparkles className="h-3.5 w-3.5" />
            19 Free Financial Tools — No Sign-Up Required
          </span>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-primary-foreground leading-[1.08] font-display animate-fade-in">
            Smart Finance Tools,
            <br className="hidden sm:block" />
            <span className="relative inline-block mt-1">
              One Step Ahead
              <span className="absolute -bottom-1.5 left-0 w-full h-1 bg-[hsl(158,64%,50%)] rounded-full opacity-60" />
            </span>
          </h1>

          <p className="mt-7 text-primary-foreground/70 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed animate-fade-in" style={{ animationDelay: "100ms" }}>
            Professional-grade calculators for loans, taxes, investing, budgeting,
            and real estate — all free, private, and instant.
          </p>

          {/* Search */}
          <div className="mt-10 max-w-xl mx-auto relative animate-fade-in" style={{ animationDelay: "200ms" }}>
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/70" />
            <Input
              placeholder="Search 19 financial tools…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-13 h-14 rounded-2xl bg-card/95 border-0 shadow-2xl text-base text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary-foreground/20 backdrop-blur-sm"
            />
          </div>

          {/* Quick links */}
          <div className="mt-5 flex flex-wrap justify-center gap-2 text-sm animate-fade-in" style={{ animationDelay: "300ms" }}>
            <span className="text-primary-foreground/50 font-medium mr-1">Popular:</span>
            {["Compound Interest", "Debt Payoff", "Tax Bracket", "Retirement"].map(name => {
              const tool = tools.find(t => t.title.includes(name));
              return tool ? (
                <Link key={tool.href} to={tool.href} className="px-3 py-1 rounded-full bg-primary-foreground/8 hover:bg-primary-foreground/15 text-primary-foreground/70 hover:text-primary-foreground transition-all text-xs font-medium border border-primary-foreground/8">
                  {name}
                </Link>
              ) : null;
            })}
          </div>

          {/* Stats */}
          <div className="mt-14 flex justify-center gap-12 md:gap-20 animate-fade-in" style={{ animationDelay: "400ms" }}>
            {[
              { value: "19", label: "Free Tools" },
              { value: "100%", label: "Private & Secure" },
              { value: "0", label: "Sign-ups Needed" },
            ].map((stat, i) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-extrabold text-primary-foreground font-display">{stat.value}</div>
                <div className="text-xs text-primary-foreground/50 mt-1 font-medium uppercase tracking-wider">{stat.label}</div>
                {i < 2 && <div className="hidden md:block" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Gradient transition bridge ─── */}
      <div className="relative h-32 md:h-40 -mt-1">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--hero-gradient-to))] to-background" />
      </div>

      {/* ─── Why 1StepAhead ─── */}
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 finance-grid opacity-[0.04]" />
        <div className="container relative">
          <div className="text-center mb-14">
            <span className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold uppercase tracking-widest mb-4">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground font-display">
              Built for <span className="text-gradient">Smarter</span> Decisions
            </h2>
            <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
              Trusted by thousands of users to make confident financial decisions every day.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="group relative rounded-2xl border border-border bg-card p-7 text-center hover-lift animate-fade-in overflow-hidden"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mx-auto mb-5 shadow-lg`}>
                  <f.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-bold text-foreground mb-2 font-display">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Popular Tools ─── */}
      <section className="relative py-20 md:py-24 bg-gradient-to-br from-[hsl(228,76%,52%,0.04)] via-background to-[hsl(158,64%,42%,0.04)]">
        <div className="container">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary mb-2 block">Most Used</span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground font-display">Popular Tools</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-primary font-semibold" onClick={() => { setActiveCategory("All"); document.getElementById("all-tools")?.scrollIntoView({ behavior: "smooth" }); }}>
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {popularTools.map((tool) => (
              <Link
                key={tool.href}
                to={tool.href}
                className="group relative rounded-2xl border border-border bg-card p-6 hover-lift transition-all hover:border-primary/30"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                    <tool.icon className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{tool.category}</span>
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors font-display text-[15px]">{tool.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
                <span className="inline-flex items-center mt-4 text-sm font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Try it free <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Educational Content Section ─── */}
      <section className="relative py-20 md:py-24 bg-gradient-to-b from-[hsl(158,64%,42%,0.04)] via-background to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold uppercase tracking-widest mb-4">
              Financial Literacy
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground font-display mb-8">
              Why Understanding Your Money Matters
            </h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                According to the National Financial Educators Council, the average American lost over $1,500 in 2023 due to a lack of financial knowledge — from choosing the wrong loan terms to missing tax deductions they were entitled to. Across the U.S., that adds up to nearly $400 billion in preventable losses every year.
              </p>
              <p>
                The problem isn't that people are bad with money — it's that the tools to make smart financial decisions have traditionally been locked behind paywalls, complicated spreadsheets, or expensive professional consultations. A first-time homebuyer shouldn't need to hire a financial planner just to understand whether renting or buying makes more sense for their situation. A freelancer shouldn't need an accountant just to estimate their quarterly tax payments.
              </p>
              <p>
                That's exactly why we built 1StepAhead. Every tool on this site uses the same industry-standard formulas employed by CPAs, banks, and financial advisors — wrapped in a clean interface that gives you answers in seconds. Whether you're calculating compound interest to understand long-term investing, comparing debt payoff strategies, or estimating your capital gains tax before selling an investment, these tools help you make informed decisions with confidence.
              </p>
              <p>
                Our calculators cover the five pillars of personal finance: <strong>borrowing</strong> (understanding loans, interest rates, and repayment), <strong>saving and investing</strong> (compound growth, dividend reinvestment, and goal planning), <strong>taxes</strong> (brackets, deductions, and self-employment obligations), <strong>budgeting</strong> (spending allocation and net worth tracking), and <strong>housing</strong> (mortgage amortization and rent-vs-buy analysis). Together, they provide a comprehensive toolkit for every stage of your financial life.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-24 bg-gradient-to-b from-[hsl(40,90%,52%,0.03)] via-muted/50 to-background" id="all-tools">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8 text-foreground font-display">Browse by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.name}
                onClick={() => setActiveCategory(cat.name)}
                className={`rounded-xl p-4 text-center transition-all cursor-pointer border ${activeCategory === cat.name ? "border-primary bg-accent shadow-sm" : "border-border bg-card hover:border-primary/30"}`}
              >
                <cat.icon className={`h-5 w-5 mx-auto mb-1.5 ${activeCategory === cat.name ? "text-primary" : "text-muted-foreground"}`} />
                <div className={`text-xs font-semibold ${activeCategory === cat.name ? "text-primary" : "text-foreground"}`}>{cat.name}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{cat.count} tool{cat.count !== 1 ? "s" : ""}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── All Tools Grid ─── */}
      <section className="relative py-16 md:py-20 bg-gradient-to-br from-background via-[hsl(228,76%,52%,0.02)] to-background">
        <div className="container">
          <h2 className="text-xl font-semibold mb-6 text-foreground font-display">
            {activeCategory === "All" ? "All Tools" : activeCategory}{" "}
            <span className="text-muted-foreground font-normal text-base">({filtered.length})</span>
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((tool, i) => (
              <Link
                key={tool.href}
                to={tool.href}
                className="group rounded-2xl border border-border bg-card p-6 hover-lift transition-all hover:border-primary/30 animate-fade-in"
                style={{ animationDelay: `${i * 40}ms` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-10 w-10 rounded-xl bg-accent flex items-center justify-center shrink-0">
                    <tool.icon className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{tool.category}</span>
                </div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors font-display text-[15px]">{tool.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{tool.description}</p>
              </Link>
            ))}
            {filtered.length === 0 && (
              <p className="text-muted-foreground col-span-full text-center py-12">No tools match your search.</p>
            )}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="relative py-20 md:py-28 bg-gradient-to-b from-accent/20 via-muted/40 to-background">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <span className="inline-block px-3 py-1 rounded-full bg-accent text-accent-foreground text-xs font-semibold uppercase tracking-widest mb-4">
                FAQ
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground font-display">Frequently Asked Questions</h2>
              <p className="text-muted-foreground mt-3">Everything you need to know about 1StepAhead's free finance tools.</p>
            </div>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`faq-${i}`} className="border-border">
                  <AccordionTrigger className="text-left text-foreground font-medium hover:text-primary transition-colors">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="container py-20">
        <div className="relative hero-gradient rounded-3xl p-12 md:p-20 text-center overflow-hidden">
          <div className="absolute inset-0 finance-grid opacity-[0.06]" />
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[hsl(158,64%,42%,0.1)] blur-[80px]" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground font-display">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="mt-4 text-primary-foreground/70 max-w-lg mx-auto text-lg">
              Pick any tool and start making smarter money decisions in seconds — completely free.
            </p>
            <Button asChild size="lg" className="mt-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90 rounded-full px-10 font-semibold shadow-lg">
              <Link to="/compound-interest">
                Get Started <ArrowRight className="h-4 w-4 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
