import { useState, useEffect, useCallback } from "react";
import ToolShell from "@/components/ToolShell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ArrowLeftRight } from "lucide-react";

const POPULAR = ["USD", "EUR", "GBP", "JPY", "CAD", "AUD", "CHF", "CNY", "INR", "MXN", "BRL", "KRW"];

export default function CurrencyConverter() {
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [amount, setAmount] = useState(1000);
  const [rates, setRates] = useState<Record<string, number> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchRates = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
      const data = await res.json();
      if (data.result === "success") {
        setRates(data.rates);
      } else {
        setError("Failed to fetch rates.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [from]);

  useEffect(() => { fetchRates(); }, [fetchRates]);

  const converted = rates && rates[to] ? (amount * rates[to]).toFixed(2) : "—";
  const rate = rates && rates[to] ? rates[to].toFixed(4) : "—";

  const swap = () => { setFrom(to); setTo(from); };

  return (
    <ToolShell
      title="Currency Converter"
      description="Convert between 12 major world currencies using live mid-market exchange rates updated daily. Whether you're planning international travel, pricing freelance work for overseas clients, or comparing costs abroad, get instant, accurate conversions for free."
      howToUse="Enter the amount you want to convert in the 'Amount' field. Select the source currency from the 'From' dropdown and the destination currency from the 'To' dropdown. The result updates instantly. Use the swap button (↔) to quickly reverse the conversion direction — handy for checking both sides of a transaction. Rates are fetched live from the Open Exchange Rates API and updated once every 24 hours."
      understandingTitle="Understanding Exchange Rates"
      understandingContent="An exchange rate represents the price of one currency expressed in terms of another. These rates fluctuate constantly based on macroeconomic factors: interest rate differentials between central banks, inflation rates, political stability, trade balances, and market speculation. The rates displayed here are 'mid-market' rates — the midpoint between the buy and sell prices on the global currency market. This is the fairest rate available and the one used by financial institutions for internal accounting. However, when you actually exchange money through a bank, airport kiosk, or money transfer service, they add a 'spread' (margin) on top — typically 1–5% for banks, 5–10%+ for airport kiosks, and 0.5–2% for online services like Wise or Revolut. For the best deal, compare the rate you're offered against the mid-market rate shown here. The closer it is, the better the deal you're getting."
      faqs={[
        { question: "How often are the exchange rates updated?", answer: "The rates are fetched from the Open Exchange Rates API and are typically updated once every 24 hours. For real-time trading rates, you'd need a premium financial data service. For travel and general conversion purposes, daily updates are more than sufficient." },
        { question: "Are these the rates I'll get at my bank?", answer: "No. These are mid-market rates (the fairest baseline). Banks typically add a 1–3% margin on top. Credit cards usually charge a 1–3% foreign transaction fee. Airport currency exchanges can charge 8–15% margins. For the best rates, use services like Wise, Revolut, or multi-currency debit cards that offer near-mid-market rates." },
        { question: "Can I convert cryptocurrencies?", answer: "This converter currently supports traditional fiat currencies only (USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, INR, MXN, BRL, KRW). Cryptocurrency conversion may be added in a future update." },
        { question: "Why do exchange rates fluctuate?", answer: "Rates change based on supply and demand driven by: central bank interest rate decisions (higher rates attract foreign capital, strengthening the currency), inflation (high inflation weakens a currency), trade balances (export-heavy countries tend to have stronger currencies), political stability, and market speculation. Major events like elections, economic crises, or geopolitical conflicts can cause rapid fluctuations." },
        { question: "What's the best time to exchange currency?", answer: "Exchange rates are hard to time. For travel, a good strategy is to convert some money when the rate looks favorable and use a no-foreign-transaction-fee credit card for the rest. Avoid converting at airports, which offer the worst rates. For large transfers, consider setting a rate alert to buy when your target rate is hit." },
        { question: "Is there a limit on the amount I can convert?", answer: "There is no limit in this calculator — enter any amount. However, actual transfer limits depend on your bank or service. Wire transfers may have daily limits ($25,000–$100,000 for most consumer banks). Services like Wise have per-transfer limits that vary by country and currency." },
      ]}
      relatedTools={[
        { title: "Cost of Living Calculator", href: "/cost-of-living" },
        { title: "Freelance Tax Estimator", href: "/tax-estimator" },
        { title: "Budget Planner", href: "/budget-planner" },
      ]}
    >
      <div className="max-w-lg space-y-6">
        <div>
          <Label>Amount</Label>
          <Input type="number" value={amount} onChange={(e) => setAmount(+e.target.value)} min={0} />
          <p className="text-xs text-muted-foreground mt-1">Enter any amount — no limits.</p>
        </div>

        <div className="flex items-end gap-3">
          <div className="flex-1">
            <Label>From</Label>
            <select
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="w-full h-10 rounded-md border bg-card px-3 text-sm text-foreground"
            >
              {POPULAR.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <Button variant="outline" size="icon" onClick={swap} className="mb-0.5">
            <ArrowLeftRight className="h-4 w-4" />
          </Button>

          <div className="flex-1">
            <Label>To</Label>
            <select
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full h-10 rounded-md border bg-card px-3 text-sm text-foreground"
            >
              {POPULAR.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-sm text-muted-foreground animate-pulse">Loading rates…</div>
        ) : error ? (
          <div className="text-sm text-destructive">{error}</div>
        ) : (
          <div className="rounded-xl bg-accent p-6 space-y-2">
            <div className="text-sm text-muted-foreground">
              {amount.toLocaleString()} {from} =
            </div>
            <div className="text-3xl font-bold text-foreground">
              {Number(converted).toLocaleString(undefined, { minimumFractionDigits: 2 })} {to}
            </div>
            <div className="text-xs text-muted-foreground">
              1 {from} = {rate} {to} · Mid-market rate · Updated daily
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}