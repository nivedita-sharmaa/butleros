import express from "express";
import cors from "cors";
import http from "http";

import db from "./config/db.js";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import usersRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import dashboardRoutes from "./routes/dashboard.js";
import taskTemplateRoutes from "./routes/taskTemplates.js";
import notificationRoutes from "./routes/notifications.js";
import pushRoutes from "./routes/push.js";
import callsRoutes from "./routes/calls.js";
import authMiddleware from "./middleware/authMiddleware.js";
import authorizeRole from "./middleware/authorizeRoles.js";
import rolesRoutes from "./middleware/rolesRoute.js";
import translateRoutes from "./routes/translate.js";

import { initSocket } from "./socket.js";
import path from "path";



const app = express();


// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
    cors()
);

app.use(express.json());


// ==========================================
// TEST API
// ==========================================

app.get("/api/test", (req, res) => {

    res.json({
        message: "ButlerOS API is working"
    });

});


// ==========================================
// PROTECTED TEST
// ==========================================

app.get(
    "/api/protected",
    authMiddleware,
    (req, res) => {

        res.json({
            message: "You accessed a protected API",
            user: req.user
        });

    }
);


// ==========================================
// ADMIN TEST
// ==========================================

app.get(
    "/api/admin-test",
    authMiddleware,
    authorizeRole("Admin"),
    (req, res) => {

        res.json({
            message: "Welcome Admin",
            user: req.user
        });

    }
);


// ==========================================
// ROUTES
// ==========================================
// const file = path.join(__dirname,"dist");
// const frontendDistPath = path.resolve('../Frontend/dist');
// console.log("frontendDistPath",frontendDistPath)
// app.use(express.static(frontendDistPath));
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname, 'Frontend', 'dist', 'index.html'));
// });

// app.use(express.static(path.join(__dirname, 'Frontend', 'dist')));


app.use("/api/roles", rolesRoutes);

app.use("/api/users", usersRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/tasks", taskRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/push", pushRoutes);

app.use("/api/calls", callsRoutes); 

app.use("/api/translate", translateRoutes);


app.use(
    "/api/task-templates",
    taskTemplateRoutes
);

app.use(
    "/api/notifications",
    notificationRoutes
);

app.use(express.static(path.join(__dirname, '..', 'Frontend', 'dist')));

// 3. The Wildcard Catch-All Route (Crucial for React Routing)
// This matches all routes and sends back the index.html file
app.get('/{*splat}', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'dist', 'index.html'));
});
// ==========================================
// CREATE HTTP SERVER
// ==========================================

const server = http.createServer(app);


// ==========================================
// INITIALIZE SOCKET.IO
// ==========================================

initSocket(server);


// ==========================================
// START SERVER
// ==========================================


server.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});