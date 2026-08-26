import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
const API_URL = "https://hatbox-scanner-subscribe.ngrok-free.dev/api";

function EditUser() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    // ==========================================
    // FORM DATA
    // ==========================================

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [roleId, setRoleId] = useState("");

    // ==========================================
    // ROLES
    // ==========================================

    const [roles, setRoles] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(true);

    // Holds the role NAME returned by GET /api/users/:id until the roles
    // list has also loaded, then gets matched to a role ID for the <select>.
    const [loadedRoleName, setLoadedRoleName] = useState("");

    // ==========================================
    // LOAD USER
    // ==========================================

    const [loadingUser, setLoadingUser] = useState(true);
    const [loadError, setLoadError] = useState("");

    // ==========================================
    // SAVE STATES
    // ==========================================

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ==========================================
    // RESET PASSWORD (separate action, separate state)
    // ==========================================

    const [newPassword, setNewPassword] = useState("");
    const [resetting, setResetting] = useState(false);
    const [resetError, setResetError] = useState("");
    const [resetSuccess, setResetSuccess] = useState("");

    useEffect(() => {
        loadRoles();
        loadUser();
    }, [id]);

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
                throw new Error(data.message || t("editUser.loadRolesFailed"));
            }

            setRoles(data);
        }
        catch (error) {
            console.log("Roles error:", error);
        }
        finally {
            setLoadingRoles(false);
        }
    };

    const loadUser = async () => {
        try {
            setLoadingUser(true);
            setLoadError("");

            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/users/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || t("editUser.loadFailed"));
            }

            setName(data.name || "");
            setEmail(data.email || "");
            // data.role is a role NAME (e.g. "Admin"), not an id —
            // matched to a role id once the roles list arrives below.
            setLoadedRoleName(data.role || "");
        }
        catch (error) {
            console.log("Load user error:", error);
            setLoadError(error.message);
        }
        finally {
            setLoadingUser(false);
        }
    };

    useEffect(() => {
        if (loadedRoleName && roles.length > 0) {
            const match = roles.find((r) => r.name === loadedRoleName);
            if (match) setRoleId(String(match.id));
        }
    }, [loadedRoleName, roles]);

    // ==========================================
    // SAVE DETAILS
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");
        setSaving(true);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/users/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    role_id: Number(roleId)
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || t("editUser.updateFailed"));
            }

            console.log("User updated:", data);
            setSuccess(t("editUser.updatedSuccess"));

            setTimeout(() => {
                navigate("/users");
            }, 1000);
        }
        catch (error) {
            console.log("Update user error:", error);
            setError(error.message);
        }
        finally {
            setSaving(false);
        }
    };

    // ==========================================
    // RESET PASSWORD
    // ==========================================

    const resetPassword = async () => {
        if (!newPassword || newPassword.length < 6) {
            setResetError(t("editUser.resetPassword.minimumLength"));
            return;
        }

        setResetError("");
        setResetSuccess("");
        setResetting(true);

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/users/${id}/reset-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    new_password: newPassword
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || t("editUser.resetPassword.failed"));
            }

            console.log("Password reset:", data);
            setResetSuccess(t("editUser.resetPassword.success"));
            setNewPassword("");
        }
        catch (error) {
            console.log("Reset password error:", error);
            setResetError(error.message);
        }
        finally {
            setResetting(false);
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loadingUser) {
        return (
            <div>
                <h1>{t("editUser.pageTitle")}</h1>
                <p>{t("editUser.loading")}</p>
            </div>
        );
    }

    // ==========================================
    // ERROR
    // ==========================================
    if (loadError) {
        return (
            <div>
                <h1>{t("editUser.pageTitle")}</h1>
                <p className="error-message">{loadError}</p>
                <button
                    className="secondary-button"
                    onClick={() => navigate("/users")}
                >
                    {t("editUser.backToUsers")}
                </button>
            </div>
        );
    }


    // ==========================================
    // PAGE
    // ==========================================

    return (
        <div>
            <h1>{t("editUser.pageTitle")}</h1>

            <p className="page-description">
                {t("editUser.pageDescription")}
            </p>


            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}

            <form className="task-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>{t("editUser.fullName")}</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>{t("editUser.email")}</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>{t("editUser.role")}</label>

                    {loadingRoles ? (
                        <p>{t("editUser.loadingRoles")}</p>
                    ) : (
                        <select
                            value={roleId}
                            onChange={(e) => setRoleId(e.target.value)}
                            required
                        >
                            <option value="">
                                {t("editUser.selectRole")}
                            </option>

                            {roles.map((role) => (
                                <option key={role.id} value={role.id}>
                                    {role.name}
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
                        {t("editUser.cancel")}
                    </button>

                    <button
                        type="submit"
                        className="primary-button"
                        disabled={saving || loadingRoles}
                    >
                        {saving
                            ? t("editUser.saving")
                            : t("editUser.saveChanges")}
                    </button>

                </div>
            </form>

            {/* ==========================================
                RESET PASSWORD — separate action, separate
                endpoint (PUT /api/users/:id/reset-password),
                independent of the Save Changes form above.
            ========================================== */}

            <div className="task-details-card">
                <h2>{t("editUser.resetPassword.title")}</h2>

                <p className="page-description">
                    {t("editUser.resetPassword.description")}
                </p>



                <div className="form-group">
                    <label>{t("editUser.resetPassword.newPassword")}</label>
                    <input
                        type="password"
                        placeholder={t("editUser.resetPassword.placeholder")}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        minLength={6}
                    />
                </div>

                {resetError && <div className="error-message">{resetError}</div>}
                {resetSuccess && <div className="success-message">{resetSuccess}</div>}

                <button
                    className="primary-button"
                    onClick={resetPassword}
                    disabled={resetting || !newPassword}
                >
                    {resetting
                        ? t("editUser.resetPassword.resetting")
                        : t("editUser.resetPassword.reset")}
                </button>

            </div>
        </div>
    );
}

export default EditUser;