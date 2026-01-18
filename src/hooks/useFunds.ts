import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const API_BASE_URL = '/api';

export interface Fund {
  id?: string;
  source: string;
  amount: number;
  date: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

// Fetch all funds
export const useFunds = () => {
  return useQuery({
    queryKey: ['funds'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/funds`);
      if (!response.ok) throw new Error('Failed to fetch funds');
      const result = await response.json();
      return result.data || [];
    },
    staleTime: 5000,
  });
};

// Add new fund
export const useAddFund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fund: Omit<Fund, 'id' | 'created_at' | 'updated_at'>) => {
      const response = await fetch(`${API_BASE_URL}/funds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fund),
      });
      if (!response.ok) throw new Error('Failed to add fund');
      const result = await response.json();
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funds'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Fund added successfully');
    },
    onError: () => {
      toast.error('Failed to add fund');
    },
  });
};

// Delete fund
export const useDeleteFund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch(`${API_BASE_URL}/funds/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete fund');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funds'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Fund deleted successfully');
    },
    onError: () => {
      toast.error('Failed to delete fund');
    },
  });
};
