-- Enable Row Level Security on tables that have policies but RLS disabled
ALTER TABLE public.network_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.storage_providers ENABLE ROW LEVEL SECURITY;