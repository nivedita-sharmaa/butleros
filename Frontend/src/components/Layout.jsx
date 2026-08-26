// // import { Outlet, useNavigate, useLocation } from "react-router-dom";
// // import { useEffect, useState } from "react";

// // const user = JSON.parse(localStorage.getItem("user"));
// // const userRole = user?.role;
// // import socket from "../socket";
// // import { registerPushNotifications } from "../services/pushNotifications";
// // import NotificationPopup from "./NotificationPopup";
// // import CallAlertOverlay from "./CallAlertOverlay";
// // import { requestBrowserPermission } from "../services/notificationPrefs";
// // import { useTranslation } from "react-i18next";
// // // ==========================================
// // // ICONS  (lucide equivalents, inlined)
// // // ==========================================

// // const Icon = ({ name }) => {

// //     const paths = {

// //         dashboard: (
// //             <>
// //                 <rect x="3" y="3" width="7" height="9" rx="1" />
// //                 <rect x="14" y="3" width="7" height="5" rx="1" />
// //                 <rect x="14" y="12" width="7" height="9" rx="1" />
// //                 <rect x="3" y="16" width="7" height="5" rx="1" />
// //             </>
// //         ),

// //         clipboard: (
// //             <>
// //                 <rect x="8" y="2" width="8" height="4" rx="1" />
// //                 <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
// //                 <path d="M12 11h4M12 16h4M8 11h.01M8 16h.01" />
// //             </>
// //         ),

// //         sparkles: (
// //             <>
// //                 <path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3z" />
// //                 <path d="M19 15l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1z" />
// //             </>
// //         ),

// //         users: (
// //             <>
// //                 <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
// //                 <circle cx="9" cy="7" r="4" />
// //                 <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
// //                 <path d="M16 3.13a4 4 0 0 1 0 7.75" />
// //             </>
// //         ),

// //         bell: (
// //             <>
// //                 <path d="M3 20h18" />
// //                 <path d="M20 16a8 8 0 1 0-16 0z" />
// //                 <path d="M12 4v4" />
// //                 <path d="M10 4h4" />
// //             </>
// //         ),

// //         bellRing: (
// //             <>
// //                 <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
// //                 <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
// //                 <path d="M2 8c0-2.2.7-4.3 2-6" />
// //                 <path d="M22 8a10 10 0 0 0-2-6" />
// //             </>
// //         ),

// //         chart: (
// //             <>
// //                 <path d="M3 3v18h18" />
// //                 <path d="M18 17V9" />
// //                 <path d="M13 17V5" />
// //                 <path d="M8 17v-3" />
// //             </>
// //         )

// //     };

// //     return (

// //         <svg
// //             viewBox="0 0 24 24"
// //             fill="none"
// //             stroke="currentColor"
// //             strokeWidth="2"
// //             strokeLinecap="round"
// //             strokeLinejoin="round"
// //             aria-hidden="true"
// //         >
// //             {paths[name]}
// //         </svg>

// //     );

// // };


// // // ==========================================
// // // NAVIGATION
// // // ==========================================

// // const NAV_GROUPS = [
// //     {
// //         label: "Workspace",

// //         items: [
// //             {
// //                 path: "/dashboard",
// //                 icon: "dashboard",
// //                 text: "Dashboard",
// //                 roles: ["Admin", "Manager", "Employee", "Butler"],
// //             },

// //             {
// //                 path: "/tasks",
// //                 icon: "clipboard",
// //                 text: "Requests",
// //                 roles: ["Admin", "Manager", "Employee", "Butler"],
// //             },

// //             {
// //                 path: "/task-templates",
// //                 icon: "sparkles",
// //                 text: "Task Templates",
// //                 roles: ["Admin", "Manager", "Employee"],
// //             },

// //             {
// //                 path: "/users",
// //                 icon: "users",
// //                 text: "People",
// //                 roles: ["Admin", "Manager"],
// //             },

// //             {
// //                 path: "/butler-desk",
// //                 icon: "bell",
// //                 text: "Butler Desk",
// //                 roles: ["Butler"],
// //                 // live: true,
// //             },
// //         ],
// //     },

// //     {
// //         label: "Manage",

// //         items: [
// //             {
// //                 path: "/notifications",
// //                 icon: "bellRing",
// //                 text: "Notifications",
// //                 roles: ["Admin", "Manager", "Employee", "Butler"],
// //                 // live: true,
// //             },

// //             //   {
// //             //     path: "/reports",
// //             //     icon: "chart",
// //             //     text: "Reports",
// //             //     roles: ["Admin", "Manager"],
// //             //   },
// //         ],
// //     },
// // ];

// // // ==========================================
// // // PAGE TITLES
// // // ==========================================

// // const PAGE_TITLES = {
// //     "/dashboard": "Dashboard",
// //     "/tasks": "Service Requests",
// //     "/task-templates": "Task Templates",
// //     "/users": "People",
// //     "/butler-desk": "Butler Desk",
// //     "/notifications": "Notifications",
// //     "/reports": "Reports"
// // };

// // function LanguageToggle() {
// //     const { i18n } = useTranslation();

// //     const setLang = (lng) => {
// //         i18n.changeLanguage(lng);
// //     };

