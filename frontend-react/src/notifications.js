import React from "react";
import * as R from "ramda";
import { toast } from "react-toastify";

//   NOTIFICATION
const defaultNotificationConfig = {
  position: "bottom-right",
  autoClose: 4000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  newestOnTop: false,
};

export function warningNotification(message, config) {
  toast.warning(message, {
    ...R.mergeDeepLeft(config, defaultNotificationConfig),
  });
}

export function successNotification(message, config) {
  toast.success(message, {
    ...R.mergeDeepLeft(config, defaultNotificationConfig),
  });
}

export function infoNotification(message, config) {
  toast.info(message, {
    ...R.mergeDeepLeft(config, defaultNotificationConfig),
  });
}

export function errorNotification(title, message, config) {
  toast.error(
    () => {
      return (
        <div className="notification-layout error">
          <h4>{title}</h4>
          <p>{message}</p>
        </div>
      );
    },
    { ...R.mergeDeepLeft(config, defaultNotificationConfig) }
  );
}

export function networkError() {
  toast.error(
    () => {
      return (
        <div className="notification-layout error">
          <h4>Connection error</h4>
          <p>Check your internet connection or try again later</p>
        </div>
      );
    },
    { ...defaultNotificationConfig }
  );
}

export function dangerNotification(title, message, config) {
  toast.error(
    () => {
      return (
        <div className="notification-layout error">
          <h4>{title}</h4>
          <p>{message}</p>
        </div>
      );
    },
    { ...R.mergeDeepLeft(config, defaultNotificationConfig) }
  );
}
