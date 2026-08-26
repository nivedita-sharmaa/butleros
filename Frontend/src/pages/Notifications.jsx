import { useEffect, useState } from "react";
import socket from "../socket";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTranslatedText } from "../hooks/useTranslatedText";
import {
    BellRing,
    UserPlus,
    CircleCheck,
    MessageSquare,
    Bell,
    Clock,
} from "lucide-react";

import {
    getPrefs,
    savePrefs,
    requestBrowserPermission,
    playAlertTone,
} from "../services/notificationPrefs";


const API_URL =
    "https://hatbox-scanner-subscribe.ngrok-free.dev/api";


// ==========================================
// NOTIFICATION VISUAL
// ==========================================

function getNotificationVisual(notification) {

    const text =
        `${notification.title || ""} ${notification.message || ""}`
            .toLowerCase();


    if (text.includes("assign")) {

        return {
            icon: UserPlus,
            bg: "bg-violet-100",
            fg: "text-violet-600",
            dot: "bg-violet-400",
        };
    }


    if (text.includes("complet")) {

        return {
            icon: CircleCheck,
            bg: "bg-emerald-100",
            fg: "text-emerald-600",
            dot: "bg-emerald-400",
        };
    }


    if (
        text.includes("repl") ||
        text.includes("comment")
    ) {

        return {
            icon: MessageSquare,
            bg: "bg-blue-100",
            fg: "text-blue-600",
            dot: "bg-blue-400",
        };
    }


    return {
        icon: BellRing,
        bg: "bg-orange-100",
        fg: "text-orange-600",
        dot: "bg-orange-400",
    };
}

function NotificationItem({ notification, onClick }) {

    const visual = getNotificationVisual(notification);
    const Icon = visual.icon;
    const isUnread = Number(notification.is_read) === 0;

    const translatedTitle = useTranslatedText(notification.title);
    const translatedMessage = useTranslatedText(notification.message);
    const translatedTaskTitle = useTranslatedText(notification.task_title);

    return (

        <div
            onClick={() => onClick(notification)}
            className={`
                p-5
                flex
                gap-4
                cursor-pointer
                transition-colors
                hover:bg-slate-50
                ${
                    isUnread
                        ? "bg-violet-50/40"
                        : ""
                }
            `}
        >

            <span
                className={`
                    w-10
                    h-10
                    rounded-xl
                    ${visual.bg}
                    ${visual.fg}
                    grid
                    place-items-center
                    shrink-0
                `}
            >
                <Icon className="w-4 h-4" />
            </span>


            <div
                className="
                    flex-1
                    min-w-0
                "
            >

                <b className="text-ink">
                    {translatedTitle}
                </b>


                <p
                    className="
                        text-sm
                        text-slate-500
                        mt-1
                    "
                >
                    {translatedMessage}
                </p>


                {notification.task_title && (

                    <p
                        className="
                            text-violet-600
                            font-semibold
                            text-sm
                            mt-2
                            flex
                            items-center
                            gap-1.5
                        "
                    >

                        <BellRing
                            className="w-3.5 h-3.5"
                        />

                        {translatedTaskTitle}

                    </p>

                )}


                <span
                    className="
                        text-xs
                        text-slate-400
                        mt-2
                        flex
                        items-center
                        gap-1.5
                    "
                >

                    <Clock className="w-3 h-3" />

                    {
                        notification.created_at
                            ? new Date(
                                notification.created_at
                            ).toLocaleString()
                            : "-"
                    }

                </span>

            </div>


            {isUnread && (

                <span
                    className={`
                        w-2
                        h-2
                        ${visual.dot}
                        rounded-full
                        mt-2
                        shrink-0
                    `}
                />

            )}

        </div>
    );
}

