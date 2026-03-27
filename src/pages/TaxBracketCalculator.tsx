import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import ToolShell from "@/components/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const brackets2024 = {
  single: [
    { min: 0, max: 11600, rate: 10 },
    { min: 11600, max: 47150, rate: 12 },
    { min: 47150, max: 100525, rate: 22 },
    { min: 100525, max: 191950, rate: 24 },
    { min: 191950, max: 243725, rate: 32 },
    { min: 243725, max: 609350, rate: 35 },
    { min: 609350, max: Infinity, rate: 37 },
  ],
  married: [
    { min: 0, max: 23200, rate: 10 },
    { min: 23200, max: 94300, rate: 12 },
    { min: 94300, max: 201050, rate: 22 },
    { min: 201050, max: 383900, rate: 24 },
    { min: 383900, max: 487450, rate: 32 },
    { min: 487450, max: 731200, rate: 35 },
    { min: 731200, max: Infinity, rate: 37 },
  ],
};

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))", "hsl(var(--chart-1))", "hsl(var(--chart-2))"];

export default function TaxBracketCalculator() {
  const [income, setIncome] = useState(85000);
  const [filing, setFiling] = useState<"single" | "married">("single");

  const result = useMemo(() => {
    const b = brackets2024[filing];
    let remaining = income;
    let totalTax = 0;
    const breakdown = b.map((bracket) => {
      const taxable = Math.max(0, Math.min(remaining, bracket.max - bracket.min));
      const tax = taxable * (bracket.rate / 100);
      remaining -= taxable;
      totalTax += tax;
      return { range: bracket.max === Infinity ? `$${bracket.min.toLocaleString()}+` : `$${bracket.min.toLocaleString()} - $${bracket.max.toLocaleString()}`, rate: `${bracket.rate}%`, taxable: Math.round(taxable), tax: Math.round(tax) };
    }).filter((b) => b.taxable > 0);

    const effectiveRate = income > 0 ? (totalTax / income) * 100 : 0;
    const marginalRate = b.find((br) => income <= br.max)?.rate || 37;
    return { breakdown, totalTax: Math.round(totalTax), effectiveRate, marginalRate };
  }, [income, filing]);

  return (
    <ToolShell
      title="Tax Bracket Calculator"
      description="See exactly how the 2024 federal tax brackets apply to your income with a visual breakdown."
      howToUse="Enter your taxable income and filing status. The calculator shows how much tax you owe in each bracket, your effective tax rate, and marginal rate."
      understandingTitle="Understanding Marginal Tax Brackets"
      understandingContent="The US uses a progressive tax system. You don't pay your marginal rate on all income—only on income within each bracket. For example, a single filer earning $85,000 pays 10% on the first $11,600, 12% on income up to $47,150, and 22% on the rest. The effective rate is always lower than the marginal rate."
      faqs={[
        { question: "What's the difference between marginal and effective tax rate?", answer: "Your marginal rate is the tax on your last dollar of income. Your effective rate is total tax divided by total income—always lower than the marginal rate." },
        { question: "Does this include state taxes?", answer: "No. This calculator shows federal income tax only. State taxes vary significantly and should be calculated separately." },
        { question: "What is taxable income?", answer: "Taxable income is your gross income minus deductions (standard or itemized). For 2024, the standard deduction is $14,600 for single filers." },
      ]}
      relatedTools={[
        { title: "Freelance Tax Estimator", href: "/tax-estimator" },
        { title: "Capital Gains Tax Calculator", href: "/capital-gains-tax" },
        { title: "Paycheck Tax Calculator", href: "/paycheck-tax" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div><Label>Taxable Income ($)</Label><Input type="number" value={income} onChange={(e) => setIncome(+e.target.value)} min={0} /></div>
          <div>
            <Label>Filing Status</Label>
            <Select value={filing} onValueChange={(v) => setFiling(v as "single" | "married")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married Filing Jointly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Total Tax</div><div className="text-lg font-bold text-foreground">${result.totalTax.toLocaleString()}</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Effective Rate</div><div className="text-lg font-bold text-primary">{result.effectiveRate.toFixed(1)}%</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Marginal Rate</div><div className="text-lg font-bold text-foreground">{result.marginalRate}%</div></div>
          </div>
          <div className="space-y-1 text-sm">
            {result.breakdown.map((b, i) => (
              <div key={i} className="flex justify-between text-muted-foreground">
                <span>{b.rate} on ${b.taxable.toLocaleString()}</span>
                <span className="font-medium text-foreground">${b.tax.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={result.breakdown}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="rate" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Bar dataKey="tax" name="Tax Owed">
                {result.breakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ToolShell>
  );
}
