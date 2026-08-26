// // import { useEffect, useState } from "react";
// // import socket from "../socket";
// // import { BellRing, X, ClipboardList } from "lucide-react";
// // import {
// //   getPrefs,
// //   isHighPriority,
// //   playAlertTone,
// //   showBrowserNotification,
// // } from "../services/notificationPrefs";

// // function NotificationPopup() {
// //   const [notification, setNotification] = useState(null);

// //   useEffect(() => {
// //     const user = JSON.parse(localStorage.getItem("user") || "null");
// //     const userId = user?.id;

// //     if (!userId) {
// //       console.log("No logged-in user for global notifications");
// //       return;
// //     }

// //     console.log("Global notification listener for user:", userId);

// //     // IMPORTANT:
// //     // Join the user's private Socket.IO room
// //     socket.emit("join", userId);

// //     console.log("Global notification room joined:", `user_${userId}`);

// //     const handleNewNotification = (newNotification) => {
// //       console.log("GLOBAL NEW NOTIFICATION:", newNotification);

// //       const prefs = getPrefs();

// //       // Master switch: if the user turned off "New task alerts", don't
// //       // alert at all (the notification is still saved server-side and will
// //       // show up in the inbox — this only controls the live pop-up/tone).
// //       if (!prefs.newTaskAlerts) {
// //         return;
// //       }

// //       // "High priority only": skip alerting for anything that doesn't look
// //       // high priority / urgent.
// //       if (prefs.highPriorityOnly && !isHighPriority(newNotification)) {
// //         return;
// //       }

// //       if (prefs.alertTone) {
// //         playAlertTone();
// //       }

// //       if (prefs.browserNotifications) {
// //         showBrowserNotification(newNotification);
// //       }

// //       setNotification(newNotification);

// //       // Remove popup after 5 seconds
// //       setTimeout(() => {
// //         setNotification(null);
// //       }, 2000);
// //     };

// //     socket.on("new_notification", handleNewNotification);

// //     return () => {
// //       socket.off("new_notification", handleNewNotification);
// //     };
// //   }, []);

// //   if (!notification) {
// //     return null;
// //   }

// //   return (
// //     <div className="fixed top-6 right-6 z-[9999] w-96">
// //       <style>{`
// //         @keyframes toastIn {
// //           from { opacity: 0; transform: translateY(-12px) scale(0.98); }
// //           to { opacity: 1; transform: translateY(0) scale(1); }
// //         }
// //         .toast-in { animation: toastIn 0.35s cubic-bezier(.16,1,.3,1) both; }
// //       `}</style>

// //       <div className="toast-in bg-white rounded-2xl shadow-2xl border border-violet-100 p-5">
// //         <div className="flex items-start gap-4">
// //           <span className="w-11 h-11 rounded-xl bg-orange-100 text-orange-600 grid place-items-center shrink-0">
// //             <BellRing className="w-5 h-5" />
// //           </span>

// //           <div className="flex-1 min-w-0">
// //             <h3 className="font-bold text-ink">{notification.title}</h3>
// //             <p className="text-slate-500 text-sm mt-1">{notification.message}</p>

// //             {notification.task_title && (
// //               <p className="text-violet-600 font-semibold text-sm mt-2 flex items-center gap-1.5">
// //                 <ClipboardList className="w-3.5 h-3.5" />
// //                 {notification.task_title}
// //               </p>
// //             )}

// //             <p className="text-slate-400 text-xs mt-3">Just now</p>
// //           </div>

// //           <button
// //             onClick={() => setNotification(null)}
// //             className="text-slate-400 hover:text-slate-700 transition-colors shrink-0"
// //           >
// //             <X className="w-4 h-4" />
// //           </button>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default NotificationPopup;

// // import { useEffect, useState } from "react";
// // import socket from "../socket";
// // import {
// //     BellRing,
// //     X,
// //     ClipboardList,
// // } from "lucide-react";

// // import {
// //     getPrefs,
// //     isHighPriority,
// //     playAlertTone,
// //     showBrowserNotification,
// // } from "../services/notificationPrefs";


// // function NotificationPopup() {

// //     const [notification, setNotification] =
// //         useState(null);


// //     useEffect(() => {

// //         console.log(
// //             "NotificationPopup socket listener mounted"
// //         );


// //         // ==========================================
// //         // NEW NOTIFICATION
// //         // ==========================================

// //         const handleNewNotification =
// //             (newNotification) => {

