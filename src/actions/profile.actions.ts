import { ProfileNamePayload, updateProfile } from "@/lib/services/profile.service";
import axios from "axios";

export const handleUpdateProfile = async (
    payload: ProfileNamePayload
): Promise<{ success: boolean; error?: string }> => {
    try {
        await updateProfile(payload);
        return { success: true };
    } catch (error: unknown) {
        const message = axios.isAxiosError<{ message?: unknown }>(error)
            ? error.response?.data?.message
            : undefined;
        return {
            success: false,
            error:
                typeof message === "string" && message
                    ? message
                    : "Could not save your name. Please try again.",
        };
    }
};
