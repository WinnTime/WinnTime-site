import cron from "node-cron";
import axios from "axios";
import { API_KEY } from "../config/dotenvConfig.js";
import { webpush } from "../webPushConfig.js";
import { getSubscriptions } from "../subscriptionManager.js";

let userRequestedStop = null;
let userRequestedRoute = null; // Track the last user-requested route

const fetchScheduleForStop = async (stops, routes) => {
  try {
    let API_URL = `https://api.winnipegtransit.com/v3/stops/${stops}/schedule.json?api-key=${API_KEY}`;

    // If routes exist and are a non-empty string, modify API URL
    if (routes > 0) {
      API_URL = `https://api.winnipegtransit.com/v3/stops/${stops}/schedule.json?route=${routes}&api-key=${API_KEY}`;
    }

    console.log("Fetching data from:", API_URL); // Debugging

    const response = await axios.get(API_URL);
    const scheduleData = response.data;
    let message = "";
    const now = new Date();
    console.log(scheduleData);
    // Modify the response to add delay information
    scheduleData["stop-schedule"]["route-schedules"].forEach(
      (routeSchedule) => {
        routeSchedule["scheduled-stops"].forEach((stop) => {
          const arrivalScheduled = new Date(stop.times.arrival.scheduled);
          const arrivalEstimated = new Date(stop.times.arrival.estimated);

          const delayMinutes = Math.round(
            (arrivalEstimated - arrivalScheduled) / (1000 * 60)
          );

          stop.isLate = delayMinutes > 0;
          stop.isEarly = delayMinutes < 0;
          stop.delayMinutes = delayMinutes > 0 ? delayMinutes : 0;
          stop.earlyMinutes = delayMinutes < 0 ? Math.abs(delayMinutes) : 0; // Store as positive value

          let arriveInTime = Math.round((arrivalEstimated - now) / (1000 * 60));
          if (delayMinutes > 0) {
            message += `🚨 Route ${routeSchedule.route.number} - ${
              routeSchedule.route.name
            } (${
              stop.variant.name
            }) scheduled at ${arrivalScheduled.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })} is DELAYED, and will arrive in ${arriveInTime} minutes.\n`;
          } else if (delayMinutes < 0) {
            message += `✅ Route ${routeSchedule.route.number} - ${
              routeSchedule.route.name
            } (${
              stop.variant.name
            }) scheduled at ${arrivalScheduled.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })} is EARLY, and will arrive in ${Math.abs(
              arriveInTime
            )} minutes.\n`;
          }
        });
      }
    );

    if (message) {
      console.log("Sending push notification:", message);
      sendPushNotification(message);
    }

    return scheduleData; // Always return fresh data
  } catch (error) {
    console.error(`Error fetching schedule for stop ${stops}:`, error);
    throw error;
  }
};

// Fetch user-requested stop and route every 10 seconds
cron.schedule("*/10 * * * * *", async () => {
  if (userRequestedStop || userRequestedRoute) {
    console.log(
      `Fetching updated schedule for user-requested stop: ${userRequestedStop}, route: ${userRequestedRoute}`
    );
    try {
      await fetchScheduleForStop(userRequestedStop, userRequestedRoute); // Always fetch fresh data
    } catch (error) {
      console.error(`Failed to update schedule for stop ${userRequestedStop}`);
    }
  }
});

const sendPushNotification = (message) => {
  const subscriptions = getSubscriptions(); // Fetch user subscriptions from storage

  console.log("Sending notification to frontend");
  subscriptions.forEach((subscription) => {
    webpush
      .sendNotification(
        subscription,
        JSON.stringify({ title: "Bus Update", body: message })
      )
      .catch((error) =>
        console.error("Error sending push notification:", error)
      );
  });
};

// API route to handle user requests
export const getSchedule = async (req, res) => {
  const { stops, routes } = req.body;

  if (!stops) {
    return res.status(400).json({ error: "Stops parameter is required" });
  }

  userRequestedStop = stops;
  userRequestedRoute = routes;

  // Always fetch fresh data
  try {
    const scheduleData = await fetchScheduleForStop(stops, routes);
    return res.json(scheduleData);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch stop schedule" });
  }
};
