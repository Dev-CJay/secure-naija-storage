import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Clock, 
  HardDrive, 
  Globe, 
  Copy, 
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BackupSettingsProps {
  onClose: () => void;
}

export const BackupSettings: React.FC<BackupSettingsProps> = ({ onClose }) => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    replicationFactor: [3],
    storageRegions: ['us-east', 'eu-west'],
    encryptionEnabled: true,
    versioning: true,
    compressionLevel: [5],
    maxVersions: [10],
    retentionPeriod: '1year',
    bandwidthLimit: [100] // MB/s
  });

  const [saving, setSaving] = useState(false);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Mock save delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store settings
      localStorage.setItem('backupSettings', JSON.stringify(settings));
      
      toast({
        title: "Settings Saved",
        description: "Your backup settings have been updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save backup settings",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  const handleTestBackup = async () => {
    toast({
      title: "Backup Test Started",
      description: "Running backup verification across all storage providers...",
    });

    // Mock test delay
    setTimeout(() => {
      toast({
        title: "Backup Test Completed",
        description: "All backup copies verified successfully ✓",
      });
    }, 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Backup Settings
          </h2>
          <p className="text-muted-foreground">
            Configure automatic backup and redundancy settings for your files
          </p>
        </div>
        <Button variant="outline" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Main Backup Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              General Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Automatic Backup</Label>
                <p className="text-sm text-muted-foreground">
                  Enable automatic backup for new files
                </p>
              </div>
              <Switch
                checked={settings.autoBackup}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, autoBackup: checked }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Backup Frequency</Label>
              <Select
                value={settings.backupFrequency}
                onValueChange={(value) => 
                  setSettings(prev => ({ ...prev, backupFrequency: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Replication Factor: {settings.replicationFactor[0]} copies</Label>
              <Slider
                value={settings.replicationFactor}
                onValueChange={(value) => 
                  setSettings(prev => ({ ...prev, replicationFactor: value }))
                }
                max={10}
                min={1}
                step={1}
                className="py-4"
              />
              <p className="text-xs text-muted-foreground">
                Higher replication provides better redundancy but increases costs
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Encryption</Label>
                <p className="text-sm text-muted-foreground">
                  End-to-end encryption for all files
                </p>
              </div>
              <Switch
                checked={settings.encryptionEnabled}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, encryptionEnabled: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>File Versioning</Label>
                <p className="text-sm text-muted-foreground">
                  Keep multiple versions of files
                </p>
              </div>
              <Switch
                checked={settings.versioning}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, versioning: checked }))
                }
              />
            </div>
          </CardContent>
        </Card>

        {/* Advanced Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Advanced Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Storage Regions</Label>
              <div className="flex flex-wrap gap-2">
                {['us-east', 'us-west', 'eu-west', 'eu-central', 'asia-pacific'].map((region) => (
                  <Badge
                    key={region}
                    variant={settings.storageRegions.includes(region) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => {
                      const newRegions = settings.storageRegions.includes(region)
                        ? settings.storageRegions.filter(r => r !== region)
                        : [...settings.storageRegions, region];
                      setSettings(prev => ({ ...prev, storageRegions: newRegions }));
                    }}
                  >
                    <Globe className="h-3 w-3 mr-1" />
                    {region}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Compression Level: {settings.compressionLevel[0]}/10</Label>
              <Slider
                value={settings.compressionLevel}
                onValueChange={(value) => 
                  setSettings(prev => ({ ...prev, compressionLevel: value }))
                }
                max={10}
                min={0}
                step={1}
                className="py-4"
              />
            </div>

            <div className="space-y-2">
              <Label>Max Versions to Keep</Label>
              <Slider
                value={settings.maxVersions}
                onValueChange={(value) => 
                  setSettings(prev => ({ ...prev, maxVersions: value }))
                }
                max={50}
                min={1}
                step={1}
                className="py-4"
              />
              <p className="text-xs text-muted-foreground">
                Currently keeping {settings.maxVersions[0]} versions per file
              </p>
            </div>

            <div className="space-y-2">
              <Label>Retention Period</Label>
              <Select
                value={settings.retentionPeriod}
                onValueChange={(value) => 
                  setSettings(prev => ({ ...prev, retentionPeriod: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1month">1 Month</SelectItem>
                  <SelectItem value="3months">3 Months</SelectItem>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                  <SelectItem value="3years">3 Years</SelectItem>
                  <SelectItem value="forever">Forever</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Bandwidth Limit: {settings.bandwidthLimit[0]} MB/s</Label>
              <Slider
                value={settings.bandwidthLimit}
                onValueChange={(value) => 
                  setSettings(prev => ({ ...prev, bandwidthLimit: value }))
                }
                max={1000}
                min={1}
                step={10}
                className="py-4"
              />
            </div>
          </CardContent>
        </Card>

        {/* Status & Actions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Backup Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 rounded-lg bg-success/10">
                <CheckCircle className="h-8 w-8 text-success mx-auto mb-2" />
                <p className="font-medium">All Systems Active</p>
                <p className="text-sm text-muted-foreground">Backup running smoothly</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-primary/10">
                <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                <p className="font-medium">Last Backup</p>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-secondary/10">
                <HardDrive className="h-8 w-8 text-secondary mx-auto mb-2" />
                <p className="font-medium">Total Backups</p>
                <p className="text-sm text-muted-foreground">1,247 files</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleSaveSettings} disabled={saving}>
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
              <Button variant="outline" onClick={handleTestBackup}>
                Test Backup
              </Button>
              <Button variant="outline">
                <Copy className="h-4 w-4 mr-2" />
                Export Config
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};