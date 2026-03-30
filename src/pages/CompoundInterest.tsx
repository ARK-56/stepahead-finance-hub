import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import ToolShell from "@/components/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function CompoundInterest() {
  const [principal, setPrincipal] = useState(10000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(20);
  const [monthly, setMonthly] = useState(200);

  const data = useMemo(() => {
    const r = rate / 100 / 12;
    return Array.from({ length: years + 1 }, (_, year) => {
      const months = year * 12;
      const compound = principal * Math.pow(1 + r, months) + monthly * ((Math.pow(1 + r, months) - 1) / r);
      const totalContributions = principal + monthly * months;
      return {
        year,
        total: Math.round(compound),
        contributions: Math.round(totalContributions),
        interest: Math.round(compound - totalContributions),
      };
    });
  }, [principal, rate, years, monthly]);

  const final = data[data.length - 1];

  return (
    <ToolShell
      title="Compound Interest Calculator"
      description="Discover how your savings and investments grow exponentially over time with the power of compound interest. Enter your details below to visualize the difference between what you contribute and what your money earns on its own."
      howToUse="Start by entering your initial lump-sum investment in the 'Initial Investment' field — this is the amount you're starting with today. Next, set a recurring 'Monthly Contribution' — even small amounts like $50 or $100 per month make a dramatic difference over decades. Choose your expected 'Annual Interest Rate' based on your investment type (savings accounts typically earn 4–5%, while a diversified stock portfolio has historically returned 7–10% annually). Finally, select the number of 'Years' you plan to invest. The calculator instantly updates the chart and summary cards showing your projected total value, total contributions, and interest earned."
      understandingTitle="Understanding Compound Interest"
      understandingContent="Compound interest is often called the eighth wonder of the world — and for good reason. Unlike simple interest, which only earns returns on your original principal, compound interest earns returns on both the principal and all previously accumulated interest. This creates an exponential growth curve that accelerates over time. The three key variables that determine your outcome are: (1) the interest rate, (2) the compounding frequency (this calculator uses monthly compounding, the most common for savings and investment accounts), and (3) time. Even a modest 7% annual return turns $10,000 into over $76,000 in 30 years without any additional contributions. Add $200/month, and that number jumps to over $300,000. The lesson is clear: start early, contribute consistently, and let time do the heavy lifting. Albert Einstein reportedly called compound interest 'the most powerful force in the universe,' and your financial future depends on harnessing it."
      faqs={[
        { question: "What is the difference between simple and compound interest?", answer: "Simple interest is calculated only on the original principal. For example, $10,000 at 5% simple interest earns exactly $500 per year, every year. Compound interest calculates interest on the principal plus all accumulated interest. After year one you'd have $10,500; in year two, 5% is applied to $10,500 (earning $525), and so on. Over 20 years, the same $10,000 earns $10,000 with simple interest but about $16,533 with compound interest — a 65% difference." },
        { question: "How often is the interest compounded in this calculator?", answer: "This calculator compounds interest monthly (12 times per year), which is the most common compounding frequency for savings accounts, CDs, and investment funds. Monthly compounding produces slightly higher returns than annual compounding because each month's interest starts earning interest sooner." },
        { question: "Is the result guaranteed?", answer: "No. This calculator provides a projection based on a fixed annual return, which is useful for planning purposes. Actual investment returns vary year to year — stocks might return 20% one year and lose 10% the next. Savings accounts and CDs offer more predictable returns but at lower rates. Use this tool to set realistic expectations, not as a guarantee." },
        { question: "What annual interest rate should I use?", answer: "It depends on your investment: High-yield savings accounts currently offer 4–5%. CDs range from 4–5.5%. The S&P 500 has historically returned about 10% annually (roughly 7% after inflation). Bond funds typically return 4–6%. For conservative long-term planning, 6–7% is a common assumption for a balanced portfolio." },
        { question: "Why does starting early matter so much?", answer: "Because of compounding, the first dollars you invest have the most time to grow. A 25-year-old who invests $200/month at 7% until age 65 will have about $525,000. A 35-year-old doing the same will have about $245,000 — less than half — despite only missing 10 years of contributions. The early investor contributed just $24,000 more but ends up $280,000 richer." },
        { question: "How do taxes affect compound interest?", answer: "In taxable accounts, you may owe taxes on interest and dividends each year, which reduces the effective rate of compounding. Tax-advantaged accounts like 401(k)s, IRAs, and Roth IRAs allow your investments to compound without annual tax drag, significantly boosting long-term returns. A Roth IRA, in particular, allows completely tax-free growth and withdrawals in retirement." },
      ]}
      relatedTools={[
        { title: "Investment Goal Calculator", href: "/investment-goal" },
        { title: "Retirement Savings Calculator", href: "/retirement" },
        { title: "DRIP Calculator", href: "/drip-calculator" },
        { title: "Stock Return Calculator", href: "/stock-return" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <Label>Initial Investment ($)</Label>
            <Input type="number" value={principal} onChange={(e) => setPrincipal(+e.target.value)} min={0} />
            <p className="text-xs text-muted-foreground mt-1">The lump sum you're starting with today.</p>
          </div>
          <div>
            <Label>Monthly Contribution ($)</Label>
            <Input type="number" value={monthly} onChange={(e) => setMonthly(+e.target.value)} min={0} />
            <p className="text-xs text-muted-foreground mt-1">Amount you'll add every month. Even $50/month adds up.</p>
          </div>
          <div>
            <Label>Annual Interest Rate (%)</Label>
            <Input type="number" value={rate} onChange={(e) => setRate(+e.target.value)} min={0} step={0.1} />
            <p className="text-xs text-muted-foreground mt-1">Savings: 4–5% · Stocks: 7–10% · Bonds: 4–6%</p>
          </div>
          <div>
            <Label>Years</Label>
            <Input type="number" value={years} onChange={(e) => setYears(+e.target.value)} min={1} max={50} />
            <p className="text-xs text-muted-foreground mt-1">Longer time horizons amplify the compounding effect.</p>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="rounded-lg bg-accent p-4">
              <div className="text-xs text-muted-foreground">Total Value</div>
              <div className="text-lg font-bold text-foreground">${final.total.toLocaleString()}</div>
            </div>
            <div className="rounded-lg bg-accent p-4">
              <div className="text-xs text-muted-foreground">Interest Earned</div>
              <div className="text-lg font-bold text-primary">${final.interest.toLocaleString()}</div>
            </div>
            <div className="rounded-lg bg-accent p-4">
              <div className="text-xs text-muted-foreground">Contributions</div>
              <div className="text-lg font-bold text-foreground">${final.contributions.toLocaleString()}</div>
            </div>
          </div>
        </div>

        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} label={{ value: "Years", position: "insideBottom", offset: -2 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Legend />
              <Area type="monotone" dataKey="contributions" stackId="1" fill="hsl(var(--chart-2))" stroke="hsl(var(--chart-2))" name="Contributions" />
              <Area type="monotone" dataKey="interest" stackId="1" fill="hsl(var(--chart-1))" stroke="hsl(var(--chart-1))" name="Interest" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ToolShell>
  );
}