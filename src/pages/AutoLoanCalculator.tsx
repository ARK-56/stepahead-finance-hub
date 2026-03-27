import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import ToolShell from "@/components/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AutoLoanCalculator() {
  const [price, setPrice] = useState(30000);
  const [downPayment, setDownPayment] = useState(5000);
  const [rate, setRate] = useState(6.5);
  const [term, setTerm] = useState(5);

  const data = useMemo(() => {
    const loanAmount = price - downPayment;
    const r = rate / 100 / 12;
    const n = term * 12;
    const payment = r > 0 ? (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : loanAmount / n;
    let remaining = loanAmount;
    const points: { month: number; balance: number; interest: number }[] = [];
    let totalInterest = 0;

    for (let m = 0; m <= n; m++) {
      points.push({ month: m, balance: Math.round(remaining), interest: Math.round(totalInterest) });
      if (remaining > 0) {
        const intPmt = remaining * r;
        remaining -= (payment - intPmt);
        totalInterest += intPmt;
      }
    }
    return { points, payment: Math.round(payment * 100) / 100, totalInterest: Math.round(totalInterest), loanAmount };
  }, [price, downPayment, rate, term]);

  return (
    <ToolShell
      title="Auto Loan Calculator"
      description="Calculate your monthly car payment, total interest, and see your payoff timeline with an interactive chart."
      howToUse="Enter the vehicle price, your down payment, the interest rate from your lender, and the loan term. The calculator shows your monthly payment, total interest cost, and a visual payoff schedule."
      understandingTitle="Understanding Auto Loans"
      understandingContent="Auto loans are installment loans secured by the vehicle. Shorter terms (36-48 months) have higher payments but save thousands in interest compared to longer terms (60-84 months). Your credit score heavily influences the rate you'll receive—prime borrowers may get 4-6%, while subprime borrowers may face 10%+."
      faqs={[
        { question: "What's a good auto loan interest rate?", answer: "As of 2024, excellent credit (750+) can get rates around 4-6% for new cars. Used car rates are typically 1-2% higher." },
        { question: "How much should my down payment be?", answer: "Aim for at least 20% down to avoid being 'underwater' on the loan. At minimum, put down enough to cover taxes and fees." },
        { question: "Is a longer loan term better?", answer: "Longer terms lower monthly payments but cost significantly more in total interest. A 72-month loan can cost $2,000-5,000 more than a 48-month loan." },
      ]}
      relatedTools={[
        { title: "Personal Loan Calculator", href: "/personal-loan" },
        { title: "Budget Planner", href: "/budget-planner" },
        { title: "Compound Interest Calculator", href: "/compound-interest" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div><Label>Vehicle Price ($)</Label><Input type="number" value={price} onChange={(e) => setPrice(+e.target.value)} min={0} /></div>
          <div><Label>Down Payment ($)</Label><Input type="number" value={downPayment} onChange={(e) => setDownPayment(+e.target.value)} min={0} /></div>
          <div><Label>Interest Rate (%)</Label><Input type="number" value={rate} onChange={(e) => setRate(+e.target.value)} min={0} step={0.1} /></div>
          <div><Label>Loan Term (Years)</Label><Input type="number" value={term} onChange={(e) => setTerm(+e.target.value)} min={1} max={8} /></div>
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Monthly Payment</div><div className="text-lg font-bold text-foreground">${data.payment.toLocaleString()}</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Total Interest</div><div className="text-lg font-bold text-primary">${data.totalInterest.toLocaleString()}</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Loan Amount</div><div className="text-lg font-bold text-foreground">${data.loanAmount.toLocaleString()}</div></div>
          </div>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.points}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} label={{ value: "Months", position: "insideBottom", offset: -2 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Area type="monotone" dataKey="balance" fill="hsl(var(--chart-1))" stroke="hsl(var(--chart-1))" name="Balance" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ToolShell>
  );
}
