import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import ToolShell from "@/components/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";

interface Debt {
  name: string;
  balance: number;
  rate: number;
  minPayment: number;
}

export default function DebtPayoffCalculator() {
  const [debts, setDebts] = useState<Debt[]>([
    { name: "Credit Card", balance: 5000, rate: 19.99, minPayment: 100 },
    { name: "Car Loan", balance: 12000, rate: 6.5, minPayment: 250 },
    { name: "Student Loan", balance: 20000, rate: 5.5, minPayment: 200 },
  ]);
  const [extraPayment, setExtraPayment] = useState(200);
  const [strategy, setStrategy] = useState<"avalanche" | "snowball">("avalanche");

  const addDebt = () => setDebts([...debts, { name: `Debt ${debts.length + 1}`, balance: 1000, rate: 10, minPayment: 50 }]);
  const removeDebt = (i: number) => setDebts(debts.filter((_, idx) => idx !== i));
  const updateDebt = (i: number, field: keyof Debt, value: string | number) => {
    const updated = [...debts];
    (updated[i] as any)[field] = value;
    setDebts(updated);
  };

  const result = useMemo(() => {
    const balances = debts.map((d) => d.balance);
    const rates = debts.map((d) => d.rate / 100 / 12);
    const mins = debts.map((d) => d.minPayment);
    const chart: { month: number; total: number }[] = [];
    let month = 0;
    let totalInterest = 0;

    while (balances.some((b) => b > 0) && month < 600) {
      chart.push({ month, total: Math.round(balances.reduce((a, b) => a + b, 0)) });
      for (let i = 0; i < balances.length; i++) {
        if (balances[i] <= 0) continue;
        const interest = balances[i] * rates[i];
        totalInterest += interest;
        balances[i] += interest;
        const pmt = Math.min(mins[i], balances[i]);
        balances[i] -= pmt;
      }
      let extra = extraPayment;
      const order = balances.map((_, i) => i).filter((i) => balances[i] > 0);
      if (strategy === "avalanche") order.sort((a, b) => rates[b] - rates[a]);
      else order.sort((a, b) => balances[a] - balances[b]);

      for (const i of order) {
        if (extra <= 0) break;
        const apply = Math.min(extra, balances[i]);
        balances[i] -= apply;
        extra -= apply;
      }
      month++;
    }
    chart.push({ month, total: 0 });
    return { chart, months: month, totalInterest: Math.round(totalInterest) };
  }, [debts, extraPayment, strategy]);

  const totalDebt = debts.reduce((s, d) => s + d.balance, 0);
  const totalMinPayments = debts.reduce((s, d) => s + d.minPayment, 0);

  return (
    <ToolShell
      title="Debt Payoff Calculator"
      description="Compare the Snowball and Avalanche debt payoff strategies side by side. Add all your debts, set an extra payment amount, and see exactly when you'll be debt-free — and how much interest you'll save along the way."
      howToUse="Start by entering each of your debts with their current balance, interest rate, and minimum monthly payment. Use the '+ Add Debt' button for additional debts. Set the extra amount you can pay beyond minimums each month — even $50 helps significantly. Toggle between 'Avalanche' (targets highest interest rate first, saves the most money) and 'Snowball' (targets smallest balance first, provides quicker psychological wins). The chart shows your total debt declining to zero over time, and the summary cards display your payoff timeline and total interest cost."
      understandingTitle="Snowball vs. Avalanche Method"
      understandingContent="Both strategies share the same core principle: make minimum payments on all debts, then direct every extra dollar toward one specific debt until it's eliminated, then roll that payment into the next debt. The Avalanche method targets the debt with the highest interest rate first. This is mathematically optimal — it minimizes total interest paid and gets you debt-free in the least amount of time (given the same extra payment). The Snowball method targets the smallest balance first. While it costs slightly more in interest, research by behavioral economists has shown that the psychological boost of eliminating a debt quickly increases the likelihood of sticking with the plan. Harvard Business Review research found that people who focused on small balances first were more likely to eliminate all their debt. The best strategy is the one you'll actually follow. If you're disciplined and motivated by numbers, use Avalanche. If you need quick wins to stay motivated, use Snowball. Either way, both are dramatically better than making only minimum payments, which can take 15–30 years to pay off credit card debt."
      faqs={[
        { question: "Which method saves the most money?", answer: "Avalanche always saves the most money because it eliminates the highest-interest debt first, reducing the total interest that accrues. For example, with $37,000 in debt and $200 extra per month, Avalanche might save $800–$2,000+ more than Snowball, depending on the rate differential between your debts." },
        { question: "How much extra should I pay?", answer: "Any amount helps. Even $50/month extra can shave years off repayment. To find your extra payment: review your budget for cuts (subscriptions, dining out), sell unused items, or direct windfalls (tax refunds, bonuses) to debt. The average American household has $300–$500/month in discretionary spending that could be redirected." },
        { question: "Should I consolidate my debts instead?", answer: "Consolidation makes sense if: (1) you can get a lower interest rate than your current weighted average, (2) you want one simple payment instead of multiple, (3) you qualify for a 0% balance transfer credit card (typical promo period: 15–21 months). Beware: consolidation doesn't reduce principal, and some people run up new debt after consolidating — making the problem worse." },
        { question: "What about balance transfer cards?", answer: "A 0% APR balance transfer card can be a powerful tool. Transfer high-interest debt, pay $0 in interest during the promo period (typically 15–21 months), and focus 100% of payments on principal. Watch out for: transfer fees (typically 3–5%), the high rate after the promo ends (often 20%+), and the temptation to spend on the newly available credit." },
        { question: "Should I save or pay off debt first?", answer: "Build a small emergency fund first ($1,000–$2,000) to avoid taking on new debt for unexpected expenses. Then aggressively pay off high-interest debt (anything above 7–8%). After high-interest debt is gone, balance between investing (especially to capture employer 401(k) match) and paying off remaining low-interest debt." },
        { question: "How do I stay motivated?", answer: "Track your progress visually (debt payoff chart). Celebrate milestones when each debt is eliminated. Calculate the total interest saved by paying extra. Join communities (r/personalfinance, debt-free journey groups). Remember: every month your total balance drops is a victory." },
      ]}
      relatedTools={[
        { title: "Student Loan Calculator", href: "/student-loan" },
        { title: "Personal Loan Calculator", href: "/personal-loan" },
        { title: "Budget Planner", href: "/budget-planner" },
        { title: "Net Worth Calculator", href: "/net-worth" },
      ]}
    >
      <div className="space-y-6">
        <div className="space-y-3">
          {debts.map((d, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_1fr_1fr_auto] gap-2 items-end">
              <div><Label className="text-xs">Name</Label><Input value={d.name} onChange={(e) => updateDebt(i, "name", e.target.value)} /></div>
              <div><Label className="text-xs">Balance ($)</Label><Input type="number" value={d.balance} onChange={(e) => updateDebt(i, "balance", +e.target.value)} min={0} /></div>
              <div><Label className="text-xs">Rate (%)</Label><Input type="number" value={d.rate} onChange={(e) => updateDebt(i, "rate", +e.target.value)} min={0} step={0.1} /></div>
              <div><Label className="text-xs">Min Payment ($)</Label><Input type="number" value={d.minPayment} onChange={(e) => updateDebt(i, "minPayment", +e.target.value)} min={0} /></div>
              <Button variant="ghost" size="icon" onClick={() => removeDebt(i)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          ))}
          <Button variant="outline" size="sm" onClick={addDebt}><Plus className="h-4 w-4 mr-1" /> Add Debt</Button>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <Label>Extra Monthly Payment ($)</Label>
            <Input type="number" value={extraPayment} onChange={(e) => setExtraPayment(+e.target.value)} min={0} />
            <p className="text-xs text-muted-foreground mt-1">Amount above all minimums combined (${totalMinPayments}/mo).</p>
          </div>
          <div className="flex gap-2 items-end">
            <Button variant={strategy === "avalanche" ? "default" : "outline"} onClick={() => setStrategy("avalanche")} className="flex-1">Avalanche</Button>
            <Button variant={strategy === "snowball" ? "default" : "outline"} onClick={() => setStrategy("snowball")} className="flex-1">Snowball</Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="result-card"><div className="text-xs text-muted-foreground">Total Debt</div><div className="text-lg font-bold text-foreground">${totalDebt.toLocaleString()}</div></div>
          <div className="result-card-highlight"><div className="text-xs text-muted-foreground">Debt-Free In</div><div className="text-lg font-bold text-primary">{Math.floor(result.months / 12)}y {result.months % 12}m</div></div>
          <div className="result-card"><div className="text-xs text-muted-foreground">Total Interest</div><div className="text-lg font-bold text-foreground">${result.totalInterest.toLocaleString()}</div></div>
        </div>

        <div className="chart-container h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={result.chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} label={{ value: "Months", position: "insideBottom", offset: -2 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Legend />
              <Area type="monotone" dataKey="total" fill="hsl(var(--chart-1))" stroke="hsl(var(--chart-1))" name="Total Remaining" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ToolShell>
  );
}