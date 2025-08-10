import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";

export type ExpenseMap = Record<string, number>;

interface Props {
  expenses: ExpenseMap;
  setExpenses: (v: ExpenseMap) => void;
}

export default function ExpenseForm({ expenses, setExpenses }: Props) {
  const [customKey, setCustomKey] = useState("");

  const update = (key: string, val: number) => setExpenses({ ...expenses, [key]: val });
  const remove = (key: string) => {
    const next = { ...expenses };
    delete next[key];
    setExpenses(next);
  };

  const entries = Object.entries(expenses);

  return (
    <div className="grid md:grid-cols-2 gap-5">
      {entries.map(([key, value]) => (
        <div key={key} className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>{key}</Label>
            <Button variant="ghost" onClick={() => remove(key)} aria-label={`Remove ${key}`}>
              <Trash2 />
            </Button>
          </div>
          <Input
            type="number"
            min={0}
            value={value ?? 0}
            onChange={(e) => update(key, parseFloat(e.target.value || "0"))}
            placeholder="0.00"
          />
        </div>
      ))}

      <div className="md:col-span-2 flex gap-3 items-end">
        <div className="flex-1 space-y-2">
          <Label htmlFor="custom">Custom Category</Label>
          <Input id="custom" value={customKey} onChange={(e) => setCustomKey(e.target.value)} placeholder="e.g., Pet Care" />
        </div>
        <Button
          variant="secondary"
          className="hover-lift"
          onClick={() => {
            if (!customKey || expenses[customKey]) return;
            setExpenses({ ...expenses, [customKey]: 0 });
            setCustomKey("");
          }}
        >
          <Plus className="mr-2" /> Add
        </Button>
      </div>
    </div>
  );
}
