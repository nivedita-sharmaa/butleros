import express from "express";
import db from "../config/db.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/subscribe", authMiddleware, (req, res) => {
    const userId = req.user.id;
    const { subscription } = req.body;

    if (!subscription?.endpoint) {
        return res.status(400).json({ message: "Invalid subscription" });
    }

    const sql = `
        INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth)
        VALUES (?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE user_id = VALUES(user_id)
    `;

    db.query(
        sql,
        [
            userId,
            subscription.endpoint,
            subscription.keys.p256dh,
            subscription.keys.auth,
        ],
        (err) => {
            if (err) {
                console.log("Push subscribe error:", err);
                return res.status(500).json({ message: "Failed to save subscription" });
            }
            res.json({ message: "Subscribed" });
        }
    );
});

export default router;