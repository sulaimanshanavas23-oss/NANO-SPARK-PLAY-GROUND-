export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
        };
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          item_type: "lab" | "tool";
          item_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          item_type: "lab" | "tool";
          item_id: string;
        };
        Update: never;
      };
      activities: {
        Row: {
          id: string;
          user_id: string;
          item_type: "lab" | "tool";
          item_id: string;
          created_at: string;
        };
        Insert: {
          user_id: string;
          item_type: "lab" | "tool";
          item_id: string;
        };
        Update: never;
      };
      learning_progress: {
        Row: {
          user_id: string;
          lab_id: string;
          percent: number;
          visits: number;
          last_visited_at: string;
        };
        Insert: {
          user_id: string;
          lab_id: string;
          percent?: number;
          visits?: number;
          last_visited_at?: string;
        };
        Update: {
          percent?: number;
          visits?: number;
          last_visited_at?: string;
        };
      };
    };
  };
};