// //     return (
// //         <div className="lang-toggle" role="group" aria-label="Language">
// //             <button
// //                 className={i18n.language === "en" ? "lang-btn is-active" : "lang-btn"}
// //                 onClick={() => setLang("en")}
// //             >
// //                 EN
// //             </button>
// //             <button
// //                 className={i18n.language === "hi" ? "lang-btn is-active" : "lang-btn"}
// //                 onClick={() => setLang("hi")}
// //             >
// //                 हिं
// //             </button>
// //         </div>
// //     );
// // }

// // function Layout() {

// //     const navigate = useNavigate();
// //     const location = useLocation();

// //     const [menuOpen, setMenuOpen] = useState(false);
// //     const [unreadCount, setUnreadCount] = useState(0);

// //     const loadUnreadCount = async () => {
// //         try {
// //             const token = localStorage.getItem("token");

// //             const response = await fetch("https://hatbox-scanner-subscribe.ngrok-free.dev/api/notifications", {
// //                 headers: { Authorization: `Bearer ${token}` }
// //             });

// //             if (!response.ok) return;

// //             const data = await response.json();
// //             const unread = data.filter((n) => Number(n.is_read) === 0).length;
// //             setUnreadCount(unread);
// //         } catch (error) {
// //             console.log("Unread count fetch error:", error);
// //         }
// //     };
    

// //     // Refresh whenever the route changes — catches the case where the user
// //     // just marked notifications as read on the Notifications page.
// //     useEffect(() => {
// //         loadUnreadCount();
// //     }, [location.pathname]);

// //     useEffect(() => {
// //     registerPushNotifications();
// // }, []);
// //     // Live-increment the count the instant a new notification arrives,
// //     // without waiting for a page navigation.
// //     useEffect(() => {
// //         const handleNewNotification = () => {
// //             setUnreadCount((prev) => prev + 1);
// //         };

// //         socket.on("new_notification", handleNewNotification);

// //         return () => {
// //             socket.off("new_notification", handleNewNotification);
// //         };
// //     }, []);

// // useEffect(() => {
// //     const unlockAudio = () => {
// //         const ctx = new (window.AudioContext || window.webkitAudioContext)();
// //         if (ctx.state === "suspended") {
// //             ctx.resume();
// //         }
// //         const osc = ctx.createOscillator();
// //         const gain = ctx.createGain();
// //         gain.gain.setValueAtTime(0, ctx.currentTime);
// //         osc.connect(gain);
// //         gain.connect(ctx.destination);
// //         osc.start();
// //         osc.stop(ctx.currentTime + 0.01);

// //         // Unlocks the browser's native notification permission prompt
// //         requestBrowserPermission();

// //         // Silently warms up both audio files so their FIRST real play,
// //         // triggered later by a socket event, isn't blocked
// //         const butlerTone = new Audio("/butler-noti.mp3");
// //         butlerTone.volume = 0;
// //         butlerTone.play().then(() => butlerTone.pause()).catch(() => {});

// //         const buzzer = new Audio("/buzzer.mp3");
// //         buzzer.volume = 0;
// //         buzzer.play().then(() => buzzer.pause()).catch(() => {});

        
// //         window.removeEventListener("click", unlockAudio);
// //         window.removeEventListener("touchstart", unlockAudio);
// //     };

// //     window.addEventListener("click", unlockAudio, { once: true });
// //     window.addEventListener("touchstart", unlockAudio, { once: true });

// //     return () => {
// //         window.removeEventListener("click", unlockAudio);
// //         window.removeEventListener("touchstart", unlockAudio);
// //     };
// // }, []);

// // //     useEffect(() => {
// // //     const unlockAudio = () => {
// // //         const ctx = new (window.AudioContext || window.webkitAudioContext)();
// // //         if (ctx.state === "suspended") {
// // //             ctx.resume();
// // //         }
// // //         // Play a silent blip to fully unlock on iOS Safari
// // //         const osc = ctx.createOscillator();
// // //         const gain = ctx.createGain();
// // //         gain.gain.setValueAtTime(0, ctx.currentTime);
// // //         osc.connect(gain);
// // //         gain.connect(ctx.destination);
// // //         osc.start();
// // //         osc.stop(ctx.currentTime + 0.01);
// // // requestBrowserPermission(); // 👈 the one new line
// // // const noti = new Audio("/butler-noti.mp3");
// // //         noti.volume = 0;
// // //         noti.play().then(() => noti.pause()).catch(() => {});
// // //         window.removeEventListener("click", unlockAudio);
// // //         window.removeEventListener("touchstart", unlockAudio);
// // //     };

// // //     window.addEventListener("click", unlockAudio, { once: true });
// // //     window.addEventListener("touchstart", unlockAudio, { once: true });

// // //     return () => {
// // //         window.removeEventListener("click", unlockAudio);
// // //         window.removeEventListener("touchstart", unlockAudio);
// // //     };
// // // }, []);

// //     // ==========================================
// //     // LOGOUT
// //     // ==========================================
// //     const handleLogout = () => {
// //         const confirmed = window.confirm("Are you sure you want to log out?");
// //         if (!confirmed) return;

