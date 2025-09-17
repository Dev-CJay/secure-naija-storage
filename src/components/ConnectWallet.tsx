import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Wallet, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { contractService } from '@/lib/smartContract';

interface ConnectWalletProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onWalletConnected?: (address: string) => void;
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({
  open,
  onOpenChange,
  onWalletConnected
}) => {
  const { toast } = useToast();
  const [connecting, setConnecting] = useState(false);
  const [connectedAddress, setConnectedAddress] = useState<string | null>(null);

  const connectMetaMask = async () => {
    setConnecting(true);
    try {
      const address = await contractService.connectWallet();
      if (address) {
        setConnectedAddress(address);
        onWalletConnected?.(address);
        toast({
          title: "Wallet Connected",
          description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
        });
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to MetaMask. Please try again.",
        variant: "destructive"
      });
    } finally {
      setConnecting(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Connect Wallet
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {connectedAddress ? (
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center">
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <div>
                <h3 className="font-semibold">Wallet Connected</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {formatAddress(connectedAddress)}
                </p>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Connected
              </Badge>
            </div>
          ) : (
            <>
              <div className="text-center text-sm text-muted-foreground">
                Connect your wallet to interact with storage deals and smart contracts
              </div>

              <div className="space-y-3">
                <Button
                  onClick={connectMetaMask}
                  disabled={connecting}
                  className="w-full justify-between"
                  variant="outline"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">M</span>
                    </div>
                    <span>MetaMask</span>
                  </div>
                  {connecting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                  ) : (
                    <ExternalLink className="h-4 w-4" />
                  )}
                </Button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Coming Soon
                    </span>
                  </div>
                </div>

                <Button
                  disabled
                  className="w-full justify-between opacity-50"
                  variant="outline"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">W</span>
                    </div>
                    <span>WalletConnect</span>
                  </div>
                  <AlertCircle className="h-4 w-4" />
                </Button>
              </div>

              <div className="text-xs text-muted-foreground space-y-2">
                <p>
                  By connecting your wallet, you agree to our Terms of Service and Privacy Policy.
                </p>
                <p>
                  Make sure you trust this site before connecting your wallet.
                </p>
              </div>
            </>
          )}

          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              {connectedAddress ? 'Close' : 'Cancel'}
            </Button>
            {connectedAddress && (
              <Button onClick={() => onOpenChange(false)}>
                Continue
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};