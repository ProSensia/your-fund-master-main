import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Plus, 
  FileText,
  Calendar,
  Wallet,
  Download,
  Building,
  BadgeCheck,
} from "lucide-react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

interface PersonalFund {
  id: number;
  description: string;
  amount: number;
  date: string;
  taxPaid: boolean;
  taxReference?: string;
}

const mockPersonalFunds: PersonalFund[] = [
  { id: 1, description: "Personal savings contribution", amount: 50000, date: "2024-01-10", taxPaid: true, taxReference: "FBR-2024-001234" },
  { id: 2, description: "Freelance income - Project A", amount: 35000, date: "2024-01-05", taxPaid: true, taxReference: "FBR-2024-001122" },
  { id: 3, description: "Investment returns", amount: 15000, date: "2023-12-28", taxPaid: false },
];

const Personal = () => {
  const [funds, setFunds] = useState<PersonalFund[]>(mockPersonalFunds);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newFund, setNewFund] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    taxPaid: false,
    taxReference: "",
  });

  const totalPersonalFunds = funds.reduce((sum, f) => sum + f.amount, 0);
  const taxPaidFunds = funds.filter(f => f.taxPaid).reduce((sum, f) => sum + f.amount, 0);
  const taxPendingFunds = funds.filter(f => !f.taxPaid).reduce((sum, f) => sum + f.amount, 0);

  const handleAddFund = () => {
    if (!newFund.description || !newFund.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    const fund: PersonalFund = {
      id: Date.now(),
      description: newFund.description,
      amount: parseFloat(newFund.amount),
      date: newFund.date,
      taxPaid: newFund.taxPaid,
      taxReference: newFund.taxReference || undefined,
    };

    setFunds([fund, ...funds]);
    setNewFund({
      description: "",
      amount: "",
      date: new Date().toISOString().split('T')[0],
      taxPaid: false,
      taxReference: "",
    });
    setIsAddDialogOpen(false);
    toast.success("Personal fund added successfully!");
  };

  const handleDownloadFBRReport = () => {
    toast.success("Downloading FBR-compatible tax report...");
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
            <h1 className="text-2xl font-bold text-foreground">Personal Funds & FBR</h1>
            <p className="text-muted-foreground">Track personal investments and tax records for FBR</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 gradient-primary text-primary-foreground border-0">
                <Plus className="h-4 w-4" />
                Add Personal Fund
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Personal Fund</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Source of personal fund..."
                    value={newFund.description}
                    onChange={(e) => setNewFund({ ...newFund, description: e.target.value })}
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
                      value={newFund.amount}
                      onChange={(e) => setNewFund({ ...newFund, amount: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={newFund.date}
                      onChange={(e) => setNewFund({ ...newFund, date: e.target.value })}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="taxPaid"
                    checked={newFund.taxPaid}
                    onChange={(e) => setNewFund({ ...newFund, taxPaid: e.target.checked })}
                    className="h-4 w-4 rounded border-border"
                  />
                  <Label htmlFor="taxPaid" className="text-sm font-normal">Tax already paid on this amount</Label>
                </div>
                {newFund.taxPaid && (
                  <div className="space-y-2">
                    <Label htmlFor="taxReference">FBR Reference Number</Label>
                    <Input
                      id="taxReference"
                      placeholder="e.g., FBR-2024-XXXXXX"
                      value={newFund.taxReference}
                      onChange={(e) => setNewFund({ ...newFund, taxReference: e.target.value })}
                    />
                  </div>
                )}
                <Button onClick={handleAddFund} className="w-full gradient-primary text-primary-foreground">
                  Add Personal Fund
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="gradient-primary text-primary-foreground border-0">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm">Total Personal Funds</p>
                  <p className="text-2xl font-bold font-mono">{formatPKR(totalPersonalFunds)}</p>
                </div>
                <User className="h-8 w-8 text-primary-foreground/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-success/10 border-success/20">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-success text-sm">Tax Paid</p>
                  <p className="text-2xl font-bold font-mono text-success">{formatPKR(taxPaidFunds)}</p>
                </div>
                <BadgeCheck className="h-8 w-8 text-success/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-warning/10 border-warning/20">
            <CardContent className="py-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-warning text-sm">Tax Pending</p>
                  <p className="text-2xl font-bold font-mono text-warning">{formatPKR(taxPendingFunds)}</p>
                </div>
                <Building className="h-8 w-8 text-warning/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FBR Export Section */}
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Building className="h-5 w-5 text-primary" />
              FBR Tax Report
            </CardTitle>
            <CardDescription>Generate tax-compliant reports for Federal Board of Revenue</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm text-foreground">
                  Download a comprehensive report of your personal funds with tax payment status for FBR submission.
                </p>
                <p className="text-xs text-muted-foreground">
                  Includes: Fund sources, amounts, dates, and FBR reference numbers
                </p>
              </div>
              <Button 
                onClick={handleDownloadFBRReport}
                className="gap-2 gradient-primary text-primary-foreground whitespace-nowrap"
              >
                <Download className="h-4 w-4" />
                Download FBR Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Funds List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Fund Records</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {funds.map((fund, index) => (
                <motion.div
                  key={fund.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{fund.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        {fund.taxPaid ? (
                          <Badge className="bg-success/10 text-success border-0 gap-1">
                            <BadgeCheck className="h-3 w-3" />
                            Tax Paid
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="bg-warning/10 text-warning border-0">
                            Tax Pending
                          </Badge>
                        )}
                        {fund.taxReference && (
                          <span className="text-xs text-muted-foreground font-mono">
                            {fund.taxReference}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(fund.date).toLocaleDateString('en-PK', { 
                            day: 'numeric', 
                            month: 'short', 
                            year: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="font-mono font-semibold text-foreground">
                    {formatPKR(fund.amount)}
                  </p>
                </motion.div>
              ))}
              {funds.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No personal funds recorded</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Personal;
