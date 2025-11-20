const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface DonationPreparation {
  campaignId: string;
  amount: number;
  donorWallet: string;
}

export interface DonationConfirmation {
  donationId: string;
  signedTransaction: string;
}

export interface DonationResponse {
  success: boolean;
  data: {
    donationId: string;
    unsignedTransaction: string;
    transactionHash: string;
    campaign: {
      title: string;
      escrowAddress: string;
    };
  };
  message: string;
}

export interface ConfirmationResponse {
  success: boolean;
  data: {
    transactionHash: string;
  };
  message: string;
}

const donationApi = {
  prepareDonation: async (donationData: DonationPreparation): Promise<DonationResponse> => {
    const response = await fetch(`${API_BASE_URL}/donations/prepare`, {
      method: 'POST',
      headers: {
            'Content-Type': 'application/json',
        },
      body: JSON.stringify(donationData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  confirmDonation: async (confirmationData: DonationConfirmation): Promise<ConfirmationResponse> => {
    const response = await fetch(`${API_BASE_URL}/donations/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(confirmationData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },

  getCampaignDonations: async (campaignId: string) => {
    const response = await fetch(`${API_BASE_URL}/donations/campaign/${campaignId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
};

export default donationApi;