import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
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

    return { points, monthlyNeeded: Math.round(monthlyNeeded * 100) / 100, futureOfCurrent: Math.round(futureOfCurrent) };
  }, [goal, current, rate, years]);

  return (
    <ToolShell
      title="Investment Goal Calculator"
      description="Find out how much you need to save monthly to reach your financial goal by a target date."
      howToUse="Set your financial goal amount, current savings, expected annual return, and time frame. The calculator tells you exactly how much to invest each month to hit your target."
      understandingTitle="Understanding Investment Planning"
      understandingContent="Setting a clear financial goal with a timeline is the foundation of investment planning. The required monthly contribution depends on three factors: how much you already have, how long you have to invest, and the expected return. Starting early dramatically reduces the monthly amount needed thanks to compound growth."
      faqs={[
        { question: "What rate of return should I assume?", answer: "A diversified stock portfolio has historically returned 7-10% annually. Use 6-7% for a conservative estimate after inflation." },
        { question: "Does this account for inflation?", answer: "If you use a 'real' return rate (nominal minus inflation, typically 2-3%), the result is in today's dollars. Otherwise, the goal amount should be inflation-adjusted." },
        { question: "What if I can't afford the monthly amount?", answer: "Try extending the time horizon, increasing your expected return (with appropriate risk), or adjusting the goal amount downward." },
      ]}
      relatedTools={[
        { title: "Compound Interest Calculator", href: "/compound-interest" },
        { title: "Retirement Calculator", href: "/retirement" },
        { title: "Stock Return Calculator", href: "/stock-return" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div><Label>Financial Goal ($)</Label><Input type="number" value={goal} onChange={(e) => setGoal(+e.target.value)} min={0} /></div>
          <div><Label>Current Savings ($)</Label><Input type="number" value={current} onChange={(e) => setCurrent(+e.target.value)} min={0} /></div>
          <div><Label>Expected Annual Return (%)</Label><Input type="number" value={rate} onChange={(e) => setRate(+e.target.value)} min={0} step={0.1} /></div>
          <div><Label>Time Horizon (Years)</Label><Input type="number" value={years} onChange={(e) => setYears(+e.target.value)} min={1} max={50} /></div>
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Monthly Savings Needed</div><div className="text-lg font-bold text-primary">${data.monthlyNeeded.toLocaleString()}</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Goal Amount</div><div className="text-lg font-bold text-foreground">${goal.toLocaleString()}</div></div>
          </div>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.points}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Area type="monotone" dataKey="value" fill="hsl(var(--chart-1))" stroke="hsl(var(--chart-1))" name="Portfolio Value" />
              <Area type="monotone" dataKey="goal" fill="none" stroke="hsl(var(--chart-3))" strokeDasharray="5 5" name="Goal" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ToolShell>
  );
}
