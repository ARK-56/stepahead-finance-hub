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

    return { grossPerPeriod: Math.round(salary / periods), netPerPeriod: Math.round(netPerPeriod), fedTax: Math.round(fedTax), socialSecurity: Math.round(socialSecurity), medicare: Math.round(medicare), netAnnual: Math.round(netAnnual), retirementDeduction: Math.round(retirementDeduction), chart };
  }, [salary, payFrequency, filing, retirement]);

  return (
    <ToolShell
      title="Paycheck Tax Calculator"
      description="Estimate your take-home pay after federal income tax, Social Security, Medicare, and retirement contributions. See exactly where your paycheck goes with a visual breakdown — and understand why your net pay is less than you expected."
      howToUse="Enter your annual gross salary (before any deductions). Select how often you're paid — weekly (52 paychecks), bi-weekly (26 paychecks), or monthly (12 paychecks). Choose your filing status, which determines your standard deduction and tax bracket thresholds. Set your retirement contribution percentage (Traditional 401k contributions reduce taxable income). The calculator breaks down your paycheck into federal tax, Social Security, Medicare, and retirement, showing both per-paycheck and annual totals. The pie chart visualizes the split between take-home pay and various deductions."
      understandingTitle="Understanding Paycheck Deductions"
      understandingContent="When you look at your pay stub, several mandatory and voluntary deductions reduce your gross pay to your net (take-home) pay. Federal income tax is withheld based on your W-4 elections and the progressive tax brackets — this is the largest deduction for most workers. Social Security tax (OASDI) is 6.2% of wages up to $168,600 in 2024 (your employer pays another 6.2%). Medicare tax is 1.45% on all wages with no cap (plus an additional 0.9% on wages over $200,000). Together, Social Security and Medicare are called 'FICA taxes' and total 7.65% for most workers. Pre-tax retirement contributions (Traditional 401k, 403b) reduce your taxable income, effectively providing a tax break now in exchange for paying taxes in retirement. A 6% contribution on a $75,000 salary saves roughly $990 in federal taxes immediately (at a 22% marginal rate) while building $4,500 in retirement savings. This calculator doesn't include state income tax (which ranges from 0% to 13.3%), local taxes (some cities like New York add 3–4%), or other deductions like health insurance premiums. Add your state's rate for a complete picture."
      faqs={[
        { question: "Why is my take-home so much less than my salary?", answer: "Between federal income tax (the largest deduction for most), FICA taxes (7.65%), and any retirement contributions, 25–35% of gross pay going to deductions is typical. On a $75,000 salary: ~$8,500 federal tax + ~$5,750 FICA + $4,500 (6% retirement) = $18,750 in deductions = $56,250 net. Add state tax and the number drops further." },
        { question: "Does this include state taxes?", answer: "No. State income tax varies dramatically: 9 states have zero income tax (TX, FL, NV, WY, WA, SD, AK, NH, TN). California taxes up to 13.3%, New York up to 10.9%. The same $75,000 salary yields ~$3,800 more take-home in Texas compared to California. Some cities add local taxes too (NYC: 3–3.9%, Philadelphia: 3.75%)." },
        { question: "How do 401(k) contributions affect my taxes?", answer: "Traditional 401(k) contributions are pre-tax — every dollar you contribute reduces your taxable income by one dollar. At a 22% marginal rate, a $100 contribution only 'costs' you $78 in take-home pay because you save $22 in taxes. The 2024 contribution limit is $23,000 ($30,500 if you're 50+). Always contribute at least enough to capture your employer's full match — that's free money." },
        { question: "What's the Social Security wage cap?", answer: "In 2024, you pay Social Security tax (6.2%) only on the first $168,600 of wages. Income above this threshold is not subject to Social Security tax, effectively giving high earners a 'raise' on paychecks later in the year after hitting the cap. Medicare has no wage cap — you pay 1.45% on all earnings." },
        { question: "Roth 401(k) vs Traditional 401(k) — which is better for my paycheck?", answer: "Traditional 401(k): reduces your taxable income now (lower taxes today, taxed in retirement). Roth 401(k): contributed with after-tax dollars (higher taxes today, tax-free in retirement). If you expect to be in a higher tax bracket in retirement, Roth is better. If your tax rate will be lower in retirement, Traditional wins. Many advisors recommend splitting between both for tax diversification." },
        { question: "How can I increase my take-home pay?", answer: "Optimize your W-4 withholding (many people over-withhold, giving the IRS an interest-free loan). Maximize pre-tax deductions (FSA for healthcare, commuter benefits). Negotiate a raise or promotion. Contribute to retirement strategically — the tax savings partially offset the contribution." },
      ]}
      relatedTools={[
        { title: "Tax Bracket Calculator", href: "/tax-bracket" },
        { title: "Freelance Tax Estimator", href: "/tax-estimator" },
        { title: "Budget Planner", href: "/budget-planner" },
        { title: "Net Worth Calculator", href: "/net-worth" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <Label>Annual Salary ($)</Label>
            <Input type="number" value={salary} onChange={(e) => setSalary(+e.target.value)} min={0} />
            <p className="text-xs text-muted-foreground mt-1">Gross salary before any deductions or taxes.</p>
          </div>
          <div>
            <Label>Pay Frequency</Label>
            <Select value={payFrequency} onValueChange={(v) => setPayFrequency(v as any)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly (52 paychecks)</SelectItem>
                <SelectItem value="biweekly">Bi-Weekly (26 paychecks)</SelectItem>
                <SelectItem value="monthly">Monthly (12 paychecks)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Filing Status</Label>
            <Select value={filing} onValueChange={(v) => setFiling(v as "single" | "married")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single ($14,600 standard deduction)</SelectItem>
                <SelectItem value="married">Married Filing Jointly ($29,200 standard deduction)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Retirement Contribution (%)</Label>
            <Input type="number" value={retirement} onChange={(e) => setRetirement(+e.target.value)} min={0} max={100} />
            <p className="text-xs text-muted-foreground mt-1">Traditional 401(k)/403(b) pre-tax contribution rate.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Gross per Paycheck</div><div className="text-lg font-bold text-foreground">${result.grossPerPeriod.toLocaleString()}</div></div>
            <div className="rounded-lg bg-primary/10 p-4"><div className="text-xs text-muted-foreground">Net per Paycheck</div><div className="text-lg font-bold text-primary">${result.netPerPeriod.toLocaleString()}</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Annual Take-Home</div><div className="text-lg font-bold text-foreground">${result.netAnnual.toLocaleString()}</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Annual Retirement</div><div className="text-lg font-bold text-foreground">${result.retirementDeduction.toLocaleString()}</div></div>
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