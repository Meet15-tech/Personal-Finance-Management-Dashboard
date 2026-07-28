import { createContext, useCallback, useContext, useMemo, useState } from "react";
import NotificationStack from "../components/common/NotificationStack";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((notification) => {
        const id =
            typeof crypto !== "undefined" && crypto.randomUUID
                ? crypto.randomUUID()
                : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

        setNotifications((previousNotifications) => [
            ...previousNotifications,
            { id, ...notification },
        ]);
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications((previousNotifications) =>
            previousNotifications.filter((notification) => notification.id !== id)
        );
    }, []);

    const value = useMemo(
        () => ({ addNotification, removeNotification }),
        [addNotification, removeNotification]
    );

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <NotificationStack
                notifications={notifications}
                onClose={removeNotification}
            />
        </NotificationContext.Provider>
    );
}

export function useNotifications() {
    const context = useContext(NotificationContext);

    if (!context) {
        throw new Error("useNotifications must be used within a NotificationProvider");
    }

    return context;
}
