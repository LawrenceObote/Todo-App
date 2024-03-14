const express = require("express");
const app = express();
const pool = require("./DBConfig");
const cors = require("cors");
const path = require("path");
const { editTodo, createTodo, getTodos, deleteTodo } = require("./controller");
const dotenv = require("dotenv");
dotenv.config();

const port = process.env.PORT || 3001;

// Database connection
pool.connect((err) => {
  if (err) throw err;
  console.log("Connected to the database!");
});

pool.on("connect", () => {
  console.log("Connected to the database");
});

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());
app.use(express.json()); // Add this line to parse JSON requests

// Routes
app.get("/todo_list", getTodos);
app.post("/", createTodo);
app.delete("/", deleteTodo);
app.put("/", editTodo);

// Start the server
const server = app.listen(port, () =>
  console.log(`Server is running on port ${port}`)
);

// Increase server timeout values
server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
