const express = require("express");
const User = require("../models/User");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth);

router.post("/subscribe", async (req, res) => {
  const user = await User.findById(req.userId);
  user.pushSubscriptions = user.pushSubscriptions || [];
  user.pushSubscriptions.push(req.body.subscription);
  await user.save();
  res.json({ message: "Subscribed for push notifications" });
});

router.get("/pending-before-logout", async (req, res) => {
  const user = await User.findById(req.userId);
  const now = new Date();
  const today = now.toISOString().split("T")[0];
  const [hours, minutes] = (user.logoutTime || "18:00").split(":").map(Number);
  const logoutDate = new Date(`${today}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00`);

  const thirtyMinBefore = new Date(logoutDate.getTime() - 30 * 60 * 1000);
  if (now < thirtyMinBefore) return res.json({ shouldNotify: false, tasks: [] });

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  const tasks = await Task.find({
    createdBy: req.userId,
    dueDate: { $gte: start, $lte: end },
    status: { $ne: "completed" },
  }).select("title status dueDate");
  res.json({ shouldNotify: tasks.length > 0, tasks });
});

module.exports = router;
