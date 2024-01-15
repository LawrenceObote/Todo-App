const fetchAPI = async (url, options) => {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP error: status: ${response.status}`);
  }
  return response.json();
};

const getTodos = async () => {
  try {
    const todos = await fetchAPI(
      "https://todo-list-wde5.onrender.com/todo_list",
      { method: "GET" }
    );
    await clearTodos();
    await renderTodosUl(todos.data);
    return todos.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const createTodoItem = async (title) => {
  const url = `https://todo-list-wde5.onrender.com/?title=${title}`;
  await fetchAPI(url, { method: "POST" });
};

const deleteTodo = async (id, li) => {
  const url = `https://todo-list-wde5.onrender.com/?id=${id}`;
  try {
    await fetchAPI(url, {
      method: "DELETE",
      body: JSON.stringify({ id }),
    });
    li.remove();
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const setCompleted = async (todo) => {
  const url = `http://localhost:3001`;

  await fetchAPI(url, {
    method: "PUT",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: todo.id }),
  });
};

const editTodos = async (id, title) => {
  const url = `https://todo-list-wde5.onrender.com/?id=${id}${
    title ? `&title=${title}` : ""
  }`;
  await fetchAPI(url, {
    method: "PUT",
    body: JSON.stringify({ id, title }),
  });
};

const createDeleteButton = (todo) => {
  const deleteButtonDiv = document.createElement("div");
  deleteButtonDiv.classList.add("deleteButtonDiv");
  const deleteButton = document.createElement("button");
  deleteButton.innerText = decodeHTMLEntities("&#10008;");
  deleteButton.classList.add("deleteButton");
  deleteButtonDiv.appendChild(deleteButton);

  deleteButton.addEventListener("click", (e) => {
    e.preventDefault();
    deleteTodo(todo.id, deleteButtonDiv.parentElement);
  });

  return deleteButtonDiv;
};

const createPopupForm = (todo, editButtonDiv) => {
  let popupForm = document.createElement("form");
  popupForm.setAttribute("id", `popupForm${todo.id}`);
  popupForm.classList.add("popupContainer");
  let popup = document.createElement("div");
  popup.classList.add("popup");
  popup.classList.add("popupWrapper");
  let popupInput = document.createElement("input");
  popupInput.setAttribute("id", `popupInput${todo.id}`);
  popupInput.setAttribute("type", "text");
  popupInput.setAttribute("class", `popupInput`);
  popupInput.setAttribute("placeholder", "Enter updated todo text here");
  popupInput.classList.add("popupInput");
  let popupSubmit = document.createElement("submit");
  popupForm.appendChild(popup);
  popup.appendChild(popupInput);
  popup.appendChild(popupSubmit);
  popup.style.visibility = "hidden";
  popupForm.style.visibility = "hidden";
  popupForm.addEventListener("submit", (e) => {
    const title = popupInput.value; //CHECK THIS!!!
    editTodos(todo.id, title);
  });

  editButtonDiv.firstChild.addEventListener("click", (e) => {
    e.preventDefault();

    if (popupForm.style.visibility === "hidden") {
      popupForm.style.visibility = "visible";
    } else {
      popupForm.style.visibility = "hidden";
    }

    document.addEventListener("click", (e) => {
      if (e.composedPath().includes(editButtonDiv)) return;
      const isClickedInsideDiv = e.composedPath().includes(popupForm);

      if (!isClickedInsideDiv && popupForm.style.visibility == "visible") {
        popupForm.style.visibility = "hidden";
      }
    });
    console.log(popupForm);
  });

  return popupForm;
};

