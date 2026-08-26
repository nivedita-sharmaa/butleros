// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const API_URL = "https://hatbox-scanner-subscribe.ngrok-free.dev/api";

// function AddUser() {
//     const navigate = useNavigate();

//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [roleId, setRoleId] = useState("");

//     const [roles, setRoles] = useState([]);
//     const [loadingRoles, setLoadingRoles] = useState(true);

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");

//     useEffect(() => {
//         loadRoles();
//     }, []);

//     const loadRoles = async () => {
//         try {
//             const token = localStorage.getItem("token");

//             const response = await fetch(`${API_URL}/roles`, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`
//                 }
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || "Failed to load roles");
//             }

//             setRoles(data);
//         }
//         catch (error) {
//             console.log("Roles error:", error);
//             setError(error.message);
//         }
//         finally {
//             setLoadingRoles(false);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         setError("");
//         setSuccess("");
//         setLoading(true);

//         try {
//             const token = localStorage.getItem("token");

//             const response = await fetch(`${API_URL}/users`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`
//                 },
//                 body: JSON.stringify({
//                     name: name,
//                     email: email,
//                     password: password,
//                     role_id: Number(roleId)
//                 })
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || "Failed to create user");
//             }

//             console.log("User created:", data);
//             setSuccess("User created successfully!");

//             setTimeout(() => {
//                 navigate("/users");
//             }, 1000);
//         }
//         catch (error) {
//             console.log("Create user error:", error);
//             setError(error.message);
//         }
//         finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div>
//             <h1>Add User</h1>
//             <p className="page-description">
//                 Create an Admin, Manager, Employee or Butler account.
//             </p>

//             {error && <div className="error-message">{error}</div>}
//             {success && <div className="success-message">{success}</div>}

//             <form className="task-form" onSubmit={handleSubmit}>
//                 <div className="form-group">
//                     <label>Full Name *</label>
//                     <input
//                         type="text"
//                         placeholder="Enter full name"
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         required
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label>Email *</label>
//                     <input
//                         type="email"
//                         placeholder="Enter email address"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label>Password *</label>
//                     <input
//                         type="password"
//                         placeholder="Set a temporary password"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label>Role *</label>

//                     {loadingRoles ? (
//                         <p>Loading roles...</p>
//                     ) : (
//                         <select
//                             value={roleId}
//                             onChange={(e) => setRoleId(e.target.value)}
//                             required
//                         >
//                             <option value="">Select a role</option>
//                             {roles.map((role) => (
//                                 <option key={role.id} value={role.id}>
//                                     {role.name}
//                                 </option>
//                             ))}
//                         </select>
//                     )}
//                 </div>

//                 <div className="form-buttons">
//                     <button
//                         type="button"
//                         className="secondary-button"
//                         onClick={() => navigate("/users")}
//                     >
//                         Cancel
//                     </button>

//                     <button
//                         type="submit"
//                         className="primary-button"
//                         disabled={loading || loadingRoles}
//                     >
//                         {loading ? "Creating..." : "Create User"}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }

// export default AddUser;

// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useTranslation } from "react-i18next";

// const API_URL = "https://hatbox-scanner-subscribe.ngrok-free.dev/api";

// function AddUser() {
//     const navigate = useNavigate();
//     const { t } = useTranslation();

//     const [name, setName] = useState("");
//     const [email, setEmail] = useState("");
//     const [password, setPassword] = useState("");
//     const [roleId, setRoleId] = useState("");

//     const [roles, setRoles] = useState([]);
//     const [loadingRoles, setLoadingRoles] = useState(true);

//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");

//     useEffect(() => {
//         loadRoles();
//     }, []);

//     const loadRoles = async () => {
//         try {
//             const token = localStorage.getItem("token");

//             const response = await fetch(`${API_URL}/roles`, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`
//                 }
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || t("addUser.loadRolesFailed"));
//             }

//             setRoles(data);
//         }
//         catch (error) {
//             console.log("Roles error:", error);
//             setError(error.message);
//         }
//         finally {
//             setLoadingRoles(false);
//         }
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         setError("");
//         setSuccess("");
//         setLoading(true);

//         try {
//             const token = localStorage.getItem("token");

//             const response = await fetch(`${API_URL}/users`, {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`
//                 },
//                 body: JSON.stringify({
//                     name: name,
//                     email: email,
//                     password: password,
//                     role_id: Number(roleId)
//                 })
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || t("addUser.createUserFailed"));
//             }

//             console.log("User created:", data);
//             setSuccess(t("addUser.createdSuccess"));

//             setTimeout(() => {
//                 navigate("/users");
//             }, 1000);
//         }
//         catch (error) {
//             console.log("Create user error:", error);
//             setError(error.message);
//         }
//         finally {
//             setLoading(false);
//         }
//     };

//     return (
//         <div>
//             <h1>{t("addUser.pageTitle")}</h1>
//             <p className="page-description">
//                 {t("addUser.pageDescription")}
//             </p>

//             {error && <div className="error-message">{error}</div>}
//             {success && <div className="success-message">{success}</div>}

//             <form className="task-form" onSubmit={handleSubmit}>
//                 <div className="form-group">
//                     <label>{t("addUser.fullName")}</label>
//                     <input
//                         type="text"
//                         placeholder={t("addUser.fullNamePlaceholder")}
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                         required
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label>{t("addUser.email")}</label>
//                     <input
//                         type="email"
//                         placeholder={t("addUser.emailPlaceholder")}
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label>{t("addUser.password")}</label>
//                     <input
//                         type="password"
//                         placeholder={t("addUser.passwordPlaceholder")}
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                     />
//                 </div>

