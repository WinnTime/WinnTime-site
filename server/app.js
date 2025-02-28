import express from "express";
import cors from "cors";
import scheduleRoutes from "./routes/scheduleRoutes.js";
import { addSubscription } from "./subscriptionManager.js";
import { VAPID_KEYS } from "./webPushConfig.js";
import { PORT } from "./config/dotenvconfig.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/schedule", scheduleRoutes);

// Handle push subscription
app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  addSubscription(subscription);
  res.status(201).json({ message: "Subscription added successfully" });
});

// Serve VAPID public key to frontend
app.get("/vapidPublicKey", (req, res) => {
  res.json({ publicKey: VAPID_KEYS.publicKey });
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
