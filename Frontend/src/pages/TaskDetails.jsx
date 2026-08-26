// import { useEffect, useState } from "react";
// import { useNavigate, useParams } from "react-router-dom";
// import { useTranslation } from "react-i18next";

// import {
//   ArrowLeft,
//   User,
//   Tag,
//   CalendarClock,
//   Clock,
//   MessageSquare,
//   UserPlus,
//   Send,
//   History,
//   Repeat,
//   SlidersHorizontal,
//   Pencil,
//   Trash2,
// } from "lucide-react";
// import socket from "../socket";
// const API_URL = "https://hatbox-scanner-subscribe.ngrok-free.dev/api";
// const user = JSON.parse(localStorage.getItem("user") || "null");

// const userId = user?.id;
// const userRole = user?.role;




// const STATUS_STYLES = {
//   Draft: "bg-slate-100 text-slate-600",
//   Submitted: "bg-amber-50 text-amber-600",
//   Assigned: "bg-blue-50 text-blue-600",
//   Accepted: "bg-indigo-50 text-indigo-600",
//   "In-Progress": "bg-orange-50 text-orange-600",
//   Completed: "bg-emerald-50 text-emerald-600",
//   Rejected: "bg-red-50 text-red-600",
//   Cancelled: "bg-red-50 text-red-600",
//   "On Hold": "bg-yellow-50 text-yellow-600",
// };

// function StatusPill({ status }) {
//   const label = status === "In-Progress" ? "In Progress" : status;

//   return (
//     <span
//       className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[status] || "bg-slate-100 text-slate-600"
//         }`}
//     >
//       {label}
//     </span>
//   );
// }

// function DetailRow({ icon: Icon, label, value }) {
//   return (
//     <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-b-0">
//       <Icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
//       <div className="min-w-0">
//         <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</div>
//         <div className="text-sm text-ink mt-0.5">{value}</div>
//       </div>
//     </div>
//   );
// }

// function TimelineList({ items, renderLine, renderMeta, emptyText }) {
//   if (items.length === 0) {
//     return <p className="text-sm text-slate-400">{emptyText}</p>;
//   }
//   return (
//     <div className="relative pl-5">
//       <div className="absolute left-[7px] top-1 bottom-1 w-px bg-slate-200" />
//       <div className="space-y-5">
//         {items.map((item) => (
//           <div key={item.id} className="relative">
//             <span className="absolute -left-5 top-1 w-3 h-3 rounded-full bg-violet-500 border-2 border-white shadow" />
//             <div className="text-sm font-bold text-ink">{renderLine(item)}</div>
//             <p className="text-xs text-slate-400 mt-0.5">{renderMeta(item)}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// function TaskDetails() {
//   const { t, i18n } = useTranslation();
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const [task, setTask] = useState(null);
//   const [userRole, setUserRole] = useState("");
//   useEffect(() => {
//     const user = JSON.parse(localStorage.getItem("user"));
//     setUserRole(user?.role || "");
//   }, []);

//   const dateLocale = i18n.language === "hi" ? "hi-IN" : "en-IN";
//   const canEdit =
//     userRole === "Admin" ||
//     userRole === "Manager" ||
//     userRole === "Employee" &&
//       task &&
//       Number(task.assigned_by) === Number(userId) &&
//        task.status === "Assigned";

//   const canDelete =
//     userRole === "Admin" ||
//     userRole === "Manager" ||
//     (
//       userRole === "Employee" &&
//       task &&
//       Number(task.assigned_by) === Number(userId)
//     );

//   useEffect(() => {

//     console.log(
//       `TaskDetails listening for comments for task ${id}`
//     );


//     const handleNewComment =
//       (incomingComment) => {

//         console.log(
//           "REAL-TIME COMMENT RECEIVED:",
//           incomingComment
//         );


//         // ==========================================
//         // ONLY HANDLE CURRENT TASK
//         // ==========================================

//         if (
//           Number(incomingComment.task_id) !==
//           Number(id)
//         ) {

//           return;
//         }


//         // ==========================================
//         // ADD COMMENT WITHOUT RELOAD
//         // ==========================================

//         setComments((prev) => {

//           const alreadyExists =
//             prev.some(
//               (comment) =>
//                 Number(comment.id) ===
//                 Number(incomingComment.id)
//             );


//           if (alreadyExists) {
//             return prev;
//           }


//           return [
//             ...prev,
//             incomingComment,
//           ];
//         });
//       };


//     // ==========================================
//     // LISTEN
//     // ==========================================

//     socket.on(
//       "new_comment",
//       handleNewComment
//     );


//     // ==========================================
//     // CLEANUP
//     // ==========================================

//     return () => {

//       socket.off(
//         "new_comment",
//         handleNewComment
//       );
//     };

//   }, [id]);
//   // useEffect(() => {
//   //     const user = JSON.parse(localStorage.getItem("user") || "null");
//   //     const userId = user?.id;

//   //     if (!userId) return;

//   //     // Safe to call even if already joined elsewhere (e.g. by NotificationPopup) —
//   //     // Socket.IO room joins are idempotent.
//   //     socket.emit("join", userId);

//   //     const handleNewComment = (incomingComment) => {

//   //         // Ignore pushes for a different task than the one currently open
//   //         if (Number(incomingComment.task_id) !== Number(id)) {
//   //             return;
//   //         }

//   //         setComments((prev) => {
//   //             // Avoid duplicating if it somehow arrives twice
//   //             const alreadyExists = prev.some(
//   //                 (c) => Number(c.id) === Number(incomingComment.id)
//   //             );
//   //             if (alreadyExists) return prev;

//   //             return [...prev, incomingComment];
//   //         });
//   //     };

//   //     socket.on("new_comment", handleNewComment);

//   //     return () => {
//   //         socket.off("new_comment", handleNewComment);
//   //     };
//   // }, [id]);

//   const canReassign = userRole === "Admin" || userRole === "Manager";


//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [history, setHistory] = useState([]);
//   const [historyLoading, setHistoryLoading] = useState(true);
//   const [comments, setComments] = useState([]);
//   const [commentsLoading, setCommentsLoading] = useState(true);
//   const [newComment, setNewComment] = useState("");
//   const [commentError, setCommentError] = useState("");
//   const [commentSubmitting, setCommentSubmitting] = useState(false);
//   const [butlers, setButlers] = useState([]);
//   const [selectedButler, setSelectedButler] = useState("");
//   const [assigning, setAssigning] = useState(false);
//   const [assignError, setAssignError] = useState("");
//   const [assignMessage, setAssignMessage] = useState("");
//   const [assignmentHistory, setAssignmentHistory] = useState([]);
//   const [assignmentHistoryLoading, setAssignmentHistoryLoading] = useState(true);

