const express = require("express");
const User = require("../models/User");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

const router = express.Router();
router.use(auth);

router.get("/me", async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json(user);
});

router.put("/schedule", async (req, res) => {
  const { loginTime, logoutTime } = req.body;
  const user = await User.findByIdAndUpdate(req.userId, { loginTime, logoutTime }, { new: true }).select("-password");
  res.json(user);
});

router.get("/summary/today", async (req, res) => {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  const base = { createdBy: req.userId, dueDate: { $gte: start, $lte: end } };
  const [completed, pending, overdue] = await Promise.all([
    Task.countDocuments({ ...base, status: "completed" }),
    Task.countDocuments({ ...base, status: { $ne: "completed" } }),
    Task.countDocuments({ createdBy: req.userId, dueDate: { $lt: now }, status: { $ne: "completed" } }),
  ]);
  res.json({ completed, pending, overdue });
});

module.exports = router;
