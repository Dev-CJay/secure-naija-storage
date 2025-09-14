import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStorageData } from '@/hooks/useStorageData';
import { Code, ExternalLink, Download, FileCode, Zap, Shield, Copy, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

export const Build: React.FC = () => {
  const { providers, networkStats } = useStorageData();
  const { toast } = useToast();
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
    toast({
      title: "Code copied",
      description: "Code snippet has been copied to clipboard",
    });
  };

  const jsCode = `// Install DecoSecure SDK
npm install @decosecure/sdk

// Initialize client
import { DecoSecureClient } from '@decosecure/sdk';

const client = new DecoSecureClient({
  apiKey: 'your-api-key',
  network: 'mainnet'
});

// Upload file
const uploadFile = async (file) => {
  try {
    const deal = await client.storage.upload(file, {
      duration: 30, // days
      redundancy: 3,
      provider: 'auto'
    });
    
    console.log('File uploaded:', deal.cid);
    return deal;
  } catch (error) {
    console.error('Upload failed:', error);
  }
};

// Retrieve file
const retrieveFile = async (cid) => {
  const file = await client.storage.retrieve(cid);
  return file;
};`;

  const pythonCode = `# Install DecoSecure Python SDK
pip install decosecure-python

# Basic usage
from decosecure import DecoSecureClient

client = DecoSecureClient(
    api_key="your-api-key",
    network="mainnet"
)

# Upload file
def upload_file(file_path):
    with open(file_path, 'rb') as file:
        deal = client.storage.upload(
            file,
            duration=30,  # days
            redundancy=3
        )
        print(f"File uploaded: {deal.cid}")
        return deal

# List deals
deals = client.storage.list_deals()
for deal in deals:
    print(f"Deal: {deal.id}, Status: {deal.status}")`;

  const restApiCode = `# DecoSecure REST API Examples

# Upload file
curl -X POST "https://api.decosecure.io/v1/storage/upload" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: multipart/form-data" \\
  -F "file=@document.pdf" \\
  -F "duration=30" \\
  -F "redundancy=3"

# Get file info
curl -X GET "https://api.decosecure.io/v1/storage/deals/DEAL_ID" \\
  -H "Authorization: Bearer YOUR_API_KEY"

# Retrieve file
curl -X GET "https://api.decosecure.io/v1/storage/retrieve/FILE_CID" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  --output downloaded_file.pdf

# List all deals
curl -X GET "https://api.decosecure.io/v1/storage/deals" \\
  -H "Authorization: Bearer YOUR_API_KEY"`;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4">Build with DecoSecure</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Developer tools, SDKs, and APIs to integrate decentralized storage into your applications
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div 
          className="grid md:grid-cols-4 gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">API Endpoints</p>
                  <p className="text-2xl font-bold">12</p>
                </div>
                <Code className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Storage Providers</p>
                  <p className="text-2xl font-bold">{providers.length}</p>
                </div>
                <Shield className="h-8 w-8 text-secondary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Avg Response</p>
                  <p className="text-2xl font-bold">{networkStats?.avg_response_time_ms || 0}ms</p>
                </div>
                <Zap className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">SDKs Available</p>
                  <p className="text-2xl font-bold">3</p>
                </div>
                <FileCode className="h-8 w-8 text-success" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* SDK and API Documentation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                Developer Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="javascript" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="javascript">JavaScript SDK</TabsTrigger>
                  <TabsTrigger value="python">Python SDK</TabsTrigger>
                  <TabsTrigger value="api">REST API</TabsTrigger>
                </TabsList>
                
                <TabsContent value="javascript" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">JavaScript/TypeScript SDK</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyCode(jsCode, 'js')}
                    >
                      {copiedCode === 'js' ? (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      Copy Code
                    </Button>
                  </div>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{jsCode}</code>
                  </pre>
                  <div className="flex gap-2">
                    <Badge variant="outline">npm</Badge>
                    <Badge variant="outline">TypeScript</Badge>
                    <Badge variant="outline">React</Badge>
                    <Badge variant="outline">Node.js</Badge>
                  </div>
                </TabsContent>
                
                <TabsContent value="python" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Python SDK</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyCode(pythonCode, 'python')}
                    >
                      {copiedCode === 'python' ? (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      Copy Code
                    </Button>
                  </div>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{pythonCode}</code>
                  </pre>
                  <div className="flex gap-2">
                    <Badge variant="outline">pip</Badge>
                    <Badge variant="outline">Python 3.8+</Badge>
                    <Badge variant="outline">asyncio</Badge>
                  </div>
                </TabsContent>
                
                <TabsContent value="api" className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">REST API</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyCode(restApiCode, 'api')}
                    >
                      {copiedCode === 'api' ? (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      Copy Code
                    </Button>
                  </div>
                  <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{restApiCode}</code>
                  </pre>
                  <div className="flex gap-2">
                    <Badge variant="outline">HTTP/REST</Badge>
                    <Badge variant="outline">JSON</Badge>
                    <Badge variant="outline">OpenAPI 3.0</Badge>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="grid lg:grid-cols-2 gap-8 mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-primary" />
                API Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Complete API reference with interactive examples and authentication guides
              </p>
              <Button variant="outline" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                Open API Docs
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5 text-secondary" />
                SDK Downloads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Download official SDKs and start building immediately
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between items-center">
                  <span>JavaScript SDK</span>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <span>Python SDK</span>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between items-center">
                  <span>Go SDK</span>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};