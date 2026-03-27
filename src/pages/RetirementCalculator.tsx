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

    // Accumulation phase
    for (let y = 0; y <= yearsToRetire; y++) {
      const m = y * 12;
      const val = current * Math.pow(1 + r, m) + monthly * ((Math.pow(1 + r, m) - 1) / r);
      points.push({ age: age + y, value: Math.round(val) });
    }

    // Distribution phase (30 years)
    const nestEgg = points[points.length - 1].value;
    const annualWithdrawal = nestEgg * (withdrawal / 100);
    let balance = nestEgg;
    for (let y = 1; y <= 30; y++) {
      balance = balance * (1 + rate / 100) - annualWithdrawal;
      if (balance < 0) balance = 0;
      points.push({ age: retireAge + y, value: Math.round(balance) });
    }

    return { points, nestEgg: Math.round(nestEgg), annualIncome: Math.round(annualWithdrawal), monthlyIncome: Math.round(annualWithdrawal / 12) };
  }, [age, retireAge, current, monthly, rate, withdrawal]);

  return (
    <ToolShell
      title="Retirement Savings Calculator"
      description="Project your retirement savings and estimate your retirement income using the 4% rule or custom withdrawal rate."
      howToUse="Enter your current age, desired retirement age, existing savings, monthly contribution, and expected return. The calculator projects your nest egg at retirement and estimated annual income based on your withdrawal rate."
      understandingTitle="Understanding Retirement Planning"
      understandingContent="The 4% rule suggests withdrawing 4% of your portfolio in the first year of retirement (adjusting for inflation), giving a high probability the money lasts 30 years. Starting early is crucial—thanks to compounding, a 25-year-old saving $500/month will accumulate far more than a 40-year-old saving the same amount."
      faqs={[
        { question: "What is the 4% rule?", answer: "It's a guideline suggesting you can withdraw 4% of your portfolio annually in retirement without running out of money over 30 years, based on historical market returns." },
        { question: "How much do I need to retire?", answer: "A common rule of thumb is 25× your desired annual spending. If you need $60,000/year, aim for $1.5 million." },
        { question: "Does this include Social Security?", answer: "No. Social Security income would reduce the amount you need from savings. Factor that in separately for a complete picture." },
      ]}
      relatedTools={[
        { title: "Compound Interest Calculator", href: "/compound-interest" },
        { title: "Investment Goal Calculator", href: "/investment-goal" },
        { title: "Budget Planner", href: "/budget-planner" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Current Age</Label><Input type="number" value={age} onChange={(e) => setAge(+e.target.value)} min={18} max={80} /></div>
            <div><Label>Retirement Age</Label><Input type="number" value={retireAge} onChange={(e) => setRetireAge(+e.target.value)} min={age + 1} max={85} /></div>
          </div>
          <div><Label>Current Savings ($)</Label><Input type="number" value={current} onChange={(e) => setCurrent(+e.target.value)} min={0} /></div>
          <div><Label>Monthly Contribution ($)</Label><Input type="number" value={monthly} onChange={(e) => setMonthly(+e.target.value)} min={0} /></div>
          <div><Label>Expected Return (%)</Label><Input type="number" value={rate} onChange={(e) => setRate(+e.target.value)} min={0} step={0.1} /></div>
          <div><Label>Withdrawal Rate (%)</Label><Input type="number" value={withdrawal} onChange={(e) => setWithdrawal(+e.target.value)} min={1} max={10} step={0.5} /></div>
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
