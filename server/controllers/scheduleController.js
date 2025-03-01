import cron from "node-cron";
import axios from "axios";
import { API_KEY } from "../config/dotenvConfig.js";
import { webpush } from "../webPushConfig.js";
import { getSubscriptions } from "../subscriptionManager.js"; 

let userRequestedStop = null; // Track the last user-requested stop
let latestSchedule = {}; // Store latest fetched schedule

const fetchScheduleForStop = async (stops) => {
    try {
        const API_URL = `https://api.winnipegtransit.com/v3/stops/${stops}/schedule.json?api-key=${API_KEY}`;
        const response = await axios.get(API_URL);
        const scheduleData = response.data;
        let message = "";
        // Modify the response to add delay information
        scheduleData["stop-schedule"]["route-schedules"].forEach((routeSchedule) => {
            routeSchedule["scheduled-stops"].forEach((stop) => {
                const arrivalScheduled = new Date(stop.times.arrival.scheduled);
                const arrivalEstimated = new Date(stop.times.arrival.estimated);
        
                const delayMinutes = Math.round((arrivalEstimated - arrivalScheduled) / (1000 * 60));
        
                stop.isLate = delayMinutes > 0;
                stop.isEarly = delayMinutes < 0;
                stop.delayMinutes = delayMinutes > 0 ? delayMinutes : 0;
                stop.earlyMinutes = delayMinutes < 0 ? Math.abs(delayMinutes) : 0; // Store as positive value
        
                if (delayMinutes > 0) {
                    message += `🚨 Route ${routeSchedule.route.number} - ${routeSchedule.route.name} (${stop.variant.name}) scheduled at ${arrivalScheduled.toLocaleTimeString()} is *delayed*, and will arive in ${delayMinutes} minutes  \n`;
                } else if (delayMinutes < 0) {
                    message += `✅ Route ${routeSchedule.route.number} - ${routeSchedule.route.name} (${stop.variant.name}) scheduled at ${arrivalScheduled.toLocaleTimeString()} is *early*, and will arive in ${Math.abs(delayMinutes)} minutes.\n`;
                }
            });
        });

        if (message) {
            console.log("test 2");
            console.log("Sending push notification:", message);
            sendPushNotification(message);
          }

        return scheduleData; // Return fresh data instead of caching
    } catch (error) {
        console.error(`Error fetching schedule for stop ${stops}:`, error);
        throw error;
    }
};

// Fetch user-requested stop every 5 seconds
cron.schedule("*/10 * * * * *", async () => {
    if (userRequestedStop) {
        console.log(`Fetching updated schedule for user-requested stop: ${userRequestedStop}`);
        try {
            latestSchedule[userRequestedStop] = await fetchScheduleForStop(userRequestedStop); // Store updated data
            console.log(latestSchedule[userRequestedStop]);
        } catch (error) {
            console.error(`Failed to update schedule for stop ${userRequestedStop}`);
        }
    }
});

const sendPushNotification = (message) => {
    const subscriptions = getSubscriptions(); // Fetch user subscriptions from storage
  
    console.log("sending notif to frontend");
    subscriptions.forEach((subscription) => {
      webpush
        .sendNotification(subscription, JSON.stringify({ title: "Bus Update", body: message }))
        .catch((error) => console.error("Error sending push notification:", error));
    });
  };
// API route to handle user requests
export const getSchedule = async (req, res) => {
    const { stops } = req.body;

    if (!stops) {
        return res.status(400).json({ error: "Stops parameter is required" });
    }

    userRequestedStop = stops; // Update last requested stop

    // Return latest schedule from cron if available
    if (latestSchedule[stops]) {
        console.log(latestSchedule[stops]);
        return res.json(latestSchedule[stops]);
    }

    // Otherwise, fetch fresh data
    try {
        const scheduleData = await fetchScheduleForStop(stops);
        latestSchedule[stops] = scheduleData; // Store it for quick access
        return res.json(scheduleData);
    } catch (error) {
        return res.status(500).json({ error: "Failed to fetch stop schedule" });
    }
};
