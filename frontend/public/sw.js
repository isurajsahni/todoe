self.addEventListener("push", (event) => {
  const data = event.data ? event.data.json() : { title: "Task Reminder", body: "You have a pending task." };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: "/next.svg",
      badge: "/next.svg",
    })
  );
});
