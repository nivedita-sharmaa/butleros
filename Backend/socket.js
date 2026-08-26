// // import { Server } from "socket.io";

// // let io;

// // export function initSocket(server) {

// //     io = new Server(server, {
// //         cors: {
// //             origin: "http://localhost:5173",
// //             methods: ["GET", "POST"]
// //         }
// //     });

// //     io.on("connection", (socket) => {

// //         console.log(
// //             "Socket connected:",
// //             socket.id
// //         );

// //         socket.on("join", (userId) => {

// //             const room = `user_${userId}`;

// //             socket.join(room);

// //             console.log(
// //                 `User ${userId} joined room ${room}`
// //             );
// //         });

// //         socket.on("disconnect", () => {

// //             console.log(
// //                 "Socket disconnected:",
// //                 socket.id
// //             );
// //         });

// //     });

// //     return io;
// // }

// // export function getSocketIO() {
// //     return io;
// // }

// import { Server } from "socket.io";

// let io = null;

// export function initSocket(server) {
//     io = new Server(server, {
//         cors: {
//             origin: "http://localhost:5173",
//             methods: ["GET", "POST"],
//         },

//         // Helps Socket.IO recover from short connection interruptions.
//         connectionStateRecovery: {
//             maxDisconnectionDuration: 2 * 60 * 1000,
//             skipMiddlewares: true,
//         },
//     });

//     io.on("connection", (socket) => {
//         console.log("Socket connected:", socket.id);

//         socket.on("join", (userId) => {
//             if (!userId) {
//                 console.log(
//                     `Socket ${socket.id} tried to join without userId`
//                 );
//                 return;
//             }

//             const room = `user_${Number(userId)}`;

//             socket.join(room);

//             console.log(
//                 `Socket ${socket.id} joined room ${room}`
//             );
//         });

//         socket.on("disconnect", (reason) => {
//             console.log(
//                 `Socket disconnected: ${socket.id}. Reason: ${reason}`
//             );
//         });
//     });

//     return io;
// }

// export function getSocketIO() {
//     if (!io) {
//         console.warn(
//             "Socket.IO is not initialized yet."
//         );
//     }

//     return io;
// }

// import { Server } from "socket.io";

// let io = null;

// export function initSocket(server) {
//     io = new Server(server, {
//         cors: {
//             origin: "http://localhost:5173",
//             methods: ["GET", "POST"],
//         },

//         // Helps Socket.IO recover from short connection interruptions.
//         connectionStateRecovery: {
//             maxDisconnectionDuration: 2 * 60 * 1000,
//             skipMiddlewares: true,
//         },
//     });

//     io.on("connection", (socket) => {
//         console.log("Socket connected:", socket.id);

//         socket.on("join", (userId) => {
//             if (!userId) {
//                 console.log(
//                     `Socket ${socket.id} tried to join without userId`
//                 );
//                 return;
//             }

//             const room = `user_${Number(userId)}`;

//             socket.join(room);

//             console.log(
//                 `Socket ${socket.id} joined room ${room}`
//             );
//         });

//         socket.on("disconnect", (reason) => {
//             console.log(
//                 `Socket disconnected: ${socket.id}. Reason: ${reason}`
//             );
//         });
//     });

//     return io;
// }

// export function getSocketIO() {
//     if (!io) {
//         console.warn(
//             "Socket.IO is not initialized yet."
//         );
//     }

//     return io;
// }

import { Server } from "socket.io";
import { sendPushToRole } from "./utils/sendPush.js";


let io = null;
let activeCall = null;

// let activeCall = null; // add this near the top, alongside `let io = null;`

// // inside call_butler handler, after building callData:
// activeCall = callData;

// // inside stop_call and respond_call handlers, after emitting:
// activeCall = null;

export function initSocket(server) {
    io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"],
        },
        connectionStateRecovery: {
            maxDisconnectionDuration: 2 * 60 * 1000,
            skipMiddlewares: true,
        },
    });

    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        // ==========================================
        // JOIN ROOMS (user room + role room)
        // ==========================================
        // socket.on("join", (payload) => {
        //     // Supports both the old plain-number format and the new { userId, role } format
        //     const userId = typeof payload === "object" ? payload.userId : payload;
        //     const role = typeof payload === "object" ? payload.role : null;

        //     if (!userId) {
        //         console.log(`Socket ${socket.id} tried to join without userId`);
        //         return;
        //     }

        //     const userRoom = `user_${Number(userId)}`;
        //     socket.join(userRoom);
        //     console.log(`Socket ${socket.id} joined room ${userRoom}`);

        //     if (role === "Butler") {
        //         socket.join("role_Butler");
        //         console.log(`Socket ${socket.id} joined room role_Butler`);
        //     }
        // });

        // backend socket.js — inside io.on("connection", ...)
socket.on("join", (payload) => {
    const userId = typeof payload === "object" ? payload.userId : payload;
    const role = typeof payload === "object" ? payload.role : null;

    if (!userId) return;

    const userRoom = `user_${Number(userId)}`;
    socket.join(userRoom);

    if (role) {
        socket.join(`role_${role}`); // role_Butler, role_Admin, role_Manager, role_Employee
    }
});

        // ==========================================
        // QUICK CALL — Admin/Manager/Employee buzzes every Butler
        // ==========================================
        // socket.on("call_butler", (payload) => {
        //     const callId = `call_${Date.now()}_${socket.id}`;

        //     const callData = {
        //         callId,
        //         callerId: payload?.callerId,
        //         callerName: payload?.callerName || "Someone",
        //         startedAt: new Date().toISOString(),
        //     };

        //     console.log("Incoming call triggered:", callData);

        //     io.to("role_Butler").emit("incoming_call", callData);
        // });
