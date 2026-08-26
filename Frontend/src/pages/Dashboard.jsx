// // // // import { useEffect, useState, useRef } from "react";
// // // // import { useNavigate } from "react-router-dom";
// // // // import QuickCallButton from "../components/QuickCallButton";
// // // // import { useTaskStatus } from "../hooks/useTaskStatus";
// // // // import socket from "../socket";
// // // // import {
// // // //   Inbox,
// // // //   LoaderCircle,
// // // //   CircleCheck,
// // // //   AlertTriangle,
// // // //   ClipboardList,
// // // //   Droplets,
// // // //   Coffee,
// // // //   UsersRound,
// // // //   Package,
// // // //   Sparkles,
// // // //   Activity,
// // // // } from "lucide-react";
// // // // import { getDashboard } from "../services/api";

// // // // const API_URL = "https://hatbox-scanner-subscribe.ngrok-free.dev/api";

// // // // const currentUser = JSON.parse(localStorage.getItem("user") || "null");
// // // // const currentUserRole = currentUser?.role;

// // // // function AnimatedNumber({ value, pad = false }) {
// // // //   const [display, setDisplay] = useState(0);
// // // //   const startRef = useRef(null);

// // // //   useEffect(() => {
// // // //     const target = Number(value) || 0;
// // // //     const duration = 700;
// // // //     const step = (timestamp) => {
// // // //       if (!startRef.current) startRef.current = timestamp;
// // // //       const progress = Math.min((timestamp - startRef.current) / duration, 1);
// // // //       const eased = 1 - Math.pow(1 - progress, 3);
// // // //       setDisplay(Math.round(eased * target));
// // // //       if (progress < 1) requestAnimationFrame(step);
// // // //     };
// // // //     startRef.current = null;
// // // //     const raf = requestAnimationFrame(step);
// // // //     return () => cancelAnimationFrame(raf);
// // // //   }, [value]);

// // // //   return <>{pad ? String(display).padStart(2, "0") : display}</>;
// // // // }

// // // // // Each card gets its own sub-line, like the reference — repeating
// // // // // "11 total tasks" four times reads as a bug.
// // // // const STAT_CARDS = [
// // // //   {
// // // //     key: "pendingTasks",
// // // //     label: "OPEN REQUESTS",
// // // //     icon: Inbox,
// // // //     color: "text-violet-500",
// // // //     sub: (d) => `of ${d.totalTasks ?? 0} total`,
// // // //     subColor: "text-slate-400",
// // // //   },
// // // //   {
// // // //     key: "inProgressTasks",
// // // //     label: "IN PROGRESS",
// // // //     icon: LoaderCircle,
// // // //     color: "text-orange-500",
// // // //     sub: () => "active right now",
// // // //     subColor: "text-slate-400",
// // // //   },
// // // //   {
// // // //     key: "completedTasks",
// // // //     label: "COMPLETED",
// // // //     icon: CircleCheck,
// // // //     color: "text-emerald-500",
// // // //     sub: (d) =>
// // // //       d.totalTasks
// // // //         ? `${Math.round((d.completedTasks / d.totalTasks) * 100)}% completed`
// // // //         : "none yet",
// // // //     subColor: "text-emerald-500",
// // // //   },
// // // //   {
// // // //     key: "overdueTasks",
// // // //     label: "OVERDUE",
// // // //     icon: AlertTriangle,
// // // //     color: "text-red-500",
// // // //     sub: (d) => ((d.overdueTasks ?? 0) > 0 ? "needs attention" : "all on time"),
// // // //     subColor: "text-slate-400",
// // // //   },
// // // // ];

// // // // const styleBlock = (
// // // //   <style>{`
// // // //     @keyframes cardIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
// // // //     .card-in { animation: cardIn 0.5s cubic-bezier(.16,1,.3,1) both; }
// // // //     @keyframes rowIn { from { opacity: 0; transform: translateX(-8px); } to { opacity: 1; transform: translateX(0); } }
// // // //     .row-in { animation: rowIn 0.4s ease both; }
// // // //     @media (prefers-reduced-motion: reduce) { .card-in, .row-in { animation: none; } }

// // // //     /* --- layout grid --- */
// // // //     .dash-grid {
// // // //       display: grid;
// // // //       grid-template-columns: 1fr;
// // // //       gap: 1.5rem;
// // // //       grid-template-areas:
// // // //         "quickcall"
// // // //         "quicktasks"
// // // //         "liverequests"
// // // //         "statcards"
// // // //         "taskoverview"
// // // //         "hero";
// // // //     }
// // // //     @media (min-width: 1024px) {
// // // //       .dash-grid {
// // // //         grid-template-columns: 1fr 320px;
// // // //         grid-template-areas:
// // // //           "hero quickcall"
// // // //           "statcards taskoverview"
// // // //           "liverequests quicktasks";
// // // //       }
// // // //     }
// // // //     .area-quickcall    { grid-area: quickcall; }
// // // //     .area-quicktasks   { grid-area: quicktasks; }
// // // //     .area-liverequests { grid-area: liverequests; }
// // // //     .area-statcards    { grid-area: statcards; }
// // // //     .area-taskoverview { grid-area: taskoverview; }
// // // //     .area-hero         { grid-area: hero; }
// // // //   `}</style>
// // // // );
// // // // const STATUS_STYLES = {
// // // //   Pending: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
// // // //   "In-Progress": { bg: "bg-orange-50", text: "text-orange-600", dot: "bg-orange-500" },
// // // //   Completed: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
// // // // };

// // // // const PRIORITY_STYLES = {
// // // //   Low: "bg-slate-100 text-slate-600",
// // // //   Medium: "bg-slate-100 text-slate-600",
// // // //   High: "bg-orange-50 text-orange-600",
// // // //   Urgent: "bg-red-50 text-red-600",
// // // // };

// // // // function StatusPill({ status }) {
// // // //   const s = STATUS_STYLES[status] || { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" };
// // // //   const label = status === "In-Progress" ? "In Progress" : status;
// // // //   const pulsing = status === "In-Progress";
// // // //   return (
// // // //     <span
// // // //       className={`inline-flex items-center justify-center gap-1.5 w-full px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${s.bg} ${s.text}`}
// // // //     >
// // // //       <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot} ${pulsing ? "animate-pulse" : ""}`} />
// // // //       {label}
// // // //     </span>
// // // //   );
// // // // }

// // // // function PriorityPill({ priority }) {
// // // //   if (!priority) return null;
// // // //   return (
// // // //     <span
// // // //       className={`inline-flex items-center justify-center w-full px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${PRIORITY_STYLES[priority] || "bg-slate-100 text-slate-600"
// // // //         }`}
// // // //     >
// // // //       {priority}
// // // //     </span>
// // // //   );
// // // // }

// // // // // Icon for a request row, guessed from its template/task type or title
// // // // function getRequestIcon(task) {
// // // //   const text = `${task.task_type || ""} ${task.title || ""}`.toLowerCase();
// // // //   if (text.includes("guest") || text.includes("snack")) return UsersRound;
// // // //   if (text.includes("package") || text.includes("courier") || text.includes("pickup") || text.includes("delivery")) return Package;
// // // //   if (text.includes("coffee") || text.includes("tea")) return Coffee;
// // // //   if (text.includes("water") || text.includes("bottle")) return Droplets;
// // // //   return Sparkles;
// // // // }

// // // // function getTemplateIcon(category) {
// // // //   const c = (category || "").toLowerCase();
// // // //   if (c.includes("refresh")) return Coffee;
// // // //   if (c.includes("guest")) return UsersRound;
// // // //   if (c.includes("logistic")) return Package;
// // // //   return Sparkles;
// // // // }

// // // // const TEMPLATE_ICON_STYLES = [
// // // //   { bg: "bg-blue-50", fg: "text-blue-600" },
// // // //   { bg: "bg-orange-50", fg: "text-orange-600" },
// // // //   { bg: "bg-emerald-50", fg: "text-emerald-600" },
// // // //   { bg: "bg-violet-50", fg: "text-violet-600" },
// // // // ];

// // // // function Dashboard() {
// // // //   const [dashboard, setDashboard] = useState(null);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [error, setError] = useState("");
// // // //   const navigate = useNavigate();

// // // //   const [recentTasks, setRecentTasks] = useState([]);
// // // //   const [tasksLoading, setTasksLoading] = useState(true);

// // // //   const [templates, setTemplates] = useState([]);
// // // //   const [templatesLoading, setTemplatesLoading] = useState(true);
// // // //   const [templatesAvailable, setTemplatesAvailable] = useState(true);

// // // //   useEffect(() => {
// // // //     loadDashboard();
// // // //     loadRecentTasks();
// // // //     loadTemplates();
// // // //   }, []);
// // // //   // useEffect(() => {
// // // //   //   loadDashboard();
// // // //   //   loadRecentTasks();
// // // //   //   loadTemplates();
// // // //   // }, []);

// // // //   // 👇 ADD THIS NEW BLOCK HERE
// // // //   useEffect(() => {
// // // //     const handleTaskCreated = (newTask) => {
// // // //       setRecentTasks((prev) => [newTask, ...prev].slice(0, 5));
// // // //       setDashboard((prev) =>
// // // //         prev
// // // //           ? {
// // // //               ...prev,
// // // //               totalTasks: (prev.totalTasks ?? 0) + 1,
// // // //               pendingTasks: (prev.pendingTasks ?? 0) + 1,
// // // //             }
// // // //           : prev
// // // //       );
// // // //     };

// // // //     const handleTaskUpdated = ({ id, status, oldStatus }) => {
// // // //       setRecentTasks((prev) => {
// // // //         if (status === "Completed") {
// // // //           return prev.filter((t) => t.id !== id);
// // // //         }
// // // //         return prev.map((t) => (t.id === id ? { ...t, status } : t));
// // // //       });

// // // //       setDashboard((prev) => {
// // // //         if (!prev) return prev;
// // // //         const next = { ...prev };

// // // //         const decrementFor = (s) => {
// // // //           if (s === "Assigned") next.pendingTasks = Math.max(0, (next.pendingTasks ?? 0) - 1);
// // // //           if (s === "In-Progress") next.inProgressTasks = Math.max(0, (next.inProgressTasks ?? 0) - 1);
// // // //           if (s === "Completed") next.completedTasks = Math.max(0, (next.completedTasks ?? 0) - 1);
// // // //         };
// // // //         const incrementFor = (s) => {
// // // //           if (s === "Assigned") next.pendingTasks = (next.pendingTasks ?? 0) + 1;
// // // //           if (s === "In-Progress") next.inProgressTasks = (next.inProgressTasks ?? 0) + 1;
// // // //           if (s === "Completed") next.completedTasks = (next.completedTasks ?? 0) + 1;
// // // //         };

// // // //         decrementFor(oldStatus);
// // // //         incrementFor(status);

// // // //         return next;
// // // //       });
// // // //     };

// // // //     socket.on("task_created", handleTaskCreated);
// // // //     socket.on("task_updated", handleTaskUpdated);

// // // //     return () => {
// // // //       socket.off("task_created", handleTaskCreated);
// // // //       socket.off("task_updated", handleTaskUpdated);
// // // //     };
// // // //   }, []);
// // // //   // 👆 END OF NEW BLOCK

// // // //   const { updateTaskStatus, updatingTaskId } = useTaskStatus((taskId, newStatus) => {
// // // //     setRecentTasks((prev) =>
// // // //       prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
// // // //     );
// // // //   });
// // // // //   const { updateTaskStatus, updatingTaskId } = useTaskStatus((taskId, newStatus) => {
// // // // //   setRecentTasks((prev) =>
// // // // //     prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
// // // // //   );
// // // // // });

// // // //   const loadDashboard = async () => {
// // // //     try {
// // // //       const data = await getDashboard();
// // // //       console.log("Dashboard data:", data);
// // // //       setDashboard(data);
// // // //     } catch (error) {
// // // //       console.log("Dashboard error:", error);
// // // //       setError(error.message);
// // // //     } finally {
// // // //       setLoading(false);
// // // //     }
// // // //   };

// // // //   // const loadRecentTasks = async () => {
// // // //   //   try {
// // // //   //     const token = localStorage.getItem("token");

// // // //   //     const response = await fetch(`${API_URL}/tasks`, {
// // // //   //       method: "GET",
// // // //   //       headers: {
// // // //   //         "Content-Type": "application/json",
// // // //   //         Authorization: `Bearer ${token}`,
// // // //   //       },
// // // //   //     });

// // // //   //     const data = await response.json();

// // // //   //     if (!response.ok) {
// // // //   //       throw new Error(data.message || "Failed to load tasks");
// // // //   //     }

// // // //   //     setRecentTasks(data.slice(0, 5));
// // // //   //   } catch (error) {
// // // //   //     console.log("Recent tasks error:", error);
// // // //   //   } finally {
// // // //   //     setTasksLoading(false);
// // // //   //   }
// // // //   // };

// // // //   const loadRecentTasks = async () => {
// // // //   try {
// // // //     const token = localStorage.getItem("token");

// // // //     const response = await fetch(`${API_URL}/tasks`, {
// // // //       method: "GET",
// // // //       headers: {
// // // //         "Content-Type": "application/json",
// // // //         Authorization: `Bearer ${token}`,
// // // //       },
// // // //     });

// // // //     const data = await response.json();

// // // //     if (!response.ok) {
// // // //       throw new Error(data.message || "Failed to load tasks");
// // // //     }

// // // //     const activeOnly = data.filter((task) => task.status !== "Completed");

// // // //     setRecentTasks(activeOnly.slice(0, 5));
// // // //   } catch (error) {
// // // //     console.log("Recent tasks error:", error);
// // // //   } finally {
// // // //     setTasksLoading(false);
// // // //   }
// // // // };
// // // //   const loadTemplates = async () => {
// // // //     try {
// // // //       const token = localStorage.getItem("token");

// // // //       const response = await fetch(`${API_URL}/task-templates`, {
// // // //         method: "GET",
// // // //         headers: {
// // // //           "Content-Type": "application/json",
// // // //           Authorization: `Bearer ${token}`,
// // // //         },
// // // //       });

// // // //       if (response.status === 403) {
// // // //         setTemplatesAvailable(false);
// // // //         return;
// // // //       }

// // // //       const data = await response.json();

// // // //       if (!response.ok) {
// // // //         throw new Error(data.message || "Failed to load templates");
// // // //       }

// // // //       const activeOnly = data.filter((t) => t.is_active !== 0 && t.is_active !== false);
// // // //       setTemplates(activeOnly);
// // // //     } catch (error) {
// // // //       console.log("Templates error:", error);
// // // //       setTemplatesAvailable(false);
// // // //     } finally {
// // // //       setTemplatesLoading(false);
// // // //     }
// // // //   };

// // // //   const styleBlock = (
// // // //     <style>{`
// // // //       @keyframes cardIn {
// // // //         from { opacity: 0; transform: translateY(14px); }
// // // //         to { opacity: 1; transform: translateY(0); }
// // // //       }
// // // //       .card-in { animation: cardIn 0.5s cubic-bezier(.16,1,.3,1) both; }

// // // //       @keyframes rowIn {
// // // //         from { opacity: 0; transform: translateX(-8px); }
// // // //         to { opacity: 1; transform: translateX(0); }
// // // //       }
// // // //       .row-in { animation: rowIn 0.4s ease both; }

// // // //       @media (prefers-reduced-motion: reduce) {
// // // //         .card-in, .row-in { animation: none; }
// // // //       }
// // // //     `}</style>
// // // //   );

// // // //   // ==============================================
// // // //   // LOADING
// // // //   // ==============================================
// // // //   // if (loading) {
// // // //   //   return (
// // // //   //     <div className="animate-pulse">
// // // //   //       {styleBlock}
// // // //   //       <div className="h-40 bg-white rounded-3xl border border-slate-200 mb-6" />
// // // //   //       <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
// // // //   //         {[0, 1, 2, 3].map((i) => (
// // // //   //           <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200" />
// // // //   //         ))}
// // // //   //       </div>
// // // //   //     </div>
// // // //   //   );
// // // //   // }
// // // //   if (loading) {
// // // //     return (
// // // //       <div className="animate-pulse">
// // // //         {styleBlock}
// // // //         <div className="h-40 bg-white rounded-3xl border border-slate-200 mb-6" />
// // // //         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
// // // //           {[0, 1, 2, 3].map((i) => (
// // // //             <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200" />
// // // //           ))}
// // // //         </div>
// // // //       </div>
// // // //     );
// // // // }

// // // //   // ==============================================
// // // //   // ERROR
// // // //   // ==============================================
// // // //   if (error) {
// // // //     return (
// // // //       <div className="bg-white border border-red-100 rounded-2xl p-8 max-w-md shadow-[0_8px_30px_rgba(23,32,51,.06)]">
// // // //         <p className="text-red-500 font-semibold text-sm mb-4">{error}</p>
// // // //         <button
// // // //           onClick={loadDashboard}
// // // //           className="px-4 py-2.5 rounded-xl bg-[#172033] text-white text-sm font-bold hover:opacity-90 transition-opacity"
// // // //         >
// // // //           Try again
// // // //         </button>
// // // //       </div>
// // // //     );
// // // //   }

// // // //   const handleQuickTask = async (template) => {
// // // //     try {
// // // //       const token = localStorage.getItem("token");

