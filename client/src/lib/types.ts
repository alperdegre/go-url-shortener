export enum PageState {
  HOME,
  LOGIN,
  SIGNUP,
  ABOUT,
  DASHBOARD,
}

export enum Language {
  GO = "GO",
  PYTHON = "PYTHON"
}

export type APIError = {
  error: string;
};

export type UrlResponse = {
  url: string;
};

export type TokenResponse = {
  token: string;
  userID: string;
  expiry: number;
};

export type JWTToken = string | null;
export type UserID = string | null;
export type JWTExpiry = number | null;

export type URL = {
  ID: number;
  CreatedAt: string;
  LongURL: string;
  ShortURL: string;
  User?: User;
  UserID: number;
};

export type User = {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  Username: string;
  Password: string;
};

export type PythonURL = {
  id: number;
  user_id: number;
  long_url: string;
  short_url: string;
  created_at: string;
}
