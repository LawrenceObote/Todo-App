const express = require("express");
const app = express();
const pool = require("./DBConfig");
const Router = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const router = require("./route");
const path = require("path");
const { editTodo, createTodo, getTodos, deleteTodo } = require("./controller");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 3001;

// const client = new Client({
//   database: process.env.DATABASE_NAME,
//   user: process.env.DATABASE_USER,
//   host: process.env.DATABASE_HOST,
//   password: process.env.DATABASE_PASSWORD,
//   port: process.env.DATABASE_PORT,
// });

pool.connect(function (err) {
  if (err) throw err;
  console.log("Connected!");
});

pool.on("connect", () => {
  console.log("connected to the db");
});

app.use(express.static(path.join(__dirname, "public")));

// app.use("/", router);
// app.use(cors());
app.get("/todo_list", async (req, res) => {
  getTodos(req, res, pool);
});
app.post("/", (req, res) => {
  createTodo(req, res);
});
app.delete("/", (req, res) => {
  deleteTodo(req, res);
});
app.put("/", editTodo);

const server = app.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta charset="x-Adobe-Zapf-Dingbats-Encoding">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">

    <title>Todo List</title>
    <link rel="stylesheet" type="text/css" href="/stylesheets/style.css">
    <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css">
  </head>
  <body id="body">
    <div class="container" id="container">
        <h1 class="title">TODO</h1>
        <div class="createTodoContainer">
            <form id="createForm">
                <div class="createTodoDiv">
                    <div class="columnLeft">
                        Add a Todo
                    </div>
                    <input id="createInput" type="text" name="title" value="" placeholder="Enter your Todo"/>
                    <div class="columnRight">
                        <button type="submit" id="createButton"></button>
                    </div>
                </div>
                </form>
            </form>
        </div>
        <div class="listContainer">
            <ul class="todoList" id="todoList">
            </ul>
        </div>
    </div>
	<script src="/javascript/App.js" crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/jquery-3.5.1.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
    </body>
</html>
`;
