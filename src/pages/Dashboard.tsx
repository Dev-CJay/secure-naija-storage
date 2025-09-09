import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Header } from '@/components/Header';
import { 
  Upload, 
  FileText, 
  Coins, 
  Activity, 
  Download, 
  Trash2, 
  Shield,
  Clock,
  HardDrive,
  Users,
  TrendingUp,
  Copy,
  CheckCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface StoredFile {
  id: string;
  name: string;
  cid: string;
  size: string;
  uploadDate: string;
  status: 'uploading' | 'stored' | 'retrieving' | 'error';
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [files, setFiles] = useState<StoredFile[]>([
    {
      id: '1',
      name: 'patient_records_q1.pdf',
      cid: 'QmX7f9K2mNpQ8vR3wE6hS4tY1uA9bC5dF8gH2jL6kM7nP9r',
      size: '2.4 MB',
      uploadDate: '2024-01-15',
      status: 'stored'
    },
    {
      id: '2',
      name: 'financial_report_2024.xlsx',
      cid: 'QmY8g0L3nOpR9wF7iT5uB6cE1fG9dH4jK8mN2pQ5rS7tV0x',
      size: '1.8 MB',
      uploadDate: '2024-01-14',
      status: 'stored'
    }
  ]);
  
  const [uploading, setUploading] = useState(false);
  const [copiedCid, setCopiedCid] = useState<string | null>(null);

  // Mock data
  const tokenBalance = '100.50';
  const activeDeals = 2;
  const storageUsed = 68;
  const monthlyEarnings = '45.20';

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    
    for (const file of Array.from(selectedFiles)) {
      // Generate mock CID
      const mockCid = `QmZ${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      const newFile: StoredFile = {
        id: Date.now().toString() + Math.random().toString(36).substring(2, 5),
        name: file.name,
        cid: mockCid,
        size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'uploading'
      };

      setFiles(prev => [...prev, newFile]);

      // Simulate upload progress
      setTimeout(() => {
        setFiles(prev => 
          prev.map(f => 
            f.id === newFile.id 
              ? { ...f, status: 'stored' as const }
              : f
          )
        );
        
        toast({
          title: "File uploaded successfully",
          description: `${file.name} has been stored on IPFS`,
        });
      }, 2000);
    }

    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeleteFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    toast({
      title: "File deleted",
      description: "File has been removed from your storage",
    });
  };

  const handleCopyCid = (cid: string) => {
    navigator.clipboard.writeText(cid);
    setCopiedCid(cid);
    setTimeout(() => setCopiedCid(null), 2000);
    toast({
      title: "CID copied",
      description: "File CID has been copied to clipboard",
    });
  };

  const getStatusBadge = (status: StoredFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Badge variant="secondary">Uploading...</Badge>;
      case 'stored':
        return <Badge variant="default">Stored</Badge>;
      case 'retrieving':
        return <Badge variant="outline">Retrieving</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your decentralized storage, view your files, and track your earnings.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-card transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">DSC Balance</CardTitle>
                <Coins className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{tokenBalance}</div>
                <p className="text-xs text-muted-foreground">
                  DecoSecure Tokens
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-card transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
                <Activity className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">{activeDeals}</div>
                <p className="text-xs text-muted-foreground">
                  Storage contracts
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-card transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                <HardDrive className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">{storageUsed}%</div>
                <Progress value={storageUsed} className="mt-2" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-card transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Earnings</CardTitle>
                <TrendingUp className="h-4 w-4 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-success">${monthlyEarnings}</div>
                <p className="text-xs text-muted-foreground">
                  From storage hosting
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* File Upload Section */}
          <motion.div 
            className="lg:col-span-2"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5 text-primary" />
                  Upload Files
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                  <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Upload your files to IPFS</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    Drag and drop files here or click to browse
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    onChange={handleFileUpload}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.mp4,.mp3"
                  />
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    variant="hero"
                  >
                    {uploading ? 'Uploading...' : 'Select Files'}
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    Supported: PDF, DOC, XLS, images, videos, audio files
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Files Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Your Files ({files.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>CID</TableHead>
                        <TableHead>Size</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {files.map((file) => (
                        <TableRow key={file.id}>
                          <TableCell className="font-medium">{file.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs">
                                {file.cid.slice(0, 8)}...{file.cid.slice(-6)}
                              </span>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6"
                                onClick={() => handleCopyCid(file.cid)}
                              >
                                {copiedCid === file.cid ? (
                                  <CheckCircle className="h-3 w-3 text-success" />
                                ) : (
                                  <Copy className="h-3 w-3" />
                                )}
                              </Button>
                            </div>
                          </TableCell>
                          <TableCell>{file.size}</TableCell>
                          <TableCell>{getStatusBadge(file.status)}</TableCell>
                          <TableCell>{file.uploadDate}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Download className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 hover:text-destructive"
                                onClick={() => handleDeleteFile(file.id)}
                              >
                                <Trash2 className="h-4 w-4" />
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
          </motion.div>

          {/* Sidebar */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="mr-2 h-4 w-4" />
                  Backup Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2 h-4 w-4" />
                  Share Files
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Activity className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-success rounded-full mt-2 shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">File uploaded</p>
                    <p className="text-muted-foreground">patient_records_q1.pdf</p>
                    <p className="text-xs text-muted-foreground">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-primary rounded-full mt-2 shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">Storage deal created</p>
                    <p className="text-muted-foreground">Contract #2847</p>
                    <p className="text-xs text-muted-foreground">5 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 bg-secondary rounded-full mt-2 shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium">Earnings received</p>
                    <p className="text-muted-foreground">+15.30 DSC</p>
                    <p className="text-xs text-muted-foreground">1 day ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Network Status */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Network Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">IPFS Nodes</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-success rounded-full animate-pulse" />
                    <span className="text-sm font-medium">8,429 Active</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Network Health</span>
                  <span className="text-sm font-medium text-success">Excellent</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Avg Response Time</span>
                  <span className="text-sm font-medium">245ms</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};