// //                 console.log(
// //                     "GLOBAL NEW NOTIFICATION:",
// //                     newNotification
// //                 );


// //                 const prefs = getPrefs();


// //                 // ======================================
// //                 // PREFERENCES
// //                 // ======================================

// //                 if (!prefs.newTaskAlerts) {
// //                     console.log(
// //                         "New task alerts disabled."
// //                     );

// //                     return;
// //                 }


// //                 if (
// //                     prefs.highPriorityOnly &&
// //                     !isHighPriority(newNotification)
// //                 ) {

// //                     console.log(
// //                         "Notification ignored because it is not high priority."
// //                     );

// //                     return;
// //                 }


// //                 // ======================================
// //                 // ALERT TONE
// //                 // ======================================

// //                 if (prefs.alertTone) {
// //                     playAlertTone();
// //                 }


// //                 // ======================================
// //                 // BROWSER NOTIFICATION
// //                 // ======================================

// //                 if (prefs.browserNotifications) {

// //                     showBrowserNotification(
// //                         newNotification
// //                     );
// //                 }


// //                 // ======================================
// //                 // SHOW POPUP
// //                 // ======================================

// //                 setNotification(
// //                     newNotification
// //                 );


// //                 // Clear existing popup timer
// //                 // before creating a new one.

// //                 setTimeout(() => {

// //                     setNotification(
// //                         (current) => {

// //                             if (
// //                                 current?.id ===
// //                                 newNotification.id
// //                             ) {
// //                                 return null;
// //                             }

// //                             return current;
// //                         }
// //                     );

// //                 }, 5000);
// //             };


// //         // ==========================================
// //         // LISTEN
// //         // ==========================================

// //         socket.on(
// //             "new_notification",
// //             handleNewNotification
// //         );


// //         // ==========================================
// //         // CLEANUP
// //         // ==========================================

// //         return () => {

// //             console.log(
// //                 "NotificationPopup socket listener removed"
// //             );

// //             socket.off(
// //                 "new_notification",
// //                 handleNewNotification
// //             );
// //         };

// //     }, []);


// //     if (!notification) {
// //         return null;
// //     }


// //     return (
// //         <div className="fixed top-6 right-6 z-[9999] w-96">

// //             <style>{`
// //                 @keyframes toastIn {
// //                     from {
// //                         opacity: 0;
// //                         transform:
// //                             translateY(-12px)
// //                             scale(0.98);
// //                     }

// //                     to {
// //                         opacity: 1;
// //                         transform:
// //                             translateY(0)
// //                             scale(1);
// //                     }
// //                 }

// //                 .toast-in {
// //                     animation:
// //                         toastIn
// //                         0.35s
// //                         cubic-bezier(.16,1,.3,1)
// //                         both;
// //                 }
// //             `}</style>


// //             <div
// //                 className="
// //                     toast-in
// //                     bg-white
// //                     rounded-2xl
// //                     shadow-2xl
// //                     border
// //                     border-violet-100
// //                     p-5
// //                 "
// //             >

// //                 <div className="flex items-start gap-4">

// //                     <span
// //                         className="
// //                             w-11
// //                             h-11
// //                             rounded-xl
// //                             bg-orange-100
// //                             text-orange-600
// //                             grid
// //                             place-items-center
// //                             shrink-0
// //                         "
// //                     >
// //                         <BellRing
// //                             className="w-5 h-5"
// //                         />
// //                     </span>


// //                     <div
// //                         className="
// //                             flex-1
// //                             min-w-0
// //                         "
// //                     >

// //                         <h3
// //                             className="
// //                                 font-bold
// //                                 text-ink
// //                             "
// //                         >
// //                             {notification.title}
// //                         </h3>


// //                         <p
// //                             className="
// //                                 text-slate-500
// //                                 text-sm
// //                                 mt-1
// //                             "
// //                         >
// //                             {notification.message}
// //                         </p>


// //                         {notification.task_title && (

// //                             <p
// //                                 className="
// //                                     text-violet-600
// //                                     font-semibold
// //                                     text-sm
// //                                     mt-2
// //                                     flex
// //                                     items-center
// //                                     gap-1.5
// //                                 "
// //                             >
// //                                 <ClipboardList
// //                                     className="w-3.5 h-3.5"
// //                                 />

// //                                 {notification.task_title}
// //                             </p>
// //                         )}


// //                         <p
// //                             className="
// //                                 text-slate-400
// //                                 text-xs
// //                                 mt-3
// //                             "
// //                         >
// //                             Just now
// //                         </p>

