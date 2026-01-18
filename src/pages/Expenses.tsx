import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  Upload,
  Calendar,
  Receipt,
  Trash2,
  Eye,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { formatPKR } from "@/lib/formatCurrency";
import { toast } from "sonner";
import { useExpenses, useAddExpense, useDeleteExpense } from "@/hooks/useExpenses";

const categories = ["Office", "Food", "Marketing", "Software", "Transport", "Utilities", "Other"];

const Expenses = () => {
  const { data: expenses = [], isLoading } = useExpenses();
  const { mutate: addExpense, isPending: isAdding } = useAddExpense();
  const { mutate: deleteExpense } = useDeleteExpense();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newExpense, setNewExpense] = useState({
    description: "",
    amount: "",
    category: "Other",
    date: new Date().toISOString().split('T')[0],
  });

  const filteredExpenses = expenses.filter(expense =>
    (expense.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (expense.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

  const handleAddExpense = () => {
    if (!newExpense.description || !newExpense.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    addExpense({
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
      date: newExpense.date,
    }, {
      onSuccess: () => {
        setNewExpense({
          description: "",
          amount: "",
          category: "Other",
          date: new Date().toISOString().split('T')[0],
        });
        setIsAddDialogOpen(false);
      },
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Office: "bg-primary/10 text-primary",
      Food: "bg-warning/10 text-warning",
      Marketing: "bg-chart-4/10 text-chart-4",
      Software: "bg-accent/10 text-accent",
      Transport: "bg-chart-5/10 text-chart-5",
      Utilities: "bg-muted text-muted-foreground",
      Other: "bg-secondary text-secondary-foreground",
    };
    return colors[category] || colors.Other;
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-32 mb-4"></div>
            <div className="h-4 bg-muted rounded w-64"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">Expenses</h1>
            <p className="text-muted-foreground">Track and manage your daily expenses</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 gradient-primary text-primary-foreground border-0">
                <Plus className="h-4 w-4" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Expense</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Input
                    id="description"
                    placeholder="What did you spend on?"
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Amount (PKR) *</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0"
                      className="input-financial"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Upload Bill (Optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG up to 10MB
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={handleAddExpense} 
                  className="w-full gradient-primary text-primary-foreground"
                  disabled={isAdding}
                >
                  {isAdding ? "Adding..." : "Add Expense"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        <Card className="gradient-primary text-primary-foreground border-0">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-primary-foreground/80 text-sm font-medium">Total Expenses</p>
                <p className="text-3xl font-bold font-mono">{formatPKR(totalExpenses)}</p>
              </div>
              <Receipt className="h-12 w-12 text-primary-foreground/30" />
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredExpenses.map((expense, index) => (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-destructive/10 text-destructive">
                      <Receipt className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{expense.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className={getCategoryColor(expense.category)}>
                          {expense.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(expense.date).toLocaleDateString('en-PK', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <p className="font-mono font-semibold text-destructive">
                      -{formatPKR(expense.amount)}
                    </p>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {expense.bill_image && (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => deleteExpense(expense.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
              {filteredExpenses.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Receipt className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No expenses found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Expenses;
