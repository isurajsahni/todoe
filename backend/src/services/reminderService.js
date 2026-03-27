const cron = require("node-cron");
const webpush = require("web-push");
const nodemailer = require("nodemailer");
const Task = require("../models/Task");
const User = require("../models/User");

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
});

if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:admin@example.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
  );
}

const sendTaskReminder = async (task, user) => {
  const title = `Reminder: ${task.title}`;
  const message = `Task is due at ${new Date(task.dueDate).toLocaleString()}`;

  if (process.env.EMAIL_USER && process.env.EMAIL_PASS && !task.emailReminderSent) {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: title,
      text: `${message}\nPriority: ${task.priority}`,
    });
    task.emailReminderSent = true;
    await task.save();
  }

  if (user.pushSubscriptions?.length && process.env.VAPID_PUBLIC_KEY) {
    await Promise.allSettled(
      user.pushSubscriptions.map((sub) =>
        webpush.sendNotification(sub, JSON.stringify({ title, body: message }))
      )
    );
  }
};

const startReminderCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    const now = new Date();
    const horizon = new Date(now.getTime() + 60 * 1000);

    const tasks = await Task.find({
      status: { $ne: "completed" },
      reminderTime: { $lte: horizon, $gte: new Date(now.getTime() - 60 * 1000) },
    });

    for (const task of tasks) {
      const user = await User.findById(task.createdBy);
      if (user) await sendTaskReminder(task, user);
    }
  });
};

module.exports = { startReminderCron };
