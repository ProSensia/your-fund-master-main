import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const initializeTables = async () => {
  try {
    // Check if tables exist by trying to query them
    const { data: expensesCheck, error: expensesError } = await (supabase
      .from('expenses')
      .select('count(*)', { count: 'exact', head: true }) as any);

    const { data: fundsCheck, error: fundsError } = await (supabase
      .from('funds')
      .select('count(*)', { count: 'exact', head: true }) as any);

    if (expensesError && fundsError) {
      console.warn('Database tables may not exist. Creating them...');
      
      // Create expenses table
      const { error: createExpensesError } = await (supabase
        .from('expenses')
        .insert([{
          description: 'Initialize',
          amount: 0,
          category: 'Init',
          date: new Date().toISOString().split('T')[0],
        }]) as any);

      // Create funds table
      const { error: createFundsError } = await (supabase
        .from('funds')
        .insert([{
          source: 'Initialize',
          amount: 0,
          date: new Date().toISOString().split('T')[0],
        }]) as any);

      console.log('Tables initialized');
    }

    return true;
  } catch (error) {
    console.error('Error initializing tables:', error);
    return false;
  }
};

export const testDatabaseConnection = async () => {
  try {
    const { data, error } = await (supabase
      .from('expenses')
      .select('count(*)', { count: 'exact', head: true }) as any);

    if (error) {
      console.error('Database connection error:', error);
      toast.error('Failed to connect to database');
      return false;
    }

    console.log('Database connection successful');
    toast.success('Database connected successfully');
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    toast.error('Failed to connect to database');
    return false;
  }
};
