import { ethers } from 'ethers';

// Extend Window interface for ethereum
declare global {
  interface Window {
    ethereum?: any;
  }
}

// Mock smart contract interface for Filecoin-like functionality
export interface ContractDeal {
  id: string;
  clientAddress: string;
  providerAddress: string;
  fileCid: string;
  fileSize: number;
  dealCost: number;
  dealDuration: number;
  collateral: number;
  verified: boolean;
  replicationFactor: number;
  retrievalPrice: number;
  timestamp: number;
  status: 'pending' | 'active' | 'completed' | 'slashed' | 'expired';
}

export interface ProviderInfo {
  address: string;
  peerId: string;
  multiaddr: string;
  location: string;
  reputation: number;
  totalStorage: number;
  availableStorage: number;
  price: number;
  collateral: number;
  verified: boolean;
  sectorSize: number;
}

// Smart contract ABI for Filecoin-like functionality
const CONTRACT_ABI = [
  {
    "inputs": [
      {"type": "string", "name": "fileCid"},
      {"type": "uint256", "name": "fileSize"},
      {"type": "uint256", "name": "dealDuration"},
      {"type": "address", "name": "provider"},
      {"type": "uint256", "name": "replicationFactor"}
    ],
    "name": "createStorageDeal",
    "outputs": [{"type": "uint256", "name": "dealId"}],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256", "name": "dealId"}],
    "name": "retrieveFile",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [{"type": "address", "name": "provider"}],
    "name": "registerProvider",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"type": "uint256", "name": "dealId"}],
    "name": "verifyStorage",
    "outputs": [{"type": "bool", "name": "verified"}],
    "stateMutability": "view",
    "type": "function"
  }
];

// Contract address (mock)
const CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890';

export class SmartContractService {
  private provider: ethers.providers.Web3Provider | null = null;
  private contract: ethers.Contract | null = null;
  private signer: ethers.Signer | null = null;

  constructor() {
    this.initializeProvider();
  }

