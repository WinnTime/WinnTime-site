import axios from "axios";
import { API_KEY } from "../config/dotenvConfig.js";

export const getSchedule = async (req, res) => {
    const { stops } = req.body;

    const API_URL = `https://api.winnipegtransit.com/v3/stops/${stops}/schedule.json?api-key=${API_KEY}`;

    try {
        const response = await axios.get(API_URL);
        const scheduleData = response.data;

        // Modify the response to add delay information
        scheduleData["stop-schedule"]["route-schedules"].forEach((routeSchedule) => {
            routeSchedule["scheduled-stops"].forEach((stop) => {
                const arrivalTime = new Date(stop.times.arrival);
                const estimatedTime = new Date(stop.times.estimated);

                // Calculate delay in minutes
                const delayMinutes = Math.round((estimatedTime - arrivalTime) / (1000 * 60));

                stop.isLate = delayMinutes > 0;
                stop.delayMinutes = delayMinutes > 0 ? delayMinutes : 0;
            });
        });

        res.json(scheduleData);
    } catch (error) {
        console.error("Error fetching stop schedule:", error);
        res.status(500).json({ error: "Failed to fetch stop schedule" });
    }
};
