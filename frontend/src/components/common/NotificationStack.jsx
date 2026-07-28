import { useEffect } from "react";

const NOTIFICATION_TIMEOUT = 4000;

function NotificationStack({ notifications, onClose }) {
    useEffect(() => {
        if (!notifications.length) {
            return undefined;
        }

        const timers = notifications.map((notification) =>
            window.setTimeout(() => onClose(notification.id), NOTIFICATION_TIMEOUT)
        );

        return () => {
            timers.forEach((timer) => window.clearTimeout(timer));
        };
    }, [notifications, onClose]);

    if (!notifications.length) {
        return null;
    }

    return (
        <div className="notification-stack" aria-live="polite">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className={`notification-card notification-${notification.type || "info"}`}
                >
                    <div>
                        <strong>{notification.title}</strong>
                        {notification.message ? <p>{notification.message}</p> : null}
                    </div>
                    <button
                        type="button"
                        className="notification-close"
                        onClick={() => onClose(notification.id)}
                        aria-label="Dismiss notification"
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    );
}

export default NotificationStack;
