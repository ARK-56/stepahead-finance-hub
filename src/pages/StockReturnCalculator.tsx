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
      description="Calculate your total return, capital gains, dividend income, and annualized performance on any stock investment. Compare what you invested to what you received — including both price appreciation and dividends — for a true picture of your investment performance."
      howToUse="Enter the price you bought at ('Buy Price'), the current or sale price ('Sell Price'), and the number of shares you own. Add the total dividends received over the holding period (check your brokerage's dividend history). Enter the number of years you held the stock. The calculator instantly displays your total return percentage, annualized return (CAGR), and a bar chart comparing your initial investment, capital gains, dividends, and total ending value."
      understandingTitle="Understanding Stock Returns"
      understandingContent="Total stock return includes two components: capital appreciation (the increase in share price) and dividend income. Many investors focus only on price changes, but dividends have historically contributed about 40% of the S&P 500's total return since 1930. Ignoring dividends dramatically understates true investment performance. Annualized return (also called CAGR — Compound Annual Growth Rate) normalizes your total return over time, making it possible to compare investments held for different periods on an equal basis. A stock that doubles in 5 years has a CAGR of about 14.9%, not 100% divided by 5 (which would incorrectly give 20%). The formula accounts for compounding: CAGR = (Ending Value / Beginning Value)^(1/years) - 1. This is the single most useful metric for evaluating investment performance. For context, the S&P 500's long-term CAGR is approximately 10% (7% after inflation). If your annualized return consistently exceeds 10%, you're outperforming the broad market. Remember that past performance doesn't guarantee future results, and individual stock returns can vary wildly from market averages."
      faqs={[
        { question: "What is annualized return (CAGR)?", answer: "CAGR is the geometric average annual return, accounting for compounding. It answers: 'What fixed annual rate would have produced the same total return?' This lets you compare a stock you held for 2 years (60% total return = 26.5% CAGR) with one held for 10 years (150% total return = 9.6% CAGR). The 2-year stock performed better on an annual basis despite the lower total return." },
        { question: "Should I include dividends in my return?", answer: "Absolutely. Dividends are real money you received. From 1930–2023, dividends contributed roughly 40% of the S&P 500's total return. Dividend aristocrats (companies that have raised dividends for 25+ years) like Johnson & Johnson, Coca-Cola, and Procter & Gamble provide reliable income that significantly boosts total return over time." },
        { question: "Does this account for taxes?", answer: "No. Capital gains and dividends are taxed at different rates. Long-term capital gains (held 1+ years): 0%, 15%, or 20% depending on income. Short-term gains (< 1 year): taxed as ordinary income (10–37%). Qualified dividends get the same preferential rates as long-term gains. Use our Capital Gains Tax Calculator for a tax impact estimate." },
        { question: "How does my return compare to the market?", answer: "The S&P 500 has returned about 10% annually since 1926 (including dividends). If your annualized return consistently exceeds 10%, you're beating the market. However, studies show that over 15-year periods, about 90% of actively managed funds underperform the S&P 500 index. Consider whether stock picking is adding value over a low-cost index fund." },
        { question: "What about fees and commissions?", answer: "For accuracy, subtract any trading commissions from your sale proceeds and add them to your purchase cost. Many brokerages now offer commission-free trading, but mutual fund expense ratios (0.03% for index funds to 1.5%+ for actively managed funds) significantly impact long-term returns. A 1% annual fee can reduce your 30-year return by 25%+." },
        { question: "What's the difference between total return and price return?", answer: "Price return only measures the change in share price. Total return includes price change plus dividends (and other distributions). Financial media often quotes price returns (e.g., 'the S&P 500 returned 8%'), but total return — which includes the ~2% annual dividend — is what actually went into your pocket." },
      ]}
      relatedTools={[
        { title: "Capital Gains Tax Calculator", href: "/capital-gains-tax" },
        { title: "DRIP Calculator", href: "/drip-calculator" },
        { title: "Compound Interest Calculator", href: "/compound-interest" },
        { title: "Investment Goal Calculator", href: "/investment-goal" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Buy Price ($)</Label>
              <Input type="number" value={buyPrice} onChange={(e) => setBuyPrice(+e.target.value)} min={0} step={0.01} />
              <p className="text-xs text-muted-foreground mt-1">Price per share when purchased.</p>
            </div>
            <div>
              <Label>Sell Price ($)</Label>
              <Input type="number" value={sellPrice} onChange={(e) => setSellPrice(+e.target.value)} min={0} step={0.01} />
              <p className="text-xs text-muted-foreground mt-1">Current or sale price per share.</p>
            </div>
          </div>
          <div>
            <Label>Number of Shares</Label>
            <Input type="number" value={shares} onChange={(e) => setShares(+e.target.value)} min={0} />
            <p className="text-xs text-muted-foreground mt-1">Total shares purchased (fractional shares OK).</p>
          </div>
          <div>
            <Label>Total Dividends Received ($)</Label>
            <Input type="number" value={dividends} onChange={(e) => setDividends(+e.target.value)} min={0} />
            <p className="text-xs text-muted-foreground mt-1">Sum of all dividends over the holding period.</p>
          </div>
          <div>
            <Label>Holding Period (Years)</Label>
            <Input type="number" value={years} onChange={(e) => setYears(+e.target.value)} min={1} max={50} />
            <p className="text-xs text-muted-foreground mt-1">Needed to calculate annualized (CAGR) return.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="result-card-highlight"><div className="text-xs text-muted-foreground">Total Return</div><div className="text-lg font-bold text-primary">{result.totalReturnPct.toFixed(1)}%</div></div>
            <div className="result-card"><div className="text-xs text-muted-foreground">Annualized (CAGR)</div><div className="text-lg font-bold text-foreground">{result.annualized.toFixed(1)}%</div></div>
            <div className="result-card"><div className="text-xs text-muted-foreground">Capital Gain</div><div className="text-lg font-bold text-foreground">${result.capitalGain.toLocaleString()}</div></div>
            <div className="result-card"><div className="text-xs text-muted-foreground">Total Invested</div><div className="text-lg font-bold text-foreground">${result.invested.toLocaleString()}</div></div>
          </div>
        </div>
        <div className="chart-container h-[350px]">
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