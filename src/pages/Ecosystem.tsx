import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useStorageData, StorageProvider } from '@/hooks/useStorageData';
import { Globe, Users, Building, Zap, MapPin, Activity, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export const Ecosystem: React.FC = () => {
  const { providers, networkStats, loading } = useStorageData();

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">Loading ecosystem data...</div>
        </div>
      </div>
    );
  }

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
          <h1 className="text-4xl font-bold mb-4">DecoSecure Ecosystem</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Storage providers, network statistics, and infrastructure powering Nigeria's decentralized storage network
          </p>
        </motion.div>

        {/* Network Overview Cards */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-card transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-primary" />
                  Active Nodes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-2">
                  {networkStats?.total_nodes?.toLocaleString() || '0'}
                </div>
                <p className="text-muted-foreground">Storage nodes across Nigeria</p>
                <Badge variant="outline" className="mt-2">
                  {networkStats?.network_health_score || 0}% Health
                </Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-card transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-secondary" />
                  Total Storage
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary mb-2">
                  {((networkStats?.total_storage_used_gb || 0) / 1000000).toFixed(1)}PB
                </div>
                <p className="text-muted-foreground">Data stored on the network</p>
                <Badge variant="outline" className="mt-2">Growing Daily</Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-card transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-accent" />
                  Active Deals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent mb-2">
                  {networkStats?.active_deals?.toLocaleString() || '0'}
                </div>
                <p className="text-muted-foreground">Storage contracts in progress</p>
                <Badge variant="outline" className="mt-2">Live Updates</Badge>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card className="hover:shadow-card transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-success" />
                  Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-success mb-2">
                  {networkStats?.avg_response_time_ms || 0}ms
                </div>
                <p className="text-muted-foreground">Average response time</p>
                <Badge variant="outline" className="mt-2">Optimized</Badge>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Storage Providers Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                Storage Providers Network
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Provider</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Total Storage</TableHead>
                      <TableHead>Available</TableHead>
                      <TableHead>Price/GB</TableHead>
                      <TableHead>Reputation</TableHead>
                      <TableHead>Uptime</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {providers.map((provider) => (
                      <TableRow key={provider.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-primary" />
                            {provider.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3 w-3 text-muted-foreground" />
                            {provider.location}
                          </div>
                        </TableCell>
                        <TableCell>{(provider.total_storage_gb / 1000).toFixed(1)}TB</TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>{(provider.available_storage_gb / 1000).toFixed(1)}TB</span>
                              <span className="text-muted-foreground">
                                {Math.round((provider.available_storage_gb / provider.total_storage_gb) * 100)}%
                              </span>
                            </div>
                            <Progress 
                              value={(provider.available_storage_gb / provider.total_storage_gb) * 100} 
                              className="h-2"
                            />
                          </div>
                        </TableCell>
                        <TableCell>{provider.price_per_gb.toFixed(6)} DSC</TableCell>
                        <TableCell>
                          <Badge 
                            variant={provider.reputation_score >= 95 ? "default" : "secondary"}
                          >
                            {provider.reputation_score}/100
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={provider.uptime_percentage >= 99 ? "default" : "secondary"}
                          >
                            {provider.uptime_percentage}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};