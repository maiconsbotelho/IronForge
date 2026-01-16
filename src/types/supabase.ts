export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          avatar_url: string | null;
          level: "beginner" | "intermediate" | "advanced" | null;
          goal: "strength" | "conditioning" | "aesthetics" | "general" | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          level?: "beginner" | "intermediate" | "advanced" | null;
          goal?: "strength" | "conditioning" | "aesthetics" | "general" | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          avatar_url?: string | null;
          level?: "beginner" | "intermediate" | "advanced" | null;
          goal?: "strength" | "conditioning" | "aesthetics" | "general" | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      movement_patterns: {
        Row: {
          code: string;
          name: string;
          description: string | null;
        };
      };
      exercises: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          equipment:
            | (
                | "barbell"
                | "dumbbell"
                | "kettlebell"
                | "bodyweight"
                | "machine"
              )[]
            | null;
          category:
            | "strength"
            | "gymnastics"
            | "conditioning"
            | "mobility"
            | null;
          created_at: string;
        };
      };
      workouts: {
        Row: {
          id: string;
          user_id: string;
          name: string | null;
          date: string;
          notes: string | null;
          status: "planned" | "in_progress" | "completed" | null;
          wod_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name?: string | null;
          date?: string;
          notes?: string | null;
          status?: "planned" | "in_progress" | "completed" | null;
          wod_id?: string | null;
          created_at?: string;
        };
      };
      // Add other tables as needed (workout_items, personal_records, etc)
    };
  };
}
