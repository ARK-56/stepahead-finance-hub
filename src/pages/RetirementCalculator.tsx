import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import ToolShell from "@/components/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RetirementCalculator() {
  const [age, setAge] = useState(30);
  const [retireAge, setRetireAge] = useState(65);
  const [current, setCurrent] = useState(50000);
  const [monthly, setMonthly] = useState(500);
  const [rate, setRate] = useState(7);
  const [withdrawal, setWithdrawal] = useState(4);

  const data = useMemo(() => {
    const r = rate / 100 / 12;
    const yearsToRetire = retireAge - age;
    const points: { age: number; value: number }[] = [];

    for (let y = 0; y <= yearsToRetire; y++) {
      const m = y * 12;
      const val = current * Math.pow(1 + r, m) + monthly * ((Math.pow(1 + r, m) - 1) / r);
      points.push({ age: age + y, value: Math.round(val) });
    }

    const nestEgg = points[points.length - 1].value;
    const annualWithdrawal = nestEgg * (withdrawal / 100);
    let balance = nestEgg;
    for (let y = 1; y <= 30; y++) {
      balance = balance * (1 + rate / 100) - annualWithdrawal;
      if (balance < 0) balance = 0;
      points.push({ age: retireAge + y, value: Math.round(balance) });
    }

    const totalContributions = current + monthly * yearsToRetire * 12;

    return { points, nestEgg: Math.round(nestEgg), annualIncome: Math.round(annualWithdrawal), monthlyIncome: Math.round(annualWithdrawal / 12), totalContributions: Math.round(totalContributions) };
  }, [age, retireAge, current, monthly, rate, withdrawal]);

  return (
    <ToolShell
      title="Retirement Savings Calculator"
      description="Project your retirement nest egg and estimate your retirement income based on the 4% rule or a custom withdrawal rate. See how your portfolio grows during the accumulation phase and how long it lasts during retirement."
      howToUse="Enter your current age and desired retirement age. Add your existing retirement savings (401k, IRA, brokerage accounts combined) and your planned monthly contribution. Set the expected annual return (7% is a common assumption for a diversified stock portfolio). Adjust the withdrawal rate — the classic '4% rule' suggests a safe starting withdrawal rate for 30-year retirements. The chart shows two phases: portfolio growth (accumulation) from now until retirement, and portfolio drawdown (distribution) for 30 years of retirement."
      understandingTitle="Understanding Retirement Planning"
      understandingContent="Retirement planning comes down to two fundamental questions: (1) How large a portfolio can I build before I stop working? and (2) How much can I safely withdraw each year without running out of money? The 4% rule, derived from the Trinity Study, suggests withdrawing 4% of your portfolio in the first year of retirement, then adjusting for inflation each subsequent year. Historically, this has provided a 95%+ probability of the portfolio lasting at least 30 years across all market conditions since 1926. However, some financial planners now suggest 3.5% for added safety, especially given current bond yields and valuations. A common target is 25× your desired annual spending (the inverse of 4%). If you want $60,000/year in retirement, aim for a $1.5 million portfolio. Starting early is the single most impactful decision. A 25-year-old saving $500/month at 7% will have about $1.3 million at age 65, having contributed only $240,000. A 35-year-old saving the same amount accumulates $607,000 — less than half — despite contributing $180,000. The 10-year head start produced $700,000 more from just $60,000 in additional contributions. That's the power of compounding. Don't forget to factor in Social Security (check ssa.gov for your estimate), pension income, and potential part-time work — these can significantly reduce the portfolio size you need."
      faqs={[
        { question: "What is the 4% rule?", answer: "The 4% rule says you can withdraw 4% of your portfolio in year one of retirement, then adjust that dollar amount for inflation each year, and historically have a 95%+ chance of not running out of money over 30 years. It's based on research using US stock and bond returns since 1926. For a $1 million portfolio, that's $40,000/year ($3,333/month) in today's dollars." },
        { question: "How much do I need to retire?", answer: "A widely used rule of thumb: save 25× your desired annual spending. If you need $50,000/year → $1.25 million. $80,000/year → $2 million. $100,000/year → $2.5 million. Remember to subtract guaranteed income sources (Social Security, pension) from your spending needs. If Social Security provides $24,000/year and you need $60,000, you only need to fund $36,000/year from savings → $900,000." },
        { question: "Does this include Social Security?", answer: "No. Social Security would supplement your portfolio withdrawals, reducing the nest egg you need. Check ssa.gov/myaccount for your estimated benefit. The average Social Security benefit in 2024 is about $1,900/month ($22,800/year). Higher earners can receive up to ~$4,500/month. Factor this into your planning for a more complete picture." },
        { question: "What return should I assume?", answer: "Historical averages (1926–present): US stocks ~10% nominal (~7% after inflation), bonds ~5% (~2% real), 60/40 blend ~8% (~5% real). Most planners use 6–7% for a balanced portfolio. In retirement, a more conservative portfolio (60/40 or even 50/50) is common, so 5–6% may be more appropriate for the drawdown phase." },
        { question: "Should I use a Roth or Traditional retirement account?", answer: "Traditional (401k/IRA): contributions are tax-deductible now, withdrawals taxed in retirement. Best if your tax rate will be lower in retirement. Roth (Roth 401k/Roth IRA): contributions are after-tax, but growth and withdrawals are completely tax-free. Best if your tax rate will be the same or higher in retirement. Many advisors recommend contributing to both for tax diversification." },
        { question: "Can I retire early (before 59½)?", answer: "Yes, but you'll need to bridge the gap before you can access retirement accounts penalty-free at 59½. Strategies include: taxable brokerage account withdrawals, Roth contribution withdrawals (always penalty-free), 72(t) distributions (SEPP), and the Roth conversion ladder (a 5-year pipeline). The FIRE (Financial Independence, Retire Early) community typically targets 25–33× annual expenses." },
      ]}
      relatedTools={[
        { title: "Compound Interest Calculator", href: "/compound-interest" },
        { title: "Investment Goal Calculator", href: "/investment-goal" },
        { title: "Budget Planner", href: "/budget-planner" },
        { title: "Net Worth Calculator", href: "/net-worth" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Current Age</Label>
              <Input type="number" value={age} onChange={(e) => setAge(+e.target.value)} min={18} max={80} />
            </div>
            <div>
              <Label>Retirement Age</Label>
              <Input type="number" value={retireAge} onChange={(e) => setRetireAge(+e.target.value)} min={age + 1} max={85} />
            </div>
          </div>
          <div>
            <Label>Current Savings ($)</Label>
            <Input type="number" value={current} onChange={(e) => setCurrent(+e.target.value)} min={0} />
            <p className="text-xs text-muted-foreground mt-1">All retirement accounts combined (401k, IRA, etc.).</p>
          </div>
          <div>
            <Label>Monthly Contribution ($)</Label>
            <Input type="number" value={monthly} onChange={(e) => setMonthly(+e.target.value)} min={0} />
            <p className="text-xs text-muted-foreground mt-1">Include employer match. Max 401k: $23,000/yr (2024).</p>
          </div>
          <div>
            <Label>Expected Return (%)</Label>
            <Input type="number" value={rate} onChange={(e) => setRate(+e.target.value)} min={0} step={0.1} />
            <p className="text-xs text-muted-foreground mt-1">7% is a common assumption for a diversified portfolio.</p>
          </div>
          <div>
            <Label>Withdrawal Rate (%)</Label>
            <Input type="number" value={withdrawal} onChange={(e) => setWithdrawal(+e.target.value)} min={1} max={10} step={0.5} />
            <p className="text-xs text-muted-foreground mt-1">4% is the classic safe withdrawal rate for 30-year retirements.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Nest Egg</div><div className="text-lg font-bold text-foreground">${data.nestEgg.toLocaleString()}</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Annual Income</div><div className="text-lg font-bold text-primary">${data.annualIncome.toLocaleString()}</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Monthly Income</div><div className="text-lg font-bold text-foreground">${data.monthlyIncome.toLocaleString()}</div></div>
          </div>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.points}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="age" tick={{ fontSize: 12 }} label={{ value: "Age", position: "insideBottom", offset: -2 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `$${(v / 1000000).toFixed(1)}M`} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Legend />
              <Area type="monotone" dataKey="value" fill="hsl(var(--chart-1))" stroke="hsl(var(--chart-1))" name="Portfolio Value" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ToolShell>
  );
}