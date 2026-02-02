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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      memory_items: {
        Row: {
          category: Database["public"]["Enums"]["memory_category"]
          content: string
          created_at: string
          id: string
          priority: number
          status: Database["public"]["Enums"]["memory_status"]
          superseded_by: string | null
          tenant_id: string
          updated_at: string
          user_id: string
          version: number
        }
        Insert: {
          category?: Database["public"]["Enums"]["memory_category"]
          content: string
          created_at?: string
          id?: string
          priority?: number
          status?: Database["public"]["Enums"]["memory_status"]
          superseded_by?: string | null
          tenant_id?: string
          updated_at?: string
          user_id: string
          version?: number
        }
        Update: {
          category?: Database["public"]["Enums"]["memory_category"]
          content?: string
          created_at?: string
          id?: string
          priority?: number
          status?: Database["public"]["Enums"]["memory_status"]
          superseded_by?: string | null
          tenant_id?: string
          updated_at?: string
          user_id?: string
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "memory_items_superseded_by_fkey"
            columns: ["superseded_by"]
            isOneToOne: false
            referencedRelation: "memory_items"
            referencedColumns: ["id"]
          },
        ]
      }
      objects: {
        Row: {
          context: string | null
          created_at: string
          description: string | null
          horizon: Database["public"]["Enums"]["time_horizon"]
          id: string
          name: string
          objective: string | null
          status: Database["public"]["Enums"]["object_status"]
          tenant_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          context?: string | null
          created_at?: string
          description?: string | null
          horizon?: Database["public"]["Enums"]["time_horizon"]
          id?: string
          name: string
          objective?: string | null
          status?: Database["public"]["Enums"]["object_status"]
          tenant_id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          context?: string | null
          created_at?: string
          description?: string | null
          horizon?: Database["public"]["Enums"]["time_horizon"]
          id?: string
          name?: string
          objective?: string | null
          status?: Database["public"]["Enums"]["object_status"]
          tenant_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      plan_actions: {
        Row: {
          action_text: string
          completed_at: string | null
          created_at: string
          id: string
          priority: Database["public"]["Enums"]["action_priority"]
          session_id: string
          status: Database["public"]["Enums"]["action_status"]
          tenant_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          action_text: string
          completed_at?: string | null
          created_at?: string
          id?: string
          priority?: Database["public"]["Enums"]["action_priority"]
          session_id: string
          status?: Database["public"]["Enums"]["action_status"]
          tenant_id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          action_text?: string
          completed_at?: string | null
          created_at?: string
          id?: string
          priority?: Database["public"]["Enums"]["action_priority"]
          session_id?: string
          status?: Database["public"]["Enums"]["action_status"]
          tenant_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plan_actions_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          akira_estrategia: string | null
          archon_sintese: string | null
          chen_dados: string | null
          created_at: string
          error_message: string | null
          horizon: Database["public"]["Enums"]["time_horizon"]
          id: string
          maya_conteudo: string | null
          model_used: string | null
          object_id: string
          processing_time_ms: number | null
          question: string
          status: Database["public"]["Enums"]["session_status"]
          tenant_id: string
          updated_at: string
          user_id: string
          yuki_psicologia: string | null
        }
        Insert: {
          akira_estrategia?: string | null
          archon_sintese?: string | null
          chen_dados?: string | null
          created_at?: string
          error_message?: string | null
          horizon: Database["public"]["Enums"]["time_horizon"]
          id?: string
          maya_conteudo?: string | null
          model_used?: string | null
          object_id: string
          processing_time_ms?: number | null
          question: string
          status?: Database["public"]["Enums"]["session_status"]
          tenant_id?: string
          updated_at?: string
          user_id: string
          yuki_psicologia?: string | null
        }
        Update: {
          akira_estrategia?: string | null
          archon_sintese?: string | null
          chen_dados?: string | null
          created_at?: string
          error_message?: string | null
          horizon?: Database["public"]["Enums"]["time_horizon"]
          id?: string
          maya_conteudo?: string | null
          model_used?: string | null
          object_id?: string
          processing_time_ms?: number | null
          question?: string
          status?: Database["public"]["Enums"]["session_status"]
          tenant_id?: string
          updated_at?: string
          user_id?: string
          yuki_psicologia?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_object_id_fkey"
            columns: ["object_id"]
            isOneToOne: false
            referencedRelation: "objects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      action_priority: "alta" | "media" | "baixa"
      action_status: "pending" | "in_progress" | "done" | "skipped"
      memory_category:
        | "identity"
        | "rules"
        | "learnings"
        | "preferences"
        | "context"
      memory_status: "active" | "superseded" | "deleted"
      object_status: "draft" | "active" | "archived"
      session_status: "created" | "processing" | "completed" | "failed"
      time_horizon: "curto" | "medio" | "longo"
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
      action_priority: ["alta", "media", "baixa"],
      action_status: ["pending", "in_progress", "done", "skipped"],
      memory_category: [
        "identity",
        "rules",
        "learnings",
        "preferences",
        "context",
      ],
      memory_status: ["active", "superseded", "deleted"],
      object_status: ["draft", "active", "archived"],
      session_status: ["created", "processing", "completed", "failed"],
      time_horizon: ["curto", "medio", "longo"],
    },
  },
} as const
