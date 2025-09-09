import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ConnectWallet } from '@/components/ConnectWallet';
import { Header } from '@/components/Header';
import { 
  Shield, 
  Globe, 
  DollarSign, 
  Smartphone, 
  Database, 
  Lock,
  ArrowRight,
  CheckCircle,
  Users,
  Zap,
  Wallet
} from 'lucide-react';
import { motion } from 'framer-motion';

export const Homepage: React.FC = () => {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: Shield,
      title: 'Tamper-Proof Security',
      description: 'Blockchain-secured storage with immutable records and end-to-end encryption for maximum data protection.',
      color: 'text-primary'
    },
    {
      icon: Globe,
      title: 'Decentralized Network',
      description: 'Files distributed across global IPFS nodes, eliminating single points of failure for true resilience.',
      color: 'text-secondary'
    },
    {
      icon: DollarSign,
      title: '90% Cost Reduction',
      description: 'Save significantly compared to AWS and traditional cloud providers with our token-based incentive model.',
      color: 'text-success'
    },
    {
      icon: Smartphone,
      title: 'Mobile-First Design',
      description: 'Optimized for Nigeria\'s mobile-dominant internet usage with low-bandwidth efficiency.',
      color: 'text-accent'
    },
    {
      icon: Database,
      title: 'NDPR Compliant',
      description: 'Full compliance with Nigeria Data Protection Regulation for healthcare, finance, and education sectors.',
      color: 'text-primary'
    },
    {
      icon: Zap,
      title: 'Instant Access',
      description: 'Fast file retrieval and uploads designed for Nigeria\'s 10-20 Mbps network conditions.',
      color: 'text-secondary'
    }
  ];

  const sectors = [
    {
      name: 'Healthcare',
      icon: '🏥',
      description: 'Secure patient records and medical data storage'
    },
    {
      name: 'Finance',
      icon: '🏦',
      description: 'Tamper-proof transaction logs and financial reports'
    },
    {
      name: 'Education',
      icon: '🎓',
      description: 'Affordable academic records and research data management'
    }
  ];

  const stats = [
    { number: '90%', label: 'Cost Savings vs AWS' },
    { number: '85%', label: 'Mobile Users in Nigeria' },
    { number: '100%', label: 'NDPR Compliant' },
    { number: '24/7', label: 'Network Availability' }
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
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <motion.div 
            className="text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Secure{' '}
              <span className="text-gradient">Decentralized</span>{' '}
              Data Storage for{' '}
              <span className="text-gradient">Nigeria</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Blockchain-powered storage platform designed for Nigerian healthcare, finance, and education sectors. 
              90% cheaper than AWS with NDPR compliance and mobile-first design.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => setIsWalletModalOpen(true)}
                className="w-full sm:w-auto min-w-48"
              >
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <Link to="/learn">
                <Button variant="outline" size="lg" className="w-full sm:w-auto min-w-48">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {stats.map((stat, index) => (
                <motion.div key={index} variants={itemVariants} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold text-primary mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Target Sectors */}
      <section className="py-16 lg:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Built for Nigeria's Key Sectors
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Addressing specific needs in healthcare, finance, and education with 
              sector-tailored security and compliance features.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {sectors.map((sector, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-card transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{sector.icon}</div>
                    <h3 className="text-xl font-semibold mb-3">{sector.name}</h3>
                    <p className="text-muted-foreground">{sector.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose DecoSecure Storage?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Advanced blockchain technology meets Nigerian infrastructure needs for reliable, 
              affordable, and secure data storage solutions.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-card transition-all duration-300 hover:scale-105">
                  <CardContent className="p-6">
                    <feature.icon className={`h-10 w-10 ${feature.color} mb-4`} />
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-gradient-card">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Secure Your Data?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join Nigeria's leading decentralized storage platform. Connect your wallet 
              and start storing your files securely on the blockchain today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => setIsWalletModalOpen(true)}
                className="min-w-48"
              >
                Connect Wallet
                <Wallet className="ml-2 h-4 w-4" />
              </Button>
              
              <Link to="/ecosystem">
                <Button variant="outline" size="lg" className="min-w-48">
                  Explore Ecosystem
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center justify-center gap-4 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>NDPR Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                <span>End-to-End Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-secondary" />
                <span>Community Driven</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <ConnectWallet
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
      />
    </div>
  );
};