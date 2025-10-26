import apiService from '../utils/api';

// Base URL for health facility-related APIs
const HEALTH_FACILITY_API_BASE_URL = 'https://facilities.example.api/v1';

// Health Facility API service
const healthFacilityApi = {
  // Facility management endpoints
  facilities: {
    getAllFacilities: async (params?: any) => {
      return apiService.get(`${HEALTH_FACILITY_API_BASE_URL}/facilities`, params);
    },
    
    getFacilityById: async (facilityId: string) => {
      return apiService.get(`${HEALTH_FACILITY_API_BASE_URL}/facilities/${facilityId}`);
    },
    
    createFacility: async (facilityData: any) => {
      return apiService.post(`${HEALTH_FACILITY_API_BASE_URL}/facilities`, facilityData);
    },
    
    updateFacility: async (facilityId: string, facilityData: any) => {
      return apiService.put(`${HEALTH_FACILITY_API_BASE_URL}/facilities/${facilityId}`, facilityData);
    },
    
    deleteFacility: async (facilityId: string) => {
      return apiService.delete(`${HEALTH_FACILITY_API_BASE_URL}/facilities/${facilityId}`);
    },
  },
  
  // Location-based search endpoints
  location: {
    searchNearby: async (latitude: number, longitude: number, radius = 10, filters?: any) => {
      return apiService.get(`${HEALTH_FACILITY_API_BASE_URL}/facilities/nearby`, {
        latitude,
        longitude,
        radius,
        ...filters
      });
    },
    
    searchByRegion: async (region: string, filters?: any) => {
      return apiService.get(`${HEALTH_FACILITY_API_BASE_URL}/facilities/region/${region}`, filters);
    },
    
    getServiceableAreas: async () => {
      return apiService.get(`${HEALTH_FACILITY_API_BASE_URL}/serviceable-areas`);
    },
  },
  
  // Facility services endpoints
  services: {
    getFacilityServices: async (facilityId: string) => {
      return apiService.get(`${HEALTH_FACILITY_API_BASE_URL}/facilities/${facilityId}/services`);
    },
    
    addService: async (facilityId: string, serviceData: any) => {
      return apiService.post(`${HEALTH_FACILITY_API_BASE_URL}/facilities/${facilityId}/services`, serviceData);
    },
    
    updateService: async (facilityId: string, serviceId: string, serviceData: any) => {
      return apiService.put(`${HEALTH_FACILITY_API_BASE_URL}/facilities/${facilityId}/services/${serviceId}`, serviceData);
    },
    
    removeService: async (facilityId: string, serviceId: string) => {
      return apiService.delete(`${HEALTH_FACILITY_API_BASE_URL}/facilities/${facilityId}/services/${serviceId}`);
    },
  },
  
  // Staff management endpoints
  staff: {
    getFacilityStaff: async (facilityId: string) => {
      return apiService.get(`${HEALTH_FACILITY_API_BASE_URL}/facilities/${facilityId}/staff`);
    },
    
    addStaffMember: async (facilityId: string, staffData: any) => {
      return apiService.post(`${HEALTH_FACILITY_API_BASE_URL}/facilities/${facilityId}/staff`, staffData);
    },
    
    updateStaffMember: async (facilityId: string, staffId: string, staffData: any) => {
      return apiService.put(`${HEALTH_FACILITY_API_BASE_URL}/facilities/${facilityId}/staff/${staffId}`, staffData);
    },
    
    removeStaffMember: async (facilityId: string, staffId: string) => {
      return apiService.delete(`${HEALTH_FACILITY_API_BASE_URL}/facilities/${facilityId}/staff/${staffId}`);
    },
  },
  
  // Facility verification endpoints
  verification: {
    verifyFacility: async (facilityId: string, verificationData: any) => {
      return apiService.post(`${HEALTH_FACILITY_API_BASE_URL}/facilities/${facilityId}/verify`, verificationData);
    },
    
    getVerificationStatus: async (facilityId: string) => {
      return apiService.get(`${HEALTH_FACILITY_API_BASE_URL}/facilities/${facilityId}/verification-status`);
    },
    
    submitVerificationDocuments: async (facilityId: string, files: File[], onProgress?: (percentage: number) => void) => {
      const formData = new FormData();
      
      files.forEach((file, index) => {
        formData.append(`document_${index}`, file);
      });
      
      return apiService.post(
        `${HEALTH_FACILITY_API_BASE_URL}/facilities/${facilityId}/verification-documents`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total && onProgress) {
              const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              onProgress(percentage);
            }
          },
        }
      );
    },
  },
  
  // Facility analytics endpoints
  analytics: {
    getFacilityStats: async (facilityId: string, timeframe = '30d') => {
      return apiService.get(`${HEALTH_FACILITY_API_BASE_URL}/facilities/${facilityId}/stats`, {
        timeframe,
      });
    },
    
    getVaccinationStats: async (facilityId: string, timeframe = '30d') => {
      return apiService.get(`${HEALTH_FACILITY_API_BASE_URL}/facilities/${facilityId}/vaccination-stats`, {
        timeframe,
      });
    },
    
    getPatientDemographics: async (facilityId: string) => {
      return apiService.get(`${HEALTH_FACILITY_API_BASE_URL}/facilities/${facilityId}/patient-demographics`);
    },
  },
  
  // Facility reviews endpoints
  reviews: {
    getFacilityReviews: async (facilityId: string) => {
      return apiService.get(`${HEALTH_FACILITY_API_BASE_URL}/facilities/${facilityId}/reviews`);
    },
    
    addReview: async (facilityId: string, reviewData: any) => {
      return apiService.post(`${HEALTH_FACILITY_API_BASE_URL}/facilities/${facilityId}/reviews`, reviewData);
    },
    
    respondToReview: async (facilityId: string, reviewId: string, response: string) => {
      return apiService.post(`${HEALTH_FACILITY_API_BASE_URL}/facilities/${facilityId}/reviews/${reviewId}/respond`, {
        response,
      });
    },
  },
  
  // Facility operating hours endpoints
  operatingHours: {
    getOperatingHours: async (facilityId: string) => {
      return apiService.get(`${HEALTH_FACILITY_API_BASE_URL}/facilities/${facilityId}/operating-hours`);
    },
    
    updateOperatingHours: async (facilityId: string, hoursData: any) => {
      return apiService.put(`${HEALTH_FACILITY_API_BASE_URL}/facilities/${facilityId}/operating-hours`, hoursData);
    },
  },
  
  // Facility types and categories
  types: {
    getFacilityTypes: async () => {
      return apiService.get(`${HEALTH_FACILITY_API_BASE_URL}/facility-types`);
    },
    
    getServiceCategories: async () => {
      return apiService.get(`${HEALTH_FACILITY_API_BASE_URL}/service-categories`);
    },
  },
  
  // Mock data for development (when API is not available)
  mock: {
    // Get mock facilities
    getMockFacilities: () => {
      return {
        facilities: [
          {
            id: 'fac_001',
            name: 'City Pediatrics Medical Center',
            type: 'clinic',
            address: '123 Healthcare Drive',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            phone: '(212) 555-1234',
            email: 'info@citypediatrics.com',
            website: 'https://www.citypediatrics.com',
            latitude: 40.7128,
            longitude: -74.0060,
            verified: true,
            rating: 4.8,
            reviewCount: 156,
            services: ['Pediatric Care', 'Vaccinations', 'Well-child Visits', 'Sick Visits'],
            operatingHours: [
              { day: 'Monday', open: '08:00', close: '18:00' },
              { day: 'Tuesday', open: '08:00', close: '18:00' },
              { day: 'Wednesday', open: '08:00', close: '18:00' },
              { day: 'Thursday', open: '08:00', close: '18:00' },
              { day: 'Friday', open: '08:00', close: '17:00' },
              { day: 'Saturday', open: '09:00', close: '13:00' },
              { day: 'Sunday', open: 'Closed', close: 'Closed' }
            ],
            availableVaccines: ['DTaP', 'MMR', 'Polio', 'Hepatitis B', 'Varicella', 'Influenza'],
            insuranceAccepted: ['Blue Cross', 'Aetna', 'Cigna', 'UnitedHealthcare', 'Medicaid'],
            staffCount: 12,
            childrenServed: 856,
            vaccinationsThisMonth: 147
          },
          {
            id: 'fac_002',
            name: 'Metro Medical Center',
            type: 'hospital',
            address: '456 Medical Plaza',
            city: 'New York',
            state: 'NY',
            zipCode: '10002',
            phone: '(212) 555-5678',
            email: 'contact@metromedical.com',
            website: 'https://www.metromedical.com',
            latitude: 40.7282,
            longitude: -73.9942,
            verified: true,
            rating: 4.6,
            reviewCount: 423,
            services: ['Emergency Care', 'Surgery', 'Pediatrics', 'Vaccinations', 'Radiology'],
            operatingHours: [
              { day: 'Monday-Sunday', open: '24 hours', close: '24 hours' }
            ],
            availableVaccines: ['DTaP', 'MMR', 'Influenza', 'COVID-19', 'Hepatitis A', 'Hepatitis B'],
            insuranceAccepted: ['Blue Cross', 'Aetna', 'Cigna', 'UnitedHealthcare', 'Medicare', 'Medicaid'],
            staffCount: 45,
            childrenServed: 2341,
            vaccinationsThisMonth: 289
          },
          {
            id: 'fac_003',
            name: 'Community Health Center',
            type: 'health_center',
            address: '789 Community Way',
            city: 'Brooklyn',
            state: 'NY',
            zipCode: '11201',
            phone: '(718) 555-9012',
            email: 'info@communityhc.org',
            website: 'https://www.communityhc.org',
            latitude: 40.6782,
            longitude: -73.9442,
            verified: true,
            rating: 4.5,
            reviewCount: 87,
            services: ['Primary Care', 'Vaccinations', 'Health Screenings', 'Women\'s Health'],
            operatingHours: [
              { day: 'Monday', open: '09:00', close: '17:00' },
              { day: 'Tuesday', open: '09:00', close: '17:00' },
              { day: 'Wednesday', open: '09:00', close: '17:00' },
              { day: 'Thursday', open: '09:00', close: '17:00' },
              { day: 'Friday', open: '09:00', close: '17:00' },
              { day: 'Saturday', open: 'Closed', close: 'Closed' },
              { day: 'Sunday', open: 'Closed', close: 'Closed' }
            ],
            availableVaccines: ['MMR', 'Polio', 'Influenza', 'Hepatitis A'],
            insuranceAccepted: ['Medicaid', 'Medicare', 'Blue Cross', 'UnitedHealthcare'],
            staffCount: 8,
            childrenServed: 423,
            vaccinationsThisMonth: 67
          }
        ]
      };
    },
    
    // Get mock facility details
    getMockFacilityDetails: (facilityId: string) => {
      const facilities = healthFacilityApi.mock.getMockFacilities().facilities;
      return facilities.find(facility => facility.id === facilityId);
    },
    
    // Get mock facility staff
    getMockFacilityStaff: (facilityId: string) => {
      return {
        staff: [
          {
            id: 'staff_001',
            facilityId: 'fac_001',
            name: 'Dr. Sarah Johnson',
            role: 'Pediatrician',
            specialty: 'General Pediatrics',
            licenseNumber: 'MD-12345-NY',
            email: 'sarah.johnson@citypediatrics.com',
            phone: '(212) 555-1234 ext. 101',
            bio: 'Dr. Johnson has been practicing pediatric medicine for over 10 years and specializes in early childhood development.',
            imageUrl: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg?auto=compress&cs=tinysrgb&w=150',
            verified: true
          },
          {
            id: 'staff_002',
            facilityId: 'fac_001',
            name: 'Nurse Maria Rodriguez',
            role: 'Registered Nurse',
            specialty: 'Pediatric Nursing',
            licenseNumber: 'RN-67890-NY',
            email: 'maria.rodriguez@citypediatrics.com',
            phone: '(212) 555-1234 ext. 102',
            bio: 'Nurse Rodriguez has extensive experience in pediatric care and immunizations.',
            imageUrl: 'https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg?auto=compress&cs=tinysrgb&w=150',
            verified: true
          },
          {
            id: 'staff_003',
            facilityId: 'fac_001',
            name: 'Dr. Michael Chen',
            role: 'Pediatrician',
            specialty: 'Adolescent Medicine',
            licenseNumber: 'MD-54321-NY',
            email: 'michael.chen@citypediatrics.com',
            phone: '(212) 555-1234 ext. 103',
            bio: 'Dr. Chen specializes in adolescent medicine and preventive care.',
            imageUrl: 'https://images.pexels.com/photos/5327584/pexels-photo-5327584.jpeg?auto=compress&cs=tinysrgb&w=150',
            verified: true
          }
        ]
      };
    },
    
    // Get mock facility reviews
    getMockFacilityReviews: (facilityId: string) => {
      return {
        reviews: [
          {
            id: 'review_001',
            facilityId: 'fac_001',
            userId: 'user_001',
            userName: 'John Williams',
            rating: 5,
            comment: 'Excellent care for my children. The staff is friendly and professional. Dr. Johnson is amazing with kids!',
            date: '2024-05-15T10:30:00Z',
            helpful: 12,
            response: {
              text: 'Thank you for your kind words! We\'re glad to hear about your positive experience.',
              date: '2024-05-16T09:15:00Z'
            }
          },
          {
            id: 'review_002',
            facilityId: 'fac_001',
            userId: 'user_002',
            userName: 'Maria Davis',
            rating: 4,
            comment: 'Great facility with caring staff. Sometimes the wait times can be long, but the care is worth it.',
            date: '2024-04-20T14:45:00Z',
            helpful: 8,
            response: {
              text: 'Thank you for your feedback. We\'re working on improving our scheduling to reduce wait times.',
              date: '2024-04-21T11:30:00Z'
            }
          },
          {
            id: 'review_003',
            facilityId: 'fac_001',
            userId: 'user_003',
            userName: 'Robert Johnson',
            rating: 5,
            comment: 'The vaccination process was quick and painless. My daughter didn\'t even cry! Highly recommend.',
            date: '2024-03-10T16:20:00Z',
            helpful: 15
          }
        ]
      };
    },
    
    // Get mock facility analytics
    getMockFacilityAnalytics: (facilityId: string) => {
      return {
        patientVisits: {
          total: 1247,
          thisMonth: 156,
          growth: 12.5
        },
        vaccinations: {
          total: 3456,
          thisMonth: 423,
          byType: [
            { name: 'DTaP', count: 98 },
            { name: 'MMR', count: 87 },
            { name: 'Polio', count: 76 },
            { name: 'Hepatitis B', count: 65 },
            { name: 'Varicella', count: 54 },
            { name: 'Influenza', count: 43 }
          ]
        },
        demographics: {
          ageGroups: [
            { group: '0-1 years', count: 234, percentage: 18.8 },
            { group: '1-2 years', count: 312, percentage: 25.0 },
            { group: '2-5 years', count: 423, percentage: 33.9 },
            { group: '5-12 years', count: 278, percentage: 22.3 }
          ],
          gender: [
            { gender: 'Male', count: 634, percentage: 50.8 },
            { gender: 'Female', count: 613, percentage: 49.2 }
          ]
        },
        staffPerformance: [
          { name: 'Dr. Sarah Johnson', vaccinations: 156, patients: 98 },
          { name: 'Nurse Maria Rodriguez', vaccinations: 134, patients: 87 },
          { name: 'Dr. Michael Chen', vaccinations: 133, patients: 76 }
        ]
      };
    }
  }
};

export default healthFacilityApi;