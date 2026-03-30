import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import ToolShell from "@/components/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NetWorthCalculator() {
  const [cash, setCash] = useState(15000);
  const [investments, setInvestments] = useState(50000);
  const [retirement, setRetirement] = useState(80000);
  const [property, setProperty] = useState(250000);
  const [otherAssets, setOtherAssets] = useState(10000);
  const [mortgage, setMortgage] = useState(200000);
  const [studentLoans, setStudentLoans] = useState(25000);
  const [carLoan, setCarLoan] = useState(12000);
  const [creditCards, setCreditCards] = useState(3000);
  const [otherDebts, setOtherDebts] = useState(0);

  const result = useMemo(() => {
    const totalAssets = cash + investments + retirement + property + otherAssets;
    const totalLiabilities = mortgage + studentLoans + carLoan + creditCards + otherDebts;
    const netWorth = totalAssets - totalLiabilities;
    const chart = [
      { name: "Cash", assets: cash, liabilities: 0 },
      { name: "Investments", assets: investments, liabilities: 0 },
      { name: "Retirement", assets: retirement, liabilities: 0 },
      { name: "Property", assets: property, liabilities: mortgage },
      { name: "Other", assets: otherAssets, liabilities: studentLoans + carLoan + creditCards + otherDebts },
    ];
    const debtToAssetRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;
    return { totalAssets, totalLiabilities, netWorth, chart, debtToAssetRatio };
  }, [cash, investments, retirement, property, otherAssets, mortgage, studentLoans, carLoan, creditCards, otherDebts]);

  return (
    <ToolShell
      title="Net Worth Calculator"
      description="Calculate your total net worth by listing all your assets and liabilities. Net worth is the single most important number for measuring your financial health — it's what you own minus what you owe."
      howToUse="List each of your assets in the Assets section: cash and savings account balances, investment accounts (brokerage, taxable), retirement accounts (401k, IRA, Roth IRA), property value (current market estimate), and any other assets (vehicles, valuables, crypto). Then list your liabilities: remaining mortgage balance, student loans, car loans, credit card balances, and any other debts. Your net worth is calculated automatically as Total Assets minus Total Liabilities. Update this quarterly to track your progress — watching your net worth grow is one of the most motivating financial habits you can build."
      understandingTitle="Understanding Net Worth"
      understandingContent="Net worth is the single best snapshot of your overall financial health. It's simply: Assets (what you own) minus Liabilities (what you owe) = Net Worth. A positive and growing net worth means you're building wealth. A negative net worth (common for recent graduates with student debt) isn't necessarily bad — it's a starting point. What matters is the trend. According to the Federal Reserve's Survey of Consumer Finances, the median US household net worth is approximately $192,000 (mean: $1.06 million, skewed by ultra-wealthy households). Net worth by age benchmarks (median): Under 35: $39,000. 35–44: $135,000. 45–54: $247,000. 55–64: $364,000. 65–74: $409,000. Fidelity's guideline suggests saving 1× your salary by 30, 3× by 40, 6× by 50, and 8× by 60 for retirement readiness. To grow net worth, focus on two levers: (1) increase assets by saving and investing consistently, and (2) decrease liabilities by paying down debt aggressively, especially high-interest debt. Your home equity (property value minus mortgage) often represents the largest portion of net worth for middle-class households, while for wealthy households, investments dominate."
      faqs={[
        { question: "Should I include my home?", answer: "Yes. Include the current estimated market value as an asset and the remaining mortgage balance as a liability. The difference is your home equity — often the largest component of net worth for homeowners. Use Zillow, Redfin, or a recent appraisal for a market value estimate. Don't include the original purchase price — use today's value." },
        { question: "How often should I calculate net worth?", answer: "Monthly or quarterly is ideal. Monthly tracking helps you spot trends and stay motivated. Use a spreadsheet, app (Personal Capital, Mint, YNAB), or simply bookmark this calculator. The cadence matters less than consistency — pick a schedule and stick with it." },
        { question: "What's a good net worth for my age?", answer: "A common benchmark from 'The Millionaire Next Door': multiply your age by your pre-tax annual income, divide by 10. If you're 30 earning $60,000, a 'good' net worth would be $180,000. Fidelity's saving targets: 1× salary by 30, 3× by 40, 6× by 50, 8× by 60, 10× by 67. These are guidelines — your specific situation (cost of living, family size, career trajectory) matters more." },
        { question: "Should I include my car in assets?", answer: "You can, but be conservative. Cars depreciate rapidly (20% in year one, ~15% per year after). Use Kelley Blue Book for a realistic value. Some financial planners exclude depreciating assets entirely, focusing only on 'investable' net worth (financial assets minus debts)." },
        { question: "What about assets I can't easily sell?", answer: "Include liquid assets (cash, stocks, bonds) and semi-liquid assets (real estate, retirement accounts). For assets that are hard to value or sell (collectibles, art, business equity), use conservative estimates. Some planners track 'liquid net worth' separately — excluding home equity and retirement accounts — for a clearer picture of accessible wealth." },
        { question: "My net worth is negative — is that normal?", answer: "It's common for people under 35, especially those with student loans. A new graduate with $50,000 in student debt and $5,000 in savings has a -$45,000 net worth — that's a starting point, not a failure. Focus on the trajectory: if your net worth increases every quarter, you're winning regardless of whether the absolute number is positive or negative." },
      ]}
      relatedTools={[
        { title: "Budget Planner", href: "/budget-planner" },
        { title: "Investment Goal Calculator", href: "/investment-goal" },
        { title: "Retirement Calculator", href: "/retirement" },
        { title: "Debt Payoff Calculator", href: "/debt-payoff" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <h3 className="font-semibold text-foreground">Assets</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Cash & Savings</Label><Input type="number" value={cash} onChange={(e) => setCash(+e.target.value)} min={0} /></div>
            <div><Label className="text-xs">Investments</Label><Input type="number" value={investments} onChange={(e) => setInvestments(+e.target.value)} min={0} /></div>
            <div><Label className="text-xs">Retirement Accounts</Label><Input type="number" value={retirement} onChange={(e) => setRetirement(+e.target.value)} min={0} /></div>
            <div><Label className="text-xs">Property Value</Label><Input type="number" value={property} onChange={(e) => setProperty(+e.target.value)} min={0} /></div>
            <div><Label className="text-xs">Other Assets</Label><Input type="number" value={otherAssets} onChange={(e) => setOtherAssets(+e.target.value)} min={0} /></div>
          </div>
          <h3 className="font-semibold text-foreground pt-2">Liabilities</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Mortgage</Label><Input type="number" value={mortgage} onChange={(e) => setMortgage(+e.target.value)} min={0} /></div>
            <div><Label className="text-xs">Student Loans</Label><Input type="number" value={studentLoans} onChange={(e) => setStudentLoans(+e.target.value)} min={0} /></div>
            <div><Label className="text-xs">Car Loan</Label><Input type="number" value={carLoan} onChange={(e) => setCarLoan(+e.target.value)} min={0} /></div>
            <div><Label className="text-xs">Credit Cards</Label><Input type="number" value={creditCards} onChange={(e) => setCreditCards(+e.target.value)} min={0} /></div>
            <div><Label className="text-xs">Other Debts</Label><Input type="number" value={otherDebts} onChange={(e) => setOtherDebts(+e.target.value)} min={0} /></div>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Total Assets</div><div className="text-lg font-bold text-foreground">${result.totalAssets.toLocaleString()}</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Total Liabilities</div><div className="text-lg font-bold text-foreground">${result.totalLiabilities.toLocaleString()}</div></div>
            <div className={`rounded-lg p-4 ${result.netWorth >= 0 ? "bg-primary/10" : "bg-destructive/10"}`}><div className="text-xs text-muted-foreground">Net Worth</div><div className={`text-lg font-bold ${result.netWorth >= 0 ? "text-primary" : "text-destructive"}`}>${result.netWorth.toLocaleString()}</div></div>
          </div>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={result.chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="assets" fill="hsl(var(--chart-2))" name="Assets" />
              <Bar dataKey="liabilities" fill="hsl(var(--chart-1))" name="Liabilities" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ToolShell>
  );
}