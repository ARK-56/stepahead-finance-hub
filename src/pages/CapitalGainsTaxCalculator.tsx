import { useState, useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import ToolShell from "@/components/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];

export default function CapitalGainsTaxCalculator() {
  const [purchasePrice, setPurchasePrice] = useState(10000);
  const [salePrice, setSalePrice] = useState(18000);
  const [holdingPeriod, setHoldingPeriod] = useState<"short" | "long">("long");
  const [taxableIncome, setTaxableIncome] = useState(75000);
  const [filing, setFiling] = useState<"single" | "married">("single");

  const result = useMemo(() => {
    const gain = salePrice - purchasePrice;
    if (gain <= 0) return { gain, taxRate: 0, tax: 0, netProceeds: salePrice, chart: [] };

    let taxRate: number;
    if (holdingPeriod === "short") {
      if (taxableIncome + gain > 243725) taxRate = 32;
      else if (taxableIncome + gain > 191950) taxRate = 24;
      else if (taxableIncome + gain > 100525) taxRate = 22;
      else if (taxableIncome + gain > 47150) taxRate = 12;
      else taxRate = 10;
    } else {
      const totalIncome = taxableIncome + gain;
      if (filing === "single") {
        if (totalIncome > 518900) taxRate = 20;
        else if (totalIncome > 47025) taxRate = 15;
        else taxRate = 0;
      } else {
        if (totalIncome > 583750) taxRate = 20;
        else if (totalIncome > 94050) taxRate = 15;
        else taxRate = 0;
      }
    }

    const tax = Math.round(gain * (taxRate / 100));
    const netProceeds = salePrice - tax;
    const chart = [
      { name: "Net Profit", value: gain - tax },
      { name: "Tax Owed", value: tax },
      { name: "Original Cost", value: purchasePrice },
    ];

    return { gain, taxRate, tax, netProceeds, chart };
  }, [purchasePrice, salePrice, holdingPeriod, taxableIncome, filing]);

  return (
    <ToolShell
      title="Capital Gains Tax Calculator"
      description="Estimate your federal capital gains tax on stocks, real estate, crypto, or other investments. Compare the tax impact of short-term vs. long-term holding periods and see how your income level affects the rate you'll pay."
      howToUse="Enter your original purchase price (cost basis) and the sale price. Select whether you held the asset for less than one year (short-term) or one year or more (long-term) — this dramatically affects your tax rate. Add your other taxable income for the year and filing status, as these determine which capital gains bracket you fall into. The calculator shows your capital gain, applicable tax rate, estimated tax owed, and net proceeds after tax. The pie chart visualizes the breakdown between your original cost, net profit, and tax."
      understandingTitle="Understanding Capital Gains Tax"
      understandingContent="Capital gains tax applies to profit from selling assets — stocks, bonds, real estate, crypto, art, and other investments. The tax rate depends primarily on how long you held the asset. Short-term gains (held less than one year) are taxed as ordinary income at your marginal rate (10–37% in 2024). Long-term gains (held one year or more) receive preferential rates: 0% for low-income filers (taxable income up to $47,025 single / $94,050 married), 15% for most filers (the majority of Americans), or 20% for high-income filers ($518,900+ single / $583,750+ married). Additionally, high earners may owe the Net Investment Income Tax (NIIT) of 3.8% on top of capital gains, bringing the effective top rate to 23.8%. This rate difference is one of the most significant tax incentives in the US tax code and is a primary reason buy-and-hold investing is tax-efficient. Strategic tax planning — including tax-loss harvesting (selling losing investments to offset gains), timing sales across tax years, and using tax-advantaged accounts — can save thousands annually. For real estate, the primary residence exclusion allows $250,000 ($500,000 married) in gains tax-free if you've lived in the home 2 of the last 5 years."
      faqs={[
        { question: "What qualifies as long-term?", answer: "Assets held for more than one year (at least one year and one day) qualify for long-term capital gains rates. The holding period starts the day after purchase and includes the day of sale. For assets received as gifts, you inherit the donor's holding period. For inherited assets, the holding period is automatically considered long-term regardless of when the deceased acquired it." },
        { question: "Can I offset gains with losses?", answer: "Yes — this is called tax-loss harvesting. Capital losses offset capital gains dollar-for-dollar: short-term losses first offset short-term gains, then long-term gains. After offsetting all gains, you can deduct up to $3,000 of net losses against ordinary income each year. Remaining losses carry forward indefinitely to future tax years." },
        { question: "Does this include state capital gains tax?", answer: "No. Most states tax capital gains as ordinary income. Some exceptions: 9 states have no income tax, so no state capital gains tax. California taxes capital gains at up to 13.3% — on a $100,000 gain, that's $13,300 in state tax alone, on top of federal. A few states (like New Hampshire) only tax dividend/interest income, not capital gains." },
        { question: "How are crypto gains taxed?", answer: "Cryptocurrency is treated as property by the IRS. Short-term crypto gains (held < 1 year) are taxed as ordinary income. Long-term crypto gains get the preferential rates. Every trade — including crypto-to-crypto swaps — is a taxable event. Mining and staking rewards are taxed as ordinary income when received." },
        { question: "What is the primary residence exclusion?", answer: "If you sell your primary home and you've lived in it for at least 2 of the last 5 years, you can exclude up to $250,000 in gains ($500,000 if married filing jointly) from capital gains tax. This is one of the most valuable tax benefits in the US tax code. It can be used repeatedly (once every 2 years)." },
        { question: "What is the 'step-up in basis' for inherited assets?", answer: "When you inherit an asset, your cost basis 'steps up' to the fair market value on the date of the decedent's death. This means all unrealized gains that accumulated during the deceased person's lifetime are never taxed. For example, if a parent bought stock for $10,000 that's worth $100,000 at death, the heir's basis is $100,000 — the $90,000 gain is eliminated for tax purposes." },
      ]}
      relatedTools={[
        { title: "Stock Return Calculator", href: "/stock-return" },
        { title: "Tax Bracket Calculator", href: "/tax-bracket" },
        { title: "Freelance Tax Estimator", href: "/tax-estimator" },
        { title: "DRIP Calculator", href: "/drip-calculator" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Purchase Price ($)</Label>
              <Input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(+e.target.value)} min={0} />
              <p className="text-xs text-muted-foreground mt-1">Your original cost basis.</p>
            </div>
            <div>
              <Label>Sale Price ($)</Label>
              <Input type="number" value={salePrice} onChange={(e) => setSalePrice(+e.target.value)} min={0} />
              <p className="text-xs text-muted-foreground mt-1">Actual or expected sale price.</p>
            </div>
          </div>
          <div>
            <Label>Holding Period</Label>
            <Select value={holdingPeriod} onValueChange={(v) => setHoldingPeriod(v as "short" | "long")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short-Term (&lt; 1 year) — taxed as ordinary income</SelectItem>
                <SelectItem value="long">Long-Term (1+ years) — preferential rates</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Other Taxable Income ($)</Label>
            <Input type="number" value={taxableIncome} onChange={(e) => setTaxableIncome(+e.target.value)} min={0} />
            <p className="text-xs text-muted-foreground mt-1">Your income excluding this capital gain.</p>
          </div>
          <div>
            <Label>Filing Status</Label>
            <Select value={filing} onValueChange={(v) => setFiling(v as "single" | "married")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="single">Single</SelectItem>
                <SelectItem value="married">Married Filing Jointly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Capital Gain</div><div className="text-lg font-bold text-foreground">${result.gain.toLocaleString()}</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Tax Rate</div><div className="text-lg font-bold text-primary">{result.taxRate}%</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Tax Owed</div><div className="text-lg font-bold text-foreground">${result.tax.toLocaleString()}</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Net Proceeds</div><div className="text-lg font-bold text-foreground">${result.netProceeds.toLocaleString()}</div></div>
          </div>
        </div>
        <div className="h-[350px]">
          {result.chart.length > 0 && (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={result.chart} cx="50%" cy="50%" outerRadius={120} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {result.chart.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </ToolShell>
  );
}