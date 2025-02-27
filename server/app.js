import express from "express";
import cors from "cors";
import scheduleRoutes from "./routes/scheduleRoutes.js";

const app = express();

app.use(cors()); // Allow frontend requests
app.use(express.json()); // ✅ Add JSON middleware
app.use(express.urlencoded({ extended: true })); // ✅ Add URL-encoded middleware (optional)

app.use("/api/schedule", scheduleRoutes);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
