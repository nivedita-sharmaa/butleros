// import { useEffect, useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";

// const API_URL = "https://hatbox-scanner-subscribe.ngrok-free.dev/api";

// const BUSY_STATUSES = ["Assigned", "Accepted", "In-Progress"];
// const currentUser = JSON.parse(localStorage.getItem("user") || "null");
// const currentUserRole = currentUser?.role;
// function getInitials(name) {
//     return (name || "")
//         .trim()
//         .split(/\s+/)
//         .slice(0, 2)
//         .map((part) => part[0])
//         .join("")
//         .toUpperCase();
// }

// function Users() {
//     const navigate = useNavigate();

//     const [users, setUsers] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState("");
//     const [deletingId, setDeletingId] = useState(null);

//     // Used only to derive Butler availability (Busy/Available) — read-only, no write logic here
//     const [busyButlerIds, setBusyButlerIds] = useState(new Set());

//     const [search, setSearch] = useState("");

//     useEffect(() => {
//         loadUsers();
//         loadButlerAvailability();
//     }, []);

//     const loadUsers = async () => {
//         try {
//             setLoading(true);
//             setError("");

//             const token = localStorage.getItem("token");

//             const response = await fetch(`${API_URL}/users`, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`
//                 }
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || "Failed to load users");
//             }

//             setUsers(data);
//         }
//         catch (error) {
//             console.log("Users error:", error);
//             setError(error.message);
//         }
//         finally {
//             setLoading(false);
//         }
//     };

//     // Derives which Butlers are currently "Busy" by checking their active tasks.
//     // Non-blocking: if this fails (e.g. role can't list tasks), everyone just shows as Available.
//     const loadButlerAvailability = async () => {
//         try {
//             const token = localStorage.getItem("token");

//             const response = await fetch(`${API_URL}/tasks`, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`
//                 }
//             });

//             const data = await response.json();
//             if (!response.ok) return;

//             const busyIds = new Set(
//                 data
//                     .filter((t) => BUSY_STATUSES.includes(t.status) && t.assigned_to)
//                     .map((t) => t.assigned_to)
//             );

//             setBusyButlerIds(busyIds);
//         } catch (error) {
//             console.log("Availability derive error:", error);
//         }
//     };

//     const deleteUser = async (userId) => {
//         const confirmed = window.confirm(
//             "Are you sure you want to delete this user? This cannot be undone."
//         );

//         if (!confirmed) return;

//         try {
//             setDeletingId(userId);

//             const token = localStorage.getItem("token");

//             const response = await fetch(`${API_URL}/users/${userId}`, {
//                 method: "DELETE",
//                 headers: {
//                     "Content-Type": "application/json",
//                     Authorization: `Bearer ${token}`
//                 }
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || "Failed to delete user");
//             }

//             loadUsers();
//         }
//         catch (error) {
//             console.log("Delete user error:", error);
//             alert(error.message);
//         }
//         finally {
//             setDeletingId(null);
//         }
//     };

//     // Role counts for the summary cards — derived from the users list we already have
//     const roleCounts = useMemo(() => {
//         const counts = { Butler: 0, Employee: 0, Manager: 0, Admin: 0 };
//         users.forEach((u) => {
//             if (counts[u.role] !== undefined) counts[u.role]++;
//         });
//         return counts;
//     }, [users]);

//     const filteredUsers = useMemo(() => {
//         if (!search.trim()) return users;
//         const q = search.toLowerCase();
//         return users.filter(
//             (u) =>
//                 u.name.toLowerCase().includes(q) ||
//                 u.email.toLowerCase().includes(q) ||
//                 (u.role || "").toLowerCase().includes(q)
//         );
//     }, [users, search]);

//     // ==============================================
//     // LOADING
//     // ==============================================

//     if (loading) {
//         return (
//             <div>
//                 <h1>People</h1>
//                 <p>Loading users...</p>
//             </div>
//         );
//     }

//     // ==============================================
//     // ERROR
//     // ==============================================

//     if (error) {
//         return (
//             <div>
//                 <h1>People</h1>
//                 <p className="error-message">{error}</p>
//             </div>
//         );
//     }

//     // ==============================================
//     // PAGE
//     // ==============================================

