const Task = require("../models/Task");

// ===============================
// CREATE TASK
// ===============================
exports.createTask = async (req, res) => {
  try {
    const {
      title,
      priority,
      dueDate,
    } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    const task = await Task.create({
      title: title.trim(),
      priority: priority || "Medium",
      dueDate: dueDate || null,
      user: req.user.id,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });
  } catch (error) {
    console.log("Create Task Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===============================
// GET TASKS
// ===============================
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    console.log("Get Tasks Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===============================
// UPDATE TASK
// ===============================
exports.updateTask = async (req, res) => {
  try {
    const {
      title,
      priority,
      dueDate,
    } = req.body;

    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (title) task.title = title;
    if (priority) task.priority = priority;

    task.dueDate = dueDate || null;

    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.log("Update Task Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===============================
// DELETE TASK
// ===============================
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await task.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.log("Delete Task Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

// ===============================
// TOGGLE STATUS
// ===============================
exports.toggleTask = async (req, res) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.completed = !task.completed;

    await task.save();

    return res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    console.log("Toggle Task Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};