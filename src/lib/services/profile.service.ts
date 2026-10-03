import axiosInstance from "@/lib/axios";

export interface ProfileNamePayload {
    first_name: string;
    last_name: string;
}

/** Updates the signed-in student's shared personal data. */
export const updateProfile = async (payload: ProfileNamePayload): Promise<void> => {
    await axiosInstance.patch("profiles/me/", payload);
};