//   const loadAssignmentHistory = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await fetch(`${API_URL}/tasks/${id}/assignment-history`, {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to load assignment history");
//       }

//       setAssignmentHistory(data);
//     } catch (error) {
//       console.error("Assignment history error:", error);
//     } finally {
//       setAssignmentHistoryLoading(false);
//     }
//   };

//   const loadButlers = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await fetch(`${API_URL}/users/butlers`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();
//       console.log("Butlers:", data);

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to load Butlers");
//       }

//       setButlers(data);
//     } catch (error) {
//       console.error("Butler loading error:", error);
//     }
//   };

//   useEffect(() => {
//     loadTask();
//     loadHistory();
//     loadComments();
//     loadAssignmentHistory();

//     if (canReassign) {
//       loadButlers();
//     }
//   }, [id, canReassign]);

//   const loadTask = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await fetch(`${API_URL}/tasks/${id}`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();
//       console.log("Task details:", data);

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to load task");
//       }

//       setTask(data);
//     } catch (error) {
//       console.error("Task details error:", error);
//       setError(error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const loadHistory = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await fetch(`${API_URL}/tasks/${id}/history`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();
//       console.log("Task history:", data);

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to load task history");
//       }

//       setHistory(data);
//     } catch (error) {
//       console.error("History error:", error);
//     } finally {
//       setHistoryLoading(false);
//     }
//   };

//   const loadComments = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await fetch(`${API_URL}/tasks/${id}/comments`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await response.json();
//       console.log("Task comments:", data);

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to load comments");
//       }

//       setComments(data);
//     } catch (error) {
//       console.error("Comments error:", error);
//     } finally {
//       setCommentsLoading(false);
//     }
//   };

//   const addComment = async () => {
//     if (!newComment.trim()) {
//       setCommentError("Please enter a comment");
//       return;
//     }

//     try {
//       setCommentSubmitting(true);
//       setCommentError("");

//       const token = localStorage.getItem("token");

//       const response = await fetch(`${API_URL}/tasks/${id}/comments`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ comment: newComment.trim() }),
//       });

//       const data = await response.json();

//       console.log(
//         "Add comment response:",
//         data
//       );

//       if (!response.ok) {
//         throw new Error(
//           data.message || "Failed to add comment"
//         );
//       }

//       setNewComment("");

//       if (data.comment) {

//         setComments((prev) => {

//           const alreadyExists =
//             prev.some(
//               (item) =>
//                 Number(item.id) ===
//                 Number(data.comment.id)
//             );

//           if (alreadyExists) {
//             return prev;
//           }

//           return [
//             ...prev,
//             data.comment,
//           ];
//         });
//       }
//       // if (!response.ok) {
//       //   throw new Error(data.message || "Failed to add comment");
//       // }

//       // setNewComment("");
//       // loadComments();
//     } catch (error) {
//       console.error("Add comment error:", error);
//       setCommentError(error.message);
//     } finally {
//       setCommentSubmitting(false);
//     }
//   };

//   // =========================
//   // LOADING
//   // =========================
//   if (loading) {
//     return (
//       <div className="animate-pulse space-y-4">
//         <div className="h-8 w-48 bg-white rounded-lg border border-slate-200" />
//         <div className="h-64 bg-white rounded-2xl border border-slate-200" />
//       </div>
//     );
//   }

//   // =========================
//   // ERROR
//   // =========================
//   if (error) {
//     return (
//       <div className="bg-white border border-red-100 rounded-2xl p-8 max-w-md shadow-card">
//         <p className="text-red-500 font-semibold text-sm mb-4">{error}</p>
//         <button
//           onClick={() => navigate("/tasks")}
//           className="px-4 py-2.5 rounded-xl bg-ink text-white text-sm font-bold hover:opacity-90 transition-opacity"
//         >
//           Back to Tasks
//         </button>
//       </div>
//     );
//   }

//   // =========================
//   // TASK NOT FOUND
//   // =========================
//   if (!task) {
//     return (
//       <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md shadow-card">
//         <p className="text-slate-500 text-sm mb-4">Task not found.</p>
//         <button
//           onClick={() => navigate("/tasks")}
//           className="px-4 py-2.5 rounded-xl bg-ink text-white text-sm font-bold hover:opacity-90 transition-opacity"
//         >
//           Back to Tasks
//         </button>
//       </div>
//     );
//   }
//   const submitTask = async () => {
//     try {
//       const token = localStorage.getItem("token");

//       const response = await fetch(
//         `${API_URL}/tasks/${id}/submit`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to submit task");
//       }

//       alert("Task submitted successfully");

//       loadTask();
//       loadHistory();

//     } catch (error) {
//       console.error("Submit task error:", error);
//       alert(error.message);
//     }
//   };

//   const handleDelete = async () => {

//     const confirmed = window.confirm(
//       "Are you sure you want to delete this task? This cannot be undone."
//     );

//     if (!confirmed) {
//       return;
//     }

//     try {

//       const token = localStorage.getItem("token");

