import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
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
      description="Estimate your monthly student loan payment, total interest cost, and payoff timeline. See exactly how much of each payment goes toward principal vs. interest and plan your repayment strategy."
      howToUse="Enter your total outstanding loan balance, the annual interest rate (check your loan servicer's website for the exact rate), and your repayment term in years. The calculator instantly computes your fixed monthly payment, the total interest you'll pay over the life of the loan, and the total amount paid. The interactive chart visualizes your declining balance alongside cumulative interest, helping you understand the true cost of your loan and how a shorter term could save thousands."
      understandingTitle="Understanding Student Loan Repayment"
      understandingContent="Student loans are fully amortized, meaning each payment covers both interest and principal — but the split changes dramatically over time. In the first year of a $35,000 loan at 5.5%, about 40% of your payment goes to interest. By the final year, virtually all of it goes to principal. This is why early extra payments are so powerful — every dollar you pay beyond the minimum goes directly to principal, reducing the total interest you'll ever owe. Federal student loans typically offer repayment terms of 10, 15, 20, or 25 years. The standard 10-year plan has the highest monthly payment but the lowest total cost. Extending to 20 years cuts your payment by ~30% but can nearly double your total interest. Federal loans also offer income-driven plans (IBR, PAYE, REPAYE, ICR) that cap payments at 10–20% of discretionary income with potential forgiveness after 20–25 years — though forgiven amounts may be taxable. Private loans generally lack these flexible options, making refinancing the primary tool for reducing your rate."
      faqs={[
        { question: "What is a good student loan interest rate?", answer: "Federal Direct Subsidized/Unsubsidized loans for undergrads have fixed rates set annually by Congress — for 2024–25, they're 6.53%. Graduate PLUS loans are 9.08%. Private loans vary from 3% (excellent credit with cosigner) to 14%+ (poor credit, no cosigner). If your federal rate is below 5%, you likely shouldn't refinance — you'd lose federal protections." },
        { question: "Should I pay off student loans early?", answer: "If your rate exceeds what you'd earn investing (~7% long-term average), paying extra saves money. Federal loans have zero prepayment penalties. A common balanced approach: pay minimums on low-rate loans, aggressively pay high-rate loans, and invest in your employer's 401(k) match simultaneously — free money shouldn't be left on the table." },
        { question: "What is income-driven repayment (IDR)?", answer: "IDR plans cap your monthly payment at 10–20% of discretionary income (income above 150% of the poverty line). If your income is low enough, your payment could be $0. After 20–25 years of qualifying payments, remaining balance is forgiven. The new SAVE plan (2024) is the most generous, with the lowest payments and interest subsidies." },
        { question: "How does refinancing work?", answer: "Refinancing replaces one or more loans with a new private loan at a (hopefully) lower rate. Best for borrowers with good credit and stable income who don't need federal protections (IDR, PSLF, forbearance). You can refinance federal and private loans together, but refinancing federal loans into a private loan permanently forfeits federal benefits." },
        { question: "What is Public Service Loan Forgiveness (PSLF)?", answer: "If you work full-time for a qualifying nonprofit or government employer and make 120 qualifying monthly payments on an IDR plan, your remaining federal loan balance is forgiven tax-free. This can save hundreds of thousands for high-balance borrowers (especially grad/professional school graduates)." },
        { question: "Does the interest rate type matter?", answer: "Federal loans have fixed rates (never change). Some private loans offer variable rates that start lower but can increase over time. In a rising-rate environment, fixed rates provide certainty. In a falling-rate environment, variable rates may save money — but carry the risk of future increases." },
      ]}
      relatedTools={[
        { title: "Debt Payoff Calculator", href: "/debt-payoff" },
        { title: "Personal Loan Calculator", href: "/personal-loan" },
        { title: "Budget Planner", href: "/budget-planner" },
        { title: "Compound Interest Calculator", href: "/compound-interest" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <Label>Loan Balance ($)</Label>
            <Input type="number" value={balance} onChange={(e) => setBalance(+e.target.value)} min={0} />
            <p className="text-xs text-muted-foreground mt-1">Total outstanding balance across all student loans.</p>
          </div>
          <div>
            <Label>Interest Rate (%)</Label>
            <Input type="number" value={rate} onChange={(e) => setRate(+e.target.value)} min={0} step={0.1} />
            <p className="text-xs text-muted-foreground mt-1">Federal: 5–9% · Private: 3–14% depending on credit.</p>
          </div>
          <div>
            <Label>Repayment Term (Years)</Label>
            <Input type="number" value={term} onChange={(e) => setTerm(+e.target.value)} min={1} max={30} />
            <p className="text-xs text-muted-foreground mt-1">Standard is 10 years. Shorter terms save interest.</p>
          </div>
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
              <Legend />
              <Area type="monotone" dataKey="balance" fill="hsl(var(--chart-1))" stroke="hsl(var(--chart-1))" name="Remaining Balance" />
              <Area type="monotone" dataKey="interest" fill="hsl(var(--chart-2))" stroke="hsl(var(--chart-2))" name="Total Interest" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ToolShell>
  );
}