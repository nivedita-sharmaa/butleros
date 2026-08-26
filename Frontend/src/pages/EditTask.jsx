
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    ClipboardPlus,
    AlertCircle,
    CheckCircle2,
    SlidersHorizontal
} from "lucide-react";

const API_URL = "https://hatbox-scanner-subscribe.ngrok-free.dev/api";

const PRIORITIES = [
    {
        value: "Low",
        dot: "bg-slate-400",
        ring: "ring-slate-300",
        text: "text-slate-600",
        bg: "bg-slate-50"
    },
    {
        value: "Medium",
        dot: "bg-blue-400",
        ring: "ring-blue-300",
        text: "text-blue-600",
        bg: "bg-blue-50"
    },
    {
        value: "High",
        dot: "bg-orange-400",
        ring: "ring-orange-300",
        text: "text-orange-600",
        bg: "bg-orange-50"
    },
    {
        value: "Urgent",
        dot: "bg-red-400",
        ring: "ring-red-300",
        text: "text-red-600",
        bg: "bg-red-50"
    }
];


// ==========================================
// HUMANIZE FIELD NAME
// ==========================================

function humanizeFieldName(fieldName) {
    return fieldName
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}


// ==========================================
// CHECK NUMERIC FIELD
// ==========================================

function isNumericField(fieldName) {
    return /count|quantity|qty|number|num\b/i.test(fieldName);
}


// ==========================================
// EDIT TASK
// ==========================================

