export enum PageState {
    HOME,
    LOGIN,
    SIGNUP,
    ABOUT,
    DASHBOARD
};

export type APIError = {
    error: string;
}

export type UrlResponse = {
    url: string;
}

export type TokenResponse = {
    token: string;
    userID: string;
    expiry: number;
}

export type JWTToken = string | null;
export type UserID = string | null;
export type JWTExpiry = number | null;