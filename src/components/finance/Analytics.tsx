import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pie, PieChart, Cell, Tooltip as ReTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from "recharts";
import { ExpenseMap } from "./ExpenseForm";

interface Props {
  expenses: ExpenseMap;
  monthlyIncome: number;
}

const COLORS = [
  "#6E56CF", "#4CC9F0", "#B892FF", "#89C2D9", "#80ED99",
  "#FFD166", "#F4978E", "#9AD5CA", "#A1C181", "#C19AB7",
];

export default function Analytics({ expenses, monthlyIncome }: Props) {
  const entries = Object.entries(expenses);
  const total = entries.reduce((s, [, v]) => s + (v || 0), 0);
  const data = entries.map(([name, value]) => ({ name, value }));

  const needsKeys = ["Housing", "Utilities", "Groceries", "Transportation"];
  const savingsKeys = ["Emergency Fund", "Retirement", "Investments"];
  const wants = total - sum(expenses, needsKeys) - sum(expenses, savingsKeys);

  const plan = [
    { name: "Needs", value: monthlyIncome * 0.5 },
    { name: "Wants", value: monthlyIncome * 0.3 },
    { name: "Savings", value: monthlyIncome * 0.2 },
  ];
  const actual = [
    { name: "Needs", value: sum(expenses, needsKeys) },
    { name: "Wants", value: wants },
    { name: "Savings", value: sum(expenses, savingsKeys) },
  ];

  return (
    <>
      <Card className="glass-surface lg:col-span-1">
        <CardHeader>
          <CardTitle>Expense Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" outerRadius={80}>
                {data.map((_, i) => (
                  <Cell key={`c-${i}`} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <ReTooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="glass-surface lg:col-span-2">
        <CardHeader>
          <CardTitle>50/30/20 — Plan vs Actual</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={[mergeByName(plan, actual)]}>
              <XAxis dataKey="name" hide />
              <YAxis />
              <ReTooltip />
              <Bar dataKey="Needs_plan" fill="#6E56CF" name="Needs (Plan)" />
              <Bar dataKey="Needs_actual" fill="#B892FF" name="Needs (Actual)" />
              <Bar dataKey="Wants_plan" fill="#4CC9F0" name="Wants (Plan)" />
              <Bar dataKey="Wants_actual" fill="#89C2D9" name="Wants (Actual)" />
              <Bar dataKey="Savings_plan" fill="#80ED99" name="Savings (Plan)" />
              <Bar dataKey="Savings_actual" fill="#A1C181" name="Savings (Actual)" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
}

function sum(map: ExpenseMap, keys: string[]) {
  return keys.reduce((s, k) => s + (map[k] || 0), 0);
}

function mergeByName(plan: { name: string; value: number }[], actual: { name: string; value: number }[]) {
  const out: Record<string, number | string> = { name: "Budget" };
  for (const p of plan) out[`${p.name}_plan`] = p.value;
  for (const a of actual) out[`${a.name}_actual`] = a.value;
  return out;
}
