import webpush from "web-push";
import db from "../config/db.js";

webpush.setVapidDetails(
    process.env.VAPID_SUBJECT,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

export function sendPushToRole(role, payload) {
    console.log(`Attempting to send push to role: ${role}`);

    const sql = `
        SELECT push_subscriptions.endpoint, push_subscriptions.p256dh, push_subscriptions.auth
        FROM push_subscriptions
        JOIN users ON users.id = push_subscriptions.user_id
        JOIN roles ON users.role_id = roles.id
        WHERE roles.name = ?
    `;

    db.query(sql, [role], (err, rows) => {
        if (err) {
            console.log("Push lookup error:", err);
            return;
        }

        console.log(`Found ${rows.length} push subscription(s) for role ${role}`);

        rows.forEach((row) => {
            const subscription = {
                endpoint: row.endpoint,
                keys: { p256dh: row.p256dh, auth: row.auth },
            };

            webpush
                .sendNotification(subscription, JSON.stringify(payload))
                .then(() => console.log("Push sent successfully to:", row.endpoint.slice(0, 50)))
                .catch((err) => console.log("Push send FAILED:", err.statusCode, err.message));
        });
    });
}

export function sendPushToUser(userId, payload) {
    const sql = `
        SELECT endpoint, p256dh, auth
        FROM push_subscriptions
        WHERE user_id = ?
    `;

    db.query(sql, [userId], (err, rows) => {
        if (err) {
            console.log("Push lookup error (sendPushToUser):", err);
            return;
        }

        console.log(`Found ${rows.length} push subscription(s) for user ${userId}`);

        rows.forEach((row) => {
            const subscription = {
                endpoint: row.endpoint,
                keys: { p256dh: row.p256dh, auth: row.auth },
            };

            webpush.sendNotification(subscription, JSON.stringify(payload)).catch((err) => {
                console.log("Push send FAILED:", err.statusCode, err.message);

                // Clean up dead subscriptions so we stop retrying forever
                if (err.statusCode === 410 || err.statusCode === 404) {
                    db.query(`DELETE FROM push_subscriptions WHERE endpoint = ?`, [row.endpoint]);
                    console.log("Removed stale subscription:", row.endpoint.slice(0, 50));
                }
            });
        });
    });
}