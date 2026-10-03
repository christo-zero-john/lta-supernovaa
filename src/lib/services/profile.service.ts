import axiosInstance from "@/lib/axios";

export interface ProfileNamePayload {
    first_name: string;
    last_name: string;
    /** A new profile photo; left out when the photo is unchanged. */
    profile_picture?: File;
}

/**
 * Updates the signed-in student's shared personal data and returns the
 * photo's address when the server sends one back.
 */
export const updateProfile = async (payload: ProfileNamePayload): Promise<string | undefined> => {
    const {profile_picture, ...names} = payload;
    let body: FormData | typeof names = names;
    if (profile_picture) {
        // A file can only travel as a multipart form.
        body = new FormData();
        body.append("first_name", names.first_name);
        body.append("last_name", names.last_name);
        body.append("profile_picture", profile_picture);
    }
    const response = await axiosInstance.patch("profiles/me/", body);
    const picture = response.data?.data?.profile_picture;
    return typeof picture === "string" ? picture : undefined;
};
