-- ============================================
-- Sport.Fun Portfolio Database Schema
-- ============================================
-- This schema supports tracking NFL and Football player shares,
-- trades, portfolio performance, and PNL calculations.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CORE TABLES
-- ============================================

-- Players table: Stores all available players in the game
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  display_name TEXT NOT NULL UNIQUE,
  game_type TEXT NOT NULL CHECK (game_type IN ('NFL', 'Football')),
  pack_batch INTEGER NOT NULL DEFAULT 1,
  release_batch INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Player prices table: Historical price data for players
CREATE TABLE IF NOT EXISTS player_prices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  price_usd DECIMAL(20, 8) NOT NULL,
  price_gold DECIMAL(20, 8) NOT NULL, -- GOLD = USDC
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio holdings table: Your current share holdings
CREATE TABLE IF NOT EXISTS portfolio_holdings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  shares DECIMAL(20, 8) NOT NULL DEFAULT 0,
  avg_cost DECIMAL(20, 8) NOT NULL DEFAULT 0,
  label TEXT CHECK (label IN ('KEEP', 'WATCH', 'SELL')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id)
);

-- Trades table: All buy/sell transactions
CREATE TABLE IF NOT EXISTS trades (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  action TEXT NOT NULL CHECK (action IN ('Buy', 'Sell', 'Transfer')),
  shares DECIMAL(20, 8) NOT NULL,
  price_per_share DECIMAL(20, 8) NOT NULL,
  fees DECIMAL(20, 8) NOT NULL DEFAULT 0,
  gross_amount DECIMAL(20, 8) NOT NULL, -- shares * price
  net_amount DECIMAL(20, 8) NOT NULL, -- gross - fees
  realised_pnl DECIMAL(20, 8) DEFAULT 0, -- Only for sells
  notes TEXT,
  trade_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Portfolio snapshots table: Daily portfolio value snapshots
CREATE TABLE IF NOT EXISTS portfolio_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  snapshot_date DATE NOT NULL UNIQUE,
  holdings_value DECIMAL(20, 8) NOT NULL DEFAULT 0,
  net_cash DECIMAL(20, 8) NOT NULL DEFAULT 0,
  unrealised_pnl DECIMAL(20, 8) NOT NULL DEFAULT 0,
  realised_pnl DECIMAL(20, 8) NOT NULL DEFAULT 0,
  total_deposited DECIMAL(20, 8) NOT NULL DEFAULT 0,
  total_withdrawn DECIMAL(20, 8) NOT NULL DEFAULT 0,
  total_fees DECIMAL(20, 8) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cash transactions table: Deposits, withdrawals, transfers
CREATE TABLE IF NOT EXISTS cash_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_type TEXT NOT NULL CHECK (transaction_type IN ('Deposit', 'Withdrawal', 'Transfer')),
  amount DECIMAL(20, 8) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  notes TEXT,
  transaction_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES for Performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_player_prices_player_id ON player_prices(player_id);
CREATE INDEX IF NOT EXISTS idx_player_prices_timestamp ON player_prices(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_portfolio_holdings_player_id ON portfolio_holdings(player_id);
CREATE INDEX IF NOT EXISTS idx_trades_player_id ON trades(player_id);
CREATE INDEX IF NOT EXISTS idx_trades_trade_date ON trades(trade_date DESC);
CREATE INDEX IF NOT EXISTS idx_players_display_name ON players(display_name);
CREATE INDEX IF NOT EXISTS idx_players_game_type ON players(game_type);

-- ============================================
-- VIEWS (Matching your code expectations)
-- ============================================

-- Portfolio Snapshot View: Current holdings with latest prices
CREATE OR REPLACE VIEW v_portfolio_snapshot AS
SELECT 
  p.display_name,
  ph.shares,
  pp.price_usd,
  (ph.shares * pp.price_usd) AS value_usd,
  ph.avg_cost,
  ((ph.shares * pp.price_usd) - (ph.shares * ph.avg_cost)) AS unrealised_pnl,
  COALESCE(ph.label, 'WATCH') AS label,
  p.release_batch,
  p.pack_batch
FROM portfolio_holdings ph
INNER JOIN players p ON ph.player_id = p.id
LEFT JOIN LATERAL (
  SELECT price_usd
  FROM player_prices
  WHERE player_id = p.id
  ORDER BY timestamp DESC
  LIMIT 1
) pp ON true
WHERE ph.shares > 0;

-- Portfolio Totals View: Aggregate portfolio metrics
CREATE OR REPLACE VIEW v_portfolio_totals AS
SELECT 
  COALESCE(SUM(ph.shares * pp.price_usd), 0) AS holdings_value,
  COALESCE((
    SELECT SUM(CASE WHEN transaction_type = 'Deposit' THEN amount ELSE -amount END)
    FROM cash_transactions
  ), 0) AS net_cash,
  COALESCE(SUM((ph.shares * pp.price_usd) - (ph.shares * ph.avg_cost)), 0) AS unrealised_pnl,
  COALESCE(SUM(t.realised_pnl), 0) AS realised_pnl,
  COALESCE((
    SELECT SUM(amount)
    FROM cash_transactions
    WHERE transaction_type = 'Deposit'
  ), 0) AS total_deposited,
  COALESCE(SUM(t.fees), 0) AS total_fees
FROM portfolio_holdings ph
INNER JOIN players p ON ph.player_id = p.id
LEFT JOIN LATERAL (
  SELECT price_usd
  FROM player_prices
  WHERE player_id = p.id
  ORDER BY timestamp DESC
  LIMIT 1
) pp ON true
LEFT JOIN trades t ON t.player_id = p.id AND t.action = 'Sell';

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update player's latest price
CREATE OR REPLACE FUNCTION update_player_price(
  p_player_name TEXT,
  p_price_usd DECIMAL,
  p_price_gold DECIMAL DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_player_id UUID;
  v_price_gold DECIMAL;
BEGIN
  -- Get or create player
  SELECT id INTO v_player_id FROM players WHERE display_name = p_player_name;
  
  IF v_player_id IS NULL THEN
    RAISE EXCEPTION 'Player % not found', p_player_name;
  END IF;
  
  -- Use provided GOLD price or calculate from USD (assuming 1:1 for now)
  v_price_gold := COALESCE(p_price_gold, p_price_usd);
  
  -- Insert new price record
  INSERT INTO player_prices (player_id, price_usd, price_gold)
  VALUES (v_player_id, p_price_usd, v_price_gold)
  RETURNING id INTO v_player_id;
  
  RETURN v_player_id;
END;
$$ LANGUAGE plpgsql;

-- Function to record a trade
CREATE OR REPLACE FUNCTION record_trade(
  p_player_name TEXT,
  p_action TEXT,
  p_shares DECIMAL,
  p_price DECIMAL,
  p_fees DECIMAL DEFAULT 0,
  p_notes TEXT DEFAULT NULL,
  p_trade_date DATE DEFAULT CURRENT_DATE
)
RETURNS UUID AS $$
DECLARE
  v_player_id UUID;
  v_trade_id UUID;
  v_gross DECIMAL;
  v_net DECIMAL;
  v_realised_pnl DECIMAL := 0;
  v_current_avg_cost DECIMAL;
  v_current_shares DECIMAL;
BEGIN
  -- Get player ID
  SELECT id INTO v_player_id FROM players WHERE display_name = p_player_name;
  
  IF v_player_id IS NULL THEN
    RAISE EXCEPTION 'Player % not found', p_player_name;
  END IF;
  
  -- Calculate gross and net
  v_gross := p_shares * p_price;
  v_net := v_gross - p_fees;
  
  -- Get current holdings
  SELECT COALESCE(shares, 0), COALESCE(avg_cost, 0)
  INTO v_current_shares, v_current_avg_cost
  FROM portfolio_holdings
  WHERE player_id = v_player_id;
  
  -- Handle buy
  IF p_action = 'Buy' THEN
    -- Update or insert holdings with weighted average
    INSERT INTO portfolio_holdings (player_id, shares, avg_cost)
    VALUES (
      v_player_id,
      v_current_shares + p_shares,
      CASE 
        WHEN v_current_shares + p_shares > 0 
        THEN ((v_current_shares * v_current_avg_cost) + (p_shares * p_price)) / (v_current_shares + p_shares)
        ELSE p_price
      END
    )
    ON CONFLICT (player_id) DO UPDATE SET
      shares = portfolio_holdings.shares + p_shares,
      avg_cost = CASE 
        WHEN portfolio_holdings.shares + p_shares > 0
        THEN ((portfolio_holdings.shares * portfolio_holdings.avg_cost) + (p_shares * p_price)) / (portfolio_holdings.shares + p_shares)
        ELSE portfolio_holdings.avg_cost
      END,
      updated_at = NOW();
  
  -- Handle sell
  ELSIF p_action = 'Sell' THEN
    IF v_current_shares < p_shares THEN
      RAISE EXCEPTION 'Insufficient shares. Current: %, Requested: %', v_current_shares, p_shares;
    END IF;
    
    -- Calculate realised PnL
    v_realised_pnl := (p_price - v_current_avg_cost) * p_shares - p_fees;
    
    -- Update holdings
    UPDATE portfolio_holdings
    SET shares = shares - p_shares,
        updated_at = NOW()
    WHERE player_id = v_player_id;
    
    -- Remove holdings if shares reach zero
    DELETE FROM portfolio_holdings WHERE player_id = v_player_id AND shares <= 0;
  END IF;
  
  -- Insert trade record
  INSERT INTO trades (
    player_id, action, shares, price_per_share, fees,
    gross_amount, net_amount, realised_pnl, notes, trade_date
  )
  VALUES (
    v_player_id, p_action, p_shares, p_price, p_fees,
    v_gross, v_net, v_realised_pnl, p_notes, p_trade_date
  )
  RETURNING id INTO v_trade_id;
  
  RETURN v_trade_id;
END;
$$ LANGUAGE plpgsql;

-- Function to create daily snapshot
CREATE OR REPLACE FUNCTION create_daily_snapshot(p_date DATE DEFAULT CURRENT_DATE)
RETURNS UUID AS $$
DECLARE
  v_snapshot_id UUID;
  v_holdings_value DECIMAL;
  v_unrealised_pnl DECIMAL;
  v_realised_pnl DECIMAL;
  v_total_deposited DECIMAL;
  v_total_withdrawn DECIMAL;
  v_total_fees DECIMAL;
  v_net_cash DECIMAL;
BEGIN
  -- Calculate totals from views
  SELECT 
    COALESCE(holdings_value, 0),
    COALESCE(unrealised_pnl, 0),
    COALESCE(realised_pnl, 0),
    COALESCE(net_cash, 0)
  INTO v_holdings_value, v_unrealised_pnl, v_realised_pnl, v_net_cash
  FROM v_portfolio_totals;
  
  -- Get cash transaction totals
  SELECT 
    COALESCE(SUM(CASE WHEN transaction_type = 'Deposit' THEN amount ELSE 0 END), 0),
    COALESCE(SUM(CASE WHEN transaction_type = 'Withdrawal' THEN amount ELSE 0 END), 0)
  INTO v_total_deposited, v_total_withdrawn
  FROM cash_transactions;
  
  -- Get total fees
  SELECT COALESCE(SUM(fees), 0)
  INTO v_total_fees
  FROM trades;
  
  -- Insert or update snapshot
  INSERT INTO portfolio_snapshots (
    snapshot_date, holdings_value, net_cash, unrealised_pnl,
    realised_pnl, total_deposited, total_withdrawn, total_fees
  )
  VALUES (
    p_date, v_holdings_value, v_net_cash, v_unrealised_pnl,
    v_realised_pnl, v_total_deposited, v_total_withdrawn, v_total_fees
  )
  ON CONFLICT (snapshot_date) DO UPDATE SET
    holdings_value = EXCLUDED.holdings_value,
    net_cash = EXCLUDED.net_cash,
    unrealised_pnl = EXCLUDED.unrealised_pnl,
    realised_pnl = EXCLUDED.realised_pnl,
    total_deposited = EXCLUDED.total_deposited,
    total_withdrawn = EXCLUDED.total_withdrawn,
    total_fees = EXCLUDED.total_fees
  RETURNING id INTO v_snapshot_id;
  
  RETURN v_snapshot_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_players_updated_at
  BEFORE UPDATE ON players
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_portfolio_holdings_updated_at
  BEFORE UPDATE ON portfolio_holdings
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Uncomment to insert sample data for testing
/*
-- Sample players
INSERT INTO players (display_name, game_type, pack_batch, release_batch) VALUES
('P.Mahomes', 'NFL', 1, 3),
('J.Jefferson', 'NFL', 1, 1),
('A.St. Brown', 'NFL', 1, 1)
ON CONFLICT (display_name) DO NOTHING;
*/

