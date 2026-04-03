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
      description="Create a simple, balanced budget using the popular 50/30/20 rule. Allocate your after-tax income into Needs, Wants, and Savings — customize the percentages to fit your financial goals and see your dollar amounts instantly."
      howToUse="Enter your monthly after-tax (net) income — the amount that actually hits your bank account. The calculator defaults to the classic 50/30/20 split, but you can adjust the Needs and Wants percentages to match your situation (Savings automatically adjusts to fill the remainder). The pie chart shows your recommended allocation, and the summary cards display exact dollar amounts for each category. Use this as a starting point, then track your actual spending for a month to see where you stand."
      understandingTitle="Understanding the 50/30/20 Rule"
      understandingContent="The 50/30/20 budget rule, popularized by Senator Elizabeth Warren in her book 'All Your Worth,' divides after-tax income into three simple categories: 50% for Needs — essential expenses you can't avoid: housing (rent/mortgage), utilities, groceries, insurance (health, auto, home), transportation (car payment, gas, transit), minimum debt payments, and childcare. 30% for Wants — discretionary spending that improves quality of life but isn't strictly necessary: dining out, streaming services, gym memberships, hobbies, shopping, entertainment, vacations, and upgrades (choosing a $1,200/month apartment vs. a $900 one). 20% for Savings & Debt Repayment — building your financial future: emergency fund (aim for 3–6 months of expenses), retirement contributions (401k, IRA), extra debt payments beyond minimums, investing, and saving for goals (down payment, education). The beauty of this framework is its simplicity — no tracking every latte. Just ensure each broad category stays within its percentage. If your needs exceed 50% (common in high-cost cities), adjust to 60/20/20 or look for ways to reduce housing costs. If you can keep needs under 40%, you're in excellent shape to accelerate wealth building."
      faqs={[
        { question: "What counts as a 'need' vs. a 'want'?", answer: "Needs are essential for survival and basic functioning: housing, basic food, utilities, minimum debt payments, basic transportation, health insurance, and required childcare. Wants are everything else: restaurant meals (vs. groceries), premium streaming packages, gym memberships, vacations, hobbies, and upgrades beyond basic needs. A car is a need; a luxury car is a want. A phone is a need; the latest iPhone is a want." },
        { question: "What if I can't keep needs under 50%?", answer: "In high cost-of-living areas (NYC, SF, Boston), housing alone can consume 40%+ of income. Options: adjust to 60/20/20 (still saving 20%), find ways to reduce housing costs (roommates, moving further out), increase income (side hustle, career advancement), or reduce other needs (cheaper phone plan, lower insurance deductible). The critical thing is maintaining some savings — even 10% is better than nothing." },
        { question: "Should I include debt repayment in savings?", answer: "Minimum payments are categorized as 'needs' (they're required). Any extra payments beyond minimums count toward the 20% 'savings/debt repayment' category. For high-interest debt (20%+ credit cards), directing most of your 20% toward debt payoff is smart — paying off a 24% credit card is like earning a guaranteed 24% return." },
        { question: "How do I track my spending?", answer: "Start with one month of tracking to see where you actually stand. Use a free tool like Mint, YNAB, or a simple spreadsheet. Review bank/credit card statements and categorize each expense as Need, Want, or Savings. Most people are surprised — dining out and subscriptions often consume more than expected." },
        { question: "What if I want to save more aggressively?", answer: "The FIRE (Financial Independence, Retire Early) community often uses a 30/20/50 or even 30/10/60 budget. The math is simple: saving 50% of your income means you can retire in about 17 years. Saving 20% means ~37 years. The key is keeping needs (especially housing) as low as possible — housing is typically the single largest lever." },
        { question: "Does this work with irregular income?", answer: "Yes, with modification. Use your average monthly income from the past 6–12 months. In high-income months, direct extra money to savings. In low-income months, draw from your buffer. Freelancers and commission-based workers should maintain a larger emergency fund (6+ months vs. the standard 3–6)." },
      ]}
      relatedTools={[
        { title: "Net Worth Calculator", href: "/net-worth" },
        { title: "Paycheck Tax Calculator", href: "/paycheck-tax" },
        { title: "Debt Payoff Calculator", href: "/debt-payoff" },
        { title: "Cost of Living Calculator", href: "/cost-of-living" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <Label>Monthly After-Tax Income ($)</Label>
            <Input type="number" value={income} onChange={(e) => setIncome(+e.target.value)} min={0} />
            <p className="text-xs text-muted-foreground mt-1">Your net income — the amount deposited to your bank.</p>
          </div>
          <div>
            <Label>Needs (%)</Label>
            <Input type="number" value={needsPct} onChange={(e) => setNeedsPct(Math.min(+e.target.value, 100 - wantsPct))} min={0} max={100} />
            <p className="text-xs text-muted-foreground mt-1">Housing, food, utilities, insurance, minimum debt payments.</p>
          </div>
          <div>
            <Label>Wants (%)</Label>
            <Input type="number" value={wantsPct} onChange={(e) => setWantsPct(Math.min(+e.target.value, 100 - needsPct))} min={0} max={100} />
            <p className="text-xs text-muted-foreground mt-1">Dining, entertainment, shopping, hobbies, subscriptions.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="result-card"><div className="text-xs text-muted-foreground">Needs</div><div className="text-lg font-bold text-foreground">${data.needs.toLocaleString()}</div></div>
            <div className="result-card-highlight"><div className="text-xs text-muted-foreground">Wants</div><div className="text-lg font-bold text-primary">${data.wants.toLocaleString()}</div></div>
            <div className="result-card"><div className="text-xs text-muted-foreground">Savings ({data.savingsPct}%)</div><div className="text-lg font-bold text-foreground">${data.savings.toLocaleString()}</div></div>
          </div>
        </div>
        <div className="chart-container h-[350px]">
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