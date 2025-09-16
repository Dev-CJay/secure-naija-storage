import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, 
  Star, 
  TrendingUp, 
  Award, 
  CheckCircle, 
  AlertTriangle,
  Users,
  Clock,
  Zap,
  BarChart3
} from 'lucide-react';
import { contractService } from '@/lib/smartContract';

interface ProviderCredibility {
  address: string;
  name: string;
  reputation: number;
  totalDeals: number;
  successRate: number;
  totalStorage: number;
  slashingHistory: number;
  verified: boolean;
  uptime: number;
  responseTime: number;
  lastVerified: string;
}

interface CredibilitySystemProps {
  onClose: () => void;
}

export const CredibilitySystem: React.FC<CredibilitySystemProps> = ({ onClose }) => {
  const [providers, setProviders] = useState<ProviderCredibility[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);

  useEffect(() => {
    loadProviderCredibility();
  }, []);

  const loadProviderCredibility = async () => {
    try {
      // Mock provider data with credibility scores
      const mockProviders: ProviderCredibility[] = [
        {
          address: '0x1234...5678',
          name: 'SecureNode Pro',
          reputation: 950,
          totalDeals: 1247,
          successRate: 0.986,
          totalStorage: 500,
          slashingHistory: 0,
          verified: true,
          uptime: 0.999,
          responseTime: 45,
          lastVerified: '2024-09-16T10:30:00Z'
        },
        {
          address: '0x2345...6789',
          name: 'DataVault Inc',
          reputation: 875,
          totalDeals: 892,
          successRate: 0.951,
          totalStorage: 750,
          slashingHistory: 2,
          verified: true,
          uptime: 0.995,
          responseTime: 67,
          lastVerified: '2024-09-16T09:15:00Z'
        },
        {
          address: '0x3456...7890',
          name: 'CloudStore Max',
          reputation: 720,
          totalDeals: 456,
          successRate: 0.923,
          totalStorage: 300,
          slashingHistory: 1,
          verified: false,
          uptime: 0.987,
          responseTime: 89,
          lastVerified: '2024-09-15T14:20:00Z'
        },
        {
          address: '0x4567...8901',
          name: 'ReliableHost',
          reputation: 820,
          totalDeals: 678,
          successRate: 0.967,
          totalStorage: 420,
          slashingHistory: 1,
          verified: true,
          uptime: 0.992,
          responseTime: 52,
          lastVerified: '2024-09-16T08:45:00Z'
        }
      ];

      setProviders(mockProviders);
    } catch (error) {
      console.error('Failed to load provider credibility:', error);
    } finally {
      setLoading(false);
    }
  };

  const getReputationLevel = (reputation: number) => {
    if (reputation >= 900) return { level: 'Platinum', color: 'text-primary' };
    if (reputation >= 800) return { level: 'Gold', color: 'text-accent' };
    if (reputation >= 700) return { level: 'Silver', color: 'text-secondary' };
    if (reputation >= 600) return { level: 'Bronze', color: 'text-muted-foreground' };
    return { level: 'Unrated', color: 'text-destructive' };
  };

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 0.98) return 'text-success';
    if (rate >= 0.95) return 'text-primary';
    if (rate >= 0.90) return 'text-accent';
    return 'text-destructive';
  };

  const ProviderCard = ({ provider }: { provider: ProviderCredibility }) => {
    const repLevel = getReputationLevel(provider.reputation);
    
    return (
      <Card className={`cursor-pointer transition-all duration-200 hover:shadow-card ${
        selectedProvider === provider.address ? 'ring-2 ring-primary' : ''
      }`} onClick={() => setSelectedProvider(provider.address)}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold">{provider.name}</h3>
                {provider.verified && (
                  <CheckCircle className="h-4 w-4 text-success" />
                )}
              </div>
            </div>
            <Badge className={repLevel.color}>
              {repLevel.level}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground font-mono">
            {provider.address}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Reputation Score</p>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-accent" />
                <span className="font-bold text-lg">{provider.reputation}/1000</span>
              </div>
              <Progress value={provider.reputation / 10} className="h-2 mt-1" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Success Rate</p>
              <span className={`font-bold text-lg ${getSuccessRateColor(provider.successRate)}`}>
                {(provider.successRate * 100).toFixed(1)}%
              </span>
              <Progress value={provider.successRate * 100} className="h-2 mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-muted-foreground">Total Deals</p>
              <p className="font-semibold">{provider.totalDeals.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Storage (TB)</p>
              <p className="font-semibold">{provider.totalStorage}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Uptime</p>
              <p className="font-semibold">{(provider.uptime * 100).toFixed(1)}%</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {provider.slashingHistory === 0 ? (
                <Shield className="h-4 w-4 text-success" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-destructive" />
              )}
              <span className="text-sm">
                {provider.slashingHistory === 0 ? 'No penalties' : `${provider.slashingHistory} penalties`}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-primary" />
              <span className="text-xs">{provider.responseTime}ms</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const ProviderDetails = ({ provider }: { provider: ProviderCredibility }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          {provider.name} - Detailed Credibility
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Performance Metrics
            </h4>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Reputation Score</span>
                  <span className="text-sm font-medium">{provider.reputation}/1000</span>
                </div>
                <Progress value={provider.reputation / 10} />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Success Rate</span>
                  <span className="text-sm font-medium">{(provider.successRate * 100).toFixed(2)}%</span>
                </div>
                <Progress value={provider.successRate * 100} />
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Uptime</span>
                  <span className="text-sm font-medium">{(provider.uptime * 100).toFixed(3)}%</span>
                </div>
                <Progress value={provider.uptime * 100} />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Network Statistics
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 rounded-lg bg-primary/10">
                <p className="text-2xl font-bold text-primary">{provider.totalDeals}</p>
                <p className="text-sm text-muted-foreground">Total Deals</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-secondary/10">
                <p className="text-2xl font-bold text-secondary">{provider.totalStorage} TB</p>
                <p className="text-sm text-muted-foreground">Storage Capacity</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-success/10">
                <p className="text-2xl font-bold text-success">{provider.responseTime}ms</p>
                <p className="text-sm text-muted-foreground">Avg Response</p>
              </div>
              <div className="text-center p-3 rounded-lg bg-accent/10">
                <p className="text-2xl font-bold text-accent">{provider.slashingHistory}</p>
                <p className="text-sm text-muted-foreground">Penalties</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Recent Activity
          </h4>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <CheckCircle className="h-4 w-4 text-success" />
              <span className="text-sm">Storage verification completed</span>
              <span className="text-xs text-muted-foreground ml-auto">2 hours ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-sm">Reputation score increased by 5 points</span>
              <span className="text-xs text-muted-foreground ml-auto">1 day ago</span>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Award className="h-4 w-4 text-accent" />
              <span className="text-sm">Achieved 99.9% uptime milestone</span>
              <span className="text-xs text-muted-foreground ml-auto">3 days ago</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Button>Select Provider</Button>
          <Button variant="outline">View Full History</Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="h-8 w-8 animate-spin mx-auto mb-2" />
          <p>Loading credibility data...</p>
        </div>
      </div>
    );
  }

  const selectedProviderData = providers.find(p => p.address === selectedProvider);

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Provider Credibility System
          </h2>
          <p className="text-muted-foreground">
            View storage provider reputation, performance metrics, and reliability scores
          </p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="rankings">Rankings</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-semibold">Storage Providers</h3>
              <div className="grid gap-4">
                {providers.map((provider) => (
                  <ProviderCard key={provider.address} provider={provider} />
                ))}
              </div>
            </div>

            <div>
              {selectedProviderData ? (
                <ProviderDetails provider={selectedProviderData} />
              ) : (
                <Card>
                  <CardContent className="flex items-center justify-center h-64 text-center">
                    <div>
                      <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        Select a provider to view detailed credibility information
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rankings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Provider Rankings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {providers
                  .sort((a, b) => b.reputation - a.reputation)
                  .map((provider, index) => {
                    const repLevel = getReputationLevel(provider.reputation);
                    return (
                      <div key={provider.address} className="flex items-center gap-4 p-4 rounded-lg border">
                        <div className="text-2xl font-bold text-muted-foreground w-8">
                          #{index + 1}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold">{provider.name}</span>
                            {provider.verified && <CheckCircle className="h-4 w-4 text-success" />}
                            <Badge className={repLevel.color}>{repLevel.level}</Badge>
                          </div>
                          <div className="grid grid-cols-4 gap-4 text-sm">
                            <span>Score: {provider.reputation}/1000</span>
                            <span>Success: {(provider.successRate * 100).toFixed(1)}%</span>
                            <span>Deals: {provider.totalDeals}</span>
                            <span>Uptime: {(provider.uptime * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Verification Process</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Identity Verification</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Storage Capacity Proof</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Network Connectivity Test</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Security Audit</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-success" />
                    <span>Collateral Deposit</span>
                  </div>
                </div>
                
                <Button className="w-full mt-4">
                  Run Verification Test
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Credibility Factors</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Deal Success Rate</span>
                      <span className="text-sm font-medium">40%</span>
                    </div>
                    <Progress value={40} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Network Uptime</span>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <Progress value={25} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Storage Verification</span>
                      <span className="text-sm font-medium">20%</span>
                    </div>
                    <Progress value={20} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Response Time</span>
                      <span className="text-sm font-medium">10%</span>
                    </div>
                    <Progress value={10} />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm">Community Rating</span>
                      <span className="text-sm font-medium">5%</span>
                    </div>
                    <Progress value={5} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};