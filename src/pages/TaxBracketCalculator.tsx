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
    const afterTax = income - totalTax;
    return { breakdown, totalTax: Math.round(totalTax), effectiveRate, marginalRate, afterTax: Math.round(afterTax) };
  }, [income, filing]);

  return (
    <ToolShell
      title="Tax Bracket Calculator"
      description="See exactly how the 2024 federal tax brackets apply to your income. Understand the difference between your marginal rate and effective rate, and visualize how much tax you owe in each bracket with a color-coded breakdown."
      howToUse="Enter your taxable income (gross income minus deductions — the 2024 standard deduction is $14,600 for single filers and $29,200 for married filing jointly). Select your filing status. The calculator shows: (1) a line-by-line breakdown of how much income falls in each bracket and the tax on each portion, (2) your total federal tax, (3) your effective tax rate (total tax ÷ income), and (4) your marginal tax rate (the rate on your last dollar). The bar chart visualizes the tax owed per bracket."
      understandingTitle="Understanding Marginal Tax Brackets"
      understandingContent="The United States uses a progressive (graduated) tax system. This means you don't pay a single flat rate on all your income — instead, different portions of your income are taxed at increasing rates. A common misconception is that earning more can push ALL your income into a higher bracket — this is false. Only the income within each bracket is taxed at that bracket's rate. For example, a single filer earning $85,000 in taxable income pays: 10% on the first $11,600 ($1,160), 12% on $11,601–$47,150 ($4,266), and 22% on $47,151–$85,000 ($8,327). Total tax: $13,753. Even though their marginal rate is 22%, their effective rate is only 16.2%. This means that a raise will never result in less take-home pay due to taxes — only the additional income is taxed at the higher rate. Understanding this distinction is crucial for financial planning, especially when deciding between Traditional and Roth retirement contributions, negotiating raises, or timing income recognition."
      faqs={[
        { question: "What's the difference between marginal and effective tax rate?", answer: "Your marginal rate is the tax rate on your last dollar of income (the highest bracket you've reached). Your effective rate is your total tax divided by total income — it's always lower than your marginal rate because of the progressive bracket structure. For example, at $85,000 taxable income (single), marginal rate is 22% but effective rate is ~16%. Your effective rate tells you what percentage of your overall income actually goes to federal tax." },
        { question: "Does this include state taxes?", answer: "No. State income tax rates vary enormously: 7 states have no income tax (TX, FL, NV, WY, WA, SD, AK, NH, TN — though NH and TN tax some investment income). California tops out at 13.3%, New York at 10.9%. A $100,000 salary in Texas vs. California results in ~$7,000+ difference in state taxes alone." },
        { question: "What is taxable income?", answer: "Taxable income = Adjusted Gross Income (AGI) minus deductions. Most taxpayers take the standard deduction: $14,600 (single) or $29,200 (married filing jointly) for 2024. If your itemized deductions (mortgage interest, state/local taxes up to $10,000, charitable contributions, etc.) exceed the standard deduction, itemizing saves more. So if you earn $100,000 gross and take the standard deduction, your taxable income is $85,400." },
        { question: "Will earning more ever result in less take-home pay?", answer: "No — this is one of the most common tax myths. Because of marginal brackets, a raise always increases your after-tax income. The only exception involves specific benefit phase-outs (like the Earned Income Tax Credit or certain subsidies), where crossing certain income thresholds can reduce those benefits. But the tax brackets themselves never cause you to lose money by earning more." },
        { question: "How can I lower my taxable income?", answer: "Common strategies: maximize pre-tax retirement contributions (401k: $23,000, Traditional IRA: $7,000 in 2024), contribute to an HSA ($4,150 single / $8,300 family), claim all eligible deductions, harvest investment losses, make charitable contributions, and time income and deductions strategically between tax years." },
        { question: "How do the 2024 brackets compare to prior years?", answer: "Brackets are adjusted annually for inflation. The 2024 brackets are about 5.4% wider than 2023, meaning you can earn more before reaching each bracket. The seven rates (10%, 12%, 22%, 24%, 32%, 35%, 37%) have remained the same since the Tax Cuts and Jobs Act of 2017. These rates are scheduled to sunset in 2026, which would revert to higher pre-2018 rates unless Congress acts." },
      ]}
      relatedTools={[
        { title: "Freelance Tax Estimator", href: "/tax-estimator" },
        { title: "Capital Gains Tax Calculator", href: "/capital-gains-tax" },
        { title: "Paycheck Tax Calculator", href: "/paycheck-tax" },
        { title: "Budget Planner", href: "/budget-planner" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <Label>Taxable Income ($)</Label>
            <Input type="number" value={income} onChange={(e) => setIncome(+e.target.value)} min={0} />
            <p className="text-xs text-muted-foreground mt-1">Gross income minus deductions ($14,600 standard for single).</p>
          </div>
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
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="result-card"><div className="text-xs text-muted-foreground">Total Federal Tax</div><div className="text-lg font-bold text-foreground">${result.totalTax.toLocaleString()}</div></div>
            <div className="result-card-highlight"><div className="text-xs text-muted-foreground">Effective Rate</div><div className="text-lg font-bold text-primary">{result.effectiveRate.toFixed(1)}%</div></div>
            <div className="result-card"><div className="text-xs text-muted-foreground">Marginal Rate</div><div className="text-lg font-bold text-foreground">{result.marginalRate}%</div></div>
            <div className="result-card"><div className="text-xs text-muted-foreground">After-Tax Income</div><div className="text-lg font-bold text-foreground">${result.afterTax.toLocaleString()}</div></div>
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
        <div className="chart-container h-[350px]">
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