// // // //       const response = await fetch(
// // // //         "https://hatbox-scanner-subscribe.ngrok-free.dev/api/tasks/quick-create",
// // // //         {
// // // //           method: "POST",
// // // //           headers: {
// // // //             "Content-Type": "application/json",
// // // //             Authorization: `Bearer ${token}`,
// // // //           },
// // // //           body: JSON.stringify({
// // // //             template_id: template.id,
// // // //           }),
// // // //         }
// // // //       );

// // // //       const data = await response.json();

// // // //       if (!response.ok) {
// // // //         throw new Error(
// // // //           data.message || "Failed to create task"
// // // //         );
// // // //       }

// // // //       alert(
// // // //         `"${template.name}" created and assigned successfully`
// // // //       );

// // // //       // Refresh dashboard counts
// // // //       loadDashboard();

// // // //       // Refresh recent tasks
// // // //       loadRecentTasks();

// // // //     } catch (error) {
// // // //       console.error("Quick task error:", error);

// // // //       alert(
// // // //         error.message || "Failed to create quick task"
// // // //       );
// // // //     }
// // // //   };

// // // //   // ==============================================
// // // //   // DASHBOARD
// // // //   // ==============================================
// // // // //   return (
// // // // //     <div className="grid xl:grid-cols-[1fr_320px] gap-6">
// // // // //       {styleBlock}

// // // // //       <div className="min-w-0">
// // // // //         {/* Hero banner */}
// // // // //         <div className="card-in rounded-3xl border border-violet-100 p-6 md:p-7 shadow-[0_18px_50px_rgba(23,32,51,.08)] mb-6 bg-[radial-gradient(circle_at_85%_10%,rgba(108,92,231,.16),transparent_28%),linear-gradient(135deg,#ffffff,#f8f7ff)] hover:shadow-lg transition-shadow duration-300">
// // // // //           <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
// // // // //             <div>
// // // // //               <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-violet-100 text-violet-600 text-xs font-bold mb-4">
// // // // //                 <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
// // // // //                 All services operational
// // // // //               </div>
// // // // //               <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#172033]">
// // // // //                 Make every request feel effortless.
// // // // //               </h1>
// // // // //               <p className="text-slate-500 mt-2 max-w-xl">
// // // // //                 Coordinate employees, managers and butlers from one simple service workspace.
// // // // //               </p>
// // // // //             </div>
// // // // //             {(currentUserRole !== "Butler") && (
// // // // //               <button
// // // // //                 onClick={() => navigate("/tasks/create")}
// // // // //                 className="shrink-0 px-5 py-3 rounded-2xl bg-[#6C5CE7] text-white font-bold shadow-lg shadow-violet-200 hover:-translate-y-1 hover:shadow-xl transition-all whitespace-nowrap">
// // // // //                 + New Request
// // // // //               </button>
// // // // //             )}
// // // // //           </div>
// // // // //         </div>

// // // // //         {/* Stat cards — fixed label row keeps every number on the same baseline */}
// // // // //         <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
// // // // //           {STAT_CARDS.map((card, i) => {
// // // // //             const Icon = card.icon;
// // // // //             return (
// // // // //               <div
// // // // //                 key={card.key}
// // // // //                 className="card-in bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_8px_30px_rgba(23,32,51,.06)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
// // // // //                 style={{ animationDelay: `${i * 70}ms` }}
// // // // //               >
// // // // //                 <div className="flex items-center justify-between gap-2 h-5">
// // // // //                   <div className="text-[10px] font-extrabold tracking-[0.06em] text-slate-400 whitespace-nowrap">
// // // // //                     {card.label}
// // // // //                   </div>
// // // // //                   <Icon className={`w-4 h-4 shrink-0 ${card.color}`} />
// // // // //                 </div>
// // // // //                 <div className="text-3xl font-black mt-3 text-[#172033] tabular-nums leading-none">
// // // // //                   <AnimatedNumber value={dashboard[card.key] ?? 0} pad />
// // // // //                 </div>
// // // // //                 <div className={`text-xs mt-2 whitespace-nowrap ${card.subColor}`}>
// // // // //                   {card.sub(dashboard)}
// // // // //                 </div>
// // // // //               </div>
// // // // //             );
// // // // //           })}
// // // // //         </div>

// // // // //         {/* Live requests */}
// // // // //         <div
// // // // //           className="card-in bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(23,32,51,.06)] overflow-hidden"
// // // // //           style={{ animationDelay: "220ms" }}
// // // // //         >
// // // // //           <div className="p-5 border-b border-slate-100 flex items-center justify-between">
// // // // //             <div>
// // // // //               <h2 className="font-black text-lg text-[#172033]">Live requests</h2>
// // // // //               <p className="text-xs text-slate-400 mt-1">Latest service activity</p>
// // // // //             </div>
// // // // //             <button
// // // // //               onClick={() => navigate("/tasks")}
// // // // //               className="text-sm font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 group"
// // // // //             >
// // // // //               View all
// // // // //               <span className="group-hover:translate-x-0.5 transition-transform">→</span>
// // // // //             </button>
// // // // //           </div>

// // // // //           {tasksLoading ? (
// // // // //             <div className="p-5 space-y-3">
// // // // //               {[0, 1, 2].map((i) => (
// // // // //                 <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
// // // // //               ))}
// // // // //             </div>
// // // // //           ) : recentTasks.length === 0 ? (
// // // // //             <div className="p-10 flex flex-col items-center text-center gap-2">
// // // // //               <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-500 grid place-items-center mb-2">
// // // // //                 <ClipboardList className="w-5 h-5" />
// // // // //               </div>
// // // // //               <p className="text-sm font-semibold text-slate-600">No requests yet</p>
// // // // //               <p className="text-xs text-slate-400 max-w-xs">
// // // // //                 Created requests will show up here as they come in.
// // // // //               </p>
// // // // //             </div>
// // // // //           ) : (
// // // // //             <div className="divide-y divide-slate-100">
// // // // //               {recentTasks.map((task, i) => {
// // // // //                 const Icon = getRequestIcon(task);
// // // // //                 const reqId = `REQ-${String(task.id).padStart(4, "0")}`;
// // // // //                 return (
// // // // //                   <button
// // // // //                     key={task.id}
// // // // //                     onClick={() => navigate(`/tasks/${task.id}`)}
// // // // //                     className="row-in w-full flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors text-left group"
// // // // //                     style={{ animationDelay: `${260 + i * 60}ms` }}
// // // // //                   >
// // // // //                     <span className="w-11 h-11 rounded-2xl bg-violet-50 text-violet-500 grid place-items-center shrink-0 group-hover:scale-105 group-hover:bg-violet-100 transition-all">
// // // // //                       <Icon className="w-[18px] h-[18px]" />
// // // // //                     </span>

// // // // //                     <div className="min-w-0 flex-1">
// // // // //                       <p className="text-sm font-bold text-[#172033] truncate">{task.title}</p>
// // // // //                       <p className="text-xs text-slate-400 mt-0.5 truncate">
// // // // //                         {reqId}
// // // // //                         {task.assigned_by_name ? ` · ${task.assigned_by_name}` : ""}
// // // // //                         {task.assigned_to_name ? ` · Butler ${task.assigned_to_name}` : ""}
// // // // //                       </p>
// // // // //                     </div>

// // // // //                     {/* Fixed-width columns so pills line up down the list */}
// // // // //                     <div className="hidden sm:flex items-center gap-2 shrink-0">
// // // // //                       <div className="w-[112px]">
// // // // //                         <StatusPill status={task.status} />
// // // // //                       </div>
// // // // //                       <div className="w-[84px]">
// // // // //                         <PriorityPill priority={task.priority} />
// // // // //                       </div>
// // // // //                     </div>
// // // // //                   </button>
// // // // //                 );
// // // // //               })}
// // // // //             </div>
// // // // //           )}
// // // // //         </div>
// // // // //       </div>

// // // // //       {/* Right column */}
// // // // //       <aside className="space-y-5 min-w-0">
// // // // //         <div
// // // // //           className="card-in bg-[#172033] text-white rounded-3xl p-6 shadow-[0_18px_50px_rgba(23,32,51,.08)] hover:shadow-xl transition-shadow duration-300"
// // // // //           style={{ animationDelay: "140ms" }}
// // // // //         >
// // // // //           <div className="flex items-center justify-between">
// // // // //             <span className="text-xs font-bold text-slate-300">TASK OVERVIEW</span>
// // // // //             <Activity className="w-4 h-4 text-cyan-300" />
// // // // //           </div>
// // // // //           <div className="flex items-end gap-2 mt-5">
// // // // //             <span className="text-4xl font-black tabular-nums leading-none">
// // // // //               <AnimatedNumber value={dashboard.totalTasks ?? 0} />
// // // // //             </span>
// // // // //             <span className="text-sm text-slate-400">total tasks</span>
// // // // //           </div>
// // // // //           <div className="h-2 bg-white/10 rounded-full mt-5 overflow-hidden">
// // // // //             <div
// // // // //               className="h-full bg-cyan-400 rounded-full transition-all duration-700"
// // // // //               style={{
// // // // //                 width: `${dashboard.totalTasks
// // // // //                     ? Math.round((dashboard.completedTasks / dashboard.totalTasks) * 100)
// // // // //                     : 0
// // // // //                   }%`,
// // // // //               }}
// // // // //             />
// // // // //           </div>
// // // // //           <div className="flex justify-between text-xs text-slate-400 mt-2">
// // // // //             <span>{dashboard.completedTasks ?? 0} completed</span>
// // // // //             <span>{dashboard.totalTasks ?? 0} total</span>
// // // // //           </div>
// // // // //         </div>

// // // // //         {templatesAvailable && (
// // // // //           <div
// // // // //             className="card-in bg-white rounded-3xl border border-slate-200 p-5 shadow-[0_8px_30px_rgba(23,32,51,.06)] hover:shadow-lg transition-shadow duration-300"
// // // // //             style={{ animationDelay: "200ms" }}
// // // // //           >
// // // // //             <div className="flex justify-between items-center mb-4">
// // // // //               <h2 className="font-black text-[#172033]">Quick tasks</h2>
// // // // //               <Sparkles className="w-4 h-4 text-violet-500" />
// // // // //             </div>

// // // // //             {templatesLoading ? (
// // // // //               <div className="space-y-2">
// // // // //                 {[0, 1, 2].map((i) => (
// // // // //                   <div key={i} className="h-14 bg-slate-100 rounded-2xl animate-pulse" />
// // // // //                 ))}
// // // // //               </div>
// // // // //             ) : templates.length === 0 ? (
// // // // //               <p className="text-xs text-slate-400">No active templates yet.</p>
// // // // //             ) : (
// // // // //               <div className="space-y-2">
// // // // //                 {templates.map((t, i) => {
// // // // //                   const Icon = getTemplateIcon(t.category);
// // // // //                   const style = TEMPLATE_ICON_STYLES[i % TEMPLATE_ICON_STYLES.length];
// // // // //                   return (
// // // // //                     <button
// // // // //                       key={t.id}
// // // // //                       onClick={() => handleQuickTask(t)}
// // // // //                       className="row-in w-full text-left p-3 rounded-2xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/50 flex items-center gap-3 transition-all hover:-translate-y-0.5"
// // // // //                       style={{ animationDelay: `${240 + i * 60}ms` }}
// // // // //                     >
// // // // //                       <span
// // // // //                         className={`w-9 h-9 rounded-xl ${style.bg} ${style.fg} grid place-items-center shrink-0`}
// // // // //                       >
// // // // //                         <Icon className="w-4 h-4" />
// // // // //                       </span>

// // // // //                       <span className="min-w-0">
// // // // //                         <b className="text-sm block text-[#172033] truncate">
// // // // //                           {t.name}
// // // // //                         </b>

// // // // //                         <small className="block text-xs text-slate-400 truncate">
// // // // //                           {t.category || "General"}
// // // // //                         </small>
// // // // //                       </span>
// // // // //                     </button>
// // // // //                   );
// // // // //                 })}
// // // // //               </div>
// // // // //             )}
// // // // //           </div>
// // // // //         )}
// // // // //       </aside>
// // // // //     </div>
// // // // //   );
// // // // // }
// // // // return (
// // // //   <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
// // // //     {styleBlock}

// // // //     {/* QUICK CALL — always first on mobile, top of right column on desktop */}
// // // //     {currentUserRole !== "Butler" && (
// // // //       <div className="order-1 lg:order-1 lg:col-start-2">
// // // //         <QuickCallButton />
// // // //       </div>
// // // //     )}

// // // //     {/* QUICK TASKS — second on mobile */}
// // // //     {templatesAvailable && (
// // // //       <div
// // // //         className="order-2 lg:order-3 lg:col-start-2 card-in bg-white rounded-3xl border border-slate-200 p-5 shadow-[0_8px_30px_rgba(23,32,51,.06)] hover:shadow-lg transition-shadow duration-300"
// // // //         style={{ animationDelay: "200ms" }}
// // // //       >
// // // //         <div className="flex justify-between items-center mb-4">
// // // //           <h2 className="font-black text-[#172033]">Quick tasks</h2>
// // // //           <Sparkles className="w-4 h-4 text-violet-500" />
// // // //         </div>

// // // //         {templatesLoading ? (
// // // //           <div className="space-y-2">
// // // //             {[0, 1, 2].map((i) => (
// // // //               <div key={i} className="h-14 bg-slate-100 rounded-2xl animate-pulse" />
// // // //             ))}
// // // //           </div>
// // // //         ) : templates.length === 0 ? (
// // // //           <p className="text-xs text-slate-400">No active templates yet.</p>
// // // //         ) : (
// // // //           <div className="space-y-2">
// // // //             {templates.map((t, i) => {
// // // //               const Icon = getTemplateIcon(t.category);
// // // //               const style = TEMPLATE_ICON_STYLES[i % TEMPLATE_ICON_STYLES.length];
// // // //               return (
// // // //                 <button
// // // //                   key={t.id}
// // // //                   onClick={() => handleQuickTask(t)}
// // // //                   className="row-in w-full text-left p-3 rounded-2xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/50 flex items-center gap-3 transition-all hover:-translate-y-0.5"
// // // //                   style={{ animationDelay: `${240 + i * 60}ms` }}
// // // //                 >
// // // //                   <span className={`w-9 h-9 rounded-xl ${style.bg} ${style.fg} grid place-items-center shrink-0`}>
// // // //                     <Icon className="w-4 h-4" />
// // // //                   </span>
// // // //                   <span className="min-w-0">
// // // //                     <b className="text-sm block text-[#172033] truncate">{t.name}</b>
// // // //                     <small className="block text-xs text-slate-400 truncate">
// // // //                       {t.category || "General"}
// // // //                     </small>
// // // //                   </span>
// // // //                 </button>
// // // //               );
// // // //             })}
// // // //           </div>
// // // //         )}
// // // //       </div>
// // // //     )}

// // // //     {/* LIVE REQUESTS — third on mobile */}
// // // //     <div
// // // //       className="order-3 lg:order-3 lg:col-start-1 card-in bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(23,32,51,.06)] overflow-hidden"
// // // //       style={{ animationDelay: "220ms" }}
// // // //     >
// // // //       <div className="p-5 border-b border-slate-100 flex items-center justify-between">
// // // //         <div>
// // // //           <h2 className="font-black text-lg text-[#172033]">Live requests</h2>
// // // //           <p className="text-xs text-slate-400 mt-1">Latest service activity</p>
// // // //         </div>
// // // //         <button
// // // //           onClick={() => navigate("/tasks")}
// // // //           className="text-sm font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 group"
// // // //         >
// // // //           View all
// // // //           <span className="group-hover:translate-x-0.5 transition-transform">→</span>
// // // //         </button>
// // // //       </div>

// // // //       {tasksLoading ? (
// // // //         <div className="p-5 space-y-3">
// // // //           {[0, 1, 2].map((i) => (
// // // //             <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
// // // //           ))}
// // // //         </div>
// // // //       ) : recentTasks.length === 0 ? (
// // // //         <div className="p-10 flex flex-col items-center text-center gap-2">
// // // //           <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-500 grid place-items-center mb-2">
// // // //             <ClipboardList className="w-5 h-5" />
// // // //           </div>
// // // //           <p className="text-sm font-semibold text-slate-600">No requests yet</p>
// // // //           <p className="text-xs text-slate-400 max-w-xs">
// // // //             Created requests will show up here as they come in.
// // // //           </p>
// // // //         </div>
// // // //       ) : (
// // // //         <div className="divide-y divide-slate-100">
// // // //           {recentTasks.map((task, i) => {
// // // //             const Icon = getRequestIcon(task);
// // // //             const reqId = `REQ-${String(task.id).padStart(4, "0")}`;

// // // //             return (
// // // //               <div
// // // //                 key={task.id}
// // // //                 onClick={() => navigate(`/tasks/${task.id}`)}
// // // //                 className="row-in w-full flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer group"
// // // //                 style={{ animationDelay: `${260 + i * 60}ms` }}
// // // //               >
// // // //                 <div className="flex items-center gap-4 flex-1 min-w-0">
// // // //                   <span className="w-11 h-11 rounded-2xl bg-violet-50 text-violet-500 grid place-items-center shrink-0 group-hover:scale-105 group-hover:bg-violet-100 transition-all">
// // // //                     <Icon className="w-[18px] h-[18px]" />
// // // //                   </span>
// // // //                   <div className="min-w-0 flex-1">
// // // //                     <p className="text-sm font-bold text-[#172033] truncate">{task.title}</p>
// // // //                     <p className="text-xs text-slate-400 mt-0.5 truncate">
// // // //                       {reqId}
// // // //                       {task.assigned_by_name ? ` · ${task.assigned_by_name}` : ""}
// // // //                       {task.assigned_to_name ? ` · Butler ${task.assigned_to_name}` : ""}
// // // //                     </p>
// // // //                   </div>
// // // //                 </div>