// //         localStorage.removeItem("token");
// //         localStorage.removeItem("user");
// //         socket.disconnect();
// //         navigate("/login");
// //     };


// //     // ==========================================
// //     // PROFILE
// //     // ==========================================

// //     const user = JSON.parse(localStorage.getItem("user") || "null");

// //     const userName = user?.name || "Admin";
// //     const userRole = user?.role || "Administrator";

// //     const initials = userName
// //         .trim()
// //         .split(/\s+/)
// //         .slice(0, 2)
// //         .map((part) => part[0])
// //         .join("")
// //         .toUpperCase();


// //     // ==========================================
// //     // ACTIVE ROUTE
// //     // ==========================================

// //     const isActive = (path) =>
// //         location.pathname.startsWith(path);

// //     const activePath =
// //         Object.keys(PAGE_TITLES).find((path) =>
// //             location.pathname.startsWith(path)
// //         );


// //     // ==========================================
// //     // NAVIGATE
// //     // ==========================================

// //     const go = (path) => {
// //         navigate(path);
// //         setMenuOpen(false);
// //     };


// //     // ==========================================
// //     // LAYOUT
// //     // ==========================================

// //     return (

// //         <div className="app-layout">
// //             <NotificationPopup />
// //              <CallAlertOverlay />

// //             {/* ==================================
// //                 SIDEBAR
// //             ================================== */}

// //             <aside
// //                 className={
// //                     menuOpen
// //                         ? "sidebar is-open"
// //                         : "sidebar"
// //                 }
// //             >


// //                 {/* --- BRAND --- */}

// //                 <div className="logo">

// //                     <span className="logo-mark">
// //                         <Icon name="bell" />
// //                     </span>

// //                     <span className="logo-text">

// //                         <strong>
// //                             ButlerOS
// //                         </strong>

// //                         <small>
// //                             Service Operations
// //                         </small>

// //                     </span>

// //                 </div>


// //                 {/* --- NAV --- */}

// //                 <div className="sidebar-scroll">

// //                     {NAV_GROUPS.map((group, groupIndex) => {

// //                         const visibleItems = group.items.filter((item) =>
// //                             item.roles.includes(userRole)
// //                         );

// //                         // Don't display the group if
// //                         // the current role has no items in it
// //                         if (visibleItems.length === 0) {
// //                             return null;
// //                         }

// //                         return (
// //                             <div
// //                                 key={group.label}
// //                                 className="nav-group"
// //                             >

// //                                 <div className="nav-group-label">
// //                                     {group.label}
// //                                 </div>

// //                                 <nav>

// //                                     {visibleItems.map((item, itemIndex) => (

// //                                         <button
// //                                             key={item.path}
// //                                             className={
// //                                                 isActive(item.path)
// //                                                     ? "nav-button is-active"
// //                                                     : "nav-button"
// //                                             }
// //                                             style={{
// //                                                 animationDelay: `${(
// //                                                     groupIndex * 5 +
// //                                                     itemIndex
// //                                                 ) * 45 + 120}ms`
// //                                             }}
// //                                             onClick={() => go(item.path)}
// //                                         >

// //                                             <span className="nav-icon">
// //                                                 <Icon name={item.icon} />
// //                                             </span>

// //                                             <span className="nav-text">
// //                                                 {item.text}
// //                                             </span>

// //                                             {item.path === "/notifications" && unreadCount > 0 && (
// //                                                 <span className="nav-live-dot" title={`${unreadCount} unread`}>
// //                                                 </span>
// //                                             )}

// //                                         </button>

// //                                     ))}

// //                                 </nav>

// //                             </div>
// //                         );
// //                     })}

// //                 </div>


// //                 {/* --- USER CARD --- */}

// //                 <div className="sidebar-user">

// //                     <span className="sidebar-avatar">
// //                         {initials}
// //                     </span>

// //                     <span className="sidebar-user-text">

// //                         <strong>
// //                             {userName}
// //                         </strong>

// //                         <small>
// //                             {userRole}
// //                         </small>

// //                     </span>

// //                 </div>

// //                 <button
// //                     className="logout-button"
// //                     onClick={handleLogout}
// //                 >
// //                     Logout
// //                 </button>

// //             </aside>


// //             {/* --- MOBILE BACKDROP --- */}

// //             {menuOpen && (

// //                 <div
// //                     className="sidebar-backdrop"
// //                     onClick={() => setMenuOpen(false)}
// //                 >
// //                 </div>

// //             )}


// //             {/* ==================================
// //                 MAIN
// //             ================================== */}

// //             <div className="main-area">


// //                 {/* --- TOPBAR --- */}

// //                 <header className="topbar">

// //                     <header className="topbar">

// //     <div className="topbar-left">
// //         <button className="menu-button" onClick={() => setMenuOpen(true)} aria-label="Open menu">
// //             ☰
// //         </button>
// //         <h2>{PAGE_TITLES[activePath] || "ButlerOS"}</h2>
// //     </div>

// //     <div className="topbar-right">   {/* wrap toggle + profile together */}

// //         <LanguageToggle />

    
// //     </div>

// // </header>

// //                     <div className="profile">

// //                         <span className="profile-avatar">
// //                             {initials}
// //                         </span>

