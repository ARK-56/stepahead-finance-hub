import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import ToolShell from "@/components/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const cityIndex: Record<string, number> = {
  "New York, NY": 187,
  "San Francisco, CA": 179,
  "Los Angeles, CA": 166,
  "Boston, MA": 152,
  "Seattle, WA": 149,
  "Washington, DC": 145,
  "Miami, FL": 133,
  "Denver, CO": 128,
  "Chicago, IL": 117,
  "Austin, TX": 114,
  "Portland, OR": 113,
  "Atlanta, GA": 107,
  "Phoenix, AZ": 103,
  "Dallas, TX": 102,
  "Nashville, TN": 101,
  "National Average": 100,
  "Charlotte, NC": 97,
  "Columbus, OH": 93,
  "Indianapolis, IN": 90,
  "Kansas City, MO": 88,
  "Memphis, TN": 84,
};

const cities = Object.keys(cityIndex);

export default function CostOfLivingCalculator() {
  const [salary, setSalary] = useState(80000);
  const [fromCity, setFromCity] = useState("National Average");
  const [toCity, setToCity] = useState("New York, NY");

  const result = useMemo(() => {
    const fromIdx = cityIndex[fromCity];
    const toIdx = cityIndex[toCity];
    const equivalentSalary = Math.round((salary * toIdx) / fromIdx);
    const difference = equivalentSalary - salary;
    const pctChange = ((toIdx - fromIdx) / fromIdx) * 100;

    const categories = [
      { name: "Housing", from: Math.round(salary * 0.30 * (fromIdx / 100)), to: Math.round(salary * 0.30 * (toIdx / 100)) },
      { name: "Food", from: Math.round(salary * 0.12 * (fromIdx / 100)), to: Math.round(salary * 0.12 * (toIdx / 100)) },
      { name: "Transport", from: Math.round(salary * 0.15 * (fromIdx / 100)), to: Math.round(salary * 0.15 * (toIdx / 100)) },
      { name: "Healthcare", from: Math.round(salary * 0.08 * (fromIdx / 100)), to: Math.round(salary * 0.08 * (toIdx / 100)) },
      { name: "Other", from: Math.round(salary * 0.10 * (fromIdx / 100)), to: Math.round(salary * 0.10 * (toIdx / 100)) },
    ];

    return { equivalentSalary, difference, pctChange, categories };
  }, [salary, fromCity, toCity]);

  return (
    <ToolShell
      title="Cost of Living Calculator"
      description="Compare the cost of living between US cities and find the equivalent salary needed to maintain your lifestyle."
      howToUse="Enter your current salary, select your current city and the city you're considering. The calculator shows the equivalent salary needed and a category-by-category cost comparison."
      understandingTitle="Understanding Cost of Living"
      understandingContent="Cost of living indices measure relative expenses across cities. A city with an index of 150 is 50% more expensive than the national average (100). Housing is typically the largest factor, varying dramatically—a $300,000 home in Dallas might cost $800,000+ in San Francisco. Always consider cost of living when evaluating job offers in different cities."
      faqs={[
        { question: "What factors affect cost of living?", answer: "Housing (biggest factor), groceries, transportation, healthcare, utilities, and taxes. Housing alone can account for 50%+ of the difference between cities." },
        { question: "How accurate is this?", answer: "This provides a general estimate based on composite cost indices. Individual experiences vary based on lifestyle, neighborhood, and personal spending patterns." },
        { question: "Should I only look at salary?", answer: "No. Consider state income tax (0% in TX/FL vs 13%+ in CA), property tax rates, commute costs, and quality of life factors." },
      ]}
      relatedTools={[
        { title: "Budget Planner", href: "/budget-planner" },
        { title: "Paycheck Tax Calculator", href: "/paycheck-tax" },
        { title: "Rent vs. Buy Calculator", href: "/rent-vs-buy" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div><Label>Current Salary ($)</Label><Input type="number" value={salary} onChange={(e) => setSalary(+e.target.value)} min={0} /></div>
          <div>
            <Label>Current City</Label>
            <Select value={fromCity} onValueChange={setFromCity}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{cities.map((c) => <SelectItem key={c} value={c}>{c} ({cityIndex[c]})</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Target City</Label>
            <Select value={toCity} onValueChange={setToCity}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{cities.map((c) => <SelectItem key={c} value={c}>{c} ({cityIndex[c]})</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Equivalent Salary</div><div className="text-lg font-bold text-primary">${result.equivalentSalary.toLocaleString()}</div></div>
            <div className={`rounded-lg p-4 ${result.pctChange >= 0 ? "bg-destructive/10" : "bg-primary/10"}`}><div className="text-xs text-muted-foreground">Cost Difference</div><div className="text-lg font-bold">{result.pctChange >= 0 ? "+" : ""}{result.pctChange.toFixed(1)}%</div></div>
          </div>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={result.categories}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Bar dataKey="from" fill="hsl(var(--chart-2))" name={fromCity} />
              <Bar dataKey="to" fill="hsl(var(--chart-1))" name={toCity} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ToolShell>
  );
}
