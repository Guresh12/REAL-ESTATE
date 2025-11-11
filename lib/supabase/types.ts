export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          location: string
          area: string | null
          type: 'apartment' | 'house' | 'commercial' | 'land'
          status: 'available' | 'sold' | 'reserved'
          images: string[] | null
          virtual_tour_url: string | null
          bedrooms: number | null
          bathrooms: number | null
          sqft: number | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['properties']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['properties']['Insert']>
      }
      plots: {
        Row: {
          id: string
          plot_number: string
          area: string
          size: number
          price: number
          status: 'available' | 'sold' | 'reserved'
          location: string
          description: string | null
          images: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['plots']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['plots']['Insert']>
      }
      site_visits: {
        Row: {
          id: string
          plot_id: string | null
          property_id: string | null
          client_name: string
          client_email: string
          client_phone: string
          preferred_date: string
          preferred_time: string
          message: string | null
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['site_visits']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['site_visits']['Insert']>
      }
      profiles: {
        Row: {
          id: string
          email: string
          name: string | null
          phone: string | null
          role: 'admin' | 'user'
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      receipts: {
        Row: {
          id: string
          client_name: string
          client_email: string
          client_phone: string
          property_id: string | null
          plot_id: string | null
          amount: number
          payment_method: string
          transaction_id: string
          receipt_date: string
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['receipts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['receipts']['Insert']>
      }
      website_content: {
        Row: {
          id: string
          type: 'banner' | 'announcement' | 'company_info'
          title: string | null
          content: string | null
          image_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['website_content']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['website_content']['Insert']>
      }
    }
  }
}

export type Property = Database['public']['Tables']['properties']['Row']
export type Plot = Database['public']['Tables']['plots']['Row']
export type SiteVisit = Database['public']['Tables']['site_visits']['Row']
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Receipt = Database['public']['Tables']['receipts']['Row']
export type WebsiteContent = Database['public']['Tables']['website_content']['Row']

