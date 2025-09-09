import React from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Code, ExternalLink, Download, FileCode, Zap, Shield } from 'lucide-react';

export const Build: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Build with DecoSecure</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Developer tools and APIs to integrate decentralized storage into your applications
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-primary" />
                API Documentation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Comprehensive API documentation for integrating DecoSecure Storage
              </p>
              <Button variant="outline" className="w-full">
                <ExternalLink className="mr-2 h-4 w-4" />
                View API Docs
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5 text-secondary" />
                SDK Downloads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Ready-to-use SDKs for popular programming languages
              </p>
              <div className="space-y-2">
                <Badge variant="outline">JavaScript/TypeScript</Badge>
                <Badge variant="outline">Python</Badge>
                <Badge variant="outline">Go</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};