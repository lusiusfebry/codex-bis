export interface AuthUser {
  id: string;
  nik: string;
  nama: string;
  role: string;
  fotoUrl: string | null;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
  initializeAuth: () => Promise<void>;
}

export interface LoginPayload {
  nik: string;
  password: string;
}