// // // //                 <div className="hidden sm:flex items-center gap-2 shrink-0">
// // // //                   <div className="w-[112px]">
// // // //                     <StatusPill status={task.status} />
// // // //                   </div>
// // // //                   <div className="w-[84px]">
// // // //                     <PriorityPill priority={task.priority} />
// // // //                   </div>
// // // //                 </div>

// // // //                 {currentUserRole === "Butler" && (
// // // //                   <div
// // // //                     className="flex gap-2 shrink-0"
// // // //                     onClick={(e) => e.stopPropagation()}
// // // //                   >
// // // //                     {task.status === "Assigned" && (
// // // //                       <>
// // // //                         <button
// // // //                           onClick={() => updateTaskStatus(task.id, "Accepted")}
// // // //                           disabled={updatingTaskId === task.id}
// // // //                           className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100 disabled:opacity-40"
// // // //                         >
// // // //                           Accept
// // // //                         </button>
// // // //                         <button
// // // //                           onClick={() => updateTaskStatus(task.id, "Rejected")}
// // // //                           disabled={updatingTaskId === task.id}
// // // //                           className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 disabled:opacity-40"
// // // //                         >
// // // //                           Reject
// // // //                         </button>
// // // //                       </>
// // // //                     )}
// // // //                     {task.status === "Accepted" && (
// // // //                       <button
// // // //                         onClick={() => updateTaskStatus(task.id, "In-Progress")}
// // // //                         disabled={updatingTaskId === task.id}
// // // //                         className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 text-xs font-bold hover:bg-orange-100 disabled:opacity-40"
// // // //                       >
// // // //                         Start
// // // //                       </button>
// // // //                     )}
// // // //                     {task.status === "In-Progress" && (
// // // //                       <button
// // // //                         onClick={() => updateTaskStatus(task.id, "Completed")}
// // // //                         disabled={updatingTaskId === task.id}
// // // //                         className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold hover:bg-emerald-100 disabled:opacity-40"
// // // //                       >
// // // //                         Complete
// // // //                       </button>
// // // //                     )}
// // // //                   </div>
// // // //                 )}
// // // //               </div>
// // // //             );
// // // //           })}
// // // //         </div>
// // // //       )}
// // // //     </div>

// // // //     {/* STAT CARDS — fourth on mobile */}
// // // //     <div className="order-4 lg:order-2 lg:col-start-1 grid grid-cols-2 lg:grid-cols-4 gap-4">
// // // //       {STAT_CARDS.map((card, i) => {
// // // //         const Icon = card.icon;
// // // //         return (
// // // //           <div
// // // //             key={card.key}
// // // //             className="card-in bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_8px_30px_rgba(23,32,51,.06)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
// // // //             style={{ animationDelay: `${i * 70}ms` }}
// // // //           >
// // // //             <div className="flex items-center justify-between gap-2 h-5">
// // // //               <div className="text-[10px] font-extrabold tracking-[0.06em] text-slate-400 whitespace-nowrap">
// // // //                 {card.label}
// // // //               </div>
// // // //               <Icon className={`w-4 h-4 shrink-0 ${card.color}`} />
// // // //             </div>
// // // //             <div className="text-3xl font-black mt-3 text-[#172033] tabular-nums leading-none">
// // // //               <AnimatedNumber value={dashboard[card.key] ?? 0} pad />
// // // //             </div>
// // // //             <div className={`text-xs mt-2 whitespace-nowrap ${card.subColor}`}>
// // // //               {card.sub(dashboard)}
// // // //             </div>
// // // //           </div>
// // // //         );
// // // //       })}
// // // //     </div>

// // // //     {/* TASK OVERVIEW — fifth on mobile */}
// // // //     <div
// // // //       className="order-5 lg:order-2 lg:col-start-2 card-in bg-[#172033] text-white rounded-3xl p-6 shadow-[0_18px_50px_rgba(23,32,51,.08)] hover:shadow-xl transition-shadow duration-300"
// // // //       style={{ animationDelay: "140ms" }}
// // // //     >
// // // //       <div className="flex items-center justify-between">
// // // //         <span className="text-xs font-bold text-slate-300">TASK OVERVIEW</span>
// // // //         <Activity className="w-4 h-4 text-cyan-300" />
// // // //       </div>
// // // //       <div className="flex items-end gap-2 mt-5">
// // // //         <span className="text-4xl font-black tabular-nums leading-none">
// // // //           <AnimatedNumber value={dashboard.totalTasks ?? 0} />
// // // //         </span>
// // // //         <span className="text-sm text-slate-400">total tasks</span>
// // // //       </div>
// // // //       <div className="h-2 bg-white/10 rounded-full mt-5 overflow-hidden">
// // // //         <div
// // // //           className="h-full bg-cyan-400 rounded-full transition-all duration-700"
// // // //           style={{
// // // //             width: `${
// // // //               dashboard.totalTasks
// // // //                 ? Math.round((dashboard.completedTasks / dashboard.totalTasks) * 100)
// // // //                 : 0
// // // //             }%`,
// // // //           }}
// // // //         />
// // // //       </div>
// // // //       <div className="flex justify-between text-xs text-slate-400 mt-2">
// // // //         <span>{dashboard.completedTasks ?? 0} completed</span>
// // // //         <span>{dashboard.totalTasks ?? 0} total</span>
// // // //       </div>
// // // //     </div>

// // // //     {/* HERO BANNER — last on mobile, first on desktop */}
// // // //     <div
// // // //       className="order-6 lg:order-1 lg:col-start-1 card-in rounded-3xl border border-violet-100 p-6 md:p-7 shadow-[0_18px_50px_rgba(23,32,51,.08)] bg-[radial-gradient(circle_at_85%_10%,rgba(108,92,231,.16),transparent_28%),linear-gradient(135deg,#ffffff,#f8f7ff)] hover:shadow-lg transition-shadow duration-300"
// // // //     >
// // // //       <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
// // // //         <div>
// // // //           <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-violet-100 text-violet-600 text-xs font-bold mb-4">
// // // //             <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
// // // //             All services operational
// // // //           </div>
// // // //           <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#172033]">
// // // //             Make every request feel effortless.
// // // //           </h1>
// // // //           <p className="text-slate-500 mt-2 max-w-xl">
// // // //             Coordinate employees, managers and butlers from one simple service workspace.
// // // //           </p>
// // // //         </div>
// // // //         {currentUserRole !== "Butler" && (
// // // //           <button
// // // //             onClick={() => navigate("/tasks/create")}
// // // //             className="shrink-0 px-5 py-3 rounded-2xl bg-[#6C5CE7] text-white font-bold shadow-lg shadow-violet-200 hover:-translate-y-1 hover:shadow-xl transition-all whitespace-nowrap"
// // // //           >
// // // //             + New Request
// // // //           </button>
// // // //         )}
// // // //       </div>
// // // //     </div>
// // // //   </div>
// // // // );
// // // // }
// // // // export default Dashboard;

// // // import { useEffect, useState, useRef } from "react";
// // // import { useNavigate } from "react-router-dom";
// // // import QuickCallButton from "../components/QuickCallButton";
// // // import { useTaskStatus } from "../hooks/useTaskStatus";
// // // import socket from "../socket";
// // // import {
// // //   Inbox,
// // //   LoaderCircle,
// // //   CircleCheck,
// // //   AlertTriangle,
// // //   ClipboardList,
// // //   Droplets,
// // //   Coffee,
// // //   UsersRound,
// // //   Package,
// // //   Sparkles,
// // //   Activity,
// // // } from "lucide-react";
// // // import { getDashboard } from "../services/api";

// // // const API_URL = "https://hatbox-scanner-subscribe.ngrok-free.dev/api";

// // // const currentUser = JSON.parse(localStorage.getItem("user") || "null");
// // // const currentUserRole = currentUser?.role;

// // // function AnimatedNumber({ value, pad = false }) {
// // //   const [display, setDisplay] = useState(0);
// // //   const startRef = useRef(null);

// // //   useEffect(() => {
// // //     const target = Number(value) || 0;
// // //     const duration = 700;
// // //     const step = (timestamp) => {
// // //       if (!startRef.current) startRef.current = timestamp;
// // //       const progress = Math.min((timestamp - startRef.current) / duration, 1);
// // //       const eased = 1 - Math.pow(1 - progress, 3);
// // //       setDisplay(Math.round(eased * target));
// // //       if (progress < 1) requestAnimationFrame(step);
// // //     };
// // //     startRef.current = null;
// // //     const raf = requestAnimationFrame(step);
// // //     return () => cancelAnimationFrame(raf);
// // //   }, [value]);

// // //   return <>{pad ? String(display).padStart(2, "0") : display}</>;
// // // }

// // // // Each card gets its own sub-line, like the reference — repeating
// // // // "11 total tasks" four times reads as a bug.
// // // const STAT_CARDS = [
// // //   {
// // //     key: "pendingTasks",
// // //     label: "OPEN REQUESTS",
// // //     icon: Inbox,
// // //     color: "text-violet-500",
// // //     sub: (d) => `of ${d.totalTasks ?? 0} total`,
// // //     subColor: "text-slate-400",
// // //   },
// // //   {
// // //     key: "inProgressTasks",
// // //     label: "IN PROGRESS",
// // //     icon: LoaderCircle,
// // //     color: "text-orange-500",
// // //     sub: () => "active right now",
// // //     subColor: "text-slate-400",
// // //   },
// // //   {
// // //     key: "completedTasks",
// // //     label: "COMPLETED",
// // //     icon: CircleCheck,
// // //     color: "text-emerald-500",
// // //     sub: (d) =>
// // //       d.totalTasks
// // //         ? `${Math.round((d.completedTasks / d.totalTasks) * 100)}% completed`
// // //         : "none yet",
// // //     subColor: "text-emerald-500",
// // //   },
// // //   {
// // //     key: "overdueTasks",
// // //     label: "OVERDUE",
// // //     icon: AlertTriangle,
// // //     color: "text-red-500",
// // //     sub: (d) => ((d.overdueTasks ?? 0) > 0 ? "needs attention" : "all on time"),
// // //     subColor: "text-slate-400",
// // //   },
// // // ];

// // // const STATUS_STYLES = {
// // //   Pending: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
// // //   "In-Progress": { bg: "bg-orange-50", text: "text-orange-600", dot: "bg-orange-500" },
// // //   Completed: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
// // // };

// // // const PRIORITY_STYLES = {
// // //   Low: "bg-slate-100 text-slate-600",
// // //   Medium: "bg-slate-100 text-slate-600",
// // //   High: "bg-orange-50 text-orange-600",
// // //   Urgent: "bg-red-50 text-red-600",
// // // };

// // // function StatusPill({ status }) {
// // //   const s = STATUS_STYLES[status] || { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" };
// // //   const label = status === "In-Progress" ? "In Progress" : status;
// // //   const pulsing = status === "In-Progress";
// // //   return (
// // //     <span
// // //       className={`inline-flex items-center justify-center gap-1.5 w-full px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${s.bg} ${s.text}`}
// // //     >
// // //       <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot} ${pulsing ? "animate-pulse" : ""}`} />
// // //       {label}
// // //     </span>
// // //   );
// // // }

// // // function PriorityPill({ priority }) {
// // //   if (!priority) return null;
// // //   return (
// // //     <span
// // //       className={`inline-flex items-center justify-center w-full px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${PRIORITY_STYLES[priority] || "bg-slate-100 text-slate-600"
// // //         }`}
// // //     >
// // //       {priority}
// // //     </span>
// // //   );
// // // }

// // // // Icon for a request row, guessed from its template/task type or title
// // // function getRequestIcon(task) {
// // //   const text = `${task.task_type || ""} ${task.title || ""}`.toLowerCase();
// // //   if (text.includes("guest") || text.includes("snack")) return UsersRound;
// // //   if (text.includes("package") || text.includes("courier") || text.includes("pickup") || text.includes("delivery")) return Package;
// // //   if (text.includes("coffee") || text.includes("tea")) return Coffee;
// // //   if (text.includes("water") || text.includes("bottle")) return Droplets;
// // //   return Sparkles;
// // // }

// // // function getTemplateIcon(category) {
// // //   const c = (category || "").toLowerCase();
// // //   if (c.includes("refresh")) return Coffee;
// // //   if (c.includes("guest")) return UsersRound;
// // //   if (c.includes("logistic")) return Package;
// // //   return Sparkles;
// // // }

// // // const TEMPLATE_ICON_STYLES = [
// // //   { bg: "bg-blue-50", fg: "text-blue-600" },
// // //   { bg: "bg-orange-50", fg: "text-orange-600" },
// // //   { bg: "bg-emerald-50", fg: "text-emerald-600" },
// // //   { bg: "bg-violet-50", fg: "text-violet-600" },
// // // ];

// // // function Dashboard() {
// // //   const [dashboard, setDashboard] = useState(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [error, setError] = useState("");
// // //   const navigate = useNavigate();

// // //   const [recentTasks, setRecentTasks] = useState([]);
// // //   const [tasksLoading, setTasksLoading] = useState(true);

// // //   const [templates, setTemplates] = useState([]);
// // //   const [templatesLoading, setTemplatesLoading] = useState(true);
// // //   const [templatesAvailable, setTemplatesAvailable] = useState(true);

// // //   useEffect(() => {
// // //     loadDashboard();
// // //     loadRecentTasks();
// // //     loadTemplates();
// // //   }, []);

// // //   useEffect(() => {
// // //     const handleTaskCreated = (newTask) => {
// // //       setRecentTasks((prev) => [newTask, ...prev].slice(0, 5));
// // //       setDashboard((prev) =>
// // //         prev
// // //           ? {
// // //               ...prev,
// // //               totalTasks: (prev.totalTasks ?? 0) + 1,
// // //               pendingTasks: (prev.pendingTasks ?? 0) + 1,
// // //             }
// // //           : prev
// // //       );
// // //     };

// // //     const handleTaskUpdated = ({ id, status, oldStatus }) => {
// // //   setRecentTasks((prev) => {
// // //     if (status === "Completed" || status === "Rejected") {
// // //       return prev.filter((t) => t.id !== id);
// // //     }
// // //     return prev.map((t) => (t.id === id ? { ...t, status } : t));
// // //   });

// // //       setDashboard((prev) => {
// // //         if (!prev) return prev;
// // //         const next = { ...prev };

// // //         const decrementFor = (s) => {
// // //           if (s === "Assigned") next.pendingTasks = Math.max(0, (next.pendingTasks ?? 0) - 1);
// // //           if (s === "In-Progress") next.inProgressTasks = Math.max(0, (next.inProgressTasks ?? 0) - 1);
// // //           if (s === "Completed") next.completedTasks = Math.max(0, (next.completedTasks ?? 0) - 1);
// // //         };
// // //         const incrementFor = (s) => {
// // //           if (s === "Assigned") next.pendingTasks = (next.pendingTasks ?? 0) + 1;
// // //           if (s === "In-Progress") next.inProgressTasks = (next.inProgressTasks ?? 0) + 1;
// // //           if (s === "Completed") next.completedTasks = (next.completedTasks ?? 0) + 1;
// // //         };

// // //         decrementFor(oldStatus);
// // //         incrementFor(status);

// // //         return next;
// // //       });
// // //     };

// // //     socket.on("task_created", handleTaskCreated);
// // //     socket.on("task_updated", handleTaskUpdated);

// // //     return () => {
// // //       socket.off("task_created", handleTaskCreated);
// // //       socket.off("task_updated", handleTaskUpdated);
// // //     };
// // //   }, []);

// // //   const { updateTaskStatus, updatingTaskId } = useTaskStatus((taskId, newStatus) => {
// // //     setRecentTasks((prev) =>
// // //       prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
// // //     );
// // //   });

// // //   const loadDashboard = async () => {
// // //     try {
// // //       const data = await getDashboard();
// // //       console.log("Dashboard data:", data);
// // //       setDashboard(data);
// // //     } catch (error) {
// // //       console.log("Dashboard error:", error);
// // //       setError(error.message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   };

// // //   const loadRecentTasks = async () => {
// // //     try {
// // //       const token = localStorage.getItem("token");

// // //       const response = await fetch(`${API_URL}/tasks`, {
// // //         method: "GET",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //           Authorization: `Bearer ${token}`,
// // //         },
// // //       });

// // //       const data = await response.json();

// // //       if (!response.ok) {
// // //         throw new Error(data.message || "Failed to load tasks");
// // //       }

// // //       const activeOnly = data.filter(
// // //   (task) => task.status !== "Completed" && task.status !== "Rejected"
// // // );

// // //       setRecentTasks(activeOnly.slice(0, 5));
// // //     } catch (error) {
// // //       console.log("Recent tasks error:", error);
// // //     } finally {
// // //       setTasksLoading(false);
// // //     }
// // //   };

// // //   const loadTemplates = async () => {
// // //     try {
// // //       const token = localStorage.getItem("token");

// // //       const response = await fetch(`${API_URL}/task-templates`, {
// // //         method: "GET",
// // //         headers: {
// // //           "Content-Type": "application/json",
// // //           Authorization: `Bearer ${token}`,
// // //         },
// // //       });

// // //       if (response.status === 403) {
// // //         setTemplatesAvailable(false);
// // //         return;
// // //       }

