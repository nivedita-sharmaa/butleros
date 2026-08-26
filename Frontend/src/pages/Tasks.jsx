// import { useNavigate } from "react-router-dom";
// import { useEffect, useMemo, useState } from "react";
// import socket from "../socket";

// const API_URL = "https://hatbox-scanner-subscribe.ngrok-free.dev/api";


// // ==========================================
// // FILTER OPTIONS
// // ==========================================

// const STATUS_OPTIONS = [
//     // "Submitted",
//     "Rejected",
//     "Assigned",
//     "In-Progress",
//     "Completed"
// ];

// const PRIORITY_OPTIONS = [
//     "Urgent",
//     "High",
//     "Medium",
//     "Low"
// ];

// const ICON_RULES = [
//     { icon: "☕", words: ["coffee", "tea", "chai", "espresso", "beverage"] },
//     { icon: "💧", words: ["water", "bottle", "hydrat", "refill", "cooler"] },
//     { icon: "🍽️", words: ["refreshment", "snack", "food", "lunch", "meal", "breakfast", "guest"] },
//     { icon: "🧹", words: ["clean", "housekeep", "tidy", "sweep", "mop", "trash", "garbage"] },
//     { icon: "📦", words: ["package", "parcel", "courier", "delivery", "pickup", "dispatch"] },
//     { icon: "🖨️", words: ["print", "photocopy", "scan", "stationery", "document"] },
//     { icon: "🔧", words: ["repair", "fix", "maintenance", "broken", "ac ", "light", "bulb"] },
//     { icon: "🚗", words: ["cab", "taxi", "car", "driver", "pickup drop", "transport"] },
//     { icon: "👕", words: ["laundry", "iron", "dry clean", "uniform"] },
//     { icon: "🗓️", words: ["meeting", "reminder", "schedule", "appointment", "book room"] },
//     { icon: "💻", words: ["laptop", "computer", "wifi", "network", "system", "it "] }
// ];

// function Tasks() {

//     const navigate = useNavigate();

//     const [tasks, setTasks] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");

//     const [search, setSearch] = useState("");
//     const [statusFilter, setStatusFilter] = useState("");
//     const [priorityFilter, setPriorityFilter] = useState("");

//     const user = JSON.parse(localStorage.getItem("user"));
//     const userRole = user?.role;


//     // ==========================================
//     // LOAD TASKS
//     // ==========================================

//     useEffect(() => {
//         loadTasks();
//     }, []);

// useEffect(() => {
//     const handleTaskCreated = (newTask) => {
//         setTasks((prev) => [newTask, ...prev]);
//     };

//     const handleTaskUpdated = ({ id, status }) => {
//         setTasks((prev) =>
//             prev.map((t) => (t.id === id ? { ...t, status } : t))
//         );
//     };

//     socket.on("task_created", handleTaskCreated);
//     socket.on("task_updated", handleTaskUpdated);

//     return () => {
//         socket.off("task_created", handleTaskCreated);
//         socket.off("task_updated", handleTaskUpdated);
//     };
// }, []);
//     const loadTasks = async () => {

//         try {

//             const token = localStorage.getItem("token");

//             const response = await fetch(
//                 `${API_URL}/tasks`,
//                 {
//                     method: "GET",

