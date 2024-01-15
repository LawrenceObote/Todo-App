const SQL = require("sql-template-strings");
const pool = require("./DBConfig");
const dotenv = require("dotenv");
dotenv.config();

const createTodo = async (req, res) => {
  const text = "INSERT INTO todo (title) VALUES($1);";
  const values = [req.query.title];
  try {
    const data = await pool.query(text, values);
    return res.status(201).json({
      status: 201,
      message: "ToDo added successfuly",
      data: data.rows,
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

const getTodos = async (req, res) => {
  try {
    const data = await pool.query(
      "SELECT * FROM todo ORDER BY created_on DESC;",
      []
    );

    if (data.rowCount == 0) return res.status(404).send("No Todo exists");
    return res.status(200).json({
      status: 200,
      message: "All Todos:",
      data: data.rows,
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};

const upsertTodos = async (id, title) => {
  const text =
    "INSERT INTO todo (id, title) VALUES ($1, $2) ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title;";
  const values = [id, title];

  try {
    const data = await pool.query(text, values);

    if (data.rowCount == 0) return res.status(204).send("Todo does not exist");

    return res.status(201).json({
      status: 201,
      message: "Todo updated successfully",
      data: data.rows,
    });
  } catch (error) {
    return error;
  }
};

const deleteTodo = async (req, res) => {
  console.log(req.query, req.body);
  const text = "DELETE FROM todo WHERE id = $1;";
  const values = [req.query.id];
  try {
    const data = await pool.query(text, values);
    if (data.rowCount == 0) return res.status(404).send("todo does not exist");

    return res.status(201).json({
      status: 201,
      message: "Todo deleted succesfully",
    });
  } catch (error) {
    return error;
  }
};

const setCompleted = async (id) => {
  const text = "UPDATE todo SET completed = NOT completed WHERE ID = $1;";
  const values = [id];
  try {
    const data = await pool.query(text, values);

    if (data.rowCount == 0) return res.status(404).send("Todo does not exist");

    return res.status(201).json({
      status: 201,
      message: "Completed status updated successfully",
      data: data.rows,
    });
  } catch (error) {
    return error;
  }
};

const editTodo = async (req, res) => {
  console.log(req.query.title, req.query.title);
  if (req.query.title) {
    await upsertTodos(req.query.id, req.query.title);
    return;
  }
  await setCompleted(req.query.id);
};

module.exports = {
  createTodo,
  getTodos,
  deleteTodo,
  editTodo,
};
