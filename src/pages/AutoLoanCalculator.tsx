import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
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
      description="Calculate your monthly car payment, total interest cost, and visualize your complete payoff timeline. Whether you're buying new or used, see exactly what you'll pay over the life of the loan before you visit the dealership."
      howToUse="Enter the vehicle's total price (including tax and fees, or just the sticker price for a rough estimate). Input your planned down payment — 20% or more is ideal to avoid being 'underwater.' Add the annual interest rate from your lender (check your bank or credit union for pre-approval rates before shopping). Select the loan term in years (3–8 years is typical). The calculator instantly shows your monthly payment, total interest cost, and an interactive chart tracking your declining balance over time."
      understandingTitle="Understanding Auto Loans"
      understandingContent="Auto loans are installment loans secured by the vehicle itself — if you stop paying, the lender can repossess the car. Because the vehicle serves as collateral, rates are typically lower than unsecured personal loans. Your credit score is the biggest factor determining your rate: prime borrowers (720+) can expect 4–6% for new cars, while subprime borrowers (below 620) may face 10–20%+ rates. The loan term has a massive impact on total cost. While 72- and 84-month loans are increasingly popular because of their lower monthly payments, they dramatically increase total interest paid and increase the risk of being 'underwater' (owing more than the car is worth). A vehicle depreciates roughly 20% in the first year and about 15% per year after that. With a long loan and small down payment, you can easily owe $5,000–$10,000 more than the car is worth for years. For the best financial outcome: get pre-approved at your bank or credit union before visiting a dealer, put at least 20% down, and choose the shortest term you can comfortably afford (48–60 months is the sweet spot)."
      faqs={[
        { question: "What's a good auto loan interest rate?", answer: "As of 2024–25: excellent credit (750+): 4–6% new, 5–7% used. Good credit (700–749): 6–8% new, 7–9% used. Fair credit (650–699): 8–12%. Poor credit (below 650): 12–20%+. Credit union rates are often 1–2% lower than banks. Always get pre-approved before negotiating at a dealership." },
        { question: "How much should my down payment be?", answer: "Aim for at least 20% down for a new car and 10% for used. This prevents negative equity (being 'underwater'), reduces your monthly payment, may get you a better interest rate, and covers sales tax/fees without rolling them into the loan. If you can't put 20% down, consider a less expensive vehicle." },
        { question: "Is a longer loan term better?", answer: "Longer terms lower monthly payments but cost significantly more overall. Example on a $25,000 loan at 6.5%: 48-month term → $593/month, $3,468 total interest. 72-month term → $420/month, $5,274 total interest. That's $1,806 more in interest — plus 2 extra years of payments and higher insurance requirements." },
        { question: "Should I finance through the dealer or my bank?", answer: "Always get pre-approved at your bank or credit union first — it gives you a baseline rate and negotiating leverage. Dealer financing can sometimes beat your rate (especially with manufacturer promotions like 0% APR), but dealers may markup the rate to earn a commission. Compare both and choose the lower rate." },
        { question: "Does paying off my car loan early save money?", answer: "Yes. Most auto loans have no prepayment penalties (check your contract). Extra payments go directly to principal, reducing total interest. Even $50/month extra on a $25,000 loan can save $500+ in interest and pay it off months earlier." },
        { question: "New vs. used — which is the better financial decision?", answer: "Used cars (2–3 years old) typically offer the best value because they've already absorbed the steepest depreciation. A 2-year-old car costs 30–40% less than new but still has 80%+ of its useful life remaining. Certified Pre-Owned (CPO) programs offer manufacturer-backed warranties on used vehicles. However, new cars offer the latest safety tech, better financing rates, and full warranties." },
      ]}
      relatedTools={[
        { title: "Personal Loan Calculator", href: "/personal-loan" },
        { title: "Debt Payoff Calculator", href: "/debt-payoff" },
        { title: "Budget Planner", href: "/budget-planner" },
        { title: "Net Worth Calculator", href: "/net-worth" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <Label>Vehicle Price ($)</Label>
            <Input type="number" value={price} onChange={(e) => setPrice(+e.target.value)} min={0} />
            <p className="text-xs text-muted-foreground mt-1">Sticker price or total out-the-door cost including tax/fees.</p>
          </div>
          <div>
            <Label>Down Payment ($)</Label>
            <Input type="number" value={downPayment} onChange={(e) => setDownPayment(+e.target.value)} min={0} />
            <p className="text-xs text-muted-foreground mt-1">Aim for 20%+ to avoid negative equity.</p>
          </div>
          <div>
            <Label>Interest Rate (%)</Label>
            <Input type="number" value={rate} onChange={(e) => setRate(+e.target.value)} min={0} step={0.1} />
            <p className="text-xs text-muted-foreground mt-1">Get pre-approved at your bank for the best rate.</p>
          </div>
          <div>
            <Label>Loan Term (Years)</Label>
            <Input type="number" value={term} onChange={(e) => setTerm(+e.target.value)} min={1} max={8} />
            <p className="text-xs text-muted-foreground mt-1">4–5 years is the sweet spot for cost vs. payment.</p>
          </div>
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
              <Legend />
              <Area type="monotone" dataKey="balance" fill="hsl(var(--chart-1))" stroke="hsl(var(--chart-1))" name="Remaining Balance" />
              <Area type="monotone" dataKey="interest" fill="hsl(var(--chart-2))" stroke="hsl(var(--chart-2))" name="Cumulative Interest" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ToolShell>
  );
}