// //                     </div>


// //                     <button
// //                         onClick={() =>
// //                             setNotification(null)
// //                         }
// //                         className="
// //                             text-slate-400
// //                             hover:text-slate-700
// //                             transition-colors
// //                             shrink-0
// //                         "
// //                     >
// //                         <X className="w-4 h-4" />
// //                     </button>

// //                 </div>

// //             </div>

// //         </div>
// //     );
// // }


// // export default NotificationPopup;


// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import socket from "../socket";

// import {
//     BellRing,
//     X,
//     ClipboardList,
// } from "lucide-react";

// import {
//     getPrefs,
//     isHighPriority,
//     playAlertTone,
//     showBrowserNotification,
// } from "../services/notificationPrefs";

// const API_URL = import.meta.env.VITE_API_URL;


// function NotificationPopup() {

//     const [notification, setNotification] = useState(null);

//     const navigate = useNavigate();


//     // ==========================================
//     // GET LOGGED-IN USER
//     // ==========================================

//     const user = JSON.parse(
//         localStorage.getItem("user") || "null"
//     );

//     const userId = user?.id;


//     // ==========================================
//     // NEW NOTIFICATION
//     // ==========================================

//     useEffect(() => {

//         console.log(
//             "NotificationPopup socket listener mounted"
//         );


//         const handleNewNotification =
//             (newNotification) => {

//                 console.log(
//                     "GLOBAL NEW NOTIFICATION:",
//                     newNotification
//                 );


//                 // ======================================
//                 // PREFERENCES
//                 // ======================================

//                 const prefs = getPrefs(userId);


//                 if (!prefs.newTaskAlerts) {

//                     console.log(
//                         "New task alerts disabled."
//                     );

//                     return;
//                 }


//                 if (
//                     prefs.highPriorityOnly &&
//                     !isHighPriority(newNotification)
//                 ) {

//                     console.log(
//                         "Notification ignored because it is not high priority."
//                     );

//                     return;
//                 }


//                 // ======================================
//                 // ALERT TONE
//                 // ======================================

//                 // if (prefs.alertTone) {

//                 //     playAlertTone();

//                 // }

//                 // ======================================
// // ALERT TONE
// // ======================================

// if (prefs.alertTone) {

//     if (user?.role === "Butler") {

//         // Butler gets a distinct notification tone
//         const butlerTone = new Audio("/butler-noti.mp3");
//         butlerTone.volume = 1.0;

//         butlerTone
//             .play()
//             .catch((err) => {
//                 console.log("Butler notification tone play error:", err);
//             });

//     } else {

//         playAlertTone();

//     }

// }


//                 // ======================================
//                 // BROWSER NOTIFICATION
//                 // ======================================

//                 if (prefs.browserNotifications) {

//                     showBrowserNotification(
//                         newNotification
//                     );

//                 }


//                 // ======================================
//                 // SHOW POPUP
//                 // ======================================

//                 setNotification(
//                     newNotification
//                 );


//                 // ======================================
//                 // AUTO CLOSE AFTER 5 SECONDS
//                 // ======================================

//                 setTimeout(() => {

//                     setNotification(
//                         (current) => {

//                             if (
//                                 current?.id ===
//                                 newNotification.id
//                             ) {

//                                 return null;

//                             }

//                             return current;

//                         }
//                     );

//                 }, 3000);

//             };


//         // ==========================================
//         // SOCKET LISTENER
//         // ==========================================

//         socket.on(
//             "new_notification",
//             handleNewNotification
//         );


//         // ==========================================
//         // CLEANUP
//         // ==========================================

//         return () => {

//             console.log(
//                 "NotificationPopup socket listener removed"
//             );

//             socket.off(
//                 "new_notification",
//                 handleNewNotification
//             );

//         };

//     }, []);


//     // ==========================================
//     // HANDLE POPUP CLICK
//     // ==========================================

//     const handleNotificationClick = async () => {

//         if (!notification) {
//             return;
//         }


//         const token = localStorage.getItem("token");


//         try {

//             // ======================================
//             // MARK NOTIFICATION AS READ
//             // ======================================

//             if (
//                 Number(notification.is_read) === 0
//             ) {

//                 const response = await fetch(
//                     `${API_URL}/notifications/${notification.id}/read`,
//                     {
//                         method: "PUT",

//                         headers: {
//                             "Content-Type": "application/json",
//                             Authorization: `Bearer ${token}`,
//                         },
//                     }
//                 );


