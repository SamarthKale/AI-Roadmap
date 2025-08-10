import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useMemo } from "react";

export type CalcMode = "Monthly" | "Annual";

export type IncomeSource = {
  id: number;
  type: string;
  amount: number;
  frequency: CalcMode;
};

interface Props {
  mode: CalcMode;
  onModeChange: (m: CalcMode) => void;
  incomes: IncomeSource[];
  setIncomes: (v: IncomeSource[]) => void;
}

export default function IncomeForm({ mode, onModeChange, incomes, setIncomes }: Props) {
  const monthlyTotal = useMemo(() => incomes.reduce((sum, inc) => sum + (inc.frequency === "Monthly" ? inc.amount : inc.amount / 12), 0), [incomes]);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Switch id="mode" checked={mode === "Annual"} onCheckedChange={(v) => onModeChange(v ? "Annual" : "Monthly")} />
          <Label htmlFor="mode" className="cursor-pointer">Calculate as {mode}</Label>
        </div>
        <div className="text-sm text-muted-foreground">Monthly total: ${monthlyTotal.toFixed(2)}</div>
      </div>

      <div className="space-y-4">
        {incomes.map((inc, idx) => (
          <Card key={inc.id} className="glass-surface">
            <CardContent className="pt-6 grid md:grid-cols-4 gap-3 items-end">
              <div className="space-y-2">
                <Label>Source</Label>
                <Input
                  value={inc.type}
                  onChange={(e) => {
                    const next = [...incomes];
                    next[idx] = { ...inc, type: e.target.value };
                    setIncomes(next);
                  }}
                  placeholder="Salary, Freelance, Investments..."
                />
              </div>
              <div className="space-y-2">
                <Label>Amount</Label>
                <Input
                  type="number"
                  min={0}
                  value={inc.amount ?? 0}
                  onChange={(e) => {
                    const next = [...incomes];
                    next[idx] = { ...inc, amount: parseFloat(e.target.value || "0") };
                    setIncomes(next);
                  }}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Frequency</Label>
                <Select
                  value={inc.frequency}
                  onValueChange={(v: CalcMode) => {
                    const next = [...incomes];
                    next[idx] = { ...inc, frequency: v };
                    setIncomes(next);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                    <SelectItem value="Annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setIncomes(incomes.filter((i) => i.id !== inc.id))}
                  aria-label={`Remove ${inc.type || 'income'} source`}
                >
                  <Trash2 className="mr-2" /> Remove
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-between items-center pt-2">
        <Button
          variant="secondary"
          onClick={() => setIncomes([...incomes, { id: Date.now(), type: "", amount: 0, frequency: mode }])}
          className="hover-lift"
        >
          <Plus className="mr-2" /> Add Source
        </Button>
      </div>
    </div>
  );
}
