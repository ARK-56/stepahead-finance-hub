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

    const interestToLoanRatio = loanAmount > 0 ? (totalInterest / loanAmount * 100) : 0;

    return { points, payment: Math.round(payment * 100) / 100, totalInterest: Math.round(totalInterest), totalPaid: Math.round(payment * n), loanAmount, interestToLoanRatio };
  }, [homePrice, downPayment, rate, term]);

  return (
    <ToolShell
      title="Mortgage Amortization Calculator"
      description="See your complete mortgage amortization schedule — how each payment splits between principal and interest over the entire life of your loan. Understand why early payments are mostly interest and how extra payments can save you tens of thousands of dollars."
      howToUse="Enter the home purchase price and your down payment amount (20% is standard to avoid PMI). Set the mortgage interest rate — check current rates at your bank or on Freddie Mac's Primary Mortgage Market Survey. Select the loan term (15 or 30 years are most common). The calculator shows your monthly principal and interest payment, total interest over the life of the loan, and a chart with three lines: remaining balance (declining), cumulative principal paid (rising), and cumulative interest paid (rising). The chart clearly shows the 'crossover point' where more of each payment goes to principal than interest."
      understandingTitle="Understanding Mortgage Amortization"
      understandingContent="Mortgage amortization is the process of gradually paying off a loan through fixed monthly payments that cover both interest and principal. The key insight: in the early years, the vast majority of your payment goes to interest. For a $280,000 loan at 7% for 30 years, your first monthly payment of $1,863 breaks down as $1,633 interest and only $230 principal — meaning 87.6% of your payment goes to interest. By year 15, the split is roughly 50/50. By the final years, nearly all of each payment goes to principal. This is why the first decade of mortgage payments feels like you're barely making progress — because you mostly aren't, at least in terms of principal reduction. This front-loading of interest is also why extra payments early in the loan are so powerful. An extra $200/month starting in year 1 of a 30-year mortgage at 7% can save you over $100,000 in interest and knock 7+ years off the loan. The 15-year vs. 30-year decision is significant: a 15-year mortgage on $280,000 at 6.5% has payments of ~$2,441 (vs. $1,770 for 30-year), but total interest drops from $357,000 to $159,000 — saving nearly $200,000. You build equity roughly 3× faster with a 15-year loan."
      faqs={[
        { question: "Should I choose 15 or 30 years?", answer: "A 15-year mortgage saves an enormous amount in interest (often $150,000–$200,000+) and builds equity much faster. But the ~40% higher payments reduce flexibility. Choose 15-year if: you can comfortably afford the higher payment, you have an emergency fund, and you're already saving for retirement. Choose 30-year if: you need lower payments for cash flow, you'd invest the monthly savings elsewhere, or your job/income is less stable. A middle ground: take a 30-year mortgage but make extra payments as if it were 15-year — this preserves flexibility while reducing interest." },
        { question: "How does one extra payment per year help?", answer: "Making one extra monthly payment per year (either as a 13th payment or by adding 1/12 extra to each monthly payment) on a 30-year mortgage at 7% can shave 4–5 years off the loan and save $50,000–$80,000 in interest on a $280,000 loan. The biweekly payment strategy (26 half-payments = 13 full payments per year) achieves this automatically." },
        { question: "What's included in my total monthly payment?", answer: "This calculator shows Principal + Interest (P&I) only. Your actual monthly PITI payment includes: Principal + Interest (shown here), Property Tax (~1–2.5% of home value annually, escrowed monthly), Homeowner's Insurance (~0.5–1% of home value annually), and PMI (Private Mortgage Insurance, 0.5–1% of loan, required if down payment < 20%). A $350,000 home might have P&I of $1,863, taxes of $350, insurance of $146, and PMI of $117 = $2,476 total." },
        { question: "When does the principal-interest split even out?", answer: "For a standard 30-year mortgage at current rates (6–7%), the crossover point where principal exceeds interest in each payment occurs around year 17–20. For a 15-year mortgage, it's around year 5–7. This accelerated equity building is a major advantage of shorter-term loans." },
        { question: "Is it worth refinancing?", answer: "The traditional rule of thumb is to refinance if you can reduce your rate by 0.75–1.0% or more. But also consider: how long you'll stay (you need to stay long enough to recoup closing costs of 2–5%), the new loan term (refinancing into a new 30-year loan restarts amortization), and closing costs. Use the break-even formula: Total Closing Costs ÷ Monthly Savings = Months to break even." },
        { question: "What are points, and should I buy them?", answer: "Discount points (each = 1% of the loan amount) 'buy down' your interest rate, typically by 0.25% per point. Paying $2,800 (one point on $280,000) to reduce your rate from 7% to 6.75% saves ~$53/month. Break-even: $2,800 ÷ $53 = 53 months (~4.4 years). If you'll stay longer than 4.4 years, buying points saves money. If you might move sooner, skip the points." },
      ]}
      relatedTools={[
        { title: "Rent vs. Buy Calculator", href: "/rent-vs-buy" },
        { title: "Auto Loan Calculator", href: "/auto-loan" },
        { title: "Compound Interest Calculator", href: "/compound-interest" },
        { title: "Net Worth Calculator", href: "/net-worth" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <Label>Home Price ($)</Label>
            <Input type="number" value={homePrice} onChange={(e) => setHomePrice(+e.target.value)} min={0} />
            <p className="text-xs text-muted-foreground mt-1">Total purchase price of the home.</p>
          </div>
          <div>
            <Label>Down Payment ($)</Label>
            <Input type="number" value={downPayment} onChange={(e) => setDownPayment(+e.target.value)} min={0} />
            <p className="text-xs text-muted-foreground mt-1">20% ({Math.round(homePrice * 0.2).toLocaleString()}) avoids PMI.</p>
          </div>
          <div>
            <Label>Interest Rate (%)</Label>
            <Input type="number" value={rate} onChange={(e) => setRate(+e.target.value)} min={0} step={0.1} />
            <p className="text-xs text-muted-foreground mt-1">Current 30-year fixed average: ~7%.</p>
          </div>
          <div>
            <Label>Loan Term (Years)</Label>
            <Input type="number" value={term} onChange={(e) => setTerm(+e.target.value)} min={1} max={30} />
            <p className="text-xs text-muted-foreground mt-1">15-year saves ~$150K+ in interest vs. 30-year.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="result-card-highlight"><div className="text-xs text-muted-foreground">Monthly P&I</div><div className="text-lg font-bold text-primary">${data.payment.toLocaleString()}</div></div>
            <div className="result-card"><div className="text-xs text-muted-foreground">Total Interest</div><div className="text-lg font-bold text-foreground">${data.totalInterest.toLocaleString()}</div></div>
            <div className="result-card"><div className="text-xs text-muted-foreground">Loan Amount</div><div className="text-lg font-bold text-foreground">${data.loanAmount.toLocaleString()}</div></div>
            <div className="result-card"><div className="text-xs text-muted-foreground">Total Paid</div><div className="text-lg font-bold text-foreground">${data.totalPaid.toLocaleString()}</div></div>
          </div>
        </div>
        <div className="chart-container h-[350px]">
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