//       const response = await fetch(
//         `${API_URL}/tasks/${task.id}`,
//         {
//           method: "DELETE",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`
//           }
//         }
//       );

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(
//           data.message || "Failed to delete task"
//         );
//       }

//       alert("Task deleted successfully");

//       navigate("/tasks");

//     } catch (error) {

//       console.log("Delete task error:", error);

//       alert(error.message);
//     }
//   };

//   const handleEdit = () => {
//     navigate(`/tasks/${task.id}/edit`);
//   };

//   const assignButler = async () => {
//     if (!selectedButler) {
//       setAssignError("Please select a Butler");
//       return;
//     }

//     try {
//       setAssigning(true);
//       setAssignError("");
//       setAssignMessage("");

//       const token = localStorage.getItem("token");

//       const response = await fetch(`${API_URL}/tasks/${id}/assign`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ assigned_to: Number(selectedButler) }),
//       });

//       const data = await response.json();
//       console.log("Assign Butler response:", data);

//       if (!response.ok) {
//         throw new Error(data.message || "Failed to assign Butler");
//       }

//       setAssignMessage(
//         task.assigned_to_name ? "Task reassigned successfully" : "Task assigned successfully"
//       );

//       // Reload task details
//       loadTask();

//       // Reload status history
//       loadHistory();

//       // Reload assignment history
//       loadAssignmentHistory();

//       // Clear selected Butler
//       setSelectedButler("");
//     } catch (error) {
//       console.error("Assign Butler error:", error);
//       setAssignError(error.message);
//     } finally {
//       setAssigning(false);
//     }
//   };

//   // =========================
//   // PAGE
//   // =========================
//   return (
//     <div className="max-w-4xl">
//       <style>{`
//         @keyframes cardIn {
//           from { opacity: 0; transform: translateY(12px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .card-in { animation: cardIn 0.45s ease both; }
//       `}</style>

//       {/* <div className="flex items-center justify-between gap-4 mb-6 card-in">
//         <div>
//           <h1 className="text-3xl font-black text-ink">Task Details</h1>
//           <p className="text-slate-400 mt-1">View task information</p>
//         </div>
//         <button
//           onClick={() => navigate("/tasks")}
//           className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 hover:-translate-y-0.5 transition-all w-fit shrink-0"
//         >
//           <ArrowLeft className="w-4 h-4" /> Back to Tasks
//         </button>
//       </div> */}

//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 card-in">
//   <div>
//     <h1 className="text-3xl font-black text-ink">Task Details</h1>
//     <p className="text-slate-400 mt-1">View task information</p>
//   </div>

//   <div className="flex flex-wrap items-center gap-2">
//     {canEdit && (
//       <button
//         onClick={handleEdit}
//         className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-600 hover:-translate-y-0.5 transition-all w-fit"
//       >
//         <Pencil className="w-4 h-4" />
//         Edit
//       </button>
//     )}

//     {canDelete && (
//       <button
//         onClick={handleDelete}
//         className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 hover:-translate-y-0.5 transition-all w-fit shadow-lg shadow-red-200"
//       >
//         <Trash2 className="w-4 h-4" />
//         Delete
//       </button>
//     )}

//     <button
//       onClick={() => navigate("/tasks")}
//       className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 hover:-translate-y-0.5 transition-all w-fit"
//     >
//       <ArrowLeft className="w-4 h-4" /> Back to Tasks
//     </button>
//   </div>
// </div>

//       {/* <div className="flex items-center justify-between gap-4 mb-6 card-in">
//   <div>
//     <h1 className="text-3xl font-black text-ink">Task Details</h1>
//     <p className="text-slate-400 mt-1">View task information</p>
//   </div>

// <div className="flex items-center gap-2 shrink-0">
//     {canEdit && (
//       <button
//         onClick={handleEdit}
//         className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-600 hover:-translate-y-0.5 transition-all w-fit"
//       >
//         <Pencil className="w-4 h-4" />
//         Edit
//       </button>
//     )}

//     {canDelete && (
//       <button
//         onClick={handleDelete}
//         className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 hover:-translate-y-0.5 transition-all w-fit shadow-lg shadow-red-200"
//       >
//         <Trash2 className="w-4 h-4" />
//         Delete
//       </button>
//     )}

//     <button
//       onClick={() => navigate("/tasks")}
//       className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 hover:-translate-y-0.5 transition-all w-fit"
//     >
//       <ArrowLeft className="w-4 h-4" /> Back to Tasks
//     </button>
// </div>
// </div> */}

//       {/* Main info card */}
//       <div
//         className="card-in bg-white rounded-2xl border border-slate-200 shadow-card p-6 mb-5 hover:shadow-soft transition-shadow duration-300"
//         style={{ animationDelay: "60ms" }}
//       >
//         <div className="flex items-start justify-between gap-4 mb-2">

//           <div>
//             <h2 className="text-xl font-black text-ink">
//               {task.title}
//             </h2>
//           </div>

//           <div className="flex items-center gap-3">

//             <StatusPill status={task.status} />

//             {userRole === "Employee" && task.status === "Draft" && (
//               <button
//                 onClick={submitTask}
//                 className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-bold hover:opacity-90 transition-opacity"
//               >
//                 <Send className="w-4 h-4" />
//                 Submit Task
//               </button>
//             )}

//           </div>

//         </div>
//         <p className="text-sm text-slate-500 mb-4">{task.description}</p>

//         <div className="grid sm:grid-cols-2 gap-x-8">
//           <DetailRow
//             icon={Tag}
//             label="Task ID"
//             value={`#${task.id}`}
//           />

//           <DetailRow
//             icon={User}
//             label="Assigned To"
//             value={task.assigned_to_name || "Not assigned yet"}
//           />

//           <DetailRow
//             icon={User}
//             label="Role"
//             value={task.assigned_to_role || "-"}
//           />

//           <DetailRow
//             icon={Tag}
//             label="Priority"
//             value={task.priority || "-"}
//           />

//           <DetailRow
//             icon={CalendarClock}
//             label="Due Date"
//             value={
//               task.due_date
//                 ? new Date(task.due_date).toLocaleString()
//                 : "-"
//             }
//           />

//           <DetailRow
//             icon={Tag}
//             label="Location"
//             value={task.location || "-"}
//           />

//           <DetailRow
//             icon={Clock}
//             label="Created At"
//             value={
//               task.created_at
//                 ? new Date(task.created_at).toLocaleString()
//                 : "-"
//             }
//           />

//           <DetailRow
//             icon={Clock}
//             label="Last Updated"
//             value={
//               task.updated_at
//                 ? new Date(task.updated_at).toLocaleString()
//                 : "-"
//             }
//           />
//         </div>
//       </div>

//       {task.status === "Completed" && (
//         <div
//           className="card-in bg-white rounded-2xl border border-slate-200 shadow-card p-6 mb-5"
//           style={{ animationDelay: "80ms" }}
//         >
//           <div className="flex items-center gap-2 mb-3">
//             <MessageSquare className="w-4 h-4 text-violet-500" />
//             <h2 className="font-black text-ink">Completion Notes</h2>
//           </div>

//           {task.completion_notes ? (
//             <p className="text-sm text-slate-600 leading-relaxed">
//               {task.completion_notes}
//             </p>
//           ) : (
//             <p className="text-sm text-slate-400">
//               No completion notes were provided.
//             </p>
//           )}
//         </div>
//       )}

//       {/* Additional details from configurable_fields, if this task came from a template */}
//       {task.custom_fields && Object.keys(task.custom_fields).length > 0 && (
//         <div
//           className="card-in bg-white rounded-2xl border border-slate-200 shadow-card p-6 mb-5 hover:shadow-soft transition-shadow duration-300"
//           style={{ animationDelay: "90ms" }}
//         >
//           <div className="flex items-center gap-2 mb-3">
//             <SlidersHorizontal className="w-4 h-4 text-violet-500" />
//             <h2 className="font-black text-ink">Additional Details</h2>
//           </div>
//           <div className="grid sm:grid-cols-2 gap-x-8">
//             {Object.entries(task.custom_fields).map(([key, value]) => (
//               <div key={key} className="py-2 border-b border-slate-100 last:border-b-0">
//                 <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">
//                   {key.replace(/_/g, " ")}
//                 </div>
//                 <div className="text-sm text-ink mt-0.5">{value || "-"}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Assign / Reassign Butler */}
//       {canReassign && (
//         <div
//           className="card-in bg-white rounded-2xl border border-slate-200 shadow-card p-6 mb-5 hover:shadow-soft transition-shadow duration-300"
//           style={{ animationDelay: "120ms" }}
//         >
//           <div className="flex items-center gap-2 mb-4">
//             <UserPlus className="w-4 h-4 text-violet-500" />
//             <h2 className="font-black text-ink">
//               {task.assigned_to_name ? "Reassign Butler" : "Assign Butler"}
//             </h2>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-3">
//             <select
//               value={selectedButler}
//               onChange={(e) => setSelectedButler(e.target.value)}
//               className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-violet-400 transition-colors text-sm text-ink"
//             >
//               <option value="">Select Butler</option>
//               {butlers.map((butler) => (
//                 <option key={butler.id} value={butler.id}>
//                   {butler.name}
//                 </option>
//               ))}
//             </select>

//             <button
//               onClick={assignButler}
//               disabled={!selectedButler || assigning}
//               className="px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity whitespace-nowrap"
//             >
//               {assigning
//                 ? "Assigning..."
//                 : task.assigned_to_name
//                   ? "Reassign Butler"
//                   : "Assign Butler"}
//             </button>
//           </div>

//           {assignError && <p className="text-red-500 text-xs font-semibold mt-3">{assignError}</p>}
//           {assignMessage && (
//             <p className="text-emerald-500 text-xs font-semibold mt-3">{assignMessage}</p>
//           )}
//         </div>
//       )}

//       {/* Status History */}
//       <div
//         className="card-in bg-white rounded-2xl border border-slate-200 shadow-card p-6 mb-5 hover:shadow-soft transition-shadow duration-300"
//         style={{ animationDelay: "180ms" }}
//       >
//         <div className="flex items-center gap-2 mb-4">
//           <History className="w-4 h-4 text-violet-500" />
//           <h2 className="font-black text-ink">Status History</h2>
//         </div>

//         {historyLoading ? (
//           <p className="text-sm text-slate-400">Loading history...</p>
//         ) : (
//           <TimelineList
//             items={history}
//             emptyText="No status history available."
//             renderLine={(item) => (
//               <>
//                 {item.old_status} <span className="text-slate-400 font-normal">→</span>{" "}
//                 {item.new_status}
//               </>
//             )}
//             renderMeta={(item) =>
//               `Changed by ${item.changed_by_name}${item.changed_at ? ` · ${new Date(item.changed_at).toLocaleString()}` : ""
//               }`
//             }
//           />
//         )}
//       </div>

//       {/* Assignment History */}
//       <div
//         className="card-in bg-white rounded-2xl border border-slate-200 shadow-card p-6 mb-5 hover:shadow-soft transition-shadow duration-300"
//         style={{ animationDelay: "220ms" }}
//       >
//         <div className="flex items-center gap-2 mb-4">
//           <Repeat className="w-4 h-4 text-violet-500" />
//           <h2 className="font-black text-ink">Assignment History</h2>
//         </div>

//         {assignmentHistoryLoading ? (
//           <p className="text-sm text-slate-400">Loading assignment history...</p>
//         ) : (
//           <TimelineList
//             items={assignmentHistory}
//             emptyText="No reassignment history available."
//             renderLine={(item) => (
//               <>
//                 {item.old_assignee || "Unassigned"}{" "}
//                 <span className="text-slate-400 font-normal">→</span> {item.new_assignee}
//               </>
//             )}
//             renderMeta={(item) =>
//               `Reassigned by ${item.changed_by_name}${item.assigned_at ? ` · ${new Date(item.assigned_at).toLocaleString()}` : ""
//               }`
//             }
//           />
//         )}
//       </div>

//       {/* Comments */}
//       <div
//         className="card-in bg-white rounded-2xl border border-slate-200 shadow-card p-6 hover:shadow-soft transition-shadow duration-300"
//         style={{ animationDelay: "260ms" }}
//       >
//         <div className="flex items-center gap-2 mb-4">
//           <MessageSquare className="w-4 h-4 text-violet-500" />
//           <h2 className="font-black text-ink">Comments</h2>
//         </div>

//         {commentsLoading ? (
//           <p className="text-sm text-slate-400">Loading comments...</p>
//         ) : comments.length === 0 ? (
//           <p className="text-sm text-slate-400 mb-5">No comments yet.</p>
//         ) : (
//           <div className="space-y-4 mb-6">
//             {comments.map((item) => (
//               <div key={item.id} className="flex gap-3">
//                 <div className="w-8 h-8 rounded-full bg-ink text-white grid place-items-center text-xs font-bold shrink-0">
//                   {(item.user_role || "?").slice(0, 1).toUpperCase()}
//                 </div>
//                 <div className="min-w-0 flex-1 bg-slate-50 rounded-xl px-4 py-3 hover:bg-slate-100 transition-colors">
//                   <div className="flex items-center gap-2">
//                     <strong className="text-sm text-ink">{item.user_name}</strong>
//                     {item.user_role && (
//                       <span className="text-[10px] font-bold uppercase tracking-wide text-violet-500 bg-violet-50 px-2 py-0.5 rounded-full">
//                         {item.user_role}
//                       </span>
//                     )}
//                   </div>
//                   <p className="text-sm text-slate-600 mt-1">{item.comment}</p>
//                   <small className="text-xs text-slate-400 mt-1 block">
//                     {item.created_at ? new Date(item.created_at).toLocaleString() : "-"}
//                   </small>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         <div className="border-t border-slate-100 pt-5">
//           <h3 className="text-sm font-bold text-ink mb-2">Add Comment</h3>
//           <textarea
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//             placeholder="Write your comment..."
//             rows="3"
//             className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-violet-400 transition-colors text-sm text-ink resize-none"
//           />

//           {commentError && (
//             <p className="text-red-500 text-xs font-semibold mt-2">{commentError}</p>
//           )}

//                     <button
//             onClick={addComment}
//             disabled={commentSubmitting}
//             className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:opacity-90 disabled:opacity-40 transition-opacity"
//           >
//             <Send className="w-3.5 h-3.5" />
//             {commentSubmitting ? "Adding..." : "Add Comment"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default TaskDetails;

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTranslatedText } from "../hooks/useTranslatedText";

