export interface User {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: 'USER' | 'ADMIN';
}

export interface UpdateUserRequest {
  firstname: string;
  lastname: string;
}

export interface University {
  id: number;
  name: string;
  country?: string;
  city: string;
  description: string;
  website: string;
  logoUrl?: string;
  averageRating?: number; // Optional because backend might return it, but maybe not on all endpoints initially
  tags?: string[];
}

export interface Review {
  id: number;
  universityId?: number;
  universityName?: string;
  userId?: number;
  rating: number;
  text: string;
  year?: number; // kept for legacy if needed, but we use createdAt now
  tags: string[];
  userName?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  user?: User; // Depending on how your backend returns it, might need adjustment
}