// //                         <span className="profile-name">
// //                             {userName}
// //                         </span>

// //                     </div>

// //                 </header>


// //                 {/* --- CONTENT --- */}

// //                 <main className="content">

// //                     <Outlet />

// //                 </main>

// //             </div>

// //         </div>

// //     );

// // }

// // export default Layout;


// import { Outlet, useNavigate, useLocation } from "react-router-dom";
// import { useEffect, useState } from "react";

// const user = JSON.parse(localStorage.getItem("user"));
// const userRole = user?.role;
// import socket from "../socket";
// import { registerPushNotifications } from "../services/pushNotifications";
// import NotificationPopup from "./NotificationPopup";
// import CallAlertOverlay from "./CallAlertOverlay";
// import { requestBrowserPermission } from "../services/notificationPrefs";
// import { useTranslation } from "react-i18next";
// // ==========================================
// // ICONS  (lucide equivalents, inlined)
// // ==========================================

// const Icon = ({ name }) => {

//     const paths = {

//         dashboard: (
//             <>
//                 <rect x="3" y="3" width="7" height="9" rx="1" />
//                 <rect x="14" y="3" width="7" height="5" rx="1" />
//                 <rect x="14" y="12" width="7" height="9" rx="1" />
//                 <rect x="3" y="16" width="7" height="5" rx="1" />
//             </>
//         ),

//         clipboard: (
//             <>
//                 <rect x="8" y="2" width="8" height="4" rx="1" />
//                 <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
//                 <path d="M12 11h4M12 16h4M8 11h.01M8 16h.01" />
//             </>
//         ),

//         sparkles: (
//             <>
//                 <path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3z" />
//                 <path d="M19 15l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1z" />
//             </>
//         ),

//         users: (
//             <>
//                 <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
//                 <circle cx="9" cy="7" r="4" />
//                 <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
//                 <path d="M16 3.13a4 4 0 0 1 0 7.75" />
//             </>
//         ),

//         bell: (
//             <>
//                 <path d="M3 20h18" />
//                 <path d="M20 16a8 8 0 1 0-16 0z" />
//                 <path d="M12 4v4" />
//                 <path d="M10 4h4" />
//             </>
//         ),

//         bellRing: (
//             <>
//                 <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
//                 <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
//                 <path d="M2 8c0-2.2.7-4.3 2-6" />
//                 <path d="M22 8a10 10 0 0 0-2-6" />
//             </>
//         ),

//         chart: (
//             <>
//                 <path d="M3 3v18h18" />
//                 <path d="M18 17V9" />
//                 <path d="M13 17V5" />
//                 <path d="M8 17v-3" />
//             </>
//         )

//     };

//     return (

//         <svg
//             viewBox="0 0 24 24"
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//             aria-hidden="true"
//         >
//             {paths[name]}
//         </svg>

//     );

// };


// // ==========================================
// // NAVIGATION
// // Note: "text" is now "textKey" — it stores a translation
// // key (e.g. "nav.dashboard") instead of a literal English
// // string, so it can be resolved via t() at render time.
// // ==========================================

// const NAV_GROUPS = [
//     {
//         labelKey: "nav.groupWorkspace",

//         items: [
//             {
//                 path: "/dashboard",
//                 icon: "dashboard",
//                 textKey: "nav.dashboard",
//                 roles: ["Admin", "Manager", "Employee", "Butler"],
//             },

//             {
//                 path: "/tasks",
//                 icon: "clipboard",
//                 textKey: "nav.requests",
//                 roles: ["Admin", "Manager", "Employee", "Butler"],
//             },

//             {
//                 path: "/task-templates",
//                 icon: "sparkles",
//                 textKey: "nav.taskTemplates",
//                 roles: ["Admin", "Manager", "Employee"],
//             },

//             {
//                 path: "/users",
//                 icon: "users",
//                 textKey: "nav.people",
//                 roles: ["Admin", "Manager"],
//             },

//             {
//                 path: "/butler-desk",
//                 icon: "bell",
//                 textKey: "nav.butlerDesk",
//                 roles: ["Butler"],
//                 // live: true,
//             },
//         ],
//     },

//     {
//         labelKey: "nav.groupManage",

//         items: [
//             {
//                 path: "/notifications",
//                 icon: "bellRing",
//                 textKey: "nav.notifications",
//                 roles: ["Admin", "Manager", "Employee", "Butler"],
//                 // live: true,
//             },

//             //   {
//             //     path: "/reports",
//             //     icon: "chart",
//             //     textKey: "nav.reports",
//             //     roles: ["Admin", "Manager"],
//             //   },
//         ],
//     },
// ];

// // ==========================================
// // PAGE TITLES
// // Maps a route to a translation key instead of a literal string.
// // ==========================================

// const PAGE_TITLE_KEYS = {
//     "/dashboard": "nav.dashboard",
//     "/tasks": "nav.serviceRequests",
//     "/task-templates": "nav.taskTemplates",
//     "/users": "nav.people",
//     "/butler-desk": "nav.butlerDesk",
//     "/notifications": "nav.notifications",
//     "/reports": "nav.reports",
// };

// // ==========================================
// // LANGUAGE TOGGLE
// // ==========================================

// function LanguageToggle() {
//     const { i18n } = useTranslation();

