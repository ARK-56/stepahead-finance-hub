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
      description="Convert between world currencies using live exchange rates."
    >
      <div className="max-w-lg space-y-6">
        <div>
          <Label>Amount</Label>
          <Input type="number" value={amount} onChange={(e) => setAmount(+e.target.value)} min={0} />
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
              1 {from} = {rate} {to}
            </div>
          </div>
        )}
      </div>
    </ToolShell>
  );
}
