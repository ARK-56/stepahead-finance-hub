import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import ToolShell from "@/components/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RentVsBuyCalculator() {
  const [homePrice, setHomePrice] = useState(350000);
  const [downPaymentPct, setDownPaymentPct] = useState(20);
  const [mortgageRate, setMortgageRate] = useState(7);
  const [monthlyRent, setMonthlyRent] = useState(1800);
  const [rentIncrease, setRentIncrease] = useState(3);
  const [appreciation, setAppreciation] = useState(3);
  const [years, setYears] = useState(10);

  const data = useMemo(() => {
    const downPayment = homePrice * (downPaymentPct / 100);
    const loanAmount = homePrice - downPayment;
    const r = mortgageRate / 100 / 12;
    const n = 30 * 12;
    const monthlyMortgage = r > 0 ? (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : loanAmount / n;
    const monthlyOwnership = monthlyMortgage + (homePrice * 0.012) / 12 + (homePrice * 0.005) / 12 + 150;

    let totalRentCost = 0;
    let totalBuyCost = downPayment;
    let rent = monthlyRent;
    const points: { year: number; rentTotal: number; buyTotal: number }[] = [];

    for (let y = 0; y <= years; y++) {
      const homeValue = homePrice * Math.pow(1 + appreciation / 100, y);
      const equity = homeValue - loanAmount * (1 - y / 30);
      points.push({
        year: y,
        rentTotal: Math.round(totalRentCost),
        buyTotal: Math.round(totalBuyCost - equity + downPayment),
      });
      totalRentCost += rent * 12;
      totalBuyCost += monthlyOwnership * 12;
      rent *= 1 + rentIncrease / 100;
    }

    return { points, monthlyMortgage: Math.round(monthlyMortgage), monthlyOwnership: Math.round(monthlyOwnership), downPayment: Math.round(downPayment) };
  }, [homePrice, downPaymentPct, mortgageRate, monthlyRent, rentIncrease, appreciation, years]);

  return (
    <ToolShell
      title="Rent vs. Buy Calculator"
      description="Compare the true total cost of renting versus buying a home over time. This calculator factors in equity building, home appreciation, property taxes, insurance, and maintenance — giving you a more complete picture than just comparing monthly payments."
      howToUse="Enter the home price and your planned down payment percentage. Set the mortgage interest rate (check current rates at your bank). Input your current monthly rent and the expected annual rent increase (3% is typical). Add the expected annual home appreciation rate for your area (national average is ~3–4%). Choose your time horizon — how long you plan to stay. The line chart shows cumulative costs for both scenarios over time. When the 'Buy' line drops below the 'Rent' line, buying becomes the better financial decision. Note: the 'Buy' line represents net cost after accounting for equity built."
      understandingTitle="Understanding Rent vs. Buy"
      understandingContent="The rent vs. buy decision is one of the most significant financial choices you'll make, and the answer isn't always obvious. Buying is NOT always better than renting — it depends on dozens of variables. Key factors that favor buying: you plan to stay 5+ years (to offset transaction costs of 5–10%), home prices are appreciating faster than rent increases, mortgage rates are low, and you can afford a 20% down payment (avoiding PMI). Key factors that favor renting: you may move within 3–5 years, you live in a high price-to-rent ratio market (like SF or NYC where homes cost 30–40× annual rent), you'd earn more investing the down payment in the stock market, or you value flexibility and don't want maintenance responsibility. The hidden costs of homeownership that many calculators ignore: property taxes (1–2.5% of home value annually), homeowner's insurance (0.5–1%), maintenance and repairs (1–2% — roofs, HVAC, plumbing, etc.), HOA fees (if applicable: $200–$800/month), opportunity cost of the down payment (that $70,000 invested in the S&P 500 at 10% would be worth $181,000 in 10 years), closing costs (2–5% of purchase price), and selling costs when you eventually move (5–6% agent commissions + transfer taxes). The New York Times Rent vs. Buy calculator considers over 20 variables — the simplified version here captures the most impactful ones."
      faqs={[
        { question: "How long do I need to own to break even?", answer: "Typically 5–7 years in most markets, accounting for closing costs (2–5% on purchase, 6–8% on sale), maintenance, and the opportunity cost of your down payment. In high-appreciation markets (Austin, Nashville), it can be 3–4 years. In flat or declining markets, 8–10+ years. The higher the mortgage rate, the longer the breakeven period." },
        { question: "What costs does this include for buying?", answer: "Monthly mortgage payment (principal + interest), estimated property taxes (1.2% of home value annually), homeowner's insurance (0.5%), and basic maintenance ($150/month). It does NOT include: HOA fees, PMI (if down payment < 20%), closing costs, selling commissions, or major renovations. Adding these would extend the breakeven point." },
        { question: "Should I rent and invest the difference?", answer: "If rent is significantly cheaper than ownership costs, investing the monthly savings plus the down payment in a diversified portfolio can outperform home ownership. Stocks have returned ~10% annually vs. ~3–4% for housing nationally. However, home ownership provides forced savings (building equity), leverage (5:1 with 20% down), and tax benefits (mortgage interest deduction, property tax deduction up to $10K). The optimal choice depends on local markets and personal discipline." },
        { question: "What appreciation rate should I use?", answer: "The national long-term average is approximately 3.5% annually (roughly tracking inflation). However, rates vary dramatically by market: fast-growing Sun Belt cities (Austin, Phoenix, Tampa) saw 5–15% annually in recent years, while some Midwest cities averaged 1–2%. Use your specific metro area's historical data for accuracy. Zillow and FHFA provide free local data." },
        { question: "How does the down payment size affect the decision?", answer: "A larger down payment reduces your loan (lower monthly payments and less interest), eliminates PMI (required below 20%), and gets you a better interest rate. However, it also means a larger opportunity cost — that cash can't be invested elsewhere. For pure financial optimization, some argue for the minimum down payment and investing the rest, but this increases risk and monthly cash flow pressure." },
        { question: "What about the tax benefits of owning?", answer: "Homeowners can deduct mortgage interest and property taxes (up to $10,000 combined state/local taxes). However, since the 2018 Tax Cuts and Jobs Act raised the standard deduction to $14,600 (single) / $29,200 (married), fewer homeowners benefit from itemizing. You only benefit if your total itemized deductions exceed the standard deduction. For many homeowners with mortgages under $400,000, the tax benefit is minimal or zero." },
      ]}
      relatedTools={[
        { title: "Mortgage Amortization Calculator", href: "/mortgage-amortization" },
        { title: "Cost of Living Calculator", href: "/cost-of-living" },
        { title: "Investment Goal Calculator", href: "/investment-goal" },
        { title: "Budget Planner", href: "/budget-planner" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <Label>Home Price ($)</Label>
            <Input type="number" value={homePrice} onChange={(e) => setHomePrice(+e.target.value)} min={0} />
            <p className="text-xs text-muted-foreground mt-1">Median US home: ~$420,000 (varies widely by market).</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Down Payment (%)</Label>
              <Input type="number" value={downPaymentPct} onChange={(e) => setDownPaymentPct(+e.target.value)} min={0} max={100} />
              <p className="text-xs text-muted-foreground mt-1">20% avoids PMI.</p>
            </div>
            <div>
              <Label>Mortgage Rate (%)</Label>
              <Input type="number" value={mortgageRate} onChange={(e) => setMortgageRate(+e.target.value)} min={0} step={0.1} />
              <p className="text-xs text-muted-foreground mt-1">Current 30-yr avg: ~7%.</p>
            </div>
          </div>
          <div>
            <Label>Monthly Rent ($)</Label>
            <Input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(+e.target.value)} min={0} />
            <p className="text-xs text-muted-foreground mt-1">Current monthly rent payment.</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Annual Rent Increase (%)</Label>
              <Input type="number" value={rentIncrease} onChange={(e) => setRentIncrease(+e.target.value)} min={0} step={0.5} />
              <p className="text-xs text-muted-foreground mt-1">Avg: 3–5%/year.</p>
            </div>
            <div>
              <Label>Home Appreciation (%)</Label>
              <Input type="number" value={appreciation} onChange={(e) => setAppreciation(+e.target.value)} min={0} step={0.5} />
              <p className="text-xs text-muted-foreground mt-1">National avg: ~3.5%.</p>
            </div>
          </div>
          <div>
            <Label>Time Horizon (Years)</Label>
            <Input type="number" value={years} onChange={(e) => setYears(+e.target.value)} min={1} max={30} />
            <p className="text-xs text-muted-foreground mt-1">How long you plan to stay. 5+ years favors buying.</p>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Monthly Mortgage</div><div className="text-lg font-bold text-foreground">${data.monthlyMortgage.toLocaleString()}</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Total Monthly Own</div><div className="text-lg font-bold text-primary">${data.monthlyOwnership.toLocaleString()}</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Down Payment</div><div className="text-lg font-bold text-foreground">${data.downPayment.toLocaleString()}</div></div>
          </div>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.points}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} label={{ value: "Years", position: "insideBottom", offset: -2 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Legend />
              <Line type="monotone" dataKey="rentTotal" stroke="hsl(var(--chart-1))" name="Rent (Cumulative)" strokeWidth={2} />
              <Line type="monotone" dataKey="buyTotal" stroke="hsl(var(--chart-2))" name="Buy (Net Cost)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ToolShell>
  );
}