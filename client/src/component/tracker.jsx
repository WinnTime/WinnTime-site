import { useState } from "react";
import { submitTrackerData } from "../api/trackerApi";
import ScheduleList from "./scheduleList"; 
import SubscribeToPush from "./SubscribeToPush";

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
            // console.log("API Response:", result.schedule["stop-schedule"]);
            setSchedule(result["stop-schedule"]);
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
        <div className="">
            <div className="absolute top-4 left-4 flex gap-6">

        <form className="flex gap-4 flex-col items-start p-3 rounded-xl bg-neutral-700 max-w-xl" onSubmit={handleSubmit}>
            <div className="flex w-full gap-2 justify-around items-start ">
            <div className="flex items-center gap-2">
                <label>Stops:</label>
                <input 
                    type="text" 
                    className="bg-neutral-900 py-1 px-1.5 rounded-sm"
                    value={stops} 
                    onChange={(e) => setStops(e.target.value)} 
                    placeholder="Enter stops" 
                />
            </div>

            <div className="flex items-center gap-2">
                <label>Route:</label>
                <input 
                    type="text" 
                      className="bg-neutral-900 py-1 px-1.5 rounded-sm"
                    value={routes} 
                    onChange={(e) => setRoutes(e.target.value)} 
                    placeholder="Enter route" 
                />
            </div>
     
            </div>
            {/* <div className="flex items-center gap-2">
                <label>Date:</label>
                <input 
                    type="date" 
                      className="bg-neutral-900 py-1 px-1.5 rounded-sm"
                    value={date} 
                    onChange={(e) => setDate(e.target.value)} 
                />
            </div> */}

            <button type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
            </button>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </form>
        <SubscribeToPush />
        </div>
        <ScheduleList schedule={schedule} />
        </div>
    );
};

export default TrackerApp;
