import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-card/80 backdrop-blur-md">
      <div className="container flex h-14 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight text-foreground">
          <TrendingUp className="h-5 w-5 text-primary" />
          1StepAhead
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <Link to="/compound-interest" className="hover:text-foreground transition-colors">Calculators</Link>
          <Link to="/tax-estimator" className="hover:text-foreground transition-colors">Tax Tools</Link>
          <Link to="/currency-converter" className="hover:text-foreground transition-colors">Converters</Link>
        </nav>
      </div>
    </header>
  );
}
