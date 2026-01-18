-- Create Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id CHAR(36) NOT NULL PRIMARY KEY,
  description TEXT NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  category VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  bill_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create Funds table
CREATE TABLE IF NOT EXISTS funds (
  id CHAR(36) NOT NULL PRIMARY KEY,
  source VARCHAR(255) NOT NULL,
  amount DECIMAL(15,2) NOT NULL,
  date DATE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Create Personal Budgets table
CREATE TABLE IF NOT EXISTS personal_budgets (
  id CHAR(36) NOT NULL PRIMARY KEY,
  category VARCHAR(100) NOT NULL,
  budget_limit DECIMAL(15,2) NOT NULL,
  spent DECIMAL(15,2) DEFAULT 0,
  month DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

INSERT INTO expenses (id, description, amount, category, date) VALUES
(UUID(), 'Office Supplies - Stationery', 2500, 'Office', '2024-01-15'),
(UUID(), 'Team Lunch Meeting', 3200, 'Food', '2024-01-13'),
(UUID(), 'Marketing Campaign - Social Media Ads', 15000, 'Marketing', '2024-01-12'),
(UUID(), 'Software Subscription - Annual', 8500, 'Software', '2024-01-10'),
(UUID(), 'Transportation - Client Visit', 1200, 'Transport', '2024-01-08');

INSERT INTO funds (id, source, amount, date, description) VALUES
(UUID(), 'Investor Fund', 50000, '2024-01-14', 'Series A funding round'),
(UUID(), 'Project Milestone Payment', 70000, '2024-01-10', 'Milestone 1 completion'),
(UUID(), 'Client Payment', 25000, '2024-01-05', 'Project X completion'),
(UUID(), 'Bank Interest', 500, '2024-01-01', 'Monthly interest');
