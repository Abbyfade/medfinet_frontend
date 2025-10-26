import apiService from '../utils/api';

// Base URL for AI-related APIs
const AI_API_BASE_URL = 'https://ai.example.api/v1';

// AI API service
const aiApi = {
  // Health assistant endpoints
  assistant: {
    sendMessage: async (userId: string, message: string, context?: any) => {
      return apiService.post(`${AI_API_BASE_URL}/assistant/message`, {
        userId,
        message,
        context,
      });
    },
    
    getConversationHistory: async (userId: string, limit = 20) => {
      return apiService.get(`${AI_API_BASE_URL}/assistant/history/${userId}`, {
        limit,
      });
    },
    
    clearConversation: async (userId: string) => {
      return apiService.delete(`${AI_API_BASE_URL}/assistant/history/${userId}`);
    },
  },
  
  // Symptom checker endpoints
  symptoms: {
    analyzeSymptoms: async (symptoms: string[], patientAge: number, patientGender: string) => {
      return apiService.post(`${AI_API_BASE_URL}/symptoms/analyze`, {
        symptoms,
        patientAge,
        patientGender,
      });
    },
    
    getRecommendations: async (analysisId: string) => {
      return apiService.get(`${AI_API_BASE_URL}/symptoms/recommendations/${analysisId}`);
    },
  },
  
  // Health insights endpoints
  insights: {
    getPersonalizedInsights: async (userId: string) => {
      return apiService.get(`${AI_API_BASE_URL}/insights/personalized/${userId}`);
    },
    
    getVaccinationRecommendations: async (childId: string) => {
      return apiService.get(`${AI_API_BASE_URL}/insights/vaccinations/${childId}`);
    },
    
    getHealthTips: async (category?: string, limit = 5) => {
      return apiService.get(`${AI_API_BASE_URL}/insights/health-tips`, {
        category,
        limit,
      });
    },
  },
  
  // Document analysis endpoints
  documents: {
    analyzeMedicalDocument: async (file: File, onProgress?: (percentage: number) => void) => {
      return apiService.uploadFile(
        `${AI_API_BASE_URL}/documents/analyze`,
        file,
        onProgress
      );
    },
    
    extractInvoiceData: async (file: File, onProgress?: (percentage: number) => void) => {
      return apiService.uploadFile(
        `${AI_API_BASE_URL}/documents/extract-invoice`,
        file,
        onProgress
      );
    },
  },
};

export default aiApi;