// // //       const data = await response.json();

// // //       if (!response.ok) {
// // //         throw new Error(data.message || "Failed to load templates");
// // //       }

// // //       const activeOnly = data.filter((t) => t.is_active !== 0 && t.is_active !== false);
// // //       setTemplates(activeOnly);
// // //     } catch (error) {
// // //       console.log("Templates error:", error);
// // //       setTemplatesAvailable(false);
// // //     } finally {
// // //       setTemplatesLoading(false);
// // //     }
// // //   };

// // //   const styleBlock = (
// // //     <style>{`
// // //       @keyframes cardIn {
// // //         from { opacity: 0; transform: translateY(14px); }
// // //         to { opacity: 1; transform: translateY(0); }
// // //       }
// // //       .card-in { animation: cardIn 0.5s cubic-bezier(.16,1,.3,1) both; }

// // //       @keyframes rowIn {
// // //         from { opacity: 0; transform: translateX(-8px); }
// // //         to { opacity: 1; transform: translateX(0); }
// // //       }
// // //       .row-in { animation: rowIn 0.4s ease both; }

// // //       @media (prefers-reduced-motion: reduce) {
// // //         .card-in, .row-in { animation: none; }
// // //       }

// // //       /* ---------------------------------------------------------
// // //          Layout grid — grid-template-areas instead of order/col-start.
// // //          Same single-column stacking order at every breakpoint:
// // //          quickcall -> quicktasks -> liverequests -> statcards ->
// // //          taskoverview -> hero. Desktop just gets a wider, centered
// // //          column instead of switching to a 2-column layout.
// // //          --------------------------------------------------------- */
// // //       .dash-grid {
// // //         display: grid;
// // //         grid-template-columns: 1fr;
// // //         gap: 1.5rem;
// // //         grid-template-areas:
// // //           "quickcall"
// // //           "quicktasks"
// // //           "liverequests"
// // //           "statcards"
// // //           "taskoverview"
// // //           "hero";
// // //       }
// // //       @media (min-width: 1024px) {
// // //         .dash-grid {
// // //           max-width: 900px;
// // //           margin: 0 auto;
// // //         }
// // //       }
// // //       .area-quickcall    { grid-area: quickcall; }
// // //       .area-quicktasks   { grid-area: quicktasks; }
// // //       .area-liverequests { grid-area: liverequests; }
// // //       .area-statcards    { grid-area: statcards; }
// // //       .area-taskoverview { grid-area: taskoverview; }
// // //       .area-hero         { grid-area: hero; }
// // //     `}</style>
// // //   );

// // //   // ==============================================
// // //   // LOADING
// // //   // ==============================================
// // //   if (loading) {
// // //     return (
// // //       <div className="animate-pulse">
// // //         {styleBlock}
// // //         <div className="h-40 bg-white rounded-3xl border border-slate-200 mb-6" />
// // //         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
// // //           {[0, 1, 2, 3].map((i) => (
// // //             <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200" />
// // //           ))}
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   // ==============================================
// // //   // ERROR
// // //   // ==============================================
// // //   if (error) {
// // //     return (
// // //       <div className="bg-white border border-red-100 rounded-2xl p-8 max-w-md shadow-[0_8px_30px_rgba(23,32,51,.06)]">
// // //         <p className="text-red-500 font-semibold text-sm mb-4">{error}</p>
// // //         <button
// // //           onClick={loadDashboard}
// // //           className="px-4 py-2.5 rounded-xl bg-[#172033] text-white text-sm font-bold hover:opacity-90 transition-opacity"
// // //         >
// // //           Try again
// // //         </button>
// // //       </div>
// // //     );
// // //   }

// // //   const handleQuickTask = async (template) => {
// // //     try {
// // //       const token = localStorage.getItem("token");

// // //       const response = await fetch(
// // //         "https://hatbox-scanner-subscribe.ngrok-free.dev/api/tasks/quick-create",
// // //         {
// // //           method: "POST",
// // //           headers: {
// // //             "Content-Type": "application/json",
// // //             Authorization: `Bearer ${token}`,
// // //           },
// // //           body: JSON.stringify({
// // //             template_id: template.id,
// // //           }),
// // //         }
// // //       );

// // //       const data = await response.json();

// // //       if (!response.ok) {
// // //         throw new Error(
// // //           data.message || "Failed to create task"
// // //         );
// // //       }

// // //       alert(
// // //         `"${template.name}" created and assigned successfully`
// // //       );

// // //       // Refresh dashboard counts
// // //       loadDashboard();

// // //       // Refresh recent tasks
// // //       loadRecentTasks();

// // //     } catch (error) {
// // //       console.error("Quick task error:", error);

// // //       alert(
// // //         error.message || "Failed to create quick task"
// // //       );
// // //     }
// // //   };

// // //   // ==============================================
// // //   // DASHBOARD
// // //   // ==============================================
// // //   return (
// // //     <div className="dash-grid">
// // //       {styleBlock}

// // //       {/* QUICK CALL */}
// // //       {currentUserRole !== "Butler" && (
// // //         <div className="area-quickcall">
// // //           <QuickCallButton />
// // //         </div>
// // //       )}

// // //       {/* QUICK TASKS */}
// // //       {templatesAvailable && (
// // //         <div
// // //           className="area-quicktasks card-in bg-white rounded-3xl border border-slate-200 p-5 shadow-[0_8px_30px_rgba(23,32,51,.06)] hover:shadow-lg transition-shadow duration-300"
// // //           style={{ animationDelay: "200ms" }}
// // //         >
// // //           <div className="flex justify-between items-center mb-4">
// // //             <h2 className="font-black text-[#172033]">Quick tasks</h2>
// // //             <Sparkles className="w-4 h-4 text-violet-500" />
// // //           </div>

// // //           {templatesLoading ? (
// // //             <div className="space-y-2">
// // //               {[0, 1, 2].map((i) => (
// // //                 <div key={i} className="h-14 bg-slate-100 rounded-2xl animate-pulse" />
// // //               ))}
// // //             </div>
// // //           ) : templates.length === 0 ? (
// // //             <p className="text-xs text-slate-400">No active templates yet.</p>
// // //           ) : (
// // //             <div className="space-y-2">
// // //               {templates.map((t, i) => {
// // //                 const Icon = getTemplateIcon(t.category);
// // //                 const style = TEMPLATE_ICON_STYLES[i % TEMPLATE_ICON_STYLES.length];
// // //                 return (
// // //                   <button
// // //                     key={t.id}
// // //                     onClick={() => handleQuickTask(t)}
// // //                     className="row-in w-full text-left p-3 rounded-2xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/50 flex items-center gap-3 transition-all hover:-translate-y-0.5"
// // //                     style={{ animationDelay: `${240 + i * 60}ms` }}
// // //                   >
// // //                     <span className={`w-9 h-9 rounded-xl ${style.bg} ${style.fg} grid place-items-center shrink-0`}>
// // //                       <Icon className="w-4 h-4" />
// // //                     </span>
// // //                     <span className="min-w-0">
// // //                       <b className="text-sm block text-[#172033] truncate">{t.name}</b>
// // //                       <small className="block text-xs text-slate-400 truncate">
// // //                         {t.category || "General"}
// // //                       </small>
// // //                     </span>
// // //                   </button>
// // //                 );
// // //               })}
// // //             </div>
// // //           )}
// // //         </div>
// // //       )}

// // //       {/* LIVE REQUESTS */}
// // //       <div
// // //         className="area-liverequests card-in bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(23,32,51,.06)] overflow-hidden"
// // //         style={{ animationDelay: "220ms" }}
// // //       >
// // //         <div className="p-5 border-b border-slate-100 flex items-center justify-between">
// // //           <div>
// // //             <h2 className="font-black text-lg text-[#172033]">Live requests</h2>
// // //             <p className="text-xs text-slate-400 mt-1">Latest service activity</p>
// // //           </div>
// // //           <button
// // //             onClick={() => navigate("/tasks")}
// // //             className="text-sm font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 group"
// // //           >
// // //             View all
// // //             <span className="group-hover:translate-x-0.5 transition-transform">→</span>
// // //           </button>
// // //         </div>

// // //         {tasksLoading ? (
// // //           <div className="p-5 space-y-3">
// // //             {[0, 1, 2].map((i) => (
// // //               <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
// // //             ))}
// // //           </div>
// // //         ) : recentTasks.length === 0 ? (
// // //           <div className="p-10 flex flex-col items-center text-center gap-2">
// // //             <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-500 grid place-items-center mb-2">
// // //               <ClipboardList className="w-5 h-5" />
// // //             </div>
// // //             <p className="text-sm font-semibold text-slate-600">No requests yet</p>
// // //             <p className="text-xs text-slate-400 max-w-xs">
// // //               Created requests will show up here as they come in.
// // //             </p>
// // //           </div>
// // //         ) : (
// // //           <div className="divide-y divide-slate-100">
// // //             {recentTasks.map((task, i) => {
// // //               const Icon = getRequestIcon(task);
// // //               const reqId = `REQ-${String(task.id).padStart(4, "0")}`;

// // //               return (
// // //                 <div
// // //                   key={task.id}
// // //                   onClick={() => navigate(`/tasks/${task.id}`)}
// // //                   className="row-in w-full flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer group"
// // //                   style={{ animationDelay: `${260 + i * 60}ms` }}
// // //                 >
// // //                   <div className="flex items-center gap-4 flex-1 min-w-0">
// // //                     <span className="w-11 h-11 rounded-2xl bg-violet-50 text-violet-500 grid place-items-center shrink-0 group-hover:scale-105 group-hover:bg-violet-100 transition-all">
// // //                       <Icon className="w-[18px] h-[18px]" />
// // //                     </span>
// // //                     <div className="min-w-0 flex-1">
// // //                       <p className="text-sm font-bold text-[#172033] truncate">{task.title}</p>
// // //                       <p className="text-xs text-slate-400 mt-0.5 truncate">
// // //                         {reqId}
// // //                         {task.assigned_by_name ? ` · ${task.assigned_by_name}` : ""}
// // //                         {task.assigned_to_name ? ` · Butler ${task.assigned_to_name}` : ""}
// // //                       </p>
// // //                     </div>
// // //                   </div>

// // //                   <div className="hidden sm:flex items-center gap-2 shrink-0">
// // //                     <div className="w-[112px]">
// // //                       <StatusPill status={task.status} />
// // //                     </div>
// // //                     <div className="w-[84px]">
// // //                       <PriorityPill priority={task.priority} />
// // //                     </div>
// // //                   </div>

// // //                   {currentUserRole === "Butler" && (
// // //                     <div
// // //                       className="flex gap-2 shrink-0"
// // //                       onClick={(e) => e.stopPropagation()}
// // //                     >
// // //                       {task.status === "Assigned" && (
// // //                         <>
// // //                           <button
// // //                             onClick={() => updateTaskStatus(task.id, "Accepted")}
// // //                             disabled={updatingTaskId === task.id}
// // //                             className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100 disabled:opacity-40"
// // //                           >
// // //                             Accept
// // //                           </button>
// // //                           <button
// // //                             onClick={() => updateTaskStatus(task.id, "Rejected")}
// // //                             disabled={updatingTaskId === task.id}
// // //                             className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 disabled:opacity-40"
// // //                           >
// // //                             Reject
// // //                           </button>
// // //                         </>
// // //                       )}
// // //                       {task.status === "Accepted" && (
// // //                         <button
// // //                           onClick={() => updateTaskStatus(task.id, "In-Progress")}
// // //                           disabled={updatingTaskId === task.id}
// // //                           className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 text-xs font-bold hover:bg-orange-100 disabled:opacity-40"
// // //                         >
// // //                           Start
// // //                         </button>
// // //                       )}
// // //                       {task.status === "In-Progress" && (
// // //                         <button
// // //                           onClick={() => updateTaskStatus(task.id, "Completed")}
// // //                           disabled={updatingTaskId === task.id}
// // //                           className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold hover:bg-emerald-100 disabled:opacity-40"
// // //                         >
// // //                           Complete
// // //                         </button>
// // //                       )}
// // //                     </div>
// // //                   )}
// // //                 </div>
// // //               );
// // //             })}
// // //           </div>
// // //         )}
// // //       </div>

// // //       {/* STAT CARDS */}
// // //       <div className="area-statcards grid grid-cols-2 lg:grid-cols-4 gap-4">
// // //         {STAT_CARDS.map((card, i) => {
// // //           const Icon = card.icon;
// // //           return (
// // //             <div
// // //               key={card.key}
// // //               className="card-in bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_8px_30px_rgba(23,32,51,.06)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
// // //               style={{ animationDelay: `${i * 70}ms` }}
// // //             >
// // //               <div className="flex items-center justify-between gap-2 h-5">
// // //                 <div className="text-[10px] font-extrabold tracking-[0.06em] text-slate-400 whitespace-nowrap">
// // //                   {card.label}
// // //                 </div>
// // //                 <Icon className={`w-4 h-4 shrink-0 ${card.color}`} />
// // //               </div>
// // //               <div className="text-3xl font-black mt-3 text-[#172033] tabular-nums leading-none">
// // //                 <AnimatedNumber value={dashboard[card.key] ?? 0} pad />
// // //               </div>
// // //               <div className={`text-xs mt-2 whitespace-nowrap ${card.subColor}`}>
// // //                 {card.sub(dashboard)}
// // //               </div>
// // //             </div>
// // //           );
// // //         })}
// // //       </div>

// // //       {/* TASK OVERVIEW */}
// // //       <div
// // //         className="area-taskoverview card-in bg-[#172033] text-white rounded-3xl p-6 shadow-[0_18px_50px_rgba(23,32,51,.08)] hover:shadow-xl transition-shadow duration-300"
// // //         style={{ animationDelay: "140ms" }}
// // //       >
// // //         <div className="flex items-center justify-between">
// // //           <span className="text-xs font-bold text-slate-300">TASK OVERVIEW</span>
// // //           <Activity className="w-4 h-4 text-cyan-300" />
// // //         </div>
// // //         <div className="flex items-end gap-2 mt-5">
// // //           <span className="text-4xl font-black tabular-nums leading-none">
// // //             <AnimatedNumber value={dashboard.totalTasks ?? 0} />
// // //           </span>
// // //           <span className="text-sm text-slate-400">total tasks</span>
// // //         </div>
// // //         <div className="h-2 bg-white/10 rounded-full mt-5 overflow-hidden">
// // //           <div
// // //             className="h-full bg-cyan-400 rounded-full transition-all duration-700"
// // //             style={{
// // //               width: `${
// // //                 dashboard.totalTasks
// // //                   ? Math.round((dashboard.completedTasks / dashboard.totalTasks) * 100)
// // //                   : 0
// // //               }%`,
// // //             }}
// // //           />
// // //         </div>
// // //         <div className="flex justify-between text-xs text-slate-400 mt-2">
// // //           <span>{dashboard.completedTasks ?? 0} completed</span>
// // //           <span>{dashboard.totalTasks ?? 0} total</span>
// // //         </div>
// // //       </div>

// // //       {/* HERO BANNER */}
// // //       <div className="area-hero card-in rounded-3xl border border-violet-100 p-6 md:p-7 shadow-[0_18px_50px_rgba(23,32,51,.08)] bg-[radial-gradient(circle_at_85%_10%,rgba(108,92,231,.16),transparent_28%),linear-gradient(135deg,#ffffff,#f8f7ff)] hover:shadow-lg transition-shadow duration-300">
// // //         <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
// // //           <div>
// // //             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-violet-100 text-violet-600 text-xs font-bold mb-4">
// // //               <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
// // //               All services operational
// // //             </div>
// // //             <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#172033]">
// // //               Make every request feel effortless.
// // //             </h1>
// // //             <p className="text-slate-500 mt-2 max-w-xl">
// // //               Coordinate employees, managers and butlers from one simple service workspace.
// // //             </p>
// // //           </div>
// // //           {currentUserRole !== "Butler" && (
// // //             <button
// // //               onClick={() => navigate("/tasks/create")}
// // //               className="shrink-0 px-5 py-3 rounded-2xl bg-[#6C5CE7] text-white font-bold shadow-lg shadow-violet-200 hover:-translate-y-1 hover:shadow-xl transition-all whitespace-nowrap"
// // //             >
// // //               + New Request
// // //             </button>
// // //           )}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default Dashboard;

// // import { useEffect, useState, useRef } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { useTranslation } from "react-i18next";
// // import QuickCallButton from "../components/QuickCallButton";
// // import { useTaskStatus } from "../hooks/useTaskStatus";
// // import socket from "../socket";
// // import {
// //   Inbox,
// //   LoaderCircle,
// //   CircleCheck,
// //   AlertTriangle,
// //   ClipboardList,
// //   Droplets,
// //   Coffee,
// //   UsersRound,
// //   Package,
// //   Sparkles,
// //   Activity,
// // } from "lucide-react";
// // import { getDashboard } from "../services/api";

// // const API_URL = "https://hatbox-scanner-subscribe.ngrok-free.dev/api";

// // const currentUser = JSON.parse(localStorage.getItem("user") || "null");
// // const currentUserRole = currentUser?.role;

// // function AnimatedNumber({ value, pad = false }) {
// //   const [display, setDisplay] = useState(0);
// //   const startRef = useRef(null);

