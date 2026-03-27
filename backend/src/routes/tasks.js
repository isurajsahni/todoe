const express = require("express");
const Task = require("../models/Task");
const auth = require("../middleware/auth");

const router = express.Router();

router.use(auth);

router.get("/", async (req, res) => {
  const { status, priority, date, q } = req.query;
  const filter = { createdBy: req.userId };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    filter.dueDate = { $gte: start, $lt: end };
  }
  if (q) filter.title = { $regex: q, $options: "i" };

  const tasks = await Task.find(filter).sort({ status: 1, position: 1, dueDate: 1 });
  res.json(tasks);
});

router.post("/", async (req, res) => {
  const task = await Task.create({ ...req.body, createdBy: req.userId });
  res.status(201).json(task);
});

router.put("/:id", async (req, res) => {
  const task = await Task.findOneAndUpdate({ _id: req.params.id, createdBy: req.userId }, req.body, { new: true });
  if (!task) return res.status(404).json({ message: "Task not found" });
  return res.json(task);
});

router.delete("/:id", async (req, res) => {
  await Task.deleteOne({ _id: req.params.id, createdBy: req.userId });
  res.json({ message: "Task removed" });
});

router.post("/reorder", async (req, res) => {
  const { updates } = req.body;
  await Promise.all(
    updates.map((u) =>
      Task.updateOne({ _id: u.id, createdBy: req.userId }, { $set: { status: u.status, position: u.position } })
    )
  );
  res.json({ message: "Reordered" });
});

module.exports = router;
