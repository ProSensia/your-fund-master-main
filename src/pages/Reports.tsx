import { useState } from "react";
import { motion } from "framer-motion";
import { 
  FileText, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Wallet,
  Sparkles,
  Eye,
  Printer,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { formatPKR } from "@/lib/formatCurrency";
import { toast } from "sonner";

const Reports = () => {
  const [dateRange, setDateRange] = useState({
    from: "2024-01-01",
    to: new Date().toISOString().split('T')[0],
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Mock report data
  const reportData = {
    totalFunds: 245000,
    totalExpenses: 30400,
    balance: 214600,
    expensesByCategory: [
      { category: "Marketing", amount: 15000, percentage: 49.3 },
      { category: "Software", amount: 8500, percentage: 28.0 },
      { category: "Food", amount: 3200, percentage: 10.5 },
      { category: "Office", amount: 2500, percentage: 8.2 },
      { category: "Transport", amount: 1200, percentage: 3.9 },
    ],
    fundsBySource: [
      { source: "Grant", amount: 100000, percentage: 40.8 },
      { source: "Project Payment", amount: 70000, percentage: 28.6 },
      { source: "Investor", amount: 50000, percentage: 20.4 },
      { source: "Personal Investment", amount: 25000, percentage: 10.2 },
    ],
  };

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    // Simulate AI analysis
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsGenerating(false);
    toast.success("Report generated successfully! Ready for download.");
  };

  const handleDownload = (format: string) => {
    toast.success(`Downloading report as ${format.toUpperCase()}...`);
  };

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
            <h1 className="text-2xl font-bold text-foreground">Reports</h1>
            <p className="text-muted-foreground">Generate comprehensive financial reports for investors</p>
          </div>
        </motion.div>

        {/* Date Range Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Report Period
            </CardTitle>
            <CardDescription>Select the date range for your report</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 space-y-2">
                <Label htmlFor="from">From</Label>
                <Input
                  id="from"
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                />
              </div>
              <div className="flex-1 space-y-2">
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                />
              </div>
              <Button 
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="gap-2 gradient-primary text-primary-foreground min-w-[180px]"
              >
                {isGenerating ? (
                  <>
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Report
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="gradient-success text-success-foreground border-0">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-success-foreground/80 text-sm">Total Funds</p>
                  <p className="text-2xl font-bold font-mono">{formatPKR(reportData.totalFunds)}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-success-foreground/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-destructive/10 border-destructive/20">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-destructive/80 text-sm">Total Expenses</p>
                  <p className="text-2xl font-bold font-mono text-destructive">{formatPKR(reportData.totalExpenses)}</p>
                </div>
                <TrendingDown className="h-8 w-8 text-destructive/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="gradient-primary text-primary-foreground border-0">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm">Net Balance</p>
                  <p className="text-2xl font-bold font-mono">{formatPKR(reportData.balance)}</p>
                </div>
                <Wallet className="h-8 w-8 text-primary-foreground/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Breakdown Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Expenses by Category */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Expenses by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.expensesByCategory.map((item, index) => (
                  <motion.div
                    key={item.category}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{item.category}</span>
                      <span className="text-muted-foreground">{formatPKR(item.amount)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="h-full bg-destructive rounded-full"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.percentage}%</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Funds by Source */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Funds by Source</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {reportData.fundsBySource.map((item, index) => (
                  <motion.div
                    key={item.source}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">{item.source}</span>
                      <span className="text-muted-foreground">{formatPKR(item.amount)}</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        className="h-full bg-success rounded-full"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{item.percentage}%</p>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Download Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="h-5 w-5" />
              Export Report
            </CardTitle>
            <CardDescription>Download your report in various formats for investors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => handleDownload('docx')}
              >
                <FileText className="h-4 w-4" />
                Download as Word (.docx)
              </Button>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => handleDownload('pdf')}
              >
                <FileText className="h-4 w-4" />
                Download as PDF
              </Button>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => handleDownload('xlsx')}
              >
                <FileText className="h-4 w-4" />
                Download as Excel
              </Button>
              <Button 
                variant="ghost" 
                className="gap-2"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4" />
                Print Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Analysis Preview */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI-Generated Analysis
            </CardTitle>
            <CardDescription>Automated insights from your financial data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none text-foreground">
              <p className="text-muted-foreground">
                Based on your financial data from {dateRange.from} to {dateRange.to}:
              </p>
              <ul className="mt-3 space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Total funds received: <strong>{formatPKR(reportData.totalFunds)}</strong> from 4 different sources</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-destructive">•</span>
                  <span>Largest expense category: <strong>Marketing</strong> at 49.3% of total expenses</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-success">✓</span>
                  <span>Burn rate is healthy at <strong>12.4%</strong> of total funds</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">→</span>
                  <span>Recommendation: Current runway is approximately <strong>8 months</strong> at current spending rate</span>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Reports;