import {
  ArrowLeft,
  User,
  Tag,
  CalendarClock,
  Clock,
  MessageSquare,
  UserPlus,
  Send,
  History,
  Repeat,
  SlidersHorizontal,
  Pencil,
  Loader2,
  Trash2,
} from "lucide-react";
import socket from "../socket";
const API_URL = "https://hatbox-scanner-subscribe.ngrok-free.dev/api";
const user = JSON.parse(localStorage.getItem("user") || "null");

const userId = user?.id;
const userRole = user?.role;




const STATUS_STYLES = {
  Draft: "bg-slate-100 text-slate-600",
  Submitted: "bg-amber-50 text-amber-600",
  Assigned: "bg-blue-50 text-blue-600",
  Accepted: "bg-indigo-50 text-indigo-600",
  "In-Progress": "bg-orange-50 text-orange-600",
  Completed: "bg-emerald-50 text-emerald-600",
  Rejected: "bg-red-50 text-red-600",
  Cancelled: "bg-red-50 text-red-600",
  "On Hold": "bg-yellow-50 text-yellow-600",
};

// StatusPill now translates via dashboard.status.<RawValue>, reusing
// the same keys as Dashboard.jsx / Tasks.jsx so every status label
// stays consistent app-wide. Falls back to the raw value (with the
// In-Progress -> "In Progress" spacing fix) if a key is missing.
function StatusPill({ status }) {
  const { t } = useTranslation();
  const fallback = status === "In-Progress" ? "In Progress" : status;
  const label = t(`dashboard.status.${status}`, fallback);

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[status] || "bg-slate-100 text-slate-600"
        }`}
    >
      {label}
    </span>
  );
}

function DetailRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-b-0">
      <Icon className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">{label}</div>
        <div className="text-sm text-ink mt-0.5">{value}</div>
      </div>
    </div>
  );
}

function TimelineList({ items, renderLine, renderMeta, emptyText }) {
  if (items.length === 0) {
    return <p className="text-sm text-slate-400">{emptyText}</p>;
  }
  return (
    <div className="relative pl-5">
      <div className="absolute left-[7px] top-1 bottom-1 w-px bg-slate-200" />
      <div className="space-y-5">
        {items.map((item) => (
          <div key={item.id} className="relative">
            <span className="absolute -left-5 top-1 w-3 h-3 rounded-full bg-violet-500 border-2 border-white shadow" />
            <div className="text-sm font-bold text-ink">{renderLine(item)}</div>
            <p className="text-xs text-slate-400 mt-0.5">{renderMeta(item)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}


function DeleteConfirmModal({
  task,
  isDeleting,
  errorMessage,
  onConfirm,
  onCancel,
  t,
}) {
  const translatedName = useTranslatedText(task.title);

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl p-7 max-w-sm w-full"
      >
        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 grid place-items-center mb-4">
          <Trash2 className="w-6 h-6" />
        </div>

        <h2 className="text-lg font-black text-ink mb-2">
          {t("tasks.delete.title")}
        </h2>

        <p className="text-sm text-slate-500 mb-4">
          {t("tasks.delete.message", {
            name: translatedName,
          })}
        </p>

        {errorMessage && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl px-4 py-3 mb-4">
            {errorMessage}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-sm hover:bg-slate-50 transition disabled:opacity-50"
          >
            {t("tasks.delete.cancel")}
          </button>

          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("tasks.delete.deleting")}
              </>
            ) : (
              t("tasks.delete.confirm")
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Place this above or below the main TaskDetails component (same file is fine).
// Extracted into its own component so useTranslatedText is called once per
// comment, safely, instead of inside the parent's .map() loop.
function CommentItem({ item, dateLocale }) {
  const translatedComment = useTranslatedText(item.comment);

  return (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full bg-ink text-white grid place-items-center text-xs font-bold shrink-0">
        {(item.user_role || "?").slice(0, 1).toUpperCase()}
      </div>
      <div className="min-w-0 flex-1 bg-slate-50 rounded-xl px-4 py-3 hover:bg-slate-100 transition-colors">
        <div className="flex items-center gap-2">
          <strong className="text-sm text-ink">{item.user_name}</strong>
          {item.user_role && (
            <span className="text-[10px] font-bold uppercase tracking-wide text-violet-500 bg-violet-50 px-2 py-0.5 rounded-full">
              {item.user_role}
            </span>
          )}
        </div>
        <p className="text-sm text-slate-600 mt-1">{translatedComment}</p>
        <small className="text-xs text-slate-400 mt-1 block">
          {item.created_at ? new Date(item.created_at).toLocaleString(dateLocale) : "-"}
        </small>
      </div>
    </div>
  );
}

function TaskDetails() {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [userRole, setUserRole] = useState("");
  
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserRole(user?.role || "");
  }, []);

  // Locale for date formatting — matches the active i18n language
  const dateLocale = i18n.language === "hi" ? "hi-IN" : "en-IN";

  const canEdit =
    userRole === "Admin" ||
    userRole === "Manager" ||
    userRole === "Employee" &&
      task &&
      Number(task.assigned_by) === Number(userId) &&
       task.status === "Assigned";

  const canDelete =
    userRole === "Admin" ||
    userRole === "Manager" ||
    (
      userRole === "Employee" &&
      task &&
      Number(task.assigned_by) === Number(userId)
    );

  useEffect(() => {

    console.log(
      `TaskDetails listening for comments for task ${id}`
    );


    const handleNewComment =
      (incomingComment) => {

        console.log(
          "REAL-TIME COMMENT RECEIVED:",
          incomingComment
        );


        // ==========================================
        // ONLY HANDLE CURRENT TASK
        // ==========================================

        if (
          Number(incomingComment.task_id) !==
          Number(id)
        ) {

          return;
        }


        // ==========================================
        // ADD COMMENT WITHOUT RELOAD
        // ==========================================

        setComments((prev) => {

          const alreadyExists =
            prev.some(
              (comment) =>
                Number(comment.id) ===
                Number(incomingComment.id)
            );


          if (alreadyExists) {
            return prev;
          }


          return [
            ...prev,
            incomingComment,
          ];
        });
      };


    // ==========================================
    // LISTEN
    // ==========================================

    socket.on(
      "new_comment",
      handleNewComment
    );


    // ==========================================
    // CLEANUP
    // ==========================================

    return () => {

      socket.off(
        "new_comment",
        handleNewComment
      );
    };

  }, [id]);

  const canReassign = userRole === "Admin" || userRole === "Manager";


  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [butlers, setButlers] = useState([]);
  const [selectedButler, setSelectedButler] = useState("");
  const [assigning, setAssigning] = useState(false);
  const [assignError, setAssignError] = useState("");
  const [assignMessage, setAssignMessage] = useState("");
  const [assignmentHistory, setAssignmentHistory] = useState([]);
  const [assignmentHistoryLoading, setAssignmentHistoryLoading] = useState(true);
const [taskToDelete, setTaskToDelete] = useState(null);
const [deleteError, setDeleteError] = useState("");
const [isDeleting, setIsDeleting] = useState(false);

   const translatedTitle = useTranslatedText(task?.title);
  const translatedDescription = useTranslatedText(task?.description);
  const loadAssignmentHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/tasks/${id}/assignment-history`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load assignment history");
      }

      setAssignmentHistory(data);
    } catch (error) {
      console.error("Assignment history error:", error);
    } finally {
      setAssignmentHistoryLoading(false);
    }
  };

  const loadButlers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/users/butlers`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Butlers:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to load Butlers");
      }

      setButlers(data);
    } catch (error) {
      console.error("Butler loading error:", error);
    }
  };

  useEffect(() => {
    loadTask();
    loadHistory();
    loadComments();
    loadAssignmentHistory();

    if (canReassign) {
      loadButlers();
    }
  }, [id, canReassign]);

  const loadTask = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/tasks/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Task details:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to load task");
      }

      setTask(data);
    } catch (error) {
      console.error("Task details error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/tasks/${id}/history`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Task history:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to load task history");
      }

      setHistory(data);
    } catch (error) {
      console.error("History error:", error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/tasks/${id}/comments`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("Task comments:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to load comments");
      }

      setComments(data);
    } catch (error) {
      console.error("Comments error:", error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) {
      setCommentError(t("taskDetails.comments.emptyError"));
      return;
    }

    try {
      setCommentSubmitting(true);
      setCommentError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/tasks/${id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ comment: newComment.trim() }),
      });

      const data = await response.json();

      console.log(
        "Add comment response:",
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add comment"
        );
      }

      setNewComment("");

      if (data.comment) {

        setComments((prev) => {

          const alreadyExists =
            prev.some(
              (item) =>
                Number(item.id) ===
                Number(data.comment.id)
            );

          if (alreadyExists) {
            return prev;
          }

          return [
            ...prev,
            data.comment,
          ];
        });
      }
    } catch (error) {
      console.error("Add comment error:", error);
      setCommentError(error.message);
    } finally {
      setCommentSubmitting(false);
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-48 bg-white rounded-lg border border-slate-200" />
        <div className="h-64 bg-white rounded-2xl border border-slate-200" />
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================
  if (error) {
    return (
      <div className="bg-white border border-red-100 rounded-2xl p-8 max-w-md shadow-card">
        <p className="text-red-500 font-semibold text-sm mb-4">{error}</p>
        <button
          onClick={() => navigate("/tasks")}
          className="px-4 py-2.5 rounded-xl bg-ink text-white text-sm font-bold hover:opacity-90 transition-opacity"
        >
          {t("taskDetails.backToTasks")}
        </button>
      </div>
    );
  }

  // =========================
  // TASK NOT FOUND
  // =========================
  if (!task) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md shadow-card">
        <p className="text-slate-500 text-sm mb-4">{t("taskDetails.taskNotFound")}</p>
        <button
          onClick={() => navigate("/tasks")}
          className="px-4 py-2.5 rounded-xl bg-ink text-white text-sm font-bold hover:opacity-90 transition-opacity"
        >
          {t("taskDetails.backToTasks")}
        </button>
      </div>
    );
  }
  const submitTask = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/tasks/${id}/submit`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to submit task");
      }

      alert(t("taskDetails.submittedSuccess"));

      loadTask();
      loadHistory();

    } catch (error) {
      console.error("Submit task error:", error);
      alert(error.message);
    }
  };

