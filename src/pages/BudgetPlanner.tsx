import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import ToolShell from "@/components/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];

export default function BudgetPlanner() {
  const [income, setIncome] = useState(5000);
  const [needsPct, setNeedsPct] = useState(50);
  const [wantsPct, setWantsPct] = useState(30);

  const data = useMemo(() => {
    const savingsPct = 100 - needsPct - wantsPct;
    const needs = Math.round(income * (needsPct / 100));
    const wants = Math.round(income * (wantsPct / 100));
    const savings = Math.round(income * (savingsPct / 100));
    const chart = [
      { name: `Needs (${needsPct}%)`, value: needs },
      { name: `Wants (${wantsPct}%)`, value: wants },
      { name: `Savings (${savingsPct}%)`, value: savings },
    ];
    return { needs, wants, savings, savingsPct, chart };
  }, [income, needsPct, wantsPct]);

  return (
    <ToolShell
      title="50/30/20 Budget Planner"
      description="Allocate your monthly income using the popular 50/30/20 budgeting rule. Customize percentages to fit your situation."
      howToUse="Enter your monthly after-tax income. Adjust the Needs and Wants percentages if desired—Savings automatically adjusts. The pie chart shows your recommended allocation."
      understandingTitle="Understanding the 50/30/20 Rule"
      understandingContent="The 50/30/20 budget rule, popularized by Senator Elizabeth Warren, divides after-tax income into three categories: 50% for Needs (rent, utilities, groceries, insurance), 30% for Wants (dining out, entertainment, hobbies), and 20% for Savings & Debt Repayment (emergency fund, retirement, extra debt payments). It's a simple framework that works for most income levels."
      faqs={[
        { question: "What counts as a 'need' vs. a 'want'?", answer: "Needs are essentials: housing, food, utilities, transportation, insurance, minimum debt payments. Wants are non-essentials: dining out, streaming services, vacations, upgrades." },
        { question: "What if I can't keep needs under 50%?", answer: "In high cost-of-living areas, needs may exceed 50%. Adjust to 60/20/20 or find ways to reduce housing costs. The key is maintaining some savings." },
        { question: "Should I include debt repayment in savings?", answer: "Minimum payments are 'needs.' Extra payments beyond minimums count as 'savings/debt repayment' in the 20% category." },
      ]}
      relatedTools={[
        { title: "Net Worth Calculator", href: "/net-worth" },
        { title: "Paycheck Tax Calculator", href: "/paycheck-tax" },
        { title: "Debt Payoff Calculator", href: "/debt-payoff" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div><Label>Monthly After-Tax Income ($)</Label><Input type="number" value={income} onChange={(e) => setIncome(+e.target.value)} min={0} /></div>
          <div><Label>Needs (%)</Label><Input type="number" value={needsPct} onChange={(e) => setNeedsPct(Math.min(+e.target.value, 100 - wantsPct))} min={0} max={100} /></div>
          <div><Label>Wants (%)</Label><Input type="number" value={wantsPct} onChange={(e) => setWantsPct(Math.min(+e.target.value, 100 - needsPct))} min={0} max={100} /></div>
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Needs</div><div className="text-lg font-bold text-foreground">${data.needs.toLocaleString()}</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Wants</div><div className="text-lg font-bold text-primary">${data.wants.toLocaleString()}</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Savings ({data.savingsPct}%)</div><div className="text-lg font-bold text-foreground">${data.savings.toLocaleString()}</div></div>
          </div>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data.chart} cx="50%" cy="50%" outerRadius={130} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {data.chart.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
              </Pie>
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ToolShell>
  );
}
