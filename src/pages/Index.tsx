import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Calculator, Receipt, ArrowLeftRight, TrendingUp, BarChart3, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";

const tools = [
  {
    title: "Compound Interest Calculator",
    description: "Visualize how your investments grow over time with interactive charts.",
    icon: Calculator,
    href: "/compound-interest",
    category: "Calculators",
  },
  {
    title: "Freelance Tax Estimator",
    description: "Estimate your self-employment taxes with a simple step-by-step form.",
    icon: Receipt,
    href: "/tax-estimator",
    category: "Tax Tools",
  },
  {
    title: "Currency Converter",
    description: "Convert between 150+ world currencies with live exchange rates.",
    icon: ArrowLeftRight,
    href: "/currency-converter",
    category: "Converters",
  },
];

const categories = [
  { name: "Calculators", icon: Calculator, count: 1 },
  { name: "Tax Tools", icon: Receipt, count: 1 },
  { name: "Converters", icon: ArrowLeftRight, count: 1 },
  { name: "Investments", icon: TrendingUp, count: 0 },
  { name: "Analytics", icon: BarChart3, count: 0 },
  { name: "Budgeting", icon: Wallet, count: 0 },
];

export default function Index() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => tools.filter((t) => t.title.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  return (
    <div>
      {/* Hero */}
      <section className="hero-gradient py-20 md:py-28">
        <div className="container text-center">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-primary-foreground leading-tight">
            Smart Finance Tools,<br className="hidden sm:block" /> One Step Ahead
          </h1>
          <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto text-lg">
            Free, fast calculators and converters to help you make better financial decisions.
          </p>
          <div className="mt-8 max-w-md mx-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tools…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-12 rounded-full bg-card border-0 shadow-lg text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>
      </section>

      {/* Ad banner below hero */}
      <div className="container mt-8">
        <div className="ad-slot rounded-lg p-3 flex items-center justify-center h-[90px] text-muted-foreground text-sm">
          <span className="text-xs">Advertisement — 728×90 Leaderboard</span>
        </div>
      </div>

      {/* Categories */}
      <section className="container mt-12">
        <h2 className="text-xl font-semibold mb-6 text-foreground">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div key={cat.name} className="surface-elevated rounded-xl p-4 text-center hover:ring-2 hover:ring-primary/20 transition-all cursor-default">
              <cat.icon className="h-6 w-6 mx-auto text-primary mb-2" />
              <div className="text-sm font-medium text-foreground">{cat.name}</div>
              <div className="text-xs text-muted-foreground">{cat.count} tool{cat.count !== 1 ? "s" : ""}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools Grid */}
      <section className="container mt-12 pb-16">
        <h2 className="text-xl font-semibold mb-6 text-foreground">Popular Tools</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((tool, i) => (
            <Link
              key={tool.href}
              to={tool.href}
              className="surface-elevated rounded-xl p-6 group hover:ring-2 hover:ring-primary/20 transition-all animate-fade-in"
              style={{ animationDelay: `${i * 80}ms` }}
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
    </div>
  );
}