//                     headers: {
//                         "Content-Type": "application/json",
//                         Authorization: `Bearer ${token}`
//                     }
//                 }
//             );

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(
//                     data.message || "Failed to load tasks"
//                 );
//             }

//             setTasks(data);

//         }
//         catch (error) {

//             console.error(
//                 "Tasks error:",
//                 error
//             );

//             setError(error.message);

//         }
//         finally {

//             setLoading(false);

//         }

//     };


//     // ==========================================
//     // FILTERED TASKS
//     // ==========================================

//     const filteredTasks = useMemo(() => {

//         const query = search
//             .trim()
//             .toLowerCase()
//             .replace(/-/g, " ");

//         return tasks.filter((task) => {


//             // --- STATUS ---

//             if (
//                 statusFilter &&
//                 task.status !== statusFilter
//             ) {
//                 return false;
//             }


//             // --- PRIORITY ---

//             const priority = task.priority || "Medium";

//             if (
//                 priorityFilter &&
//                 priority !== priorityFilter
//             ) {
//                 return false;
//             }


//             // --- SEARCH ---

//             if (!query) {
//                 return true;
//             }

//             const haystack = [
//                 task.title,
//                 task.task_type,
//                 task.assigned_by_name,
//                 task.assigned_to_name,
//                 `REQ-${task.id}`,
//                 task.status,
//                 priority
//             ]
//                 .filter(Boolean)
//                 .join(" ")
//                 .toLowerCase()
//                 .replace(/-/g, " ");

//             return haystack.includes(query);

//         });

//     }, [tasks, search, statusFilter, priorityFilter]);


//     const isFiltering =
//         search.trim() !== "" ||
//         statusFilter !== "" ||
//         priorityFilter !== "";


//     // ==========================================
//     // CLEAR FILTERS
//     // ==========================================

//     const clearFilters = () => {

//         setSearch("");
//         setStatusFilter("");
//         setPriorityFilter("");

//     };


//     // ==========================================
//     // STATUS CLASS
//     // ==========================================

//  const getStatusClass = (status) => {
//     switch (status) {
//         case "Pending":
//             return "status-pending";
//         case "In-Progress":
//             return "status-in-progress";
//         case "Completed":
//             return "status-completed";
//         case "Rejected":               
//             return "status-rejected";
//         default:
//             return "status-default";
//     }
// };


//     // ==========================================
//     // STATUS DISPLAY
//     // ==========================================

//     const getStatusText = (status) => {

//         if (status === "In-Progress") {
//             return "In Progress";
//         }

//         return status;

//     };


//     // ==========================================
//     // PRIORITY CLASS
//     // ==========================================

//     const getPriorityClass = (priority) => {

//         switch (priority) {

//             case "Urgent":
//                 return "priority-urgent";

//             case "High":
//                 return "priority-high";

//             case "Medium":
//                 return "priority-medium";

//             case "Low":
//                 return "priority-low";

//             default:
//                 return "priority-medium";

//         }

//     };


//     // ==========================================
//     // PRIORITY STRIPE
//     // ==========================================

//     const getStripeClass = (priority) => {

//         switch (priority) {

//             case "Urgent":
//                 return "stripe-urgent";

//             case "High":
//                 return "stripe-high";

//             case "Low":
//                 return "stripe-low";

//             default:
//                 return "stripe-medium";

//         }

//     };


//     // ==========================================
//     // PRIORITY DISPLAY
//     // ==========================================

//     const getPriorityText = (priority) => {

//         return priority || "Medium";

//     };


//     // ==========================================
//     // INITIALS
//     // ==========================================

//     const getInitials = (name) => {

//         if (!name) {
//             return "—";
//         }

//         return name
//             .trim()
//             .split(/\s+/)
//             .slice(0, 2)
//             .map((part) => part[0])
//             .join("")
//             .toUpperCase();

//     };


//     // ==========================================
//     // REQUEST ICON


// const getRequestIcon = (task) => {

//     const haystack = [
//         task.task_type,
//         task.title,
//         task.description
//     ]
//         .filter(Boolean)
//         .join(" ")
//         .toLowerCase();

//     const match = ICON_RULES.find((rule) =>
//         rule.words.some((word) => haystack.includes(word))
//     );

//     return match ? match.icon : "📋";

// };


//     // ==========================================
//     // FORMAT DUE DATE
//     // ==========================================

//     const formatDueDate = (date) => {

//         if (!date) {
//             return "No due date";
//         }

//         return new Date(date).toLocaleString(
//             "en-IN",
//             {
//                 day: "2-digit",
//                 month: "short",
//                 year: "numeric",
//                 hour: "2-digit",
//                 minute: "2-digit"
//             }
//         );

//     };


//     // ==========================================
//     // OPEN REQUEST
//     // ==========================================

//     const openTask = (id) => {
//         navigate(`/tasks/${id}`);
//     };


//     // ==========================================
//     // LOADING
//     // ==========================================

//     if (loading) {

//         return (

//             <div>

//                 <div className="page-header">

//                     <div>

//                         <h1>
//                             Service Requests
//                         </h1>

//                         <p className="page-description">
//                             Loading service requests...
//                         </p>

//                     </div>

//                 </div>

//                 <div className="request-skeleton">

//                     {[0, 1, 2, 3, 4, 5].map((row) => (

//                         <div
//                             key={row}
//                             className="skeleton-row"
//                             style={{
//                                 animationDelay: `${row * 90}ms`
//                             }}
//                         >
//                         </div>

//                     ))}

//                 </div>

//             </div>

//         );

//     }


//     // ==========================================
//     // ERROR
//     // ==========================================

//     if (error) {

//         return (

//             <div>

//                 <div className="page-header">

//                     <div>

//                         <h1>
//                             Service Requests
//                         </h1>

//                     </div>

//                 </div>

//                 <div className="empty-state">

//                     <h3>
//                         Couldn't load service requests
//                     </h3>

//                     <p>
//                         {error}
//                     </p>

//                     <button
//                         type="button"
//                         className="request-filter-clear"
//                         onClick={() => {

//                             setError("");
//                             setLoading(true);
//                             loadTasks();

//                         }}
//                     >
//                         Try again
//                     </button>

//                 </div>

//             </div>

//         );

//     }


//     // ==========================================
//     // PAGE
//     // ==========================================

//     return (

//         <div>

//             {/* ==================================
//                 PAGE HEADER
//             ================================== */}

//             <div className="page-header">

//                 <div>

//                     <h1>

//                         Service Requests

//                         {tasks.length > 0 && (

//                             <span className="request-count-pill">
//                                 {isFiltering
//                                     ? `${filteredTasks.length} of ${tasks.length}`
//                                     : tasks.length}
//                             </span>

//                         )}

//                     </h1>

//                     <p className="page-description">
//                         Manage and track service requests
//                     </p>

//                 </div>


//                 {(userRole === "Admin" ||
//     userRole === "Manager" ||
//     userRole === "Employee") && (

//                         <button
//                             className="primary-button"
//                             onClick={() =>
//                                 navigate("/tasks/create")
//                             }
//                         >
//                             + New Service Request
//                         </button>

//                     )}

//             </div>


//             {/* ==================================
//                 FILTER BAR
//             ================================== */}

//             {tasks.length > 0 && (

//                 <div className="request-filter-bar">


//                     {/* --- SEARCH --- */}

//                     <input
//                         type="text"
//                         className="request-search"
//                         placeholder="Search requests..."
//                         value={search}
//                         onChange={(e) =>
//                             setSearch(e.target.value)
//                         }
//                         onKeyDown={(e) => {

//                             if (e.key === "Escape") {
//                                 setSearch("");
//                             }

//                         }}
//                     />


//                     {/* --- STATUS --- */}

//                     <select
//                         className="request-filter-select"
//                         value={statusFilter}
//                         onChange={(e) =>
//                             setStatusFilter(e.target.value)
//                         }
//                     >

//                         <option value="">
//                             All statuses
//                         </option>

//                         {STATUS_OPTIONS.map((status) => (

//                             <option
//                                 key={status}
//                                 value={status}
//                             >
//                                 {getStatusText(status)}
//                             </option>

//                         ))}

//                     </select>


//                     {/* --- PRIORITY --- */}

//                     <select
//                         className="request-filter-select"
//                         value={priorityFilter}
//                         onChange={(e) =>
//                             setPriorityFilter(e.target.value)
//                         }
//                     >

//                         <option value="">
//                             All priorities
//                         </option>

//                         {PRIORITY_OPTIONS.map((priority) => (

//                             <option
//                                 key={priority}
//                                 value={priority}
//                             >
//                                 {priority}
//                             </option>

//                         ))}

//                     </select>


//                     {/* --- CLEAR --- */}

//                     {isFiltering && (

//                         <button
//                             type="button"
//                             className="request-filter-clear"
//                             onClick={clearFilters}
//                         >
//                             Clear
//                         </button>

//                     )}

//                 </div>

//             )}


//             {/* ==================================
//                 EMPTY STATES
//             ================================== */}

//             {tasks.length === 0 ? (

//                 <div className="empty-state">

//                     <h3>
//                         No service requests yet
//                     </h3>

//                     <p>
//                         New requests will appear here as soon as
//                         they are submitted.
//                     </p>

//                 </div>

//             ) : filteredTasks.length === 0 ? (

//                 <div className="empty-state">

//                     <h3>
//                         No requests match these filters
//                     </h3>

//                     <p>
//                         Try a different search term, or reset the
//                         status and priority filters.
//                     </p>

//                     <button
//                         type="button"
//                         className="request-filter-clear"
//                         onClick={clearFilters}
//                     >
//                         Clear filters
//                     </button>

//                 </div>

//             ) : (

//                 <div className="service-request-table">


//                     {/* ==================================
//                         COLUMN LABELS
//                     ================================== */}

//                     <div className="service-request-header">

//                         <div>
//                             Request
//                         </div>

//                         <div>
//                             Requester
//                         </div>

//                         <div>
//                             Butler
//                         </div>

//                         <div>
//                             Status
//                         </div>

//                         <div>
//                             Priority
//                         </div>

//                     </div>


//                     {/* ==================================
//                         TASK ROWS
//                     ================================== */}

//                     {filteredTasks.map((task, index) => (

//                         <div
//                             key={task.id}
//                             className={`service-request-row ${getStripeClass(
//                                 task.priority
//                             )}`}
//                             role="button"
//                             tabIndex={0}
//                             style={{
//                                 animationDelay: `${Math.min(index, 12) * 45}ms`
//                             }}
//                             onClick={() => openTask(task.id)}
//                             onKeyDown={(e) => {

//                                 if (
//                                     e.key === "Enter" ||
//                                     e.key === " "
//                                 ) {
//                                     e.preventDefault();
//                                     openTask(task.id);
//                                 }

//                             }}
//                         >


//                             {/* ==========================
//                                 REQUEST
//                             ========================== */}

//                             <div className="request-info">

//                                 <div className="request-icon">

//                                     {getRequestIcon(task)}

//                                 </div>

//                                 <div className="request-content">

//                                     <strong>
//                                         {task.title}
//                                     </strong>

//                                     <span>
//                                         REQ-{task.id}
//                                         {" · "}
//                                         {task.task_type || "Service Request"}
//                                     </span>

//                                     <span className="request-due">
//                                         {formatDueDate(task.due_date)}
//                                     </span>

//                                 </div>

//                             </div>


//                             {/* ==========================
//                                 REQUESTER
//                             ========================== */}

//                             <div className="requester">

//                                 <span className="request-avatar">
//                                     {getInitials(task.assigned_by_name)}
//                                 </span>

//                                 <span className="request-person-name">
//                                     {task.assigned_by_name || "Unknown"}
//                                 </span>

//                             </div>


//                             {/* ==========================
//                                 BUTLER
//                             ========================== */}

//                             <div className="butler">

//                                 <span
//                                     className={
//                                         task.assigned_to_name
//                                             ? "request-avatar"
//                                             : "request-avatar is-empty"
//                                     }
//                                 >
//                                     {getInitials(task.assigned_to_name)}
//                                 </span>

//                                 <span className="request-person-name">
//                                     {task.assigned_to_name || "Unassigned"}
//                                 </span>

//                             </div>


//                             {/* ==========================
//                                 STATUS
//                             ========================== */}

//                             <div>

//                                 <span
//                                     className={`request-status ${getStatusClass(
//                                         task.status
//                                     )}`}
//                                 >

//                                     <span className="status-dot">
//                                     </span>

//                                     {getStatusText(task.status)}

//                                 </span>

//                             </div>


//                             {/* ==========================
//                                 PRIORITY
//                             ========================== */}

//                             <div>

//                                 <span
//                                     className={`request-priority ${getPriorityClass(
//                                         task.priority
//                                     )}`}
//                                 >

//                                     {getPriorityText(task.priority)}

//                                 </span>

//                             </div>

//                         </div>

//                     ))}

//                 </div>

//             )}

//         </div>

//     );

// }

// export default Tasks;

import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useTranslatedText } from "../hooks/useTranslatedText";
import TranslatedText from "../components/TranslatedText";
import socket from "../socket";

