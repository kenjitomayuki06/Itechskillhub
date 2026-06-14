import express from "express";
import cors from "cors";
import userRouter from "./routes/users.js";
import loginRouter from "./routes/loginRoute.js";
import registerRouter from "./routes/accountRoute.js";
import courseRouter from "./routes/courseRoute.js";
import assignmentRouter from "./routes/assignmentRoute.js";
import rateLimit from 'express-rate-limit';
import adminRouter from "./routes/adminRoutes.js";
import instructorRouter from "./routes/instructorRoute.js";
import certificateRouter from "./routes/certificateRoute.js";
import googleAuthRouter from "./routes/googleAuthRoute.js";
import studentRouter from "./routes/studentRoute.js";
import quizRouter from "./routes/quizRoute.js";
import notificationRouter from "./routes/notificationRoute.js";

const app = express();

// Configure CORS — must be FIRST before all routes
const corsOptions = {
    origin: [
        'http://localhost:5173',
        'http://localhost:5174',
        'https://itechskillshub.me',
        'https://www.itechskillshub.me'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middleware
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View Engine
app.set("view engine", "ejs");

// Configure Login Rate Limiting
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: {
        success: false,
        message: "Too many login attempts from this device. Please try again after 15 minutes."
    }
});

// Routes
app.use("/api", adminRouter);
app.use("/api", instructorRouter);
app.use("/users", userRouter);
app.use("/api/auth", loginRouter);
app.use("/api/auth", googleAuthRouter);
app.use("/api", registerRouter);
app.use("/api/courses", courseRouter);
app.use("/api", assignmentRouter);
app.use("/api", certificateRouter);
app.use("/api", studentRouter);
app.use("/api", quizRouter);
app.use("/api", notificationRouter);

export default app;