//     return (
//         <div>
//             <div className="page-header">
//                 <div>
//                     <h1>People</h1>
//                     <p className="page-description">
//                         Manage Admins, Managers, Employees and Butlers.
//                     </p>
//                 </div>

//                 {(currentUserRole === "Admin") && (
//                     <button
//                         className="primary-button"
//                         onClick={() => navigate("/users/create")}
//                     >
//                         + Add User
//                     </button>
//                 )}
//             </div>

//             {/* Role count summary cards */}
//             <div className="people-stats">
//                 <div className="people-stat-card">
//                     <div className="people-stat-label">BUTLERS</div>
//                     <b className="people-stat-value">{roleCounts.Butler}</b>
//                 </div>
//                 <div className="people-stat-card">
//                     <div className="people-stat-label">EMPLOYEES</div>
//                     <b className="people-stat-value">{roleCounts.Employee}</b>
//                 </div>
//                 <div className="people-stat-card">
//                     <div className="people-stat-label">MANAGERS</div>
//                     <b className="people-stat-value">{roleCounts.Manager}</b>
//                 </div>
//                 <div className="people-stat-card">
//                     <div className="people-stat-label">ADMINS</div>
//                     <b className="people-stat-value">{roleCounts.Admin}</b>
//                 </div>
//             </div>

//             {/* Team directory */}
//             <div className="people-directory">
//                 <div className="people-directory-header">
//                     <b>Team directory</b>
//                     <input
//                         className="people-search"
//                         placeholder="Search people"
//                         value={search}
//                         onChange={(e) => setSearch(e.target.value)}
//                     />
//                 </div>

//                 {filteredUsers.length === 0 ? (
//                     <div className="empty-state">
//                         <h3>No users found</h3>
//                         <p>
//                             {users.length === 0
//                                 ? "There are currently no users in the system."
//                                 : "No users match your search."}
//                         </p>
//                     </div>
//                 ) : (
//                     <div className="people-list">
//                         {filteredUsers
//                             .filter(
//                                 (user) =>
//                                     String(user.role || "").trim().toLowerCase() !== "admin"
//                             )
//                             .map((user) => {
//                                 const isButler = user.role === "Butler";
//                                 const isBusy = isButler && busyButlerIds.has(user.id);
//                                 const availabilityLabel = isButler
//                                     ? (isBusy ? "Busy" : "Available")
//                                     : "Active";
//                                 const availabilityClass = isButler
//                                     ? (isBusy ? "availability-busy" : "availability-available")
//                                     : "availability-active";

//                                 return (
//                                     <div key={user.id} className="people-row">
//                                         <div className="people-row-main">
//                                             <div className={`people-avatar role-avatar-${(user.role || "").toLowerCase()}`}>
//                                                 {getInitials(user.name)}
//                                             </div>
//                                             <div>
//                                                 <b>{user.name}</b>
//                                                 <p className="people-row-sub">{user.role}</p>
//                                             </div>
//                                         </div>

//                                         <div className="people-row-actions">
//                                             <span className={`availability-badge ${availabilityClass}`}>
//                                                 {availabilityLabel}
//                                             </span>

//                                             <button
//                                                 className="secondary-button"
//                                                 onClick={() => navigate(`/users/${user.id}/edit`)}
//                                             >
//                                                 Edit
//                                             </button>
//                                             {(currentUserRole === "Admin") && (
//                                                 <button
//                                                     className="secondary-button danger-button"
//                                                     onClick={() => deleteUser(user.id)}
//                                                     disabled={deletingId === user.id}
//                                                 >
//                                                     {deletingId === user.id ? "Deleting..." : "Delete"}
//                                                 </button>
//                                             )}
//                                         </div>
//                                     </div>
//                                 );
//                             })}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// export default Users;

import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
    Trash2,
    Loader2,
} from "lucide-react";

const API_URL = "https://hatbox-scanner-subscribe.ngrok-free.dev/api";

const BUSY_STATUSES = ["Assigned", "Accepted", "In-Progress"];
const currentUser = JSON.parse(localStorage.getItem("user") || "null");
const currentUserRole = currentUser?.role;
function getInitials(name) {
    return (name || "")
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0])
        .join("")
        .toUpperCase();
}

