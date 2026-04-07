export type CampaignStatus = 'Draft' | 'Queued' | 'Sent' | 'Error';
export type CampaignType = 'WhatsApp' | 'SMS';

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  sender: string;
  category: string;
  message: string;
  status: CampaignStatus;
  targetCount: number;
  successCount: number;
  failCount: number;
  createdAt: string;
  scheduledAt?: string;
}