//     const setLang = (lng) => {
//         i18n.changeLanguage(lng);
//     };

//     return (
//         <div className="lang-toggle" role="group" aria-label="Language">
//             <button
//                 className={i18n.language === "en" ? "lang-btn is-active" : "lang-btn"}
//                 onClick={() => setLang("en")}
//             >
//                 EN
//             </button>
//             <button
//                 className={i18n.language === "hi" ? "lang-btn is-active" : "lang-btn"}
//                 onClick={() => setLang("hi")}
//             >
//                 हिं
//             </button>
//         </div>
//     );
// }

// function Layout() {

//     const { t } = useTranslation();
//     const navigate = useNavigate();
//     const location = useLocation();

//     const [menuOpen, setMenuOpen] = useState(false);
//     const [unreadCount, setUnreadCount] = useState(0);

//     const loadUnreadCount = async () => {
//         try {
//             const token = localStorage.getItem("token");

//             const response = await fetch("https://hatbox-scanner-subscribe.ngrok-free.dev/api/notifications", {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             if (!response.ok) return;

//             const data = await response.json();
//             const unread = data.filter((n) => Number(n.is_read) === 0).length;
//             setUnreadCount(unread);
//         } catch (error) {
//             console.log("Unread count fetch error:", error);
//         }
//     };


//     // Refresh whenever the route changes — catches the case where the user
//     // just marked notifications as read on the Notifications page.
//     useEffect(() => {
//         loadUnreadCount();
//     }, [location.pathname]);

//     useEffect(() => {
//         registerPushNotifications();
//     }, []);

//     // Live-increment the count the instant a new notification arrives,
//     // without waiting for a page navigation.
//     useEffect(() => {
//         const handleNewNotification = () => {
//             setUnreadCount((prev) => prev + 1);
//         };

//         socket.on("new_notification", handleNewNotification);

//         return () => {
//             socket.off("new_notification", handleNewNotification);
//         };
//     }, []);

//     useEffect(() => {
//     if ("serviceWorker" in navigator) {
//         navigator.serviceWorker.addEventListener("message", (event) => {
//             if (event.data?.type === "RELOAD_APP") {
//                 window.location.reload();
//             }
//         });
//     }
// }, []);

//     useEffect(() => {
//         const unlockAudio = () => {
//             const ctx = new (window.AudioContext || window.webkitAudioContext)();
//             if (ctx.state === "suspended") {
//                 ctx.resume();
//             }
//             const osc = ctx.createOscillator();
//             const gain = ctx.createGain();
//             gain.gain.setValueAtTime(0, ctx.currentTime);
//             osc.connect(gain);
//             gain.connect(ctx.destination);
//             osc.start();
//             osc.stop(ctx.currentTime + 0.01);

//             // Unlocks the browser's native notification permission prompt
//             requestBrowserPermission();

//             // Silently warms up both audio files so their FIRST real play,
//             // triggered later by a socket event, isn't blocked
//             const butlerTone = new Audio("/butler-noti.mp3");
//             butlerTone.volume = 0;
//             butlerTone.play().then(() => butlerTone.pause()).catch(() => {});

//             const buzzer = new Audio("/buzzer.mp3");
//             buzzer.volume = 0;
//             buzzer.play().then(() => buzzer.pause()).catch(() => {});


//             window.removeEventListener("click", unlockAudio);
//             window.removeEventListener("touchstart", unlockAudio);
//         };

//         window.addEventListener("click", unlockAudio, { once: true });
//         window.addEventListener("touchstart", unlockAudio, { once: true });

//         return () => {
//             window.removeEventListener("click", unlockAudio);
//             window.removeEventListener("touchstart", unlockAudio);
//         };
//     }, []);

//     // ==========================================
//     // LOGOUT
//     // ==========================================
//     const handleLogout = () => {
//         const confirmed = window.confirm(t("topbar.logoutConfirm"));
//         if (!confirmed) return;

//         localStorage.removeItem("token");
//         localStorage.removeItem("user");
//         socket.disconnect();
//         navigate("/login");
//     };


//     // ==========================================
//     // PROFILE
//     // ==========================================

//     const user = JSON.parse(localStorage.getItem("user") || "null");

//     const userName = user?.name || "Admin";
//     const userRole = user?.role || "Administrator";

//     const initials = userName
//         .trim()
//         .split(/\s+/)
//         .slice(0, 2)
//         .map((part) => part[0])
//         .join("")
//         .toUpperCase();


//     // ==========================================
//     // ACTIVE ROUTE
//     // ==========================================

//     const isActive = (path) =>
//         location.pathname.startsWith(path);

//     const activePath =
//         Object.keys(PAGE_TITLE_KEYS).find((path) =>
//             location.pathname.startsWith(path)
//         );


//     // ==========================================
//     // NAVIGATE
//     // ==========================================

//     const go = (path) => {
//         navigate(path);
//         setMenuOpen(false);
//     };


//     // ==========================================
//     // LAYOUT
//     // ==========================================

//     return (

//         <div className="app-layout">
//             <NotificationPopup />
//             <CallAlertOverlay />

//             {/* ==================================
//                 SIDEBAR
//             ================================== */}

