export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      automations: {
        Row: {
          active: boolean
          created_at: string
          description: string
          has_custom_prompt: boolean | null
          has_form_integration: boolean | null
          has_table_integration: boolean | null
          has_webhook: boolean | null
          id: string
          image_url: string | null
          installation_price: number
          monthly_price: number
          title: string
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description: string
          has_custom_prompt?: boolean | null
          has_form_integration?: boolean | null
          has_table_integration?: boolean | null
          has_webhook?: boolean | null
          id?: string
          image_url?: string | null
          installation_price?: number
          monthly_price?: number
          title: string
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string
          has_custom_prompt?: boolean | null
          has_form_integration?: boolean | null
          has_table_integration?: boolean | null
          has_webhook?: boolean | null
          id?: string
          image_url?: string | null
          installation_price?: number
          monthly_price?: number
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string
          category: string
          content: string
          created_at: string
          date: string
          excerpt: string
          featured: boolean
          id: string
          image: string
          read_time: string
          slug: string
          status: string
          tags: string[]
          title: string
          updated_at: string
        }
        Insert: {
          author: string
          category: string
          content: string
          created_at?: string
          date: string
          excerpt: string
          featured?: boolean
          id?: string
          image: string
          read_time: string
          slug: string
          status?: string
          tags?: string[]
          title: string
          updated_at?: string
        }
        Update: {
          author?: string
          category?: string
          content?: string
          created_at?: string
          date?: string
          excerpt?: string
          featured?: boolean
          id?: string
          image?: string
          read_time?: string
          slug?: string
          status?: string
          tags?: string[]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_translations: {
        Row: {
          blog_post_id: string
          content: string
          created_at: string
          excerpt: string
          id: string
          language: string
          title: string
          updated_at: string
        }
        Insert: {
          blog_post_id: string
          content: string
          created_at?: string
          excerpt: string
          id?: string
          language: string
          title: string
          updated_at?: string
        }
        Update: {
          blog_post_id?: string
          content?: string
          created_at?: string
          excerpt?: string
          id?: string
          language?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_translations_blog_post_id_fkey"
            columns: ["blog_post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      client_automations: {
        Row: {
          automation_id: string
          client_id: string
          id: string
          next_billing_date: string
          purchase_date: string
          setup_status: string
          status: string
        }
        Insert: {
          automation_id: string
          client_id: string
          id?: string
          next_billing_date: string
          purchase_date?: string
          setup_status?: string
          status: string
        }
        Update: {
          automation_id?: string
          client_id?: string
          id?: string
          next_billing_date?: string
          purchase_date?: string
          setup_status?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_automations_automation_id_fkey"
            columns: ["automation_id"]
            isOneToOne: false
            referencedRelation: "automations"
            referencedColumns: ["id"]
          },
        ]
      }
      client_integration_settings: {
        Row: {
          client_automation_id: string
          created_at: string
          id: string
          integration_code: string | null
          integration_type: string
          last_updated_by: string | null
          production_url: string | null
          prompt_text: string | null
          prompt_webhook_url: string | null
          status: string
          test_url: string | null
          updated_at: string
        }
        Insert: {
          client_automation_id: string
          created_at?: string
          id?: string
          integration_code?: string | null
          integration_type: string
          last_updated_by?: string | null
          production_url?: string | null
          prompt_text?: string | null
          prompt_webhook_url?: string | null
          status?: string
          test_url?: string | null
          updated_at?: string
        }
        Update: {
          client_automation_id?: string
          created_at?: string
          id?: string
          integration_code?: string | null
          integration_type?: string
          last_updated_by?: string | null
          production_url?: string | null
          prompt_text?: string | null
          prompt_webhook_url?: string | null
          status?: string
          test_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_integration_settings_client_automation_id_fkey"
            columns: ["client_automation_id"]
            isOneToOne: false
            referencedRelation: "client_automations"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          company_name: string
          contact_person: string | null
          created_at: string
          id: string
          phone: string | null
          type: Database["public"]["Enums"]["user_type"]
          updated_at: string
        }
        Insert: {
          company_name: string
          contact_person?: string | null
          created_at?: string
          id: string
          phone?: string | null
          type?: Database["public"]["Enums"]["user_type"]
          updated_at?: string
        }
        Update: {
          company_name?: string
          contact_person?: string | null
          created_at?: string
          id?: string
          phone?: string | null
          type?: Database["public"]["Enums"]["user_type"]
          updated_at?: string
        }
        Relationships: []
      }
      contact_info: {
        Row: {
          address: string
          created_at: string
          email: string
          id: string
          phone: string
          updated_at: string
          website: string
        }
        Insert: {
          address: string
          created_at?: string
          email: string
          id?: string
          phone: string
          updated_at?: string
          website: string
        }
        Update: {
          address?: string
          created_at?: string
          email?: string
          id?: string
          phone?: string
          updated_at?: string
          website?: string
        }
        Relationships: []
      }
      form_submissions: {
        Row: {
          client_automation_id: string
          created_at: string
          form_data: Json
          id: string
          processed_at: string | null
          status: string
          submission_ip: string | null
          user_agent: string | null
        }
        Insert: {
          client_automation_id: string
          created_at?: string
          form_data: Json
          id?: string
          processed_at?: string | null
          status?: string
          submission_ip?: string | null
          user_agent?: string | null
        }
        Update: {
          client_automation_id?: string
          created_at?: string
          form_data?: Json
          id?: string
          processed_at?: string | null
          status?: string
          submission_ip?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "form_submissions_client_automation_id_fkey"
            columns: ["client_automation_id"]
            isOneToOne: false
            referencedRelation: "client_automations"
            referencedColumns: ["id"]
          },
        ]
      }
      integrations: {
        Row: {
          automation_id: string
          created_at: string
          id: string
          integration_code: string | null
          integration_type: string
          production_url: string | null
          prompt_webhook_url: string | null
          test_url: string | null
          updated_at: string
        }
        Insert: {
          automation_id: string
          created_at?: string
          id?: string
          integration_code?: string | null
          integration_type: string
          production_url?: string | null
          prompt_webhook_url?: string | null
          test_url?: string | null
          updated_at?: string
        }
        Update: {
          automation_id?: string
          created_at?: string
          id?: string
          integration_code?: string | null
          integration_type?: string
          production_url?: string | null
          prompt_webhook_url?: string | null
          test_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "integrations_automation_id_fkey"
            columns: ["automation_id"]
            isOneToOne: false
            referencedRelation: "automations"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_content: {
        Row: {
          content: string
          created_at: string
          id: string
          position: number
          template_id: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          position?: number
          template_id: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          position?: number
          template_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_content_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "newsletter_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_history: {
        Row: {
          content: string
          frequency: string
          id: string
          recipient_count: number
          sent_at: string
          subject: string
          template_id: string
        }
        Insert: {
          content: string
          frequency: string
          id?: string
          recipient_count?: number
          sent_at?: string
          subject: string
          template_id: string
        }
        Update: {
          content?: string
          frequency?: string
          id?: string
          recipient_count?: number
          sent_at?: string
          subject?: string
          template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "newsletter_history_template_id_fkey"
            columns: ["template_id"]
            isOneToOne: false
            referencedRelation: "newsletter_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      newsletter_subscriptions: {
        Row: {
          created_at: string
          email: string
          frequency: string
          id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          frequency: string
          id?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          frequency?: string
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_templates: {
        Row: {
          created_at: string
          footer_text: string | null
          header_text: string | null
          id: string
          name: string
          subject: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          footer_text?: string | null
          header_text?: string | null
          id?: string
          name: string
          subject: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          footer_text?: string | null
          header_text?: string | null
          id?: string
          name?: string
          subject?: string
          updated_at?: string
        }
        Relationships: []
      }
      page_content: {
        Row: {
          content: string
          id: string
          language: string
          page: string
          section_name: string
          updated_at: string | null
        }
        Insert: {
          content: string
          id?: string
          language?: string
          page: string
          section_name: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          id?: string
          language?: string
          page?: string
          section_name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      page_images: {
        Row: {
          created_at: string
          id: string
          image_url: string
          page: string
          section_id: string
          section_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          image_url: string
          page: string
          section_id: string
          section_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string
          page?: string
          section_id?: string
          section_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          automation_id: string
          client_id: string
          created_at: string
          description: string
          id: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          automation_id: string
          client_id: string
          created_at?: string
          description: string
          id?: string
          status: string
          title: string
          updated_at?: string
        }
        Update: {
          automation_id?: string
          client_id?: string
          created_at?: string
          description?: string
          id?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_automation_id_fkey"
            columns: ["automation_id"]
            isOneToOne: false
            referencedRelation: "automations"
            referencedColumns: ["id"]
          },
        ]
      }
      table_data_entries: {
        Row: {
          client_automation_id: string
          created_at: string
          created_by: string | null
          data: Json
          entry_type: string
          id: string
          status: string
          updated_at: string
        }
        Insert: {
          client_automation_id: string
          created_at?: string
          created_by?: string | null
          data: Json
          entry_type?: string
          id?: string
          status?: string
          updated_at?: string
        }
        Update: {
          client_automation_id?: string
          created_at?: string
          created_by?: string | null
          data?: Json
          entry_type?: string
          id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "table_data_entries_client_automation_id_fkey"
            columns: ["client_automation_id"]
            isOneToOne: false
            referencedRelation: "client_automations"
            referencedColumns: ["id"]
          },
        ]
      }
      testimonials: {
        Row: {
          company: string | null
          created_at: string
          id: string
          language: string
          name: string
          text: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          id?: string
          language?: string
          name: string
          text: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          id?: string
          language?: string
          name?: string
          text?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials_translations: {
        Row: {
          created_at: string
          id: string
          language: string
          testimonial_id: string
          text: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          language: string
          testimonial_id: string
          text: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          language?: string
          testimonial_id?: string
          text?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "testimonials_translations_testimonial_id_fkey"
            columns: ["testimonial_id"]
            isOneToOne: false
            referencedRelation: "testimonials"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_responses: {
        Row: {
          created_at: string
          created_by: string
          id: string
          is_admin: boolean
          message: string
          ticket_id: string
        }
        Insert: {
          created_at?: string
          created_by: string
          id?: string
          is_admin?: boolean
          message: string
          ticket_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          is_admin?: boolean
          message?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_responses_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string
          email: string
          id: string
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      webhook_configs: {
        Row: {
          blog_creation_method: Database["public"]["Enums"]["request_method"]
          blog_creation_mode: Database["public"]["Enums"]["webhook_mode"]
          blog_creation_prod_url: string
          blog_creation_test_url: string
          blog_social_method: Database["public"]["Enums"]["request_method"]
          blog_social_mode: Database["public"]["Enums"]["webhook_mode"]
          blog_social_prod_url: string
          blog_social_test_url: string
          created_at: string
          id: string
          updated_at: string
          website_domain: string
        }
        Insert: {
          blog_creation_method?: Database["public"]["Enums"]["request_method"]
          blog_creation_mode?: Database["public"]["Enums"]["webhook_mode"]
          blog_creation_prod_url?: string
          blog_creation_test_url?: string
          blog_social_method?: Database["public"]["Enums"]["request_method"]
          blog_social_mode?: Database["public"]["Enums"]["webhook_mode"]
          blog_social_prod_url?: string
          blog_social_test_url?: string
          created_at?: string
          id?: string
          updated_at?: string
          website_domain?: string
        }
        Update: {
          blog_creation_method?: Database["public"]["Enums"]["request_method"]
          blog_creation_mode?: Database["public"]["Enums"]["webhook_mode"]
          blog_creation_prod_url?: string
          blog_creation_test_url?: string
          blog_social_method?: Database["public"]["Enums"]["request_method"]
          blog_social_mode?: Database["public"]["Enums"]["webhook_mode"]
          blog_social_prod_url?: string
          blog_social_test_url?: string
          created_at?: string
          id?: string
          updated_at?: string
          website_domain?: string
        }
        Relationships: []
      }
      webhook_logs: {
        Row: {
          client_automation_id: string
          created_at: string
          error_message: string | null
          id: string
          method: string
          payload: Json | null
          response_body: string | null
          response_time: number
          status_code: number
          success: boolean
          webhook_url: string
        }
        Insert: {
          client_automation_id: string
          created_at?: string
          error_message?: string | null
          id?: string
          method?: string
          payload?: Json | null
          response_body?: string | null
          response_time: number
          status_code: number
          success?: boolean
          webhook_url: string
        }
        Update: {
          client_automation_id?: string
          created_at?: string
          error_message?: string | null
          id?: string
          method?: string
          payload?: Json | null
          response_body?: string | null
          response_time?: number
          status_code?: number
          success?: boolean
          webhook_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "webhook_logs_client_automation_id_fkey"
            columns: ["client_automation_id"]
            isOneToOne: false
            referencedRelation: "client_automations"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      exec_sql: {
        Args: { sql_query: string }
        Returns: undefined
      }
      get_table_count: {
        Args: { table_name: string }
        Returns: {
          count: number
        }[]
      }
      get_users: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          role: string
          created_at: string
          updated_at: string
        }[]
      }
      is_admin: {
        Args: { user_uid: string }
        Returns: boolean
      }
      is_admin_secure: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      request_method: "POST" | "GET"
      user_type: "admin" | "client"
      webhook_mode: "test" | "production"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      request_method: ["POST", "GET"],
      user_type: ["admin", "client"],
      webhook_mode: ["test", "production"],
    },
  },
} as const
