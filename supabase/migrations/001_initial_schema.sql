-- Create Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  description TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  category TEXT NOT NULL,
  date DATE NOT NULL,
  bill_image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create Funds table
CREATE TABLE IF NOT EXISTS funds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  source TEXT NOT NULL,
  amount DECIMAL(15, 2) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Create Personal budget table
CREATE TABLE IF NOT EXISTS personal_budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  budget_limit DECIMAL(15, 2) NOT NULL,
  spent DECIMAL(15, 2) DEFAULT 0,
  month DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Enable RLS (Row Level Security)
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE funds ENABLE ROW LEVEL SECURITY;
ALTER TABLE personal_budgets ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allow all access for now - adjust as needed)
CREATE POLICY "Allow all access to expenses" ON expenses
  FOR ALL USING (true);

CREATE POLICY "Allow all access to funds" ON funds
  FOR ALL USING (true);

CREATE POLICY "Allow all access to personal_budgets" ON personal_budgets
  FOR ALL USING (true);

-- Insert initial sample data
INSERT INTO expenses (description, amount, category, date) VALUES
  ('Office Supplies - Stationery', 2500, 'Office', '2024-01-15'),
  ('Team Lunch Meeting', 3200, 'Food', '2024-01-13'),
  ('Marketing Campaign - Social Media Ads', 15000, 'Marketing', '2024-01-12'),
  ('Software Subscription - Annual', 8500, 'Software', '2024-01-10'),
  ('Transportation - Client Visit', 1200, 'Transport', '2024-01-08');

INSERT INTO funds (source, amount, date, description) VALUES
  ('Investor Fund', 50000, '2024-01-14', 'Series A funding round'),
  ('Project Milestone Payment', 70000, '2024-01-10', 'Milestone 1 completion'),
  ('Client Payment', 25000, '2024-01-05', 'Project X completion'),
  ('Bank Interest', 500, '2024-01-01', 'Monthly interest');
