import { motion } from "framer-motion";
import { 
  Wallet, 
  TrendingDown, 
  TrendingUp, 
  FileText,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { StatCard } from "@/components/ui/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPKR } from "@/lib/formatCurrency";
import { useNavigate } from "react-router-dom";

// Mock data - will be replaced with real data from database
const mockData = {
  totalFunds: 120000,
  totalExpenses: 45000,
  balance: 75000,
  recentTransactions: [
    { id: 1, description: "Office Supplies", amount: -2500, date: "2024-01-15", type: "expense" },
    { id: 2, description: "Investor Fund", amount: 50000, date: "2024-01-14", type: "fund" },
    { id: 3, description: "Team Lunch", amount: -3200, date: "2024-01-13", type: "expense" },
    { id: 4, description: "Marketing Campaign", amount: -15000, date: "2024-01-12", type: "expense" },
    { id: 5, description: "Project Milestone Payment", amount: 70000, date: "2024-01-10", type: "fund" },
  ],
};

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        >
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's your financial overview.</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => navigate("/funds")}
            >
              <Plus className="h-4 w-4" />
              Add Fund
            </Button>
            <Button
              className="gap-2 gradient-primary text-primary-foreground border-0"
              onClick={() => navigate("/expenses")}
            >
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Funds Received"
            value={formatPKR(mockData.totalFunds)}
            subtitle="All time"
            icon={TrendingUp}
            variant="positive"
            trend="up"
            trendValue="+12% from last month"
          />
          <StatCard
            title="Total Expenses"
            value={formatPKR(mockData.totalExpenses)}
            subtitle="All time"
            icon={TrendingDown}
            variant="negative"
            trend="down"
            trendValue="-5% from last month"
          />
          <StatCard
            title="Current Balance"
            value={formatPKR(mockData.balance)}
            subtitle="Available funds"
            icon={Wallet}
            variant="primary"
          />
          <StatCard
            title="Reports Generated"
            value="3"
            subtitle="This month"
            icon={FileText}
            variant="default"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Recent Transactions</CardTitle>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                View All
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockData.recentTransactions.map((transaction, index) => (
                  <motion.div
                    key={transaction.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        transaction.type === "fund" 
                          ? "bg-success/10 text-success" 
                          : "bg-destructive/10 text-destructive"
                      }`}>
                        {transaction.type === "fund" 
                          ? <ArrowUpRight className="h-4 w-4" />
                          : <ArrowDownRight className="h-4 w-4" />
                        }
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{transaction.description}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(transaction.date).toLocaleDateString('en-PK', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                    <p className={`font-mono font-semibold ${
                      transaction.amount > 0 ? "text-success" : "text-destructive"
                    }`}>
                      {transaction.amount > 0 ? "+" : ""}{formatPKR(Math.abs(transaction.amount))}
                    </p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-12"
                onClick={() => navigate("/expenses")}
              >
                <div className="p-1.5 rounded-lg bg-destructive/10">
                  <TrendingDown className="h-4 w-4 text-destructive" />
                </div>
                Record Daily Expense
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-12"
                onClick={() => navigate("/funds")}
              >
                <div className="p-1.5 rounded-lg bg-success/10">
                  <TrendingUp className="h-4 w-4 text-success" />
                </div>
                Add New Fund
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-12"
                onClick={() => navigate("/reports")}
              >
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                Generate Report
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start gap-3 h-12"
                onClick={() => navigate("/personal")}
              >
                <div className="p-1.5 rounded-lg bg-warning/10">
                  <Wallet className="h-4 w-4 text-warning" />
                </div>
                Personal/FBR Records
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Summary Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="gradient-primary rounded-2xl p-6 text-primary-foreground"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">Ready to generate investor report?</h3>
              <p className="text-primary-foreground/80 text-sm">
                Create a comprehensive report with all transactions, bills, and AI-generated analysis.
              </p>
            </div>
            <Button 
              variant="secondary" 
              className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              onClick={() => navigate("/reports")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </motion.div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
