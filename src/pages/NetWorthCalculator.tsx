import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import ToolShell from "@/components/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NetWorthCalculator() {
  const [cash, setCash] = useState(15000);
  const [investments, setInvestments] = useState(50000);
  const [retirement, setRetirement] = useState(80000);
  const [property, setProperty] = useState(250000);
  const [otherAssets, setOtherAssets] = useState(10000);
  const [mortgage, setMortgage] = useState(200000);
  const [studentLoans, setStudentLoans] = useState(25000);
  const [carLoan, setCarLoan] = useState(12000);
  const [creditCards, setCreditCards] = useState(3000);
  const [otherDebts, setOtherDebts] = useState(0);

  const result = useMemo(() => {
    const totalAssets = cash + investments + retirement + property + otherAssets;
    const totalLiabilities = mortgage + studentLoans + carLoan + creditCards + otherDebts;
    const netWorth = totalAssets - totalLiabilities;
    const chart = [
      { name: "Cash", assets: cash, liabilities: 0 },
      { name: "Investments", assets: investments, liabilities: 0 },
      { name: "Retirement", assets: retirement, liabilities: 0 },
      { name: "Property", assets: property, liabilities: mortgage },
      { name: "Other", assets: otherAssets, liabilities: studentLoans + carLoan + creditCards + otherDebts },
    ];
    return { totalAssets, totalLiabilities, netWorth, chart };
  }, [cash, investments, retirement, property, otherAssets, mortgage, studentLoans, carLoan, creditCards, otherDebts]);

  return (
    <ToolShell
      title="Net Worth Calculator"
      description="Calculate your net worth by totaling your assets and subtracting liabilities. Track your financial health over time."
      howToUse="Enter your assets (cash, investments, property) and liabilities (loans, credit cards). Your net worth is the difference. Update periodically to track progress."
      understandingTitle="Understanding Net Worth"
      understandingContent="Net worth is the single best measure of financial health. It's simply what you own minus what you owe. A positive and growing net worth means you're building wealth. Focus on increasing assets (saving, investing) and decreasing liabilities (paying off debt). The median net worth for US households is about $192,000."
      faqs={[
        { question: "Should I include my home?", answer: "Yes. Include the current market value as an asset and the remaining mortgage as a liability. The difference is your home equity." },
        { question: "How often should I calculate net worth?", answer: "Monthly or quarterly is ideal. It helps track progress and identify trends in your financial health." },
        { question: "What's a good net worth for my age?", answer: "A common benchmark: by 30, aim for 1× salary saved; by 40, 3× salary; by 50, 6× salary; by 60, 8× salary." },
      ]}
      relatedTools={[
        { title: "Budget Planner", href: "/budget-planner" },
        { title: "Investment Goal Calculator", href: "/investment-goal" },
        { title: "Retirement Calculator", href: "/retirement" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <h3 className="font-semibold text-foreground">Assets</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Cash & Savings</Label><Input type="number" value={cash} onChange={(e) => setCash(+e.target.value)} min={0} /></div>
            <div><Label className="text-xs">Investments</Label><Input type="number" value={investments} onChange={(e) => setInvestments(+e.target.value)} min={0} /></div>
            <div><Label className="text-xs">Retirement Accounts</Label><Input type="number" value={retirement} onChange={(e) => setRetirement(+e.target.value)} min={0} /></div>
            <div><Label className="text-xs">Property Value</Label><Input type="number" value={property} onChange={(e) => setProperty(+e.target.value)} min={0} /></div>
            <div><Label className="text-xs">Other Assets</Label><Input type="number" value={otherAssets} onChange={(e) => setOtherAssets(+e.target.value)} min={0} /></div>
          </div>
          <h3 className="font-semibold text-foreground pt-2">Liabilities</h3>
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Mortgage</Label><Input type="number" value={mortgage} onChange={(e) => setMortgage(+e.target.value)} min={0} /></div>
            <div><Label className="text-xs">Student Loans</Label><Input type="number" value={studentLoans} onChange={(e) => setStudentLoans(+e.target.value)} min={0} /></div>
            <div><Label className="text-xs">Car Loan</Label><Input type="number" value={carLoan} onChange={(e) => setCarLoan(+e.target.value)} min={0} /></div>
            <div><Label className="text-xs">Credit Cards</Label><Input type="number" value={creditCards} onChange={(e) => setCreditCards(+e.target.value)} min={0} /></div>
            <div><Label className="text-xs">Other Debts</Label><Input type="number" value={otherDebts} onChange={(e) => setOtherDebts(+e.target.value)} min={0} /></div>
          </div>
          <div className="grid grid-cols-3 gap-3 pt-4">
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Total Assets</div><div className="text-lg font-bold text-foreground">${result.totalAssets.toLocaleString()}</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Total Liabilities</div><div className="text-lg font-bold text-foreground">${result.totalLiabilities.toLocaleString()}</div></div>
            <div className={`rounded-lg p-4 ${result.netWorth >= 0 ? "bg-primary/10" : "bg-destructive/10"}`}><div className="text-xs text-muted-foreground">Net Worth</div><div className={`text-lg font-bold ${result.netWorth >= 0 ? "text-primary" : "text-destructive"}`}>${result.netWorth.toLocaleString()}</div></div>
          </div>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={result.chart}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Bar dataKey="assets" fill="hsl(var(--chart-2))" name="Assets" />
              <Bar dataKey="liabilities" fill="hsl(var(--chart-1))" name="Liabilities" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ToolShell>
  );
}
