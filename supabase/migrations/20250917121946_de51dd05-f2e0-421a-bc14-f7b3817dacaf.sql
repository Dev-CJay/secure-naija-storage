-- Fix security issues by adding proper search paths and enabling RLS
-- Update functions to have secure search paths

-- Fix function search paths
CREATE OR REPLACE FUNCTION public.process_pending_deals()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update deals that have been pending for more than 30 seconds to active
  UPDATE public.storage_deals
  SET status = 'active'
  WHERE status = 'pending' 
    AND created_at < NOW() - INTERVAL '30 seconds'
    AND created_at > NOW() - INTERVAL '1 hour'; -- Only recent deals
    
  -- Update deals that have been active and are past expiry to expired
  UPDATE public.storage_deals
  SET status = 'expired'
  WHERE status = 'active'
    AND expires_at < NOW();
    
END;
$$;

CREATE OR REPLACE FUNCTION public.auto_process_deals_trigger()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  -- Call the processing function when a new deal is created
  PERFORM public.process_pending_deals();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.refresh_deal_statuses()
RETURNS TABLE(
  deals_activated integer,
  deals_expired integer
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  activated_count integer := 0;
  expired_count integer := 0;
BEGIN
  -- Count and update pending to active
  SELECT COUNT(*) INTO activated_count
  FROM public.storage_deals
  WHERE status = 'pending' 
    AND created_at < NOW() - INTERVAL '30 seconds';
    
  UPDATE public.storage_deals
  SET status = 'active'
  WHERE status = 'pending' 
    AND created_at < NOW() - INTERVAL '30 seconds';
    
  -- Count and update active to expired
  SELECT COUNT(*) INTO expired_count
  FROM public.storage_deals
  WHERE status = 'active'
    AND expires_at < NOW();
    
  UPDATE public.storage_deals
  SET status = 'expired'
  WHERE status = 'active'
    AND expires_at < NOW();
    
  RETURN QUERY SELECT activated_count, expired_count;
END;
$$;

-- Fix the handle_new_user function search path
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_wallets (user_id, dsc_balance, total_earned, total_spent)
  VALUES (NEW.id, 100.0000, 0.0000, 0.0000);
  RETURN NEW;
END;
$$;