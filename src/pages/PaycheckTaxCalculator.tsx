import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import ToolShell from "@/components/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function PaycheckTaxCalculator() {
  const [salary, setSalary] = useState(75000);
  const [payFrequency, setPayFrequency] = useState<"biweekly" | "monthly" | "weekly">("biweekly");
  const [filing, setFiling] = useState<"single" | "married">("single");
  const [retirement, setRetirement] = useState(6);

  const result = useMemo(() => {
    const periods = payFrequency === "biweekly" ? 26 : payFrequency === "monthly" ? 12 : 52;
    const retirementDeduction = salary * (retirement / 100);
    const taxableIncome = salary - retirementDeduction - (filing === "single" ? 14600 : 29200);

    // Federal tax (simplified 2024 single brackets)
    let fedTax = 0;
    const brackets = filing === "single"
      ? [{ max: 11600, rate: 0.10 }, { max: 47150, rate: 0.12 }, { max: 100525, rate: 0.22 }, { max: 191950, rate: 0.24 }, { max: 243725, rate: 0.32 }, { max: 609350, rate: 0.35 }, { max: Infinity, rate: 0.37 }]
      : [{ max: 23200, rate: 0.10 }, { max: 94300, rate: 0.12 }, { max: 201050, rate: 0.22 }, { max: 383900, rate: 0.24 }, { max: 487450, rate: 0.32 }, { max: 731200, rate: 0.35 }, { max: Infinity, rate: 0.37 }];

    let remaining = Math.max(0, taxableIncome);
    let prev = 0;
    for (const b of brackets) {
      const chunk = Math.min(remaining, b.max - prev);
      fedTax += chunk * b.rate;
      remaining -= chunk;
      prev = b.max;
      if (remaining <= 0) break;
    }

    const socialSecurity = Math.min(salary, 168600) * 0.062;
    const medicare = salary * 0.0145;
    const totalDeductions = fedTax + socialSecurity + medicare + retirementDeduction;
    const netAnnual = salary - totalDeductions;
    const netPerPeriod = netAnnual / periods;

    const chart = [
      { name: "Take-Home", value: Math.round(netAnnual) },
      { name: "Federal Tax", value: Math.round(fedTax) },
      { name: "Social Security", value: Math.round(socialSecurity) },
      { name: "Medicare", value: Math.round(medicare) },
      { name: "Retirement", value: Math.round(retirementDeduction) },
    ];

    return { grossPerPeriod: Math.round(salary / periods), netPerPeriod: Math.round(netPerPeriod), fedTax: Math.round(fedTax), socialSecurity: Math.round(socialSecurity), medicare: Math.round(medicare), netAnnual: Math.round(netAnnual), chart };
  }, [salary, payFrequency, filing, retirement]);

  return (
    <ToolShell
      title="Paycheck Tax Calculator"
      description="Estimate your take-home pay after federal taxes, Social Security, Medicare, and retirement contributions."
      howToUse="Enter your annual salary, pay frequency, filing status, and retirement contribution percentage. See your estimated net paycheck and annual tax breakdown."
      understandingTitle="Understanding Paycheck Deductions"
      understandingContent="Your paycheck is reduced by federal income tax (based on tax brackets), Social Security (6.2% up to $168,600 in 2024), Medicare (1.45%), and any pre-tax retirement contributions. State taxes are not included here. Pre-tax retirement contributions like 401(k) reduce your taxable income, effectively lowering your tax bill."
      faqs={[
        { question: "Why is my take-home so much less than my salary?", answer: "Between federal income tax, FICA taxes (Social Security + Medicare), and any retirement contributions, 25-35% of your gross pay is typical for most workers." },
        { question: "Does this include state taxes?", answer: "No. State income tax varies from 0% (Texas, Florida) to over 13% (California). Add your state's rate for a complete picture." },
        { question: "How do 401(k) contributions affect my taxes?", answer: "Traditional 401(k) contributions are pre-tax, reducing your taxable income. A 6% contribution on a $75,000 salary saves roughly $1,000+ in federal taxes." },
      ]}
      relatedTools={[
        { title: "Tax Bracket Calculator", href: "/tax-bracket" },
        { title: "Freelance Tax Estimator", href: "/tax-estimator" },
        { title: "Budget Planner", href: "/budget-planner" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div><Label>Annual Salary ($)</Label><Input type="number" value={salary} onChange={(e) => setSalary(+e.target.value)} min={0} /></div>
          <div>
            <Label>Pay Frequency</Label>
            <Select value={payFrequency} onValueChange={(v) => setPayFrequency(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
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
          <div><Label>Retirement Contribution (%)</Label><Input type="number" value={retirement} onChange={(e) => setRetirement(+e.target.value)} min={0} max={100} /></div>
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Gross per Paycheck</div><div className="text-lg font-bold text-foreground">${result.grossPerPeriod.toLocaleString()}</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Net per Paycheck</div><div className="text-lg font-bold text-primary">${result.netPerPeriod.toLocaleString()}</div></div>
          </div>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={result.chart} cx="50%" cy="50%" outerRadius={120} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {result.chart.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
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