// //   useEffect(() => {
// //     const target = Number(value) || 0;
// //     const duration = 700;
// //     const step = (timestamp) => {
// //       if (!startRef.current) startRef.current = timestamp;
// //       const progress = Math.min((timestamp - startRef.current) / duration, 1);
// //       const eased = 1 - Math.pow(1 - progress, 3);
// //       setDisplay(Math.round(eased * target));
// //       if (progress < 1) requestAnimationFrame(step);
// //     };
// //     startRef.current = null;
// //     const raf = requestAnimationFrame(step);
// //     return () => cancelAnimationFrame(raf);
// //   }, [value]);

// //   return <>{pad ? String(display).padStart(2, "0") : display}</>;
// // }

// // // STAT_CARDS now stores translation KEYS, not literal strings.
// // // "sub" returns a { key, options } pair so the component can call
// // // t(key, options) — this lets us pass {{count}} / {{percent}} through
// // // i18next's interpolation instead of building the string manually.
// // const STAT_CARDS = [
// //   {
// //     key: "pendingTasks",
// //     labelKey: "dashboard.stats.openRequests",
// //     icon: Inbox,
// //     color: "text-violet-500",
// //     sub: (d) => ({ key: "dashboard.stats.ofTotal", options: { count: d.totalTasks ?? 0 } }),
// //     subColor: "text-slate-400",
// //   },
// //   {
// //     key: "inProgressTasks",
// //     labelKey: "dashboard.stats.inProgress",
// //     icon: LoaderCircle,
// //     color: "text-orange-500",
// //     sub: () => ({ key: "dashboard.stats.activeNow" }),
// //     subColor: "text-slate-400",
// //   },
// //   {
// //     key: "completedTasks",
// //     labelKey: "dashboard.stats.completed",
// //     icon: CircleCheck,
// //     color: "text-emerald-500",
// //     sub: (d) =>
// //       d.totalTasks
// //         ? {
// //             key: "dashboard.stats.percentCompleted",
// //             options: { percent: Math.round((d.completedTasks / d.totalTasks) * 100) },
// //           }
// //         : { key: "dashboard.stats.noneYet" },
// //     subColor: "text-emerald-500",
// //   },
// //   {
// //     key: "overdueTasks",
// //     labelKey: "dashboard.stats.overdue",
// //     icon: AlertTriangle,
// //     color: "text-red-500",
// //     sub: (d) => ((d.overdueTasks ?? 0) > 0
// //       ? { key: "dashboard.stats.needsAttention" }
// //       : { key: "dashboard.stats.allOnTime" }),
// //     subColor: "text-slate-400",
// //   },
// // ];

// // const STATUS_STYLES = {
// //   Pending: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
// //   "In-Progress": { bg: "bg-orange-50", text: "text-orange-600", dot: "bg-orange-500" },
// //   Completed: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
// // };

// // const PRIORITY_STYLES = {
// //   Low: "bg-slate-100 text-slate-600",
// //   Medium: "bg-slate-100 text-slate-600",
// //   High: "bg-orange-50 text-orange-600",
// //   Urgent: "bg-red-50 text-red-600",
// // };

// // // StatusPill / PriorityPill now translate the label via
// // // dashboard.status.<RawValue> / dashboard.priority.<RawValue>,
// // // keyed by the exact string the API returns (e.g. "In-Progress").
// // function StatusPill({ status }) {
// //   const { t } = useTranslation();
// //   const s = STATUS_STYLES[status] || { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" };
// //   const label = t(`dashboard.status.${status}`, status);
// //   const pulsing = status === "In-Progress";
// //   return (
// //     <span
// //       className={`inline-flex items-center justify-center gap-1.5 w-full px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${s.bg} ${s.text}`}
// //     >
// //       <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot} ${pulsing ? "animate-pulse" : ""}`} />
// //       {label}
// //     </span>
// //   );
// // }

// // function PriorityPill({ priority }) {
// //   const { t } = useTranslation();
// //   if (!priority) return null;
// //   return (
// //     <span
// //       className={`inline-flex items-center justify-center w-full px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${PRIORITY_STYLES[priority] || "bg-slate-100 text-slate-600"
// //         }`}
// //     >
// //       {t(`dashboard.priority.${priority}`, priority)}
// //     </span>
// //   );
// // }

// // // Icon for a request row, guessed from its template/task type or title
// // function getRequestIcon(task) {
// //   const text = `${task.task_type || ""} ${task.title || ""}`.toLowerCase();
// //   if (text.includes("guest") || text.includes("snack")) return UsersRound;
// //   if (text.includes("package") || text.includes("courier") || text.includes("pickup") || text.includes("delivery")) return Package;
// //   if (text.includes("coffee") || text.includes("tea")) return Coffee;
// //   if (text.includes("water") || text.includes("bottle")) return Droplets;
// //   return Sparkles;
// // }

// // function getTemplateIcon(category) {
// //   const c = (category || "").toLowerCase();
// //   if (c.includes("refresh")) return Coffee;
// //   if (c.includes("guest")) return UsersRound;
// //   if (c.includes("logistic")) return Package;
// //   return Sparkles;
// // }

// // const TEMPLATE_ICON_STYLES = [
// //   { bg: "bg-blue-50", fg: "text-blue-600" },
// //   { bg: "bg-orange-50", fg: "text-orange-600" },
// //   { bg: "bg-emerald-50", fg: "text-emerald-600" },
// //   { bg: "bg-violet-50", fg: "text-violet-600" },
// // ];

// // function Dashboard() {
// //   const { t } = useTranslation();
// //   const [dashboard, setDashboard] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [error, setError] = useState("");
// //   const navigate = useNavigate();

// //   const [recentTasks, setRecentTasks] = useState([]);
// //   const [tasksLoading, setTasksLoading] = useState(true);

// //   const [templates, setTemplates] = useState([]);
// //   const [templatesLoading, setTemplatesLoading] = useState(true);
// //   const [templatesAvailable, setTemplatesAvailable] = useState(true);

// //   useEffect(() => {
// //     loadDashboard();
// //     loadRecentTasks();
// //     loadTemplates();
// //   }, []);

// //   useEffect(() => {
// //     const handleTaskCreated = (newTask) => {
// //       setRecentTasks((prev) => [newTask, ...prev].slice(0, 5));
// //       setDashboard((prev) =>
// //         prev
// //           ? {
// //               ...prev,
// //               totalTasks: (prev.totalTasks ?? 0) + 1,
// //               pendingTasks: (prev.pendingTasks ?? 0) + 1,
// //             }
// //           : prev
// //       );
// //     };

// //     const handleTaskUpdated = ({ id, status, oldStatus }) => {
// //       setRecentTasks((prev) => {
// //         if (status === "Completed") {
// //           return prev.filter((t) => t.id !== id);
// //         }
// //         return prev.map((t) => (t.id === id ? { ...t, status } : t));
// //       });

// //       setDashboard((prev) => {
// //         if (!prev) return prev;
// //         const next = { ...prev };

// //         const decrementFor = (s) => {
// //           if (s === "Assigned") next.pendingTasks = Math.max(0, (next.pendingTasks ?? 0) - 1);
// //           if (s === "In-Progress") next.inProgressTasks = Math.max(0, (next.inProgressTasks ?? 0) - 1);
// //           if (s === "Completed") next.completedTasks = Math.max(0, (next.completedTasks ?? 0) - 1);
// //         };
// //         const incrementFor = (s) => {
// //           if (s === "Assigned") next.pendingTasks = (next.pendingTasks ?? 0) + 1;
// //           if (s === "In-Progress") next.inProgressTasks = (next.inProgressTasks ?? 0) + 1;
// //           if (s === "Completed") next.completedTasks = (next.completedTasks ?? 0) + 1;
// //         };

// //         decrementFor(oldStatus);
// //         incrementFor(status);

// //         return next;
// //       });
// //     };

// //     socket.on("task_created", handleTaskCreated);
// //     socket.on("task_updated", handleTaskUpdated);

// //     return () => {
// //       socket.off("task_created", handleTaskCreated);
// //       socket.off("task_updated", handleTaskUpdated);
// //     };
// //   }, []);

// //   const { updateTaskStatus, updatingTaskId } = useTaskStatus((taskId, newStatus) => {
// //     setRecentTasks((prev) =>
// //       prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
// //     );
// //   });

// //   const loadDashboard = async () => {
// //     try {
// //       const data = await getDashboard();
// //       console.log("Dashboard data:", data);
// //       setDashboard(data);
// //     } catch (error) {
// //       console.log("Dashboard error:", error);
// //       setError(error.message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   const loadRecentTasks = async () => {
// //     try {
// //       const token = localStorage.getItem("token");

// //       const response = await fetch(`${API_URL}/tasks`, {
// //         method: "GET",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       const data = await response.json();

// //       if (!response.ok) {
// //         throw new Error(data.message || "Failed to load tasks");
// //       }

// //       const activeOnly = data.filter((task) => task.status !== "Completed");

// //       setRecentTasks(activeOnly.slice(0, 5));
// //     } catch (error) {
// //       console.log("Recent tasks error:", error);
// //     } finally {
// //       setTasksLoading(false);
// //     }
// //   };

// //   const loadTemplates = async () => {
// //     try {
// //       const token = localStorage.getItem("token");

// //       const response = await fetch(`${API_URL}/task-templates`, {
// //         method: "GET",
// //         headers: {
// //           "Content-Type": "application/json",
// //           Authorization: `Bearer ${token}`,
// //         },
// //       });

// //       if (response.status === 403) {
// //         setTemplatesAvailable(false);
// //         return;
// //       }

// //       const data = await response.json();

// //       if (!response.ok) {
// //         throw new Error(data.message || "Failed to load templates");
// //       }

// //       const activeOnly = data.filter((t) => t.is_active !== 0 && t.is_active !== false);
// //       setTemplates(activeOnly);
// //     } catch (error) {
// //       console.log("Templates error:", error);
// //       setTemplatesAvailable(false);
// //     } finally {
// //       setTemplatesLoading(false);
// //     }
// //   };

// //   const styleBlock = (
// //     <style>{`
// //       @keyframes cardIn {
// //         from { opacity: 0; transform: translateY(14px); }
// //         to { opacity: 1; transform: translateY(0); }
// //       }
// //       .card-in { animation: cardIn 0.5s cubic-bezier(.16,1,.3,1) both; }

// //       @keyframes rowIn {
// //         from { opacity: 0; transform: translateX(-8px); }
// //         to { opacity: 1; transform: translateX(0); }
// //       }
// //       .row-in { animation: rowIn 0.4s ease both; }

// //       @media (prefers-reduced-motion: reduce) {
// //         .card-in, .row-in { animation: none; }
// //       }

// //       .dash-grid {
// //         display: grid;
// //         grid-template-columns: 1fr;
// //         gap: 1.5rem;
// //         grid-template-areas:
// //           "quickcall"
// //           "quicktasks"
// //           "liverequests"
// //           "statcards"
// //           "taskoverview"
// //           "hero";
// //       }
// //       @media (min-width: 1024px) {
// //         .dash-grid {
// //           max-width: 900px;
// //           margin: 0 auto;
// //         }
// //       }
// //       .area-quickcall    { grid-area: quickcall; }
// //       .area-quicktasks   { grid-area: quicktasks; }
// //       .area-liverequests { grid-area: liverequests; }
// //       .area-statcards    { grid-area: statcards; }
// //       .area-taskoverview { grid-area: taskoverview; }
// //       .area-hero         { grid-area: hero; }
// //     `}</style>
// //   );

// //   // ==============================================
// //   // LOADING
// //   // ==============================================
// //   if (loading) {
// //     return (
// //       <div className="animate-pulse">
// //         {styleBlock}
// //         <div className="h-40 bg-white rounded-3xl border border-slate-200 mb-6" />
// //         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
// //           {[0, 1, 2, 3].map((i) => (
// //             <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200" />
// //           ))}
// //         </div>
// //       </div>
// //     );
// //   }

// //   // ==============================================
// //   // ERROR
// //   // ==============================================
// //   if (error) {
// //     return (
// //       <div className="bg-white border border-red-100 rounded-2xl p-8 max-w-md shadow-[0_8px_30px_rgba(23,32,51,.06)]">
// //         <p className="text-red-500 font-semibold text-sm mb-4">{error}</p>
// //         <button
// //           onClick={loadDashboard}
// //           className="px-4 py-2.5 rounded-xl bg-[#172033] text-white text-sm font-bold hover:opacity-90 transition-opacity"
// //         >
// //           {t("common.tryAgain", "Try again")}
// //         </button>
// //       </div>
// //     );
// //   }

// //   const handleQuickTask = async (template) => {
// //     try {
// //       const token = localStorage.getItem("token");

// //       const response = await fetch(
// //         "https://hatbox-scanner-subscribe.ngrok-free.dev/api/tasks/quick-create",
// //         {
// //           method: "POST",
// //           headers: {
// //             "Content-Type": "application/json",
// //             Authorization: `Bearer ${token}`,
// //           },
// //           body: JSON.stringify({
// //             template_id: template.id,
// //           }),
// //         }
// //       );

// //       const data = await response.json();

// //       if (!response.ok) {
// //         throw new Error(
// //           data.message || "Failed to create task"
// //         );
// //       }

// //       alert(
// //         t("dashboard.quickTasks.createdSuccess", { name: template.name })
// //       );

// //       // Refresh dashboard counts
// //       loadDashboard();

// //       // Refresh recent tasks
// //       loadRecentTasks();

// //     } catch (error) {
// //       console.error("Quick task error:", error);

// //       alert(
// //         error.message || t("dashboard.quickTasks.createFailed", "Failed to create quick task")
// //       );
// //     }
// //   };

// //   // ==============================================
// //   // DASHBOARD
// //   // ==============================================
// //   return (
// //     <div className="dash-grid">
// //       {styleBlock}

// //       {/* QUICK CALL */}
// //       {currentUserRole !== "Butler" && (
// //         <div className="area-quickcall">
// //           <QuickCallButton />
// //         </div>
// //       )}

// //       {/* QUICK TASKS */}
// //       {templatesAvailable && (
// //         <div
// //           className="area-quicktasks card-in bg-white rounded-3xl border border-slate-200 p-5 shadow-[0_8px_30px_rgba(23,32,51,.06)] hover:shadow-lg transition-shadow duration-300"
// //           style={{ animationDelay: "200ms" }}
// //         >
// //           <div className="flex justify-between items-center mb-4">
// //             <h2 className="font-black text-[#172033]">{t("dashboard.quickTasks.title")}</h2>
// //             <Sparkles className="w-4 h-4 text-violet-500" />
// //           </div>

// //           {templatesLoading ? (
// //             <div className="space-y-2">
// //               {[0, 1, 2].map((i) => (
// //                 <div key={i} className="h-14 bg-slate-100 rounded-2xl animate-pulse" />
// //               ))}
// //             </div>
// //           ) : templates.length === 0 ? (
// //             <p className="text-xs text-slate-400">{t("dashboard.quickTasks.empty")}</p>
// //           ) : (
// //             <div className="space-y-2">
// //               {templates.map((t2, i) => {
// //                 const Icon = getTemplateIcon(t2.category);
// //                 const style = TEMPLATE_ICON_STYLES[i % TEMPLATE_ICON_STYLES.length];
// //                 return (
// //                   <button
// //                     key={t2.id}
// //                     onClick={() => handleQuickTask(t2)}
// //                     className="row-in w-full text-left p-3 rounded-2xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/50 flex items-center gap-3 transition-all hover:-translate-y-0.5"
// //                     style={{ animationDelay: `${240 + i * 60}ms` }}
// //                   >
// //                     <span className={`w-9 h-9 rounded-xl ${style.bg} ${style.fg} grid place-items-center shrink-0`}>
// //                       <Icon className="w-4 h-4" />
// //                     </span>
// //                     <span className="min-w-0">
// //                       {/* t2.name / t2.category come from the DB — see note below
// //                           about translating admin-entered template content. */}
// //                       <b className="text-sm block text-[#172033] truncate">{t2.name}</b>
// //                       <small className="block text-xs text-slate-400 truncate">
// //                         {t2.category || t("dashboard.quickTasks.general")}
// //                       </small>
// //                     </span>
// //                   </button>
// //                 );
// //               })}
// //             </div>
// //           )}
// //         </div>
// //       )}

// //       {/* LIVE REQUESTS */}
// //       <div
// //         className="area-liverequests card-in bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(23,32,51,.06)] overflow-hidden"
// //         style={{ animationDelay: "220ms" }}
// //       >
// //         <div className="p-5 border-b border-slate-100 flex items-center justify-between">
// //           <div>
// //             <h2 className="font-black text-lg text-[#172033]">{t("dashboard.liveRequests.title")}</h2>
// //             <p className="text-xs text-slate-400 mt-1">{t("dashboard.liveRequests.subtitle")}</p>
// //           </div>
// //           <button
// //             onClick={() => navigate("/tasks")}
// //             className="text-sm font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 group"
// //           >
// //             {t("dashboard.liveRequests.viewAll")}
// //             <span className="group-hover:translate-x-0.5 transition-transform">→</span>
// //           </button>
// //         </div>

// //         {tasksLoading ? (
// //           <div className="p-5 space-y-3">
// //             {[0, 1, 2].map((i) => (
// //               <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
// //             ))}
// //           </div>
// //         ) : recentTasks.length === 0 ? (
// //           <div className="p-10 flex flex-col items-center text-center gap-2">
// //             <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-500 grid place-items-center mb-2">
// //               <ClipboardList className="w-5 h-5" />
// //             </div>
// //             <p className="text-sm font-semibold text-slate-600">{t("dashboard.liveRequests.empty")}</p>
// //             <p className="text-xs text-slate-400 max-w-xs">
// //               {t("dashboard.liveRequests.emptySub")}
// //             </p>
// //           </div>
// //         ) : (
// //           <div className="divide-y divide-slate-100">
// //             {recentTasks.map((task, i) => {
// //               const Icon = getRequestIcon(task);
// //               const reqId = `REQ-${String(task.id).padStart(4, "0")}`;

