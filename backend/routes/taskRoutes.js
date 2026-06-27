const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  toggleTask,
} = require("../controllers/taskController");

router.post("/", protect, createTask);
router.get("/", protect, getTasks);

router.put("/:id", protect, updateTask);      // Edit Task
router.patch("/:id", protect, toggleTask);    // Toggle Status

router.delete("/:id", protect, deleteTask);

module.exports = router;