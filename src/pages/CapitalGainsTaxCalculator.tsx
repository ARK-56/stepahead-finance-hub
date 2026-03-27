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
      // Short-term = ordinary income rates (simplified)
      if (taxableIncome + gain > 243725) taxRate = 32;
      else if (taxableIncome + gain > 191950) taxRate = 24;
      else if (taxableIncome + gain > 100525) taxRate = 22;
      else if (taxableIncome + gain > 47150) taxRate = 12;
      else taxRate = 10;
    } else {
      // Long-term capital gains rates 2024
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
      description="Estimate federal capital gains tax on stocks, real estate, or other investments. Compare short-term vs. long-term rates."
      howToUse="Enter your purchase price, sale price, holding period, taxable income, and filing status. The calculator estimates your capital gains tax and net proceeds."
      understandingTitle="Understanding Capital Gains Tax"
      understandingContent="Capital gains are profits from selling assets. Short-term gains (held < 1 year) are taxed as ordinary income (10-37%). Long-term gains (held 1+ years) get preferential rates of 0%, 15%, or 20%, depending on income. The NIIT (3.8% surtax) may apply to high earners. Strategic timing of sales can significantly impact your tax bill."
      faqs={[
        { question: "What qualifies as long-term?", answer: "Assets held for more than one year qualify for long-term capital gains rates, which are significantly lower than short-term rates." },
        { question: "Can I offset gains with losses?", answer: "Yes. Capital losses offset capital gains dollar-for-dollar. You can also deduct up to $3,000 of net losses against ordinary income annually." },
        { question: "Does this include state capital gains tax?", answer: "No. Many states tax capital gains as ordinary income. Check your state's specific rules." },
      ]}
      relatedTools={[
        { title: "Stock Return Calculator", href: "/stock-return" },
        { title: "Tax Bracket Calculator", href: "/tax-bracket" },
        { title: "Freelance Tax Estimator", href: "/tax-estimator" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3">
            <div><Label>Purchase Price ($)</Label><Input type="number" value={purchasePrice} onChange={(e) => setPurchasePrice(+e.target.value)} min={0} /></div>
            <div><Label>Sale Price ($)</Label><Input type="number" value={salePrice} onChange={(e) => setSalePrice(+e.target.value)} min={0} /></div>
          </div>
          <div>
            <Label>Holding Period</Label>
            <Select value={holdingPeriod} onValueChange={(v) => setHoldingPeriod(v as "short" | "long")}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short-Term (&lt; 1 year)</SelectItem>
                <SelectItem value="long">Long-Term (1+ years)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div><Label>Taxable Income ($)</Label><Input type="number" value={taxableIncome} onChange={(e) => setTaxableIncome(+e.target.value)} min={0} /></div>
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
