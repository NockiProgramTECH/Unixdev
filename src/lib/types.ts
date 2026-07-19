export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  long_description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  featured: boolean;
  created_at: string;
}

export interface ProjectFile {
  id: string;
  project_id: string;
  file_type: 'executable' | 'documentation';
  file_name: string;
  storage_path: string;
  file_size: number | null;
  created_at: string;
}

export interface Order {
  id: string;
  project_id: string;
  user_id: string;
  amount: number;
  currency: string;
  transaction_id: string | null;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  created_at: string;
  project?: Project;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  created_at: string;
}
