import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import ToolShell from "@/components/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function StockReturnCalculator() {
  const [buyPrice, setBuyPrice] = useState(100);
  const [sellPrice, setSellPrice] = useState(150);
  const [shares, setShares] = useState(50);
  const [dividends, setDividends] = useState(200);
  const [years, setYears] = useState(3);

  const result = useMemo(() => {
    const invested = buyPrice * shares;
    const saleValue = sellPrice * shares;
    const capitalGain = saleValue - invested;
    const totalReturn = capitalGain + dividends;
    const totalReturnPct = invested > 0 ? (totalReturn / invested) * 100 : 0;
    const annualized = invested > 0 && years > 0 ? (Math.pow((saleValue + dividends) / invested, 1 / years) - 1) * 100 : 0;

    const chart = [
      { name: "Invested", value: Math.round(invested) },
      { name: "Capital Gain", value: Math.round(capitalGain) },
      { name: "Dividends", value: Math.round(dividends) },
      { name: "Total Value", value: Math.round(saleValue + dividends) },
    ];

    return { invested, capitalGain, totalReturn, totalReturnPct, annualized, chart };
  }, [buyPrice, sellPrice, shares, dividends, years]);

  return (
    <ToolShell
      title="Stock Return Calculator"
      description="Calculate your total return, capital gains, and annualized performance on any stock investment."
      howToUse="Enter the price you bought at, the current or sale price, number of shares, any dividends received, and the holding period. Instantly see your total return percentage and annualized return."
      understandingTitle="Understanding Stock Returns"
      understandingContent="Total stock return includes both capital appreciation (price increase) and dividends. Annualized return normalizes gains over time, making it easy to compare investments held for different periods. A stock that doubles in 5 years has an annualized return of about 14.9%, not 100%."
      faqs={[
        { question: "What is annualized return?", answer: "It's the geometric average return per year. It accounts for compounding and lets you compare investments held for different lengths of time." },
        { question: "Should I include dividends?", answer: "Yes! Dividends can represent a significant portion of total return, especially for dividend stocks. Historically, dividends have contributed about 40% of the S&P 500's total return." },
        { question: "Does this account for taxes?", answer: "No. Capital gains and dividends are taxed differently. Use our Capital Gains Tax Calculator for tax impact estimates." },
      ]}
      relatedTools={[
        { title: "Capital Gains Tax Calculator", href: "/capital-gains-tax" },
        { title: "DRIP Calculator", href: "/drip-calculator" },
        { title: "Compound Interest Calculator", href: "/compound-interest" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Buy Price ($)</Label><Input type="number" value={buyPrice} onChange={(e) => setBuyPrice(+e.target.value)} min={0} step={0.01} /></div>
            <div><Label>Sell Price ($)</Label><Input type="number" value={sellPrice} onChange={(e) => setSellPrice(+e.target.value)} min={0} step={0.01} /></div>
          </div>
          <div><Label>Number of Shares</Label><Input type="number" value={shares} onChange={(e) => setShares(+e.target.value)} min={0} /></div>
          <div><Label>Total Dividends Received ($)</Label><Input type="number" value={dividends} onChange={(e) => setDividends(+e.target.value)} min={0} /></div>
          <div><Label>Holding Period (Years)</Label><Input type="number" value={years} onChange={(e) => setYears(+e.target.value)} min={1} max={50} /></div>
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Total Return</div><div className="text-lg font-bold text-primary">{result.totalReturnPct.toFixed(1)}%</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Annualized Return</div><div className="text-lg font-bold text-foreground">{result.annualized.toFixed(1)}%</div></div>
          </div>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={result.chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Bar dataKey="value" fill="hsl(var(--chart-1))" name="Amount" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ToolShell>
  );
}