function EditTask() {

    const navigate = useNavigate();
    const { id } = useParams();
    const { t } = useTranslation();


    // ==========================================
    // LOGGED-IN USER
    // ==========================================

    const [userRole, setUserRole] = useState("");


    // ==========================================
    // TASK
    // ==========================================

    const [task, setTask] = useState(null);

    const [loadingTask, setLoadingTask] = useState(true);


    // ==========================================
    // FORM DATA
    // ==========================================

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [dueDate, setDueDate] = useState("");
    const [location, setLocation] = useState("");


    // ==========================================
    // TEMPLATE
    // ==========================================

    const [templateId, setTemplateId] = useState(null);
    const [template, setTemplate] = useState(null);

    const [dynamicFieldNames, setDynamicFieldNames] = useState([]);
    const [fieldValues, setFieldValues] = useState({});


    // ==========================================
    // FORM STATES
    // ==========================================

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    // ==========================================
    // LOAD USER
    // ==========================================

    useEffect(() => {

        const user = JSON.parse(
            localStorage.getItem("user") || "null"
        );

        setUserRole(user?.role || "");

    }, []);


    // ==========================================
    // LOAD TASK
    // ==========================================

    useEffect(() => {

        if (id) {
            loadTask();
        }

    }, [id]);


    const loadTask = async () => {

        try {

            setLoadingTask(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/tasks/${id}`,
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
                    data.message || t("editTask.loadFailed")
                );
            }


            console.log("Task loaded:", data);

            setTask(data);


            // ==========================================
            // FILL FORM
            // ==========================================

            setTitle(data.title || "");

            setDescription(data.description || "");

            setPriority(
                data.priority || "Medium"
            );

            setLocation(
                data.location || ""
            );


            // ==========================================
            // DATE
            // ==========================================

            if (data.due_date) {

                const date = new Date(data.due_date);

                const year =
                    date.getFullYear();

                const month =
                    String(
                        date.getMonth() + 1
                    ).padStart(2, "0");

                const day =
                    String(
                        date.getDate()
                    ).padStart(2, "0");

                setDueDate(
                    `${year}-${month}-${day}`
                );
            }


            // ==========================================
            // TEMPLATE
            // ==========================================

            if (data.template_id) {

                setTemplateId(
                    data.template_id
                );

                loadTemplate(
                    data.template_id
                );
            }


            // ==========================================
            // CUSTOM FIELDS
            // ==========================================

            if (data.custom_fields) {

                let customFields =
                    data.custom_fields;


                if (
                    typeof customFields ===
                    "string"
                ) {

                    try {

                        customFields =
                            JSON.parse(
                                customFields
                            );

                    } catch (err) {

                        console.log(
                            "Custom fields parse error:",
                            err
                        );

                        customFields = {};
                    }
                }


                setFieldValues(
                    customFields || {}
                );

            } else {

                setFieldValues({});
            }

        }
        catch (error) {

            console.log(
                "Load task error:",
                error
            );

            setError(error.message);

        }
        finally {

            setLoadingTask(false);
        }
    };


    // ==========================================
    // LOAD TEMPLATE
    // ==========================================

    const loadTemplate = async (id) => {

        try {

            const token =
                localStorage.getItem("token");


            const response =
                await fetch(
                    `${API_URL}/task-templates/${id}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    t("editTask.loadTemplateFailed")
                );

            }


            console.log(
                "Template loaded:",
                data
            );


            setTemplate(data);


            // ==========================================
            // GET CONFIGURABLE FIELDS
            // ==========================================

            if (data.configurable_fields) {

                const names =
                    data.configurable_fields
                        .split(",")
                        .map(
                            (field) =>
                                field.trim()
                        )
                        .filter(Boolean);


                setDynamicFieldNames(
                    names
                );


                // Keep existing custom values
                setFieldValues(
                    (previous) => {

                        const updated = {
                            ...previous
                        };


                        names.forEach(
                            (name) => {

                                if (
                                    updated[name] ===
                                    undefined
                                ) {

                                    updated[name] =
                                        "";
                                }

                            }
                        );


                        return updated;
                    }
                );

            } else {

                setDynamicFieldNames([]);

            }

        }
        catch (error) {

            console.log(
                "Template error:",
                error
            );

            setError(error.message);
        }
    };


    // ==========================================
    // UPDATE DYNAMIC FIELD
    // ==========================================

    const updateFieldValue = (
        fieldName,
        value
    ) => {

        setFieldValues(
            (previous) => ({
                ...previous,
                [fieldName]: value
            })
        );
    };


    // ==========================================
    // HANDLE UPDATE
    // ==========================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);


        try {

            const token =
                localStorage.getItem("token");


            const response =
                await fetch(
                    `${API_URL}/tasks/${id}`,
                    {
                        method: "PUT",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`
                        },

                        body: JSON.stringify({

                            template_id:
                                templateId
                                    ? Number(templateId)
                                    : null,

                            title:
                                title.trim(),

                            description:
                                description || null,

                            priority:
                                priority,

                            due_date:
                                dueDate || null,

                            location:
                                location || null,

                            custom_fields:
                                dynamicFieldNames.length >
                                    0
                                    ? fieldValues
                                    : null
                        })
                    }
                );


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    t("editTask.updateFailed")
                );

            }


            console.log(
                "Task updated:",
                data
            );


            setSuccess(
                t("editTask.updatedSuccess")
            );



            // ==========================================
            // GO BACK TO TASK DETAILS
            // ==========================================

            setTimeout(() => {

                navigate(
                    `/tasks/${id}`
                );

            }, 800);

        }
        catch (error) {

            console.log(
                "Update task error:",
                error
            );

            setError(
                error.message
            );

        }
        finally {

            setLoading(false);
        }
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loadingTask) {

        return (
            <div className="max-w-2xl">

                <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-6">

                    <p className="text-sm text-slate-500">
                        {t("editTask.loading")}
                    </p>


                </div>

            </div>
        );
    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div className="max-w-2xl">

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
                    animation:
                        cardIn
                        0.45s ease both;
                }

                @keyframes shake {

                    10%, 90% {
                        transform:
                            translateX(-1px);
                    }

                    20%, 80% {
                        transform:
                            translateX(2px);
                    }

                    30%, 50%, 70% {
                        transform:
                            translateX(-3px);
                    }

                    40%, 60% {
                        transform:
                            translateX(3px);
                    }

                }

                .shake {
                    animation:
                        shake
                        0.4s ease;
                }

            `}</style>


            {/* ==================================
                HEADER
            ================================== */}

            <div className="mb-6 card-in">

                <div className="flex items-center gap-3 mb-1">

                    <div className="w-10 h-10 rounded-2xl bg-violet-50 text-violet-600 grid place-items-center">

                        <ClipboardPlus
                            className="w-5 h-5"
                        />

                    </div>


                    <h1 className="text-3xl font-black text-ink">
                        {t("editTask.pageTitle")}
                    </h1>


                </div>


                <p className="text-slate-400">
                    {t("editTask.pageDescription")}
                </p>


            </div>


            {/* ==================================
                ERROR
            ================================== */}

            {error && (

                <div className="shake flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm font-semibold rounded-xl px-4 py-3 mb-4">

                    <AlertCircle
                        className="w-4 h-4 shrink-0"
                    />

                    {error}

                </div>

            )}


            {/* ==================================
                SUCCESS
            ================================== */}

            {success && (

                <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 text-emerald-600 text-sm font-semibold rounded-xl px-4 py-3 mb-4">

                    <CheckCircle2
                        className="w-4 h-4 shrink-0"
                    />

                    {success}

                </div>

            )}


            {/* ==================================
                TEMPLATE
            ================================== */}

            {template && (

                <div className="mb-4 bg-violet-50 border border-violet-100 rounded-xl px-4 py-3">

                    <p className="text-xs font-bold text-violet-500 uppercase">
                        {t("editTask.fromTemplate")}
                    </p>



                    <p className="text-sm font-bold text-violet-700">

                        {template.name}

                    </p>

                </div>

            )}


            {/* ==================================
                FORM
            ================================== */}

            <form
                onSubmit={handleSubmit}
                className="card-in bg-white rounded-2xl border border-slate-200 shadow-card p-6 space-y-5"
            >


                {/* ==================================
                    TITLE
                ================================== */}

                <div>

                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                        {t("editTask.taskTitle")}
                    </label>



                    <input
                        type="text"
                        placeholder={t("editTask.taskTitlePlaceholder")}
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        required
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-violet-400 transition-colors text-sm text-ink"
                    />

                </div>


                {/* ==================================
                    DESCRIPTION
                ================================== */}

                <div>

                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                        {t("editTask.description")}
                    </label>



                    <textarea
                        placeholder={t("editTask.descriptionPlaceholder")}
                        value={description}
                        onChange={(e) =>
                            setDescription(
                                e.target.value
                            )
                        }
                        rows="4"
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-violet-400 transition-colors text-sm text-ink resize-none"
                    />

                </div>


                {/* ==================================
                    LOCATION
                ================================== */}

                <div>

                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                        {t("editTask.location")}
                    </label>

                    <input
                        type="text"
                        placeholder={t("editTask.locationPlaceholder")}
                        value={location}
                        onChange={(e) =>
                            setLocation(
                                e.target.value
                            )
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-violet-400 transition-colors text-sm text-ink"
                    />

                </div>


                {/* ==================================
                    PRIORITY
                ================================== */}

                <div>

                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
                        {t("editTask.priority")}
                    </label>



                    <div className="flex flex-wrap gap-2">

                        {PRIORITIES.map((p) => {

                            const active =
                                priority ===
                                p.value;


                            return (

                                <button
                                    key={p.value}
                                    type="button"
                                    onClick={() =>
                                        setPriority(
                                            p.value
                                        )
                                    }
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${active
                                            ? `${p.bg} ${p.text} border-transparent ring-2 ${p.ring}`
                                            : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                                        }`}
                                >

                                    <span
                                        className={`w-2 h-2 rounded-full ${p.dot}`}
                                    />

                                    {t(`editTask.priorities.${p.value.toLowerCase()}`)}

                                </button>

                            );

                        })}

                    </div>

                </div>


                {/* ==================================
                    DYNAMIC FIELDS
                ================================== */}

                {dynamicFieldNames.length > 0 && (

                    <div className="border border-violet-100 bg-violet-50/40 rounded-xl p-4 space-y-4">

                        <div className="flex items-center gap-2 text-violet-600">

                            <SlidersHorizontal
                                className="w-4 h-4"
                            />

                            <span className="text-xs font-bold uppercase tracking-wide">

                                {t("editTask.additionalDetails")}

                            </span>

                        </div>


                        {dynamicFieldNames.map(
                            (fieldName) => (

                                <div
                                    key={fieldName}
                                >

                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">

                                        {humanizeFieldName(
                                            fieldName
                                        )}

                                    </label>


                                    <input
                                        type={
                                            isNumericField(
                                                fieldName
                                            )
                                                ? "number"
                                                : "text"
                                        }
                                        min={
                                            isNumericField(
                                                fieldName
                                            )
                                                ? 0
                                                : undefined
                                        }
                                        placeholder={`${t("editTask.enter")} ${humanizeFieldName(
                                            fieldName
                                        ).toLowerCase()}`}

                                        value={
                                            fieldValues[
                                            fieldName
                                            ] || ""
                                        }
                                        onChange={(e) =>
                                            updateFieldValue(
                                                fieldName,
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white outline-none focus:border-violet-400 transition-colors text-sm text-ink"
                                    />

                                </div>

                            )
                        )}

                    </div>

                )}


                {/* ==================================
                    DUE DATE
                ================================== */}

                <div>

                   <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">
    {t("editTask.dueDate")}
</label>



                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) =>
                            setDueDate(
                                e.target.value
                            )
                        }
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 outline-none focus:border-violet-400 transition-colors text-sm text-ink"
                    />

                </div>


                {/* ==================================
                    BUTTONS
                ================================== */}

                <div className="flex gap-3 pt-2">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/tasks/${id}`
                            )
                        }
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors"
                    >

                       {t("editTask.cancel")}

                    </button>


                    <button
                        type="submit"
                        disabled={
                            loading ||
                            loadingTask
                        }
                        className="flex-1 px-4 py-3 rounded-xl bg-accent text-white text-sm font-bold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    >

                        {loading
    ? t("editTask.saving")
    : t("editTask.saveChanges")}

                    </button>

                </div>

            </form>

        </div>
    );
}

export default EditTask;
