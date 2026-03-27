import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import ToolShell from "@/components/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

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
      description="See how your money grows over time with compound interest and regular contributions."
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <Label>Initial Investment ($)</Label>
            <Input type="number" value={principal} onChange={(e) => setPrincipal(+e.target.value)} min={0} />
          </div>
          <div>
            <Label>Monthly Contribution ($)</Label>
            <Input type="number" value={monthly} onChange={(e) => setMonthly(+e.target.value)} min={0} />
          </div>
          <div>
            <Label>Annual Interest Rate (%)</Label>
            <Input type="number" value={rate} onChange={(e) => setRate(+e.target.value)} min={0} step={0.1} />
          </div>
          <div>
            <Label>Years</Label>
            <Input type="number" value={years} onChange={(e) => setYears(+e.target.value)} min={1} max={50} />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="rounded-lg bg-accent p-4">
              <div className="text-xs text-muted-foreground">Total Value</div>
              <div className="text-lg font-bold text-foreground">${final.total.toLocaleString()}</div>
            </div>
            <div className="rounded-lg bg-accent p-4">
              <div className="text-xs text-muted-foreground">Interest Earned</div>
              <div className="text-lg font-bold text-primary">${final.interest.toLocaleString()}</div>
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
              <Area type="monotone" dataKey="contributions" stackId="1" fill="hsl(var(--chart-2))" stroke="hsl(var(--chart-2))" name="Contributions" />
              <Area type="monotone" dataKey="interest" stackId="1" fill="hsl(var(--chart-1))" stroke="hsl(var(--chart-1))" name="Interest" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ToolShell>
  );
}
