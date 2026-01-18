import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface DashboardData {
  totalFunds: number;
  totalExpenses: number;
  balance: number;
  recentTransactions: Array<{
    id: string;
    description: string;
    amount: number;
    date: string;
    type: 'expense' | 'fund';
  }>;
}

export const useDashboardData = () => {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: async (): Promise<DashboardData> => {
      try {
        // Fetch all expenses
        const { data: expenses, error: expensesError } = await (supabase
          .from('expenses')
          .select('*') as any);

        // Fetch all funds
        const { data: funds, error: fundsError } = await (supabase
          .from('funds')
          .select('*') as any);

        if (expensesError || fundsError) {
          throw new Error('Failed to fetch dashboard data');
        }

        const totalExpenses = (expenses || []).reduce((sum: number, exp: any) => sum + (exp.amount || 0), 0);
        const totalFunds = (funds || []).reduce((sum: number, fund: any) => sum + (fund.amount || 0), 0);
        const balance = totalFunds - totalExpenses;

        // Combine and sort recent transactions
        const recentTransactions = [
          ...(expenses || []).map((exp: any) => ({
            id: exp.id,
            description: exp.description || 'Expense',
            amount: -(exp.amount || 0),
            date: exp.date || '',
            type: 'expense' as const,
          })),
          ...(funds || []).map((fund: any) => ({
            id: fund.id,
            description: fund.source || 'Fund',
            amount: fund.amount || 0,
            date: fund.date || '',
            type: 'fund' as const,
          })),
        ]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 10);

        return {
          totalFunds,
          totalExpenses,
          balance,
          recentTransactions,
        };
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        throw error;
      }
    },
    staleTime: 5000, // 5 seconds
  });
};
