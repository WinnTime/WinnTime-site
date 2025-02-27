import dotenv from "dotenv";
dotenv.config(); 

export const API_KEY = process.env.WINNIPEG_TRANSIT_API_KEY;
export const PORT = process.env.PORT || 5000;