//             <aside
//                 className={
//                     menuOpen
//                         ? "sidebar is-open"
//                         : "sidebar"
//                 }
//             >


//                 {/* --- BRAND --- */}

//                 <div className="logo">

//                     <span className="logo-mark">
//                         <Icon name="bell" />
//                     </span>

//                     <span className="logo-text">

//                         <strong>
//                             ButlerOS
//                         </strong>

//                         <small>
//                             Service Operations
//                         </small>

//                     </span>

//                 </div>


//                 {/* --- NAV --- */}

//                 <div className="sidebar-scroll">

//                     {NAV_GROUPS.map((group, groupIndex) => {

//                         const visibleItems = group.items.filter((item) =>
//                             item.roles.includes(userRole)
//                         );

//                         // Don't display the group if
//                         // the current role has no items in it
//                         if (visibleItems.length === 0) {
//                             return null;
//                         }

//                         return (
//                             <div
//                                 key={group.labelKey}
//                                 className="nav-group"
//                             >

//                                 <div className="nav-group-label">
//                                     {t(group.labelKey)}
//                                 </div>

//                                 <nav>

//                                     {visibleItems.map((item, itemIndex) => (

//                                         <button
//                                             key={item.path}
//                                             className={
//                                                 isActive(item.path)
//                                                     ? "nav-button is-active"
//                                                     : "nav-button"
//                                             }
//                                             style={{
//                                                 animationDelay: `${(
//                                                     groupIndex * 5 +
//                                                     itemIndex
//                                                 ) * 45 + 120}ms`
//                                             }}
//                                             onClick={() => go(item.path)}
//                                         >

//                                             <span className="nav-icon">
//                                                 <Icon name={item.icon} />
//                                             </span>

//                                             <span className="nav-text">
//                                                 {t(item.textKey)}
//                                             </span>

//                                             {item.path === "/notifications" && unreadCount > 0 && (
//                                                 <span className="nav-live-dot" title={`${unreadCount} unread`}>
//                                                 </span>
//                                             )}

//                                         </button>

//                                     ))}

//                                 </nav>

//                             </div>
//                         );
//                     })}

//                 </div>


//                 {/* --- USER CARD --- */}

//                 <div className="sidebar-user">

//                     <span className="sidebar-avatar">
//                         {initials}
//                     </span>

//                     <span className="sidebar-user-text">

//                         <strong>
//                             {userName}
//                         </strong>

//                         <small>
//                             {userRole}
//                         </small>

//                     </span>

//                 </div>

//                 <button
//                     className="logout-button"
//                     onClick={handleLogout}
//                 >
//                     {t("topbar.logout")}
//                 </button>

//             </aside>


//             {/* --- MOBILE BACKDROP --- */}

//             {menuOpen && (

//                 <div
//                     className="sidebar-backdrop"
//                     onClick={() => setMenuOpen(false)}
//                 >
//                 </div>

//             )}


//             {/* ==================================
//                 MAIN
//             ================================== */}

//             <div className="main-area">


//                 {/* --- TOPBAR --- */}

//                 <header className="topbar">

//                     <div className="topbar-left">
//                         <button
//                             className="menu-button"
//                             onClick={() => setMenuOpen(true)}
//                             aria-label="Open menu"
//                         >
//                             ☰
//                         </button>

//                         <h2>
//                             {activePath ? t(PAGE_TITLE_KEYS[activePath]) : "ButlerOS"}
//                         </h2>
//                     </div>

//                     <div className="topbar-right">

//                         <LanguageToggle />

//                         <div className="profile">

//                             <span className="profile-avatar">
//                                 {initials}
//                             </span>

//                             <span className="profile-name">
//                                 {userName}
//                             </span>

//                         </div>

//                     </div>

//                 </header>


//                 {/* --- CONTENT --- */}

//                 <main className="content">

//                     <Outlet />

//                 </main>

//             </div>

//         </div>

//     );

// }

// export default Layout;


import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const user = JSON.parse(localStorage.getItem("user"));
const userRole = user?.role;
import socket from "../socket";
import { registerPushNotifications } from "../services/pushNotifications";
import NotificationPopup from "./NotificationPopup";
import CallAlertOverlay from "./CallAlertOverlay";
import { requestBrowserPermission } from "../services/notificationPrefs";
import { useTranslation } from "react-i18next";
// ==========================================
// ICONS  (lucide equivalents, inlined)
// ==========================================

const Icon = ({ name }) => {

    const paths = {

        dashboard: (
            <>
                <rect x="3" y="3" width="7" height="9" rx="1" />
                <rect x="14" y="3" width="7" height="5" rx="1" />
                <rect x="14" y="12" width="7" height="9" rx="1" />
                <rect x="3" y="16" width="7" height="5" rx="1" />
            </>
        ),

        clipboard: (
            <>
                <rect x="8" y="2" width="8" height="4" rx="1" />
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                <path d="M12 11h4M12 16h4M8 11h.01M8 16h.01" />
            </>
        ),

        sparkles: (
            <>
                <path d="M12 3l1.9 4.6L18.5 9.5l-4.6 1.9L12 16l-1.9-4.6L5.5 9.5l4.6-1.9L12 3z" />
                <path d="M19 15l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1z" />
            </>
        ),

        users: (
            <>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </>
        ),

        bell: (
            <>
                <path d="M3 20h18" />
                <path d="M20 16a8 8 0 1 0-16 0z" />
                <path d="M12 4v4" />
                <path d="M10 4h4" />
            </>
        ),

        bellRing: (
            <>
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                <path d="M2 8c0-2.2.7-4.3 2-6" />
                <path d="M22 8a10 10 0 0 0-2-6" />
            </>
        ),

        chart: (
            <>
                <path d="M3 3v18h18" />
                <path d="M18 17V9" />
                <path d="M13 17V5" />
                <path d="M8 17v-3" />
            </>
        )

    };

    return (

        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {paths[name]}
        </svg>

    );

};