// //               return (
// //                 <div
// //                   key={task.id}
// //                   onClick={() => navigate(`/tasks/${task.id}`)}
// //                   className="row-in w-full flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer group"
// //                   style={{ animationDelay: `${260 + i * 60}ms` }}
// //                 >
// //                   <div className="flex items-center gap-4 flex-1 min-w-0">
// //                     <span className="w-11 h-11 rounded-2xl bg-violet-50 text-violet-500 grid place-items-center shrink-0 group-hover:scale-105 group-hover:bg-violet-100 transition-all">
// //                       <Icon className="w-[18px] h-[18px]" />
// //                     </span>
// //                     <div className="min-w-0 flex-1">
// //                       {/* task.title / assigned_by_name / assigned_to_name are
// //                           user-entered DB content — see the note below about
// //                           translating dynamic content. */}
// //                       <p className="text-sm font-bold text-[#172033] truncate">{task.title}</p>
// //                       <p className="text-xs text-slate-400 mt-0.5 truncate">
// //                         {reqId}
// //                         {task.assigned_by_name ? ` · ${task.assigned_by_name}` : ""}
// //                         {task.assigned_to_name ? ` · ${t("dashboard.liveRequests.butlerPrefix", "Butler")} ${task.assigned_to_name}` : ""}
// //                       </p>
// //                     </div>
// //                   </div>

// //                   <div className="hidden sm:flex items-center gap-2 shrink-0">
// //                     <div className="w-[112px]">
// //                       <StatusPill status={task.status} />
// //                     </div>
// //                     <div className="w-[84px]">
// //                       <PriorityPill priority={task.priority} />
// //                     </div>
// //                   </div>

// //                   {currentUserRole === "Butler" && (
// //                     <div
// //                       className="flex gap-2 shrink-0"
// //                       onClick={(e) => e.stopPropagation()}
// //                     >
// //                       {task.status === "Assigned" && (
// //                         <>
// //                           <button
// //                             onClick={() => updateTaskStatus(task.id, "Accepted")}
// //                             disabled={updatingTaskId === task.id}
// //                             className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100 disabled:opacity-40"
// //                           >
// //                             {t("dashboard.butlerActions.accept")}
// //                           </button>
// //                           <button
// //                             onClick={() => updateTaskStatus(task.id, "Rejected")}
// //                             disabled={updatingTaskId === task.id}
// //                             className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 disabled:opacity-40"
// //                           >
// //                             {t("dashboard.butlerActions.reject")}
// //                           </button>
// //                         </>
// //                       )}
// //                       {task.status === "Accepted" && (
// //                         <button
// //                           onClick={() => updateTaskStatus(task.id, "In-Progress")}
// //                           disabled={updatingTaskId === task.id}
// //                           className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 text-xs font-bold hover:bg-orange-100 disabled:opacity-40"
// //                         >
// //                           {t("dashboard.butlerActions.start")}
// //                         </button>
// //                       )}
// //                       {task.status === "In-Progress" && (
// //                         <button
// //                           onClick={() => updateTaskStatus(task.id, "Completed")}
// //                           disabled={updatingTaskId === task.id}
// //                           className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold hover:bg-emerald-100 disabled:opacity-40"
// //                         >
// //                           {t("dashboard.butlerActions.complete")}
// //                         </button>
// //                       )}
// //                     </div>
// //                   )}
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         )}
// //       </div>

// //       {/* STAT CARDS */}
// //       <div className="area-statcards grid grid-cols-2 lg:grid-cols-4 gap-4">
// //         {STAT_CARDS.map((card, i) => {
// //           const Icon = card.icon;
// //           const sub = card.sub(dashboard);
// //           return (
// //             <div
// //               key={card.key}
// //               className="card-in bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_8px_30px_rgba(23,32,51,.06)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
// //               style={{ animationDelay: `${i * 70}ms` }}
// //             >
// //               <div className="flex items-center justify-between gap-2 h-5">
// //                 <div className="text-[10px] font-extrabold tracking-[0.06em] text-slate-400 whitespace-nowrap">
// //                   {t(card.labelKey)}
// //                 </div>
// //                 <Icon className={`w-4 h-4 shrink-0 ${card.color}`} />
// //               </div>
// //               <div className="text-3xl font-black mt-3 text-[#172033] tabular-nums leading-none">
// //                 <AnimatedNumber value={dashboard[card.key] ?? 0} pad />
// //               </div>
// //               <div className={`text-xs mt-2 whitespace-nowrap ${card.subColor}`}>
// //                 {t(sub.key, sub.options)}
// //               </div>
// //             </div>
// //           );
// //         })}
// //       </div>

// //       {/* TASK OVERVIEW */}
// //       <div
// //         className="area-taskoverview card-in bg-[#172033] text-white rounded-3xl p-6 shadow-[0_18px_50px_rgba(23,32,51,.08)] hover:shadow-xl transition-shadow duration-300"
// //         style={{ animationDelay: "140ms" }}
// //       >
// //         <div className="flex items-center justify-between">
// //           <span className="text-xs font-bold text-slate-300">{t("dashboard.taskOverview.title")}</span>
// //           <Activity className="w-4 h-4 text-cyan-300" />
// //         </div>
// //         <div className="flex items-end gap-2 mt-5">
// //           <span className="text-4xl font-black tabular-nums leading-none">
// //             <AnimatedNumber value={dashboard.totalTasks ?? 0} />
// //           </span>
// //           <span className="text-sm text-slate-400">{t("dashboard.taskOverview.totalTasks")}</span>
// //         </div>
// //         <div className="h-2 bg-white/10 rounded-full mt-5 overflow-hidden">
// //           <div
// //             className="h-full bg-cyan-400 rounded-full transition-all duration-700"
// //             style={{
// //               width: `${
// //                 dashboard.totalTasks
// //                   ? Math.round((dashboard.completedTasks / dashboard.totalTasks) * 100)
// //                   : 0
// //               }%`,
// //             }}
// //           />
// //         </div>
// //         <div className="flex justify-between text-xs text-slate-400 mt-2">
// //           <span>{dashboard.completedTasks ?? 0} {t("dashboard.taskOverview.completed")}</span>
// //           <span>{dashboard.totalTasks ?? 0} {t("dashboard.taskOverview.total")}</span>
// //         </div>
// //       </div>

// //       {/* HERO BANNER */}
// //       <div className="area-hero card-in rounded-3xl border border-violet-100 p-6 md:p-7 shadow-[0_18px_50px_rgba(23,32,51,.08)] bg-[radial-gradient(circle_at_85%_10%,rgba(108,92,231,.16),transparent_28%),linear-gradient(135deg,#ffffff,#f8f7ff)] hover:shadow-lg transition-shadow duration-300">
// //         <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
// //           <div>
// //             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-violet-100 text-violet-600 text-xs font-bold mb-4">
// //               <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
// //               {t("dashboard.hero.badge")}
// //             </div>
// //             <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#172033]">
// //               {t("dashboard.hero.title")}
// //             </h1>
// //             <p className="text-slate-500 mt-2 max-w-xl">
// //               {t("dashboard.hero.subtitle")}
// //             </p>
// //           </div>
// //           {currentUserRole !== "Butler" && (
// //             <button
// //               onClick={() => navigate("/tasks/create")}
// //               className="shrink-0 px-5 py-3 rounded-2xl bg-[#6C5CE7] text-white font-bold shadow-lg shadow-violet-200 hover:-translate-y-1 hover:shadow-xl transition-all whitespace-nowrap"
// //             >
// //               {t("dashboard.hero.newRequest")}
// //             </button>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }

// // export default Dashboard;


// import { useEffect, useState, useRef } from "react";
// import { useNavigate } from "react-router-dom";
// import QuickCallButton from "../components/QuickCallButton";
// import { useTaskStatus } from "../hooks/useTaskStatus";
// import socket from "../socket";
// import {
//   Inbox,
//   LoaderCircle,
//   CircleCheck,
//   AlertTriangle,
//   ClipboardList,
//   Droplets,
//   Coffee,
//   UsersRound,
//   Package,
//   Sparkles,
//   Activity,
// } from "lucide-react";
// import { getDashboard } from "../services/api";
// import { useTranslatedText } from "../hooks/useTranslatedText";

// const API_URL = "https://hatbox-scanner-subscribe.ngrok-free.dev/api";

// const currentUser = JSON.parse(localStorage.getItem("user") || "null");
// const currentUserRole = currentUser?.role;

// function AnimatedNumber({ value, pad = false }) {
//   const [display, setDisplay] = useState(0);
//   const startRef = useRef(null);

//   useEffect(() => {
//     const target = Number(value) || 0;
//     const duration = 700;
//     const step = (timestamp) => {
//       if (!startRef.current) startRef.current = timestamp;
//       const progress = Math.min((timestamp - startRef.current) / duration, 1);
//       const eased = 1 - Math.pow(1 - progress, 3);
//       setDisplay(Math.round(eased * target));
//       if (progress < 1) requestAnimationFrame(step);
//     };
//     startRef.current = null;
//     const raf = requestAnimationFrame(step);
//     return () => cancelAnimationFrame(raf);
//   }, [value]);

//   return <>{pad ? String(display).padStart(2, "0") : display}</>;
// }

// // Each card gets its own sub-line, like the reference — repeating
// // "11 total tasks" four times reads as a bug.
// const STAT_CARDS = [
//   {
//     key: "pendingTasks",
//     label: "OPEN REQUESTS",
//     icon: Inbox,
//     color: "text-violet-500",
//     sub: (d) => `of ${d.totalTasks ?? 0} total`,
//     subColor: "text-slate-400",
//   },
//   {
//     key: "inProgressTasks",
//     label: "IN PROGRESS",
//     icon: LoaderCircle,
//     color: "text-orange-500",
//     sub: () => "active right now",
//     subColor: "text-slate-400",
//   },
//   {
//     key: "completedTasks",
//     label: "COMPLETED",
//     icon: CircleCheck,
//     color: "text-emerald-500",
//     sub: (d) =>
//       d.totalTasks
//         ? `${Math.round((d.completedTasks / d.totalTasks) * 100)}% completed`
//         : "none yet",
//     subColor: "text-emerald-500",
//   },
//   {
//     key: "overdueTasks",
//     label: "OVERDUE",
//     icon: AlertTriangle,
//     color: "text-red-500",
//     sub: (d) => ((d.overdueTasks ?? 0) > 0 ? "needs attention" : "all on time"),
//     subColor: "text-slate-400",
//   },
// ];

// const STATUS_STYLES = {
//   Pending: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
//   "In-Progress": { bg: "bg-orange-50", text: "text-orange-600", dot: "bg-orange-500" },
//   Completed: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
// };

// const PRIORITY_STYLES = {
//   Low: "bg-slate-100 text-slate-600",
//   Medium: "bg-slate-100 text-slate-600",
//   High: "bg-orange-50 text-orange-600",
//   Urgent: "bg-red-50 text-red-600",
// };

// function StatusPill({ status }) {
//   const s = STATUS_STYLES[status] || { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" };
//   const label = status === "In-Progress" ? "In Progress" : status;
//   const pulsing = status === "In-Progress";
//   return (
//     <span
//       className={`inline-flex items-center justify-center gap-1.5 w-full px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${s.bg} ${s.text}`}
//     >
//       <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot} ${pulsing ? "animate-pulse" : ""}`} />
//       {label}
//     </span>
//   );
// }

// function PriorityPill({ priority }) {
//   if (!priority) return null;
//   return (
//     <span
//       className={`inline-flex items-center justify-center w-full px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${PRIORITY_STYLES[priority] || "bg-slate-100 text-slate-600"
//         }`}
//     >
//       {priority}
//     </span>
//   );
// }

// // Wraps useTranslatedText so it's called once per rendered item,
// // not inside a .map() loop in the parent (which would break the
// // rules of hooks when the list length changes between renders).
// function TranslatedText({ text, as: Tag = "span", className }) {
//   const translated = useTranslatedText(text);
//   return <Tag className={className}>{translated}</Tag>;
// }

// // Icon for a request row, guessed from its template/task type or title
// function getRequestIcon(task) {
//   const text = `${task.task_type || ""} ${task.title || ""}`.toLowerCase();
//   if (text.includes("guest") || text.includes("snack")) return UsersRound;
//   if (text.includes("package") || text.includes("courier") || text.includes("pickup") || text.includes("delivery")) return Package;
//   if (text.includes("coffee") || text.includes("tea")) return Coffee;
//   if (text.includes("water") || text.includes("bottle")) return Droplets;
//   return Sparkles;
// }

// function getTemplateIcon(category) {
//   const c = (category || "").toLowerCase();
//   if (c.includes("refresh")) return Coffee;
//   if (c.includes("guest")) return UsersRound;
//   if (c.includes("logistic")) return Package;
//   return Sparkles;
// }

// const TEMPLATE_ICON_STYLES = [
//   { bg: "bg-blue-50", fg: "text-blue-600" },
//   { bg: "bg-orange-50", fg: "text-orange-600" },
//   { bg: "bg-emerald-50", fg: "text-emerald-600" },
//   { bg: "bg-violet-50", fg: "text-violet-600" },
// ];

// function Dashboard() {
//   const [dashboard, setDashboard] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const [recentTasks, setRecentTasks] = useState([]);
//   const [tasksLoading, setTasksLoading] = useState(true);

//   const [templates, setTemplates] = useState([]);
//   const [templatesLoading, setTemplatesLoading] = useState(true);
//   const [templatesAvailable, setTemplatesAvailable] = useState(true);

//   useEffect(() => {
//     loadDashboard();
//     loadRecentTasks();
//     loadTemplates();
//   }, []);

//   useEffect(() => {
//     const handleTaskCreated = (newTask) => {
//       setRecentTasks((prev) => [newTask, ...prev].slice(0, 5));
//       setDashboard((prev) =>
//         prev
//           ? {
//               ...prev,
//               totalTasks: (prev.totalTasks ?? 0) + 1,
//               pendingTasks: (prev.pendingTasks ?? 0) + 1,
//             }
//           : prev
//       );
//     };

//     const handleTaskUpdated = ({ id, status, oldStatus }) => {
//       setRecentTasks((prev) => {
//         if (status === "Completed") {
//           return prev.filter((t) => t.id !== id);
//         }
//         return prev.map((t) => (t.id === id ? { ...t, status } : t));
//       });

//       setDashboard((prev) => {
//         if (!prev) return prev;
//         const next = { ...prev };

//         const decrementFor = (s) => {
//           if (s === "Assigned") next.pendingTasks = Math.max(0, (next.pendingTasks ?? 0) - 1);
//           if (s === "In-Progress") next.inProgressTasks = Math.max(0, (next.inProgressTasks ?? 0) - 1);
//           if (s === "Completed") next.completedTasks = Math.max(0, (next.completedTasks ?? 0) - 1);
//         };
//         const incrementFor = (s) => {
//           if (s === "Assigned") next.pendingTasks = (next.pendingTasks ?? 0) + 1;
//           if (s === "In-Progress") next.inProgressTasks = (next.inProgressTasks ?? 0) + 1;
//           if (s === "Completed") next.completedTasks = (next.completedTasks ?? 0) + 1;
//         };

//         decrementFor(oldStatus);
//         incrementFor(status);

//         return next;
//       });
//     };

//     socket.on("task_created", handleTaskCreated);
//     socket.on("task_updated", handleTaskUpdated);

//     return () => {
//       socket.off("task_created", handleTaskCreated);
//       socket.off("task_updated", handleTaskUpdated);
//     };
//   }, []);

//   const { updateTaskStatus, updatingTaskId } = useTaskStatus((taskId, newStatus) => {
//     setRecentTasks((prev) => {
//       if (newStatus === "Completed") {
//         return prev.filter((t) => t.id !== taskId);
//       }
//       return prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t));
//     });
//   });

//   const loadDashboard = async () => {
//     try {
//       const data = await getDashboard();
//       console.log("Dashboard data:", data);
//       setDashboard(data);
//     } catch (error) {
//       console.log("Dashboard error:", error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadRecentTasks = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await fetch(`${API_URL}/tasks`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to load tasks");
//       }

//       const activeOnly = data.filter((task) => task.status !== "Completed");

//       setRecentTasks(activeOnly.slice(0, 5));
//     } catch (error) {
//       console.log("Recent tasks error:", error);
//     } finally {
//       setTasksLoading(false);
//     }
//   };

//   const loadTemplates = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await fetch(`${API_URL}/task-templates`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.status === 403) {
//         setTemplatesAvailable(false);
//         return;
//       }

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to load templates");
//       }

//       const activeOnly = data.filter((t) => t.is_active !== 0 && t.is_active !== false);
//       setTemplates(activeOnly);
//     } catch (error) {
//       console.log("Templates error:", error);
//       setTemplatesAvailable(false);
//     } finally {
//       setTemplatesLoading(false);
//     }
//   };

//   const styleBlock = (
//     <style>{`
//       @keyframes cardIn {
//         from { opacity: 0; transform: translateY(14px); }
//         to { opacity: 1; transform: translateY(0); }
//       }
//       .card-in { animation: cardIn 0.5s cubic-bezier(.16,1,.3,1) both; }

