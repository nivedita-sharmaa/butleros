
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTranslatedText } from "../hooks/useTranslatedText";
import socket from "../socket";
import {
  ClipboardList,
  Clock,
  MapPin,
  AlertCircle,
  Loader2,
  CheckCircle2,
  PlayCircle,
} from "lucide-react";

const API_URL = "https://hatbox-scanner-subscribe.ngrok-free.dev/api";

const STATUS_STYLES = {
  Assigned: "bg-blue-50 text-blue-600",
  Accepted: "bg-indigo-50 text-indigo-600",
  "In-Progress": "bg-orange-50 text-orange-600",
  Completed: "bg-emerald-50 text-emerald-600",
  Rejected: "bg-red-50 text-red-600",
  Cancelled: "bg-red-50 text-red-600",
  "On Hold": "bg-yellow-50 text-yellow-600",
};

const PRIORITY_STYLES = {
  Low: "bg-slate-100 text-slate-600",
  Medium: "bg-blue-50 text-blue-600",
  High: "bg-orange-50 text-orange-600",
  Urgent: "bg-red-50 text-red-600",
};

function StatusPill({ status }) {
  const { t } = useTranslation();

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[status] || "bg-slate-100 text-slate-600"
        }`}
    >
      {status === "In-Progress"
        ? t("butlerDesk.status.inProgress")
        : t(`butlerDesk.status.${status}`)}
    </span>
  );
}

function TranslatedTask({ task }) {

  const translatedTitle =
    useTranslatedText(task.title);

  const translatedDescription =
    useTranslatedText(task.description);

  const translatedLocation =
    useTranslatedText(task.location);

  const translatedTaskType =
    useTranslatedText(task.task_type);

  return (
    <>
      {/* TITLE */}
      <h3 className="text-lg font-black text-ink">
        {translatedTitle}
      </h3>

      {/* TASK NUMBER + TASK TYPE */}
      <p className="text-sm text-slate-400 mt-1">
        Task #{task.id}

        {translatedTaskType && (
          <>
            {" · "}
            {translatedTaskType}
          </>
        )}
      </p>

      {/* DESCRIPTION */}
      {translatedDescription && (
        <p className="text-sm text-slate-500 mt-4 line-clamp-2">
          {translatedDescription}
        </p>
      )}

      {/* LOCATION */}
      {translatedLocation && (
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
          <MapPin className="w-3.5 h-3.5" />
          {translatedLocation}
        </div>
      )}
    </>
  );
}



function ButlerDesk() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [updatingTaskId, setUpdatingTaskId] = useState(null);
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    loadTasks();
  }, []);
  useEffect(() => {
    const handleTaskCreated = (newTask) => {
      setTasks((prev) => [newTask, ...prev]);
    };

    const handleTaskUpdated = ({ id, status }) => {
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? { ...task, status } : task))
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
      setLoading(true);
      setError("");

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

      console.log("Butler tasks:", data);

      setTasks(data);
    } catch (error) {
      console.error("Butler Desk error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      setUpdatingTaskId(taskId); setStatusError(""); const token = localStorage.getItem("token"); const response = await fetch(`${API_URL}/tasks/${taskId}/status`, { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, }, body: JSON.stringify({ status: newStatus, }), }); const data = await response.json(); if (!response.ok) { throw new Error(data.message || "Failed to update task status"); } // Update task immediately in UI 
      setTasks((prevTasks) => prevTasks.map((task) => task.id === taskId ? { ...task, status: newStatus, } : task));
    } catch (error) { console.error("Status update error:", error); setStatusError(error.message); } finally { setUpdatingTaskId(null); }
  };

  const renderStatusActions = (task) => { const isUpdating = updatingTaskId === task.id; if (task.status === "Assigned") { return (<div className="flex flex-wrap gap-2"> <button onClick={(e) => { e.stopPropagation(); updateTaskStatus(task.id, "Accepted"); }} disabled={isUpdating} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:opacity-90 disabled:opacity-40" > <CheckCircle2 className="w-4 h-4" /> {isUpdating ? "Updating..." : "Accept"} </button> <button onClick={(e) => { e.stopPropagation(); updateTaskStatus(task.id, "Rejected"); }} disabled={isUpdating} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 text-sm font-bold hover:bg-red-100 disabled:opacity-40" > <XCircle className="w-4 h-4" /> Reject </button> </div>); } if (task.status === "Accepted") { return (<button onClick={(e) => { e.stopPropagation(); updateTaskStatus(task.id, "In-Progress"); }} disabled={isUpdating} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-bold hover:opacity-90 disabled:opacity-40" > <PlayCircle className="w-4 h-4" /> {isUpdating ? "Starting..." : "Start Task"} </button>); } if (task.status === "In-Progress") { return (<div className="flex flex-wrap gap-2"> <button onClick={(e) => { e.stopPropagation(); updateTaskStatus(task.id, "Completed"); }} disabled={isUpdating} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:opacity-90 disabled:opacity-40" > <CheckCircle2 className="w-4 h-4" /> {isUpdating ? "Completing..." : "Complete"} </button> <button onClick={(e) => { e.stopPropagation(); updateTaskStatus(task.id, "On Hold"); }} disabled={isUpdating} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-50 text-yellow-700 text-sm font-bold hover:bg-yellow-100 disabled:opacity-40" > <PauseCircle className="w-4 h-4" /> On Hold </button> </div>); } if (task.status === "On Hold") { return (<button onClick={(e) => { e.stopPropagation(); updateTaskStatus(task.id, "In-Progress"); }} disabled={isUpdating} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 text-white text-sm font-bold hover:opacity-90 disabled:opacity-40" > <PlayCircle className="w-4 h-4" /> {isUpdating ? "Resuming..." : "Resume Task"} </button>); } return null; };
  // const filteredTasks =
  //   filter === "All"
  //     ? tasks
  //     : tasks.filter((task) => task.status === filter);
  const filteredTasks = (
    filter === "All" ? tasks : tasks.filter((task) => task.status === filter)
  ).sort((a, b) => {
    const isBottomA = a.status === "Completed" || a.status === "Rejected" ? 1 : 0;
    const isBottomB = b.status === "Completed" || b.status === "Rejected" ? 1 : 0;
    return isBottomA - isBottomB; // active tasks (0) sort before completed/rejected (1)
  });

  const assignedCount = tasks.filter(
    (task) => task.status === "Assigned"
  ).length;

  const acceptedCount = tasks.filter(
    (task) => task.status === "Accepted"
  ).length;

  const inProgressCount = tasks.filter(
    (task) => task.status === "In-Progress"
  ).length;

  const completedCount = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center gap-3 text-slate-500">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>{t("butlerDesk.loading")}</span>
        </div>
      </div>
    );
  }



  return (
    <div className="space-y-8">
      <style>{`
        @keyframes cardIn {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .card-in {
          animation: cardIn 0.45s ease both;
        }
      `}</style>

      {/* HEADER */}
      <div className="card-in">
        <h1 className="text-4xl font-black text-ink tracking-tight">
          {t("butlerDesk.pageTitle")}
        </h1>

        <p className="text-slate-400 text-lg mt-1">
          {t("butlerDesk.pageSubtitle")}
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 rounded-xl px-4 py-3">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 text-blue-500 mb-2">
            <ClipboardList className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">
              {t("butlerDesk.summary.assigned")}
            </span>

          </div>

          <p className="text-3xl font-black text-ink">
            {assignedCount}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 text-indigo-500 mb-2">
            <CheckCircle2 className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">
  {t("butlerDesk.summary.accepted")}
</span>

          </div>

          <p className="text-3xl font-black text-ink">
            {acceptedCount}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 text-orange-500 mb-2">
            <PlayCircle className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">
  {t("butlerDesk.summary.inProgress")}
</span>

          </div>

          <p className="text-3xl font-black text-ink">
            {inProgressCount}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-card">
          <div className="flex items-center gap-2 text-emerald-500 mb-2">
            <CheckCircle2 className="w-4 h-4" />
           <span className="text-xs font-bold uppercase">
  {t("butlerDesk.summary.completed")}
</span>

          </div>

          <p className="text-3xl font-black text-ink">
            {completedCount}
          </p>
        </div>
      </div>

      {/* FILTERS */}
      <div>
        <div className="flex flex-wrap gap-2">
          {[
            "All",
            "Assigned",
            "Accepted",
            "In-Progress",
            // "On Hold",
            "Completed",
          ].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${filter === status
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                }`}
            >
             {status === "In-Progress"
  ? t("butlerDesk.status.inProgress")
  : t(`butlerDesk.status.${status}`)}

            </button>
          ))}
        </div>
      </div>

      {/* TASKS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
           <h2 className="text-xl font-black text-ink">
  {t("butlerDesk.myTasks.title")}
</h2>

<p className="text-sm text-slate-400 mt-1">
  {t("butlerDesk.myTasks.subtitle")}
</p>

          </div>

          <span className="text-sm font-bold text-slate-400">
  {t("butlerDesk.taskCount", {
    count: filteredTasks.length,
  })}
</span>

        </div>

        {filteredTasks.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center shadow-card">
            <ClipboardList className="w-12 h-12 mx-auto text-slate-300 mb-4" />

            <h3 className="text-lg font-bold text-slate-600">
  {t("butlerDesk.noTasks.title")}
</h3>

<p className="text-sm text-slate-400 mt-1">
  {filter === "All"
    ? t("butlerDesk.noTasks.all")
    : t("butlerDesk.noTasks.filtered", {
        status:
          filter === "In-Progress"
            ? t("butlerDesk.status.inProgress")
            : t(`butlerDesk.status.${filter}`),
      })}
</p>

          </div>
        ) : (
          <div className="space-y-4">
        {filteredTasks.map((task) => (

  <div
    key={task.id}
    onClick={() => navigate(`/tasks/${task.id}`)}
    className="
      card-in
      bg-white
      rounded-2xl
      border
      border-slate-200
      shadow-card
      p-5
      cursor-pointer
      hover:shadow-soft
      hover:border-violet-200
      hover:-translate-y-0.5
      transition-all
    "
  >

    {/* TOP */}
    <div className="flex items-start justify-between gap-4">

      <div className="min-w-0">
        <TranslatedTask task={task} />
      </div>

      <StatusPill status={task.status} />

    </div>


    {/* DETAILS */}
    <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5">

      {/* PRIORITY */}
      <span
        className={`
          inline-flex
          items-center
          px-3
          py-1
          rounded-full
          text-xs
          font-bold
          ${
            PRIORITY_STYLES[task.priority] ||
            "bg-slate-100 text-slate-600"
          }
        `}
      >
        {task.priority
          ? t(`butlerDesk.priority.${task.priority}`)
          : t("butlerDesk.priority.Medium")}
      </span>


      {/* DUE DATE */}
      {task.due_date && (
        <span className="
          flex
          items-center
          gap-1.5
          text-xs
          font-semibold
          text-slate-400
        ">
          <Clock className="w-3.5 h-3.5" />

          {new Date(task.due_date).toLocaleString()}
        </span>
      )}

    </div>


    {/* ASSIGNED */}
    {task.status === "Assigned" && (

      <div className="flex gap-2 mt-5">

        <button
          onClick={(e) => {
            e.stopPropagation();
            updateTaskStatus(
              task.id,
              "Accepted"
            );
          }}
          className="
            px-4
            py-2
            rounded-xl
            bg-indigo-50
            text-indigo-600
            text-sm
            font-bold
            hover:bg-indigo-100
          "
        >
          {t("butlerDesk.actions.accept")}
        </button>


        <button
          onClick={(e) => {
            e.stopPropagation();
            updateTaskStatus(
              task.id,
              "Rejected"
            );
          }}
          className="
            px-4
            py-2
            rounded-xl
            bg-red-50
            text-red-600
            text-sm
            font-bold
            hover:bg-red-100
          "
        >
          {t("butlerDesk.actions.reject")}
        </button>

      </div>
    )}


    {/* ACCEPTED */}
    {task.status === "Accepted" && (

      <div className="mt-5">

        <button
          onClick={(e) => {
            e.stopPropagation();
            updateTaskStatus(
              task.id,
              "In-Progress"
            );
          }}
          className="
            px-4
            py-2
            rounded-xl
            bg-orange-50
            text-orange-600
            text-sm
            font-bold
            hover:bg-orange-100
          "
        >
          {t("butlerDesk.actions.startTask")}
        </button>

      </div>
    )}


    {/* IN-PROGRESS */}
    {task.status === "In-Progress" && (

      <div className="mt-5">

        <button
          onClick={(e) => {
            e.stopPropagation();
            updateTaskStatus(
              task.id,
              "Completed"
            );
          }}
          className="
            px-4
            py-2
            rounded-xl
            bg-emerald-50
            text-emerald-600
            text-sm
            font-bold
            hover:bg-emerald-100
          "
        >
          {t("butlerDesk.actions.markCompleted")}
        </button>

      </div>
    )}

  </div>

))}

          </div>
        )}
      </div>
    </div>
  );
}

export default ButlerDesk;