//                 <div className="form-group">
//                     <label>{t("addUser.role")}</label>

//                     {loadingRoles ? (
//                         <p>{t("addUser.loadingRoles")}</p>
//                     ) : (
//                         <select
//                             value={roleId}
//                             onChange={(e) => setRoleId(e.target.value)}
//                             required
//                         >
//                             <option value="">{t("addUser.selectRole")}</option>
//                             {roles.map((role) => (
//                                 <option key={role.id} value={role.id}>
//                                     {t(`people.roles.${role.name}`, role.name)}
//                                 </option>
//                             ))}
//                         </select>
//                     )}
//                 </div>

//                 <div className="form-buttons">
//                     <button
//                         type="button"
//                         className="secondary-button"
//                         onClick={() => navigate("/users")}
//                     >
//                         {t("addUser.cancel")}
//                     </button>

//                     <button
//                         type="submit"
//                         className="primary-button"
//                         disabled={loading || loadingRoles}
//                     >
//                         {loading ? t("addUser.creating") : t("addUser.createUser")}
//                     </button>
//                 </div>
//             </form>
//         </div>
//     );
// }

// export default AddUser;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

const API_URL = "https://hatbox-scanner-subscribe.ngrok-free.dev/api";

// ==========================================
// TOAST POPUP
// Same visual pattern as NotificationPopup.jsx
// (top-right, slide-in, auto-dismiss + close button)
// ==========================================
function Toast({ type = "error", message, onClose }) {
    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            onClose();
        }, 4000);

        return () => clearTimeout(timer);
    }, [message]);

    if (!message) return null;

    const isError = type === "error";

    return (
        <div className="fixed top-6 right-6 z-[9999] w-96">
            <style>{`
                @keyframes toastIn {
                    from { opacity: 0; transform: translateY(-12px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .toast-in {
                    animation: toastIn 0.35s cubic-bezier(.16,1,.3,1) both;
                }
            `}</style>

            <div
                className={`toast-in rounded-2xl shadow-2xl border p-5 ${
                    isError
                        ? "bg-white border-red-100"
                        : "bg-white border-emerald-100"
                }`}
            >
                <div className="flex items-start gap-4">
                    <span
                        className={`w-11 h-11 rounded-xl grid place-items-center shrink-0 ${
                            isError
                                ? "bg-red-100 text-red-600"
                                : "bg-emerald-100 text-emerald-600"
                        }`}
                    >
                        {isError ? (
                            <AlertCircle className="w-5 h-5" />
                        ) : (
                            <CheckCircle2 className="w-5 h-5" />
                        )}
                    </span>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-ink">
                            {isError ? "Error" : "Success"}
                        </h3>
                        <p className="text-slate-500 text-sm mt-1">
                            {message}
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close"
                        className="text-slate-400 hover:text-slate-700 transition-colors shrink-0"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function AddUser() {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [roleId, setRoleId] = useState("");

    const [roles, setRoles] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(true);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/roles`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || t("addUser.loadRolesFailed"));
            }

            setRoles(data);
        }
        catch (error) {
            console.log("Roles error:", error);
            setError(error.message);
        }
        finally {
            setLoadingRoles(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // ==========================================
        // CLIENT-SIDE VALIDATION
        // ==========================================

        const trimmedName = name.trim();
        const trimmedEmail = email.trim();

        if (!trimmedName) {
            setError(t("addUser.validation.nameRequired", "Full name is required"));
            return;
        }

        if (trimmedName.length < 2) {
            setError(t("addUser.validation.nameTooShort", "Full name must be at least 2 characters"));
            return;
        }

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(trimmedEmail)) {
            setError(t("addUser.validation.emailInvalid", "Please enter a valid email address"));
            return;
        }

        if (password.length < 6) {
            setError(t("addUser.validation.passwordTooShort", "Password must be at least 6 characters"));
            return;
        }

        if (!roleId) {
            setError(t("addUser.validation.roleRequired", "Please select a role"));
            return;
        }

        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/users`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: trimmedName,
                    email: trimmedEmail,
                    password: password,
                    role_id: Number(roleId)
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || t("addUser.createUserFailed"));
            }

            console.log("User created:", data);
            setSuccess(t("addUser.createdSuccess"));

            setTimeout(() => {
                navigate("/users");
            }, 1000);
        }
        catch (error) {
            console.log("Create user error:", error);
            setError(error.message);
        }
        finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>{t("addUser.pageTitle")}</h1>
            <p className="page-description">
                {t("addUser.pageDescription")}
            </p>

            <Toast type="error" message={error} onClose={() => setError("")} />
            <Toast type="success" message={success} onClose={() => setSuccess("")} />

            <form className="task-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>{t("addUser.fullName")}</label>
                    <input
                        type="text"
                        placeholder={t("addUser.fullNamePlaceholder")}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>{t("addUser.email")}</label>
                    <input
                        type="email"
                        placeholder={t("addUser.emailPlaceholder")}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>{t("addUser.password")}</label>
                    <input
                        type="password"
                        placeholder={t("addUser.passwordPlaceholder")}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>{t("addUser.role")}</label>

                    {loadingRoles ? (
                        <p>{t("addUser.loadingRoles")}</p>
                    ) : (
                        <select
                            value={roleId}
                            onChange={(e) => setRoleId(e.target.value)}
                            required
                        >
                            <option value="">{t("addUser.selectRole")}</option>
                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {t(`people.roles.${role.name}`, role.name)}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="form-buttons">
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={() => navigate("/users")}
                    >
                        {t("addUser.cancel")}
                    </button>

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={loading || loadingRoles}
                    >
                        {loading ? t("addUser.creating") : t("addUser.createUser")}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default AddUser;