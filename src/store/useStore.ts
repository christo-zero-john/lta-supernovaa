import { create } from "zustand";


export interface User {
    id: string;
    email: string;
    is_email_verified: boolean;
    first_name: string;
    last_name: string;
    profile_picture: string;
    phone_number?: string | null;
    /** Not sent by the API yet; picks the avatar group when it is. */
    gender?: string | null;
    signup_platform_type: string;
    is_onboarding_completed: boolean;
    is_approved: boolean;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    setUser: (user: User) => void;
    clearUser: () => void;
}

const useStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,

    setUser: (user) => set({ user, isAuthenticated: true }),

    clearUser: () => set({ user: null, isAuthenticated: false }),
}));

export default useStore;
