import express from "express";
import userRouter from "./routes/users.js";
import loginRouter from "./routes/loginRoute.js";
import cors from "cors";
import registerRouter from "./routes/accountRoute.js";
import courseRouter from "./routes/courseRoute.js";
import assignmentRouter from "./routes/assignmentRoute.js";



const app = express();

// Middleware

    app.use(cors());
    app.use(express.static("public"));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());

    // View Engine
    app.set("view engine", "ejs");

    // Routes
    app.use("/users", userRouter);
    app.use("/api/auth", loginRouter);
    app.use("/api", registerRouter);
    app.use("/api/courses", courseRouter);
    app.use("/api", assignmentRouter);



export default app;