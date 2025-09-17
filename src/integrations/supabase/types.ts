export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      file_retrievals: {
        Row: {
          completed_at: string | null
          deal_id: string
          id: string
          retrieval_cost: number | null
          started_at: string | null
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          deal_id: string
          id?: string
          retrieval_cost?: number | null
          started_at?: string | null
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          deal_id?: string
          id?: string
          retrieval_cost?: number | null
          started_at?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_retrievals_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "storage_deals"
            referencedColumns: ["id"]
          },
        ]
      }
      network_stats: {
        Row: {
          active_deals: number
          avg_response_time_ms: number
          id: string
          network_health_score: number
          recorded_at: string | null
          total_nodes: number
          total_storage_used_gb: number
        }
        Insert: {
          active_deals?: number
          avg_response_time_ms?: number
          id?: string
          network_health_score?: number
          recorded_at?: string | null
          total_nodes?: number
          total_storage_used_gb?: number
        }
        Update: {
          active_deals?: number
          avg_response_time_ms?: number
          id?: string
          network_health_score?: number
          recorded_at?: string | null
          total_nodes?: number
          total_storage_used_gb?: number
        }
        Relationships: []
      }
      storage_deals: {
        Row: {
          created_at: string | null
          deal_duration: number
          expires_at: string
          file_cid: string
          file_name: string
          file_size: number
          file_type: string | null
          id: string
          last_verified: string | null
          price_per_gb: number
          status: string
          storage_provider_id: string | null
          total_cost: number
          user_id: string
        }
        Insert: {
          created_at?: string | null
          deal_duration?: number
          expires_at: string
          file_cid: string
          file_name: string
          file_size: number
          file_type?: string | null
          id?: string
          last_verified?: string | null
          price_per_gb?: number
          status?: string
          storage_provider_id?: string | null
          total_cost: number
          user_id: string
        }
        Update: {
          created_at?: string | null
          deal_duration?: number
          expires_at?: string
          file_cid?: string
          file_name?: string
          file_size?: number
          file_type?: string | null
          id?: string
          last_verified?: string | null
          price_per_gb?: number
          status?: string
          storage_provider_id?: string | null
          total_cost?: number
          user_id?: string
        }
        Relationships: []
      }
      storage_providers: {
        Row: {
          available_storage_gb: number
          created_at: string | null
          id: string
          last_online: string | null
          location: string
          name: string
          price_per_gb: number
          reputation_score: number | null
          total_storage_gb: number
          uptime_percentage: number | null
        }
        Insert: {
          available_storage_gb: number
          created_at?: string | null
          id?: string
          last_online?: string | null
          location: string
          name: string
          price_per_gb: number
          reputation_score?: number | null
          total_storage_gb: number
          uptime_percentage?: number | null
        }
        Update: {
          available_storage_gb?: number
          created_at?: string | null
          id?: string
          last_online?: string | null
          location?: string
          name?: string
          price_per_gb?: number
          reputation_score?: number | null
          total_storage_gb?: number
          uptime_percentage?: number | null
        }
        Relationships: []
      }
      user_wallets: {
        Row: {
          created_at: string | null
          dsc_balance: number
          id: string
          total_earned: number
          total_spent: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dsc_balance?: number
          id?: string
          total_earned?: number
          total_spent?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          dsc_balance?: number
          id?: string
          total_earned?: number
          total_spent?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      process_pending_deals: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      refresh_deal_statuses: {
        Args: Record<PropertyKey, never>
        Returns: {
          deals_activated: number
          deals_expired: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