  private async initializeProvider() {
    if (typeof window !== 'undefined' && window.ethereum) {
      try {
        this.provider = new ethers.providers.Web3Provider(window.ethereum);
        this.signer = this.provider.getSigner();
        this.contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, this.signer);
      } catch (error) {
        console.error('Failed to initialize provider:', error);
      }
    }
  }

  async connectWallet(): Promise<string | null> {
    // Check if MetaMask is installed
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('MetaMask is not installed. Please install MetaMask to connect your wallet.');
    }

    try {
      // Reinitialize provider if needed
      if (!this.provider) {
        await this.initializeProvider();
      }

      if (!this.provider) {
        throw new Error('Failed to initialize Web3 provider');
      }

      // Request account access
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      
      if (!accounts || accounts.length === 0) {
        throw new Error('No accounts found. Please unlock MetaMask.');
      }

      return accounts[0];
    } catch (error: any) {
      console.error('Failed to connect wallet:', error);
      
      if (error.code === 4001) {
        throw new Error('User rejected the connection request');
      } else if (error.code === -32002) {
        throw new Error('Connection request already pending. Please check MetaMask.');
      }
      
      throw error;
    }
  }

  async createStorageDeal(
    fileCid: string,
    fileSize: number,
    dealDuration: number,
    providerAddress: string,
    replicationFactor: number = 3,
    dealCost: number
  ): Promise<string> {
    if (!this.contract || !this.signer) {
      // Mock implementation for demo
      return this.mockCreateDeal(fileCid, fileSize, dealDuration, providerAddress, replicationFactor, dealCost);
    }

    try {
      const tx = await this.contract.createStorageDeal(
        fileCid,
        fileSize,
        dealDuration,
        providerAddress,
        replicationFactor,
        {
          value: ethers.utils.parseEther(dealCost.toString())
        }
      );

      const receipt = await tx.wait();
      const dealId = receipt.events?.[0]?.args?.dealId?.toString();
      
      return dealId || 'mock-deal-' + Date.now();
    } catch (error) {
      console.error('Failed to create storage deal:', error);
      throw error;
    }
  }

  async retrieveFile(fileCid: string, fileName: string): Promise<string> {
    console.log(`Retrieving file: ${fileName} (CID: ${fileCid})`);
    
    // Mock file retrieval with proper file type handling
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const fileExtension = fileName.split('.').pop()?.toLowerCase();
    let mockFileUrl: string;
    
    // Generate appropriate mock content based on file type
    if (['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(fileExtension || '')) {
      // For images, create a sample image blob
      mockFileUrl = 'https://picsum.photos/800/600';
    } else if (['mp4', 'avi', 'mov'].includes(fileExtension || '')) {
      // For videos, use a sample video
      mockFileUrl = 'https://sample-videos.com/zip/10/mp4/SampleVideo_360x240_1mb.mp4';
    } else {
      // For other file types, create appropriate mock content
      let mockContent: string;
      let mimeType: string;
      
      switch (fileExtension) {
        case 'pdf':
          mockContent = 'Mock PDF content';
          mimeType = 'application/pdf';
          break;
        case 'txt':
          mockContent = `This is a mock text file: ${fileName}\n\nContent retrieved from decentralized storage.`;
          mimeType = 'text/plain';
          break;
        case 'json':
          mockContent = JSON.stringify({ message: `Mock JSON content for ${fileName}`, timestamp: new Date().toISOString() }, null, 2);
          mimeType = 'application/json';
          break;
        default:
          mockContent = `Mock content for ${fileName}\nFile type: ${fileExtension || 'unknown'}`;
          mimeType = 'text/plain';
      }
      
      const blob = new Blob([mockContent], { type: mimeType });
      mockFileUrl = URL.createObjectURL(blob);
    }
    
    console.log(`File retrieved: ${fileName}`);
    return mockFileUrl;
  }

  async verifyStorage(dealId: string): Promise<boolean> {
    if (!this.contract) {
      // Mock verification
      return Math.random() > 0.2; // 80% success rate
    }

    try {
      const verified = await this.contract.verifyStorage(dealId);
      return verified;
    } catch (error) {
      console.error('Failed to verify storage:', error);
      return false;
    }
  }

  async registerProvider(
    peerId: string,
    multiaddr: string,
    location: string,
    totalStorage: number,
    price: number,
    collateral: number
  ): Promise<boolean> {
    if (!this.contract) {
      // Mock implementation
      return true;
    }

    try {
      const tx = await this.contract.registerProvider(
        await this.signer!.getAddress()
      );

      await tx.wait();
      return true;
    } catch (error) {
      console.error('Failed to register provider:', error);
      throw error;
    }
  }

  // Mock implementations for demo purposes
  private async mockCreateDeal(
    fileCid: string,
    fileSize: number,
    dealDuration: number,
    providerAddress: string,
    replicationFactor: number,
    dealCost: number
  ): Promise<string> {
    // Simulate blockchain delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const dealId = `deal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    // Store in localStorage for demo persistence
    const deals = this.getMockDeals();
    deals.push({
      id: dealId,
      clientAddress: 'mock-client-address',
      providerAddress,
      fileCid,
      fileSize,
      dealCost,
      dealDuration,
      collateral: dealCost * 0.1,
      verified: false,
      replicationFactor,
      retrievalPrice: dealCost * 0.01,
      timestamp: Date.now(),
      status: 'pending'
    });
    
    localStorage.setItem('mockDeals', JSON.stringify(deals));
    return dealId;
  }

  private async mockRetrieveFile(dealId: string): Promise<boolean> {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const deals = this.getMockDeals();
    const deal = deals.find(d => d.id === dealId);
    
    if (deal) {
      deal.status = 'active';
      localStorage.setItem('mockDeals', JSON.stringify(deals));
      return true;
    }
    
    return false;
  }

  private getMockDeals(): ContractDeal[] {
    const stored = localStorage.getItem('mockDeals');
    return stored ? JSON.parse(stored) : [];
  }

  async getDealHistory(userAddress?: string): Promise<ContractDeal[]> {
    // Mock implementation
    return this.getMockDeals().filter(deal => 
      !userAddress || deal.clientAddress === userAddress
    );
  }

  async getProviderCredibility(providerAddress: string): Promise<{
    reputation: number;
    totalDeals: number;
    successRate: number;
    totalStorage: number;
    slashingHistory: number;
    verified: boolean;
  }> {
    // Mock credibility data
    const baseReputation = 750 + Math.floor(Math.random() * 250);
    return {
      reputation: baseReputation,
      totalDeals: Math.floor(Math.random() * 1000) + 100,
      successRate: 0.95 + Math.random() * 0.05,
      totalStorage: Math.floor(Math.random() * 1000) + 100,
      slashingHistory: Math.floor(Math.random() * 5),
      verified: Math.random() > 0.3
    };
  }

  async getNetworkStats(): Promise<{
    totalDeals: number;
    totalStorage: number;
    activeProviders: number;
    networkUtilization: number;
    averagePrice: number;
  }> {
    return {
      totalDeals: 45678 + Math.floor(Math.random() * 1000),
      totalStorage: 2.5 + Math.random() * 0.5, // PB
      activeProviders: 1250 + Math.floor(Math.random() * 100),
      networkUtilization: 0.65 + Math.random() * 0.2,
      averagePrice: 0.0001 + Math.random() * 0.0001
    };
  }
}

// Singleton instance
export const contractService = new SmartContractService();