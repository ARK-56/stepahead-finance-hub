import { useState, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
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
      description="Compare the cost of living between 20+ major US cities and find the salary you'd need in a new city to maintain your current standard of living. Essential for job seekers evaluating offers in different cities, remote workers considering relocation, or anyone curious about how far their money goes elsewhere."
      howToUse="Enter your current annual salary, then select your current city and the city you're considering moving to. The calculator adjusts your salary based on the cost-of-living index difference and shows a category-by-category comparison (housing, food, transportation, healthcare, and other expenses). A positive percentage means the target city is more expensive — you'd need a higher salary to maintain your lifestyle. A negative percentage means you'd need less."
      understandingTitle="Understanding Cost of Living"
      understandingContent="Cost of living indices measure the relative price of goods and services across geographic areas, with the national average set at 100. A city scoring 150 is 50% more expensive than average, while one scoring 85 is 15% cheaper. Housing is by far the largest differentiator — a median home in San Francisco costs roughly $1.3 million vs. $230,000 in Memphis, a 5.6× difference. But other categories matter too: groceries can vary 20–40% between cities, healthcare costs differ significantly, and transportation costs depend on whether you need a car or can use public transit. When evaluating a job offer in a different city, the salary number alone is meaningless without cost-of-living context. An $80,000 salary in Kansas City (index: 88) provides the same purchasing power as approximately $150,000 in New York City (index: 187). Don't forget to consider state income tax differences — moving from California (13.3% top rate) to Texas (0%) is equivalent to a significant raise. Property taxes also vary dramatically (0.18% in Hawaii vs. 2.47% in New Jersey). Remote workers choosing where to live should optimize for: low cost of living + no state income tax + quality of life. Cities like Austin, Nashville, Raleigh, and Tampa have become popular for this reason."
      faqs={[
        { question: "What factors affect cost of living?", answer: "Housing (30–40% of the total difference between cities), groceries (10–20% variation), transportation (car ownership costs, gas, or public transit), healthcare (premiums, copays, procedure costs vary by region), utilities (climate-dependent — heating in the Northeast, AC in the South), and taxes (state income tax: 0–13.3%, property tax: 0.18–2.47%, sales tax: 0–10%). Housing alone often accounts for over 50% of the cost difference between two cities." },
        { question: "How accurate is this calculator?", answer: "This provides a solid general estimate based on composite cost-of-living indices from major data providers. Individual experiences vary based on: specific neighborhood (Manhattan vs. outer boroughs), lifestyle (car-free vs. car-dependent), housing choices (renting vs. buying, apartment size), and personal spending patterns. Use this as a starting point, then research specific costs (rent, groceries, utilities) in the exact neighborhood you're considering." },
        { question: "Should I only look at salary when comparing cities?", answer: "Absolutely not. Consider: (1) state income tax (saves $3,000–$10,000+ annually in no-tax states), (2) property tax rates, (3) sales tax, (4) commute time and costs, (5) quality of life (weather, outdoor activities, culture), (6) career growth opportunities, (7) proximity to family, and (8) healthcare quality and access. A lower salary in a low-cost city often provides a better quality of life than a higher salary in an expensive city." },
        { question: "Which US cities have the lowest cost of living?", answer: "Major cities with indices below 95: Memphis, TN (84), Kansas City, MO (88), Indianapolis, IN (90), Columbus, OH (93), and Charlotte, NC (97). Smaller cities and towns are often even cheaper. The tradeoff: lower cost of living sometimes correlates with fewer job opportunities, though remote work has changed this equation significantly." },
        { question: "How has remote work affected cost of living?", answer: "Remote work has been a game-changer. Workers with Bay Area or NYC salaries relocating to lower-cost cities effectively get a massive raise. This has driven up costs in previously affordable cities like Boise, Austin, and Nashville (10–20% increases in 2020–2023). Some companies now adjust pay based on location, reducing the arbitrage opportunity." },
        { question: "What about international cost of living?", answer: "This calculator covers US cities. For international comparisons, the cost differences can be even more dramatic. Many retirees and remote workers have moved to places like Portugal, Mexico, Thailand, and Colombia where US dollars stretch 2–4× further. Consider visa requirements, healthcare quality, language barriers, and tax implications (US citizens are taxed on worldwide income)." },
      ]}
      relatedTools={[
        { title: "Budget Planner", href: "/budget-planner" },
        { title: "Paycheck Tax Calculator", href: "/paycheck-tax" },
        { title: "Rent vs. Buy Calculator", href: "/rent-vs-buy" },
        { title: "Currency Converter", href: "/currency-converter" },
      ]}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <Label>Current Salary ($)</Label>
            <Input type="number" value={salary} onChange={(e) => setSalary(+e.target.value)} min={0} />
            <p className="text-xs text-muted-foreground mt-1">Your annual gross or after-tax salary.</p>
          </div>
          <div>
            <Label>Current City</Label>
            <Select value={fromCity} onValueChange={setFromCity}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{cities.map((c) => <SelectItem key={c} value={c}>{c} (Index: {cityIndex[c]})</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Target City</Label>
            <Select value={toCity} onValueChange={setToCity}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{cities.map((c) => <SelectItem key={c} value={c}>{c} (Index: {cityIndex[c]})</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="rounded-lg bg-primary/10 p-4"><div className="text-xs text-muted-foreground">Equivalent Salary Needed</div><div className="text-lg font-bold text-primary">${result.equivalentSalary.toLocaleString()}</div></div>
            <div className={`rounded-lg p-4 ${result.pctChange >= 0 ? "bg-destructive/10" : "bg-primary/10"}`}><div className="text-xs text-muted-foreground">Cost Difference</div><div className="text-lg font-bold">{result.pctChange >= 0 ? "+" : ""}{result.pctChange.toFixed(1)}%</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Salary Difference</div><div className="text-lg font-bold text-foreground">{result.difference >= 0 ? "+" : ""}${result.difference.toLocaleString()}</div></div>
            <div className="rounded-lg bg-accent p-4"><div className="text-xs text-muted-foreground">Current Salary</div><div className="text-lg font-bold text-foreground">${salary.toLocaleString()}</div></div>
          </div>
        </div>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={result.categories}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="from" fill="hsl(var(--chart-2))" name={fromCity} />
              <Bar dataKey="to" fill="hsl(var(--chart-1))" name={toCity} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </ToolShell>
  );
}