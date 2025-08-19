import type React from 'react';

export interface Step {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

export interface Message {
  id: number;
  created_at: string;
  text: string;
  user_id: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
  } | null;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      messages: {
        Row: {
          created_at: string
          id: number
          text: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          text: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          text?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          id: string
          updated_at: string | null
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          id: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          id?: string
          updated_at?: string | null
          username?: string | null
          website?: string | null
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
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
