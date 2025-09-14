-- Create storage deals table for file storage contracts
CREATE TABLE public.storage_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  file_cid TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT,
  deal_duration INTEGER NOT NULL DEFAULT 2592000, -- 30 days in seconds
  price_per_gb DECIMAL(10,4) NOT NULL DEFAULT 0.0001,
  total_cost DECIMAL(10,4) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'failed', 'expired')),
  storage_provider_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  last_verified TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage providers table
CREATE TABLE public.storage_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  reputation_score INTEGER DEFAULT 100 CHECK (reputation_score >= 0 AND reputation_score <= 100),
  total_storage_gb BIGINT NOT NULL,
  available_storage_gb BIGINT NOT NULL,
  price_per_gb DECIMAL(10,4) NOT NULL,
  uptime_percentage DECIMAL(5,2) DEFAULT 99.9,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_online TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user wallets table for token balances
CREATE TABLE public.user_wallets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  dsc_balance DECIMAL(18,8) DEFAULT 0.0000 NOT NULL,
  total_earned DECIMAL(18,8) DEFAULT 0.0000 NOT NULL,
  total_spent DECIMAL(18,8) DEFAULT 0.0000 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create file retrievals table for tracking downloads
CREATE TABLE public.file_retrievals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID REFERENCES public.storage_deals(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  retrieval_cost DECIMAL(10,4) DEFAULT 0.0000,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Create network statistics table
CREATE TABLE public.network_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_nodes INTEGER NOT NULL DEFAULT 0,
  active_deals INTEGER NOT NULL DEFAULT 0,
  total_storage_used_gb BIGINT NOT NULL DEFAULT 0,
  network_health_score INTEGER NOT NULL DEFAULT 100 CHECK (network_health_score >= 0 AND network_health_score <= 100),
  avg_response_time_ms INTEGER NOT NULL DEFAULT 250,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample storage providers
INSERT INTO public.storage_providers (name, location, total_storage_gb, available_storage_gb, price_per_gb, uptime_percentage) VALUES
('Lagos Storage Node', 'Lagos, Nigeria', 10000, 7500, 0.0001, 99.8),
('Abuja Data Center', 'Abuja, Nigeria', 15000, 12000, 0.00012, 99.9),
('Kano Storage Hub', 'Kano, Nigeria', 8000, 6000, 0.00009, 99.7),
('Port Harcourt Node', 'Port Harcourt, Nigeria', 12000, 9500, 0.00011, 99.6),
('Ibadan Storage Farm', 'Ibadan, Nigeria', 20000, 16000, 0.0001, 99.9);

-- Insert initial network stats
INSERT INTO public.network_stats (total_nodes, active_deals, total_storage_used_gb, network_health_score, avg_response_time_ms) 
VALUES (8429, 156789, 2456789, 98, 245);

-- Enable Row Level Security
ALTER TABLE public.storage_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.file_retrievals ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for storage_deals
CREATE POLICY "Users can view their own storage deals" ON public.storage_deals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own storage deals" ON public.storage_deals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own storage deals" ON public.storage_deals
  FOR UPDATE USING (auth.uid() = user_id);

-- Create RLS policies for user_wallets  
CREATE POLICY "Users can view their own wallet" ON public.user_wallets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own wallet" ON public.user_wallets
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own wallet" ON public.user_wallets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for file_retrievals
CREATE POLICY "Users can view their own file retrievals" ON public.file_retrievals
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own file retrievals" ON public.file_retrievals
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Allow everyone to read storage providers and network stats (public data)
CREATE POLICY "Anyone can view storage providers" ON public.storage_providers
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view network stats" ON public.network_stats
  FOR SELECT USING (true);

-- Create function to automatically create wallet for new users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_wallets (user_id, dsc_balance, total_earned, total_spent)
  VALUES (NEW.id, 100.0000, 0.0000, 0.0000);
  RETURN NEW;
END;
$$;

-- Create trigger to auto-create wallet for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update wallet timestamps
CREATE OR REPLACE FUNCTION public.update_wallet_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for wallet updates
CREATE TRIGGER update_user_wallets_updated_at
  BEFORE UPDATE ON public.user_wallets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_wallet_updated_at();