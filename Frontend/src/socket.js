// // import { io } from "socket.io-client";

// // const socket = io("http://localhost:5000", {
// //     transports: ["websocket", "polling"]
// // });

// // socket.on("connect", () => {

// //     console.log(
// //         "Socket connected:",
// //         socket.id
// //     );

// // });

// // socket.on("disconnect", () => {

// //     console.log(
// //         "Socket disconnected"
// //     );

// // });

// // export default socket;


// import { io } from "socket.io-client";

// const socket = io("http://localhost:5000", {
//     transports: ["websocket", "polling"],

//     autoConnect: true,

//     reconnection: true,
//     reconnectionAttempts: Infinity,
//     reconnectionDelay: 1000,
//     reconnectionDelayMax: 5000,

//     timeout: 10000,
// });


// // ==========================================
// // GET CURRENT USER
// // ==========================================

// const getCurrentUserId = () => {
//     try {
//         const user = JSON.parse(
//             localStorage.getItem("user") || "null"
//         );

//         return user?.id || null;
//     } catch (error) {
//         console.error(
//             "Failed to read logged-in user:",
//             error
//         );

//         return null;
//     }
// };


// // ==========================================
// // JOIN USER ROOM
// // ==========================================

// const joinUserRoom = () => {

//     const userId = getCurrentUserId();

//     if (!userId) {
//         console.log(
//             "Socket connected but no logged-in user found."
//         );
//         return;
//     }

//     console.log(
//         `Joining socket room: user_${userId}`
//     );

//     socket.emit("join", Number(userId));
// };


// // ==========================================
// // CONNECTION
// // ==========================================

// socket.on("connect", () => {

//     console.log(
//         "Socket connected:",
//         socket.id
//     );

//     // IMPORTANT:
//     // Join room every time socket connects.
//     // This also handles reconnection.
//     joinUserRoom();
// });


// // ==========================================
// // RECONNECTING
// // ==========================================

// socket.io.on("reconnect_attempt", (attempt) => {

//     console.log(
//         `Socket reconnect attempt: ${attempt}`
//     );
// });


// // ==========================================
// // RECONNECTED
// // ==========================================

// socket.io.on("reconnect", (attempt) => {

//     console.log(
//         `Socket reconnected after ${attempt} attempt(s)`
//     );

//     // Join room again after reconnection.
//     joinUserRoom();
// });


// // ==========================================
// // CONNECTION ERROR
// // ==========================================

// socket.on("connect_error", (error) => {

//     console.error(
//         "Socket connection error:",
//         error.message
//     );
// });


// // ==========================================
// // DISCONNECT
// // ==========================================

// socket.on("disconnect", (reason) => {

//     console.log(
//         "Socket disconnected:",
//         reason
//     );
// });


// export default socket;

import { io } from "socket.io-client";

const socket = io("https://hatbox-scanner-subscribe.ngrok-free.dev", {
    transports: ["websocket", "polling"],

    autoConnect: true,

    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,

    timeout: 10000,
});



const getCurrentUser = () => {
    try {
        return JSON.parse(localStorage.getItem("user") || "null");
    } catch (error) {
        console.error("Failed to read logged-in user:", error);
        return null;
    }
};

const joinUserRoom = () => {
    const user = getCurrentUser();

    if (!user?.id) {
        console.log("Socket connected but no logged-in user found.");
        return;
    }

    console.log(`Joining socket room: user_${user.id} (role: ${user.role})`);

    socket.emit("join", { userId: Number(user.id), role: user.role });
};
// ==========================================
// GET CURRENT USER
// ==========================================

// const getCurrentUserId = () => {
//     try {
//         const user = JSON.parse(
//             localStorage.getItem("user") || "null"
//         );

//         return user?.id || null;
//     } catch (error) {
//         console.error(
//             "Failed to read logged-in user:",
//             error
//         );

//         return null;
//     }
// };


// // ==========================================
// // JOIN USER ROOM
// // ==========================================

// const joinUserRoom = () => {

//     const userId = getCurrentUserId();

//     if (!userId) {
//         console.log(
//             "Socket connected but no logged-in user found."
//         );
//         return;
//     }

//     console.log(
//         `Joining socket room: user_${userId}`
//     );

//     socket.emit("join", Number(userId));
// };


// ==========================================
// CONNECTION
// ==========================================

socket.on("connect", () => {

    console.log(
        "Socket connected:",
        socket.id
    );

    // IMPORTANT:
    // Join room every time socket connects.
    // This also handles reconnection.
    joinUserRoom();
});


// ==========================================
// RECONNECTING
// ==========================================

socket.io.on("reconnect_attempt", (attempt) => {

    console.log(
        `Socket reconnect attempt: ${attempt}`
    );
});


// ==========================================
// RECONNECTED
// ==========================================

socket.io.on("reconnect", (attempt) => {

    console.log(
        `Socket reconnected after ${attempt} attempt(s)`
    );

    // Join room again after reconnection.
    joinUserRoom();
});


// ==========================================
// CONNECTION ERROR
// ==========================================

socket.on("connect_error", (error) => {

    console.error(
        "Socket connection error:",
        error.message
    );
});


// ==========================================
// DISCONNECT
// ==========================================

socket.on("disconnect", (reason) => {

    console.log(
        "Socket disconnected:",
        reason
    );
});


export default socket;