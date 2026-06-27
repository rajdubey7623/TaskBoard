import { useEffect, useState } from "react";
import {
  FaTasks,
  FaPlus,
  FaCheckCircle,
  FaClock,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");

  // Add Task
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");

  // Edit Task
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPriority, setEditPriority] = useState("Medium");
  const [editDueDate, setEditDueDate] = useState("");
  const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("All");
const [priorityFilter, setPriorityFilter] = useState("All");

  // =========================
  // Logout
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  // =========================
  // Fetch Tasks
  // =========================

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks");
      setTasks(response.data.tasks);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // =========================
  // Add Task
  // =========================

  const handleAddTask = async () => {
    if (!title.trim()) {
      setMessage("Please enter a task");
      return;
    }

    try {
      const response = await api.post("/tasks", {
        title,
        priority,
        dueDate,
      });

      setMessage(response.data.message);

      setTitle("");
      setPriority("Medium");
      setDueDate("");

      fetchTasks();
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  // =========================
  // Delete Task
  // =========================

  const handleDeleteTask = async (id) => {
    try {
      const response = await api.delete(`/tasks/${id}`);

      setMessage(response.data.message);

      fetchTasks();
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  // =========================
  // Toggle Status
  // =========================

  const handleToggleTask = async (id) => {
    try {
      const response = await api.patch(`/tasks/${id}`);

      setMessage(response.data.message);

      fetchTasks();
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong");
    }
  };

  // =========================
  // Edit Button
  // =========================

  const openEdit = (task) => {
    setEditingTask(task);

    setEditTitle(task.title);

    setEditPriority(task.priority || "Medium");

    setEditDueDate(
      task.dueDate
        ? new Date(task.dueDate).toISOString().substring(0, 10)
        : ""
    );
  };

  // =========================
  // Save Edit
  // =========================
// =========================
// Save Edit
// =========================

const handleUpdateTask = async () => {
  try {
    const response = await api.put(`/tasks/${editingTask._id}`, {
      title: editTitle,
      priority: editPriority,
      dueDate: editDueDate,
    });

    setMessage(response.data.message);
    setEditingTask(null);

    fetchTasks();
  } catch (err) {
    setMessage(
      err.response?.data?.message || "Something went wrong"
    );
  }
};

// =========================
// Filter Tasks
// =========================

const filteredTasks = tasks.filter((task) => {
  const matchesSearch = task.title
    .toLowerCase()
    .includes(search.toLowerCase());

  const matchesStatus =
    statusFilter === "All"
      ? true
      : statusFilter === "Completed"
      ? task.completed
      : !task.completed;

  const matchesPriority =
    priorityFilter === "All"
      ? true
      : task.priority === priorityFilter;

  return (
    matchesSearch &&
    matchesStatus &&
    matchesPriority
  );
});

// =========================
// Analytics
// =========================

const completedTasks = tasks.filter(
  (task) => task.completed
).length;

const pendingTasks = tasks.filter(
  (task) => !task.completed
).length;

const highPriorityTasks = tasks.filter(
  (task) => task.priority === "High"
).length;

const overdueTasks = tasks.filter(
  (task) =>
    task.dueDate &&
    !task.completed &&
    new Date(task.dueDate) < new Date()
).length;

const chartData = [
  {
    name: "Completed",
    value: completedTasks,
  },
  {
    name: "Pending",
    value: pendingTasks,
  },
];

const COLORS = [
  "#22c55e",
  "#facc15",
];

// =========================
// Return
// =========================

return (
  <div className="min-h-screen bg-gray-100">
    {/* Navbar */}
    <nav className="bg-indigo-700 text-white px-8 py-4 flex justify-between items-center shadow-lg">
      <h1 className="text-3xl font-bold">TaskFlow</h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
      >
        Logout
      </button>
    </nav>

    <div className="max-w-6xl mx-auto p-8">
      {/* Welcome */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-800">
          Welcome 👋
        </h2>

        <p className="text-gray-600 mt-2">
          Manage your daily tasks efficiently.
        </p>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-xl shadow-md p-6">
          <FaTasks className="text-4xl text-indigo-600 mb-4" />
          <h3 className="text-2xl font-bold">{tasks.length}</h3>
          <p className="text-gray-500">Total Tasks</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <FaClock className="text-4xl text-yellow-500 mb-4" />
          <h3 className="text-2xl font-bold">
            {tasks.filter((t) => !t.completed).length}
          </h3>
          <p className="text-gray-500">Pending</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <FaCheckCircle className="text-4xl text-green-500 mb-4" />
          <h3 className="text-2xl font-bold">
            {tasks.filter((t) => t.completed).length}
          </h3>
          <p className="text-gray-500">Completed</p>
        </div>
      </div>

      {message && (
        <div className="mb-5 bg-green-100 text-green-700 p-3 rounded-lg text-center">
          {message}
        </div>
      )}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">

  <h2 className="text-2xl font-bold mb-6">
    Analytics
  </h2>

  <div className="grid md:grid-cols-2 gap-8">

    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>

          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            outerRadius={90}
            dataKey="value"
            label
          >
            {chartData.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index]}
              />
            ))}
          </Pie>

          <Tooltip />

        </PieChart>
      </ResponsiveContainer>
    </div>

    <div className="flex flex-col justify-center text-lg">

      <p className="mb-4">
        📋 Total Tasks:
        <strong> {tasks.length}</strong>
      </p>

      <p className="mb-4 text-green-600">
        ✅ Completed:
        <strong>
          {" "}
          {tasks.filter((t) => t.completed).length}
        </strong>
      </p>

      <p className="mb-4 text-yellow-600">
        ⏳ Pending:
        <strong>
          {" "}
          {tasks.filter((t) => !t.completed).length}
        </strong>
      </p>

      <p className="mb-4 text-red-600">
        🔥 High Priority:
        <strong>
          {" "}
          {
            tasks.filter(
              (t) => t.priority === "High"
            ).length
          }
        </strong>
      </p>

      <p>
        📅 Overdue:
        <strong>
          {" "}
          {
            tasks.filter(
              (t) =>
                !t.completed &&
                t.dueDate &&
                new Date(t.dueDate) < new Date()
            ).length
          }
        </strong>
      </p>

    </div>

  </div>

</div>

      {/* Add Task */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-8">
        <h3 className="text-2xl font-semibold mb-5 flex items-center gap-2">
          <FaPlus />
          Add New Task
        </h3>

        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
        />

        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border rounded-lg p-3"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="border rounded-lg p-3"
          />
        </div>

        <button
          onClick={handleAddTask}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg"
        >
          Add Task
        </button>
      </div>
      {/* Search & Filters */}
<div className="bg-white rounded-xl shadow-md p-6 mb-6">

  <h3 className="text-xl font-semibold mb-4">
    Search & Filters
  </h3>

  <div className="grid md:grid-cols-3 gap-4">

    <input
      type="text"
      placeholder="Search tasks..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="border rounded-lg p-3"
    />

    <select
      value={statusFilter}
      onChange={(e) => setStatusFilter(e.target.value)}
      className="border rounded-lg p-3"
    >
      <option>All</option>
      <option>Pending</option>
      <option>Completed</option>
    </select>

    <select
      value={priorityFilter}
      onChange={(e) => setPriorityFilter(e.target.value)}
      className="border rounded-lg p-3"
    >
      <option>All</option>
      <option>High</option>
      <option>Medium</option>
      <option>Low</option>
    </select>

  </div>

</div>



      {/* Task List */}
<div className="bg-white rounded-xl shadow-md p-6">
  <h3 className="text-2xl font-semibold mb-6">
    Your Tasks
  </h3>

  {filteredTasks.length === 0 ? (
    <div className="text-center py-12 text-gray-500">
      No matching tasks found.
    </div>
  ) : (
    <div className="space-y-4">
      {filteredTasks.map((task) => {
        const overdue =
          task.dueDate &&
          !task.completed &&
          new Date(task.dueDate) < new Date();

        return (
          <div
            key={task._id}
            className={`p-5 rounded-xl border flex justify-between items-center ${
              overdue
                ? "border-red-500 bg-red-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <div>
              <h4
                className={`font-semibold text-lg ${
                  task.completed
                    ? "line-through text-gray-500"
                    : ""
                }`}
              >
                {task.title}
              </h4>

              <div className="flex gap-3 mt-2 flex-wrap">

                {/* Priority */}
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    task.priority === "High"
                      ? "bg-red-100 text-red-700"
                      : task.priority === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {task.priority}
                </span>

                {/* Status */}
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    task.completed
                      ? "bg-green-100 text-green-700"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {task.completed ? "Completed" : "Pending"}
                </span>

                {/* Due Date */}
                {task.dueDate && (
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      overdue
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100"
                    }`}
                  >
                    Due:{" "}
                    {new Date(task.dueDate).toLocaleDateString()}
                  </span>
                )}

              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleToggleTask(task._id)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                ✓
              </button>

              <button
                onClick={() => openEdit(task)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                <FaEdit />
              </button>

              <button
                onClick={() => handleDeleteTask(task._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  )}
</div>
            {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold mb-5">
              Edit Task
            </h2>

            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full border rounded-lg p-3 mb-4"
            />

            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value)}
              className="w-full border rounded-lg p-3 mb-4"
            >
              <option>High</option>
              <option>Medium</option>
              <option>Low</option>
            </select>

            <input
              type="date"
              value={editDueDate}
              onChange={(e) => setEditDueDate(e.target.value)}
              className="w-full border rounded-lg p-3 mb-5"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setEditingTask(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-5 py-2 rounded-lg"
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateTask}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);
}