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
      // Pay minimums
      for (let i = 0; i < balances.length; i++) {
        if (balances[i] <= 0) continue;
        const interest = balances[i] * rates[i];
        totalInterest += interest;
        balances[i] += interest;
        const pmt = Math.min(mins[i], balances[i]);
        balances[i] -= pmt;
      }
      // Apply extra payment to target
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

  return (
    <ToolShell
      title="Debt Payoff Calculator"
      description="Compare Snowball vs. Avalanche strategies to find the fastest way to become debt-free."
      howToUse="Add your debts with their balances, interest rates, and minimum payments. Set any extra monthly payment amount. Toggle between Snowball (smallest balance first) and Avalanche (highest rate first) to compare strategies."
      understandingTitle="Snowball vs. Avalanche Method"
      understandingContent="The Avalanche method targets the highest interest rate first, minimizing total interest paid. The Snowball method targets the smallest balance first, giving psychological wins sooner. Both beat making only minimum payments. The Avalanche saves more money mathematically, while the Snowball keeps motivation high."
      faqs={[
        { question: "Which method saves the most money?", answer: "Avalanche saves the most by targeting high-interest debt first. However, the Snowball method's quick wins help many people stay motivated." },
        { question: "How much extra should I pay?", answer: "Any extra helps. Even $50/month extra can shave years off repayment and save hundreds or thousands in interest." },
        { question: "Should I consolidate my debts instead?", answer: "Consolidation can help if you get a lower interest rate. However, it doesn't reduce the principal—only changes the structure." },
      ]}
      relatedTools={[
        { title: "Student Loan Calculator", href: "/student-loan" },
        { title: "Personal Loan Calculator", href: "/personal-loan" },
        { title: "Budget Planner", href: "/budget-planner" },
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
          <div><Label>Extra Monthly Payment ($)</Label><Input type="number" value={extraPayment} onChange={(e) => setExtraPayment(+e.target.value)} min={0} /></div>
          <div className="flex gap-2 items-end">
            <Button variant={strategy === "avalanche" ? "default" : "outline"} onClick={() => setStrategy("avalanche")} className="flex-1">Avalanche</Button>
            <Button variant={strategy === "snowball" ? "default" : "outline"} onClick={() => setStrategy("snowball")} className="flex-1">Snowball</Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Total Debt</div><div className="text-lg font-bold text-foreground">${totalDebt.toLocaleString()}</div></div>
          <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Debt-Free In</div><div className="text-lg font-bold text-primary">{Math.floor(result.months / 12)}y {result.months % 12}m</div></div>
          <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Total Interest</div><div className="text-lg font-bold text-foreground">${result.totalInterest.toLocaleString()}</div></div>
        </div>

        <div className="h-[350px]">
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
