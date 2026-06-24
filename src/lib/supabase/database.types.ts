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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          is_admin: boolean
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          is_admin?: boolean
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          is_admin?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      project_tool_data: {
        Row: {
          ai_analysis: Json | null
          created_at: string
          data: Json
          id: string
          project_id: string
          status: Database["public"]["Enums"]["tool_status"]
          tool_id: string
          updated_at: string
        }
        Insert: {
          ai_analysis?: Json | null
          created_at?: string
          data?: Json
          id?: string
          project_id: string
          status?: Database["public"]["Enums"]["tool_status"]
          tool_id: string
          updated_at?: string
        }
        Update: {
          ai_analysis?: Json | null
          created_at?: string
          data?: Json
          id?: string
          project_id?: string
          status?: Database["public"]["Enums"]["tool_status"]
          tool_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_tool_data_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          context_summary: string | null
          created_at: string
          enabled_modules: Json
          id: string
          municipio: string | null
          name: string
          owner_id: string
          tipo: string | null
          updated_at: string
        }
        Insert: {
          context_summary?: string | null
          created_at?: string
          enabled_modules?: Json
          id?: string
          municipio?: string | null
          name: string
          owner_id: string
          tipo?: string | null
          updated_at?: string
        }
        Update: {
          context_summary?: string | null
          created_at?: string
          enabled_modules?: Json
          id?: string
          municipio?: string | null
          name?: string
          owner_id?: string
          tipo?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      constructiva_leads: {
        Row: {
          category: string | null
          created_at: string
          email: string
          handled: boolean
          id: string
          message: string | null
          name: string
          phone: string | null
          service: Database["public"]["Enums"]["constructiva_service"]
          source: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          email: string
          handled?: boolean
          id?: string
          message?: string | null
          name: string
          phone?: string | null
          service?: Database["public"]["Enums"]["constructiva_service"]
          source?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          email?: string
          handled?: boolean
          id?: string
          message?: string | null
          name?: string
          phone?: string | null
          service?: Database["public"]["Enums"]["constructiva_service"]
          source?: string
        }
        Relationships: []
      }
      tool_avales: {
        Row: {
          area: string | null
          author_id: string
          cedula: string
          created_at: string
          declaracion: string
          id: string
          institucion: string | null
          nombre: string
          profesion: string
          proposal_id: string
          verificado: boolean
        }
        Insert: {
          area?: string | null
          author_id: string
          cedula: string
          created_at?: string
          declaracion: string
          id?: string
          institucion?: string | null
          nombre: string
          profesion: string
          proposal_id: string
          verificado?: boolean
        }
        Update: {
          area?: string | null
          author_id?: string
          cedula?: string
          created_at?: string
          declaracion?: string
          id?: string
          institucion?: string | null
          nombre?: string
          profesion?: string
          proposal_id?: string
          verificado?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "tool_avales_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "tool_proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      tool_comments: {
        Row: {
          author_area: string | null
          author_id: string
          author_name: string
          body: string
          created_at: string
          id: string
          proposal_id: string
        }
        Insert: {
          author_area?: string | null
          author_id: string
          author_name: string
          body: string
          created_at?: string
          id?: string
          proposal_id: string
        }
        Update: {
          author_area?: string | null
          author_id?: string
          author_name?: string
          body?: string
          created_at?: string
          id?: string
          proposal_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tool_comments_proposal_id_fkey"
            columns: ["proposal_id"]
            isOneToOne: false
            referencedRelation: "tool_proposals"
            referencedColumns: ["id"]
          },
        ]
      }
      tool_proposals: {
        Row: {
          ai_suggestion: Json | null
          author_id: string
          avales_count: number
          caso_prueba: Json | null
          created_at: string
          description: string
          expert_field: string | null
          expert_name: string | null
          expert_validated: boolean
          feeds_tools: string[]
          formulas: string | null
          id: string
          justification: string | null
          name: string
          referencias: Json
          normatividad: Json
          review_notes: string | null
          section: Database["public"]["Enums"]["tool_section"]
          status: Database["public"]["Enums"]["tool_proposal_status"]
          updated_at: string
        }
        Insert: {
          ai_suggestion?: Json | null
          author_id: string
          avales_count?: number
          caso_prueba?: Json | null
          created_at?: string
          description: string
          expert_field?: string | null
          expert_name?: string | null
          expert_validated?: boolean
          feeds_tools?: string[]
          formulas?: string | null
          id?: string
          justification?: string | null
          name: string
          normatividad?: Json
          referencias?: Json
          review_notes?: string | null
          section?: Database["public"]["Enums"]["tool_section"]
          status?: Database["public"]["Enums"]["tool_proposal_status"]
          updated_at?: string
        }
        Update: {
          ai_suggestion?: Json | null
          author_id?: string
          avales_count?: number
          caso_prueba?: Json | null
          created_at?: string
          description?: string
          expert_field?: string | null
          expert_name?: string | null
          expert_validated?: boolean
          feeds_tools?: string[]
          formulas?: string | null
          id?: string
          justification?: string | null
          name?: string
          normatividad?: Json
          referencias?: Json
          review_notes?: string | null
          section?: Database["public"]["Enums"]["tool_section"]
          status?: Database["public"]["Enums"]["tool_proposal_status"]
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      tool_status: "empty" | "in_progress" | "done"
      constructiva_service: "construccion" | "mantenimiento"
      tool_section:
        | "arquitectura"
        | "construccion"
        | "normatividad"
        | "mantenimiento"
        | "otro"
      tool_proposal_status:
        | "proposed"
        | "in_review"
        | "approved"
        | "published"
        | "rejected"
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
    Enums: {
      tool_status: ["empty", "in_progress", "done"],
      constructiva_service: ["construccion", "mantenimiento"],
      tool_section: [
        "arquitectura",
        "construccion",
        "normatividad",
        "mantenimiento",
        "otro",
      ],
      tool_proposal_status: [
        "proposed",
        "in_review",
        "approved",
        "published",
        "rejected",
      ],
    },
  },
} as const
