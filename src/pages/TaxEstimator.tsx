import { useState } from "react";
import ToolShell from "@/components/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const STEPS = ["Income", "Expenses", "Results"] as const;

export default function TaxEstimator() {
  const [step, setStep] = useState(0);
  const [income, setIncome] = useState(80000);
  const [expenses, setExpenses] = useState(15000);
  const [filingStatus, setFilingStatus] = useState<"single" | "married">("single");

  const netIncome = Math.max(0, income - expenses);
  const selfEmploymentTax = netIncome * 0.9235 * 0.153;
  const standardDeduction = filingStatus === "single" ? 14600 : 29200;
  const taxableIncome = Math.max(0, netIncome - selfEmploymentTax / 2 - standardDeduction);

  const calcFederalTax = (ti: number) => {
    const brackets = filingStatus === "single"
      ? [
          [11600, 0.10], [47150 - 11600, 0.12], [100525 - 47150, 0.22],
          [191950 - 100525, 0.24], [243725 - 191950, 0.32], [609350 - 243725, 0.35], [Infinity, 0.37],
        ]
      : [
          [23200, 0.10], [94300 - 23200, 0.12], [201050 - 94300, 0.22],
          [383900 - 201050, 0.24], [487450 - 383900, 0.32], [731200 - 487450, 0.35], [Infinity, 0.37],
        ];
    let remaining = ti, tax = 0;
    for (const [size, rate] of brackets) {
      if (remaining <= 0) break;
      const chunk = Math.min(remaining, size as number);
      tax += chunk * (rate as number);
      remaining -= chunk;
    }
    return tax;
  };

  const federalTax = calcFederalTax(taxableIncome);
  const totalTax = federalTax + selfEmploymentTax;
  const effectiveRate = netIncome > 0 ? (totalTax / netIncome) * 100 : 0;
  const quarterlyPayment = totalTax / 4;

  return (
    <ToolShell
      title="Freelance Tax Estimator"
      description="Estimate your total self-employment tax burden for 2024, including federal income tax and the SE tax (Social Security + Medicare). Get quarterly payment amounts so you never face an underpayment penalty."
      howToUse="This three-step estimator walks you through the process: Step 1 — enter your total gross freelance income (before any expenses) and select your filing status (Single or Married Filing Jointly). Step 2 — enter your deductible business expenses (home office, software, supplies, travel, etc.). Step 3 — view your complete tax breakdown including net income, self-employment tax, federal income tax, effective tax rate, and recommended quarterly estimated tax payment. The calculator automatically applies the 2024 standard deduction ($14,600 single / $29,200 married) and the self-employment tax deduction (half of SE tax)."
      understandingTitle="Understanding Self-Employment Taxes"
      understandingContent="When you work as a freelancer, contractor, or gig worker, you wear two hats: employee and employer. Unlike W-2 employees whose employers pay half of Social Security and Medicare taxes, self-employed individuals pay both halves — totaling 15.3% (12.4% Social Security on the first $168,600 of net earnings + 2.9% Medicare on all net earnings). This is calculated on 92.35% of your net self-employment income. The good news: you can deduct the employer-equivalent half (7.65%) when calculating your adjusted gross income, which reduces your income tax. After this deduction and the standard deduction, your remaining taxable income is taxed at the progressive federal rates (10% to 37%). Because no employer withholds taxes for you, the IRS requires quarterly estimated payments (Form 1040-ES) due in April, June, September, and January. Missing these deadlines can result in penalties, even if you pay your full balance by April 15."
      faqs={[
        { question: "Do I need to pay self-employment tax?", answer: "Yes, if your net self-employment earnings are $400 or more for the year. This applies to freelancers, independent contractors, gig workers (Uber, DoorDash), Etsy sellers, and anyone receiving 1099-NEC income." },
        { question: "What expenses can I deduct?", answer: "Common deductions include: home office (simplified: $5/sq ft up to 300 sq ft), internet and phone (business-use portion), software and subscriptions, office supplies, business travel and meals (50%), health insurance premiums (self-employed deduction), professional development and courses, marketing and advertising, accounting and legal fees, and vehicle expenses (standard mileage: 67¢/mile in 2024)." },
        { question: "When are quarterly tax payments due?", answer: "Q1: April 15 (for Jan–Mar income), Q2: June 15 (for Apr–May income), Q3: September 15 (for Jun–Aug income), Q4: January 15 of the following year (for Sep–Dec income). If a due date falls on a weekend or holiday, the deadline moves to the next business day." },
        { question: "Does this calculator include state taxes?", answer: "No. This calculator estimates federal income tax and self-employment tax only. State income tax rates range from 0% (Texas, Florida, Wyoming, and 6 others) to over 13% (California). You should add your state's rate for a complete picture." },
        { question: "What happens if I don't make quarterly payments?", answer: "The IRS charges an underpayment penalty (currently around 8% annually) on the amount you should have paid each quarter. You can avoid penalties if you pay at least 90% of this year's tax or 100% of last year's tax (110% if AGI > $150,000) through quarterly payments." },
        { question: "Can I reduce my self-employment tax?", answer: "Yes. Maximize business deductions to lower net earnings. Consider forming an S-Corp if your net income exceeds ~$40,000–$50,000, which can reduce SE tax by paying yourself a reasonable salary and taking remaining profits as distributions. Contribute to a SEP-IRA or Solo 401(k) to reduce income tax (though this doesn't reduce SE tax)." },
      ]}
      relatedTools={[
        { title: "Tax Bracket Calculator", href: "/tax-bracket" },
        { title: "Paycheck Tax Calculator", href: "/paycheck-tax" },
        { title: "Capital Gains Tax Calculator", href: "/capital-gains-tax" },
        { title: "Budget Planner", href: "/budget-planner" },
      ]}
    >
      {/* Progress */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
              i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {i + 1}
            </div>
            <span className={`text-sm hidden sm:inline ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="w-8 h-px bg-border" />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-5 max-w-md">
          <div>
            <Label>Gross Freelance Income ($)</Label>
            <Input type="number" value={income} onChange={(e) => setIncome(+e.target.value)} min={0} />
            <p className="text-xs text-muted-foreground mt-1">Total revenue from all freelance/contract work before expenses.</p>
          </div>
          <div>
            <Label>Filing Status</Label>
            <div className="flex gap-3 mt-1">
              {(["single", "married"] as const).map((s) => (
                <Button key={s} variant={filingStatus === s ? "default" : "outline"} size="sm" onClick={() => setFilingStatus(s)} className="capitalize">
                  {s === "married" ? "Married Filing Jointly" : "Single"}
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Determines your standard deduction and tax bracket thresholds.</p>
          </div>
          <Button onClick={() => setStep(1)}>Next →</Button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5 max-w-md">
          <div>
            <Label>Business Expenses ($)</Label>
            <Input type="number" value={expenses} onChange={(e) => setExpenses(+e.target.value)} min={0} />
            <p className="text-xs text-muted-foreground mt-1">Include home office, supplies, software, travel, meals (50%), insurance, and professional services.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep(0)}>← Back</Button>
            <Button onClick={() => setStep(2)}>See Results →</Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            {[
              { label: "Net Income", value: netIncome, desc: "Gross income minus expenses" },
              { label: "Self-Employment Tax", value: selfEmploymentTax, desc: "15.3% on 92.35% of net earnings" },
              { label: "Federal Income Tax", value: federalTax, desc: "Based on 2024 progressive brackets" },
              { label: "Total Estimated Tax", value: totalTax, desc: "SE tax + federal income tax" },
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-accent p-4">
                <div className="text-xs text-muted-foreground">{item.label}</div>
                <div className="text-lg font-bold text-foreground">${Math.round(item.value).toLocaleString()}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{item.desc}</div>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="rounded-lg bg-primary/10 p-4">
              <div className="text-xs text-muted-foreground">Effective Tax Rate</div>
              <div className="text-lg font-bold text-primary">{effectiveRate.toFixed(1)}%</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Total tax as a % of net income</div>
            </div>
            <div className="rounded-lg bg-primary/10 p-4">
              <div className="text-xs text-muted-foreground">Quarterly Payment</div>
              <div className="text-lg font-bold text-primary">${Math.round(quarterlyPayment).toLocaleString()}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">Due Apr 15, Jun 15, Sep 15, Jan 15</div>
            </div>
          </div>
          <Button variant="outline" onClick={() => setStep(0)}>← Start Over</Button>
        </div>
      )}
    </ToolShell>
  );
}