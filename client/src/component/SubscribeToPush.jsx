import { useEffect, useState } from "react";

const SubscribeToPush = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    checkSubscription();
  }, []);

  const checkSubscription = async () => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.log("Push notifications are not supported.");
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
  
      setIsSubscribed(true);
      alert("Subscribed to push notifications!");
    } catch (error) {
      console.error("Error subscribing to push notifications:", error);
    }
  };
  

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
    <div>
      <h2>Push Notifications</h2>
      <button onClick={subscribeToPush} disabled={isSubscribed}>
        {isSubscribed ? "Subscribed" : "Enable Push Notifications"}
      </button>
    </div>
  );
};

export default SubscribeToPush;
