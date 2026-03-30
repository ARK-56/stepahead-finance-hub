import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import ToolShell from "@/components/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InvestmentGoalCalculator() {
  const [goal, setGoal] = useState(100000);
  const [current, setCurrent] = useState(5000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(15);

  const data = useMemo(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    const futureOfCurrent = current * Math.pow(1 + r, n);
    const remaining = Math.max(0, goal - futureOfCurrent);
    const monthlyNeeded = r > 0 ? remaining / ((Math.pow(1 + r, n) - 1) / r) : remaining / n;

    const points = Array.from({ length: years + 1 }, (_, y) => {
      const m = y * 12;
      const val = current * Math.pow(1 + r, m) + monthlyNeeded * ((Math.pow(1 + r, m) - 1) / r);
      return { year: y, value: Math.round(val), goal };
    });

    const totalContributions = current + monthlyNeeded * n;
    const interestEarned = Math.round(goal - totalContributions);

    return { points, monthlyNeeded: Math.round(monthlyNeeded * 100) / 100, futureOfCurrent: Math.round(futureOfCurrent), totalContributions: Math.round(totalContributions), interestEarned };
  }, [goal, current, rate, years]);

  return (
    <ToolShell
      title="Investment Goal Calculator"
      description="Find out exactly how much you need to save each month to reach any financial goal — a down payment, college fund, dream vacation, or early retirement. Set your target, timeline, and expected return, and let compound growth do the math."
      howToUse="Enter your target 'Financial Goal' — the total amount you want to accumulate. Add your 'Current Savings' (what you've already set aside toward this goal). Set the 'Expected Annual Return' based on your investment strategy (conservative: 4–5%, balanced: 6–7%, aggressive: 8–10%). Choose your 'Time Horizon' — how many years until you need the money. The calculator tells you the exact monthly savings needed and shows a growth chart with a dashed goal line so you can visualize your progress trajectory."
      understandingTitle="Understanding Investment Planning"
      understandingContent="Setting a clear financial goal with a specific dollar amount and deadline transforms vague aspirations into actionable plans. The required monthly contribution depends on three critical factors: (1) how much you've already saved, (2) how long you have to invest, and (3) the expected return on your investments. Time is by far the most powerful lever. Doubling your time horizon can reduce your required monthly savings by 60–70% thanks to compound growth. For example, saving $100,000 in 10 years at 7% requires about $580/month, but the same goal over 20 years requires only about $200/month — and you'll contribute $48,000 over 20 years compared to $69,600 over 10 years. Your expected return should match your investment vehicle: high-yield savings (4–5%), bond funds (4–6%), balanced funds (6–7%), stock index funds (7–10%). For goals under 3 years, prioritize capital preservation (savings/CDs). For 3–10 years, use a balanced approach. For 10+ years, you can afford more stock exposure for higher expected returns."
      faqs={[
        { question: "What rate of return should I assume?", answer: "Match to your investment: High-yield savings/CDs: 4–5%. Bond index funds: 4–6%. Balanced 60/40 portfolio: 6–7%. Stock index funds (S&P 500): 7–10% historically. For planning purposes, using 6–7% is conservative and accounts for inflation. Always use the 'real' return (nominal minus ~2–3% inflation) if your goal amount is in today's dollars." },
        { question: "Does this account for inflation?", answer: "Not directly. If you enter a 7% return, the result is in future (nominal) dollars. To plan in today's purchasing power, use a 'real' return rate (subtract 2–3% for inflation). Alternatively, increase your goal amount by 2–3% per year to account for the rising cost of whatever you're saving for." },
        { question: "What if I can't afford the monthly amount?", answer: "You have four levers to adjust: (1) extend the timeline, (2) increase your expected return by accepting more investment risk, (3) reduce the goal amount, or (4) increase your current savings with a lump sum (tax refund, bonus, etc.). Even partial progress matters — saving less than the calculated amount still puts you closer to your goal." },
        { question: "Where should I invest for my goal?", answer: "Match the investment to the timeline. Under 2 years: high-yield savings or CDs. 2–5 years: short-term bond funds or conservative balanced funds. 5–10 years: balanced index funds (60% stocks, 40% bonds). 10+ years: stock-heavy index funds (80%+ stocks). For specific goals like college (529 plan) or retirement (IRA/401k), use tax-advantaged accounts." },
        { question: "Should I invest a lump sum or dollar-cost average?", answer: "Historically, investing a lump sum immediately outperforms dollar-cost averaging about 2/3 of the time because markets trend upward. However, DCA (spreading investments over months) reduces the risk of investing at a market peak and can be psychologically easier. For regular monthly savings from income, you're naturally dollar-cost averaging." },
        { question: "How do taxes affect my goal?", answer: "In taxable accounts, investment gains are taxed annually (dividends/interest) and at sale (capital gains), reducing your effective return by 1–2%. Tax-advantaged accounts (401k, IRA, 529, HSA) let your money compound without tax drag. If your goal aligns with a tax-advantaged account type, always use it." },
      ]}
      relatedTools={[
        { title: "Compound Interest Calculator", href: "/compound-interest" },
        { title: "Retirement Calculator", href: "/retirement" },
        { title: "Stock Return Calculator", href: "/stock-return" },
        { title: "DRIP Calculator", href: "/drip-calculator" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <Label>Financial Goal ($)</Label>
            <Input type="number" value={goal} onChange={(e) => setGoal(+e.target.value)} min={0} />
            <p className="text-xs text-muted-foreground mt-1">Down payment, college fund, retirement nest egg, etc.</p>
          </div>
          <div>
            <Label>Current Savings ($)</Label>
            <Input type="number" value={current} onChange={(e) => setCurrent(+e.target.value)} min={0} />
            <p className="text-xs text-muted-foreground mt-1">Amount already saved toward this goal.</p>
          </div>
          <div>
            <Label>Expected Annual Return (%)</Label>
            <Input type="number" value={rate} onChange={(e) => setRate(+e.target.value)} min={0} step={0.1} />
            <p className="text-xs text-muted-foreground mt-1">Savings: 4–5% · Balanced: 6–7% · Stocks: 8–10%</p>
          </div>
          <div>
            <Label>Time Horizon (Years)</Label>
            <Input type="number" value={years} onChange={(e) => setYears(+e.target.value)} min={1} max={50} />
            <p className="text-xs text-muted-foreground mt-1">More time = lower monthly savings needed.</p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="rounded-lg bg-primary/10 p-4"><div className="text-xs text-muted-foreground">Monthly Savings Needed</div><div className="text-lg font-bold text-primary">${data.monthlyNeeded.toLocaleString()}</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Goal Amount</div><div className="text-lg font-bold text-foreground">${goal.toLocaleString()}</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Total Contributions</div><div className="text-lg font-bold text-foreground">${data.totalContributions.toLocaleString()}</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Interest Earned</div><div className="text-lg font-bold text-foreground">${data.interestEarned.toLocaleString()}</div></div>
          </div>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.points}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Legend />
              <Area type="monotone" dataKey="value" fill="hsl(var(--chart-1))" stroke="hsl(var(--chart-1))" name="Portfolio Value" />
              <Area type="monotone" dataKey="goal" fill="none" stroke="hsl(var(--chart-3))" strokeDasharray="5 5" name="Goal" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ToolShell>
  );
}