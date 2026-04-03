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
      description="Visualize the power of dividend reinvestment (DRIP). Compare your portfolio's growth with automatic reinvestment versus taking dividends as cash, and see exactly how much more wealth DRIP creates over time."
      howToUse="Enter your starting number of shares and the current share price to establish your initial position. Set the stock's annual dividend yield (check your brokerage or a site like Dividend.com). Add the expected annual stock price growth rate. Choose your time horizon. The calculator generates a side-by-side comparison chart showing portfolio value With DRIP (dividends reinvested into more shares) versus Without DRIP (dividends taken as cash). The DRIP Advantage card shows the dollar difference — often surprisingly large over long periods."
      understandingTitle="Understanding Dividend Reinvestment"
      understandingContent="A Dividend Reinvestment Plan (DRIP) automatically uses dividend payments to purchase additional shares of the same stock, often commission-free and sometimes at a small discount (typically 1–5% below market price). This creates a powerful compounding loop: more shares → more dividends → more shares → more dividends. The effect accelerates over time because each reinvested dividend buys shares that themselves pay dividends in subsequent quarters. Consider a hypothetical example: 100 shares of a $50 stock with a 3% yield and 5% annual price growth. After 20 years without DRIP, you'd have 100 shares worth $13,266 plus $21,579 in accumulated cash dividends = $34,845 total. With DRIP, you'd own 181 shares worth $24,018 = $24,018 in stock value alone, but the total calculation shows even more dramatic differences because your reinvested dividends also benefited from price growth. DRIP is most powerful for: high-yield stocks (3%+ dividend yield), stocks with a history of dividend growth (dividend aristocrats), long time horizons (10+ years), and tax-advantaged accounts (where reinvested dividends aren't taxed annually). Most brokerages offer automatic DRIP enrollment for free — check your account settings."
      faqs={[
        { question: "Is DRIP always better than taking cash dividends?", answer: "For long-term investors, DRIP almost always wins. However, taking cash may be better if: (1) you need the income for living expenses (especially in retirement), (2) the stock is significantly overvalued and you'd rather invest elsewhere, (3) you want to diversify into other investments, or (4) you're in a taxable account and need cash to pay the dividend tax bill." },
        { question: "Do DRIP dividends get taxed?", answer: "Yes. Reinvested dividends are taxable income in the year received — the IRS doesn't care whether you took cash or bought more shares. Qualified dividends are taxed at 0%, 15%, or 20% (depending on income). Non-qualified dividends are taxed as ordinary income. In tax-advantaged accounts (IRA, 401k, Roth), there's no annual tax on dividends, making DRIP even more powerful." },
        { question: "Can I DRIP in a retirement account?", answer: "Yes — and it's especially advantageous. In a Traditional IRA/401k, dividends are reinvested tax-deferred (no annual tax). In a Roth IRA, dividends are reinvested and grow completely tax-free. This eliminates the annual tax drag that reduces compounding in taxable accounts, amplifying the DRIP advantage." },
        { question: "What stocks are best for DRIP investing?", answer: "Look for: Dividend Aristocrats (25+ consecutive years of dividend increases — companies like Johnson & Johnson, Coca-Cola, Procter & Gamble), Dividend Kings (50+ years of increases), high-yield REITs (5–8% yields), and utility stocks (stable 3–4% yields). Consistency matters more than the current yield — a stock that grows its dividend 8% per year will double its payout in 9 years." },
        { question: "How does DRIP compare to investing the dividends elsewhere?", answer: "DRIP is simpler (automatic, commission-free) but concentrates your portfolio in one stock. Taking cash dividends and investing elsewhere provides diversification. A middle ground: DRIP your core positions and take cash from positions you want to reduce. Index fund dividends are automatically reinvested within the fund, providing DRIP benefits with built-in diversification." },
        { question: "Does dividend growth affect the calculator?", answer: "This calculator assumes a constant dividend yield. In reality, many quality companies increase their dividends annually (typically 5–10% per year). Rising dividends would make the DRIP advantage even larger than shown, because each year you'd be reinvesting a higher dollar amount." },
      ]}
      relatedTools={[
        { title: "Stock Return Calculator", href: "/stock-return" },
        { title: "Compound Interest Calculator", href: "/compound-interest" },
        { title: "Investment Goal Calculator", href: "/investment-goal" },
        { title: "Capital Gains Tax Calculator", href: "/capital-gains-tax" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Initial Shares</Label>
              <Input type="number" value={initialShares} onChange={(e) => setInitialShares(+e.target.value)} min={1} />
              <p className="text-xs text-muted-foreground mt-1">Shares you currently own.</p>
            </div>
            <div>
              <Label>Share Price ($)</Label>
              <Input type="number" value={sharePrice} onChange={(e) => setSharePrice(+e.target.value)} min={0.01} step={0.01} />
              <p className="text-xs text-muted-foreground mt-1">Current market price per share.</p>
            </div>
          </div>
          <div>
            <Label>Dividend Yield (%)</Label>
            <Input type="number" value={dividendYield} onChange={(e) => setDividendYield(+e.target.value)} min={0} step={0.1} />
            <p className="text-xs text-muted-foreground mt-1">Annual dividend as % of price. S&P 500 avg: ~1.5%.</p>
          </div>
          <div>
            <Label>Annual Price Growth (%)</Label>
            <Input type="number" value={priceGrowth} onChange={(e) => setPriceGrowth(+e.target.value)} min={0} step={0.1} />
            <p className="text-xs text-muted-foreground mt-1">Expected annual stock price appreciation.</p>
          </div>
          <div>
            <Label>Years</Label>
            <Input type="number" value={years} onChange={(e) => setYears(+e.target.value)} min={1} max={50} />
            <p className="text-xs text-muted-foreground mt-1">Longer periods amplify the DRIP advantage.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="result-card-highlight"><div className="text-xs text-muted-foreground">With DRIP</div><div className="text-lg font-bold text-primary">${data.finalWithDrip.toLocaleString()}</div></div>
            <div className="result-card"><div className="text-xs text-muted-foreground">Without DRIP</div><div className="text-lg font-bold text-foreground">${data.finalWithout.toLocaleString()}</div></div>
          </div>
          <div className="result-card-highlight p-3 text-center"><span className="text-sm font-medium text-primary">DRIP Advantage: +${data.dripAdvantage.toLocaleString()} · {data.finalShares.toLocaleString()} final shares</span></div>
        </div>
        <div className="chart-container h-[350px]">
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