//       @keyframes rowIn {
//         from { opacity: 0; transform: translateX(-8px); }
//         to { opacity: 1; transform: translateX(0); }
//       }
//       .row-in { animation: rowIn 0.4s ease both; }

//       @media (prefers-reduced-motion: reduce) {
//         .card-in, .row-in { animation: none; }
//       }

//       /* ---------------------------------------------------------
//          Layout grid — grid-template-areas instead of order/col-start.
//          Same single-column stacking order at every breakpoint:
//          quickcall -> quicktasks -> liverequests -> statcards ->
//          taskoverview -> hero. Desktop just gets a wider, centered
//          column instead of switching to a 2-column layout.
//          --------------------------------------------------------- */
//       .dash-grid {
//         display: grid;
//         grid-template-columns: 1fr;
//         gap: 1.5rem;
//         grid-template-areas:
//           "quickcall"
//           "quicktasks"
//           "liverequests"
//           "statcards"
//           "taskoverview"
//           "hero";
//       }
//       @media (min-width: 1024px) {
//         .dash-grid {
//           max-width: 900px;
//           margin: 0 auto;
//         }
//       }
//       .area-quickcall    { grid-area: quickcall; }
//       .area-quicktasks   { grid-area: quicktasks; }
//       .area-liverequests { grid-area: liverequests; }
//       .area-statcards    { grid-area: statcards; }
//       .area-taskoverview { grid-area: taskoverview; }
//       .area-hero         { grid-area: hero; }
//     `}</style>
//   );

//   // ==============================================
//   // LOADING
//   // ==============================================
//   if (loading) {
//     return (
//       <div className="animate-pulse">
//         {styleBlock}
//         <div className="h-40 bg-white rounded-3xl border border-slate-200 mb-6" />
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//           {[0, 1, 2, 3].map((i) => (
//             <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200" />
//           ))}
//         </div>
//       </div>
//     );
//   }

//   // ==============================================
//   // ERROR
//   // ==============================================
//   if (error) {
//     return (
//       <div className="bg-white border border-red-100 rounded-2xl p-8 max-w-md shadow-[0_8px_30px_rgba(23,32,51,.06)]">
//         <p className="text-red-500 font-semibold text-sm mb-4">{error}</p>
//         <button
//           onClick={loadDashboard}
//           className="px-4 py-2.5 rounded-xl bg-[#172033] text-white text-sm font-bold hover:opacity-90 transition-opacity"
//         >
//           Try again
//         </button>
//       </div>
//     );
//   }

//   const handleQuickTask = async (template) => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await fetch(
//         "https://hatbox-scanner-subscribe.ngrok-free.dev/api/tasks/quick-create",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify({
//             template_id: template.id,
//           }),
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message || "Failed to create task"
//         );
//       }

//       alert(
//         `"${template.name}" created and assigned successfully`
//       );

//       // Refresh dashboard counts
//       loadDashboard();

//       // Refresh recent tasks
//       loadRecentTasks();

//     } catch (error) {
//       console.error("Quick task error:", error);

//       alert(
//         error.message || "Failed to create quick task"
//       );
//     }
//   };

//   // ==============================================
//   // DASHBOARD
//   // ==============================================
//   return (
//     <div className="dash-grid">
//       {styleBlock}

//       {/* QUICK CALL */}
//       {currentUserRole !== "Butler" && (
//         <div className="area-quickcall">
//           <QuickCallButton />
//         </div>
//       )}

//       {/* QUICK TASKS */}
//       {templatesAvailable && (
//         <div
//           className="area-quicktasks card-in bg-white rounded-3xl border border-slate-200 p-5 shadow-[0_8px_30px_rgba(23,32,51,.06)] hover:shadow-lg transition-shadow duration-300"
//           style={{ animationDelay: "200ms" }}
//         >
//           <div className="flex justify-between items-center mb-4">
//             <h2 className="font-black text-[#172033]">Quick tasks</h2>
//             <Sparkles className="w-4 h-4 text-violet-500" />
//           </div>

//           {templatesLoading ? (
//             <div className="space-y-2">
//               {[0, 1, 2].map((i) => (
//                 <div key={i} className="h-14 bg-slate-100 rounded-2xl animate-pulse" />
//               ))}
//             </div>
//           ) : templates.length === 0 ? (
//             <p className="text-xs text-slate-400">No active templates yet.</p>
//           ) : (
//             <div className="space-y-2">
//               {templates.map((t, i) => {
//                 const Icon = getTemplateIcon(t.category);
//                 const style = TEMPLATE_ICON_STYLES[i % TEMPLATE_ICON_STYLES.length];
//                 return (
//                   <button
//                     key={t.id}
//                     onClick={() => handleQuickTask(t)}
//                     className="row-in w-full text-left p-3 rounded-2xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/50 flex items-center gap-3 transition-all hover:-translate-y-0.5"
//                     style={{ animationDelay: `${240 + i * 60}ms` }}
//                   >
//                     <span className={`w-9 h-9 rounded-xl ${style.bg} ${style.fg} grid place-items-center shrink-0`}>
//                       <Icon className="w-4 h-4" />
//                     </span>
//                     <span className="min-w-0">
//                       <TranslatedText
//                         as="b"
//                         text={t.name}
//                         className="text-sm block text-[#172033] truncate"
//                       />
//                       <TranslatedText
//                         as="small"
//                         text={t.category || "General"}
//                         className="block text-xs text-slate-400 truncate"
//                       />
//                     </span>
//                   </button>
//                 );
//               })}
//             </div>
//           )}
//         </div>
//       )}

//       {/* LIVE REQUESTS */}
//       <div
//         className="area-liverequests card-in bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(23,32,51,.06)] overflow-hidden"
//         style={{ animationDelay: "220ms" }}
//       >
//         <div className="p-5 border-b border-slate-100 flex items-center justify-between">
//           <div>
//             <h2 className="font-black text-lg text-[#172033]">Live requests</h2>
//             <p className="text-xs text-slate-400 mt-1">Latest service activity</p>
//           </div>
//           <button
//             onClick={() => navigate("/tasks")}
//             className="text-sm font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 group"
//           >
//             View all
//             <span className="group-hover:translate-x-0.5 transition-transform">→</span>
//           </button>
//         </div>

//         {tasksLoading ? (
//           <div className="p-5 space-y-3">
//             {[0, 1, 2].map((i) => (
//               <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
//             ))}
//           </div>
//         ) : recentTasks.length === 0 ? (
//           <div className="p-10 flex flex-col items-center text-center gap-2">
//             <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-500 grid place-items-center mb-2">
//               <ClipboardList className="w-5 h-5" />
//             </div>
//             <p className="text-sm font-semibold text-slate-600">No requests yet</p>
//             <p className="text-xs text-slate-400 max-w-xs">
//               Created requests will show up here as they come in.
//             </p>
//           </div>
//         ) : (
//           <div className="divide-y divide-slate-100">
//             {recentTasks.map((task, i) => {
//               const Icon = getRequestIcon(task);
//               const reqId = `REQ-${String(task.id).padStart(4, "0")}`;

//               return (
//                 <div
//                   key={task.id}
//                   onClick={() => navigate(`/tasks/${task.id}`)}
//                   className="row-in w-full flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer group"
//                   style={{ animationDelay: `${260 + i * 60}ms` }}
//                 >
//                   <div className="flex items-center gap-4 flex-1 min-w-0">
//                     <span className="w-11 h-11 rounded-2xl bg-violet-50 text-violet-500 grid place-items-center shrink-0 group-hover:scale-105 group-hover:bg-violet-100 transition-all">
//                       <Icon className="w-[18px] h-[18px]" />
//                     </span>
//                     <div className="min-w-0 flex-1">
//                       <TranslatedText
//                         text={task.title}
//                         className="text-sm font-bold text-[#172033] truncate"
//                       />
//                       <p className="text-xs text-slate-400 mt-0.5 truncate">
//                         {reqId}
//                         {task.assigned_by_name ? ` · ${task.assigned_by_name}` : ""}
//                         {task.assigned_to_name ? ` · Butler ${task.assigned_to_name}` : ""}
//                       </p>
//                     </div>
//                   </div>

//                   <div className="hidden sm:flex items-center gap-2 shrink-0">
//                     <div className="w-[112px]">
//                       <StatusPill status={task.status} />
//                     </div>
//                     <div className="w-[84px]">
//                       <PriorityPill priority={task.priority} />
//                     </div>
//                   </div>

//                   {currentUserRole === "Butler" && (
//                     <div
//                       className="flex gap-2 shrink-0"
//                       onClick={(e) => e.stopPropagation()}
//                     >
//                       {task.status === "Assigned" && (
//                         <>
//                           <button
//                             onClick={() => updateTaskStatus(task.id, "Accepted")}
//                             disabled={updatingTaskId === task.id}
//                             className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100 disabled:opacity-40"
//                           >
//                             Accept
//                           </button>
//                           <button
//                             onClick={() => updateTaskStatus(task.id, "Rejected")}
//                             disabled={updatingTaskId === task.id}
//                             className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 disabled:opacity-40"
//                           >
//                             Reject
//                           </button>
//                         </>
//                       )}
//                       {task.status === "Accepted" && (
//                         <button
//                           onClick={() => updateTaskStatus(task.id, "In-Progress")}
//                           disabled={updatingTaskId === task.id}
//                           className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 text-xs font-bold hover:bg-orange-100 disabled:opacity-40"
//                         >
//                           Start
//                         </button>
//                       )}
//                       {task.status === "In-Progress" && (
//                         <button
//                           onClick={() => updateTaskStatus(task.id, "Completed")}
//                           disabled={updatingTaskId === task.id}
//                           className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold hover:bg-emerald-100 disabled:opacity-40"
//                         >
//                           Complete
//                         </button>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>

//       {/* STAT CARDS */}
//       <div className="area-statcards grid grid-cols-2 lg:grid-cols-4 gap-4">
//         {STAT_CARDS.map((card, i) => {
//           const Icon = card.icon;
//           return (
//             <div
//               key={card.key}
//               className="card-in bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_8px_30px_rgba(23,32,51,.06)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
//               style={{ animationDelay: `${i * 70}ms` }}
//             >
//               <div className="flex items-center justify-between gap-2 h-5">
//                 <div className="text-[10px] font-extrabold tracking-[0.06em] text-slate-400 whitespace-nowrap">
//                   {card.label}
//                 </div>
//                 <Icon className={`w-4 h-4 shrink-0 ${card.color}`} />
//               </div>
//               <div className="text-3xl font-black mt-3 text-[#172033] tabular-nums leading-none">
//                 <AnimatedNumber value={dashboard[card.key] ?? 0} pad />
//               </div>
//               <div className={`text-xs mt-2 whitespace-nowrap ${card.subColor}`}>
//                 {card.sub(dashboard)}
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* TASK OVERVIEW */}
//       <div
//         className="area-taskoverview card-in bg-[#172033] text-white rounded-3xl p-6 shadow-[0_18px_50px_rgba(23,32,51,.08)] hover:shadow-xl transition-shadow duration-300"
//         style={{ animationDelay: "140ms" }}
//       >
//         <div className="flex items-center justify-between">
//           <span className="text-xs font-bold text-slate-300">TASK OVERVIEW</span>
//           <Activity className="w-4 h-4 text-cyan-300" />
//         </div>
//         <div className="flex items-end gap-2 mt-5">
//           <span className="text-4xl font-black tabular-nums leading-none">
//             <AnimatedNumber value={dashboard.totalTasks ?? 0} />
//           </span>
//           <span className="text-sm text-slate-400">total tasks</span>
//         </div>
//         <div className="h-2 bg-white/10 rounded-full mt-5 overflow-hidden">
//           <div
//             className="h-full bg-cyan-400 rounded-full transition-all duration-700"
//             style={{
//               width: `${
//                 dashboard.totalTasks
//                   ? Math.round((dashboard.completedTasks / dashboard.totalTasks) * 100)
//                   : 0
//               }%`,
//             }}
//           />
//         </div>
//         <div className="flex justify-between text-xs text-slate-400 mt-2">
//           <span>{dashboard.completedTasks ?? 0} completed</span>
//           <span>{dashboard.totalTasks ?? 0} total</span>
//         </div>
//       </div>

//       {/* HERO BANNER */}
//       <div className="area-hero card-in rounded-3xl border border-violet-100 p-6 md:p-7 shadow-[0_18px_50px_rgba(23,32,51,.08)] bg-[radial-gradient(circle_at_85%_10%,rgba(108,92,231,.16),transparent_28%),linear-gradient(135deg,#ffffff,#f8f7ff)] hover:shadow-lg transition-shadow duration-300">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
//           <div>
//             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-violet-100 text-violet-600 text-xs font-bold mb-4">
//               <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
//               All services operational
//             </div>
//             <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#172033]">
//               Make every request feel effortless.
//             </h1>
//             <p className="text-slate-500 mt-2 max-w-xl">
//               Coordinate employees, managers and butlers from one simple service workspace.
//             </p>
//           </div>
//           {currentUserRole !== "Butler" && (
//             <button
//               onClick={() => navigate("/tasks/create")}
//               className="shrink-0 px-5 py-3 rounded-2xl bg-[#6C5CE7] text-white font-bold shadow-lg shadow-violet-200 hover:-translate-y-1 hover:shadow-xl transition-all whitespace-nowrap"
//             >
//               + New Request
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default Dashboard;



import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import QuickCallButton from "../components/QuickCallButton";
import { useTaskStatus } from "../hooks/useTaskStatus";
import socket from "../socket";
import {
  Inbox,
  LoaderCircle,
  CircleCheck,
  AlertTriangle,
  ClipboardList,
  Droplets,
  Coffee,
  UsersRound,
  Package,
  Sparkles,
  Activity,
} from "lucide-react";
import { getDashboard } from "../services/api";
import { useTranslatedText } from "../hooks/useTranslatedText";

const API_URL = "https://hatbox-scanner-subscribe.ngrok-free.dev/api";

const currentUser = JSON.parse(localStorage.getItem("user") || "null");
const currentUserRole = currentUser?.role;

