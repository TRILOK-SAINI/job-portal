import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from "./config/db.js";

import authRoute from "./routes/authRoute.js";
import candidateRoute from "./routes/candidateRoute.js";
import jobRoute from "./routes/jobRoute.js";
import companyRoute from "./routes/companyRoute.js";
import applicationRoutes from "./routes/applicationRoute.js";

const app = express();
connectDB();
app.use(express.json());
app.use(cookieParser());


app.use(
  cors({
    origin: function (origin, callback) {
      const allowed = [
        process.env.CLIENT_URL,
        "capacitor://localhost",
        "http://localhost",
        "https://localhost",
        "http://localhost:5173",
        "http://localhost:5174",
        "https://localhost:5173",
        "https://localhost:5174",
        "http://10.0.2.2",
      ];
      // Allow requests with no origin (native Android WebView sends null/no origin)
      if (!origin || allowed.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  }),
);

app.use("/api/auth", authRoute);
app.use("/api/candidate", candidateRoute);
app.use("/api/jobs", jobRoute);
app.use("/api/company", companyRoute);
app.use("/api/applications", applicationRoutes);


app.listen(process.env.PORT || 5000, () => {    
    console.log('Server is running on port 5000');
});