function Notifications() {
    const { t } = useTranslation();
    const [notifications, setNotifications] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const navigate = useNavigate();


    // ==========================================
    // USER
    // ==========================================

    const user =
        JSON.parse(
            localStorage.getItem("user") || "null"
        );

    const userId = user?.id;


    // ==========================================
    // PREFERENCES
    // ==========================================

    const [prefs, setPrefs] =
        useState(() => getPrefs(userId));

    // const [prefsSaved, setPrefsSaved] =
    //     useState(false);


    const togglePref = (key) => {

        setPrefs((prev) => {

            const updated = {
                ...prev,
                [key]: !prev[key],
            };

            // Automatically save preferences for this user
            savePrefs(userId, updated);

            if (
                key === "browserNotifications" &&
                updated.browserNotifications
            ) {
                requestBrowserPermission();
            }

            return updated;
        });
    };

    // const savePrefsClick = () => {

    //     savePrefs(prefs);

    //     setPrefsSaved(true);

    //     setTimeout(() => {
    //         setPrefsSaved(false);
    //     }, 2000);
    // };


    // ==========================================
    // LOAD NOTIFICATIONS
    // ==========================================

    useEffect(() => {

        if (!userId) {

            console.log(
                "No logged-in user"
            );

            setLoading(false);

            return;
        }


        const loadNotifications =
            async () => {

                try {

                    const token =
                        localStorage.getItem(
                            "token"
                        );


                    const response =
                        await fetch(
                            `${API_URL}/notifications`,
                            {
                                method: "GET",

                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,
                                },
                            }
                        );


                    if (!response.ok) {

                        throw new Error(
                            t("notifications.loadFailed")
                        );

                    }


                    const data =
                        await response.json();


                    setNotifications(data);

                } catch (error) {

                    console.error(
                        "Notification loading error:",
                        error
                    );

                } finally {

                    setLoading(false);
                }
            };


        loadNotifications();

    }, [userId]);


    // ==========================================
    // REAL-TIME SOCKET
    // ==========================================

    useEffect(() => {

        if (!userId) {
            return;
        }


        console.log(
            "Notifications page listening for socket notifications."
        );


        const handleNewNotification =
            (notification) => {

                console.log(
                    "REAL-TIME NOTIFICATION RECEIVED:",
                    notification
                );


                setNotifications((prev) => {

                    const exists =
                        prev.some(
                            (item) =>
                                Number(item.id) ===
                                Number(notification.id)
                        );


                    if (exists) {
                        return prev;
                    }


                    return [
                        notification,
                        ...prev,
                    ];
                });
            };


        socket.on(
            "new_notification",
            handleNewNotification
        );


        return () => {

            socket.off(
                "new_notification",
                handleNewNotification
            );
        };

    }, [userId]);


    // ==========================================
    // MARK ONE AS READ
    // ==========================================

    const markAsRead =
        async (notificationId) => {

            try {

                const token =
                    localStorage.getItem(
                        "token"
                    );


                const response =
                    await fetch(
                        `${API_URL}/notifications/${notificationId}/read`,
                        {
                            method: "PUT",

                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        t("notifications.markReadFailed")
                    );

                }


                setNotifications(
                    (prev) =>
                        prev.map(
                            (notification) =>
                                Number(notification.id) ===
                                    Number(notificationId)
                                    ? {
                                        ...notification,
                                        is_read: 1,
                                        read_at:
                                            new Date().toISOString(),
                                    }
                                    : notification
                        )
                );

            } catch (error) {

                console.error(
                    "Mark notification read error:",
                    error
                );
            }
        };


    // ==========================================
    // MARK ALL AS READ
    // ==========================================

    const markAllAsRead =
        async () => {

            try {

                const token =
                    localStorage.getItem(
                        "token"
                    );


                const response =
                    await fetch(
                        `${API_URL}/notifications/read-all`,
                        {
                            method: "PUT",

                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                            },
                        }
                    );


                if (!response.ok) {

                    throw new Error(
                        t("notifications.markAllReadFailed")
                    );

                }


                const readAt =
                    new Date().toISOString();


                setNotifications(
                    (prev) =>
                        prev.map(
                            (notification) => ({
                                ...notification,
                                is_read: 1,
                                read_at:
                                    notification.read_at ||
                                    readAt,
                            })
                        )
                );

            } catch (error) {

                console.error(
                    "Mark all notifications read error:",
                    error
                );
            }
        };


    // ==========================================
    // UNREAD COUNT
    // ==========================================

    const unreadCount =
        notifications.filter(
            (notification) =>
                Number(notification.is_read) === 0
        ).length;


    // ==========================================
    // NOTIFICATION CLICK
    // ==========================================

    const handleNotificationClick =
        async (notification) => {

            try {

                if (
                    Number(notification.is_read) ===
                    0
                ) {

                    await markAsRead(
                        notification.id
                    );
                }


                if (!notification.task_id) {
                    return;
                }


                const role =
                    user?.role;


                if (
                    role === "Butler" &&
                    notification.type ===
                    "TASK_ASSIGNED"
                ) {

                    navigate(
                        `/butler-desk/${notification.task_id}`
                    );

                } else {

                    navigate(
                        `/tasks/${notification.task_id}`
                    );
                }

            } catch (error) {

                console.error(
                    "Notification click error:",
                    error
                );
            }
        };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (
            <div className="animate-pulse">

                <div
                    className="
                        h-10
                        w-56
                        bg-white
                        rounded-lg
                        border
                        border-slate-200
                        mb-6
                    "
                />

                <div
                    className="
                        grid
                        xl:grid-cols-[1fr_350px]
                        gap-6
                    "
                >

                    <div
                        className="
                            bg-white
                            rounded-3xl
                            border
                            border-slate-200
                            h-96
                        "
                    />

                    <div
                        className="
                            bg-white
                            rounded-3xl
                            border
                            border-slate-200
                            h-96
                        "
                    />

                </div>

            </div>
        );
    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <div>

            <div
                className="
                    flex
                    justify-between
                    items-center
                    mb-6
                "
            >

                <div>

                    <h1
                        className="
                            text-3xl
                            font-black
                            text-ink
                        "
                    >
                        {t("notifications.pageTitle")}
                    </h1>

                    <p
                        className="
                            text-slate-400
                            mt-1
                        "
                    >
                        {t("notifications.pageDescription")}
                    </p>

                </div>


                {unreadCount > 0 && (

                    <button
                        onClick={markAllAsRead}
                        className="
                            px-4
                            py-2.5
                            rounded-xl
                            bg-slate-100
                            hover:bg-slate-200
                            font-bold
                            text-sm
                            text-ink
                            transition-colors
                        "
                    >
                        {t("notifications.markAllAsRead")}
                    </button>
                )}

            </div>


            <div
                className="
                    grid
                    xl:grid-cols-[1fr_350px]
                    gap-6
                "
            >

                {/* ==================================
                    INBOX
                ================================== */}

                <div
                    className="
                        bg-white
                        rounded-3xl
                        border
                        border-slate-200
                        overflow-hidden
                        shadow-card
                    "
                >

                    <div
                        className="
                            p-5
                            border-b
                            border-slate-100
                            flex
                            justify-between
                            items-center
                        "
                    >

                        <b className="text-ink">
                            {t("notifications.inbox")}
                        </b>



                        {unreadCount > 0 && (

                            <span
                                className="
                                    px-2.5
                                    py-1
                                    rounded-full
                                    bg-orange-50
                                    text-orange-600
                                    text-xs
                                    font-bold
                                "
                            >
                               {unreadCount} {t("notifications.unread")}
                            </span>
                        )}

                    </div>


                    {notifications.length === 0 ? (

                        <div
                            className="
                                p-16
                                text-center
                            "
                        >

                            <div
                                className="
                                    w-14
                                    h-14
                                    rounded-2xl
                                    bg-violet-50
                                    text-violet-500
                                    grid
                                    place-items-center
                                    mx-auto
                                    mb-4
                                "
                            >
                                <Bell className="w-6 h-6" />
                            </div>


                            <h2
                                className="
                                    text-lg
                                    font-black
                                    text-ink
                                "
                            >
                               {t("notifications.empty.title")}
                            </h2>


                            <p
                                className="
                                    text-slate-400
                                    mt-2
                                    text-sm
                                "
                            >
                                 {t("notifications.empty.description")}
                            </p>

                        </div>

                    ) : (

                      <div className="divide-y divide-slate-100">

    {notifications.map((notification) => (
        <NotificationItem
            key={notification.id}
            notification={notification}
            onClick={handleNotificationClick}
        />
    ))}

</div>
                    )}

                </div>


                {/* ==================================
                    SETTINGS
                ================================== */}

                <div
                    className="
                        bg-white
                        rounded-3xl
                        border
                        border-slate-200
                        p-6
                        shadow-card
                        h-fit
                    "
                >

                    <b
                        className="
                            text-lg
                            text-ink
                        "
                    >
                        {t("notifications.settings.title")}
                    </b>


                    <p
                        className="
                            text-xs
                            text-slate-400
                            mt-1
                        "
                    >
                        {t("notifications.settings.description")}
                    </p>


                    <div
                        className="
                            mt-6
                            space-y-5
                        "
                    >

                        <label
                            className="
                                flex
                                justify-between
                                gap-4
                                items-center
                                cursor-pointer
                            "
                        >

                            <span>

                                <b
                                    className="
                                        text-sm
                                        text-ink
                                        block
                                    "
                                >
                                   {t("notifications.settings.newTaskAlerts.title")}
                                </b>

                                <small
                                    className="
                                        block
                                        text-xs
                                        text-slate-400
                                    "
                                >
                                    {t("notifications.settings.newTaskAlerts.description")}
                                </small>

                            </span>


                            <input
                                type="checkbox"
                                checked={
                                    prefs.newTaskAlerts
                                }
                                onChange={() =>
                                    togglePref(
                                        "newTaskAlerts"
                                    )
                                }
                                className="
                                    w-5
                                    h-5
                                    accent-violet-600
                                "
                            />

                        </label>


                        <label
                            className="
                                flex
                                justify-between
                                gap-4
                                items-center
                                cursor-pointer
                            "
                        >

                            <span>

                                <b
                                    className="
                                        text-sm
                                        text-ink
                                        block
                                    "
                                >
                                    {t("notifications.settings.alertTone.title")}
                                </b>

                                <small
                                    className="
                                        block
                                        text-xs
                                        text-slate-400
                                    "
                                >
                                     {t("notifications.settings.alertTone.description")}
                                </small>

                            </span>


                            <span
                                className="
                                    flex
                                    items-center
                                    gap-2
                                "
                            >

                                <button
                                    type="button"
                                    onClick={(e) => {

                                        e.preventDefault();

                                        playAlertTone();
                                    }}
                                    className="
                                        text-xs
                                        font-bold
                                        text-violet-600
                                        hover:text-violet-700
                                        px-2
                                        py-1
                                        rounded-lg
                                        hover:bg-violet-50
                                        transition-colors
                                    "
                                >
                                    {/* {t("notifications.settings.test")} */}
                                </button>


                                <input
                                    type="checkbox"
                                    checked={
                                        prefs.alertTone
                                    }
                                    onChange={() =>
                                        togglePref(
                                            "alertTone"
                                        )
                                    }
                                    className="
                                        w-5
                                        h-5
                                        accent-violet-600
                                    "
                                />

                            </span>

                        </label>


                        <label
                            className="
                                flex
                                justify-between
                                gap-4
                                items-center
                                cursor-pointer
                            "
                        >

                            {/* <span>

                                <b
                                    className="
                                        text-sm
                                        text-ink
                                        block
                                    "
                                >
                                    Email notifications
                                </b>

                                <small
                                    className="
                                        block
                                        text-xs
                                        text-slate-400
                                    "
                                >
                                    Task assignment & completion
                                </small>

                            </span>


                            <input
                                type="checkbox"
                                checked={
                                    prefs.emailNotifications
                                }
                                onChange={() =>
                                    togglePref(
                                        "emailNotifications"
                                    )
                                }
                                className="
                                    w-5
                                    h-5
                                    accent-violet-600
                                "
                            /> */}

                        </label>


                        <label
                            className="
                                flex
                                justify-between
                                gap-4
                                items-center
                                cursor-pointer
                            "
                        >

                            <span>

                                <b
                                    className="
                                        text-sm
                                        text-ink
                                        block
                                    "
                                >
                                    {t("notifications.settings.browserNotifications.title")}
                                </b>

                                <small
                                    className="
                                        block
                                        text-xs
                                        text-slate-400
                                    "
                                >
                                     {t("notifications.settings.browserNotifications.description")}
                                </small>

                            </span>


                            <input
                                type="checkbox"
                                checked={
                                    prefs.browserNotifications
                                }
                                onChange={() =>
                                    togglePref(
                                        "browserNotifications"
                                    )
                                }
                                className="
                                    w-5
                                    h-5
                                    accent-violet-600
                                "
                            />

                        </label>


                        <label
                            className="
                                flex
                                justify-between
                                gap-4
                                items-center
                                cursor-pointer
                            "
                        >

                            <span>

                                <b
                                    className="
                                        text-sm
                                        text-ink
                                        block
                                    "
                                >
                                      {t("notifications.settings.highPriorityOnly.title")}
                                </b>

                                <small
                                    className="
                                        block
                                        text-xs
                                        text-slate-400
                                    "
                                >
                                    {t("notifications.settings.highPriorityOnly.description")}
                                </small>

                            </span>


                            <input
                                type="checkbox"
                                checked={
                                    prefs.highPriorityOnly
                                }
                                onChange={() =>
                                    togglePref(
                                        "highPriorityOnly"
                                    )
                                }
                                className="
                                    w-5
                                    h-5
                                    accent-violet-600
                                "
                            />

                        </label>

                    </div>


                    {/* <button
                        onClick={savePrefsClick}
                        className="
                            w-full
                            mt-7
                            py-3
                            rounded-xl
                            bg-accent
                            hover:opacity-90
                            text-white
                            font-bold
                            transition-opacity
                        "
                    >
                        {
                            prefsSaved
                                ? "Saved!"
                                : "Save preferences"
                        }
                    </button> */}

                </div>

            </div>

        </div>
    );
}


export default Notifications;