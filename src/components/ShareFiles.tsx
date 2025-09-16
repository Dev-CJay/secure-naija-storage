import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Share, 
  Copy, 
  QrCode, 
  Clock, 
  Shield, 
  Eye,
  Download,
  Users,
  Link,
  CheckCircle,
  Calendar,
  FileText
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useStorageData } from '@/hooks/useStorageData';

interface ShareFilesProps {
  onClose: () => void;
}

interface ShareLink {
  id: string;
  fileName: string;
  fileCid: string;
  shareUrl: string;
  expiresAt: string;
  accessCount: number;
  maxAccess?: number;
  password?: string;
  allowDownload: boolean;
  created: string;
}

export const ShareFiles: React.FC<ShareFilesProps> = ({ onClose }) => {
  const { toast } = useToast();
  const { deals } = useStorageData();
  
  const [selectedFile, setSelectedFile] = useState<string>('');
  const [shareSettings, setShareSettings] = useState({
    expiryDays: '7',
    maxAccess: '',
    password: '',
    allowDownload: true,
    requireEmail: false,
    notifyAccess: true
  });
  
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([
    {
      id: 'share-1',
      fileName: 'report_q3.pdf',
      fileCid: 'QmX1234...abc',
      shareUrl: 'https://decosecure.io/s/x7k9m2n',
      expiresAt: '2024-09-23',
      accessCount: 5,
      maxAccess: 10,
      allowDownload: true,
      created: '2024-09-16'
    },
    {
      id: 'share-2',
      fileName: 'presentation.pptx',
      fileCid: 'QmY5678...def',
      shareUrl: 'https://decosecure.io/s/a3b8c1f',
      expiresAt: '2024-09-20',
      accessCount: 12,
      allowDownload: false,
      created: '2024-09-14'
    }
  ]);

  const [generating, setGenerating] = useState(false);

  const handleGenerateShareLink = async () => {
    if (!selectedFile) {
      toast({
        title: "No File Selected",
        description: "Please select a file to share",
        variant: "destructive"
      });
      return;
    }

    setGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      const selectedDeal = deals.find(deal => deal.id === selectedFile);
      if (!selectedDeal) return;

      const shareId = Math.random().toString(36).substr(2, 9);
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + parseInt(shareSettings.expiryDays));

      const newShareLink: ShareLink = {
        id: `share-${Date.now()}`,
        fileName: selectedDeal.file_name,
        fileCid: selectedDeal.file_cid,
        shareUrl: `https://decosecure.io/s/${shareId}`,
        expiresAt: expiryDate.toISOString().split('T')[0],
        accessCount: 0,
        maxAccess: shareSettings.maxAccess ? parseInt(shareSettings.maxAccess) : undefined,
        password: shareSettings.password || undefined,
        allowDownload: shareSettings.allowDownload,
        created: new Date().toISOString().split('T')[0]
      };

      setShareLinks(prev => [newShareLink, ...prev]);

      toast({
        title: "Share Link Generated",
        description: "Secure share link created successfully",
      });

      // Reset form
      setSelectedFile('');
      setShareSettings({
        expiryDays: '7',
        maxAccess: '',
        password: '',
        allowDownload: true,
        requireEmail: false,
        notifyAccess: true
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate share link",
        variant: "destructive"
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "Share link copied to clipboard",
    });
  };

  const handleRevokeLink = (linkId: string) => {
    setShareLinks(prev => prev.filter(link => link.id !== linkId));
    toast({
      title: "Link Revoked",
      description: "Share link has been revoked and is no longer accessible",
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Share className="h-6 w-6 text-primary" />
            Share Files
          </h2>
          <p className="text-muted-foreground">
            Create secure, time-limited links to share your files
          </p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Create Share Link */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Link className="h-5 w-5" />
              Create Share Link
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select File to Share</Label>
              <Select value={selectedFile} onValueChange={setSelectedFile}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a file" />
                </SelectTrigger>
                <SelectContent>
                  {deals.map((deal) => (
                    <SelectItem key={deal.id} value={deal.id}>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        {deal.file_name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Expires in (days)</Label>
                <Select
                  value={shareSettings.expiryDays}
                  onValueChange={(value) => 
                    setShareSettings(prev => ({ ...prev, expiryDays: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 Day</SelectItem>
                    <SelectItem value="7">7 Days</SelectItem>
                    <SelectItem value="30">30 Days</SelectItem>
                    <SelectItem value="90">90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Max Access Count</Label>
                <Input
                  placeholder="Unlimited"
                  value={shareSettings.maxAccess}
                  onChange={(e) => 
                    setShareSettings(prev => ({ ...prev, maxAccess: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Password Protection (Optional)</Label>
              <Input
                type="password"
                placeholder="Leave empty for no password"
                value={shareSettings.password}
                onChange={(e) => 
                  setShareSettings(prev => ({ ...prev, password: e.target.value }))
                }
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Allow Download</Label>
                  <p className="text-sm text-muted-foreground">
                    Let recipients download the file
                  </p>
                </div>
                <Switch
                  checked={shareSettings.allowDownload}
                  onCheckedChange={(checked) => 
                    setShareSettings(prev => ({ ...prev, allowDownload: checked }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notify on Access</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when link is accessed
                  </p>
                </div>
                <Switch
                  checked={shareSettings.notifyAccess}
                  onCheckedChange={(checked) => 
                    setShareSettings(prev => ({ ...prev, notifyAccess: checked }))
                  }
                />
              </div>
            </div>

            <Button 
              onClick={handleGenerateShareLink} 
              disabled={generating || !selectedFile}
              className="w-full"
            >
              {generating ? 'Generating...' : 'Create Share Link'}
            </Button>
          </CardContent>
        </Card>

        {/* Share Analytics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Share Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-primary">247</p>
                  <p className="text-sm text-muted-foreground">Total Shares</p>
                </div>
                <div className="text-center p-4 rounded-lg bg-secondary/10">
                  <Eye className="h-6 w-6 text-secondary mx-auto mb-2" />
                  <p className="text-2xl font-bold text-secondary">1,432</p>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="font-medium">Recent Activity</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 bg-success rounded-full" />
                    <span>report_q3.pdf accessed by user@email.com</span>
                    <span className="text-muted-foreground ml-auto">2h ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 bg-primary rounded-full" />
                    <span>New share link created</span>
                    <span className="text-muted-foreground ml-auto">4h ago</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="h-2 w-2 bg-secondary rounded-full" />
                    <span>presentation.pptx downloaded</span>
                    <span className="text-muted-foreground ml-auto">1d ago</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Share Links */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Active Share Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>File</TableHead>
                  <TableHead>Share URL</TableHead>
                  <TableHead>Access Count</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Settings</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {shareLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="font-medium">{link.fileName}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {link.shareUrl.replace('https://', '')}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleCopyLink(link.shareUrl)}
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {link.accessCount}
                        {link.maxAccess && `/${link.maxAccess}`}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {link.expiresAt}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        {link.password && (
                          <Badge variant="outline" className="text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Protected
                          </Badge>
                        )}
                        {link.allowDownload && (
                          <Badge variant="outline" className="text-xs">
                            <Download className="h-3 w-3 mr-1" />
                            Download
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleCopyLink(link.shareUrl)}
                        >
                          <QrCode className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 hover:text-destructive"
                          onClick={() => handleRevokeLink(link.id)}
                        >
                          <Shield className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};