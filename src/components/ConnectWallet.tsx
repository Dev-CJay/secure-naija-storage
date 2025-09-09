import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Wallet, Smartphone, CheckCircle, Shield, Lock } from 'lucide-react';

interface ConnectWalletProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({ isOpen, onClose }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [ndprConsent, setNdprConsent] = useState(false);
  const [showConsent, setShowConsent] = useState(false);

  const handleConnect = async (connectorName: string) => {
    if (!ndprConsent) {
      setShowConsent(true);
      return;
    }

    setLoading(connectorName);
    try {
      // Simulate wallet connection
      if (typeof window !== 'undefined' && (window as any).ethereum) {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        onClose();
      } else {
        // Fallback for demo - simulate successful connection
        setAccount('0x742d35Cc6634C0532925a3b8D33AA6C3642E1234');
        onClose();
      }
    } catch (error) {
      console.error('Wallet connection failed:', error);
    } finally {
      setLoading(null);
    }
  };

  const handleDisconnect = () => {
    setAccount(null);
    onClose();
  };

  if (account) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Wallet Connected
            </DialogTitle>
            <DialogDescription>
              Your wallet is successfully connected to DecoSecure Storage
            </DialogDescription>
          </DialogHeader>
          
          <Card className="bg-gradient-card border-success/20">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Wallet Address</p>
                  <p className="font-mono text-sm">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </p>
                </div>
                <div className="h-3 w-3 bg-success rounded-full animate-pulse" />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-2 pt-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Close
            </Button>
            <Button variant="destructive" onClick={handleDisconnect} className="flex-1">
              Disconnect
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Connect Your Wallet
          </DialogTitle>
          <DialogDescription>
            Connect your wallet to access DecoSecure Storage and manage your files securely
          </DialogDescription>
        </DialogHeader>

        {showConsent && !ndprConsent && (
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-1 shrink-0" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm">Nigeria Data Protection Regulation (NDPR) Compliance</h4>
                  <p className="text-sm text-muted-foreground">
                    By connecting your wallet, you consent to:
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                    <li>• Storing your wallet address for authentication</li>
                    <li>• Processing transaction data for storage operations</li>
                    <li>• Encrypting and securing your data on IPFS network</li>
                    <li>• Compliance with Nigerian data protection laws</li>
                  </ul>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="ndpr-consent" 
                  checked={ndprConsent}
                  onCheckedChange={(checked) => setNdprConsent(checked === true)}
                />
                <label 
                  htmlFor="ndpr-consent" 
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I consent to data processing under NDPR
                </label>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3 pt-4">
          <Button
            variant="wallet"
            size="lg"
            onClick={() => handleConnect('MetaMask')}
            disabled={loading === 'MetaMask' || (showConsent && !ndprConsent)}
            className="w-full justify-start h-14"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Wallet className="h-4 w-4" />
              </div>
              <div className="text-left">
                <div className="font-semibold">MetaMask</div>
                <div className="text-xs text-muted-foreground">Connect using MetaMask wallet</div>
              </div>
            </div>
          </Button>

          <Button
            variant="wallet"
            size="lg"
            onClick={() => handleConnect('WalletConnect')}
            disabled={loading === 'WalletConnect' || (showConsent && !ndprConsent)}
            className="w-full justify-start h-14"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                <Smartphone className="h-4 w-4 text-secondary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">WalletConnect</div>
                <div className="text-xs text-muted-foreground">Connect using mobile wallet</div>
              </div>
            </div>
          </Button>
        </div>

        <div className="flex items-center gap-2 pt-4 text-xs text-muted-foreground">
          <Lock className="h-3 w-3" />
          <span>Your wallet connection is secured and encrypted</span>
        </div>
      </DialogContent>
    </Dialog>
  );
};