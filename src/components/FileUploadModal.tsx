import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ProviderSelection } from './ProviderSelection';
import { StorageProvider } from '@/hooks/useStorageData';
import { 
  Upload, 
  FileText, 
  X, 
  CheckCircle, 
  AlertCircle,
  DollarSign,
  Clock,
  HardDrive
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  providers: StorageProvider[];
  onUpload: (files: File[], provider?: StorageProvider) => Promise<void>;
}

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  open,
  onOpenChange,
  providers,
  onUpload
}) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedProvider, setSelectedProvider] = useState<StorageProvider | undefined>();
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(files);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setSelectedFiles(files);
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const removeFile = (index: number) => {
    setSelectedFiles(files => files.filter((_, i) => i !== index));
  };

  const calculateTotalCost = () => {
    const totalSizeGB = selectedFiles.reduce((acc, file) => acc + file.size, 0) / (1024 * 1024 * 1024);
    const pricePerGB = selectedProvider?.price_per_gb || 0.0001;
    return totalSizeGB * pricePerGB;
  };

  const calculateDealDuration = () => {
    return 30; // 30 days default
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress with more realistic stages
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 85) {
            clearInterval(progressInterval);
            return 85;
          }
          return prev + Math.random() * 15 + 5; // Variable progress
        });
      }, 300);

      // Actually process the upload
      await onUpload(selectedFiles, selectedProvider);
      
      clearInterval(progressInterval);
      setUploadProgress(95);
      
      // Final completion phase
      setTimeout(() => {
        setUploadProgress(100);
        setTimeout(() => {
          setSelectedFiles([]);
          setSelectedProvider(undefined);
          setUploadProgress(0);
          setUploading(false);
          onOpenChange(false);
          
          toast({
            title: "Upload Complete",
            description: `${selectedFiles.length} file(s) uploaded and deals activated successfully`,
          });
        }, 800);
      }, 500);

    } catch (error) {
      console.error('Upload failed:', error);
      setUploading(false);
      toast({
        title: "Upload Failed",
        description: "Failed to create storage deals. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Create Storage Deal
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto space-y-6">
          {/* File Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Select Files</h3>
            <div 
              className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-2">
                Drag and drop files here or click to browse
              </p>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
                accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.mp4,.mp3"
              />
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
              >
                Select Files
              </Button>
            </div>

            {/* Selected Files */}
            {selectedFiles.length > 0 && (
              <div className="mt-4 space-y-2">
                <h4 className="font-medium">Selected Files ({selectedFiles.length})</h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-md">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{file.name}</span>
                        <Badge variant="outline" className="text-xs">
                          {formatFileSize(file.size)}
                        </Badge>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => removeFile(index)}
                        disabled={uploading}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Provider Selection */}
          {selectedFiles.length > 0 && (
            <ProviderSelection
              providers={providers}
              onSelect={setSelectedProvider}
              selectedProvider={selectedProvider}
            />
          )}

          {/* Deal Summary */}
          {selectedFiles.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold mb-3">Deal Summary</h3>
                <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <HardDrive className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Total Size</p>
                        <p className="font-semibold">
                          {formatFileSize(selectedFiles.reduce((acc, file) => acc + file.size, 0))}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="font-semibold">{calculateDealDuration()} days</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-xs text-muted-foreground">Total Cost</p>
                        <p className="font-semibold text-primary">
                          {calculateTotalCost().toFixed(6)} DSC
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {selectedProvider && (
                    <div className="mt-3 p-2 bg-primary/10 rounded-md">
                      <p className="text-xs text-primary">
                        Provider: {selectedProvider.name} • {selectedProvider.location}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {uploadProgress < 30 ? 'Uploading files...' :
                   uploadProgress < 70 ? 'Creating smart contracts...' :
                   uploadProgress < 95 ? 'Activating storage deals...' :
                   'Finalizing...'}
                </span>
                <span className="text-sm text-muted-foreground">{Math.round(uploadProgress)}%</span>
              </div>
              <Progress value={uploadProgress} className="h-3" />
              <div className="text-xs text-muted-foreground">
                {uploadProgress < 95 ? 
                  `Processing ${selectedFiles.length} file(s) with ${selectedProvider?.name || 'default provider'}` :
                  'Upload complete! Redirecting...'
                }
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={uploading}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleUpload}
            disabled={selectedFiles.length === 0 || uploading}
            className="min-w-32"
          >
            {uploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                Creating...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Create Deal
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};