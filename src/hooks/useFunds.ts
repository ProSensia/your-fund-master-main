import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Fund {
  id: string;
  source: string;
  amount: number;
  date: string;
  description?: string;
  created_at?: string;
}

// Fetch all funds
export const useFunds = () => {
  return useQuery({
    queryKey: ['funds'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('funds')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching funds:', error);
        throw error;
      }

      return data || [];
    },
  });
};

// Add new fund
export const useAddFund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fund: Omit<Fund, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('funds')
        .insert([
          {
            source: fund.source,
            amount: fund.amount,
            date: fund.date,
            description: fund.description,
          },
        ])
        .select();

      if (error) {
        console.error('Error adding fund:', error);
        throw error;
      }

      return data?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funds'] });
      toast.success('Fund added successfully');
    },
    onError: (error) => {
      console.error('Failed to add fund:', error);
      toast.error('Failed to add fund');
    },
  });
};

// Delete fund
export const useDeleteFund = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('funds')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting fund:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funds'] });
      toast.success('Fund deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete fund:', error);
      toast.error('Failed to delete fund');
    },
  });
};
