import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { NetworkStats } from '@/hooks/useStorageData';
import { 
  Activity, 
  HardDrive, 
  Users, 
  Zap, 
  TrendingUp,
  Server,
  Clock,
  Shield
} from 'lucide-react';
import { motion } from 'framer-motion';

interface NetworkMetricsProps {
  networkStats: NetworkStats | null;
  loading?: boolean;
}

export const NetworkMetrics: React.FC<NetworkMetricsProps> = ({
  networkStats,
  loading = false
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-muted rounded w-3/4 mb-2" />
              <div className="h-8 bg-muted rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!networkStats) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Server className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
          <p className="text-muted-foreground">Network data unavailable</p>
        </CardContent>
      </Card>
    );
  }

  const healthScore = networkStats.network_health_score;
  const getHealthColor = (score: number) => {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-secondary';
    if (score >= 50) return 'text-accent';
    return 'text-destructive';
  };

  const getHealthBadge = (score: number) => {
    if (score >= 90) return <Badge className="bg-success text-success-foreground">Excellent</Badge>;
    if (score >= 70) return <Badge variant="secondary">Good</Badge>;
    if (score >= 50) return <Badge variant="outline">Fair</Badge>;
    return <Badge variant="destructive">Poor</Badge>;
  };

  const metrics = [
    {
      title: 'Active Nodes',
      value: networkStats.total_nodes.toLocaleString(),
      icon: Users,
      color: 'text-primary',
      description: 'Storage providers online'
    },
    {
      title: 'Active Deals',
      value: networkStats.active_deals.toLocaleString(),
      icon: Activity,
      color: 'text-secondary',
      description: 'Current storage contracts'
    },
    {
      title: 'Storage Used',
      value: `${networkStats.total_storage_used_gb.toLocaleString()} GB`,
      icon: HardDrive,
      color: 'text-accent',
      description: 'Total data stored'
    },
    {
      title: 'Response Time',
      value: `${networkStats.avg_response_time_ms}ms`,
      icon: Clock,
      color: 'text-success',
      description: 'Average network latency'
    }
  ];

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
    <div className="space-y-6">
      {/* Network Health Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Network Health
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">
                <span className={getHealthColor(healthScore)}>{healthScore}/100</span>
              </p>
              <p className="text-sm text-muted-foreground">Overall network score</p>
            </div>
            {getHealthBadge(healthScore)}
          </div>
          <Progress value={healthScore} className="h-2" />
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Uptime</p>
              <p className="font-semibold text-success">99.8%</p>
            </div>
            <div>
              <p className="text-muted-foreground">Data Availability</p>
              <p className="font-semibold text-success">99.9%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Metrics Grid */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {metrics.map((metric, index) => (
          <motion.div key={metric.title} variants={itemVariants}>
            <Card className="hover:shadow-card transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className={`h-5 w-5 ${metric.color}`} />
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Performance Chart Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Network Performance (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-gradient-hero rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Performance chart coming soon</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};