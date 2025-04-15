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
          page: string
          section_name: string
          updated_at: string | null
        }
        Insert: {
          content: string
          id?: string
          page: string
          section_name: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          id?: string
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
      testimonials: {
        Row: {
          company: string | null
          created_at: string
          id: string
          name: string
          text: string
          updated_at: string
        }
        Insert: {
          company?: string | null
          created_at?: string
          id?: string
          name: string
          text: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          created_at?: string
          id?: string
          name?: string
          text?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      check_and_add_admin_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
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
    },
  },
} as const
