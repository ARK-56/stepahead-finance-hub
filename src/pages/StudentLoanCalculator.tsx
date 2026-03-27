import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import ToolShell from "@/components/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StudentLoanCalculator() {
  const [balance, setBalance] = useState(35000);
  const [rate, setRate] = useState(5.5);
  const [term, setTerm] = useState(10);

  const data = useMemo(() => {
    const r = rate / 100 / 12;
    const n = term * 12;
    const payment = r > 0 ? (balance * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : balance / n;
    let remaining = balance;
    const points: { year: number; balance: number; paid: number; interest: number }[] = [];
    let totalPaid = 0;
    let totalInterest = 0;

    for (let y = 0; y <= term; y++) {
      points.push({ year: y, balance: Math.round(remaining), paid: Math.round(totalPaid), interest: Math.round(totalInterest) });
      for (let m = 0; m < 12 && remaining > 0; m++) {
        const intPmt = remaining * r;
        const prinPmt = Math.min(payment - intPmt, remaining);
        remaining -= prinPmt;
        totalPaid += payment;
        totalInterest += intPmt;
      }
    }
    return { points, payment: Math.round(payment * 100) / 100, totalInterest: Math.round(totalInterest), totalPaid: Math.round(totalPaid) };
  }, [balance, rate, term]);

  return (
    <ToolShell
      title="Student Loan Calculator"
      description="Estimate your monthly student loan payment and see how much interest you'll pay over the life of your loan."
      howToUse="Enter your total loan balance, interest rate, and repayment term. The calculator instantly computes your monthly payment and total interest cost, with a chart showing your balance decrease over time."
      understandingTitle="Understanding Student Loan Repayment"
      understandingContent="Student loans are amortized, meaning each payment covers both interest and principal. Early payments are interest-heavy; over time, more goes toward principal. Federal loans typically offer 10, 15, 20, or 25-year repayment plans. A shorter term means higher monthly payments but significantly less total interest paid."
      faqs={[
        { question: "What is a good student loan interest rate?", answer: "Federal student loan rates are set by Congress and typically range from 4-7%. Private loans vary widely based on creditworthiness, from 3% to 14%." },
        { question: "Should I pay off student loans early?", answer: "If your interest rate is higher than what you'd earn investing, paying off early saves money. Federal loans have no prepayment penalties." },
        { question: "What is income-driven repayment?", answer: "IDR plans cap your monthly payment at a percentage of discretionary income (10-20%). After 20-25 years, remaining balance may be forgiven." },
      ]}
      relatedTools={[
        { title: "Debt Payoff Calculator", href: "/debt-payoff" },
        { title: "Personal Loan Calculator", href: "/personal-loan" },
        { title: "Budget Planner", href: "/budget-planner" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div><Label>Loan Balance ($)</Label><Input type="number" value={balance} onChange={(e) => setBalance(+e.target.value)} min={0} /></div>
          <div><Label>Interest Rate (%)</Label><Input type="number" value={rate} onChange={(e) => setRate(+e.target.value)} min={0} step={0.1} /></div>
          <div><Label>Repayment Term (Years)</Label><Input type="number" value={term} onChange={(e) => setTerm(+e.target.value)} min={1} max={30} /></div>
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Monthly Payment</div><div className="text-lg font-bold text-foreground">${data.payment.toLocaleString()}</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Total Interest</div><div className="text-lg font-bold text-primary">${data.totalInterest.toLocaleString()}</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Total Paid</div><div className="text-lg font-bold text-foreground">${data.totalPaid.toLocaleString()}</div></div>
          </div>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.points}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} label={{ value: "Years", position: "insideBottom", offset: -2 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Area type="monotone" dataKey="balance" fill="hsl(var(--chart-1))" stroke="hsl(var(--chart-1))" name="Remaining Balance" />
              <Area type="monotone" dataKey="interest" fill="hsl(var(--chart-2))" stroke="hsl(var(--chart-2))" name="Total Interest" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ToolShell>
  );
}
