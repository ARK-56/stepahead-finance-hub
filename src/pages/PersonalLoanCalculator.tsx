import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import ToolShell from "@/components/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function PersonalLoanCalculator() {
  const [amount, setAmount] = useState(15000);
  const [rate, setRate] = useState(8);
  const [term, setTerm] = useState(5);

  const data = useMemo(() => {
    const r = rate / 100 / 12;
    const n = term * 12;
    const payment = r > 0 ? (amount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : amount / n;
    let remaining = amount;
    const yearly: { year: number; principal: number; interest: number }[] = [];

    for (let y = 1; y <= term; y++) {
      let yPrin = 0, yInt = 0;
      for (let m = 0; m < 12 && remaining > 0; m++) {
        const intPmt = remaining * r;
        const prinPmt = Math.min(payment - intPmt, remaining);
        yPrin += prinPmt;
        yInt += intPmt;
        remaining -= prinPmt;
      }
      yearly.push({ year: y, principal: Math.round(yPrin), interest: Math.round(yInt) });
    }
    const totalPaid = Math.round(payment * n);
    return { yearly, payment: Math.round(payment * 100) / 100, totalInterest: totalPaid - amount, totalPaid };
  }, [amount, rate, term]);

  return (
    <ToolShell
      title="Personal Loan Calculator"
      description="Calculate monthly payments and total cost for a personal loan based on amount, rate, and term."
      howToUse="Enter the loan amount you need, the annual interest rate offered, and the repayment period. View your monthly payment alongside a yearly breakdown of principal vs. interest."
      understandingTitle="Understanding Personal Loans"
      understandingContent="Personal loans are unsecured installment loans, meaning they don't require collateral. Because lenders take on more risk, interest rates are typically higher than secured loans (mortgages, auto loans). Rates range from 6% for excellent credit to 36% for poor credit. Fixed-rate loans keep payments predictable."
      faqs={[
        { question: "What credit score do I need for a personal loan?", answer: "Most lenders require a score of 580+, but the best rates go to borrowers with 720+. Some online lenders work with lower scores." },
        { question: "Are personal loans tax deductible?", answer: "Generally no, unless the loan is used for business or investment purposes. Consult a tax professional for your specific situation." },
        { question: "How does loan term affect total cost?", answer: "Longer terms reduce monthly payments but increase total interest paid. A 5-year $15,000 loan at 8% costs about $1,500 more in interest than a 3-year term." },
      ]}
      relatedTools={[
        { title: "Debt Payoff Calculator", href: "/debt-payoff" },
        { title: "Student Loan Calculator", href: "/student-loan" },
        { title: "Auto Loan Calculator", href: "/auto-loan" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div><Label>Loan Amount ($)</Label><Input type="number" value={amount} onChange={(e) => setAmount(+e.target.value)} min={0} /></div>
          <div><Label>Interest Rate (%)</Label><Input type="number" value={rate} onChange={(e) => setRate(+e.target.value)} min={0} step={0.1} /></div>
          <div><Label>Loan Term (Years)</Label><Input type="number" value={term} onChange={(e) => setTerm(+e.target.value)} min={1} max={10} /></div>
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Monthly Payment</div><div className="text-lg font-bold text-foreground">${data.payment.toLocaleString()}</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Total Interest</div><div className="text-lg font-bold text-primary">${data.totalInterest.toLocaleString()}</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Total Paid</div><div className="text-lg font-bold text-foreground">${data.totalPaid.toLocaleString()}</div></div>
          </div>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.yearly}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} label={{ value: "Year", position: "insideBottom", offset: -2 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Bar dataKey="principal" stackId="a" fill="hsl(var(--chart-2))" name="Principal" />
              <Bar dataKey="interest" stackId="a" fill="hsl(var(--chart-1))" name="Interest" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ToolShell>
  );
}
