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
      artists: {
        Row: {
          apple_music_link: string | null
          bio: string | null
          country: string
          created_at: string
          email: string
          facebook_page: string | null
          gender: Database["public"]["Enums"]["gender"]
          genres: string[] | null
          id: string
          instagram_id: string | null
          languages: string[]
          name: string
          phone: string
          spotify_link: string | null
          updated_at: string
          user_id: string | null
          website: string | null
          whatsapp: string
          youtube_channel: string | null
        }
        Insert: {
          apple_music_link?: string | null
          bio?: string | null
          country: string
          created_at?: string
          email: string
          facebook_page?: string | null
          gender: Database["public"]["Enums"]["gender"]
          genres?: string[] | null
          id?: string
          instagram_id?: string | null
          languages: string[]
          name: string
          phone: string
          spotify_link?: string | null
          updated_at?: string
          user_id?: string | null
          website?: string | null
          whatsapp: string
          youtube_channel?: string | null
        }
        Update: {
          apple_music_link?: string | null
          bio?: string | null
          country?: string
          created_at?: string
          email?: string
          facebook_page?: string | null
          gender?: Database["public"]["Enums"]["gender"]
          genres?: string[] | null
          id?: string
          instagram_id?: string | null
          languages?: string[]
          name?: string
          phone?: string
          spotify_link?: string | null
          updated_at?: string
          user_id?: string | null
          website?: string | null
          whatsapp?: string
          youtube_channel?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      copyright_removal_requests: {
        Row: {
          created_at: string
          id: string
          label_id: string | null
          notes: string | null
          release_id: string | null
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
          user_id: string | null
          youtube_link: string
        }
        Insert: {
          created_at?: string
          id?: string
          label_id?: string | null
          notes?: string | null
          release_id?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          user_id?: string | null
          youtube_link: string
        }
        Update: {
          created_at?: string
          id?: string
          label_id?: string | null
          notes?: string | null
          release_id?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          user_id?: string | null
          youtube_link?: string
        }
        Relationships: [
          {
            foreignKeyName: "copyright_removal_requests_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "labels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "copyright_removal_requests_release_id_fkey"
            columns: ["release_id"]
            isOneToOne: false
            referencedRelation: "releases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "copyright_removal_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      labels: {
        Row: {
          bio: string | null
          country: string
          created_at: string
          email: string
          facebook_page: string | null
          genres: string[] | null
          id: string
          instagram_id: string | null
          languages: string[]
          name: string
          phone: string
          updated_at: string
          user_id: string | null
          website: string | null
          whatsapp: string
          youtube_channel: string | null
        }
        Insert: {
          bio?: string | null
          country: string
          created_at?: string
          email: string
          facebook_page?: string | null
          genres?: string[] | null
          id?: string
          instagram_id?: string | null
          languages: string[]
          name: string
          phone: string
          updated_at?: string
          user_id?: string | null
          website?: string | null
          whatsapp: string
          youtube_channel?: string | null
        }
        Update: {
          bio?: string | null
          country?: string
          created_at?: string
          email?: string
          facebook_page?: string | null
          genres?: string[] | null
          id?: string
          instagram_id?: string | null
          languages?: string[]
          name?: string
          phone?: string
          updated_at?: string
          user_id?: string | null
          website?: string | null
          whatsapp?: string
          youtube_channel?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "labels_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      oac_requests: {
        Row: {
          artist_id: string | null
          created_at: string
          id: string
          label_id: string | null
          notes: string | null
          owned_channel_link: string
          status: Database["public"]["Enums"]["request_status"]
          topic_channel_link: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          artist_id?: string | null
          created_at?: string
          id?: string
          label_id?: string | null
          notes?: string | null
          owned_channel_link: string
          status?: Database["public"]["Enums"]["request_status"]
          topic_channel_link: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          artist_id?: string | null
          created_at?: string
          id?: string
          label_id?: string | null
          notes?: string | null
          owned_channel_link?: string
          status?: Database["public"]["Enums"]["request_status"]
          topic_channel_link?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "oac_requests_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oac_requests_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "labels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "oac_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      platforms: {
        Row: {
          created_at: string
          id: string
          is_main: boolean
          logo_url: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_main?: boolean
          logo_url?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_main?: boolean
          logo_url?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          active: boolean
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          email: string
          full_name: string
          id: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          active?: boolean
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      releases: {
        Row: {
          admin_notes: string | null
          artist_id: string | null
          audio_url: string
          copyright: string
          cover_art_url: string
          created_at: string
          id: string
          instagram_id: string | null
          label_id: string | null
          language: string
          lyrics_name: string[]
          music_producer: string | null
          platforms: string[]
          publisher: string | null
          release_date: string | null
          song_name: string
          status: Database["public"]["Enums"]["release_status"]
          type: Database["public"]["Enums"]["release_type"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          admin_notes?: string | null
          artist_id?: string | null
          audio_url: string
          copyright: string
          cover_art_url: string
          created_at?: string
          id?: string
          instagram_id?: string | null
          label_id?: string | null
          language: string
          lyrics_name: string[]
          music_producer?: string | null
          platforms: string[]
          publisher?: string | null
          release_date?: string | null
          song_name: string
          status?: Database["public"]["Enums"]["release_status"]
          type: Database["public"]["Enums"]["release_type"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          admin_notes?: string | null
          artist_id?: string | null
          audio_url?: string
          copyright?: string
          cover_art_url?: string
          created_at?: string
          id?: string
          instagram_id?: string | null
          label_id?: string | null
          language?: string
          lyrics_name?: string[]
          music_producer?: string | null
          platforms?: string[]
          publisher?: string | null
          release_date?: string | null
          song_name?: string
          status?: Database["public"]["Enums"]["release_status"]
          type?: Database["public"]["Enums"]["release_type"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "releases_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "releases_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "labels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "releases_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      royalty_reports: {
        Row: {
          artist_id: string | null
          created_at: string
          file_type: string
          file_url: string
          id: string
          label_id: string | null
          report_period: string
          user_id: string | null
        }
        Insert: {
          artist_id?: string | null
          created_at?: string
          file_type: string
          file_url: string
          id?: string
          label_id?: string | null
          report_period: string
          user_id?: string | null
        }
        Update: {
          artist_id?: string | null
          created_at?: string
          file_type?: string
          file_url?: string
          id?: string
          label_id?: string | null
          report_period?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "royalty_reports_artist_id_fkey"
            columns: ["artist_id"]
            isOneToOne: false
            referencedRelation: "artists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "royalty_reports_label_id_fkey"
            columns: ["label_id"]
            isOneToOne: false
            referencedRelation: "labels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "royalty_reports_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string
          description: string | null
          id: string
          type: Database["public"]["Enums"]["transaction_type"]
          wallet_id: string | null
        }
        Insert: {
          amount: number
          created_at?: string
          description?: string | null
          id?: string
          type: Database["public"]["Enums"]["transaction_type"]
          wallet_id?: string | null
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string | null
          id?: string
          type?: Database["public"]["Enums"]["transaction_type"]
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          balance: number
          created_at: string
          id: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          balance?: number
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      withdrawal_requests: {
        Row: {
          account_holder_name: string | null
          account_number: string | null
          amount: number
          created_at: string
          id: string
          ifsc_code: string | null
          notes: string | null
          status: Database["public"]["Enums"]["request_status"]
          updated_at: string
          upi_id: string | null
          user_id: string | null
        }
        Insert: {
          account_holder_name?: string | null
          account_number?: string | null
          amount: number
          created_at?: string
          id?: string
          ifsc_code?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          upi_id?: string | null
          user_id?: string | null
        }
        Update: {
          account_holder_name?: string | null
          account_number?: string | null
          amount?: number
          created_at?: string
          id?: string
          ifsc_code?: string | null
          notes?: string | null
          status?: Database["public"]["Enums"]["request_status"]
          updated_at?: string
          upi_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "withdrawal_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      gender: "male" | "female" | "other"
      release_status:
        | "pending_review"
        | "approved"
        | "rejected"
        | "live"
        | "takedown_requested"
        | "takedown_completed"
      release_type: "single" | "album" | "ep"
      request_status:
        | "pending"
        | "in_process"
        | "approved"
        | "rejected"
        | "completed"
      transaction_type: "earnings" | "withdrawal"
      user_role: "customer" | "admin"
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
      gender: ["male", "female", "other"],
      release_status: [
        "pending_review",
        "approved",
        "rejected",
        "live",
        "takedown_requested",
        "takedown_completed",
      ],
      release_type: ["single", "album", "ep"],
      request_status: [
        "pending",
        "in_process",
        "approved",
        "rejected",
        "completed",
      ],
      transaction_type: ["earnings", "withdrawal"],
      user_role: ["customer", "admin"],
    },
  },
} as const
