import apiService from '../utils/api';

// Base URL for USSD-related APIs
const USSD_API_BASE_URL = 'https://ussd.example.api/v1';

// USSD API service for rural healthcare access
const ussdApi = {
  // Process USSD requests
  process: {
    // Process a USSD request
    handleRequest: async (sessionId: string, serviceCode: string, phoneNumber: string, text: string) => {
      return apiService.post(`${USSD_API_BASE_URL}/process`, {
        sessionId,
        serviceCode,
        phoneNumber,
        text
      });
    },
    
    // End a USSD session
    endSession: async (sessionId: string) => {
      return apiService.post(`${USSD_API_BASE_URL}/end-session`, {
        sessionId
      });
    }
  },
  
  // Vaccination-related USSD services
  vaccinations: {
    // Check vaccination status via USSD
    checkStatus: async (phoneNumber: string, childId?: string) => {
      const params: any = { phoneNumber };
      if (childId) params.childId = childId;
      
      return apiService.get(`${USSD_API_BASE_URL}/vaccinations/status`, params);
    },
    
    // Register a child via USSD
    registerChild: async (phoneNumber: string, childName: string, birthDate: string, gender: string) => {
      return apiService.post(`${USSD_API_BASE_URL}/vaccinations/register-child`, {
        phoneNumber,
        childName,
        birthDate,
        gender
      });
    },
    
    // Set vaccination reminder via USSD
    setReminder: async (phoneNumber: string, childId: string, vaccineName: string, reminderDate: string) => {
      return apiService.post(`${USSD_API_BASE_URL}/vaccinations/set-reminder`, {
        phoneNumber,
        childId,
        vaccineName,
        reminderDate
      });
    }
  },
  
  // Health center-related USSD services
  healthCenters: {
    // Find nearby health centers via USSD
    findNearby: async (phoneNumber: string, location?: string) => {
      const params: any = { phoneNumber };
      if (location) params.location = location;
      
      return apiService.get(`${USSD_API_BASE_URL}/health-centers/nearby`, params);
    },
    
    // Get health center details via USSD
    getDetails: async (phoneNumber: string, centerId: string) => {
      return apiService.get(`${USSD_API_BASE_URL}/health-centers/${centerId}`, {
        phoneNumber
      });
    }
  },
  
  // Appointment-related USSD services
  appointments: {
    // Book appointment via USSD
    bookAppointment: async (phoneNumber: string, childId: string, centerId: string, date: string, reason: string) => {
      return apiService.post(`${USSD_API_BASE_URL}/appointments/book`, {
        phoneNumber,
        childId,
        centerId,
        date,
        reason
      });
    },
    
    // Check appointment status via USSD
    checkStatus: async (phoneNumber: string, appointmentId?: string) => {
      const params: any = { phoneNumber };
      if (appointmentId) params.appointmentId = appointmentId;
      
      return apiService.get(`${USSD_API_BASE_URL}/appointments/status`, params);
    },
    
    // Cancel appointment via USSD
    cancelAppointment: async (phoneNumber: string, appointmentId: string) => {
      return apiService.post(`${USSD_API_BASE_URL}/appointments/cancel`, {
        phoneNumber,
        appointmentId
      });
    }
  },
  
  // Health education via USSD
  education: {
    // Get health tips via USSD
    getHealthTips: async (phoneNumber: string, category?: string) => {
      const params: any = { phoneNumber };
      if (category) params.category = category;
      
      return apiService.get(`${USSD_API_BASE_URL}/education/health-tips`, params);
    },
    
    // Get vaccine information via USSD
    getVaccineInfo: async (phoneNumber: string, vaccineName: string) => {
      return apiService.get(`${USSD_API_BASE_URL}/education/vaccine-info`, {
        phoneNumber,
        vaccineName
      });
    }
  },
  
  // User management via USSD
  users: {
    // Register user via USSD
    registerUser: async (phoneNumber: string, name: string, location: string) => {
      return apiService.post(`${USSD_API_BASE_URL}/users/register`, {
        phoneNumber,
        name,
        location
      });
    },
    
    // Update user profile via USSD
    updateProfile: async (phoneNumber: string, field: string, value: string) => {
      return apiService.post(`${USSD_API_BASE_URL}/users/update-profile`, {
        phoneNumber,
        field,
        value
      });
    },
    
    // Get user profile via USSD
    getProfile: async (phoneNumber: string) => {
      return apiService.get(`${USSD_API_BASE_URL}/users/profile`, {
        phoneNumber
      });
    }
  },
  
  // Health worker communication via USSD
  communication: {
    // Request callback from health worker via USSD
    requestCallback: async (phoneNumber: string, reason: string, preferredTime?: string) => {
      const data: any = {
        phoneNumber,
        reason
      };
      
      if (preferredTime) data.preferredTime = preferredTime;
      
      return apiService.post(`${USSD_API_BASE_URL}/communication/request-callback`, data);
    },
    
    // Send message to health worker via USSD
    sendMessage: async (phoneNumber: string, message: string) => {
      return apiService.post(`${USSD_API_BASE_URL}/communication/send-message`, {
        phoneNumber,
        message
      });
    },
    
    // Get messages from health worker via USSD
    getMessages: async (phoneNumber: string) => {
      return apiService.get(`${USSD_API_BASE_URL}/communication/messages`, {
        phoneNumber
      });
    }
  },
  
  // Mock data for development (when API is not available)
  mock: {
    // Process a mock USSD request
    processRequest: (text: string) => {
      // Initial menu
      if (!text) {
        return {
          response: "CON Welcome to MedFiNet\n1. Check vaccination status\n2. Find nearest health center\n3. Set vaccination reminder\n4. Speak to health worker",
          action: "prompt"
        };
      }
      
      // Menu level 1
      if (text === "1") {
        return {
          response: "CON Enter child's ID number:",
          action: "prompt"
        };
      } else if (text === "2") {
        return {
          response: "CON Select your location:\n1. Current location\n2. Enter location manually",
          action: "prompt"
        };
      } else if (text === "3") {
        return {
          response: "CON Select child:\n1. Jacob Williams\n2. Emma Davis",
          action: "prompt"
        };
      } else if (text === "4") {
        return {
          response: "CON Select reason:\n1. Vaccination question\n2. Appointment booking\n3. Health advice\n4. Other",
          action: "prompt"
        };
      }
      
      // Menu level 2 - Vaccination status
      if (text.startsWith("1*")) {
        const childId = text.split("*")[1];
        return {
          response: "END Child: Jacob Williams\nAge: 4 years\nVaccinations:\n- DTaP: Complete (4/4)\n- MMR: Complete (2/2)\n- Polio: Due on 15/08/2024",
          action: "end"
        };
      }
      
      // Menu level 2 - Health centers
      if (text === "2*1") {
        return {
          response: "END Nearest health centers:\n1. City Pediatrics (0.5 mi)\n2. Metro Medical Center (1.2 mi)\n3. Downtown Pediatric Clinic (1.8 mi)\n\nDial *123*1# for details",
          action: "end"
        };
      }
      
      // Menu level 2 - Set reminder
      if (text === "3*1") {
        return {
          response: "CON Select vaccine for Jacob Williams:\n1. Polio (due 15/08/2024)\n2. Influenza (annual)",
          action: "prompt"
        };
      }
      
      // Menu level 2 - Speak to health worker
      if (text === "4*1") {
        return {
          response: "END A health worker will call you within 24 hours to discuss vaccination questions. Your reference number is: HW-12345",
          action: "end"
        };
      }
      
      // Default response for unhandled inputs
      return {
        response: "END Invalid selection. Please dial *123# to start again.",
        action: "end"
      };
    }
  }
};

export default ussdApi;