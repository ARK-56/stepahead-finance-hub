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
      description="Estimate your self-employment taxes for 2024 with this simple step-by-step form. Get a clear picture of your federal tax obligations as a freelancer."
      howToUse="Start by entering your gross freelance income and filing status in Step 1. In Step 2, enter your deductible business expenses. The calculator will then show your estimated self-employment tax, federal income tax, effective tax rate, and recommended quarterly payments."
      understandingTitle="Understanding Self-Employment Taxes"
      understandingContent="As a freelancer or self-employed individual, you're responsible for paying both the employer and employee portions of Social Security and Medicare taxes — known as the self-employment (SE) tax, which totals 15.3% on 92.35% of your net earnings. You can deduct half of this SE tax when calculating your adjusted gross income. After subtracting the standard deduction, your remaining taxable income is taxed according to the federal income tax brackets. Estimated taxes are typically paid quarterly to avoid underpayment penalties."
      faqs={[
        { question: "Do I need to pay self-employment tax?", answer: "If your net self-employment earnings are $400 or more for the year, you are required to pay self-employment tax and file a tax return." },
        { question: "What expenses can I deduct?", answer: "Common deductible expenses include office supplies, software subscriptions, home office costs, business travel, health insurance premiums, and professional development expenses." },
        { question: "When are quarterly tax payments due?", answer: "Quarterly estimated tax payments are generally due on April 15, June 15, September 15, and January 15 of the following year." },
        { question: "Does this calculator include state taxes?", answer: "No, this calculator only estimates federal income tax and self-employment tax. State tax obligations vary by state and are not included." },
      ]}
      relatedTools={[
        { title: "Compound Interest Calculator", href: "/compound-interest" },
        { title: "Currency Converter", href: "/currency-converter" },
        { title: "Paycheck Calculator", href: "#" },
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
          </div>
          <div>
            <Label>Filing Status</Label>
            <div className="flex gap-3 mt-1">
              {(["single", "married"] as const).map((s) => (
                <Button key={s} variant={filingStatus === s ? "default" : "outline"} size="sm" onClick={() => setFilingStatus(s)} className="capitalize">
                  {s}
                </Button>
              ))}
            </div>
          </div>
          <Button onClick={() => setStep(1)}>Next →</Button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5 max-w-md">
          <div>
            <Label>Business Expenses ($)</Label>
            <Input type="number" value={expenses} onChange={(e) => setExpenses(+e.target.value)} min={0} />
            <p className="text-xs text-muted-foreground mt-1">Deductible expenses: supplies, software, home office, etc.</p>
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
              { label: "Net Income", value: netIncome },
              { label: "Self-Employment Tax", value: selfEmploymentTax },
              { label: "Federal Income Tax", value: federalTax },
              { label: "Total Estimated Tax", value: totalTax },
            ].map((item) => (
              <div key={item.label} className="rounded-lg bg-accent p-4">
                <div className="text-xs text-muted-foreground">{item.label}</div>
                <div className="text-lg font-bold text-foreground">${Math.round(item.value).toLocaleString()}</div>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 gap-4 mb-6">
            <div className="rounded-lg bg-primary/10 p-4">
              <div className="text-xs text-muted-foreground">Effective Tax Rate</div>
              <div className="text-lg font-bold text-primary">{effectiveRate.toFixed(1)}%</div>
            </div>
            <div className="rounded-lg bg-primary/10 p-4">
              <div className="text-xs text-muted-foreground">Quarterly Payment</div>
              <div className="text-lg font-bold text-primary">${Math.round(quarterlyPayment).toLocaleString()}</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mb-4">* This is an estimate. Consult a tax professional for actual filing.</p>
          <Button variant="outline" onClick={() => setStep(0)}>← Start Over</Button>
        </div>
      )}
    </ToolShell>
  );
}
