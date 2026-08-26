import express from "express";
import db from "../config/db.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();


// ==========================================
// GET MY NOTIFICATIONS
// ==========================================

router.get(
    "/",
    authMiddleware,
    (req, res) => {

        const userId = req.user.id;

        const sql = `
            SELECT
                notifications.id,
                notifications.user_id,
                notifications.task_id,
                notifications.type,
                notifications.title,
                notifications.message,
                notifications.is_read,
                notifications.read_at,
                notifications.created_at,

                tasks.title AS task_title

            FROM notifications

            LEFT JOIN tasks
                ON notifications.task_id = tasks.id

            WHERE notifications.user_id = ?

            ORDER BY notifications.created_at DESC
        `;

        db.query(sql, [userId], (err, result) => {

            if (err) {

                console.log(
                    "Get notifications error:",
                    err
                );

                return res.status(500).json({
                    message: "Failed to fetch notifications"
                });
            }

            res.json(result);
        });
    }
);


// ==========================================
// MARK ONE NOTIFICATION AS READ
// ==========================================

router.put(
    "/:id/read",
    authMiddleware,
    (req, res) => {

        const notificationId = req.params.id;
        const userId = req.user.id;

        const sql = `
            UPDATE notifications

            SET
                is_read = TRUE,
                read_at = CURRENT_TIMESTAMP

            WHERE id = ?
            AND user_id = ?
        `;

        db.query(
            sql,
            [notificationId, userId],
            (err, result) => {

                if (err) {

                    console.log(
                        "Mark notification read error:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Failed to mark notification as read"
                    });
                }

                if (result.affectedRows === 0) {

                    return res.status(404).json({
                        message:
                            "Notification not found"
                    });
                }

                res.json({
                    message:
                        "Notification marked as read"
                });
            }
        );
    }
);


// ==========================================
// MARK ALL MY NOTIFICATIONS AS READ
// ==========================================

router.put(
    "/read-all",
    authMiddleware,
    (req, res) => {

        const userId = req.user.id;

        const sql = `
            UPDATE notifications

            SET
                is_read = TRUE,
                read_at = CURRENT_TIMESTAMP

            WHERE user_id = ?
            AND is_read = FALSE
        `;

        db.query(
            sql,
            [userId],
            (err, result) => {

                if (err) {

                    console.log(
                        "Mark all notifications read error:",
                        err
                    );

                    return res.status(500).json({
                        message:
                            "Failed to mark notifications as read"
                    });
                }

                res.json({
                    message:
                        "All notifications marked as read"
                });
            }
        );
    }
);




export default router;