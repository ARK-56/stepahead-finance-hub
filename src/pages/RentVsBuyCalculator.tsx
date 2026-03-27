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
    const monthlyOwnership = monthlyMortgage + (homePrice * 0.012) / 12 + (homePrice * 0.005) / 12 + 150; // mortgage + tax + insurance + maintenance

    let totalRentCost = 0;
    let totalBuyCost = downPayment;
    let rent = monthlyRent;
    const points: { year: number; rentTotal: number; buyTotal: number }[] = [];

    for (let y = 0; y <= years; y++) {
      const homeValue = homePrice * Math.pow(1 + appreciation / 100, y);
      const equity = homeValue - loanAmount * (1 - y / 30); // simplified equity
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
      description="Compare the true cost of renting vs. buying a home over time, including equity, appreciation, and all ownership costs."
      howToUse="Enter the home price, down payment, mortgage rate, monthly rent, and expected rent/price increases. The chart compares cumulative costs of renting vs. buying over your chosen time horizon."
      understandingTitle="Understanding Rent vs. Buy"
      understandingContent="Buying isn't always better than renting. The breakeven point depends on home prices, rent, mortgage rates, how long you stay, and local appreciation. Generally, buying makes more sense if you stay 5+ years. Factor in property taxes (~1-2%), insurance (~0.5%), maintenance (~1%), and opportunity cost of your down payment."
      faqs={[
        { question: "How long do I need to own to break even?", answer: "Typically 5-7 years, depending on closing costs (2-5% of price), appreciation rate, and mortgage rate. In high-appreciation markets, it can be sooner." },
        { question: "What costs does this include for buying?", answer: "Mortgage payment, property taxes (1.2%), insurance (0.5%), and basic maintenance. It doesn't include HOA fees, renovations, or closing costs." },
        { question: "Should I rent and invest the difference?", answer: "If rent is significantly cheaper, investing the savings (down payment + monthly difference) in the stock market can sometimes outperform home ownership, especially in low-appreciation areas." },
      ]}
      relatedTools={[
        { title: "Mortgage Amortization Calculator", href: "/mortgage-amortization" },
        { title: "Cost of Living Calculator", href: "/cost-of-living" },
        { title: "Investment Goal Calculator", href: "/investment-goal" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div><Label>Home Price ($)</Label><Input type="number" value={homePrice} onChange={(e) => setHomePrice(+e.target.value)} min={0} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Down Payment (%)</Label><Input type="number" value={downPaymentPct} onChange={(e) => setDownPaymentPct(+e.target.value)} min={0} max={100} /></div>
            <div><Label>Mortgage Rate (%)</Label><Input type="number" value={mortgageRate} onChange={(e) => setMortgageRate(+e.target.value)} min={0} step={0.1} /></div>
          </div>
          <div><Label>Monthly Rent ($)</Label><Input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(+e.target.value)} min={0} /></div>
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Annual Rent Increase (%)</Label><Input type="number" value={rentIncrease} onChange={(e) => setRentIncrease(+e.target.value)} min={0} step={0.5} /></div>
            <div><Label>Home Appreciation (%)</Label><Input type="number" value={appreciation} onChange={(e) => setAppreciation(+e.target.value)} min={0} step={0.5} /></div>
          </div>
          <div><Label>Time Horizon (Years)</Label><Input type="number" value={years} onChange={(e) => setYears(+e.target.value)} min={1} max={30} /></div>
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
