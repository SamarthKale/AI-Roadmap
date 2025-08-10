import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

function calcTaxAnnual(annualIncome: number): number {
  // Simple progressive brackets (approximate, demo-only)
  const brackets = [
    { upTo: 11000, rate: 0.1 },
    { upTo: 44725, rate: 0.12 },
    { upTo: 95375, rate: 0.22 },
    { upTo: 182100, rate: 0.24 },
    { upTo: 231250, rate: 0.32 },
    { upTo: 578125, rate: 0.35 },
    { upTo: Infinity, rate: 0.37 },
  ];
  let remaining = annualIncome;
  let lastCap = 0;
  let tax = 0;
  for (const b of brackets) {
    const band = Math.max(0, Math.min(remaining, b.upTo - lastCap));
    tax += band * b.rate;
    remaining -= band;
    lastCap = b.upTo;
    if (remaining <= 0) break;
  }
  return tax;
}

interface Props {
  annualIncome: number;
  annualExpenses: number;
}

export default function TaxSummary({ annualIncome, annualExpenses }: Props) {
  const estTax = calcTaxAnnual(annualIncome);
  const monthlyTax = estTax / 12;
  const monthlyIncome = annualIncome / 12;
  const monthlyExpenses = annualExpenses / 12;
  const netAfter = monthlyIncome - monthlyExpenses - monthlyTax;
  const affordable = netAfter >= 0;

  const recommendedMonthlyTaxSavings = monthlyTax;

  return (
    <Card className="glass-surface lg:col-span-1">
      <CardHeader>
        <CardTitle>Tax Affordability</CardTitle>
        <CardDescription>Estimated progressive income tax based on your total income.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Est. Annual Tax</p>
          <p className="text-2xl font-semibold">${estTax.toFixed(0)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Monthly Tax</p>
          <p className="text-2xl font-semibold">${monthlyTax.toFixed(0)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Net After Tax + Expenses</p>
          <p className={`text-2xl font-semibold ${affordable ? 'text-primary' : 'text-destructive'}`}>{netAfter.toFixed(0)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Recommended Monthly Savings</p>
          <p className="text-2xl font-semibold">${recommendedMonthlyTaxSavings.toFixed(0)}</p>
        </div>
      </CardContent>
    </Card>
  );
}
