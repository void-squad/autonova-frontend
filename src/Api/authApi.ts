import axios from "axios";

// TODO: Move to environment variable (VITE_API_BASE_URL)
const API_URL = "http://localhost:5000/api/auth";

export interface LoginCredentials {
    email: string;
    password: string;
    remember: boolean;
}

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}

export interface SignupCredentials {
    fullName: string;
    email: string;
    password: string;
}

export interface SignupResponse extends LoginResponse {}

export const login = async (
    credentials: LoginCredentials
): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(`${API_URL}/login`, credentials);
    return response.data;
};

export const signup = async (
    credentials: SignupCredentials
): Promise<SignupResponse> => {
    const response = await axios.post<SignupResponse>(`${API_URL}/signup`, credentials);
    return response.data;
};
