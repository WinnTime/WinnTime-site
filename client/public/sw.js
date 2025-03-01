self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : { title: "Default", body: "No message" };
  
  console.log("Push event received:", data); // ✅ Log received push event

  self.registration.showNotification(data.title, {
    body: data.body,
    icon: "/logo192.png",
  });
});