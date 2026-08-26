import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ClipboardPlus,
  AlertCircle,
  CheckCircle2,
  SlidersHorizontal,
} from "lucide-react";

const API_URL = "https://hatbox-scanner-subscribe.ngrok-free.dev/api";

const PRIORITIES = [
  { value: "Low", dot: "bg-slate-400", ring: "ring-slate-300", text: "text-slate-600", bg: "bg-slate-50" },
  { value: "Medium", dot: "bg-blue-400", ring: "ring-blue-300", text: "text-blue-600", bg: "bg-blue-50" },
  { value: "High", dot: "bg-orange-400", ring: "ring-orange-300", text: "text-orange-600", bg: "bg-orange-50" },
  { value: "Urgent", dot: "bg-red-400", ring: "ring-red-300", text: "text-red-600", bg: "bg-red-50" },
];

// Turns "guest_count" into "Guest Count" for display
function humanizeFieldName(fieldName) {
  return fieldName
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// Fields whose name suggests a number (count, quantity, etc.) get a number input
function isNumericField(fieldName) {
  return /count|quantity|qty|number|num\b/i.test(fieldName);
}

function CreateTask() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // ==========================================
  // LOGGED-IN USER ROLE
  // ==========================================
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserRole(user?.role || "");
  }, []);

  // Read templateId from:

  // Read templateId from:
  // /tasks/create?templateId=4
  const [searchParams] = useSearchParams();
  const templateId = searchParams.get("templateId");

  // ==========================================
  // FORM DATA
  // ==========================================
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [location, setLocation] = useState("");
  // ==========================================
  // TEMPLATE + DYNAMIC CONFIGURABLE FIELDS
  // ==========================================
  const [template, setTemplate] = useState(null);
  const [loadingTemplate, setLoadingTemplate] = useState(false);
  const [dynamicFieldNames, setDynamicFieldNames] = useState([]); // e.g. ["guest_count","items_needed"]
  const [fieldValues, setFieldValues] = useState({}); // { guest_count: "6", items_needed: "water,snacks" }

  const updateFieldValue = (fieldName, value) => {
    setFieldValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  // ==========================================
  // USERS
  // ==========================================
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  // ==========================================
  // FORM STATES
  // ==========================================
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ==========================================
  // LOAD USERS
  // ==========================================
  useEffect(() => {
    if (userRole === "Admin" || userRole === "Manager") {
      loadUsers();
    } else {
      setLoadingUsers(false);
    }
  }, [userRole]);

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
       throw new Error(
  data.message || t("createTask.errors.loadUsers")
);
      }

      const allowedUsers = data.filter(
        (user) => user.role === "Employee" || user.role === "Butler"
      );

      setUsers(allowedUsers);
    } catch (error) {
      console.log("Users error:", error);
      setError(error.message);
    } finally {
      setLoadingUsers(false);
    }
  };

  // ==========================================
  // LOAD TEMPLATE
  // ==========================================
  useEffect(() => {
    if (templateId) {
      loadTemplate();
    }
  }, [templateId]);

  const loadTemplate = async () => {
    try {
      setLoadingTemplate(true);
      setError("");

      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/task-templates/${templateId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
  data.message || t("createTask.errors.loadTemplate")
);

      }

      console.log("Template loaded:", data);
      setTemplate(data);

      // PRE-FILL FORM
      setTitle(data.name || "");
      setDescription(data.description || "");
      if (data.default_priority) {
        setPriority(data.default_priority);
      }

      // PARSE configurable_fields ("guest_count,items_needed") INTO DYNAMIC INPUTS
      if (data.configurable_fields) {
        const names = data.configurable_fields
          .split(",")
          .map((f) => f.trim())
          .filter(Boolean);
        setDynamicFieldNames(names);

        // reset any values from a previously selected template
        const initialValues = {};
        names.forEach((n) => (initialValues[n] = ""));
        setFieldValues(initialValues);
      } else {
        setDynamicFieldNames([]);
        setFieldValues({});
      }
    } catch (error) {
      console.error("Template error:", error);
      setError(error.message);
    } finally {
      setLoadingTemplate(false);
    }
  };

  // ==========================================
  // SUBMIT FORM
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          template_id: templateId ? Number(templateId) : null,
          title: title,
          description: description,
          assigned_to: assignedTo ? Number(assignedTo) : null,
          due_date: dueDate || null,
          priority: priority,
          location: location || null,
          custom_fields: dynamicFieldNames.length > 0 ? fieldValues : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
  data.message || t("createTask.errors.createTask")
);

      }

      console.log("Task created:", data);
      setSuccess(t("createTask.createdSuccess"));

      setTimeout(() => {
        navigate("/tasks");
      }, 1000);
    } catch (error) {
      console.log("Create task error:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // PAGE
  // ==========================================
  return (
    <div className="max-w-2xl">
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card-in { animation: cardIn 0.45s ease both; }
        @keyframes shake {
          10%, 90% { transform: translateX(-1px); }
          20%, 80% { transform: translateX(2px); }
          30%, 50%, 70% { transform: translateX(-3px); }
          40%, 60% { transform: translateX(3px); }
        }
        .shake { animation: shake 0.4s ease; }
      `}</style>

      <div className="mb-6 card-in">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 grid place-items-center">
            <ClipboardPlus className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-black text-ink">
            {t("createTask.pageTitle")}
          </h1>

        </div>
        <p className="text-slate-400">
          {t("createTask.pageSubtitle")}
        </p>

      </div>

      {template && (
        <div className="mb-4 bg-violet-50 border border-violet-100 rounded-xl px-4 py-3">
          <p className="text-xs font-bold text-violet-500 uppercase">
            {t("createTask.fromTemplate")}
          </p>
          <p className="text-sm font-bold text-violet-700">{template.name}</p>
        </div>
      )}

      {loadingTemplate && (
        <div className="mb-4 bg-slate-100 rounded-xl px-4 py-3 text-sm text-slate-500">
          {t("createTask.loadingTemplate")}
        </div>
      )}

      {error && (
        <div className="shake flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-xl px-4 py-3 mb-4">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-semibold rounded-xl px-4 py-3 mb-4">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="card-in bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-5"
        style={{ animationDelay: "60ms" }}
      >
        {/* TITLE */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
            {t("createTask.taskTitle")} *
          </label>
          <input
            type="text"
            placeholder={t("createTask.taskTitlePlaceholder")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-violet-400 transition-colors text-sm text-ink"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
            {t("createTask.description")}
          </label>
          <textarea
            placeholder={t("createTask.descriptionPlaceholder")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-violet-400 transition-colors text-sm text-ink resize-none"
          />
        </div>

        {/* LOCATION */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
            {t("createTask.location")}
          </label>

          <input
            type="text"
            placeholder={t("createTask.locationPlaceholder")}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-violet-400 transition-colors text-sm text-ink"
          />
        </div>
        {/* PRIORITY */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
            {t("createTask.priority.label")}
          </label>
          <div className="flex flex-wrap gap-2">
            {PRIORITIES.map((p) => {
              const active = priority === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${active
                    ? `${p.bg} ${p.text} border-transparent ring-2 ${p.ring}`
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                    }`}
                >
                  <span className={`w-2 h-2 rounded-full ${p.dot}`} />
                  {t(`createTask.priority.${p.value}`)}
                </button>
              );
            })}
          </div>
        </div>

        {/* DYNAMIC CONFIGURABLE FIELDS — driven by the selected template */}
        {dynamicFieldNames.length > 0 && (
          <div className="border border-violet-100 bg-violet-50/40 rounded-xl p-4 space-y-4">
            <div className="flex items-center gap-2 text-violet-600">
              <SlidersHorizontal className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wide">
                Additional details for this template
              </span>
            </div>

            {dynamicFieldNames.map((fieldName) => (
              <div key={fieldName}>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                  {t(`createTask.fields.${fieldName}`, {
                    defaultValue: humanizeFieldName(fieldName),
                  })}
                </label>
                <input
                  type={isNumericField(fieldName) ? "number" : "text"}
                  min={isNumericField(fieldName) ? 0 : undefined}
                  placeholder={t("createTask.fieldPlaceholder", {
                    field: t(`createTask.fields.${fieldName}`, {
                      defaultValue: humanizeFieldName(fieldName),
                    }),
                  })}
                  value={fieldValues[fieldName] || ""}
                  onChange={(e) => updateFieldValue(fieldName, e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:border-violet-400 transition-colors text-sm text-ink"
                />
              </div>
            ))}
          </div>
        )}

        {/* ASSIGN TO */}
        {/* ASSIGN TO — ADMIN / MANAGER ONLY
{(userRole === "Admin" || userRole === "Manager") && (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
      Assign To *
    </label>

    {loadingUsers ? (
      <div className="h-11 rounded-xl bg-slate-100 animate-pulse" />
    ) : (
      <select
        value={assignedTo}
        onChange={(e) => setAssignedTo(e.target.value)}
        required
        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-violet-400 transition-colors text-sm text-ink"
      >
        <option value="">Select Butler</option>

        {users
          .filter((user) => user.role === "Butler")
          .map((user) => (
            <option key={user.id} value={user.id}>
              {user.name}
            </option>
          ))}
      </select>
    )}
  </div>
)} */}

        {/* DUE DATE */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
            {t("createTask.dueDate")}
          </label>
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-violet-400 transition-colors text-sm text-ink"
          />
        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/tasks")}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
            {t("createTask.cancel")}
          </button>

          <button
            type="submit"
            disabled={loading || loadingTemplate}
            className="flex-1 px-4 py-3 rounded-xl bg-accent text-white text-sm font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {loading
              ? t("createTask.creating")
              : t("createTask.createTask")}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTask;