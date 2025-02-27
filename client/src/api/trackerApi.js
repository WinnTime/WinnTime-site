import axios from "axios";

const BACKEND_API_URL = "http://localhost:5000/api/schedule"; // Change this when deploying

export const submitTrackerData = async (formData) => {
    console.log(formData);
    try {
        const response = await axios.post(BACKEND_API_URL, formData, {
            headers: { "Content-Type": "application/json" }, // ✅ Ensure JSON header
        });
        return response.data;
    } catch (error) {
        console.error("Error submitting tracker data:", error.response?.data || error.message);
        throw error;
    }
};
