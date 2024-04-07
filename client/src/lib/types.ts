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

export type TokenResponse = {
    token: string;
}