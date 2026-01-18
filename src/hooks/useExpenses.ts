import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface Expense {
  id: string;
  description: string;
  amount: number;
  category: string;
  date: string;
  billImage?: string;
  created_at?: string;
}

// Fetch all expenses
export const useExpenses = () => {
  return useQuery({
    queryKey: ['expenses'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      if (error) {
        console.error('Error fetching expenses:', error);
        throw error;
      }

      return data || [];
    },
  });
};

// Add new expense
export const useAddExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expense: Omit<Expense, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('expenses')
        .insert([
          {
            description: expense.description,
            amount: expense.amount,
            category: expense.category,
            date: expense.date,
            bill_image: expense.billImage,
          },
        ])
        .select();

      if (error) {
        console.error('Error adding expense:', error);
        throw error;
      }

      return data?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense added successfully');
    },
    onError: (error) => {
      console.error('Failed to add expense:', error);
      toast.error('Failed to add expense');
    },
  });
};

// Update expense
export const useUpdateExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...expense }: Expense) => {
      const { data, error } = await supabase
        .from('expenses')
        .update({
          description: expense.description,
          amount: expense.amount,
          category: expense.category,
          date: expense.date,
          bill_image: expense.billImage,
        })
        .eq('id', id)
        .select();

      if (error) {
        console.error('Error updating expense:', error);
        throw error;
      }

      return data?.[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update expense:', error);
      toast.error('Failed to update expense');
    },
  });
};

// Delete expense
export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('expenses')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting expense:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['expenses'] });
      toast.success('Expense deleted successfully');
    },
    onError: (error) => {
      console.error('Failed to delete expense:', error);
      toast.error('Failed to delete expense');
    },
  });
};
