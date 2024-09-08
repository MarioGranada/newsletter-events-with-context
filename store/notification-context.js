import { createContext, useEffect, useState } from 'react';

export const initContext = {
  notification: null,
  showNotification: (notificationData) => {},
  hideNotification: (notificationData) => {},
};

const NotificationContext = createContext(initContext);

export const NotificationProvider = ({ children }) => {
  const [activeNotification, setActiveNotification] = useState(initContext);

  useEffect(() => {
    if (activeNotification?.status === 'pending') {
      return;
    }

    const timer = setTimeout(() => {
      setActiveNotification(null);
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [activeNotification]);

  const showNotificationHandler = (notificationData) => {
    setActiveNotification(notificationData);
  };

  const hideNotificationHandler = () => {
    setActiveNotification(null);
  };

  const baseContext = {
    notification: activeNotification,
    showNotification: showNotificationHandler,
    hideNotification: hideNotificationHandler,
  };

  return (
    <NotificationContext.Provider value={{ ...baseContext }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
