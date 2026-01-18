import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  Upload,
  Calendar,
  Wallet,
  Trash2,
  Eye,
  TrendingUp,
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
import { useFunds, useAddFund, useDeleteFund } from "@/hooks/useFunds";

const sources = ["Investor", "Project Payment", "Personal Investment", "Grant", "Loan", "Other"];

const Funds = () => {
  const { data: funds = [], isLoading } = useFunds();
  const { mutate: addFund, isPending: isAdding } = useAddFund();
  const { mutate: deleteFund } = useDeleteFund();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [newFund, setNewFund] = useState({
    source: "Other",
    description: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
  });

  const filteredFunds = funds.filter(fund =>
    (fund.source || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (fund.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalFunds = funds.reduce((sum, fund) => sum + (fund.amount || 0), 0);

  const handleAddFund = () => {
    if (!newFund.source || !newFund.amount) {
      toast.error("Please fill in all required fields");
      return;
    }

    addFund({
      source: newFund.source,
      description: newFund.description || undefined,
      amount: parseFloat(newFund.amount),
      date: newFund.date,
    }, {
      onSuccess: () => {
        setNewFund({
          source: "Other",
          description: "",
          amount: "",
          date: new Date().toISOString().split('T')[0],
        });
        setIsAddDialogOpen(false);
      },
    });
  };

  const handleDeleteFund = (id: string) => {
    deleteFund(id);
  };

  const getSourceColor = (source: string) => {
    const colors: Record<string, string> = {
      Investor: "bg-success/10 text-success",
      "Project Payment": "bg-primary/10 text-primary",
      "Personal Investment": "bg-warning/10 text-warning",
      Grant: "bg-accent/10 text-accent",
      Loan: "bg-chart-4/10 text-chart-4",
      Other: "bg-secondary text-secondary-foreground",
    };
    return colors[source] || colors.Other;
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
            <h1 className="text-2xl font-bold text-foreground">Funds</h1>
            <p className="text-muted-foreground">Track incoming funds and investments</p>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 gradient-success text-success-foreground border-0">
                <Plus className="h-4 w-4" />
                Add Fund
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Fund</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="source">Source</Label>
                  <select
                    id="source"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={newFund.source}
                    onChange={(e) => setNewFund({ ...newFund, source: e.target.value })}
                  >
                    {sources.map(src => (
                      <option key={src} value={src}>{src}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Details about this fund..."
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
                <div className="space-y-2">
                  <Label>Upload Document (Optional)</Label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-success/50 transition-colors cursor-pointer">
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Upload proof of fund transfer
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, PDF up to 10MB
                    </p>
                  </div>
                </div>
                <Button onClick={handleAddFund} className="w-full gradient-success text-success-foreground">
                  Add Fund
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </motion.div>

        {/* Summary Card */}
        <Card className="gradient-success text-success-foreground border-0">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-success-foreground/80 text-sm font-medium">Total Funds Received</p>
                <p className="text-3xl font-bold font-mono">{formatPKR(totalFunds)}</p>
              </div>
              <TrendingUp className="h-12 w-12 text-success-foreground/30" />
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search funds..."
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

        {/* Funds List */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">All Funds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredFunds.map((fund, index) => (
                <motion.div
                  key={fund.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-success/10 text-success">
                      <Wallet className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{fund.source}</p>
                      <p className="text-sm text-muted-foreground">{fund.description}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className={getSourceColor(fund.source)}>
                          {fund.source}
                        </Badge>
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
                  <div className="flex items-center gap-3">
                    <p className="font-mono font-semibold text-success">
                      +{formatPKR(fund.amount)}
                    </p>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {fund.documentImage && (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteFund(fund.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
              {filteredFunds.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Wallet className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No funds found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Funds;