function AnimatedNumber({ value, pad = false }) {
  const [display, setDisplay] = useState(0);
  const startRef = useRef(null);

  useEffect(() => {
    const target = Number(value) || 0;
    const duration = 700;
    const step = (timestamp) => {
      if (!startRef.current) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    startRef.current = null;
    const raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);

  return <>{pad ? String(display).padStart(2, "0") : display}</>;
}

// STAT_CARDS now stores translation KEYS instead of literal label
// strings, and "sub" returns a { key, options } pair so i18next can
// interpolate {{count}} / {{percent}} instead of building the string
// manually in JS.
const STAT_CARDS = [
  {
    key: "pendingTasks",
    labelKey: "dashboard.stats.openRequests",
    icon: Inbox,
    color: "text-violet-500",
    sub: (d) => ({ key: "dashboard.stats.ofTotal", options: { count: d.totalTasks ?? 0 } }),
    subColor: "text-slate-400",
  },
  {
    key: "inProgressTasks",
    labelKey: "dashboard.stats.inProgress",
    icon: LoaderCircle,
    color: "text-orange-500",
    sub: () => ({ key: "dashboard.stats.activeNow" }),
    subColor: "text-slate-400",
  },
  {
    key: "completedTasks",
    labelKey: "dashboard.stats.completed",
    icon: CircleCheck,
    color: "text-emerald-500",
    sub: (d) =>
      d.totalTasks
        ? {
            key: "dashboard.stats.percentCompleted",
            options: { percent: Math.round((d.completedTasks / d.totalTasks) * 100) },
          }
        : { key: "dashboard.stats.noneYet" },
    subColor: "text-emerald-500",
  },
  {
    key: "overdueTasks",
    labelKey: "dashboard.stats.overdue",
    icon: AlertTriangle,
    color: "text-red-500",
    sub: (d) => ((d.overdueTasks ?? 0) > 0
      ? { key: "dashboard.stats.needsAttention" }
      : { key: "dashboard.stats.allOnTime" }),
    subColor: "text-slate-400",
  },
];

const STATUS_STYLES = {
  Pending: { bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
  "In-Progress": { bg: "bg-orange-50", text: "text-orange-600", dot: "bg-orange-500" },
  Completed: { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
};

const PRIORITY_STYLES = {
  Low: "bg-slate-100 text-slate-600",
  Medium: "bg-slate-100 text-slate-600",
  High: "bg-orange-50 text-orange-600",
  Urgent: "bg-red-50 text-red-600",
};

// StatusPill / PriorityPill now translate their labels via the shared
// dashboard.status.* / dashboard.priority.* keys, keyed by the exact
// raw DB value (e.g. "In-Progress"), consistent with every other page.
function StatusPill({ status }) {
  const { t } = useTranslation();
  const s = STATUS_STYLES[status] || { bg: "bg-slate-100", text: "text-slate-600", dot: "bg-slate-400" };
  const fallback = status === "In-Progress" ? "In Progress" : status;
  const label = t(`dashboard.status.${status}`, fallback);
  const pulsing = status === "In-Progress";
  return (
    <span
      className={`inline-flex items-center justify-center gap-1.5 w-full px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${s.bg} ${s.text}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${s.dot} ${pulsing ? "animate-pulse" : ""}`} />
      {label}
    </span>
  );
}

function PriorityPill({ priority }) {
  const { t } = useTranslation();
  if (!priority) return null;
  return (
    <span
      className={`inline-flex items-center justify-center w-full px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${PRIORITY_STYLES[priority] || "bg-slate-100 text-slate-600"
        }`}
    >
      {t(`dashboard.priority.${priority}`, priority)}
    </span>
  );
}

// Wraps useTranslatedText so it's called once per rendered item,
// not inside a .map() loop in the parent (which would break the
// rules of hooks when the list length changes between renders).
// This is the DYNAMIC content path (DB-sourced task titles/template
// names/categories, translated via an API-backed hook) — separate
// from the static UI t() calls used everywhere else in this file.
function TranslatedText({ text, as: Tag = "span", className }) {
  const translated = useTranslatedText(text);
  return <Tag className={className}>{translated}</Tag>;
}

// Icon for a request row, guessed from its template/task type or title
function getRequestIcon(task) {
  const text = `${task.task_type || ""} ${task.title || ""}`.toLowerCase();
  if (text.includes("guest") || text.includes("snack")) return UsersRound;
  if (text.includes("package") || text.includes("courier") || text.includes("pickup") || text.includes("delivery")) return Package;
  if (text.includes("coffee") || text.includes("tea")) return Coffee;
  if (text.includes("water") || text.includes("bottle")) return Droplets;
  return Sparkles;
}

function getTemplateIcon(category) {
  const c = (category || "").toLowerCase();
  if (c.includes("refresh")) return Coffee;
  if (c.includes("guest")) return UsersRound;
  if (c.includes("logistic")) return Package;
  return Sparkles;
}

const TEMPLATE_ICON_STYLES = [
  { bg: "bg-blue-50", fg: "text-blue-600" },
  { bg: "bg-orange-50", fg: "text-orange-600" },
  { bg: "bg-emerald-50", fg: "text-emerald-600" },
  { bg: "bg-violet-50", fg: "text-violet-600" },
];

function Dashboard() {
  const { t } = useTranslation();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [recentTasks, setRecentTasks] = useState([]);
  const [tasksLoading, setTasksLoading] = useState(true);

  const [templates, setTemplates] = useState([]);
  const [templatesLoading, setTemplatesLoading] = useState(true);
  const [templatesAvailable, setTemplatesAvailable] = useState(true);

  useEffect(() => {
    loadDashboard();
    loadRecentTasks();
    loadTemplates();
  }, []);

  useEffect(() => {
    const handleTaskCreated = (newTask) => {
      setRecentTasks((prev) => [newTask, ...prev].slice(0, 5));
      setDashboard((prev) =>
        prev
          ? {
              ...prev,
              totalTasks: (prev.totalTasks ?? 0) + 1,
              pendingTasks: (prev.pendingTasks ?? 0) + 1,
            }
          : prev
      );
    };

    const handleTaskUpdated = ({ id, status, oldStatus }) => {
      setRecentTasks((prev) => {
        if (status === "Completed") {
          return prev.filter((t) => t.id !== id);
        }
        return prev.map((t) => (t.id === id ? { ...t, status } : t));
      });

      setDashboard((prev) => {
        if (!prev) return prev;
        const next = { ...prev };

        const decrementFor = (s) => {
          if (s === "Assigned") next.pendingTasks = Math.max(0, (next.pendingTasks ?? 0) - 1);
          if (s === "In-Progress") next.inProgressTasks = Math.max(0, (next.inProgressTasks ?? 0) - 1);
          if (s === "Completed") next.completedTasks = Math.max(0, (next.completedTasks ?? 0) - 1);
        };
        const incrementFor = (s) => {
          if (s === "Assigned") next.pendingTasks = (next.pendingTasks ?? 0) + 1;
          if (s === "In-Progress") next.inProgressTasks = (next.inProgressTasks ?? 0) + 1;
          if (s === "Completed") next.completedTasks = (next.completedTasks ?? 0) + 1;
        };

        decrementFor(oldStatus);
        incrementFor(status);

        return next;
      });
    };

    socket.on("task_created", handleTaskCreated);
    socket.on("task_updated", handleTaskUpdated);

    return () => {
      socket.off("task_created", handleTaskCreated);
      socket.off("task_updated", handleTaskUpdated);
    };
  }, []);

  const { updateTaskStatus, updatingTaskId } = useTaskStatus((taskId, newStatus) => {
    setRecentTasks((prev) => {
      if (newStatus === "Completed") {
        return prev.filter((t) => t.id !== taskId);
      }
      return prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t));
    });
  });

  const loadDashboard = async () => {
    try {
      const data = await getDashboard();
      console.log("Dashboard data:", data);
      setDashboard(data);
    } catch (error) {
      console.log("Dashboard error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadRecentTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/tasks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load tasks");
      }

      const activeOnly = data.filter((task) => task.status !== "Completed");

      setRecentTasks(activeOnly.slice(0, 5));
    } catch (error) {
      console.log("Recent tasks error:", error);
    } finally {
      setTasksLoading(false);
    }
  };

  const loadTemplates = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/task-templates`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 403) {
        setTemplatesAvailable(false);
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load templates");
      }

      const activeOnly = data.filter((t) => t.is_active !== 0 && t.is_active !== false);
      setTemplates(activeOnly);
    } catch (error) {
      console.log("Templates error:", error);
      setTemplatesAvailable(false);
    } finally {
      setTemplatesLoading(false);
    }
  };

  const styleBlock = (
    <style>{`
      @keyframes cardIn {
        from { opacity: 0; transform: translateY(14px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .card-in { animation: cardIn 0.5s cubic-bezier(.16,1,.3,1) both; }

      @keyframes rowIn {
        from { opacity: 0; transform: translateX(-8px); }
        to { opacity: 1; transform: translateX(0); }
      }
      .row-in { animation: rowIn 0.4s ease both; }

      @media (prefers-reduced-motion: reduce) {
        .card-in, .row-in { animation: none; }
      }

      .dash-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 1.5rem;
        grid-template-areas:
          "quickcall"
          "quicktasks"
          "liverequests"
          "statcards"
          "taskoverview"
          "hero";
      }
      @media (min-width: 1024px) {
        .dash-grid {
          max-width: 900px;
          margin: 0 auto;
        }
      }
      .area-quickcall    { grid-area: quickcall; }
      .area-quicktasks   { grid-area: quicktasks; }
      .area-liverequests { grid-area: liverequests; }
      .area-statcards    { grid-area: statcards; }
      .area-taskoverview { grid-area: taskoverview; }
      .area-hero         { grid-area: hero; }
    `}</style>
  );

  // ==============================================
  // LOADING
  // ==============================================
  if (loading) {
    return (
      <div className="animate-pulse">
        {styleBlock}
        <div className="h-40 bg-white rounded-3xl border border-slate-200 mb-6" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-slate-200" />
          ))}
        </div>
      </div>
    );
  }

  // ==============================================
  // ERROR
  // ==============================================
  if (error) {
    return (
      <div className="bg-white border border-red-100 rounded-2xl p-8 max-w-md shadow-[0_8px_30px_rgba(23,32,51,.06)]">
        <p className="text-red-500 font-semibold text-sm mb-4">{error}</p>
        <button
          onClick={loadDashboard}
          className="px-4 py-2.5 rounded-xl bg-[#172033] text-white text-sm font-bold hover:opacity-90 transition-opacity"
        >
          {t("dashboard.tryAgain")}
        </button>
      </div>
    );
  }

  const handleQuickTask = async (template) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        "https://hatbox-scanner-subscribe.ngrok-free.dev/api/tasks/quick-create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            template_id: template.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to create task"
        );
      }

      alert(
        t("dashboard.quickTasks.createdSuccess", { name: template.name })
      );

      // Refresh dashboard counts
      loadDashboard();

      // Refresh recent tasks
      loadRecentTasks();

    } catch (error) {
      console.error("Quick task error:", error);

      alert(
        error.message || t("dashboard.quickTasks.createFailed")
      );
    }
  };

  // ==============================================
  // DASHBOARD
  // ==============================================
  return (
    <div className="dash-grid">
      {styleBlock}

      {/* QUICK CALL */}
      {currentUserRole !== "Butler" && (
        <div className="area-quickcall">
          <QuickCallButton />
        </div>
      )}

      {/* QUICK TASKS
          Note: template names/categories go through TranslatedText
          (dynamic, API-backed translation) rather than t(), since
          they're DB content, not static UI text. */}
      {templatesAvailable && (
        <div
          className="area-quicktasks card-in bg-white rounded-3xl border border-slate-200 p-5 shadow-[0_8px_30px_rgba(23,32,51,.06)] hover:shadow-lg transition-shadow duration-300"
          style={{ animationDelay: "200ms" }}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-black text-[#172033]">{t("dashboard.quickTasks.title")}</h2>
            <Sparkles className="w-4 h-4 text-violet-500" />
          </div>

          {templatesLoading ? (
            <div className="space-y-2">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-14 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : templates.length === 0 ? (
            <p className="text-xs text-slate-400">{t("dashboard.quickTasks.empty")}</p>
          ) : (
            <div className="space-y-2">
              {templates.map((t2, i) => {
                const Icon = getTemplateIcon(t2.category);
                const style = TEMPLATE_ICON_STYLES[i % TEMPLATE_ICON_STYLES.length];
                return (
                  <button
                    key={t2.id}
                    onClick={() => handleQuickTask(t2)}
                    className="row-in w-full text-left p-3 rounded-2xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/50 flex items-center gap-3 transition-all hover:-translate-y-0.5"
                    style={{ animationDelay: `${240 + i * 60}ms` }}
                  >
                    <span className={`w-9 h-9 rounded-xl ${style.bg} ${style.fg} grid place-items-center shrink-0`}>
                      <Icon className="w-4 h-4" />
                    </span>
                                        <span className="min-w-0">
                      <TranslatedText
                        as="b"
                        text={t2.name}
                        className="text-sm block text-[#172033] truncate"
                      />
                      {t2.category ? (
                        <TranslatedText
                          as="small"
                          text={t2.category}
                          className="block text-xs text-slate-400 truncate"
                        />
                      ) : (
                        <small className="block text-xs text-slate-400 truncate">
                          {t("dashboard.quickTasks.general")}
                        </small>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* LIVE REQUESTS */}
      <div
        className="area-liverequests card-in bg-white rounded-3xl border border-slate-200 shadow-[0_8px_30px_rgba(23,32,51,.06)] overflow-hidden"
        style={{ animationDelay: "220ms" }}
      >
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-black text-lg text-[#172033]">{t("dashboard.liveRequests.title")}</h2>
            <p className="text-xs text-slate-400 mt-1">{t("dashboard.liveRequests.subtitle")}</p>
          </div>
          <button
            onClick={() => navigate("/tasks")}
            className="text-sm font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 group"
          >
            {t("dashboard.liveRequests.viewAll")}
            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
          </button>
        </div>

        {tasksLoading ? (
          <div className="p-5 space-y-3">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-16 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : recentTasks.length === 0 ? (
          <div className="p-10 flex flex-col items-center text-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-violet-50 text-violet-500 grid place-items-center mb-2">
              <ClipboardList className="w-5 h-5" />
            </div>
            <p className="text-sm font-semibold text-slate-600">{t("dashboard.liveRequests.empty")}</p>
            <p className="text-xs text-slate-400 max-w-xs">
              {t("dashboard.liveRequests.emptySub")}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentTasks.map((task, i) => {
              const Icon = getRequestIcon(task);
              const reqId = `REQ-${String(task.id).padStart(4, "0")}`;

              return (
                <div
                  key={task.id}
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  className="row-in w-full flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors cursor-pointer group"
                  style={{ animationDelay: `${260 + i * 60}ms` }}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className="w-11 h-11 rounded-2xl bg-violet-50 text-violet-500 grid place-items-center shrink-0 group-hover:scale-105 group-hover:bg-violet-100 transition-all">
                      <Icon className="w-[18px] h-[18px]" />
                    </span>
                    <div className="min-w-0 flex-1">
                      {/* task.title is DB content — translated via the
                          dynamic TranslatedText hook, not t() */}
                      <TranslatedText
                        text={task.title}
                        className="text-sm font-bold text-[#172033] truncate"
                      />
                      <p className="text-xs text-slate-400 mt-0.5 truncate">
                        {reqId}
                        {task.assigned_by_name ? ` · ${task.assigned_by_name}` : ""}
                        {task.assigned_to_name ? ` · ${t("dashboard.liveRequests.butlerPrefix")} ${task.assigned_to_name}` : ""}
                      </p>
                    </div>
                  </div>

                  <div className="hidden sm:flex items-center gap-2 shrink-0">
                    <div className="w-[112px]">
                      <StatusPill status={task.status} />
                    </div>
                    <div className="w-[84px]">
                      <PriorityPill priority={task.priority} />
                    </div>
                  </div>

                  {currentUserRole === "Butler" && (
                    <div
                      className="flex gap-2 shrink-0"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {task.status === "Assigned" && (
                        <>
                          <button
                            onClick={() => updateTaskStatus(task.id, "Accepted")}
                            disabled={updatingTaskId === task.id}
                            className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-bold hover:bg-indigo-100 disabled:opacity-40"
                          >
                            {t("dashboard.butlerActions.accept")}
                          </button>
                          <button
                            onClick={() => updateTaskStatus(task.id, "Rejected")}
                            disabled={updatingTaskId === task.id}
                            className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 disabled:opacity-40"
                          >
                            {t("dashboard.butlerActions.reject")}
                          </button>
                        </>
                      )}
                      {task.status === "Accepted" && (
                        <button
                          onClick={() => updateTaskStatus(task.id, "In-Progress")}
                          disabled={updatingTaskId === task.id}
                          className="px-3 py-1.5 rounded-lg bg-orange-50 text-orange-600 text-xs font-bold hover:bg-orange-100 disabled:opacity-40"
                        >
                          {t("dashboard.butlerActions.start")}
                        </button>
                      )}
                      {task.status === "In-Progress" && (
                        <button
                          onClick={() => updateTaskStatus(task.id, "Completed")}
                          disabled={updatingTaskId === task.id}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold hover:bg-emerald-100 disabled:opacity-40"
                        >
                          {t("dashboard.butlerActions.complete")}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* STAT CARDS */}
      <div className="area-statcards grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, i) => {
          const Icon = card.icon;
          const sub = card.sub(dashboard);
          return (
            <div
              key={card.key}
              className="card-in bg-white rounded-2xl border border-slate-200 p-5 shadow-[0_8px_30px_rgba(23,32,51,.06)] hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <div className="flex items-center justify-between gap-2 h-5">
                <div className="text-[10px] font-extrabold tracking-[0.06em] text-slate-400 whitespace-nowrap">
                  {t(card.labelKey)}
                </div>
                <Icon className={`w-4 h-4 shrink-0 ${card.color}`} />
              </div>
              <div className="text-3xl font-black mt-3 text-[#172033] tabular-nums leading-none">
                <AnimatedNumber value={dashboard[card.key] ?? 0} pad />
              </div>
              <div className={`text-xs mt-2 whitespace-nowrap ${card.subColor}`}>
                {t(sub.key, sub.options)}
              </div>
            </div>
          );
        })}
      </div>

      {/* TASK OVERVIEW */}
      <div
        className="area-taskoverview card-in bg-[#172033] text-white rounded-3xl p-6 shadow-[0_18px_50px_rgba(23,32,51,.08)] hover:shadow-xl transition-shadow duration-300"
        style={{ animationDelay: "140ms" }}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-300">{t("dashboard.taskOverview.title")}</span>
          <Activity className="w-4 h-4 text-cyan-300" />
        </div>
        <div className="flex items-end gap-2 mt-5">
          <span className="text-4xl font-black tabular-nums leading-none">
            <AnimatedNumber value={dashboard.totalTasks ?? 0} />
          </span>
          <span className="text-sm text-slate-400">{t("dashboard.taskOverview.totalTasks")}</span>
        </div>
        <div className="h-2 bg-white/10 rounded-full mt-5 overflow-hidden">
          <div
            className="h-full bg-cyan-400 rounded-full transition-all duration-700"
            style={{
              width: `${
                dashboard.totalTasks
                  ? Math.round((dashboard.completedTasks / dashboard.totalTasks) * 100)
                  : 0
              }%`,
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-2">
          <span>{dashboard.completedTasks ?? 0} {t("dashboard.taskOverview.completed")}</span>
          <span>{dashboard.totalTasks ?? 0} {t("dashboard.taskOverview.total")}</span>
        </div>
      </div>

      {/* HERO BANNER */}
      <div className="area-hero card-in rounded-3xl border border-violet-100 p-6 md:p-7 shadow-[0_18px_50px_rgba(23,32,51,.08)] bg-[radial-gradient(circle_at_85%_10%,rgba(108,92,231,.16),transparent_28%),linear-gradient(135deg,#ffffff,#f8f7ff)] hover:shadow-lg transition-shadow duration-300">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-violet-100 text-violet-600 text-xs font-bold mb-4">
              <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
              {t("dashboard.hero.badge")}
            </div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-[#172033]">
              {t("dashboard.hero.title")}
            </h1>
            <p className="text-slate-500 mt-2 max-w-xl">
              {t("dashboard.hero.subtitle")}
            </p>
          </div>
          {currentUserRole !== "Butler" && (
            <button
              onClick={() => navigate("/tasks/create")}
              className="shrink-0 px-5 py-3 rounded-2xl bg-[#6C5CE7] text-white font-bold shadow-lg shadow-violet-200 hover:-translate-y-1 hover:shadow-xl transition-all whitespace-nowrap"
            >
              {t("dashboard.hero.newRequest")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;