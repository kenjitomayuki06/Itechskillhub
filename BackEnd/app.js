import express from "express";
import userRouter from "./routes/users.js";
import loginRouter from "./routes/loginRoute.js";
import cors from "cors";
import registerRouter from "./routes/accountRoute.js";
import courseRouter from "./routes/courseRoute.js";
import assignmentRouter from "./routes/assignmentRoute.js";
import rateLimit from "express-rate-Limit";
import adminRouter from "./routes/adminRoutes.js";
import certificateRouter from "./routes/certificateRoute.js";


const app = express();

// Configure CORS options to restrict access to our vite frontend
const corsOptions = {
    origin: 'http://localhost:5173',
    method: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 200
};

//Configure Login Rate Limiting
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutes window duration
    max: 5, // Strictly Limit each IP address to 5 login requests per window
    message: {
        success: false,
        message: "Too many login attempts from this device. please try again after 15 minutes."
    }
})



// Middleware

    app.use(cors(corsOptions));
    app.use(express.static("public"));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // View Engine
    app.set("view engine", "ejs");

     //Admin 
    app.use("/api", adminRouter);

    
    // Routes
    app.use("/users", userRouter);
    app.use("/api/auth", loginRouter);
    app.use("/api", registerRouter);
    app.use("/api/courses", courseRouter);
    app.use("/api", assignmentRouter);
    app.use("/api", certificateRouter);

    
   


export default app;