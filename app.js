const express = require("express");
const app = express();
const pool = require("./DBConfig");
const Router = require("express");
// const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./route");
const path = require("path");
const { editTodo, createTodo, getTodos, deleteTodo } = require("./controller");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 3001;

pool.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

pool.on("connect", () => {
  console.log("connected to the db");
});

// const corsOptions = {
//   origin: ["www.todo.lawrenceobote.com", "todo.lawrenceobote.com"],
// };

cors = {
  origin: ["todo.lawrenceobote.com", "www.todo.lawrenceobote.com"],
  default: "todo.lawrenceobote.com",
};

app.all("*", function (req, res, next) {
  const origin = cors.origin.includes(req.header("origin").toLowerCase())
    ? req.headers.origin
    : cors.default;
  res.header("Access-Control-Allow-Origin", origin);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
app.use(express.static(path.join(__dirname, "public")));
app.use(cors(corsOptions));
app.get("/todo_list", async (req, res) => {
  getTodos(req, res, pool);
});
app.post("/", (req, res) => {
  createTodo(req, res);
});
app.delete("/", (req, res) => {
  deleteTodo(req, res);
});
app.put("/", (req, res) => {
  editTodo(req, res);
});

const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
