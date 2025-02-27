import axios from "axios";
import { API_KEY } from "../config/dotenvConfig.js";

export const getSchedule = async (req, res) => {

    const { stops, route, date } = req.body; 

    console.log("Received Data:", { stops, route, date });

    const API_URL = `https://api.winnipegtransit.com/v3/stops/${stops}/schedule.json?api-key=${API_KEY}`;

    try {
        const response = await axios.get(API_URL);
        console.log("Full API Response:", response.data);
        res.json({
            schedule: response.data,
            // extraData: { extraParam1, extraParam2, extraParam3 } // Fields that are not sent will be undefined
        });

    } catch (error) {
        console.error("Error fetching stop schedule:", error);
        res.status(500).json({ error: "Failed to fetch stop schedule" });
    }
};