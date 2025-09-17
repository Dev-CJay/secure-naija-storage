-- Add background process to update deal statuses from pending to active
-- Create a function to simulate deal processing and activation

CREATE OR REPLACE FUNCTION public.process_pending_deals()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
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

-- Create a simple trigger to auto-process deals
-- Note: In production, this would be better handled by a background job
CREATE OR REPLACE FUNCTION public.auto_process_deals_trigger()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Call the processing function when a new deal is created
  PERFORM public.process_pending_deals();
  RETURN NEW;
END;
$$;

-- Create trigger that runs after insert
DROP TRIGGER IF EXISTS trigger_auto_process_deals ON public.storage_deals;
CREATE TRIGGER trigger_auto_process_deals
  AFTER INSERT ON public.storage_deals
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_process_deals_trigger();

-- Also create a function that can be called manually to process deals
CREATE OR REPLACE FUNCTION public.refresh_deal_statuses()
RETURNS TABLE(
  deals_activated integer,
  deals_expired integer
)
LANGUAGE plpgsql
SECURITY DEFINER
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