const API_URL = "https://hatbox-scanner-subscribe.ngrok-free.dev/api";


// ==========================================
// FILTER OPTIONS
// ==========================================

const STATUS_OPTIONS = [
    // "Submitted",
    "Rejected",
    "Assigned",
    "In-Progress",
    "Completed"
];

const PRIORITY_OPTIONS = [
    "Urgent",
    "High",
    "Medium",
    "Low"
];

const ICON_RULES = [
    { icon: "☕", words: ["coffee", "tea", "chai", "espresso", "beverage"] },
    { icon: "💧", words: ["water", "bottle", "hydrat", "refill", "cooler"] },
    { icon: "🍽️", words: ["refreshment", "snack", "food", "lunch", "meal", "breakfast", "guest"] },
    { icon: "🧹", words: ["clean", "housekeep", "tidy", "sweep", "mop", "trash", "garbage"] },
    { icon: "📦", words: ["package", "parcel", "courier", "delivery", "pickup", "dispatch"] },
    { icon: "🖨️", words: ["print", "photocopy", "scan", "stationery", "document"] },
    { icon: "🔧", words: ["repair", "fix", "maintenance", "broken", "ac ", "light", "bulb"] },
    { icon: "🚗", words: ["cab", "taxi", "car", "driver", "pickup drop", "transport"] },
    { icon: "👕", words: ["laundry", "iron", "dry clean", "uniform"] },
    { icon: "🗓️", words: ["meeting", "reminder", "schedule", "appointment", "book room"] },
    { icon: "💻", words: ["laptop", "computer", "wifi", "network", "system", "it "] }
];

