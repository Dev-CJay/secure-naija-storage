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
    if (!this.provider) {
      throw new Error('No Web3 provider found');
    }

    try {
      const accounts = await this.provider.send('eth_requestAccounts', []);
      return accounts[0];
    } catch (error) {
      console.error('Failed to connect wallet:', error);
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

  async retrieveFile(dealId: string, retrievalCost: number): Promise<boolean> {
    if (!this.contract) {
      // Mock implementation
      return this.mockRetrieveFile(dealId);
    }

    try {
      const tx = await this.contract.retrieveFile(dealId, {
        value: ethers.utils.parseEther(retrievalCost.toString())
      });

      await tx.wait();
      return true;
    } catch (error) {
      console.error('Failed to retrieve file:', error);
      throw error;
    }
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