//                 if (!response.ok) {

//                     console.log(
//                         "Failed to mark popup notification as read"
//                     );

//                 }

//             }


//             // ======================================
//             // CLOSE POPUP
//             // ======================================

//             setNotification(null);


//             // ======================================
//             // NO TASK ASSOCIATED
//             // ======================================

//             if (!notification.task_id) {

//                 return;

//             }


//             // ======================================
//             // GET USER ROLE
//             // ======================================

//             const role = user?.role;


//             // ======================================
//             // BUTLER ASSIGNMENT
//             // ======================================

//             if (
//                 role === "Butler" &&
//                 notification.type === "TASK_ASSIGNED"
//             ) {

//                 navigate(
//                     `/butler-desk/${notification.task_id}`
//                 );

//             }

//             // ======================================
//             // OTHER TASK NOTIFICATIONS
//             // ======================================

//             else {

//                 navigate(
//                     `/tasks/${notification.task_id}`
//                 );

//             }

//         } catch (error) {

//             console.error(
//                 "Notification popup click error:",
//                 error
//             );


//             // ======================================
//             // EVEN IF MARK-AS-READ FAILS,
//             // STILL NAVIGATE
//             // ======================================

//             setNotification(null);


//             if (!notification.task_id) {

//                 return;

//             }


//             const role = user?.role;


//             if (
//                 role === "Butler" &&
//                 notification.type === "TASK_ASSIGNED"
//             ) {

//                 navigate(
//                     `/butler-desk/${notification.task_id}`
//                 );

//             }

//             else {

//                 navigate(
//                     `/tasks/${notification.task_id}`
//                 );

//             }

//         }

//     };


//     // ==========================================
//     // CLOSE POPUP
//     // ==========================================

//     const closePopup = (event) => {

//         event.stopPropagation();

//         setNotification(null);

//     };


//     // ==========================================
//     // NO NOTIFICATION
//     // ==========================================

//     if (!notification) {

//         return null;

//     }


//     // ==========================================
//     // PAGE
//     // ==========================================

//     return (

//         <div
//             className="
//                 fixed
//                 top-6
//                 right-6
//                 z-[9999]
//                 w-96
//             "
//         >

//             <style>{`

//                 @keyframes toastIn {

//                     from {

//                         opacity: 0;

//                         transform:
//                             translateY(-12px)
//                             scale(0.98);

//                     }

//                     to {

//                         opacity: 1;

//                         transform:
//                             translateY(0)
//                             scale(1);

//                     }

//                 }

//                 .toast-in {

//                     animation:
//                         toastIn
//                         0.35s
//                         cubic-bezier(.16,1,.3,1)
//                         both;

//                 }

//             `}</style>


//             {/* ==========================================
//                 CLICKABLE NOTIFICATION
//             ========================================== */}

//             <div
//                 onClick={handleNotificationClick}
//                 role="button"
//                 tabIndex={0}
//                 onKeyDown={(event) => {

//                     if (
//                         event.key === "Enter" ||
//                         event.key === " "
//                     ) {

//                         handleNotificationClick();

//                     }

//                 }}
//                 className="
//                     toast-in
//                     bg-white
//                     rounded-2xl
//                     shadow-2xl
//                     border
//                     border-violet-100
//                     p-5
//                     cursor-pointer
//                     hover:bg-slate-50
//                     hover:shadow-xl
//                     transition-all
//                     duration-200
//                 "
//             >

//                 <div className="flex items-start gap-4">


//                     {/* ======================================
//                         ICON
//                     ====================================== */}

//                     <span
//                         className="
//                             w-11
//                             h-11
//                             rounded-xl
//                             bg-orange-100
//                             text-orange-600
//                             grid
//                             place-items-center
//                             shrink-0
//                         "
//                     >

//                         <BellRing
//                             className="w-5 h-5"
//                         />

//                     </span>


//                     {/* ======================================
//                         NOTIFICATION CONTENT
//                     ====================================== */}

//                     <div
//                         className="
//                             flex-1
//                             min-w-0
//                         "
//                     >

//                         <h3
//                             className="
//                                 font-bold
//                                 text-ink
//                             "
//                         >

//                             {notification.title}

//                         </h3>


//                         <p
//                             className="
//                                 text-slate-500
//                                 text-sm
//                                 mt-1
//                             "
//                         >

//                             {notification.message}

//                         </p>


//                         {notification.task_title && (

