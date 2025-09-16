import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Activity,
  HardDrive,
  Coins,
  Users,
  Globe,
  Shield,
  Clock,
  Download,
  Upload,
  Eye,
  BarChart3
} from 'lucide-react';
import { contractService } from '@/lib/smartContract';

interface AnalyticsProps {
  onClose: () => void;
}

const storageData = [
  { month: 'Jan', storage: 45, cost: 120, files: 230 },
  { month: 'Feb', storage: 52, cost: 140, files: 290 },
  { month: 'Mar', storage: 48, cost: 128, files: 260 },
  { month: 'Apr', storage: 61, cost: 165, files: 340 },
  { month: 'May', storage: 67, cost: 180, files: 380 },
  { month: 'Jun', storage: 73, cost: 195, files: 420 },
];

const providerData = [
  { name: 'Provider A', value: 35, reputation: 950 },
  { name: 'Provider B', value: 25, reputation: 870 },
  { name: 'Provider C', value: 20, reputation: 920 },
  { name: 'Provider D', value: 15, reputation: 880 },
  { name: 'Others', value: 5, reputation: 850 },
];

const performanceData = [
  { time: '00:00', upload: 45, download: 38, latency: 120 },
  { time: '04:00', upload: 32, download: 41, latency: 95 },
  { time: '08:00', upload: 67, download: 52, latency: 110 },
  { time: '12:00', upload: 78, download: 65, latency: 85 },
  { time: '16:00', upload: 85, download: 78, latency: 92 },
  { time: '20:00', upload: 62, download: 55, latency: 105 },
];

const COLORS = ['#0ea5e9', '#22d3ee', '#a855f7', '#f59e0b', '#ef4444'];

export const Analytics: React.FC<AnalyticsProps> = ({ onClose }) => {
  const [timeRange, setTimeRange] = useState('7d');
  const [activeChart, setActiveChart] = useState('overview');

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color = 'primary' 
  }: {
    title: string;
    value: string | number;
    change?: number;
    icon: any;
    color?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {change !== undefined && (
              <div className="flex items-center gap-1 mt-1">
                {change > 0 ? (
                  <TrendingUp className="h-3 w-3 text-success" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-destructive" />
                )}
                <span className={`text-xs ${change > 0 ? 'text-success' : 'text-destructive'}`}>
                  {Math.abs(change)}%
                </span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg bg-${color}/10`}>
            <Icon className={`h-6 w-6 text-${color}`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Analytics Dashboard
          </h2>
          <p className="text-muted-foreground">
            Monitor your storage performance, costs, and network activity
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">24 Hours</SelectItem>
              <SelectItem value="7d">7 Days</SelectItem>
              <SelectItem value="30d">30 Days</SelectItem>
              <SelectItem value="90d">90 Days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Storage Used"
          value="2.5 TB"
          change={12}
          icon={HardDrive}
          color="primary"
        />
        <StatCard
          title="Monthly Cost"
          value="45.67 DSC"
          change={-8}
          icon={Coins}
          color="secondary"
        />
        <StatCard
          title="Active Deals"
          value="127"
          change={15}
          icon={Activity}
          color="success"
        />
        <StatCard
          title="Provider Score"
          value="96.8%"
          change={2}
          icon={Shield}
          color="accent"
        />
      </div>

      {/* Chart Navigation */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 'overview', label: 'Overview', icon: BarChart3 },
          { id: 'storage', label: 'Storage Trends', icon: HardDrive },
          { id: 'performance', label: 'Performance', icon: Activity },
          { id: 'providers', label: 'Providers', icon: Users },
        ].map((tab) => (
          <Button
            key={tab.id}
            variant={activeChart === tab.id ? "default" : "outline"}
            onClick={() => setActiveChart(tab.id)}
            className="flex items-center gap-2"
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </Button>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {activeChart === 'overview' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Storage & Cost Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={storageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="storage" 
                      stackId="1"
                      stroke="hsl(var(--primary))" 
                      fill="hsl(var(--primary) / 0.1)" 
                    />
                    <Area 
                      type="monotone" 
                      dataKey="cost" 
                      stackId="2"
                      stroke="hsl(var(--secondary))" 
                      fill="hsl(var(--secondary) / 0.1)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>File Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={storageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="files" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}

        {activeChart === 'storage' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Storage Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={storageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="storage" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Cost Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={storageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="cost" 
                      stroke="hsl(var(--secondary))" 
                      fill="hsl(var(--secondary) / 0.2)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}

        {activeChart === 'performance' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Network Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="upload" 
                      stroke="hsl(var(--primary))" 
                      name="Upload Speed"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="download" 
                      stroke="hsl(var(--secondary))" 
                      name="Download Speed"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Latency Monitor</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Area 
                      type="monotone" 
                      dataKey="latency" 
                      stroke="hsl(var(--accent))" 
                      fill="hsl(var(--accent) / 0.2)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </>
        )}

        {activeChart === 'providers' && (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Provider Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={providerData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {providerData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Provider Performance</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {providerData.map((provider, index) => (
                  <div key={provider.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index] }}
                        />
                        <span className="font-medium">{provider.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{provider.reputation}/1000</Badge>
                        <span className="text-sm text-muted-foreground">{provider.value}%</span>
                      </div>
                    </div>
                    <Progress value={provider.reputation / 10} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Additional Insights */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Global Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>North America</span>
              <span className="font-medium">45%</span>
            </div>
            <Progress value={45} className="h-2" />
            
            <div className="flex justify-between">
              <span>Europe</span>
              <span className="font-medium">35%</span>
            </div>
            <Progress value={35} className="h-2" />
            
            <div className="flex justify-between">
              <span>Asia Pacific</span>
              <span className="font-medium">20%</span>
            </div>
            <Progress value={20} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Upload className="h-4 w-4 text-primary" />
              <span>5 files uploaded</span>
              <span className="text-muted-foreground ml-auto">2h ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Download className="h-4 w-4 text-secondary" />
              <span>12 retrievals completed</span>
              <span className="text-muted-foreground ml-auto">4h ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Shield className="h-4 w-4 text-success" />
              <span>Storage verified</span>
              <span className="text-muted-foreground ml-auto">6h ago</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Eye className="h-4 w-4 text-accent" />
              <span>Analytics updated</span>
              <span className="text-muted-foreground ml-auto">8h ago</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-lg bg-success/10">
              <p className="text-sm font-medium text-success">Cost Optimization</p>
              <p className="text-xs text-muted-foreground">
                Switch to Provider C to save 15% on storage costs
              </p>
            </div>
            <div className="p-3 rounded-lg bg-primary/10">
              <p className="text-sm font-medium text-primary">Performance Boost</p>
              <p className="text-xs text-muted-foreground">
                Network speed improved by 23% this week
              </p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/10">
              <p className="text-sm font-medium text-secondary">Usage Trend</p>
              <p className="text-xs text-muted-foreground">
                Storage usage growing at 12% monthly rate
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};