const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://medfinet-backend.onrender.com/api';

export interface Campaign {
  id: string;
  creator: string
  creator_id: string;
  title: string;
  description: string;
  category: string;
  target_amount: number;
  raised_amount: number;
  currency: string;
  // donor_count: number;
  image_url: string;
  location: string;
  status: 'draft' | 'active' | 'funded' | 'closed';
  approved: boolean;
  escrow_address?: string;
  blockchain_tx_id?: string;
  start_date?: string;
  end_date?: string;
  created_at: string;
  updated_at: string;
}

export interface HealthPackage {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  icon: string;
  features: string[];
  active: boolean;
  created_at: string;
}

export interface Donation {
  id: string;
  campaign_id: string;
  donor_id?: string;
  donor_email: string;
  donor_name: string;
  amount: number;
  currency: string;
  method: 'simulated' | 'onchain' | 'stripe';
  tx_id?: string;
  tx_verified: boolean;
  status: 'pending' | 'completed' | 'failed';
  message?: string;
  created_at: string;
}

export const crowdfundingApi = {
  async getCampaigns(params?: { status?: string; limit?: number; offset?: number }) {
    try {
      // Build query parameters
      const queryParams = new URLSearchParams();
      
      if (params?.status) {
        queryParams.append('status', params.status);
      }
      
      if (params?.limit) {
        queryParams.append('limit', params.limit.toString());
      }
      
      if (params?.offset) {
        queryParams.append('offset', params.offset.toString());
      }

      const response = await fetch(`${API_BASE_URL}/campaigns`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      // Map the API response to match your Campaign interface
      const campaigns: Campaign[] = result.data.map((campaign: any) => ({
        id: campaign.id,
        creator: campaign.creator.name,
        creator_id: campaign.creator_id,
        title: campaign.title,
        description: campaign.description,
        category: campaign.category,
        target_amount: campaign.targetAmount,
        raised_amount: campaign.raisedAmount,
        currency: campaign.currency,
        // donor_count: campaign.donations.length,
        image_url: campaign.imageUrl || campaign.image_url,
        location: campaign.location,
        status: campaign.status,
        approved: campaign.approved,
        escrow_address: campaign.escrowAddress || campaign.escrow_address,
        blockchain_tx_id: campaign.blockchainTxId || campaign.blockchain_tx_id,
        start_date: campaign.startDate || campaign.start_date,
        end_date: campaign.endDate || campaign.end_date,
        created_at: campaign.createdAt || campaign.created_at,
        updated_at: campaign.updatedAt || campaign.updated_at,
      }));

      return { success: true, data: campaigns };
    } catch (error: any) {
      console.error('Error fetching campaigns:', error);
      return { success: false, error: error.message, data: [] };
    }
  },

  async getCampaign(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns/${id}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      const campaignData = result.data;

      // Map the API response to match your Campaign interface
      const campaign: Campaign = {
        id: campaignData.id,
        creator: campaignData.creator.name,
        creator_id: campaignData.creator_id,
        title: campaignData.title,
        description: campaignData.description,
        category: campaignData.category,
        target_amount: campaignData.targetAmount,
        raised_amount: campaignData.raisedAmount,
        currency: campaignData.currency,
        // donor_count: campaignData.donations.length,
        image_url: campaignData.imageUrl || campaignData.image_url,
        location: campaignData.location,
        status: campaignData.status,
        approved: campaignData.approved,
        escrow_address: campaignData.escrowAddress || campaignData.escrow_address,
        blockchain_tx_id: campaignData.blockchainTxId || campaignData.blockchain_tx_id,
        start_date: campaignData.startDate || campaignData.start_date,
        end_date: campaignData.endDate || campaignData.end_date,
        created_at: campaignData.createdAt || campaignData.created_at,
        updated_at: campaignData.updatedAt || campaignData.updated_at,
      };

      return { success: true, data: campaign };
    } catch (error: any) {
      console.error('Error fetching campaign:', error);
      return { success: false, error: error.message, data: null };
    }
  },

  async fundCampaign(
    campaignId: string,
    donationData: {
      amount: number;
      currency?: string;
      method?: string;
      tx_id?: string;
      donor_id?: string;
      donor_email?: string;
      donor_name?: string;
      message?: string;
    }
  ) {
    try {
      const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/fund`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(donationData),
      });

      const result = await response.json();
      return result;
    } catch (error: any) {
      console.error('Error funding campaign:', error);
      return { success: false, error: error.message };
    }
  },

  async getHealthPackages(params?: { category?: string; active?: boolean }) {
    try {
      // For health packages, you might still want to use Supabase or switch to API
      // Keeping the Supabase version for now since you didn't specify API endpoints for packages
      let query = supabase
        .from('health_packages')
        .select('*')
        .order('price', { ascending: true });

      if (params?.active !== undefined) {
        query = query.eq('active', params.active);
      }

      if (params?.category) {
        query = query.eq('category', params.category);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { success: true, data: data as HealthPackage[] };
    } catch (error: any) {
      console.error('Error fetching packages:', error);
      return { success: false, error: error.message, data: [] };
    }
  },
};

export default crowdfundingApi;