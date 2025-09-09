import React from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Users, Building, Zap } from 'lucide-react';

export const Ecosystem: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">DecoSecure Ecosystem</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Partners, storage providers, and integrations powering Nigeria's decentralized storage network
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                Storage Nodes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-2">8,429</div>
              <p className="text-muted-foreground">Active IPFS nodes across Nigeria and globally</p>
              <Badge variant="outline" className="mt-2">99.9% Uptime</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-secondary" />
                Community
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-secondary mb-2">12K+</div>
              <p className="text-muted-foreground">Developers and businesses in our ecosystem</p>
              <Badge variant="outline" className="mt-2">Growing Daily</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-success" />
                Enterprise Partners
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success mb-2">50+</div>
              <p className="text-muted-foreground">Healthcare, finance, and education institutions</p>
              <Badge variant="outline" className="mt-2">NDPR Verified</Badge>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};