import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { StorageProvider } from '@/hooks/useStorageData';
import { 
  MapPin, 
  Star, 
  HardDrive, 
  Zap, 
  DollarSign,
  Shield
} from 'lucide-react';

interface ProviderSelectionProps {
  providers: StorageProvider[];
  onSelect: (provider: StorageProvider) => void;
  selectedProvider?: StorageProvider;
}

export const ProviderSelection: React.FC<ProviderSelectionProps> = ({
  providers,
  onSelect,
  selectedProvider
}) => {
  const getReputationColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-secondary';
    return 'text-destructive';
  };

  const getReputationBadge = (score: number) => {
    if (score >= 90) return <Badge variant="default" className="bg-success">Excellent</Badge>;
    if (score >= 70) return <Badge variant="secondary">Good</Badge>;
    return <Badge variant="destructive">Poor</Badge>;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Shield className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Select Storage Provider</h3>
      </div>
      
      <div className="grid gap-4 max-h-96 overflow-y-auto">
        {providers.map((provider) => (
          <Card 
            key={provider.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-card ${
              selectedProvider?.id === provider.id 
                ? 'ring-2 ring-primary bg-gradient-card' 
                : 'hover:bg-card/80'
            }`}
            onClick={() => onSelect(provider)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <HardDrive className="h-4 w-4 text-primary" />
                  {provider.name}
                </CardTitle>
                {getReputationBadge(provider.reputation_score)}
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {provider.location}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  <span className={getReputationColor(provider.reputation_score)}>
                    {provider.reputation_score}/100
                  </span>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <DollarSign className="h-3 w-3" />
                    Price per GB
                  </div>
                  <p className="font-mono text-primary">{provider.price_per_gb.toFixed(6)} DSC</p>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-muted-foreground mb-1">
                    <Zap className="h-3 w-3" />
                    Uptime
                  </div>
                  <p className="font-semibold text-success">{provider.uptime_percentage}%</p>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Storage Available</span>
                  <span className="font-medium">
                    {provider.available_storage_gb} GB / {provider.total_storage_gb} GB
                  </span>
                </div>
                <Progress 
                  value={(provider.available_storage_gb / provider.total_storage_gb) * 100}
                  className="h-2"
                />
              </div>
              
              {selectedProvider?.id === provider.id && (
                <div className="mt-3 p-2 bg-primary/10 rounded-md">
                  <p className="text-xs text-primary font-medium">✓ Selected Provider</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      
      {providers.length === 0 && (
        <div className="text-center py-8">
          <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">No storage providers available</p>
        </div>
      )}
    </div>
  );
};