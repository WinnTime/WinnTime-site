import { useEffect, useState } from "react";

const SubscribeToPush = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    restoreSubscription();
    checkSubscription();
  }, []);

  const getStoredSubscription = () => {
    const storedSubscription = localStorage.getItem("pushSubscription");
    return storedSubscription ? JSON.parse(storedSubscription) : null;
  };

  const restoreSubscription = async () => {
    const storedSubscription = getStoredSubscription();
    if (storedSubscription) {
      try {
        const response = await fetch("http://localhost:5000/subscribe", {
          method: "POST",
          body: JSON.stringify(storedSubscription),
          headers: { "Content-Type": "application/json" },
        });

        if (response.ok) {
          setIsSubscribed(true);
        } else {
          subscribeToPush();
        }
      } catch (error) {
        console.error("Error restoring subscription:", error);
      }
    }
  };

  const checkSubscription = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      return;
    }
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    setIsSubscribed(!!subscription);
  };

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

      const registration = await navigator.serviceWorker.register("/sw.js");
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

  const unsubscribeFromPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        await fetch("http://localhost:5000/unsubscribe", {
          method: "POST",
          body: JSON.stringify(subscription),
          headers: { "Content-Type": "application/json" },
        });

        localStorage.removeItem("pushSubscription");
        setIsSubscribed(false);
        alert("Unsubscribed from push notifications.");
      }
    } catch (error) {
      console.error("Error unsubscribing from push notifications:", error);
    }
  };

  const handleSubscriptionToggle = () => {
    if (isSubscribed) {
      unsubscribeFromPush();
    } else {
      subscribeToPush();
    }
  };

  const urlBase64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
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
      <button onClick={handleSubscriptionToggle}>
        {isSubscribed
          ? "Unsubscribe from Notifications"
          : "Enable Push Notifications"}
      </button>
    </div>
  );
};

export default SubscribeToPush;
