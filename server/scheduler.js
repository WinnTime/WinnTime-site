import cron from "node-cron";
import axios from "axios";
import { API_KEY } from "./config/dotenvConfig.js";
import { webpush } from "./webPushConfig.js";
import { getSubscriptions } from "./subscriptionManager.js"; // Stores user subscriptions

const STOPS = ["10363"]; // Example stop IDs

const fetchScheduleAndNotify = async () => {
  try {
    const responses = await Promise.all(
      STOPS.map((stop) =>
        axios.get(`https://api.winnipegtransit.com/v3/stops/${stop}/schedule.json?api-key=${API_KEY}`)
      )
    );
    console.log("working");
    let message = "";
    responses.forEach((response, index) => {
      const stopData = response.data;
      // console.log(response.data)
      stopData["stop-schedule"]["route-schedules"].forEach((routeSchedule) => {
        routeSchedule["scheduled-stops"].forEach((stop) => {
          const arrivalTime = new Date(stop.times.arrival.scheduled);
          const estimatedTime = new Date(stop.times.arrival.estimated);
          const delayMinutes = Math.round((estimatedTime - arrivalTime) / (1000 * 60));
          // console.log(delayMinutes);
          if (delayMinutes > 0) {
            message += `Route ${routeSchedule.route.number} ${routeSchedule.route.name} ${stop.variant.name} at stop ${STOPS[index]} is delayed by ${delayMinutes} minutes.\n`;
          }
        });
      });
      console.log(message);
    });

    if (message) {
      console.log("test 2");
      console.log("Sending push notification:", message);
      sendPushNotification(message);
    }
  } catch (error) {
    console.log("test 3");
    console.error("Error fetching schedule:", error);
  }
};

// Schedule the function to run every 30 seconds
//cron.schedule("*/50 * * * * *", fetchScheduleAndNotify);

const sendPushNotification = (message) => {
  const subscriptions = getSubscriptions(); // Fetch user subscriptions from storage

  console.log("sending notif to frontend");
  subscriptions.forEach((subscription) => {
    webpush
      .sendNotification(subscription, JSON.stringify({ title: "Bus Update", body: message }))
      .catch((error) => console.error("Error sending push notification:", error));
  });
};

export { fetchScheduleAndNotify };
