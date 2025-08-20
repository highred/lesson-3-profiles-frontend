import React from 'react';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Role = "technician" | "coordinator" | "admin";

export type Profile = {
  id: string
  updated_at: string | null
  username: string | null
  full_name: string | null
  avatar_url: string | null
  website: string | null
  role: Role
};

export type Equipment = {
  id: number
  created_at: string
  name: string
  category: string
  description: string | null
  image_url: string | null
  serial_number: string | null
};

export type Booking = {
  id: number;
  created_at: string;
  technician_id: string;
  start_date: string;
  end_date: string;
  notes_for_coordinator: string | null;
  status: "upcoming" | "active" | "completed" | "staged";
  profiles: { full_name: string | null };
  booking_items: { equipment: Equipment }[];
};

export type Message = {
  id: number;
  user_id: string;
  text: string | null;
  created_at: string;
  profiles: { username: string | null, avatar_url: string | null } | null;
};

export type Step = {
  title: string;
  icon: React.ReactNode;
  content: React.ReactNode;
};


export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string | null
          username: string | null
          full_name: string | null
          avatar_url: string | null
          website: string | null
          role: Role
        }
        Insert: {
          id: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          role?: Role
        }
        Update: {
          id?: string
          updated_at?: string | null
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          website?: string | null
          role?: Role
        }
        Relationships: []
      }
      equipment: {
        Row: {
          id: number
          created_at: string
          name: string
          category: string
          description: string | null
          image_url: string | null
          serial_number: string | null
        }
        Insert: {
          id?: number
          created_at?: string
          name: string
          category: string
          description?: string | null
          image_url?: string | null
          serial_number?: string | null
        }
        Update: {
          id?: number
          created_at?: string
          name?: string
          category?: string
          description?: string | null
          image_url?: string | null
          serial_number?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          id: number
          created_at: string
          technician_id: string
          start_date: string
          end_date: string
          notes_for_coordinator: string | null
          status: "upcoming" | "active" | "completed" | "staged"
        }
        Insert: {
          id?: number
          created_at?: string
          technician_id: string
          start_date: string
          end_date: string
          notes_for_coordinator?: string | null
          status?: "upcoming" | "active" | "completed" | "staged"
        }
        Update: {
          id?: number
          created_at?: string
          technician_id?: string
          start_date?: string
          end_date?: string
          notes_for_coordinator?: string | null
          status?: "upcoming" | "active" | "completed" | "staged"
        }
        Relationships: []
      }
      booking_items: {
        Row: {
          booking_id: number
          equipment_id: number
        }
        Insert: {
          booking_id: number
          equipment_id: number
        }
        Update: {
          booking_id?: number
          equipment_id?: number
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: number
          created_at: string
          text: string | null
          user_id: string
        }
        Insert: {
          id?: number
          created_at?: string
          text?: string | null
          user_id: string
        }
        Update: {
          id?: number
          created_at?: string
          text?: string | null
          user_id?: string
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
