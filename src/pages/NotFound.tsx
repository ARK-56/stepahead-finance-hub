import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Home, Search, Calculator, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const suggestedTools = [
  { title: "Compound Interest Calculator", href: "/compound-interest", description: "See how your money grows over time." },
  { title: "Tax Bracket Calculator", href: "/tax-bracket", description: "Understand your 2024 federal tax rate." },
  { title: "Budget Planner", href: "/budget-planner", description: "Organize spending with the 50/30/20 rule." },
  { title: "Debt Payoff Calculator", href: "/debt-payoff", description: "Compare strategies to eliminate debt faster." },
];

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="py-20 md:py-32">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <div className="h-20 w-20 rounded-2xl bg-accent flex items-center justify-center mx-auto mb-8">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-foreground font-display mb-4">404</h1>
          <p className="text-xl text-muted-foreground mb-2">Page not found</p>
          <p className="text-muted-foreground mb-10 max-w-md mx-auto">
            The page <code className="px-2 py-0.5 bg-muted rounded text-sm">{location.pathname}</code> doesn't exist. It may have been moved or the URL might be incorrect.
          </p>

          <div className="flex items-center justify-center gap-4 mb-16">
            <Button asChild size="lg" className="rounded-full">
              <Link to="/"><Home className="h-4 w-4 mr-2" /> Go Home</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link to="/#all-tools"><Calculator className="h-4 w-4 mr-2" /> Browse Tools</Link>
            </Button>
          </div>

          <div className="text-left">
            <h2 className="text-lg font-semibold text-foreground font-display mb-4">Try one of our popular tools:</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {suggestedTools.map((tool) => (
                <Link
                  key={tool.href}
                  to={tool.href}
                  className="group rounded-xl border border-border bg-card p-5 hover:border-primary/30 transition-all"
                >
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm">{tool.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{tool.description}</p>
                  <span className="inline-flex items-center text-xs text-primary font-medium mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Open tool <ArrowRight className="h-3 w-3 ml-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
