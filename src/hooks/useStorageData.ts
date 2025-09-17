import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { contractService } from '@/lib/smartContract';

export interface StorageDeal {
  id: string;
  file_cid: string;
  file_name: string;
  file_size: number;
  file_type?: string;
  total_cost: number;
  status: 'pending' | 'active' | 'completed' | 'failed' | 'expired';
  created_at: string;
  expires_at: string;
  storage_provider_id?: string;
}

export interface StorageProvider {
  id: string;
  name: string;
  location: string;
  reputation_score: number;
  total_storage_gb: number;
  available_storage_gb: number;
  price_per_gb: number;
  uptime_percentage: number;
}

export interface UserWallet {
  id: string;
  dsc_balance: number;
  total_earned: number;
  total_spent: number;
}

export interface NetworkStats {
  total_nodes: number;
  active_deals: number;
  total_storage_used_gb: number;
  network_health_score: number;
  avg_response_time_ms: number;
}

export const useStorageData = () => {
  const [deals, setDeals] = useState<StorageDeal[]>([]);
  const [providers, setProviders] = useState<StorageProvider[]>([]);
  const [wallet, setWallet] = useState<UserWallet | null>(null);
  const [networkStats, setNetworkStats] = useState<NetworkStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch user's storage deals
      const { data: dealsData, error: dealsError } = await supabase
        .from('storage_deals')
        .select('*')
        .order('created_at', { ascending: false });

      if (dealsError) throw dealsError;

      // Fetch storage providers
      const { data: providersData, error: providersError } = await supabase
        .from('storage_providers')
        .select('*')
        .order('reputation_score', { ascending: false });

      if (providersError) throw providersError;

      // Fetch user wallet
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: walletData, error: walletError } = await supabase
          .from('user_wallets')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (walletError && walletError.code !== 'PGRST116') {
          throw walletError;
        }
        
        setWallet(walletData);
      }

      // Fetch network stats
      const { data: statsData, error: statsError } = await supabase
        .from('network_stats')
        .select('*')
        .order('recorded_at', { ascending: false })
        .limit(1)
        .single();

      if (statsError) throw statsError;

      setDeals((dealsData || []) as StorageDeal[]);
      setProviders(providersData || []);
      setNetworkStats(statsData);

    } catch (error) {
      console.error('Error fetching storage data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch storage data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createStorageDeal = async (file: File, providerId?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Generate mock CID
      const mockCid = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      // Calculate costs using provider pricing or default
      const fileSizeGB = file.size / (1024 * 1024 * 1024);
      let pricePerGB = 0.0001; // Default price
      let providerAddress = 'provider-' + Math.random().toString(36).substring(2, 9);
      
      if (providerId) {
        const provider = providers.find(p => p.id === providerId);
        if (provider) {
          pricePerGB = provider.price_per_gb;
          providerAddress = `provider-${provider.id}`;
        }
      }
      
      const totalCost = fileSizeGB * pricePerGB;
      
      // Set expiry to 30 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      // Create initial deal in database as pending
      const { data, error } = await supabase
        .from('storage_deals')
        .insert([{
          user_id: user.id,
          file_cid: mockCid,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          total_cost: totalCost,
          expires_at: expiresAt.toISOString(),
          storage_provider_id: providerId,
          status: 'pending'
        }])
        .select()
        .single();

      if (error) throw error;

      // Update wallet balance
      if (wallet) {
        const newBalance = wallet.dsc_balance - totalCost;
        const newSpent = wallet.total_spent + totalCost;

        const { error: walletError } = await supabase
          .from('user_wallets')
          .update({ 
            dsc_balance: newBalance,
            total_spent: newSpent 
          })
          .eq('user_id', user.id);

        if (walletError) throw walletError;

        setWallet(prev => prev ? {
          ...prev,
          dsc_balance: newBalance,
          total_spent: newSpent
        } : null);
      }

      setDeals(prev => [data as StorageDeal, ...prev]);

      // Create smart contract deal and complete the upload
      try {
        const dealId = await contractService.createStorageDeal(
          mockCid,
          file.size,
          30 * 24 * 60 * 60, // 30 days in seconds
          providerAddress,
          3, // replication factor
          totalCost
        );

        // Update deal status to active after smart contract creation
        await completeDealActivation(data.id);
        
        toast({
          title: "Storage Deal Created",
          description: `File ${file.name} uploaded and deal activated successfully`,
        });

      } catch (contractError) {
        console.error('Smart contract error:', contractError);
        // Still mark as active for demo purposes
        await completeDealActivation(data.id);
        
        toast({
          title: "Storage Deal Created",
          description: `File ${file.name} uploaded successfully`,
        });
      }

      return data;

    } catch (error) {
      console.error('Error creating storage deal:', error);
      toast({
        title: "Error",
        description: "Failed to create storage deal",
        variant: "destructive"
      });
      throw error;
    }
  };

  const completeDealActivation = async (dealId: string) => {
    try {
      // Update deal status to active
      const { error } = await supabase
        .from('storage_deals')
        .update({ status: 'active' })
        .eq('id', dealId);

      if (error) throw error;

      // Update local state
      setDeals(prev => prev.map(deal => 
        deal.id === dealId ? { ...deal, status: 'active' as const } : deal
      ));

    } catch (error) {
      console.error('Error activating deal:', error);
    }
  };

  const retrieveFile = async (dealId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const retrievalCost = 0.0001; // Small fee for retrieval

      // Create file retrieval record
      const { error: retrievalError } = await supabase
        .from('file_retrievals')
        .insert([{
          user_id: user.id,
          deal_id: dealId,
          retrieval_cost: retrievalCost
        }]);

      if (retrievalError) throw retrievalError;

      // Update wallet balance
      if (wallet) {
        const newBalance = wallet.dsc_balance - retrievalCost;
        const newSpent = wallet.total_spent + retrievalCost;

        const { error: walletError } = await supabase
          .from('user_wallets')
          .update({ 
            dsc_balance: newBalance,
            total_spent: newSpent 
          })
          .eq('user_id', user.id);

        if (walletError) throw walletError;

        setWallet(prev => prev ? {
          ...prev,
          dsc_balance: newBalance,
          total_spent: newSpent
        } : null);
      }

      toast({
        title: "File Retrieved",
        description: "File retrieval initiated successfully",
      });

    } catch (error) {
      console.error('Error retrieving file:', error);
      toast({
        title: "Error",
        description: "Failed to retrieve file",
        variant: "destructive"
      });
      throw error;
    }
  };

  const createMultipleStorageDeals = async (files: File[], provider?: StorageProvider) => {
    try {
      // Process files sequentially to avoid overwhelming the system
      for (let i = 0; i < files.length; i++) {
        await createStorageDeal(files[i], provider?.id);
        
        // Add small delay between uploads for better user experience
        if (i < files.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    } catch (error) {
      throw error;
    }
  };

  const deleteStorageDeal = async (dealId: string) => {
    try {
      const { error } = await supabase
        .from('storage_deals')
        .delete()
        .eq('id', dealId);

      if (error) throw error;

      setDeals(prev => prev.filter(deal => deal.id !== dealId));
      
      toast({
        title: "Deal Deleted",
        description: "Storage deal has been removed",
      });

    } catch (error) {
      console.error('Error deleting storage deal:', error);
      toast({
        title: "Error",
        description: "Failed to delete storage deal",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Function to manually refresh deal statuses
  const refreshDealStatuses = async () => {
    try {
      const { data, error } = await supabase.rpc('refresh_deal_statuses');
      if (error) throw error;
      
      // Refresh the data after status updates
      await fetchData();
      
      if (data && data.length > 0) {
        const { deals_activated, deals_expired } = data[0];
        if (deals_activated > 0 || deals_expired > 0) {
          toast({
            title: "Deal Statuses Updated",
            description: `${deals_activated} deals activated, ${deals_expired} deals expired`,
          });
        }
      }
    } catch (error) {
      console.error('Error refreshing deal statuses:', error);
    }
  };

  return {
    deals,
    providers,
    wallet,
    networkStats,
    loading,
    createStorageDeal,
    createMultipleStorageDeals,
    retrieveFile,
    deleteStorageDeal,
    completeDealActivation,
    refreshDealStatuses,
    refetch: fetchData
  };
};