const createEditFunctionality = (todo) => {
  let editButtonDiv = document.createElement("div");
  editButtonDiv.classList.add("editButtonDiv");
  let editPencil = document.createElement("p");
  let editPencilCode = "&#9998;";
  editPencil.innerText = decodeHTMLEntities(editPencilCode);
  editPencil.classList.add("editPencil");
  editButtonDiv.appendChild(editPencil);

  let popupForm = document.createElement("form");
  popupForm.setAttribute("id", `popupForm${todo.id}`);
  popupForm.classList.add("popupContainer");
  let popup = document.createElement("div");
  popup.classList.add("popup");
  popup.classList.add("popupWrapper");
  let popupInput = document.createElement("input");
  popupInput.setAttribute("id", `popupInput${todo.id}`);
  popupInput.setAttribute("type", "text");
  popupInput.setAttribute("class", `popupInput`);
  popupInput.setAttribute("placeholder", "Enter updated todo text here");
  popupInput.classList.add("popupInput");
  popupInput.style;
  let popupSubmit = document.createElement("submit");
  popupForm.appendChild(popup);
  popup.appendChild(popupInput);
  popup.appendChild(popupSubmit);
  popup.style.visibility = "hidden";
  popupForm.style.visibility = "hidden";
  popupForm.addEventListener("submit", (e) => {
    const title = popupInput.value;
    e.preventDefault;
    editTodos(todo.id, title);
  });
  editPencil.addEventListener("click", (e) => {
    e.preventDefault();
    console.log("functioning");
    popupForm.style.visbility = popup.style.visbility;
    if (popupForm.style.visibility === "hidden") {
      popup.style.visibility = "visible";
      popupForm.style.visibility = "visible";
    } else {
      popup.style.visibility = "hidden";
      popupForm.style.visibility = "hidden";
    }
    document.addEventListener("click", (e) => {
      console.log(e.composedPath().includes(editButtonDiv));
      if (e.composedPath().includes(editButtonDiv)) return;
      const isClickedInsideDiv = e.composedPath().includes(popupForm);
      console.log("clicked", isClickedInsideDiv);
      if (!isClickedInsideDiv && popupForm.style.visibility == "visible") {
        popupForm.style.visibility = "hidden";
      }
    });
    console.log(popupForm);
  });

  return [editButtonDiv, popupForm];
};

const createTodoTextDiv = (todo) => {
  const todoTextDiv = document.createElement("div");
  todoTextDiv.classList.add("todoTextDiv");
  const todoText = document.createElement("p");
  todoText.classList.add("todoText");
  todoText.textContent = todo.title;
  todoTextDiv.appendChild(todoText);

  return todoTextDiv;
};

const decodeHTMLEntities = (text) => {
  var textArea = document.createElement("textarea");
  textArea.innerHTML = text;
  return textArea.value;
};

const renderTodosUl = async (todoList) => {
  let list = document.getElementById("todoList");
  todoListHtml = todoList.map((todo) => {
    let li = document.createElement("li");

    let body = document.getElementById("body");
    let completedDiv = document.createElement("div");
    completedDiv.classList.add("completedDiv");
    let completedCheck = document.createElement("p");
    let completedCheckCode = "&#10004;";
    completedCheck.innerText = decodeHTMLEntities(completedCheckCode);
    completedCheck.classList.add("completedCheck");
    completedDiv.appendChild(completedCheck);

    completedCheck.setAttribute("completed", `${todo.completed}`);
    completedCheck.classList.add("completedCheck");

    completedCheck.addEventListener("click", (e) => {
      e.preventDefault();
      editTodos(todo.id);
    });
    li.appendChild(completedDiv);
    li.appendChild(createTodoTextDiv(todo));
    const editArray = createEditFunctionality(todo);
    li.appendChild(editArray[0]);
    li.appendChild(createDeleteButton(todo));
    body.appendChild(editArray[1]);
    list.appendChild(li);

    li.style = {
      paddingLeft: "10px",
    };
  });

  list.innerHTML.value = todoList;
};

const clearTodos = () => {
  while (document.getElementById("todoList").firstChild) {
    document.getElementById("todoList").firstChild.remove();
  }
};

const refreshTodoList = async () => {
  clearTodos();
  renderTodosUl();
};

document.getElementById("createForm").onsubmit = async (e) => {
  e.preventDefault();
  const titleInput = document.getElementById("createInput");
  const title = titleInput.value.trim();
  if (title) {
    await createTodoItem(title);
    getTodos();
    titleInput.value = "";
  }
};

getTodos();
