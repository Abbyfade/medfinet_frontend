import axios from 'axios';
import apiService from '../utils/api';

// Base URL for FHIR API
const FHIR_API_BASE_URL = 'https://fhir.example.api/v1';

// FHIR API service for healthcare data exchange
const fhirApi = {
  // Patient resources
  patients: {
    getPatient: async (patientId: string) => {
      return apiService.get(`${FHIR_API_BASE_URL}/Patient/${patientId}`);
    },
    
    searchPatients: async (params: any) => {
      return apiService.get(`${FHIR_API_BASE_URL}/Patient`, params);
    },
    
    createPatient: async (patientData: any) => {
      return apiService.post(`${FHIR_API_BASE_URL}/Patient`, patientData);
    },
    
    updatePatient: async (patientId: string, patientData: any) => {
      return apiService.put(`${FHIR_API_BASE_URL}/Patient/${patientId}`, patientData);
    },
  },
  
  // Immunization resources
  immunizations: {
    getImmunization: async (immunizationId: string) => {
      return apiService.get(`${FHIR_API_BASE_URL}/Immunization/${immunizationId}`);
    },
    
    getPatientImmunizations: async (patientId: string) => {
      return apiService.get(`${FHIR_API_BASE_URL}/Immunization`, {
        patient: patientId,
      });
    },
    
    createImmunization: async (immunizationData: any) => {
      return apiService.post(`${FHIR_API_BASE_URL}/Immunization`, immunizationData);
    },
    
    searchImmunizations: async (params: any) => {
      return apiService.get(`${FHIR_API_BASE_URL}/Immunization`, params);
    },
  },
  
  // Observation resources (for health measurements)
  observations: {
    getObservation: async (observationId: string) => {
      return apiService.get(`${FHIR_API_BASE_URL}/Observation/${observationId}`);
    },
    
    getPatientObservations: async (patientId: string, category?: string) => {
      const params: any = { patient: patientId };
      if (category) params.category = category;
      
      return apiService.get(`${FHIR_API_BASE_URL}/Observation`, params);
    },
    
    createObservation: async (observationData: any) => {
      return apiService.post(`${FHIR_API_BASE_URL}/Observation`, observationData);
    },
  },
  
  // Practitioner resources (healthcare providers)
  practitioners: {
    getPractitioner: async (practitionerId: string) => {
      return apiService.get(`${FHIR_API_BASE_URL}/Practitioner/${practitionerId}`);
    },
    
    searchPractitioners: async (params: any) => {
      return apiService.get(`${FHIR_API_BASE_URL}/Practitioner`, params);
    },
  },
  
  // Organization resources (healthcare facilities)
  organizations: {
    getOrganization: async (organizationId: string) => {
      return apiService.get(`${FHIR_API_BASE_URL}/Organization/${organizationId}`);
    },
    
    searchOrganizations: async (params: any) => {
      return apiService.get(`${FHIR_API_BASE_URL}/Organization`, params);
    },
  },
  
  // Appointment resources
  appointments: {
    getAppointment: async (appointmentId: string) => {
      return apiService.get(`${FHIR_API_BASE_URL}/Appointment/${appointmentId}`);
    },
    
    getPatientAppointments: async (patientId: string, status?: string) => {
      const params: any = { patient: patientId };
      if (status) params.status = status;
      
      return apiService.get(`${FHIR_API_BASE_URL}/Appointment`, params);
    },
    
    createAppointment: async (appointmentData: any) => {
      return apiService.post(`${FHIR_API_BASE_URL}/Appointment`, appointmentData);
    },
    
    updateAppointmentStatus: async (appointmentId: string, status: string) => {
      const appointment = await apiService.get(`${FHIR_API_BASE_URL}/Appointment/${appointmentId}`);
      appointment.status = status;
      
      return apiService.put(`${FHIR_API_BASE_URL}/Appointment/${appointmentId}`, appointment);
    },
  },
  
  // Medication resources
  medications: {
    getMedication: async (medicationId: string) => {
      return apiService.get(`${FHIR_API_BASE_URL}/Medication/${medicationId}`);
    },
    
    searchMedications: async (params: any) => {
      return apiService.get(`${FHIR_API_BASE_URL}/Medication`, params);
    },
  },
  
  // MedicationRequest resources (prescriptions)
  medicationRequests: {
    getMedicationRequest: async (medicationRequestId: string) => {
      return apiService.get(`${FHIR_API_BASE_URL}/MedicationRequest/${medicationRequestId}`);
    },
    
    getPatientMedicationRequests: async (patientId: string, status?: string) => {
      const params: any = { patient: patientId };
      if (status) params.status = status;
      
      return apiService.get(`${FHIR_API_BASE_URL}/MedicationRequest`, params);
    },
    
    createMedicationRequest: async (medicationRequestData: any) => {
      return apiService.post(`${FHIR_API_BASE_URL}/MedicationRequest`, medicationRequestData);
    },
  },
  
  // AllergyIntolerance resources
  allergies: {
    getPatientAllergies: async (patientId: string) => {
      return apiService.get(`${FHIR_API_BASE_URL}/AllergyIntolerance`, {
        patient: patientId,
      });
    },
    
    createAllergy: async (allergyData: any) => {
      return apiService.post(`${FHIR_API_BASE_URL}/AllergyIntolerance`, allergyData);
    },
  },
  
  // Condition resources (medical conditions)
  conditions: {
    getPatientConditions: async (patientId: string) => {
      return apiService.get(`${FHIR_API_BASE_URL}/Condition`, {
        patient: patientId,
      });
    },
    
    createCondition: async (conditionData: any) => {
      return apiService.post(`${FHIR_API_BASE_URL}/Condition`, conditionData);
    },
  },
  
  // Helper functions for FHIR resource creation
  helpers: {
    createPatientResource: (data: any) => {
      // Create a FHIR-compliant Patient resource
      return {
        resourceType: 'Patient',
        name: [
          {
            use: 'official',
            family: data.lastName,
            given: [data.firstName, ...(data.middleName ? [data.middleName] : [])],
          },
        ],
        gender: data.gender,
        birthDate: data.birthDate,
        address: data.address ? [
          {
            use: 'home',
            line: [data.address.line1, ...(data.address.line2 ? [data.address.line2] : [])],
            city: data.address.city,
            state: data.address.state,
            postalCode: data.address.postalCode,
            country: data.address.country,
          },
        ] : undefined,
        telecom: [
          ...(data.phone ? [{ system: 'phone', value: data.phone, use: 'home' }] : []),
          ...(data.email ? [{ system: 'email', value: data.email }] : []),
        ],
      };
    },
    
    createImmunizationResource: (data: any) => {
      // Create a FHIR-compliant Immunization resource
      return {
        resourceType: 'Immunization',
        status: 'completed',
        vaccineCode: {
          coding: [
            {
              system: 'http://hl7.org/fhir/sid/cvx',
              code: data.vaccineCode,
              display: data.vaccineName,
            },
          ],
          text: data.vaccineName,
        },
        patient: {
          reference: `Patient/${data.patientId}`,
        },
        occurrenceDateTime: data.dateAdministered,
        primarySource: true,
        lotNumber: data.lotNumber,
        performer: [
          {
            actor: {
              reference: `Practitioner/${data.practitionerId}`,
              display: data.practitionerName,
            },
          },
        ],
        note: data.notes ? [{ text: data.notes }] : undefined,
      };
    },
  },
};

export default fhirApi;