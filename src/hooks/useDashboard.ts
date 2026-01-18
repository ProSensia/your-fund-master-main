import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = '/api';

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
      const response = await fetch(`${API_BASE_URL}/dashboard`);
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      const result = await response.json();
      return result.data;
    },
    staleTime: 5000,
  });
};