//                             <p
//                                 className="
//                                     text-violet-600
//                                     font-semibold
//                                     text-sm
//                                     mt-2
//                                     flex
//                                     items-center
//                                     gap-1.5
//                                 "
//                             >

//                                 <ClipboardList
//                                     className="w-3.5 h-3.5"
//                                 />

//                                 {notification.task_title}

//                             </p>

//                         )}


//                         <p
//                             className="
//                                 text-slate-400
//                                 text-xs
//                                 mt-3
//                             "
//                         >

//                             Click to view

//                         </p>

//                     </div>


//                     {/* ======================================
//                         CLOSE BUTTON
//                     ====================================== */}

//                     <button
//                         type="button"
//                         onClick={closePopup}
//                         aria-label="Close notification"
//                         className="
//                             text-slate-400
//                             hover:text-slate-700
//                             transition-colors
//                             shrink-0
//                         "
//                     >

//                         <X className="w-4 h-4" />

//                     </button>


//                 </div>

//             </div>

//         </div>

//     );

// }


// export default NotificationPopup;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import socket from "../socket";
import TranslatedText from "./TranslatedText";

import {
    BellRing,
    X,
    ClipboardList,
} from "lucide-react";

import {
    getPrefs,
    isHighPriority,
    playAlertTone,
    showBrowserNotification,
} from "../services/notificationPrefs";

const API_URL = import.meta.env.VITE_API_URL;


