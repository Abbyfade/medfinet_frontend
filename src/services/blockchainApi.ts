import apiService from '../utils/api';

// Base URL for blockchain-related APIs
const BLOCKCHAIN_API_BASE_URL = 'https://blockchain.example.api/v1';

// Blockchain API service
const blockchainApi = {
  // Verification endpoints
  verification: {
    verifyVaccinationRecord: async (recordId: string) => {
      return apiService.get(`${BLOCKCHAIN_API_BASE_URL}/verify/vaccination/${recordId}`);
    },
    
    verifyHealthWorker: async (workerId: string) => {
      return apiService.get(`${BLOCKCHAIN_API_BASE_URL}/verify/health-worker/${workerId}`);
    },
    
    verifyMedicalInvoice: async (invoiceId: string) => {
      return apiService.get(`${BLOCKCHAIN_API_BASE_URL}/verify/invoice/${invoiceId}`);
    },
  },
  
  // Tokenization endpoints
  tokenization: {
    tokenizeVaccinationRecord: async (data: any) => {
      return apiService.post(`${BLOCKCHAIN_API_BASE_URL}/tokenize/vaccination`, data);
    },
    
    tokenizeChildProfile: async (data: any) => {
      return apiService.post(`${BLOCKCHAIN_API_BASE_URL}/tokenize/child-profile`, data);
    },
    
    tokenizeMedicalInvoice: async (data: any) => {
      return apiService.post(`${BLOCKCHAIN_API_BASE_URL}/tokenize/invoice`, data);
    },
  },
  
  // Transaction endpoints
  transactions: {
    getTransactionDetails: async (txHash: string) => {
      return apiService.get(`${BLOCKCHAIN_API_BASE_URL}/transactions/${txHash}`);
    },
    
    getUserTransactions: async (walletAddress: string, limit = 10) => {
      return apiService.get(`${BLOCKCHAIN_API_BASE_URL}/transactions/user/${walletAddress}`, {
        limit,
      });
    },
    
    getTransactionStatus: async (txHash: string) => {
      return apiService.get(`${BLOCKCHAIN_API_BASE_URL}/transactions/${txHash}/status`);
    },
  },
  
  // Wallet endpoints
  wallet: {
    getWalletBalance: async (walletAddress: string) => {
      return apiService.get(`${BLOCKCHAIN_API_BASE_URL}/wallet/${walletAddress}/balance`);
    },
    
    getWalletAssets: async (walletAddress: string) => {
      return apiService.get(`${BLOCKCHAIN_API_BASE_URL}/wallet/${walletAddress}/assets`);
    },
  },
  
  // Smart contract endpoints
  contracts: {
    getContractDetails: async (contractAddress: string) => {
      return apiService.get(`${BLOCKCHAIN_API_BASE_URL}/contracts/${contractAddress}`);
    },
    
    callContractMethod: async (contractAddress: string, method: string, params: any) => {
      return apiService.post(`${BLOCKCHAIN_API_BASE_URL}/contracts/${contractAddress}/call`, {
        method,
        params,
      });
    },
  },
};

export default blockchainApi;