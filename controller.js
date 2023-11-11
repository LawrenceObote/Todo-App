const SQL = require("sql-template-strings");
const pool = require("./DBConfig");
const dotenv = require("dotenv");
dotenv.config();

const createTodo = async (req, res) => {
  const title = req.query.title;
  const query = SQL`insert into todo (title, created_on, completed) values(${title}, current_timestamp, false);`;
  try {
    const data = await pool.query(query);
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

const getTodos = async (req, res, pool) => {
  try {
    const data = await pool.query(
      "SELECT * FROM todo ORDER BY created_on DESC;"
    );

    if (data.rowCount == 0) return res.status(404).send("No Todo exists");
    return res.status(201).json({
      status: 201,
      message: "All Todos:",
      data: data.rows,
    });
  } catch (error) {
    console.log(error);
    return error;
  }
};
const getTodoById = async (req, res) => {
  const id = parseInt(req.params.id);
  const query = "SELECT * FROM todo WHERE id=$1";
  const value = [id];

  try {
    const data = await pool.query;

    if (data.rowCount == 0) return res.status(404).send("No article exists");

    return res.status(200).json({
      status: 200,
      message: "Todo",
      data: data.rows,
    });
  } catch (error) {
    return error;
  }
};

const upsertTodos = async (id, title) => {
  const query = SQL`INSERT INTO todo (id, title)
    VALUES (${id}, ${title})
    ON CONFLICT (id)
    DO UPDATE SET title = EXCLUDED.title;`;

  try {
    const data = await pool.query(query);

    if (data.rowCount == 0) return res.status(204).send("Todo does not exist");

    return res.status(200).json({
      status: 200, //check for more specific success
      message: "Todo updated successfully",
      data: data.rows,
    });
  } catch (error) {
    return error;
  }
};

const deleteTodo = async (req, res) => {
  const id = req.query.id;

  const query = SQL`DELETE FROM todo WHERE ID = ${id};`;
  try {
    const data = await pool.query(query);
    if (data.rowCount == 0) return res.status(404).send("todo does not exist");

    return res.status(200).json({
      status: 200,
      message: "Todo deleted succesfully",
    });
  } catch (error) {
    return error;
  }
};

const setCompleted = async (id) => {
  const query = SQL`UPDATE todo SET completed = NOT completed WHERE ID = ${id}`;

  try {
    const data = await pool.query(query);

    if (data.rowCount == 0) return res.status(404).send("Todo does not exist");

    return res.status(200).json({
      status: 200,
      message: "Completed status updated successfully",
      data: data.rows,
    });
  } catch (error) {
    return error;
  }
};

const editTodo = async (req, res) => {
  if (req.body.title) {
    await upsertTodos(req.body.id, req.body.title);
    return;
  }
  await setCompleted(req.body.id);
};

module.exports = {
  createTodo,
  getTodoById,
  getTodos,
  deleteTodo,
  editTodo,
};
