import apiService from '../utils/api';

// Base URL for finance-related APIs
const FINANCE_API_BASE_URL = 'https://finance.example.api/v1';

// Finance API service
const financeApi = {
  // Invoice endpoints
  invoices: {
    getInvoiceDetails: async (invoiceId: string) => {
      return apiService.get(`${FINANCE_API_BASE_URL}/invoices/${invoiceId}`);
    },
    
    getUserInvoices: async (userId: string, status?: string) => {
      return apiService.get(`${FINANCE_API_BASE_URL}/invoices/user/${userId}`, {
        status,
      });
    },
    
    createInvoice: async (data: any) => {
      return apiService.post(`${FINANCE_API_BASE_URL}/invoices`, data);
    },
    
    updateInvoiceStatus: async (invoiceId: string, status: string) => {
      return apiService.put(`${FINANCE_API_BASE_URL}/invoices/${invoiceId}/status`, {
        status,
      });
    },
  },
  
  // Funding endpoints
  funding: {
    getFundingOptions: async (invoiceId: string) => {
      return apiService.get(`${FINANCE_API_BASE_URL}/funding/options/${invoiceId}`);
    },
    
    fundInvoice: async (invoiceId: string, amount: number, funderId: string) => {
      return apiService.post(`${FINANCE_API_BASE_URL}/funding/fund`, {
        invoiceId,
        amount,
        funderId,
      });
    },
    
    getFundingHistory: async (userId: string) => {
      return apiService.get(`${FINANCE_API_BASE_URL}/funding/history/${userId}`);
    },
  },
  
  // Payment endpoints
  payments: {
    createPaymentIntent: async (amount: number, currency = 'usd', description: string) => {
      return apiService.post(`${FINANCE_API_BASE_URL}/payments/create-intent`, {
        amount,
        currency,
        description,
      });
    },
    
    confirmPayment: async (paymentIntentId: string, paymentMethodId: string) => {
      return apiService.post(`${FINANCE_API_BASE_URL}/payments/confirm`, {
        paymentIntentId,
        paymentMethodId,
      });
    },
    
    getPaymentHistory: async (userId: string) => {
      return apiService.get(`${FINANCE_API_BASE_URL}/payments/history/${userId}`);
    },
  },
  
  // Insurance endpoints
  insurance: {
    getPolicies: async (userId: string) => {
      return apiService.get(`${FINANCE_API_BASE_URL}/insurance/policies/${userId}`);
    },
    
    getPolicyDetails: async (policyId: string) => {
      return apiService.get(`${FINANCE_API_BASE_URL}/insurance/policies/${policyId}`);
    },
    
    submitClaim: async (data: any) => {
      return apiService.post(`${FINANCE_API_BASE_URL}/insurance/claims`, data);
    },
    
    getClaimStatus: async (claimId: string) => {
      return apiService.get(`${FINANCE_API_BASE_URL}/insurance/claims/${claimId}/status`);
    },
  },
};

export default financeApi;