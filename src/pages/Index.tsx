import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-finance.jpg";
import IncomeForm, { IncomeSource, CalcMode } from "@/components/finance/IncomeForm";
import ExpenseForm, { ExpenseMap } from "@/components/finance/ExpenseForm";
import TaxSummary from "@/components/finance/TaxSummary";
import Analytics from "@/components/finance/Analytics";
import { BarChart3 } from "lucide-react";

const defaultIncomes: IncomeSource[] = [
  { id: 1, type: "Salary", amount: 5000, frequency: "Monthly" },
];

const defaultExpenses: ExpenseMap = {
  Housing: 1500,
  Utilities: 250,
  Groceries: 450,
  Transportation: 300,
  Entertainment: 200,
  "Dining Out": 180,
  Shopping: 150,
  "Emergency Fund": 200,
  Retirement: 300,
  Investments: 150,
};

const Index = () => {
  const [calcMode, setCalcMode] = useState<CalcMode>("Monthly");
  const [incomes, setIncomes] = useState<IncomeSource[]>(defaultIncomes);
  const [expenses, setExpenses] = useState<ExpenseMap>(defaultExpenses);

  const monthlyIncome = incomes.reduce((sum, inc) => {
    const amt = inc.amount || 0;
    return sum + (inc.frequency === "Monthly" ? amt : amt / 12);
  }, 0);

  const annualIncome = monthlyIncome * 12;
  const monthlyExpenses = Object.values(expenses).reduce((a, b) => a + (b || 0), 0);
  const annualExpenses = monthlyExpenses * 12;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="relative">
        <div className="absolute inset-0 -z-10 bg-gradient-primary opacity-30" aria-hidden />
        <section className="container mx-auto grid md:grid-cols-2 gap-8 pt-16 pb-10">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Personal Financial Manager
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Track income, categorize expenses, and plan your taxes with real-time insights and beautiful charts.
            </p>
            <div className="flex items-center gap-3">
              <Button variant="hero" size="lg" className="hover-lift" onClick={() => {
                const el = document.getElementById("planner");
                el?.scrollIntoView({ behavior: "smooth" });
              }}>
                Get Started
              </Button>
              <a href="#overview" className="text-sm underline underline-offset-4">Learn more</a>
            </div>
          </div>
          <div className="relative">
            <img
              src={heroImage}
              alt="Glassmorphism finance dashboard with purple-blue gradient"
              className="w-full h-auto rounded-xl shadow-glow"
              loading="eager"
            />
          </div>
        </section>
      </header>

      <main id="planner" className="container mx-auto space-y-8 pb-20">
        <section className="grid lg:grid-cols-3 gap-6" aria-labelledby="inputs-title">
          <h2 id="inputs-title" className="sr-only">Inputs</h2>
          <Card className="glass-surface lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="text-primary" /> Income
              </CardTitle>
            </CardHeader>
            <CardContent>
              <IncomeForm
                mode={calcMode}
                onModeChange={setCalcMode}
                incomes={incomes}
                setIncomes={setIncomes}
              />
            </CardContent>
          </Card>

          <Card className="glass-surface lg:col-span-2">
            <CardHeader>
              <CardTitle>Expenses & Savings</CardTitle>
            </CardHeader>
            <CardContent>
              <ExpenseForm expenses={expenses} setExpenses={setExpenses} />
            </CardContent>
          </Card>
        </section>

        <section id="overview" className="grid lg:grid-cols-3 gap-6" aria-labelledby="overview-title">
          <h2 id="overview-title" className="sr-only">Overview</h2>
          <TaxSummary
            annualIncome={annualIncome}
            annualExpenses={annualExpenses}
          />
          <Analytics expenses={expenses} monthlyIncome={monthlyIncome} />
        </section>
      </main>
    </div>
  );
};

export default Index;