// ==========================================
// NAVIGATION
// Note: "text" is now "textKey" — it stores a translation
// key (e.g. "nav.dashboard") instead of a literal English
// string, so it can be resolved via t() at render time.
// ==========================================

const NAV_GROUPS = [
    {
        labelKey: "nav.groupWorkspace",

        items: [
            {
                path: "/dashboard",
                icon: "dashboard",
                textKey: "nav.dashboard",
                roles: ["Admin", "Manager", "Employee", "Butler"],
            },

            {
                path: "/tasks",
                icon: "clipboard",
                textKey: "nav.requests",
                roles: ["Admin", "Manager", "Employee", "Butler"],
            },

            {
                path: "/task-templates",
                icon: "sparkles",
                textKey: "nav.taskTemplates",
                roles: ["Admin", "Manager", "Employee"],
            },

            {
                path: "/users",
                icon: "users",
                textKey: "nav.people",
                roles: ["Admin", "Manager"],
            },

            {
                path: "/butler-desk",
                icon: "bell",
                textKey: "nav.butlerDesk",
                roles: ["Butler"],
                // live: true,
            },
        ],
    },

    {
        labelKey: "nav.groupManage",

        items: [
            {
                path: "/notifications",
                icon: "bellRing",
                textKey: "nav.notifications",
                roles: ["Admin", "Manager", "Employee", "Butler"],
                // live: true,
            },

            //   {
            //     path: "/reports",
            //     icon: "chart",
            //     textKey: "nav.reports",
            //     roles: ["Admin", "Manager"],
            //   },
        ],
    },
];

// ==========================================
// PAGE TITLES
// Maps a route to a translation key instead of a literal string.
// ==========================================

const PAGE_TITLE_KEYS = {
    "/dashboard": "nav.dashboard",
    "/tasks": "nav.serviceRequests",
    "/task-templates": "nav.taskTemplates",
    "/users": "nav.people",
    "/butler-desk": "nav.butlerDesk",
    "/notifications": "nav.notifications",
    "/reports": "nav.reports",
};

// ==========================================
// LANGUAGE TOGGLE
// ==========================================

function LanguageToggle() {
    const { i18n } = useTranslation();

    const setLang = (lng) => {
        i18n.changeLanguage(lng);
    };

    return (
        <div className="lang-toggle" role="group" aria-label="Language">
            <button
                className={i18n.language === "en" ? "lang-btn is-active" : "lang-btn"}
                onClick={() => setLang("en")}
            >
                EN
            </button>
            <button
                className={i18n.language === "hi" ? "lang-btn is-active" : "lang-btn"}
                onClick={() => setLang("hi")}
            >
                हिं
            </button>
        </div>
    );
}