const requestDelete = (task) => {
  console.log("DELETE CLICKED:", task);

  setTaskToDelete(task);
  setDeleteError("");
};


const confirmDelete = async () => {
    if (!taskToDelete) return;

    try {
        setIsDeleting(true);
        setDeleteError("");

        const token = localStorage.getItem("token");

        const response = await fetch(
            `${API_URL}/tasks/${taskToDelete.id}`,
            {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || t("tasks.delete.error")
            );
        }

        setTaskToDelete(null);

        navigate("/tasks");

    } catch (error) {
        console.error("Delete task error:", error);

        setDeleteError(
            error.message || t("tasks.delete.error")
        );
    } finally {
        setIsDeleting(false);
    }
};



const cancelDelete = () => {
  setTaskToDelete(null);
  setDeleteError("");
};

  const handleEdit = () => {
    navigate(`/tasks/${task.id}/edit`);
  };

  const assignButler = async () => {
    if (!selectedButler) {
      setAssignError(t("taskDetails.assignButler.selectError"));
      return;
    }

    try {
      setAssigning(true);
      setAssignError("");
      setAssignMessage("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/tasks/${id}/assign`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ assigned_to: Number(selectedButler) }),
      });

      const data = await response.json();
      console.log("Assign Butler response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to assign Butler");
      }

      setAssignMessage(
        task.assigned_to_name
          ? t("taskDetails.assignButler.reassignedSuccess")
          : t("taskDetails.assignButler.assignedSuccess")
      );

      // Reload task details
      loadTask();

      // Reload status history
      loadHistory();

      // Reload assignment history
      loadAssignmentHistory();

      // Clear selected Butler
      setSelectedButler("");
    } catch (error) {
      console.error("Assign Butler error:", error);
      setAssignError(error.message);
    } finally {
      setAssigning(false);
    }
  };

  // =========================
  // PAGE
  // =========================
  return (
    <div className="max-w-4xl">
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card-in { animation: cardIn 0.45s ease both; }
      `}</style>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 card-in">
        <div>
          <h1 className="text-3xl font-black text-ink">{t("taskDetails.pageTitle")}</h1>
          <p className="text-slate-400 mt-1">{t("taskDetails.pageSubtitle")}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canEdit && (
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-violet-50 hover:border-violet-200 hover:text-violet-600 hover:-translate-y-0.5 transition-all w-fit"
            >
              <Pencil className="w-4 h-4" />
              {t("taskDetails.edit")}
            </button>
          )}

          {canDelete && (
            <button
              onClick={() => requestDelete(task)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 hover:-translate-y-0.5 transition-all w-fit shadow-lg shadow-red-200"
            >
              <Trash2 className="w-4 h-4" />
              {t("taskDetails.delete")}
            </button>
          )}

          <button
            onClick={() => navigate("/tasks")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 hover:-translate-y-0.5 transition-all w-fit"
          >
            <ArrowLeft className="w-4 h-4" /> {t("taskDetails.backToTasks")}
          </button>
        </div>
      </div>

      {/* Main info card
          Note: task.title / task.description / assigned_to_name / assigned_to_role /
          task.location and custom_fields are DB content — not translated by static
          i18n files. See the earlier note on translating dynamic content. */}
      <div
        className="card-in bg-white rounded-2xl border border-slate-200 shadow-card p-6 mb-5 hover:shadow-soft transition-shadow duration-300"
        style={{ animationDelay: "60ms" }}
      >
        <div className="flex items-start justify-between gap-4 mb-2">

          <div>
            <h2 className="text-xl font-black text-ink">
             {translatedTitle}
            </h2>
          </div>

          <div className="flex items-center gap-3">

            <StatusPill status={task.status} />

            {userRole === "Employee" && task.status === "Draft" && (
              <button
                onClick={submitTask}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-white text-sm font-bold hover:opacity-90 transition-opacity"
              >
                <Send className="w-4 h-4" />
                {t("taskDetails.submitTask")}
              </button>
            )}

          </div>

        </div>
        <p className="text-sm text-slate-500 mb-4">{translatedDescription}</p>

        <div className="grid sm:grid-cols-2 gap-x-8">
          <DetailRow
            icon={Tag}
            label={t("taskDetails.fields.taskId")}
            value={`#${task.id}`}
          />

          <DetailRow
            icon={User}
            label={t("taskDetails.fields.assignedTo")}
            value={task.assigned_to_name || t("taskDetails.fields.notAssignedYet")}
          />

          <DetailRow
            icon={User}
            label={t("taskDetails.fields.role")}
            value={task.assigned_to_role || "-"}
          />

          <DetailRow
            icon={Tag}
            label={t("taskDetails.fields.priority")}
            value={task.priority ? t(`dashboard.priority.${task.priority}`, task.priority) : "-"}
          />

          <DetailRow
            icon={CalendarClock}
            label={t("taskDetails.fields.dueDate")}
            value={
              task.due_date
                ? new Date(task.due_date).toLocaleString(dateLocale)
                : "-"
            }
          />

          <DetailRow
            icon={Tag}
            label={t("taskDetails.fields.location")}
            value={task.location || "-"}
          />

          <DetailRow
            icon={Clock}
            label={t("taskDetails.fields.createdAt")}
            value={
              task.created_at
                ? new Date(task.created_at).toLocaleString(dateLocale)
                : "-"
            }
          />

          <DetailRow
            icon={Clock}
            label={t("taskDetails.fields.lastUpdated")}
            value={
              task.updated_at
                ? new Date(task.updated_at).toLocaleString(dateLocale)
                : "-"
            }
          />
        </div>
      </div>

      {task.status === "Completed" && (
        <div
          className="card-in bg-white rounded-2xl border border-slate-200 shadow-card p-6 mb-5"
          style={{ animationDelay: "80ms" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-4 h-4 text-violet-500" />
            <h2 className="font-black text-ink">{t("taskDetails.completionNotes.title")}</h2>
          </div>

          {task.completion_notes ? (
            <p className="text-sm text-slate-600 leading-relaxed">
              {task.completion_notes}
            </p>
          ) : (
            <p className="text-sm text-slate-400">
              {t("taskDetails.completionNotes.empty")}
            </p>
          )}
        </div>
      )}

      {/* Additional details from configurable_fields, if this task came from a template.
          Field keys/values are DB content and are not translated. */}
      {task.custom_fields && Object.keys(task.custom_fields).length > 0 && (
        <div
          className="card-in bg-white rounded-2xl border border-slate-200 shadow-card p-6 mb-5 hover:shadow-soft transition-shadow duration-300"
          style={{ animationDelay: "90ms" }}
        >
          <div className="flex items-center gap-2 mb-3">
            <SlidersHorizontal className="w-4 h-4 text-violet-500" />
            <h2 className="font-black text-ink">{t("taskDetails.additionalDetails")}</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-8">
            {Object.entries(task.custom_fields).map(([key, value]) => (
              <div key={key} className="py-2 border-b border-slate-100 last:border-b-0">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                  {key.replace(/_/g, " ")}
                </div>
                <div className="text-sm text-ink mt-0.5">{value || "-"}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assign / Reassign Butler */}
      {canReassign && (
        <div
          className="card-in bg-white rounded-2xl border border-slate-200 shadow-card p-6 mb-5 hover:shadow-soft transition-shadow duration-300"
          style={{ animationDelay: "120ms" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <UserPlus className="w-4 h-4 text-violet-500" />
            <h2 className="font-black text-ink">
              {task.assigned_to_name
                ? t("taskDetails.assignButler.reassignTitle")
                : t("taskDetails.assignButler.assignTitle")}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedButler}
              onChange={(e) => setSelectedButler(e.target.value)}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-violet-400 transition-colors text-sm text-ink"
            >
              <option value="">{t("taskDetails.assignButler.selectPlaceholder")}</option>
              {butlers.map((butler) => (
                <option key={butler.id} value={butler.id}>
                  {butler.name}
                </option>
              ))}
            </select>

            <button
              onClick={assignButler}
              disabled={!selectedButler || assigning}
              className="px-5 py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity whitespace-nowrap"
            >
              {assigning
                ? t("taskDetails.assignButler.assigning")
                : task.assigned_to_name
                  ? t("taskDetails.assignButler.reassignTitle")
                  : t("taskDetails.assignButler.assignTitle")}
            </button>
          </div>

          {assignError && <p className="text-red-500 text-xs font-semibold mt-3">{assignError}</p>}
          {assignMessage && (
            <p className="text-emerald-500 text-xs font-semibold mt-3">{assignMessage}</p>
          )}
        </div>
      )}

      {/* Status History */}
      <div
        className="card-in bg-white rounded-2xl border border-slate-200 shadow-card p-6 mb-5 hover:shadow-soft transition-shadow duration-300"
        style={{ animationDelay: "180ms" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <History className="w-4 h-4 text-violet-500" />
          <h2 className="font-black text-ink">{t("taskDetails.statusHistory.title")}</h2>
        </div>

        {historyLoading ? (
          <p className="text-sm text-slate-400">{t("taskDetails.statusHistory.loading")}</p>
        ) : (
          <TimelineList
            items={history}
            emptyText={t("taskDetails.statusHistory.empty")}
            renderLine={(item) => (
              <>
                {t(`dashboard.status.${item.old_status}`, item.old_status)}{" "}
                <span className="text-slate-400 font-normal">→</span>{" "}
                {t(`dashboard.status.${item.new_status}`, item.new_status)}
              </>
            )}
            renderMeta={(item) =>
              `${t("taskDetails.statusHistory.changedBy", { name: item.changed_by_name })}${item.changed_at ? ` · ${new Date(item.changed_at).toLocaleString(dateLocale)}` : ""
              }`
            }
          />
        )}
      </div>

      {/* Assignment History */}
      <div
        className="card-in bg-white rounded-2xl border border-slate-200 shadow-card p-6 mb-5 hover:shadow-soft transition-shadow duration-300"
        style={{ animationDelay: "220ms" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Repeat className="w-4 h-4 text-violet-500" />
          <h2 className="font-black text-ink">{t("taskDetails.assignmentHistory.title")}</h2>
        </div>

        {assignmentHistoryLoading ? (
          <p className="text-sm text-slate-400">{t("taskDetails.assignmentHistory.loading")}</p>
        ) : (
          <TimelineList
            items={assignmentHistory}
            emptyText={t("taskDetails.assignmentHistory.empty")}
            renderLine={(item) => (
              <>
                {item.old_assignee || t("taskDetails.assignmentHistory.unassigned")}{" "}
                <span className="text-slate-400 font-normal">→</span> {item.new_assignee}
              </>
            )}
            renderMeta={(item) =>
              `${t("taskDetails.assignmentHistory.reassignedBy", { name: item.changed_by_name })}${item.assigned_at ? ` · ${new Date(item.assigned_at).toLocaleString(dateLocale)}` : ""
              }`
            }
          />
        )}
      </div>

      {/* Comments — item.comment / item.user_name are DB/user content, not translated */}
       <div
        className="card-in bg-white rounded-2xl border border-slate-200 shadow-card p-6 hover:shadow-soft transition-shadow duration-300"
        style={{ animationDelay: "260ms" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-4 h-4 text-violet-500" />
          <h2 className="font-black text-ink">{t("taskDetails.comments.title")}</h2>
        </div>
 
        {commentsLoading ? (
          <p className="text-sm text-slate-400">{t("taskDetails.comments.loading")}</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-slate-400 mb-5">{t("taskDetails.comments.empty")}</p>
        ) : (
          <div className="space-y-4 mb-6">
            {comments.map((item) => (
              <CommentItem key={item.id} item={item} dateLocale={dateLocale} />
            ))}
          </div>
        )}
 
        <div className="border-t border-slate-100 pt-5">
          <h3 className="text-sm font-bold text-ink mb-2">{t("taskDetails.comments.addTitle")}</h3>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t("taskDetails.comments.placeholder")}
            rows="3"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-violet-400 transition-colors text-sm text-ink resize-none"
          />
 
          {commentError && (
            <p className="text-red-500 text-xs font-semibold mt-2">{commentError}</p>
          )}
 
          <button
            onClick={addComment}
            disabled={commentSubmitting}
            className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            <Send className="w-3.5 h-3.5" />
            {commentSubmitting ? t("taskDetails.comments.adding") : t("taskDetails.comments.add")}
          </button>
        </div>
      </div>
            {/* Comments card ends here */}
               {/* <div
        className="card-in bg-white rounded-2xl border border-slate-200 shadow-card p-6 hover:shadow-soft transition-shadow duration-300"
        style={{ animationDelay: "260ms" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <MessageSquare className="w-4 h-4 text-violet-500" />
          <h2 className="font-black text-ink">{t("taskDetails.comments.title")}</h2>
        </div>
 
        {commentsLoading ? (
          <p className="text-sm text-slate-400">{t("taskDetails.comments.loading")}</p>
        ) : comments.length === 0 ? (
          <p className="text-sm text-slate-400 mb-5">{t("taskDetails.comments.empty")}</p>
        ) : (
          <div className="space-y-4 mb-6">
            {comments.map((item) => (
              <CommentItem key={item.id} item={item} dateLocale={dateLocale} />
            ))}
          </div>
        )}
 
        <div className="border-t border-slate-100 pt-5">
          <h3 className="text-sm font-bold text-ink mb-2">{t("taskDetails.comments.addTitle")}</h3>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={t("taskDetails.comments.placeholder")}
            rows="3"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-violet-400 transition-colors text-sm text-ink resize-none"
          />
 
          {commentError && (
            <p className="text-red-500 text-xs font-semibold mt-2">{commentError}</p>
          )}
 
          <button
            onClick={addComment}
            disabled={commentSubmitting}
            className="mt-3 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-sm font-bold hover:opacity-90 disabled:opacity-40 transition-opacity"
          >
            <Send className="w-3.5 h-3.5" />
            {commentSubmitting ? t("taskDetails.comments.adding") : t("taskDetails.comments.add")}
          </button>
        </div>
      </div> */}

{taskToDelete && (
  <DeleteConfirmModal
    task={taskToDelete}
    isDeleting={isDeleting}
    errorMessage={deleteError}
    onConfirm={confirmDelete}
    onCancel={cancelDelete}
    t={t}
  />
)}

    
    </div>
  );
}

export default TaskDetails;