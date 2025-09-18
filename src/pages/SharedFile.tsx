import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Download, Eye, Lock, Calendar, AlertCircle, FileText, Image, Video, Music } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SharedFileData {
  id: string;
  fileName: string;
  fileCid: string;
  fileSize: number;
  fileType: string;
  expiresAt: string;
  accessCount: number;
  maxAccess?: number;
  password?: string;
  allowDownload: boolean;
  created: string;
}

export const SharedFile: React.FC = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [fileData, setFileData] = useState<SharedFileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [passwordRequired, setPasswordRequired] = useState(false);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (shareId) {
      loadSharedFile();
    }
  }, [shareId]);

  const loadSharedFile = async () => {
    try {
      setLoading(true);
      
      // Mock data - replace with actual API call
      const mockFileData: SharedFileData = {
        id: shareId || '',
        fileName: 'sample-document.pdf',
        fileCid: 'QmExampleCID123',
        fileSize: 2048576,
        fileType: 'application/pdf',
        expiresAt: '2024-12-31',
        accessCount: 5,
        maxAccess: 10,
        password: 'secret123',
        allowDownload: true,
        created: '2024-09-01'
      };

      setFileData(mockFileData);
      
      // Check if password is required
      if (mockFileData.password) {
        setPasswordRequired(true);
      } else {
        setAuthenticated(true);
        generateFileUrl(mockFileData);
      }
      
    } catch (error) {
      setError('Failed to load shared file');
    } finally {
      setLoading(false);
    }
  };

  const generateFileUrl = (data: SharedFileData) => {
    // Generate a mock file URL based on file type
    if (data.fileType.startsWith('image/')) {
      setFileUrl('https://picsum.photos/800/600');
    } else if (data.fileType.startsWith('video/')) {
      setFileUrl('https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4');
    } else {
      // For other file types, create a downloadable blob URL
      const content = `Mock content for ${data.fileName}`;
      const blob = new Blob([content], { type: data.fileType });
      setFileUrl(URL.createObjectURL(blob));
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!fileData) return;
    
    if (password === fileData.password) {
      setAuthenticated(true);
      setPasswordRequired(false);
      generateFileUrl(fileData);
      
      toast({
        title: "Access Granted",
        description: "Password verified successfully",
      });
    } else {
      toast({
        title: "Access Denied",
        description: "Incorrect password",
        variant: "destructive"
      });
    }
  };

  const handleDownload = () => {
    if (!fileData || !fileUrl) return;

    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileData.fileName;
    link.style.display = 'none';
    
    // Set proper content type for download
    if (fileData.fileType.includes('image')) {
      link.type = fileData.fileType;
    }
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download Started",
      description: `Downloading ${fileData.fileName}`,
    });
  };

  const handlePreview = () => {
    setShowPreview(true);
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <Image className="h-6 w-6" />;
    if (fileType.startsWith('video/')) return <Video className="h-6 w-6" />;
    if (fileType.startsWith('audio/')) return <Music className="h-6 w-6" />;
    return <FileText className="h-6 w-6" />;
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const isExpired = fileData ? new Date(fileData.expiresAt) < new Date() : false;
  const isAccessLimitReached = fileData && fileData.maxAccess ? fileData.accessCount >= fileData.maxAccess : false;

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading shared file...</p>
        </div>
      </div>
    );
  }

  if (error || !fileData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              File Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {error || 'The shared file could not be found or may have been removed.'}
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isExpired || isAccessLimitReached) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="h-5 w-5" />
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {isExpired ? 'This shared file has expired.' : 'This shared file has reached its access limit.'}
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (passwordRequired && !authenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Password Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Enter Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter the file password"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Access File
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              {getFileIcon(fileData.fileType)}
              <div>
                <div className="text-xl">{fileData.fileName}</div>
                <div className="text-sm text-muted-foreground font-normal">
                  Shared via DecoSecure
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* File Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">File Size:</span>
                <div className="font-medium">{formatFileSize(fileData.fileSize)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">File Type:</span>
                <div className="font-medium">{fileData.fileType}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Expires:</span>
                <div className="font-medium flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {new Date(fileData.expiresAt).toLocaleDateString()}
                </div>
              </div>
              <div>
                <span className="text-muted-foreground">Access Count:</span>
                <div className="font-medium">
                  {fileData.accessCount}
                  {fileData.maxAccess && ` / ${fileData.maxAccess}`}
                </div>
              </div>
            </div>

            {/* File Preview/Actions */}
            <div className="space-y-4">
              {fileData.fileType.startsWith('image/') && fileUrl && (
                <div className="border rounded-lg overflow-hidden">
                  <img 
                    src={fileUrl} 
                    alt={fileData.fileName}
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>
              )}

              <div className="flex gap-3">
                {fileData.fileType.startsWith('image/') ? (
                  <Button onClick={handlePreview} variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Full Size
                  </Button>
                ) : (
                  <Button onClick={handlePreview} variant="outline" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                )}
                
                {fileData.allowDownload && (
                  <Button onClick={handleDownload} className="flex-1">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            </div>

            {/* Security Info */}
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Lock className="h-4 w-4" />
                Security Information
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                <div className="flex justify-between">
                  <span>Password Protected:</span>
                  <Badge variant={fileData.password ? 'default' : 'secondary'}>
                    {fileData.password ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Download Allowed:</span>
                  <Badge variant={fileData.allowDownload ? 'default' : 'secondary'}>
                    {fileData.allowDownload ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview Modal */}
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent className="max-w-4xl max-h-[90vh]">
            <DialogHeader>
              <DialogTitle>{fileData.fileName}</DialogTitle>
            </DialogHeader>
            <div className="overflow-auto">
              {fileData.fileType.startsWith('image/') && fileUrl && (
                <img 
                  src={fileUrl} 
                  alt={fileData.fileName}
                  className="w-full h-auto"
                />
              )}
              {fileData.fileType.startsWith('video/') && fileUrl && (
                <video 
                  src={fileUrl} 
                  controls
                  className="w-full h-auto"
                >
                  Your browser does not support the video tag.
                </video>
              )}
              {!fileData.fileType.startsWith('image/') && !fileData.fileType.startsWith('video/') && (
                <div className="text-center py-8">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Preview not available for this file type. Please download to view.
                  </p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};