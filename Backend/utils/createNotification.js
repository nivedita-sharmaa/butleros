// // // import db from "../config/db.js";
// // // // import { getIO } from "../socket.js";
// // // import { getSocketIO } from "../socket.js";

// // // const createNotification = ({
// // //     userId,
// // //     taskId,
// // //     type,
// // //     title,
// // //     message
// // // }) => {

// // //     return new Promise((resolve, reject) => {

// // //         const sql = `
// // //             INSERT INTO notifications (
// // //                 user_id,
// // //                 task_id,
// // //                 type,
// // //                 title,
// // //                 message
// // //             )
// // //             VALUES (?, ?, ?, ?, ?)
// // //         `;

// // //         db.query(
// // //             sql,
// // //             [
// // //                 userId,
// // //                 taskId || null,
// // //                 type,
// // //                 title,
// // //                 message
// // //             ],
// // //             (err, result) => {

// // //                 if (err) {

// // //                     console.log(
// // //                         "Create notification error:",
// // //                         err
// // //                     );

// // //                     reject(err);

// // //                     return;
// // //                 }


// // //                 // ==========================================
// // //                 // SEND REAL-TIME NOTIFICATION
// // //                 // ==========================================

// // //              try {

// // //     const io = getSocketIO();

// // //     io.to(`user_${userId}`).emit(
// // //         "new_notification",
// // //         {
// // //             id: result.insertId,
// // //             user_id: userId,
// // //             task_id: taskId || null,
// // //             type,
// // //             title,
// // //             message,
// // //             is_read: false
// // //         }
// // //     );

// // //     console.log(
// // //         `Notification sent to user_${userId}`
// // //     );

// // // } catch (socketError) {

// // //     console.log(
// // //         "Socket notification error:",
// // //         socketError
// // //     );

// // // }


// // //                 resolve(result);

// // //             }
// // //         );

// // //     });

// // // };


// // // export default createNotification;


// // import db from "../config/db.js";
// // import { getSocketIO } from "../socket.js";

// // const createNotification = ({
// //     userId,
// //     taskId,
// //     type,
// //     title,
// //     message,
// // }) => {

// //     return new Promise((resolve, reject) => {

// //         const sql = `
// //             INSERT INTO notifications (
// //                 user_id,
// //                 task_id,
// //                 type,
// //                 title,
// //                 message
// //             )
// //             VALUES (?, ?, ?, ?, ?)
// //         `;

// //         db.query(
// //             sql,
// //             [
// //                 userId,
// //                 taskId || null,
// //                 type,
// //                 title,
// //                 message,
// //             ],
// //             (err, result) => {

// //                 if (err) {

// //                     console.error(
// //                         "Create notification error:",
// //                         err
// //                     );

// //                     reject(err);
// //                     return;
// //                 }


// //                 // ==========================================
// //                 // NOTIFICATION WAS SUCCESSFULLY SAVED
// //                 // ==========================================

// //                 const notification = {
// //                     id: result.insertId,
// //                     user_id: Number(userId),
// //                     task_id: taskId
// //                         ? Number(taskId)
// //                         : null,
// //                     type,
// //                     title,
// //                     message,
// //                     is_read: 0,
// //                     read_at: null,
// //                     created_at: new Date(),
// //                 };


// //                 // ==========================================
// //                 // SEND REAL-TIME NOTIFICATION
// //                 // ==========================================

// //                 try {

// //                     const io = getSocketIO();

// //                     if (!io) {

// //                         console.warn(
// //                             "Socket.IO unavailable. Notification saved in database only."
// //                         );

// //                     } else {

// //                         const room =
// //                             `user_${Number(userId)}`;

// //                         io.to(room).emit(
// //                             "new_notification",
// //                             notification
// //                         );

// //                         console.log(
// //                             `Real-time notification sent to ${room}`
// //                         );
// //                     }

// //                 } catch (socketError) {

// //                     // Socket failure MUST NOT
// //                     // break notification creation.

// //                     console.error(
// //                         "Socket notification error:",
// //                         socketError
// //                     );
// //                 }


// //                 resolve(result);
// //             }
// //         );
// //     });
// // };

// // export default createNotification;

// import db from "../config/db.js";
// import { getSocketIO } from "../socket.js";
// import { sendPushToUser } from "./sendPush.js"; // adjust path to match where sendPush.js actually lives
// const createNotification = ({
//     userId,
//     taskId,
//     type,
//     title,
//     message,
// }) => {

//     return new Promise((resolve, reject) => {

//         const sql = `
//             INSERT INTO notifications (
//                 user_id,
//                 task_id,
//                 type,
//                 title,
//                 message
//             )
//             VALUES (?, ?, ?, ?, ?)
//         `;