function Layout() {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const [menuOpen, setMenuOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const loadUnreadCount = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch("https://hatbox-scanner-subscribe.ngrok-free.dev/api/notifications", {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (!response.ok) return;

            const data = await response.json();
            const unread = data.filter((n) => Number(n.is_read) === 0).length;
            setUnreadCount(unread);
        } catch (error) {
            console.log("Unread count fetch error:", error);
        }
    };


    // Refresh whenever the route changes — catches the case where the user
    // just marked notifications as read on the Notifications page.
    useEffect(() => {
        loadUnreadCount();
    }, [location.pathname]);

    useEffect(() => {
        registerPushNotifications();
    }, []);

    // Live-increment the count the instant a new notification arrives,
    // without waiting for a page navigation.
    useEffect(() => {
        const handleNewNotification = () => {
            setUnreadCount((prev) => prev + 1);
        };

        socket.on("new_notification", handleNewNotification);

        return () => {
            socket.off("new_notification", handleNewNotification);
        };
    }, []);

    useEffect(() => {
    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.addEventListener("message", (event) => {
            if (event.data?.type === "RELOAD_APP") {
                window.location.reload();
            }
        });
    }
}, []);

    useEffect(() => {
        const unlockAudio = () => {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            if (ctx.state === "suspended") {
                ctx.resume();
            }
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            gain.gain.setValueAtTime(0, ctx.currentTime);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.01);

            // Unlocks the browser's native notification permission prompt
            requestBrowserPermission();

            // Silently warms up both audio files so their FIRST real play,
            // triggered later by a socket event, isn't blocked
            const butlerTone = new Audio("/butler-noti.mp3");
            butlerTone.volume = 0;
            butlerTone.play().then(() => butlerTone.pause()).catch(() => {});

            const buzzer = new Audio("/buzzer.mp3");
            buzzer.volume = 0;
            buzzer.play().then(() => buzzer.pause()).catch(() => {});


            window.removeEventListener("click", unlockAudio);
            window.removeEventListener("touchstart", unlockAudio);
        };

        window.addEventListener("click", unlockAudio, { once: true });
        window.addEventListener("touchstart", unlockAudio, { once: true });

        return () => {
            window.removeEventListener("click", unlockAudio);
            window.removeEventListener("touchstart", unlockAudio);
        };
    }, []);

    // ==========================================
    // LOGOUT
    // ==========================================
    const handleLogout = () => {
        const confirmed = window.confirm(t("topbar.logoutConfirm"));
        if (!confirmed) return;

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        socket.disconnect();
        navigate("/login");
    };


    // ==========================================
    // PROFILE
    // ==========================================

    const user = JSON.parse(localStorage.getItem("user") || "null");

    const userName = user?.name || "Admin";
    const userRole = user?.role || "Administrator";

    const initials = userName
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();


    // ==========================================
    // ACTIVE ROUTE
    // ==========================================

    const isActive = (path) =>
        location.pathname.startsWith(path);

    const activePath =
        Object.keys(PAGE_TITLE_KEYS).find((path) =>
            location.pathname.startsWith(path)
        );


    // ==========================================
    // NAVIGATE
    // ==========================================

    const go = (path) => {
        navigate(path);
        setMenuOpen(false);
    };


    // ==========================================
    // LAYOUT
    // ==========================================

    return (

        <div className="app-layout">
            <NotificationPopup />
            <CallAlertOverlay />

            {/* ==================================
                SIDEBAR
            ================================== */}

            <aside
                className={
                    menuOpen
                        ? "sidebar is-open"
                        : "sidebar"
                }
            >


                {/* --- BRAND --- */}

                <div className="logo">

                    <span className="logo-mark logo-mark--image">
                        <img
                            src="/favicon.svg"
                            alt="ButlerOS"
                            className="logo-mark-img"
                        />
                    </span>

                    <span className="logo-text">

                        <strong>
                            ButlerOS
                        </strong>

                        <small>
                            Service Operations
                        </small>

                    </span>

                </div>


                {/* --- NAV --- */}

                <div className="sidebar-scroll">

                    {NAV_GROUPS.map((group, groupIndex) => {

                        const visibleItems = group.items.filter((item) =>
                            item.roles.includes(userRole)
                        );

                        // Don't display the group if
                        // the current role has no items in it
                        if (visibleItems.length === 0) {
                            return null;
                        }

                        return (
                            <div
                                key={group.labelKey}
                                className="nav-group"
                            >

                                <div className="nav-group-label">
                                    {t(group.labelKey)}
                                </div>

                                <nav>

                                    {visibleItems.map((item, itemIndex) => (

                                        <button
                                            key={item.path}
                                            className={
                                                isActive(item.path)
                                                    ? "nav-button is-active"
                                                    : "nav-button"
                                            }
                                            style={{
                                                animationDelay: `${(
                                                    groupIndex * 5 +
                                                    itemIndex
                                                ) * 45 + 120}ms`
                                            }}
                                            onClick={() => go(item.path)}
                                        >

                                            <span className="nav-icon">
                                                <Icon name={item.icon} />
                                            </span>

                                            <span className="nav-text">
                                                {t(item.textKey)}
                                            </span>

                                            {item.path === "/notifications" && unreadCount > 0 && (
                                                <span className="nav-live-dot" title={`${unreadCount} unread`}>
                                                </span>
                                            )}

                                        </button>

                                    ))}

                                </nav>

                            </div>
                        );
                    })}

                </div>


                {/* --- USER CARD --- */}

                <div className="sidebar-user">

                    <span className="sidebar-avatar">
                        {initials}
                    </span>

                    <span className="sidebar-user-text">

                        <strong>
                            {userName}
                        </strong>

                        <small>
                            {userRole}
                        </small>

                    </span>

                </div>

                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    {t("topbar.logout")}
                </button>

            </aside>


            {/* --- MOBILE BACKDROP --- */}

            {menuOpen && (

                <div
                    className="sidebar-backdrop"
                    onClick={() => setMenuOpen(false)}
                >
                </div>

            )}


            {/* ==================================
                MAIN
            ================================== */}

            <div className="main-area">


                {/* --- TOPBAR --- */}

                <header className="topbar">

                    <div className="topbar-left">
                        <button
                            className="menu-button"
                            onClick={() => setMenuOpen(true)}
                            aria-label="Open menu"
                        >
                            ☰
                        </button>

                        <h2>
                            {activePath ? t(PAGE_TITLE_KEYS[activePath]) : "ButlerOS"}
                        </h2>
                    </div>

                    <div className="topbar-right">

                        <LanguageToggle />

                        <div className="profile">

                            <span className="profile-avatar">
                                {initials}
                            </span>

                            <span className="profile-name">
                                {userName}
                            </span>

                        </div>

                    </div>

                </header>


                {/* --- CONTENT --- */}

                <main className="content">

                    <Outlet />

                </main>

            </div>

        </div>

    );

}

export default Layout;