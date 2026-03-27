import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import ToolShell from "@/components/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function MortgageAmortizationCalculator() {
  const [homePrice, setHomePrice] = useState(350000);
  const [downPayment, setDownPayment] = useState(70000);
  const [rate, setRate] = useState(7);
  const [term, setTerm] = useState(30);

  const data = useMemo(() => {
    const loanAmount = homePrice - downPayment;
    const r = rate / 100 / 12;
    const n = term * 12;
    const payment = r > 0 ? (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : loanAmount / n;
    let remaining = loanAmount;
    const points: { year: number; balance: number; principal: number; interest: number }[] = [];
    let totalPrincipal = 0;
    let totalInterest = 0;

    for (let y = 0; y <= term; y++) {
      points.push({ year: y, balance: Math.round(remaining), principal: Math.round(totalPrincipal), interest: Math.round(totalInterest) });
      for (let m = 0; m < 12 && remaining > 0; m++) {
        const intPmt = remaining * r;
        const prinPmt = Math.min(payment - intPmt, remaining);
        remaining -= prinPmt;
        totalPrincipal += prinPmt;
        totalInterest += intPmt;
      }
    }

    return { points, payment: Math.round(payment * 100) / 100, totalInterest: Math.round(totalInterest), totalPaid: Math.round(payment * n), loanAmount };
  }, [homePrice, downPayment, rate, term]);

  return (
    <ToolShell
      title="Mortgage Amortization Calculator"
      description="See your full mortgage amortization schedule with monthly payment breakdown, total interest, and payoff timeline."
      howToUse="Enter the home price, down payment, interest rate, and loan term. View your monthly payment and a chart showing how principal and interest payments shift over the life of the loan."
      understandingTitle="Understanding Mortgage Amortization"
      understandingContent="In the early years of a mortgage, most of your payment goes toward interest. Over time, the split shifts toward principal. For a 30-year mortgage at 7%, you'll pay nearly as much in interest as the original loan amount. A 15-year term roughly halves total interest but increases monthly payments by about 40%."
      faqs={[
        { question: "Should I choose 15 or 30 years?", answer: "A 15-year mortgage saves tens of thousands in interest but has ~40% higher payments. Choose 30-year if you need flexibility; 15-year if you can afford it and want to build equity faster." },
        { question: "How does an extra payment help?", answer: "One extra payment per year on a 30-year mortgage can shave 4-5 years off the loan and save tens of thousands in interest." },
        { question: "What's included in my total monthly payment?", answer: "This calculator shows principal + interest (P&I). Your actual payment also includes property tax, insurance, and potentially PMI (if down payment < 20%)." },
      ]}
      relatedTools={[
        { title: "Rent vs. Buy Calculator", href: "/rent-vs-buy" },
        { title: "Auto Loan Calculator", href: "/auto-loan" },
        { title: "Compound Interest Calculator", href: "/compound-interest" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div><Label>Home Price ($)</Label><Input type="number" value={homePrice} onChange={(e) => setHomePrice(+e.target.value)} min={0} /></div>
          <div><Label>Down Payment ($)</Label><Input type="number" value={downPayment} onChange={(e) => setDownPayment(+e.target.value)} min={0} /></div>
          <div><Label>Interest Rate (%)</Label><Input type="number" value={rate} onChange={(e) => setRate(+e.target.value)} min={0} step={0.1} /></div>
          <div><Label>Loan Term (Years)</Label><Input type="number" value={term} onChange={(e) => setTerm(+e.target.value)} min={1} max={30} /></div>
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Monthly P&I</div><div className="text-lg font-bold text-foreground">${data.payment.toLocaleString()}</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Total Interest</div><div className="text-lg font-bold text-primary">${data.totalInterest.toLocaleString()}</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Loan Amount</div><div className="text-lg font-bold text-foreground">${data.loanAmount.toLocaleString()}</div></div>
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
              <Legend />
              <Area type="monotone" dataKey="balance" fill="hsl(var(--chart-1))" stroke="hsl(var(--chart-1))" name="Remaining Balance" />
              <Area type="monotone" dataKey="principal" fill="hsl(var(--chart-2))" stroke="hsl(var(--chart-2))" name="Principal Paid" />
              <Area type="monotone" dataKey="interest" fill="hsl(var(--chart-3))" stroke="hsl(var(--chart-3))" name="Interest Paid" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ToolShell>
  );
}