//         db.query(
//             sql,
//             [
//                 userId,
//                 taskId || null,
//                 type,
//                 title,
//                 message,
//             ],
//             (err, result) => {

//                 if (err) {

//                     console.error(
//                         "Create notification error:",
//                         err
//                     );

//                     reject(err);
//                     return;
//                 }


//                 // ==========================================
//                 // NOTIFICATION WAS SUCCESSFULLY SAVED
//                 // ==========================================

//                 const notification = {
//                     id: result.insertId,
//                     user_id: Number(userId),
//                     task_id: taskId
//                         ? Number(taskId)
//                         : null,
//                     type,
//                     title,
//                     message,
//                     is_read: 0,
//                     read_at: null,
//                     created_at: new Date(),
//                 };


//                 // ==========================================
//                 // SEND REAL-TIME NOTIFICATION
//                 // ==========================================

//                 try {

//                     const io = getSocketIO();

//                     if (!io) {

//                         console.warn(
//                             "Socket.IO unavailable. Notification saved in database only."
//                         );

//                     } else {

//                         const room =
//                             `user_${Number(userId)}`;

//                         io.to(room).emit(
//                             "new_notification",
//                             notification
//                         );

//                         console.log(
//                             `Real-time notification sent to ${room}`
//                         );
//                     }

//                 } catch (socketError) {

//                     // Socket failure MUST NOT
//                     // break notification creation.

//                     console.error(
//                         "Socket notification error:",
//                         socketError
//                     );
//                 }

//                                 // ==========================================
//                 // SEND REAL-TIME NOTIFICATION
//                 // ==========================================

//                 try {

//                     const io = getSocketIO();

//                     if (!io) {

//                         console.warn(
//                             "Socket.IO unavailable. Notification saved in database only."
//                         );

//                     } else {

//                         const room =
//                             `user_${Number(userId)}`;

//                         io.to(room).emit(
//                             "new_notification",
//                             notification
//                         );

//                         console.log(
//                             `Real-time notification sent to ${room}`
//                         );
//                     }

//                 } catch (socketError) {

//                     console.error(
//                         "Socket notification error:",
//                         socketError
//                     );
//                 }


//                 // ==========================================
//                 // SEND BACKGROUND PUSH NOTIFICATION
//                 // (works even if the app is closed)
//                 // ==========================================

//                 try {

//                     sendPushToUser(Number(userId), {
//                         title: title,
//                         body: message,
//                         tag: `notification-${notification.id}`,
//                         url: taskId
//                             ? `/tasks/${taskId}`
//                             : "/notifications",
//                     });

//                 } catch (pushError) {

//                     console.error(
//                         "Push notification error:",
//                         pushError
//                     );
//                 }


                


//                 resolve(result);
//             }
//         );
//     });
// };

// export default createNotification;

import db from "../config/db.js";
import { getSocketIO } from "../socket.js";
import { sendPushToUser } from "./sendPush.js";

const createNotification = ({
    userId,
    taskId,
    type,
    title,
    message,
}) => {

    return new Promise((resolve, reject) => {

        const sql = `
            INSERT INTO notifications (
                user_id,
                task_id,
                type,
                title,
                message
            )
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(
            sql,
            [userId, taskId || null, type, title, message],
            (err, result) => {

                if (err) {
                    console.error("Create notification error:", err);
                    reject(err);
                    return;
                }

                const notification = {
                    id: result.insertId,
                    user_id: Number(userId),
                    task_id: taskId ? Number(taskId) : null,
                    type,
                    title,
                    message,
                    is_read: 0,
                    read_at: null,
                    created_at: new Date(),
                };

                // ==========================================
                // SEND REAL-TIME NOTIFICATION
                // ==========================================

                try {

                    const io = getSocketIO();

                    if (!io) {
                        console.warn("Socket.IO unavailable. Notification saved in database only.");
                    } else {
                        const room = `user_${Number(userId)}`;
                        io.to(room).emit("new_notification", notification);
                        console.log(`Real-time notification sent to ${room}`);
                    }

                } catch (socketError) {
                    console.error("Socket notification error:", socketError);
                }

                // ==========================================
                // SEND BACKGROUND PUSH NOTIFICATION
                // (works even if the app is closed)
                // ==========================================

                try {

                    sendPushToUser(Number(userId), {
                        title: title,
                        body: message,
                        tag: `notification-${notification.id}`,
                        url: taskId ? `/tasks/${taskId}` : "/notifications",
                    });

                } catch (pushError) {
                    console.error("Push notification error:", pushError);
                }

                resolve(result);
            }
        );
    });
};

export default createNotification;