function RequestRow({
    task,
    index,
    onOpen,
    getRequestIcon,
    formatDueDate,
    getStripeClass,
    getStatusClass,
    getStatusText,
    getPriorityClass,
    getPriorityText,
    getInitials,
    t,
}) {
    const translatedTitle = useTranslatedText(task.title);
    const translatedCategory = useTranslatedText(task.category);

    return (
        <div
            key={task.id}
            className={`service-request-row ${getStripeClass(task.priority)}`}
            role="button"
            tabIndex={0}
            style={{
                animationDelay: `${Math.min(index, 12) * 45}ms`
            }}
            onClick={() => onOpen(task.id)}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onOpen(task.id);
                }
            }}
        >

            {/* REQUEST */}
            <div className="request-info">
                <div className="request-icon">
                    {getRequestIcon(task)}
                </div>
                <div className="request-content">
                    <strong>
                        {translatedTitle}
                    </strong>
                    <span>
                        REQ-{task.id}.
                        {task.category && <> {translatedCategory}</>}
                    </span>
                    <span className="request-due">
                        {formatDueDate(task.due_date)}
                    </span>
                </div>
            </div>

            {/* REQUESTER */}
            <div className="requester">
                <span className="request-avatar">
                    {getInitials(task.assigned_by_name)}
                </span>
                <span className="request-person-name">
                    {task.assigned_by_name || t("tasks.unknown")}
                </span>
            </div>

            {/* BUTLER */}
            <div className="butler">
                <span
                    className={
                        task.assigned_to_name
                            ? "request-avatar"
                            : "request-avatar is-empty"
                    }
                >
                    {getInitials(task.assigned_to_name)}
                </span>
                <span className="request-person-name">
                    {task.assigned_to_name || t("tasks.unassigned")}
                </span>
            </div>

            {/* STATUS */}
            <div>
                <span
                    className={`request-status ${getStatusClass(task.status)}`}
                >
                    <span className="status-dot"></span>
                    {getStatusText(task.status)}
                </span>
            </div>

            {/* PRIORITY */}
            <div>
                <span
                    className={`request-priority ${getPriorityClass(task.priority)}`}
                >
                    {getPriorityText(task.priority)}
                </span>
            </div>

        </div>
    );
}

