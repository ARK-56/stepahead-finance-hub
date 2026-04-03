import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
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
      description="Calculate your monthly payment, total interest, and see a year-by-year breakdown for any personal loan. Compare loan amounts and terms to find the most affordable option before you borrow."
      howToUse="Enter the amount you need to borrow, the annual interest rate offered by your lender, and the repayment period in years. The calculator displays your fixed monthly payment, total interest cost, and total amount repaid. The stacked bar chart shows how each year's payments are split between principal and interest — notice how interest dominates early years and diminishes over time as your balance decreases."
      understandingTitle="Understanding Personal Loans"
      understandingContent="Personal loans are unsecured installment loans — meaning they don't require collateral like a house or car. Because lenders take on more risk with unsecured lending, interest rates are typically higher than secured loans (mortgages, auto loans). Rates range widely based on creditworthiness: 6–8% for excellent credit (750+), 9–15% for good credit (670–749), 16–25% for fair credit (580–669), and 25–36% for poor credit (below 580). Most personal loans have fixed rates and fixed monthly payments, making them predictable for budgeting. Common uses include debt consolidation (combining multiple high-interest debts into one lower-rate payment), home improvements, major purchases, medical bills, and emergency expenses. Before borrowing, compare offers from multiple lenders (banks, credit unions, and online lenders like SoFi, LendingClub, or Marcus). Many offer pre-qualification with a soft credit pull that doesn't affect your score. Watch out for origination fees (1–8% of the loan amount, deducted upfront), which effectively increase your APR."
      faqs={[
        { question: "What credit score do I need for a personal loan?", answer: "Most lenders require a minimum of 580, but the best rates go to borrowers with 720+. Some online lenders (Upstart, Avant) use alternative data and may approve lower scores. Credit unions are often more flexible than banks. Pre-qualifying with multiple lenders (soft pull, no score impact) helps you find the best rate without hurting your credit." },
        { question: "Are personal loans tax deductible?", answer: "Generally no — personal loan interest is not deductible. However, if the loan is used for business expenses, the interest may be deductible as a business expense. If used for qualified education expenses, it may be deductible under student loan interest rules. Consult a tax professional for your specific situation." },
        { question: "How does loan term affect total cost?", answer: "Longer terms reduce monthly payments but dramatically increase total interest. Example with a $15,000 loan at 8%: 3-year term → $470/month, $1,920 total interest. 5-year term → $304/month, $3,249 total interest. 7-year term → $234/month, $4,652 total interest. The 7-year loan costs $2,732 more than the 3-year loan." },
        { question: "What is an origination fee?", answer: "An origination fee (1–8% of the loan amount) is charged by some lenders to process the loan. It's typically deducted from your disbursement. If you borrow $10,000 with a 5% origination fee, you receive $9,500 but repay $10,000 plus interest. Always compare the APR (which includes fees) rather than just the interest rate." },
        { question: "Personal loan vs. credit card — which is better?", answer: "Personal loans almost always offer lower rates than credit cards (8–15% vs. 20–30%). They're ideal for consolidating credit card debt or financing large expenses. Credit cards are better for short-term needs you can pay off within the grace period (no interest) or for earning rewards. If you're carrying a balance, a personal loan will save significant interest." },
        { question: "Can I pay off a personal loan early?", answer: "Most personal loans have no prepayment penalty — check your loan agreement. Paying extra each month reduces your principal faster and saves on total interest. Some lenders (especially credit unions) make this easy through online portals. Even an extra $50/month can save hundreds in interest and shorten your payoff by months." },
      ]}
      relatedTools={[
        { title: "Debt Payoff Calculator", href: "/debt-payoff" },
        { title: "Student Loan Calculator", href: "/student-loan" },
        { title: "Auto Loan Calculator", href: "/auto-loan" },
        { title: "Budget Planner", href: "/budget-planner" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <Label>Loan Amount ($)</Label>
            <Input type="number" value={amount} onChange={(e) => setAmount(+e.target.value)} min={0} />
            <p className="text-xs text-muted-foreground mt-1">Typical range: $1,000–$50,000 depending on lender.</p>
          </div>
          <div>
            <Label>Interest Rate (%)</Label>
            <Input type="number" value={rate} onChange={(e) => setRate(+e.target.value)} min={0} step={0.1} />
            <p className="text-xs text-muted-foreground mt-1">Excellent credit: 6–8% · Good: 9–15% · Fair: 16–25%</p>
          </div>
          <div>
            <Label>Loan Term (Years)</Label>
            <Input type="number" value={term} onChange={(e) => setTerm(+e.target.value)} min={1} max={10} />
            <p className="text-xs text-muted-foreground mt-1">Shorter terms cost less overall but have higher payments.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="result-card-highlight"><div className="text-xs text-muted-foreground">Monthly Payment</div><div className="text-lg font-bold text-primary">${data.payment.toLocaleString()}</div></div>
            <div className="result-card"><div className="text-xs text-muted-foreground">Total Interest</div><div className="text-lg font-bold text-foreground">${data.totalInterest.toLocaleString()}</div></div>
            <div className="result-card"><div className="text-xs text-muted-foreground">Total Paid</div><div className="text-lg font-bold text-foreground">${data.totalPaid.toLocaleString()}</div></div>
          </div>
        </div>
        <div className="chart-container h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.yearly}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} label={{ value: "Year", position: "insideBottom", offset: -2 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="principal" stackId="a" fill="hsl(var(--chart-2))" name="Principal" />
              <Bar dataKey="interest" stackId="a" fill="hsl(var(--chart-1))" name="Interest" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ToolShell>
  );
}