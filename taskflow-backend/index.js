import express from "express";
import dotenv from "dotenv";

dotenv.config();
const app = express();

const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "server is running smoothly....",
  });
});

let tasks = [];
app.post("/api/create", (req, res) => {
  const id = Math.random() * 10000000000000000;
  // request reading
  const { title, description } = req.body;

  // db operation
  tasks.push({
    id,
    title,
    description,
    status: "in-progress",
    isCompleted: false,
  });

  // response sending
  return res.status(200).json({
    status: 200,
    message: "Task created successfully.",
    total_task_count: tasks.length,
  });
});

app.get("/api/tasks", (req, res) => {
  return res.status(200).json({
    status: 200,
    message: "Task fetched successfully.",
    data: tasks,
  });
});

app.put("/api/update-task/:id", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  tasks = tasks.map((t) => {
    console.log(Number(id) === t.id);
    if (Number(id) === t.id) {
      return {
        ...t,
        status,
      };
    }
    return t;
  });

  return res.status(200).json({
    status: 200,
    message: "task updated successfully",
  });
});

app.delete("/api/remove-task/:id", (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter((t) => t.id !== Number(id));

  return res.status(200).json({
    status: 200,
    message: "task deleted successfully",
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