//         socket.on("call_butler", (payload) => {
//     const callId = `call_${Date.now()}_${socket.id}`;

//     const callData = {
//         callId,
//         callerId: payload?.callerId,
//         callerName: payload?.callerName || "Someone",
//         startedAt: new Date().toISOString(),
//     };

//     console.log("Incoming call triggered:", callData);

//     // Send call to all Butlers
//     io.to("role_Butler").emit("incoming_call", callData);

//       sendPushToRole("Butler", {
//         title: "Quick Call",
//         body: `${callData.callerName} needs assistance`,
//         tag: "quick-call",
//         requireInteraction: true,
//         url: "/dashboard",
//     });

//     // Tell the original caller which call ID was created
//     if (payload?.callerId) {
//         io.to(`user_${Number(payload.callerId)}`).emit(
//             "call_started",
//             {
//                 callId,
//             }
//         );
//     }
// });

socket.on("call_butler", (payload) => {
    const callId = `call_${Date.now()}_${socket.id}`;

    const callData = {
        callId,
        callerId: payload?.callerId,
        callerName: payload?.callerName || "Someone",
        startedAt: new Date().toISOString(),
    };

    activeCall = callData; // 👈 ADD THIS
console.log("activeCall is now set to:", activeCall);

    console.log("Incoming call triggered:", callData);

    io.to("role_Butler").emit("incoming_call", callData);

    if (payload?.callerId) {
        io.to(`user_${Number(payload.callerId)}`).emit("call_started", { callId });
    }

    sendPushToRole("Butler", {
        title: "Quick Call",
        body: `${callData.callerName} needs assistance`,
        tag: "quick-call",
        requireInteraction: true,
        url: "/dashboard",
    });
});

        // ==========================================
        // BUTLER STOPS THE BUZZER
        // ==========================================
        // socket.on("stop_call", (payload) => {
        //     const endedData = {
        //         callId: payload?.callId,
        //         stoppedBy: payload?.stoppedBy || "A butler",
        //         endedAt: new Date().toISOString(),
        //     };

        //     console.log("Call stopped:", endedData);

        //     // Stop ringing on every other Butler's device too
        //     io.to("role_Butler").emit("call_ended", endedData);

        //     // Tell the original caller it was picked up
        //     if (payload?.callerId) {
        //         io.to(`user_${Number(payload.callerId)}`).emit("call_ended", endedData);
        //     }
        // });

//         socket.on("stop_call", (payload) => {
//     const endedData = {
//         callId: payload?.callId,
//         callerId: payload?.callerId,
//         stoppedBy: payload?.stoppedBy || "A butler",
//         endedBy: payload?.endedBy || "butler",
//         endedAt: new Date().toISOString(),
//     };

//     console.log("Call stopped:", endedData);

//     // Stop ringing on ALL Butler devices
//     io.to("role_Butler").emit("call_ended", endedData);

//     // Tell the original caller
//     if (payload?.callerId) {
//         io.to(`user_${Number(payload.callerId)}`).emit(
//             "call_ended",
//             endedData
//         );
//     }
// });

socket.on("stop_call", (payload) => {
    const endedData = {
        callId: payload?.callId,
        callerId: payload?.callerId,
        stoppedBy: payload?.stoppedBy || "A butler",
        endedBy: payload?.endedBy || "butler",
        endedAt: new Date().toISOString(),
    };

    activeCall = null; 

    console.log("Call stopped:", endedData);

    io.to("role_Butler").emit("call_ended", endedData);

    if (payload?.callerId) {
        io.to(`user_${Number(payload.callerId)}`).emit("call_ended", endedData);
    }
});

// ==========================================
// BUTLER ACCEPTS OR REJECTS THE CALL
// ==========================================
socket.on("respond_call", (payload) => {
    const responseData = {
        callId: payload?.callId,
        accepted: !!payload?.accepted,
        respondedBy: payload?.respondedBy || "A butler",
        respondedAt: new Date().toISOString(),
    };

    activeCall = null;

    console.log("Call responded:", responseData);

    // Stop ringing on every Butler's device (same as stop_call)
    io.to("role_Butler").emit("call_ended", {
        callId: responseData.callId,
        stoppedBy: responseData.respondedBy,
        endedBy: "butler",
    });

    // Tell the caller specifically whether it was accepted or rejected
    if (payload?.callerId) {
        io.to(`user_${Number(payload.callerId)}`).emit(
            "call_responded",
            responseData
        );
    }
});
        socket.on("disconnect", (reason) => {
            console.log(`Socket disconnected: ${socket.id}. Reason: ${reason}`);
        });
    });

    return io;
}

export function getSocketIO() {
    if (!io) {
        console.warn("Socket.IO is not initialized yet.");
    }
    return io;
}

export function getActiveCall() {
    return activeCall;
}

