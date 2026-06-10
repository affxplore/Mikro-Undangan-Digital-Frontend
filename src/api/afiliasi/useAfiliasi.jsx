import apiService from "../apiService";

export const registerAsPartner = async (partnerData) => {
    try {
        const response = await apiService.post("/afiliasi/register", partnerData);
        return response.data;
    } catch (error) {
        throw error.response?.data || "Terjadi kesalahan saat mendaftar"
    }
};