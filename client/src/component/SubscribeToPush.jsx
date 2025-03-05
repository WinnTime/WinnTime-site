import { useEffect, useState } from "react";

const SubscribeToPush = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    restoreSubscription(); // Restore subscription when the component mounts
    checkSubscription();
  }, []);

  // 🔹 Retrieve stored subscription from localStorage
  const getStoredSubscription = () => {
    const storedSubscription = localStorage.getItem("pushSubscription");
    return storedSubscription ? JSON.parse(storedSubscription) : null;
  };

  // 🔹 Restore subscription after a page refresh or server restart
  const restoreSubscription = async () => {
    const storedSubscription = getStoredSubscription();
    console.log(storedSubscription);
    if (storedSubscription) {
      try {
        const response = await fetch("http://localhost:5000/subscribe", {
          method: "POST",
          body: JSON.stringify(storedSubscription),
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          console.log("Subscription restored successfully.");
          setIsSubscribed(true);
        } else {
          console.warn("Failed to restore subscription, subscribing again...");
          subscribeToPush(); // Re-subscribe if restoration fails
        }
      } catch (error) {
        console.error("Error restoring subscription:", error);
      }
    }
  };

  // 🔹 Check if the user is already subscribed
  const checkSubscription = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.log("Push notifications are not supported.");
      return;
    }

    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    setIsSubscribed(!!subscription);
  };

  // 🔹 Subscribe to push notifications
  const subscribeToPush = async () => {
    try {
      if (!("serviceWorker" in navigator)) {
        alert("Service workers are not supported in this browser.");
        return;
      }

      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        alert("Push notifications permission denied.");
        return;
      }

      const registration = await navigator.serviceWorker.register("/sw.js"); // Register SW

      const response = await fetch("http://localhost:5000/vapidPublicKey");
      const { publicKey } = await response.json();

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicKey),
      });

      await fetch("http://localhost:5000/subscribe", {
        method: "POST",
        body: JSON.stringify(subscription),
        headers: { "Content-Type": "application/json" },
      });

      localStorage.setItem("pushSubscription", JSON.stringify(subscription));
      setIsSubscribed(true);
      alert("Subscribed to push notifications!");
    } catch (error) {
      console.error("Error subscribing to push notifications:", error);
    }
  };

  // 🔹 Convert VAPID public key from Base64 to Uint8Array
  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/\-/g, "+").replace(/_/g, "/");
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; i++) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };

  return (
    <div className="flex gap-4 flex-col items-start p-3 rounded-xl bg-neutral-700">
      <h2>Push Notifications</h2>
      <button onClick={subscribeToPush} disabled={isSubscribed}>
        {isSubscribed ? "Subscribed" : "Enable Push Notifications"}
      </button>
    </div>
  );
};

export default SubscribeToPush;
