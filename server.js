
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

let courses = [
  { id: 1, title: "HTML & CSS Basics", progress: 70, tasksCompleted: 7, totalTasks: 10 },
  { id: 2, title: "JavaScript Fundamentals", progress: 55, tasksCompleted: 11, totalTasks: 20 },
  { id: 3, title: "React Essentials", progress: 30, tasksCompleted: 3, totalTasks: 10 }
];

let todos = [
  { id: 1, title: "Finish JS array methods", status: "pending" },
  { id: 2, title: "Build React component", status: "pending" },
  { id: 3, title: "Revise HTTP methods", status: "done" }
];

app.get("/", (req, res) => res.json({ ok: true, service: "Learning Dashboard API" }));
app.get("/api/courses", (req, res) => res.json(courses));
app.post("/api/courses", (req, res) => {
  const { title, totalTasks } = req.body;
  const id = courses.length ? Math.max(...courses.map(c => c.id)) + 1 : 1;
  const course = { id, title, progress: 0, tasksCompleted: 0, totalTasks: totalTasks || 10 };
  courses.push(course);
  res.status(201).json(course);
});
app.patch("/api/courses/:id/progress", (req, res) => {
  const id = Number(req.params.id);
  const { tasksCompleted } = req.body;
  const course = courses.find(c => c.id === id);
  if (!course) return res.status(404).json({ error: "Course not found" });
  if (typeof tasksCompleted === "number") {
    course.tasksCompleted = Math.max(0, Math.min(tasksCompleted, course.totalTasks));
    course.progress = Math.round((course.tasksCompleted / course.totalTasks) * 100);
  }
  res.json(course);
});

app.get("/api/todos", (req, res) => res.json(todos));
app.post("/api/todos", (req, res) => {
  const { title } = req.body;
  const id = todos.length ? Math.max(...todos.map(t => t.id)) + 1 : 1;
  const todo = { id, title, status: "pending" };
  todos.push(todo);
  res.status(201).json(todo);
});
app.patch("/api/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const { status } = req.body;
  const todo = todos.find(t => t.id === id);
  if (!todo) return res.status(404).json({ error: "Todo not found" });
  if (status) todo.status = status;
  res.json(todo);
});
// ✅ Simple test route to check if backend works
app.get("/api/ping", (req, res) => {
  res.send("pong");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Learning Dashboard API running on http://localhost:${PORT}`);
});
