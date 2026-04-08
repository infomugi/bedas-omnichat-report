export type CampaignType = 'whatsapp' | 'sms' | 'lba';
export type CampaignStatus = 'draft' | 'pending' | 'sending' | 'completed' | 'failed' | 'paused';
export type NotificationType = 'campaign' | 'billing' | 'system';

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  whatsapp_status: 'CONNECTED' | 'DISCONNECTED' | 'CONNECTING';
  whatsapp_phone: string | null;
  balance: number;
  updated_at: string;
}

export interface ContactList {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
  _count?: {
    contacts: number;
  };
}

export interface Contact {
  id: string;
  list_id: string;
  name: string;
  phone: string;
  metadata: any;
  created_at: string;
}

export interface Campaign {
  id: string;
  user_id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  message: string;
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  cost: number;
  created_at: string;
  scheduled_at: string | null;
  completed_at: string | null;
  contact_list_id?: string;
  contact_list?: {
    name: string;
  };
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  body: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
  link?: string;
}

export interface SystemLog {
  id: string;
  user_id: string;
  level: 'info' | 'warn' | 'error' | 'success';
  msg: string;
  created_at: string;
}

export interface BillingTransaction {
  id: string;
  user_id: string;
  amount: number;
  type: 'in' | 'out';
  channel: 'WhatsApp' | 'SMS' | 'Topup';
  description: string;
  created_at: string;
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
}
