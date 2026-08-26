import express from "express";
import db from "../config/db.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/authorizeRoles.js";
const router = express.Router();

router.get(
    "/",
    authMiddleware,
    authorizeRoles("Admin"),
    (req, resp) => {
        const sql = "SELECT id, name FROM roles ORDER BY id";

        db.query(sql, (err, results) => {
            if (err) {
                console.log("Roles error:", err);
                return resp.status(500).json({
                    message: "Failed to fetch roles"
                });
            }

            resp.status(200).json(results);
        });
    }
);

export default router;