/**
 * 
 * Tyler Created this file
 * 
 */

// pushNotification.js
export const pushNotification = (event, title, content) => {
    event.preventDefault();

    if (!("Notification" in window)) {
        alert("This browser does not support desktop notification");
    } else if (Notification.permission === "granted") {
        new Notification(title, {
            body: content,
        });
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(function (permission) {
            if (permission === "granted") {
                new Notification(title, {
                    body: content,
                });
            }
        });
    }
};