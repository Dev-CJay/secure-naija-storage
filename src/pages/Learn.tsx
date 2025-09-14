import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookOpen, Play, FileText, Users, Shield, Globe, Database, Lock, Zap, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export const Learn: React.FC = () => {
  const [activeLesson, setActiveLesson] = useState<string | null>(null);

  const lessons = [
    {
      id: 'basics',
      title: 'Decentralized Storage Basics',
      duration: '15 min',
      difficulty: 'Beginner',
      description: 'Learn the fundamentals of decentralized storage and how it differs from traditional cloud storage.',
      topics: ['What is decentralized storage?', 'Benefits over traditional storage', 'IPFS and blockchain basics', 'Use cases in Nigeria']
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      duration: '20 min',
      difficulty: 'Intermediate',
      description: 'Understanding encryption, data sovereignty, and security best practices.',
      topics: ['End-to-end encryption', 'Data sovereignty', 'Privacy protection', 'Key management']
    },
    {
      id: 'compliance',
      title: 'NDPR Compliance',
      duration: '25 min',
      difficulty: 'Advanced',
      description: 'Nigeria Data Protection Regulation compliance and legal requirements.',
      topics: ['NDPR requirements', 'Data localization', 'Consent management', 'Audit trails']
    }
  ];

  const faqs = [
    {
      question: "What is decentralized storage?",
      answer: "Decentralized storage distributes data across multiple nodes in a network, rather than storing it in a single centralized location. This provides better security, redundancy, and often lower costs compared to traditional cloud storage."
    },
    {
      question: "How does DecoSecure ensure data privacy?",
      answer: "DecoSecure uses end-to-end encryption, meaning your data is encrypted before it leaves your device. Only you have the keys to decrypt your data, ensuring complete privacy and compliance with data protection regulations."
    },
    {
      question: "Is DecoSecure compliant with Nigerian regulations?",
      answer: "Yes, DecoSecure is designed to be fully compliant with the Nigeria Data Protection Regulation (NDPR). We provide data localization options and audit trails to meet regulatory requirements."
    },
    {
      question: "How reliable is decentralized storage?",
      answer: "Decentralized storage typically offers higher reliability than traditional storage because your data is replicated across multiple nodes. If one node goes down, your data remains accessible from other nodes in the network."
    },
    {
      question: "What are the costs compared to traditional cloud storage?",
      answer: "Decentralized storage often costs significantly less than traditional cloud providers, especially for long-term storage. You only pay for the storage you use, with transparent pricing in DSC tokens."
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
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold mb-4">Learn Decentralized Storage</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Master blockchain storage, IPFS, and Nigerian data compliance with our comprehensive learning resources
          </p>
        </motion.div>

        <Tabs defaultValue="lessons" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="lessons">Interactive Lessons</TabsTrigger>
            <TabsTrigger value="guides">Compliance Guides</TabsTrigger>
            <TabsTrigger value="faq">FAQ</TabsTrigger>
          </TabsList>

          <TabsContent value="lessons">
            <motion.div 
              className="grid gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {lessons.map((lesson) => (
                <motion.div key={lesson.id} variants={itemVariants}>
                  <Card className="hover:shadow-card transition-all duration-300">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2 mb-2">
                            <BookOpen className="h-5 w-5 text-primary" />
                            {lesson.title}
                          </CardTitle>
                          <p className="text-muted-foreground">{lesson.description}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge variant="outline">{lesson.difficulty}</Badge>
                          <Badge variant="secondary">{lesson.duration}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">What you'll learn:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {lesson.topics.map((topic, index) => (
                            <li key={index}>{topic}</li>
                          ))}
                        </ul>
                      </div>
                      <Button 
                        className="w-full"
                        onClick={() => setActiveLesson(lesson.id)}
                      >
                        <Play className="mr-2 h-4 w-4" />
                        Start Lesson
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="guides">
            <motion.div 
              className="grid md:grid-cols-2 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <Card className="hover:shadow-card transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-primary" />
                      NDPR Compliance Guide
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Complete guide to Nigeria's Data Protection Regulation compliance using decentralized storage
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Legal requirements overview</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Data localization strategies</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Consent management</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Read NDPR Guide
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="hover:shadow-card transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Globe className="h-5 w-5 text-secondary" />
                      Global Standards
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      How DecoSecure aligns with international data protection standards
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">GDPR compatibility</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">SOC 2 compliance</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">ISO 27001 alignment</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      View Standards
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="hover:shadow-card transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5 text-accent" />
                      Enterprise Setup
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Best practices for enterprise deployments and team management
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Access control setup</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Team collaboration</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Database className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Backup strategies</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Enterprise Guide
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="hover:shadow-card transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-success" />
                      Developer Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Technical documentation and integration guides for developers
                    </p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">API documentation</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">SDK tutorials</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Community support</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      View Dev Docs
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </TabsContent>

          <TabsContent value="faq">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5 text-primary" />
                    Frequently Asked Questions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">
                          {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="text-muted-foreground">
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>

              <div className="mt-8 text-center">
                <Card>
                  <CardContent className="pt-6">
                    <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Still have questions?</h3>
                    <p className="text-muted-foreground mb-4">
                      Join our community for support and discussions
                    </p>
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline">
                        Join Discord
                      </Button>
                      <Button variant="outline">
                        Contact Support
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};