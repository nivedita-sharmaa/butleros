import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const API_URL = import.meta.env.VITE_API_URL;

const PRIORITIES = [
  {
    value: "Low",
    dot: "bg-slate-400",
    ring: "ring-slate-300",
    text: "text-slate-600",
    bg: "bg-slate-50",
  },
  {
    value: "Medium",
    dot: "bg-blue-400",
    ring: "ring-blue-300",
    text: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    value: "High",
    dot: "bg-orange-400",
    ring: "ring-orange-300",
    text: "text-orange-600",
    bg: "bg-orange-50",
  },
  {
    value: "Urgent",
    dot: "bg-red-400",
    ring: "ring-red-300",
    text: "text-red-600",
    bg: "bg-red-50",
  },
];

const CATEGORY_SUGGESTIONS = [
  { value: "Refreshment", label: "refreshment" },
  { value: "Guest Service", label: "guestService" },
  { value: "Logistics", label: "logistics" },
  { value: "Other", label: "other" },
];


function CreateTemplate() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  // ==========================================
  // FORM DATA
  // ==========================================
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [defaultPriority, setDefaultPriority] = useState("Medium");
  const [isActive, setIsActive] = useState(true);
  const [slaMinutes, setSlaMinutes] = useState("");
  const [configurableFields, setConfigurableFields] = useState("");

  // ==========================================
  // FORM STATES
  // ==========================================
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

      const response = await fetch(`${API_URL}/task-templates`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name,
          description: description,
          category: category || null,
          default_priority: defaultPriority,
          is_active: isActive,
          sla_minutes: slaMinutes ? Number(slaMinutes) : null,
          configurable_fields: configurableFields || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || t("createTemplate.createFailed"));
      }

      console.log("Template created:", data);
      setSuccess(t("createTemplate.createdSuccess"));

      setTimeout(() => {
        navigate("/task-templates");
      }, 1000);
    } catch (error) {
      console.log("Create template error:", error);
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
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="text-3xl font-black text-ink">
            {t("createTemplate.pageTitle")}
          </h1>
        </div>
        <p className="text-slate-400">
          {t("createTemplate.pageSubtitle")}
        </p>

      </div>

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
        {/* NAME */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
            {t("createTemplate.templateName")}
          </label>
          <input
            type="text"
            placeholder={t("createTemplate.templateNamePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-violet-400 transition-colors text-sm text-ink"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
            {t("createTemplate.description")}
          </label>
          <textarea
            placeholder={t("createTemplate.descriptionPlaceholder")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="4"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-violet-400 transition-colors text-sm text-ink resize-none"
          />
        </div>

        {/* CATEGORY */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
            {t("createTemplate.category")}
          </label>

          <input
            type="text"
            list="category-suggestions"
            placeholder={t("createTemplate.categoryPlaceholder")}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-violet-400 transition-colors text-sm text-ink"
          />

          <datalist id="category-suggestions">
            {CATEGORY_SUGGESTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {t(`createTemplate.categories.${c.label}`)}
              </option>
            ))}
          </datalist>
        </div>

        {/* DEFAULT PRIORITY */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
            {t("createTemplate.defaultPriority")}
          </label>
          <div className="flex flex-wrap gap-2">
            {PRIORITIES.map((p) => {
              const active = defaultPriority === p.value;
              return (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setDefaultPriority(p.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${active
                    ? `${p.bg} ${p.text} border-transparent ring-2 ${p.ring}`
                    : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                    }`}
                >
                  <span className={`w-2 h-2 rounded-full ${p.dot}`} />
                  {t(`createTemplate.priority.${p.value}`)}
                </button>

              );
            })}
          </div>
        </div>

        {/* SLA + ACTIVE TOGGLE (side by side) */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
              {t("createTemplate.sla")}
            </label>

            <input
              type="number"
              min="0"
              placeholder={t("createTemplate.slaPlaceholder")}
              value={slaMinutes}
              onChange={(e) => setSlaMinutes(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-violet-400 transition-colors text-sm text-ink"
            />

            <p className="text-xs text-slate-400 mt-1.5">
              {t("createTemplate.slaHelp")}
            </p>

          </div>

          {/* <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
              {t("createTemplate.status")}
            </label>
            <button
              type="button"
              onClick={() => setIsActive((v) => !v)}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-colors ${isActive
                ? "bg-emerald-50 border-emerald-100"
                : "bg-slate-50 border-slate-200"
                }`}
            >
              <span className={`text-sm font-bold ${isActive ? "text-emerald-600" : "text-slate-500"}`}>
                {isActive
                  ? t("createTemplate.active")
                  : t("createTemplate.inactive")}

              </span>
              <span
                className={`w-10 h-6 rounded-full relative transition-colors ${isActive ? "bg-emerald-400" : "bg-slate-300"
                  }`}
              >
                <span
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${isActive ? "left-[18px]" : "left-0.5"
                    }`}
                />
              </span>
            </button>
          </div> */}
        </div>

        {/* CONFIGURABLE FIELDS */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
            {t("createTemplate.configurableFields")}
          </label>

          <input
            type="text"
            placeholder={t("createTemplate.configurableFieldsPlaceholder")}
            value={configurableFields}
            onChange={(e) => setConfigurableFields(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-violet-400 transition-colors text-sm text-ink"
          />

          <p className="text-xs text-slate-400 mt-1.5">
            {t("createTemplate.configurableFieldsHelp")}
          </p>

        </div>

        {/* BUTTONS */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={() => navigate("/task-templates")}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
          >
           {t("createTemplate.cancel")}
          </button>

          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl bg-accent text-white text-sm font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            {loading
  ? t("createTemplate.creating")
  : t("createTemplate.createTemplate")}

          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateTemplate;