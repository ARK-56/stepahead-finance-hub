import { useState, useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import ToolShell from "@/components/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DripCalculator() {
  const [initialShares, setInitialShares] = useState(100);
  const [sharePrice, setSharePrice] = useState(50);
  const [dividendYield, setDividendYield] = useState(3);
  const [priceGrowth, setPriceGrowth] = useState(5);
  const [years, setYears] = useState(20);

  const data = useMemo(() => {
    let shares = initialShares;
    let price = sharePrice;
    const points: { year: number; withDrip: number; withoutDrip: number }[] = [];
    let totalDividendsWithout = 0;

    for (let y = 0; y <= years; y++) {
      const withDripValue = shares * price;
      const withoutDripValue = initialShares * price + totalDividendsWithout;
      points.push({ year: y, withDrip: Math.round(withDripValue), withoutDrip: Math.round(withoutDripValue) });

      const annualDividend = shares * price * (dividendYield / 100);
      const newShares = annualDividend / price;
      shares += newShares;

      totalDividendsWithout += initialShares * price * (dividendYield / 100);
      price *= 1 + priceGrowth / 100;
    }

    const finalWithDrip = Math.round(shares * price);
    const finalWithout = Math.round(initialShares * price + totalDividendsWithout);
    return { points, finalWithDrip, finalWithout, finalShares: Math.round(shares * 100) / 100, dripAdvantage: finalWithDrip - finalWithout };
  }, [initialShares, sharePrice, dividendYield, priceGrowth, years]);

  return (
    <ToolShell
      title="DRIP Calculator"
      description="See how dividend reinvestment (DRIP) accelerates your portfolio growth compared to taking dividends as cash."
      howToUse="Enter your starting shares, current share price, dividend yield, expected price growth, and time horizon. Compare portfolio values with and without dividend reinvestment."
      understandingTitle="Understanding Dividend Reinvestment"
      understandingContent="DRIP (Dividend Reinvestment Plan) automatically uses dividend payments to purchase additional shares. This creates a compounding effect: more shares generate more dividends, which buy more shares. Over long periods, DRIP can significantly outperform taking dividends as cash, especially for high-yield stocks with steady price growth."
      faqs={[
        { question: "Is DRIP always better?", answer: "Usually for long-term investors, yes. However, if you need income now or the stock is overvalued, taking cash dividends may be preferable." },
        { question: "Do DRIP dividends get taxed?", answer: "Yes. Even reinvested dividends are taxable income in the year received. The reinvestment doesn't defer taxes." },
        { question: "Can I DRIP in a retirement account?", answer: "Yes, and it's especially advantageous because dividends in IRAs/401(k)s grow tax-deferred (or tax-free in Roth accounts)." },
      ]}
      relatedTools={[
        { title: "Stock Return Calculator", href: "/stock-return" },
        { title: "Compound Interest Calculator", href: "/compound-interest" },
        { title: "Investment Goal Calculator", href: "/investment-goal" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Initial Shares</Label><Input type="number" value={initialShares} onChange={(e) => setInitialShares(+e.target.value)} min={1} /></div>
            <div><Label>Share Price ($)</Label><Input type="number" value={sharePrice} onChange={(e) => setSharePrice(+e.target.value)} min={0.01} step={0.01} /></div>
          </div>
          <div><Label>Dividend Yield (%)</Label><Input type="number" value={dividendYield} onChange={(e) => setDividendYield(+e.target.value)} min={0} step={0.1} /></div>
          <div><Label>Annual Price Growth (%)</Label><Input type="number" value={priceGrowth} onChange={(e) => setPriceGrowth(+e.target.value)} min={0} step={0.1} /></div>
          <div><Label>Years</Label><Input type="number" value={years} onChange={(e) => setYears(+e.target.value)} min={1} max={50} /></div>
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">With DRIP</div><div className="text-lg font-bold text-primary">${data.finalWithDrip.toLocaleString()}</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Without DRIP</div><div className="text-lg font-bold text-foreground">${data.finalWithout.toLocaleString()}</div></div>
          </div>
          <div className="rounded-lg bg-primary/10 p-3 text-center"><span className="text-sm font-medium text-primary">DRIP Advantage: +${data.dripAdvantage.toLocaleString()}</span></div>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data.points}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Legend />
              <Area type="monotone" dataKey="withDrip" fill="hsl(var(--chart-1))" stroke="hsl(var(--chart-1))" name="With DRIP" />
              <Area type="monotone" dataKey="withoutDrip" fill="hsl(var(--chart-2))" stroke="hsl(var(--chart-2))" name="Without DRIP" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ToolShell>
  );
}