function DeleteConfirmModal({
    user,
    isDeleting,
    errorMessage,
    onConfirm,
    onCancel,
    t,
}) {
    return (
        <div
            className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm flex items-center justify-center px-4"
            onClick={onCancel}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white rounded-3xl shadow-2xl p-7 max-w-sm w-full"
            >
                {/* ICON */}
                <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 grid place-items-center mb-4">
                    <Trash2 className="w-6 h-6 stroke-[2.2]" />
                </div>

                {/* TITLE */}
                <h2 className="text-lg font-black text-ink mb-2">
                    {t("people.deleteConfirmTitle")}
                </h2>

                {/* MESSAGE */}
                <p className="text-sm text-slate-500 mb-4">
                    {t("people.deleteConfirmMessage", {
                        name: user?.name || "",
                    })}
                </p>

                {/* ERROR */}
                {errorMessage && (
                    <div className="bg-red-50 border border-red-100 text-red-600 text-sm font-medium rounded-xl px-4 py-3 mb-4">
                        {errorMessage}
                    </div>
                )}

                {/* ACTIONS */}
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        disabled={isDeleting}
                        className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-white text-slate-700 font-bold text-sm hover:bg-slate-50 transition disabled:opacity-50"
                    >
                        {t("common.cancel")}
                    </button>

                    <button
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition disabled:opacity-60"
                    >
                        {isDeleting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                {t("people.deleting")}
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4" />
                                {t("people.delete")}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}


function Users() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deletingId, setDeletingId] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [deleteError, setDeleteError] = useState("");


    // Used only to derive Butler availability (Busy/Available) — read-only, no write logic here
    const [busyButlerIds, setBusyButlerIds] = useState(new Set());

    const [search, setSearch] = useState("");

    useEffect(() => {
        loadUsers();
        loadButlerAvailability();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/users`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to load users");
            }

            setUsers(data);
        }
        catch (error) {
            console.log("Users error:", error);
            setError(error.message);
        }
        finally {
            setLoading(false);
        }
    };

    // Derives which Butlers are currently "Busy" by checking their active tasks.
    // Non-blocking: if this fails (e.g. role can't list tasks), everyone just shows as Available.
    const loadButlerAvailability = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(`${API_URL}/tasks`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await response.json();
            if (!response.ok) return;

            const busyIds = new Set(
                data
                    .filter((t) => BUSY_STATUSES.includes(t.status) && t.assigned_to)
                    .map((t) => t.assigned_to)
            );

            setBusyButlerIds(busyIds);
        } catch (error) {
            console.log("Availability derive error:", error);
        }
    };

    const requestDeleteUser = (user) => {
        setUserToDelete(user);
        setDeleteError("");
    };
    const confirmDeleteUser = async () => {
        if (!userToDelete) return;

        try {
            setDeletingId(userToDelete.id);
            setDeleteError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/users/${userToDelete.id}`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || t("people.deleteError")
                );
            }

            // Remove immediately from the current list
            setUsers((prev) =>
                prev.filter((user) => user.id !== userToDelete.id)
            );

            // Close modal
            setUserToDelete(null);
            setDeleteError("");

        } catch (error) {
            console.error("Delete user error:", error);

            setDeleteError(
                error.message || t("people.deleteError")
            );
        } finally {
            setDeletingId(null);
        }
    };
    const cancelDeleteUser = () => {
        setUserToDelete(null);
        setDeleteError("");
    };


    // Role counts for the summary cards — derived from the users list we already have
    const roleCounts = useMemo(() => {
        const counts = { Butler: 0, Employee: 0, Manager: 0, Admin: 0 };
        users.forEach((u) => {
            if (counts[u.role] !== undefined) counts[u.role]++;
        });
        return counts;
    }, [users]);

    const filteredUsers = useMemo(() => {
        if (!search.trim()) return users;
        const q = search.toLowerCase();
        return users.filter(
            (u) =>
                u.name.toLowerCase().includes(q) ||
                u.email.toLowerCase().includes(q) ||
                (u.role || "").toLowerCase().includes(q)
        );
    }, [users, search]);

    // ==============================================
    // LOADING
    // ==============================================

    if (loading) {
        return (
            <div>
                <h1>{t("people.title")}</h1>
                <p>{t("people.loading")}</p>
            </div>
        );
    }

    // ==============================================
    // ERROR
    // ==============================================

    if (error) {
        return (
            <div>
                <h1>{t("people.title")}</h1>
                <p className="error-message">{error}</p>
            </div>
        );
    }

    // ==============================================
    // PAGE
    // ==============================================

    return (
        <div>
            <div className="page-header">
                <div>
                    <h1>{t("people.title")}</h1>
                    <p className="page-description">
                        {t("people.description")}
                    </p>
                </div>

                {(currentUserRole === "Admin") && (
                    <button
                        className="primary-button"
                        onClick={() => navigate("/users/create")}
                    >
                        {t("people.addUser")}
                    </button>
                )}
            </div>

            {/* Role count summary cards */}
            <div className="people-stats">
                <div className="people-stat-card">
                    <div className="people-stat-label">{t("people.stats.butlers")}</div>
                    <b className="people-stat-value">{roleCounts.Butler}</b>
                </div>
                <div className="people-stat-card">
                    <div className="people-stat-label">{t("people.stats.employees")}</div>
                    <b className="people-stat-value">{roleCounts.Employee}</b>
                </div>
                <div className="people-stat-card">
                    <div className="people-stat-label">{t("people.stats.managers")}</div>
                    <b className="people-stat-value">{roleCounts.Manager}</b>
                </div>
                <div className="people-stat-card">
                    <div className="people-stat-label">{t("people.stats.admins")}</div>
                    <b className="people-stat-value">{roleCounts.Admin}</b>
                </div>
            </div>

            {/* Team directory */}
            <div className="people-directory">
                <div className="people-directory-header">
                    <b>{t("people.directoryTitle")}</b>
                    <input
                        className="people-search"
                        placeholder={t("people.searchPlaceholder")}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {filteredUsers.length === 0 ? (
                    <div className="empty-state">
                        <h3>{t("people.emptyTitle")}</h3>
                        <p>
                            {users.length === 0
                                ? t("people.emptyNoUsers")
                                : t("people.emptyNoMatch")}
                        </p>
                    </div>
                ) : (
                    <div className="people-list">
                        {filteredUsers
                            .filter(
                                (user) =>
                                    String(user.role || "").trim().toLowerCase() !== "admin"
                            )
                            .map((user) => {
                                const isButler = user.role === "Butler";
                                const isBusy = isButler && busyButlerIds.has(user.id);
                                const availabilityLabel = isButler
                                    ? (isBusy ? t("people.availability.busy") : t("people.availability.available"))
                                    : t("people.availability.active");
                                const availabilityClass = isButler
                                    ? (isBusy ? "availability-busy" : "availability-available")
                                    : "availability-active";

                                // Translated role label — falls back to the raw
                                // role string if it's not one of the four known
                                // roles (shouldn't normally happen).
                                const roleLabel = t(`people.roles.${user.role}`, user.role);

                                return (
                                    <div key={user.id} className="people-row">
                                        <div className="people-row-main">
                                            <div className={`people-avatar role-avatar-${(user.role || "").toLowerCase()}`}>
                                                {getInitials(user.name)}
                                            </div>
                                            <div>
                                                {/* user.name is DB content — not translated */}
                                                <b>{user.name}</b>
                                                <p className="people-row-sub">{roleLabel}</p>
                                            </div>
                                        </div>

                                        <div className="people-row-actions">
                                            <span className={`availability-badge ${availabilityClass}`}>
                                                {availabilityLabel}
                                            </span>

                                            <button
                                                className="secondary-button"
                                                onClick={() => navigate(`/users/${user.id}/edit`)}
                                            >
                                                {t("people.edit")}
                                            </button>
                                            {(currentUserRole === "Admin") && (
                                                <button
                                                    className="secondary-button danger-button"
                                                    onClick={() => requestDeleteUser(user)}
                                                    disabled={deletingId === user.id}
                                                >
                                                    {/* <Trash2 className="w-4 h-4" /> */}

                                                    {t("people.delete")}
                                                </button>

                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                )}
            </div>
            {userToDelete && (
    <DeleteConfirmModal
        user={userToDelete}
        isDeleting={deletingId === userToDelete.id}
        errorMessage={deleteError}
        onConfirm={confirmDeleteUser}
        onCancel={cancelDeleteUser}
        t={t}
    />
)}

        </div>
    );
}

export default Users;