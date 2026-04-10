import { Link } from "react-router-dom";
import { TrendingUp } from "lucide-react";

const footerCategories = [
  {
    title: "Loan & Debt",
    links: [
      { label: "Student Loan", href: "/student-loan" },
      { label: "Auto Loan", href: "/auto-loan" },
      { label: "Personal Loan", href: "/personal-loan" },
      { label: "Debt Payoff", href: "/debt-payoff" },
    ],
  },
  {
    title: "Investing",
    links: [
      { label: "Compound Interest", href: "/compound-interest" },
      { label: "Investment Goal", href: "/investment-goal" },
      { label: "Retirement Savings", href: "/retirement" },
      { label: "Stock Return", href: "/stock-return" },
      { label: "DRIP Calculator", href: "/drip-calculator" },
    ],
  },
  {
    title: "Tax Tools",
    links: [
      { label: "Tax Estimator", href: "/tax-estimator" },
      { label: "Tax Bracket", href: "/tax-bracket" },
      { label: "Capital Gains Tax", href: "/capital-gains-tax" },
      { label: "Paycheck Tax", href: "/paycheck-tax" },
    ],
  },
  {
    title: "More Tools",
    links: [
      { label: "Budget Planner", href: "/budget-planner" },
      { label: "Net Worth", href: "/net-worth" },
      { label: "Cost of Living", href: "/cost-of-living" },
      { label: "Rent vs. Buy", href: "/rent-vs-buy" },
      { label: "Mortgage", href: "/mortgage-amortization" },
      { label: "Currency Converter", href: "/currency-converter" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border/60 bg-card mt-0">
      <div className="container py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg text-foreground font-display mb-3">
              <div className="h-7 w-7 rounded-lg hero-gradient flex items-center justify-center">
                <TrendingUp className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              1StepAhead
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Free, private, professional-grade finance calculators. No sign-ups required.
            </p>
          </div>

          {/* Category columns */}
          {footerCategories.map((cat) => (
            <div key={cat.title}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">{cat.title}</h4>
              <ul className="space-y-2.5">
                {cat.links.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-border/60 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} 1StepAhead. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="text-xs text-muted-foreground hover:text-primary transition-colors">About</Link>
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
          </div>
          <p className="text-xs text-muted-foreground">
            Results are estimates for educational purposes only. Not financial advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
