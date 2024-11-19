export interface Database {
  public: {
    Tables: {
      companies: {
        Row: {
          id: string;
          name: string;
          subdomain: string;
          plan: string;
          status: string;
          max_users: number;
          max_storage: number;
          storage_used: number;
          settings: Record<string, any> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          subdomain: string;
          plan?: string;
          status?: string;
          max_users?: number;
          max_storage?: number;
          storage_used?: number;
          settings?: Record<string, any> | null;
        };
        Update: {
          name?: string;
          subdomain?: string;
          plan?: string;
          status?: string;
          max_users?: number;
          max_storage?: number;
          storage_used?: number;
          settings?: Record<string, any> | null;
        };
      };
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: string;
          company_id: string;
          active: boolean;
          last_login: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role?: string;
          company_id: string;
          active?: boolean;
        };
        Update: {
          email?: string;
          name?: string;
          role?: string;
          company_id?: string;
          active?: boolean;
          last_login?: string | null;
        };
      };
      customers: {
        Row: {
          id: string;
          company_id: string;
          name: string;
          email: string;
          phone: string;
          address: string | null;
          preferred_contact: string;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          company_id: string;
          name: string;
          email: string;
          phone: string;
          address?: string | null;
          preferred_contact?: string;
          notes?: string | null;
        };
        Update: {
          company_id?: string;
          name?: string;
          email?: string;
          phone?: string;
          address?: string | null;
          preferred_contact?: string;
          notes?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      check_company_access: {
        Args: { company_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      user_role: 'ADMIN' | 'TECHNICIAN' | 'USER';
      work_order_status: 'SCHEDULED' | 'IN_PROGRESS' | 'AWAITING_PARTS' | 'COMPLETED';
      work_order_priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      contact_method: 'PHONE' | 'EMAIL' | 'SMS';
    };
  };
}