function NotificationPopup() {

    const { t } = useTranslation();

    const [notification, setNotification] = useState(null);

    const navigate = useNavigate();


    // ==========================================
    // GET LOGGED-IN USER
    // ==========================================

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const userId = user?.id;


    // ==========================================
    // NEW NOTIFICATION
    // ==========================================

    useEffect(() => {

        console.log(
            "NotificationPopup socket listener mounted"
        );


        const handleNewNotification =
            (newNotification) => {

                console.log(
                    "GLOBAL NEW NOTIFICATION:",
                    newNotification
                );


                // ======================================
                // PREFERENCES
                // ======================================

                const prefs = getPrefs(userId);


                if (!prefs.newTaskAlerts) {

                    console.log(
                        "New task alerts disabled."
                    );

                    return;
                }


                if (
                    prefs.highPriorityOnly &&
                    !isHighPriority(newNotification)
                ) {

                    console.log(
                        "Notification ignored because it is not high priority."
                    );

                    return;
                }


                // ======================================
                // ALERT TONE
                // ======================================

                // if (prefs.alertTone) {

                //     playAlertTone();

                // }

                // ======================================
// ALERT TONE
// ======================================

if (prefs.alertTone) {

    if (user?.role === "Butler") {

        // Butler gets a distinct notification tone
        const butlerTone = new Audio("/butler-noti.mp3");
        butlerTone.volume = 1.0;

        butlerTone
            .play()
            .catch((err) => {
                console.log("Butler notification tone play error:", err);
            });

    } else {

        playAlertTone();

    }

}


                // ======================================
                // BROWSER NOTIFICATION
                // ======================================

                if (prefs.browserNotifications) {

                    showBrowserNotification(
                        newNotification
                    );

                }


                // ======================================
                // SHOW POPUP
                // ======================================

                setNotification(
                    newNotification
                );


                // ======================================
                // AUTO CLOSE AFTER 5 SECONDS
                // ======================================

                setTimeout(() => {

                    setNotification(
                        (current) => {

                            if (
                                current?.id ===
                                newNotification.id
                            ) {

                                return null;

                            }

                            return current;

                        }
                    );

                }, 3000);

            };


        // ==========================================
        // SOCKET LISTENER
        // ==========================================

        socket.on(
            "new_notification",
            handleNewNotification
        );


        // ==========================================
        // CLEANUP
        // ==========================================

        return () => {

            console.log(
                "NotificationPopup socket listener removed"
            );

            socket.off(
                "new_notification",
                handleNewNotification
            );

        };

    }, []);


    // ==========================================
    // HANDLE POPUP CLICK
    // ==========================================

    const handleNotificationClick = async () => {

        if (!notification) {
            return;
        }


        const token = localStorage.getItem("token");


        try {

            // ======================================
            // MARK NOTIFICATION AS READ
            // ======================================

            if (
                Number(notification.is_read) === 0
            ) {

                const response = await fetch(
                    `${API_URL}/notifications/${notification.id}/read`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );


                if (!response.ok) {

                    console.log(
                        "Failed to mark popup notification as read"
                    );

                }

            }


            // ======================================
            // CLOSE POPUP
            // ======================================

            setNotification(null);


            // ======================================
            // NO TASK ASSOCIATED
            // ======================================

            if (!notification.task_id) {

                return;

            }


            // ======================================
            // GET USER ROLE
            // ======================================

            const role = user?.role;


            // ======================================
            // BUTLER ASSIGNMENT
            // ======================================

            if (
                role === "Butler" &&
                notification.type === "TASK_ASSIGNED"
            ) {

                navigate(
                    `/butler-desk/${notification.task_id}`
                );

            }

            // ======================================
            // OTHER TASK NOTIFICATIONS
            // ======================================

            else {

                navigate(
                    `/tasks/${notification.task_id}`
                );

            }

        } catch (error) {

            console.error(
                "Notification popup click error:",
                error
            );


            // ======================================
            // EVEN IF MARK-AS-READ FAILS,
            // STILL NAVIGATE
            // ======================================

            setNotification(null);


            if (!notification.task_id) {

                return;

            }


            const role = user?.role;


            if (
                role === "Butler" &&
                notification.type === "TASK_ASSIGNED"
            ) {

                navigate(
                    `/butler-desk/${notification.task_id}`
                );

            }

            else {

                navigate(
                    `/tasks/${notification.task_id}`
                );

            }

        }

    };


    // ==========================================
    // CLOSE POPUP
    // ==========================================

    const closePopup = (event) => {

        event.stopPropagation();

        setNotification(null);

    };


    // ==========================================
    // NO NOTIFICATION
    // ==========================================

    if (!notification) {

        return null;

    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div
            className="
                fixed
                top-6
                right-6
                z-[9999]
                w-96
            "
        >

            <style>{`

                @keyframes toastIn {

                    from {

                        opacity: 0;

                        transform:
                            translateY(-12px)
                            scale(0.98);

                    }

                    to {

                        opacity: 1;

                        transform:
                            translateY(0)
                            scale(1);

                    }

                }

                .toast-in {

                    animation:
                        toastIn
                        0.35s
                        cubic-bezier(.16,1,.3,1)
                        both;

                }

            `}</style>


            {/* ==========================================
                CLICKABLE NOTIFICATION
            ========================================== */}

            <div
                onClick={handleNotificationClick}
                role="button"
                tabIndex={0}
                onKeyDown={(event) => {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        handleNotificationClick();

                    }

                }}
                className="
                    toast-in
                    bg-white
                    rounded-2xl
                    shadow-2xl
                    border
                    border-violet-100
                    p-5
                    cursor-pointer
                    hover:bg-slate-50
                    hover:shadow-xl
                    transition-all
                    duration-200
                "
            >

                <div className="flex items-start gap-4">


                    {/* ======================================
                        ICON
                    ====================================== */}

                    <span
                        className="
                            w-11
                            h-11
                            rounded-xl
                            bg-orange-100
                            text-orange-600
                            grid
                            place-items-center
                            shrink-0
                        "
                    >

                        <BellRing
                            className="w-5 h-5"
                        />

                    </span>


                    {/* ======================================
                        NOTIFICATION CONTENT
                    ====================================== */}

                    <div
                        className="
                            flex-1
                            min-w-0
                        "
                    >

                        <TranslatedText
                            text={notification.title}
                            as="h3"
                            className="font-bold text-ink"
                        />


                        <TranslatedText
                            text={notification.message}
                            as="p"
                            className="text-slate-500 text-sm mt-1"
                        />


                        {notification.task_title && (

                            <p
                                className="
                                    text-violet-600
                                    font-semibold
                                    text-sm
                                    mt-2
                                    flex
                                    items-center
                                    gap-1.5
                                "
                            >

                                <ClipboardList
                                    className="w-3.5 h-3.5"
                                />

                                <TranslatedText
                                    text={notification.task_title}
                                />

                            </p>

                        )}


                        <p
                            className="
                                text-slate-400
                                text-xs
                                mt-3
                            "
                        >

                            {t("notificationPopup.clickToView")}

                        </p>

                    </div>


                    {/* ======================================
                        CLOSE BUTTON
                    ====================================== */}

                    <button
                        type="button"
                        onClick={closePopup}
                        aria-label="Close notification"
                        className="
                            text-slate-400
                            hover:text-slate-700
                            transition-colors
                            shrink-0
                        "
                    >

                        <X className="w-4 h-4" />

                    </button>


                </div>

            </div>

        </div>

    );

}


export default NotificationPopup;
