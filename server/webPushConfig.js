import webpush from "web-push";
import {VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY} from "./config/dotenvconfig.js";
const VAPID_KEYS = {
  publicKey: VAPID_PUBLIC_KEY,
  privateKey: VAPID_PRIVATE_KEY,
};

webpush.setVapidDetails(
  "mailto:marc.dizon57@gmail.com",
  VAPID_KEYS.publicKey,
  VAPID_KEYS.privateKey
);

export { webpush, VAPID_KEYS };
