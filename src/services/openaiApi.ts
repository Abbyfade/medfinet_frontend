import apiService from '../utils/api';

// Base URL for OpenAI proxy API
const OPENAI_API_BASE_URL = 'https://ai.example.api/v1/openai';

// OpenAI API service
const openaiApi = {
  // Chat completions
  chat: {
    createCompletion: async (messages: any[], options = {}) => {
      // In a real implementation, you would use the OpenAI client directly
      // Here we're using a proxy API to avoid exposing API keys in the frontend
      return apiService.post(`${OPENAI_API_BASE_URL}/chat/completions`, {
        messages,
        ...options,
      });
    },
  },
  
  // Health-specific chat completions
  healthAssistant: {
    askQuestion: async (question: string, patientContext?: any) => {
      return apiService.post(`${OPENAI_API_BASE_URL}/health-assistant/ask`, {
        question,
        patientContext,
      });
    },
    
    analyzeSymptoms: async (symptoms: string[], patientInfo?: any) => {
      return apiService.post(`${OPENAI_API_BASE_URL}/health-assistant/symptoms`, {
        symptoms,
        patientInfo,
      });
    },
    
    getVaccineInfo: async (vaccineName: string) => {
      return apiService.post(`${OPENAI_API_BASE_URL}/health-assistant/vaccine-info`, {
        vaccineName,
      });
    },
    
    getMedicationInfo: async (medicationName: string) => {
      return apiService.post(`${OPENAI_API_BASE_URL}/health-assistant/medication-info`, {
        medicationName,
      });
    },
  },
  
  // Document analysis
  documents: {
    analyzeMedicalDocument: async (documentText: string) => {
      return apiService.post(`${OPENAI_API_BASE_URL}/documents/analyze`, {
        documentText,
      });
    },
    
    extractInvoiceData: async (invoiceText: string) => {
      return apiService.post(`${OPENAI_API_BASE_URL}/documents/extract-invoice`, {
        invoiceText,
      });
    },
    
    summarizeMedicalRecord: async (recordText: string) => {
      return apiService.post(`${OPENAI_API_BASE_URL}/documents/summarize`, {
        recordText,
      });
    },
  },
  
  // Image analysis
  images: {
    analyzeMedicalImage: async (imageUrl: string, prompt: string) => {
      return apiService.post(`${OPENAI_API_BASE_URL}/images/analyze`, {
        imageUrl,
        prompt,
      });
    },
  },
  
  // Health insights
  insights: {
    generateHealthTips: async (patientProfile: any) => {
      return apiService.post(`${OPENAI_API_BASE_URL}/insights/health-tips`, {
        patientProfile,
      });
    },
    
    generateVaccinationReminders: async (childProfile: any) => {
      return apiService.post(`${OPENAI_API_BASE_URL}/insights/vaccination-reminders`, {
        childProfile,
      });
    },
  },
  
  // Direct OpenAI client for server-side use (not for client-side)
  // This would typically be used in a Node.js environment or edge function
  // Note: OpenAI client would be used server-side only
  createServerClient: (apiKey: string) => {
    // This would create an OpenAI client instance server-side
    console.log('OpenAI client would be created with API key:', apiKey);
    return null;
  },
};

export default openaiApi;