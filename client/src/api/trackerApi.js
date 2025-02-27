const API_URL = "https://your-api-endpoint.com/submit"; // Replace with your actual API URL

export const submitTrackerData = async (data) => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error submitting data:", error);
        throw error;
    }
};