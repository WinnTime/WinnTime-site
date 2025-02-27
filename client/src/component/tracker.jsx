import { useState } from "react";
import { submitTrackerData } from "../api/trackerApi";
import ScheduleList from "./scheduleList"; 

const TrackerApp = () => {
    const [stops, setStops] = useState("");
    const [routes, setRoutes] = useState("");
    const [date, setDate] = useState("");
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        // Dynamically construct the request payload
        const formData = {};
        if (stops) formData.stops = stops;
        if (routes) formData.routes = routes;
        if (date) formData.date = date;

        try {
            const result = await submitTrackerData(formData);
            alert("Form submitted successfully!");
            console.log("API Response:", result);
            console.log("API Response:", result.schedule["stop-schedule"]);
            setSchedule(result.schedule["stop-schedule"]);
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
        <div>
        <form onSubmit={handleSubmit}>
            <div>
                <label>Stops:</label>
                <input 
                    type="text" 
                    value={stops} 
                    onChange={(e) => setStops(e.target.value)} 
                    placeholder="Enter stops" 
                />
            </div>

            <div>
                <label>Routes:</label>
                <input 
                    type="text" 
                    value={routes} 
                    onChange={(e) => setRoutes(e.target.value)} 
                    placeholder="Enter routes" 
                />
            </div>

            <div>
                <label>Date:</label>
                <input 
                    type="date" 
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
        <ScheduleList schedule={schedule} />
        </div>
    );
};

export default TrackerApp;
