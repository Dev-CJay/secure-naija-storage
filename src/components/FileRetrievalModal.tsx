import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { StorageDeal } from '@/hooks/useStorageData';
import { 
  Download, 
  FileText, 
  Clock, 
  DollarSign,
  CheckCircle,
  AlertTriangle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileRetrievalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal: StorageDeal | null;
  onRetrieve: (dealId: string) => Promise<void>;
}

export const FileRetrievalModal: React.FC<FileRetrievalModalProps> = ({
  open,
  onOpenChange,
  deal,
  onRetrieve
}) => {
  const { toast } = useToast();
  const [retrieving, setRetrieving] = useState(false);
  const [retrievalProgress, setRetrievalProgress] = useState(0);
  const [retrievalStage, setRetrievalStage] = useState<string>('');

  const retrievalCost = 0.0001; // Small fee for retrieval

  const handleRetrieve = async () => {
    if (!deal) return;

    setRetrieving(true);
    setRetrievalProgress(0);

    try {
      // Simulate retrieval stages
      const stages = [
        'Locating file on network...',
        'Verifying file integrity...',
        'Establishing connection to storage node...',
        'Downloading file...',
        'Decrypting and preparing file...'
      ];

      for (let i = 0; i < stages.length; i++) {
        setRetrievalStage(stages[i]);
        setRetrievalProgress((i + 1) * 20);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      await onRetrieve(deal.id);
      
      setRetrievalProgress(100);
      setRetrievalStage('File ready for download!');
      
      // Simulate download
      setTimeout(() => {
        const blob = new Blob(['Mock file content for: ' + deal.file_name], { 
          type: deal.file_type || 'application/octet-stream' 
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = deal.file_name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
          title: "File Retrieved",
          description: `${deal.file_name} has been downloaded successfully`,
        });

        setTimeout(() => {
          setRetrieving(false);
          setRetrievalProgress(0);
          setRetrievalStage('');
          onOpenChange(false);
        }, 1000);
      }, 1000);

    } catch (error) {
      console.error('Retrieval failed:', error);
      toast({
        title: "Retrieval Failed",
        description: "Failed to retrieve file. Please try again.",
        variant: "destructive"
      });
      setRetrieving(false);
      setRetrievalProgress(0);
      setRetrievalStage('');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDealStatus = (deal: StorageDeal) => {
    const now = new Date();
    const expiresAt = new Date(deal.expires_at);
    
    if (deal.status === 'failed') return 'failed';
    if (expiresAt < now) return 'expired';
    return deal.status;
  };

  const canRetrieve = (deal: StorageDeal) => {
    const status = getDealStatus(deal);
    return status === 'active' || status === 'completed';
  };

  if (!deal) return null;

  const status = getDealStatus(deal);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5 text-primary" />
            Retrieve File
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* File Info */}
          <div className="bg-muted/50 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold">{deal.file_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatFileSize(deal.file_size)} • {deal.file_type || 'Unknown type'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Status</p>
                <Badge 
                  variant={status === 'active' ? 'default' : status === 'failed' ? 'destructive' : 'outline'}
                >
                  {status}
                </Badge>
              </div>
              <div>
                <p className="text-muted-foreground">Deal Cost</p>
                <p className="font-mono">{deal.total_cost.toFixed(6)} DSC</p>
              </div>
            </div>

            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">
                CID: {deal.file_cid.slice(0, 12)}...{deal.file_cid.slice(-8)}
              </p>
            </div>
          </div>

          {/* Retrieval Cost */}
          <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Retrieval Fee</span>
            </div>
            <span className="font-mono text-primary">{retrievalCost.toFixed(6)} DSC</span>
          </div>

          {/* Status Messages */}
          {!canRetrieve(deal) && (
            <div className="flex items-center gap-2 p-3 bg-destructive/10 rounded-lg">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <p className="text-sm text-destructive">
                {status === 'expired' && 'This storage deal has expired'}
                {status === 'failed' && 'This storage deal has failed'}
                {status === 'pending' && 'Storage deal is still pending activation'}
              </p>
            </div>
          )}

          {/* Retrieval Progress */}
          {retrieving && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm font-medium">Retrieving file...</span>
              </div>
              <Progress value={retrievalProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">{retrievalStage}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={retrieving}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleRetrieve}
            disabled={!canRetrieve(deal) || retrieving}
            className="min-w-32"
          >
            {retrieving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Retrieving...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Retrieve File
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};