const taskIdCounter = 0;

// querySelectors listed up top to match a specific selector; if no match is found, null should be returned
const formEl = document.querySelector("#task-form");
const tasksToDoEl = document.querySelector("#tasks-to-do");
const tasksInProgressEl = document.querySelector("#tasks-in-progress");
const tasksCompletedEl = document.querySelector("#tasks-completed");
const tasksBackBurnerEl = document.querySelector("#tasks-back-burner");
const pageContentEl = document.querySelector("#page-content");

// create array to hold tasks for saving information
let tasks = [];

// start form handlers
const taskFormHandler = function (event) {
  event.preventDefault();
  let taskNameInput = document.querySelector("input[name='task-name']").value;
  let taskTypeInput = document.querySelector("select[name='task-type']").value;

  // verify if inputs have information (validation)
  if (taskNameInput === "" || taskTypeInput === "") {
    alert("You need to fill out the task form!");
    return false;
  }

  // reset form fields for next task to be entered
  document.querySelector("input[name='task-name']").value = "";
  document.querySelector("select[name='task-type']").selectedIndex = 0;

  // check if task is new or one being edited by seeing if it has a data-task-id attribute
let isEdit = formEl.hasAttribute("data-task-id");

  if (isEdit) {
    let taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  } else {
    let taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do",
    };
    createTaskEl(taskDataObj);
  }
};

const createTaskEl = function (taskDataObj) {
  let listItemEl = document.createElement("li");
  listItemEl.className = "task-item";
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  let taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML =
    "<h3 class='task-name'>" +
    taskDataObj.name +
    "</h3><span class='task-type'>" +
    taskDataObj.type +
    "</span>";
  listItemEl.appendChild(taskInfoEl);

  // create task actions (buttons & select) for task
  let taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);

  switch (taskDataObj.status) {
    case "to do":
      taskActionsEl.querySelector(
        "select[name='status-change']"
      ).selectedIndex = 0;
      tasksToDoEl.append(listItemEl);
      break;
    case "in progress":
      taskActionsEl.querySelector(
        "select[name='status-change']"
      ).selectedIndex = 1;
      tasksInProgressEl.append(listItemEl);
      break;
    case "completed":
      taskActionsEl.querySelector(
        "select[name='status-change']"
      ).selectedIndex = 2;
      tasksCompletedEl.append(listItemEl);
      break;
    case "back burner":
      taskActionsEl.querySelector(
        "select[name='status-change']"
      ).selectedIndex = 3;
      tasksBackBurnerEl.append(listItemEl);
      break;
    default:
      console.log("Something went wrong!");
  }

  // save task as an object w/: name, type, status, & ID properties; then push it into tasks array
  taskDataObj.id = taskIdCounter;
  tasks.push(taskDataObj);

  // save tasks to localStorage
  saveTasks();

  // increase task counter for next unique id
  taskIdCounter++;
};

// task item functionality
const createTaskActions = function (taskId) {
    // create container element to hold multiple elements
  let actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  // create edit button element
  let editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);
  actionContainerEl.appendChild(editButtonEl);

  // create delete button element
  let deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);
  actionContainerEl.appendChild(deleteButtonEl);

  // create change status dropdown element
  let statusSelectEl = document.createElement("select");
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);
  statusSelectEl.className = "select-status";
  actionContainerEl.appendChild(statusSelectEl);

  // create status options element
  let statusChoices = ["To Do", "In Progress", "Completed", "Back Burner"];

  for (let i = 0; i < statusChoices.length; i++) {
    // create option element
    let statusOptionEl = document.createElement("option");
    statusOptionEl.setAttribute("value", statusChoices[i]);
    statusOptionEl.textContent = statusChoices[i];

    // append to select
    statusSelectEl.appendChild(statusOptionEl);
  }

  return actionContainerEl;
};

const completeEditTask = function (taskName, taskType, taskId) {
  // find task list item with taskId value
  let taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  // set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  // loop through tasks array and task object w/ new content
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].name = taskName;
      tasks[i].type = taskType;
    }
  }
  alert("Task has been updated.");

  // remove data attribute from form
  formEl.removeAttribute("data-task-id");

  // update formEl button to change from "Edit Task" to "Add Task"
  formEl.querySelector("#save-task").textContent = "Add Task";

  // save tasks to localStorage
  saveTasks();
};

const taskButtonHandler = function (event) {
  // get target element from selection event
  let targetEl = event.target;

  if (targetEl.matches(".edit-btn")) {
    console.log("edit", targetEl);
    let taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  } else if (targetEl.matches(".delete-btn")) {
    console.log("delete", targetEl);
    let taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

const taskStatusChangeHandler = function (event) {
  // find task list item based on event.target's data-task-id attribute
  let taskId = event.target.getAttribute("data-task-id");

  let taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  // convert value to lower case
  let statusValue = event.target.value.toLowerCase();

  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  } else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  } else if (statusValue === "back burner") {
    tasksBackBurnerEl.appendChild(taskSelected);
  }

  // update task's in tasks array
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    }
  }
  // save to localStorage
  saveTasks();
};

const editTask = function (taskId) {
  // get task list item element
  let taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  // get content from task name & type
  let taskName = taskSelected.querySelector("h3.task-name").textContent;
  let taskType = taskSelected.querySelector("span.task-type").textContent;

  // write values of taskname & taskType to form to be edited
  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;

  // set data attribute to the form w/ a value of the task's ide so it knows which one is being edited
  formEl.setAttribute("data-task-id", taskId);
  // update form's button to reflect editing a task rather than creating a new task
  formEl.querySelector("#save-task").textContent = "Save Task";
};

const deleteTask = function (taskId) {
  // find task list element with taskId value and remove it
  let taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );
  taskSelected.remove();

  // create new array to hold updated list of tasks
  let updatedTaskArr = [];

  // loop through current tasks
  for (let i = 0; i < tasks.length; i++) {
    // if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }
  }

  // reassign tasks array to be in the same as updated TaskArr
  tasks = updatedTaskArr;

  // save to localStorage
  saveTasks();
};

let saveTasks = function () {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

let loadTasks = function () {
 let savedTasks = localStorage.getItem("tasks");

  // if there are not tasks, set tasks to an empty array, then return out of the function
  if (!tasks) {
    tasks = [];
    return false;
  }
  savedTasks = JSON.parse(savedTasks);

  // loop through savedTasks array
  for (let i = 0; i < savedTasks.length; i++) {
    // pass each task object into the 'createTaskEl()' fxn
    createTaskEl(savedTasks[i]);
  }
};

// Create a new task
formEl.addEventListener("submit", taskFormHandler);

// for edit and delete buttons
pageContentEl.addEventListener("click", taskButtonHandler);

// for changing the status
pageContentEl.addEventListener("change", taskStatusChangeHandler);

// load the code
loadTasks();
