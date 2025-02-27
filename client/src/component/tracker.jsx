import { useState } from "react";
import { submitTrackerData } from "../api/trackerApi";

const TrackerApp = () => {
    const [stops, setStops] = useState("");
    const [routes, setRoutes] = useState("");
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        const formData = { stops, routes, date };

        try {
            const result = await submitTrackerData(formData);
            alert("Form submitted successfully!");
            console.log("API Response:", result);

            // Clear form after successful submission
            setStops("");
            setRoutes("");
            setDate("");
        } catch (error) {
            setError("Failed to submit form. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Stops:</label>
                <input 
                    type="text" 
                    value={stops} 
                    onChange={(e) => setStops(e.target.value)} 
                    placeholder="Enter stops" 
                    required 
                />
            </div>

            <div>
                <label>Routes:</label>
                <input 
                    type="text" 
                    value={routes} 
                    onChange={(e) => setRoutes(e.target.value)} 
                    placeholder="Enter routes" 
                    required 
                />
            </div>

            <div>
                <label>Date:</label>
                <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                    required 
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
    );
};

export default TrackerApp;
