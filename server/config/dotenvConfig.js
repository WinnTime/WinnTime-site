import dotenv from "dotenv";
dotenv.config(); 

export const API_KEY = process.env.WINNIPEG_TRANSIT_API_KEY;
export const PORT = process.env.PORT || 5000;
export const VAPID_PUBLIC_KEY= process.env.VAPID_PUBLIC_KEY;
export const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;