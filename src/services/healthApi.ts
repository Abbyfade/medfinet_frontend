import apiService from '../utils/api';

// Base URL for health-related APIs
const HEALTH_API_BASE_URL = 'https://health.example.api/v1';

// Health Data API service
const healthApi = {
  // Vaccination-related endpoints
  vaccinations: {
    getRecommendedSchedule: async (childAge: number, region = 'US') => {
      return apiService.get(`${HEALTH_API_BASE_URL}/vaccinations/schedule`, {
        age: childAge,
        region,
      });
    },
    
    getVaccineInfo: async (vaccineId: string) => {
      return apiService.get(`${HEALTH_API_BASE_URL}/vaccinations/${vaccineId}`);
    },
    
    searchVaccines: async (query: string) => {
      return apiService.get(`${HEALTH_API_BASE_URL}/vaccinations/search`, {
        q: query,
      });
    },
    
    reportAdverseEvent: async (data: any) => {
      return apiService.post(`${HEALTH_API_BASE_URL}/vaccinations/adverse-events`, data);
    },
  },
  
  // Health centers and providers
  providers: {
    searchNearby: async (latitude: number, longitude: number, radius = 10) => {
      return apiService.get(`${HEALTH_API_BASE_URL}/providers/nearby`, {
        lat: latitude,
        lng: longitude,
        radius,
      });
    },
    
    getProviderDetails: async (providerId: string) => {
      return apiService.get(`${HEALTH_API_BASE_URL}/providers/${providerId}`);
    },
    
    getAvailableSlots: async (providerId: string, date: string) => {
      return apiService.get(`${HEALTH_API_BASE_URL}/providers/${providerId}/slots`, {
        date,
      });
    },
  },
  
  // Medical records and health data
  records: {
    getChildRecords: async (childId: string) => {
      return apiService.get(`${HEALTH_API_BASE_URL}/records/child/${childId}`);
    },
    
    uploadMedicalDocument: async (childId: string, file: File, documentType: string, onProgress?: (percentage: number) => void) => {
      return apiService.uploadFile(
        `${HEALTH_API_BASE_URL}/records/child/${childId}/documents`,
        file,
        onProgress
      );
    },
    
    shareRecordWithProvider: async (recordId: string, providerId: string, expiryDate?: string) => {
      return apiService.post(`${HEALTH_API_BASE_URL}/records/${recordId}/share`, {
        providerId,
        expiryDate,
      });
    },
  },
  
  // Health education and resources
  education: {
    getArticles: async (category?: string, limit = 10) => {
      return apiService.get(`${HEALTH_API_BASE_URL}/education/articles`, {
        category,
        limit,
      });
    },
    
    getVaccineEducation: async (vaccineId: string) => {
      return apiService.get(`${HEALTH_API_BASE_URL}/education/vaccines/${vaccineId}`);
    },
    
    searchResources: async (query: string) => {
      return apiService.get(`${HEALTH_API_BASE_URL}/education/search`, {
        q: query,
      });
    },
  },
  
  // Health analytics and insights
  analytics: {
    getChildGrowthData: async (childId: string) => {
      return apiService.get(`${HEALTH_API_BASE_URL}/analytics/growth/${childId}`);
    },
    
    getVaccinationCoverage: async (region?: string) => {
      return apiService.get(`${HEALTH_API_BASE_URL}/analytics/vaccination-coverage`, {
        region,
      });
    },
    
    getHealthTrends: async (metric: string, timeframe = '1y') => {
      return apiService.get(`${HEALTH_API_BASE_URL}/analytics/trends`, {
        metric,
        timeframe,
      });
    },
  },
};

export default healthApi;