function Tasks() {

    const { t, i18n } = useTranslation();
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [priorityFilter, setPriorityFilter] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));
    const userRole = user?.role;


    // ==========================================
    // LOAD TASKS
    // ==========================================

    useEffect(() => {
        loadTasks();
    }, []);

    useEffect(() => {
        const handleTaskCreated = (newTask) => {
            setTasks((prev) => [newTask, ...prev]);
        };

        const handleTaskUpdated = ({ id, status }) => {
            setTasks((prev) =>
                prev.map((tk) => (tk.id === id ? { ...tk, status } : tk))
            );
        };

        socket.on("task_created", handleTaskCreated);
        socket.on("task_updated", handleTaskUpdated);

        return () => {
            socket.off("task_created", handleTaskCreated);
            socket.off("task_updated", handleTaskUpdated);
        };
    }, []);

    const loadTasks = async () => {

        try {

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/tasks`,
                {
                    method: "GET",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Failed to load tasks"
                );
            }

            setTasks(data);

        }
        catch (error) {

            console.error(
                "Tasks error:",
                error
            );

            setError(error.message);

        }
        finally {

            setLoading(false);

        }

    };


    // ==========================================
    // FILTERED TASKS
    // ==========================================

    const filteredTasks = useMemo(() => {

        const query = search
            .trim()
            .toLowerCase()
            .replace(/-/g, " ");

        return tasks.filter((task) => {


            // --- STATUS ---

            if (
                statusFilter &&
                task.status !== statusFilter
            ) {
                return false;
            }


            // --- PRIORITY ---

            const priority = task.priority || "Medium";

            if (
                priorityFilter &&
                priority !== priorityFilter
            ) {
                return false;
            }


            // --- SEARCH ---

            if (!query) {
                return true;
            }

            const haystack = [
                task.title,
                task.task_type,
                task.assigned_by_name,
                task.assigned_to_name,
                `REQ-${task.id}`,
                task.status,
                priority
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .replace(/-/g, " ");

            return haystack.includes(query);

        });

    }, [tasks, search, statusFilter, priorityFilter]);


    const isFiltering =
        search.trim() !== "" ||
        statusFilter !== "" ||
        priorityFilter !== "";


    // ==========================================
    // CLEAR FILTERS
    // ==========================================

    const clearFilters = () => {

        setSearch("");
        setStatusFilter("");
        setPriorityFilter("");

    };


    // ==========================================
    // STATUS CLASS
    // ==========================================

    const getStatusClass = (status) => {
        switch (status) {
            case "Pending":
                return "status-pending";
            case "In-Progress":
                return "status-in-progress";
            case "Completed":
                return "status-completed";
            case "Rejected":
                return "status-rejected";
            default:
                return "status-default";
        }
    };


    // ==========================================
    // STATUS DISPLAY
    // Reuses the same dashboard.status.* keys set up for the
    // Dashboard page, keyed by the exact DB value (e.g. "In-Progress"),
    // so status labels stay consistent app-wide. Falls back to the
    // raw value if a status (e.g. "Rejected", "Assigned") has no
    // translation entry yet.
    // ==========================================

    const getStatusText = (status) => {
        return t(`dashboard.status.${status}`, status === "In-Progress" ? "In Progress" : status);
    };


    // ==========================================
    // PRIORITY CLASS
    // ==========================================

    const getPriorityClass = (priority) => {

        switch (priority) {

            case "Urgent":
                return "priority-urgent";

            case "High":
                return "priority-high";

            case "Medium":
                return "priority-medium";

            case "Low":
                return "priority-low";

            default:
                return "priority-medium";

        }

    };


    // ==========================================
    // PRIORITY STRIPE
    // ==========================================

    const getStripeClass = (priority) => {

        switch (priority) {

            case "Urgent":
                return "stripe-urgent";

            case "High":
                return "stripe-high";

            case "Low":
                return "stripe-low";

            default:
                return "stripe-medium";

        }

    };


    // ==========================================
    // PRIORITY DISPLAY
    // Reuses dashboard.priority.* keys, same reasoning as status above.
    // ==========================================

    const getPriorityText = (priority) => {
        const value = priority || "Medium";
        return t(`dashboard.priority.${value}`, value);
    };


    // ==========================================
    // INITIALS
    // ==========================================

    const getInitials = (name) => {

        if (!name) {
            return "—";
        }

        return name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase();

    };


    // ==========================================
    // REQUEST ICON
    // ==========================================

    const getRequestIcon = (task) => {

        const haystack = [
            task.task_type,
            task.title,
            task.description
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        const match = ICON_RULES.find((rule) =>
            rule.words.some((word) => haystack.includes(word))
        );

        return match ? match.icon : "📋";

    };


    // ==========================================
    // FORMAT DUE DATE
    // Uses hi-IN locale formatting when Hindi is active, so dates
    // render in the expected Indian Hindi date/time convention.
    // ==========================================

    const formatDueDate = (date) => {

        if (!date) {
            return t("tasks.noDueDate");
        }

        const locale = i18n.language === "hi" ? "hi-IN" : "en-IN";

        return new Date(date).toLocaleString(
            locale,
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

    };


    // ==========================================
    // OPEN REQUEST
    // ==========================================

    const openTask = (id) => {
        navigate(`/tasks/${id}`);
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <div>

                <div className="page-header">

                    <div>

                        <h1>
                            {t("tasks.title")}
                        </h1>

                        <p className="page-description">
                            {t("tasks.loadingDescription")}
                        </p>

                    </div>

                </div>

                <div className="request-skeleton">

                    {[0, 1, 2, 3, 4, 5].map((row) => (

                        <div
                            key={row}
                            className="skeleton-row"
                            style={{
                                animationDelay: `${row * 90}ms`
                            }}
                        >
                        </div>

                    ))}

                </div>

            </div>

        );

    }


    // ==========================================
    // ERROR
    // ==========================================

    if (error) {

        return (

            <div>

                <div className="page-header">

                    <div>

                        <h1>
                            {t("tasks.title")}
                        </h1>

                    </div>

                </div>

                <div className="empty-state">

                    <h3>
                        {t("tasks.loadFailedTitle")}
                    </h3>

                    <p>
                        {error}
                    </p>

                    <button
                        type="button"
                        className="request-filter-clear"
                        onClick={() => {

                            setError("");
                            setLoading(true);
                            loadTasks();

                        }}
                    >
                        {t("tasks.tryAgain")}
                    </button>

                </div>

            </div>

        );

    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div>

            {/* ==================================
                PAGE HEADER
            ================================== */}

            <div className="page-header">

                <div>

                    <h1>

                        {t("tasks.title")}

                        {tasks.length > 0 && (

                            <span className="request-count-pill">
                                {isFiltering
                                    ? t("tasks.countOfTotal", { filtered: filteredTasks.length, total: tasks.length })
                                    : tasks.length}
                            </span>

                        )}

                    </h1>

                    <p className="page-description">
                        {t("tasks.description")}
                    </p>

                </div>


                {(userRole === "Admin" ||
                    userRole === "Manager" ||
                    userRole === "Employee") && (

                        <button
                            className="primary-button"
                            onClick={() =>
                                navigate("/tasks/create")
                            }
                        >
                            {t("tasks.newRequest")}
                        </button>

                    )}

            </div>


            {/* ==================================
                FILTER BAR
            ================================== */}

            {tasks.length > 0 && (

                <div className="request-filter-bar">


                    {/* --- SEARCH --- */}

                    <input
                        type="text"
                        className="request-search"
                        placeholder={t("tasks.searchPlaceholder")}
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        onKeyDown={(e) => {

                            if (e.key === "Escape") {
                                setSearch("");
                            }

                        }}
                    />


                    {/* --- STATUS --- */}

                    <select
                        className="request-filter-select"
                        value={statusFilter}
                        onChange={(e) =>
                            setStatusFilter(e.target.value)
                        }
                    >

                        <option value="">
                            {t("tasks.allStatuses")}
                        </option>

                        {STATUS_OPTIONS.map((status) => (

                            <option
                                key={status}
                                value={status}
                            >
                                {getStatusText(status)}
                            </option>

                        ))}

                    </select>


                    {/* --- PRIORITY --- */}

                    <select
                        className="request-filter-select"
                        value={priorityFilter}
                        onChange={(e) =>
                            setPriorityFilter(e.target.value)
                        }
                    >

                        <option value="">
                            {t("tasks.allPriorities")}
                        </option>

                        {PRIORITY_OPTIONS.map((priority) => (

                            <option
                                key={priority}
                                value={priority}
                            >
                                {getPriorityText(priority)}
                            </option>

                        ))}

                    </select>


                    {/* --- CLEAR --- */}

                    {isFiltering && (

                        <button
                            type="button"
                            className="request-filter-clear"
                            onClick={clearFilters}
                        >
                            {t("tasks.clear")}
                        </button>

                    )}

                </div>

            )}


            {/* ==================================
                EMPTY STATES
            ================================== */}

            {tasks.length === 0 ? (

                <div className="empty-state">

                    <h3>
                        {t("tasks.emptyTitle")}
                    </h3>

                    <p>
                        {t("tasks.emptyDescription")}
                    </p>

                </div>

            ) : filteredTasks.length === 0 ? (

                <div className="empty-state">

                    <h3>
                        {t("tasks.noMatchTitle")}
                    </h3>

                    <p>
                        {t("tasks.noMatchDescription")}
                    </p>

                    <button
                        type="button"
                        className="request-filter-clear"
                        onClick={clearFilters}
                    >
                        {t("tasks.clearFilters")}
                    </button>

                </div>

            ) : (

                <div className="service-request-table">


                    {/* ==================================
                        COLUMN LABELS
                    ================================== */}

                    <div className="service-request-header">

                        <div>
                            {t("tasks.columns.request")}
                        </div>

                        <div>
                            {t("tasks.columns.requester")}
                        </div>

                        <div>
                            {t("tasks.columns.butler")}
                        </div>

                        <div>
                            {t("tasks.columns.status")}
                        </div>

                        <div>
                            {t("tasks.columns.priority")}
                        </div>

                    </div>


                    {/* ==================================
                        TASK ROWS
                        Note: task.title / task.task_type / assigned_by_name /
                        assigned_to_name are DB content typed by users — these
                        stay as-is here since static i18n files can't translate
                        database content (see earlier note on dynamic content).
                    ================================== */}

                    {filteredTasks.map((task, index) => (
                        <RequestRow
                            key={task.id}
                            task={task}
                            index={index}
                            onOpen={openTask}
                            getRequestIcon={getRequestIcon}
                            formatDueDate={formatDueDate}
                            getStripeClass={getStripeClass}
                            getStatusClass={getStatusClass}
                            getStatusText={getStatusText}
                            getPriorityClass={getPriorityClass}
                            getPriorityText={getPriorityText}
                            getInitials={getInitials}
                            t={t}
                        />
                    ))}

                </div>

            )}

        </div>

    );

}

export default Tasks;