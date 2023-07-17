var taskIdCounter = 0;

// querySelectors listed up top to match a specific selector; if no match is found, null should be returned

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-start");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");

// create array to hold tasks for saving information
var tasks = [];

// start form handlers
var taskFormHandler = function (event) {
  event.preventDefault();

  var taskNameInput = document.querySelector("input[name='task-name']").value;

  var taskTypeInput = document.querySelector("select[name='task-type]").value;

  // verify if inputs have information (validation)
  if (taskNameInput === "" || taskTypeInput === "") {
    alert("Please fill out the form.");
    return false;
  }

  // reset the form fields for next task to be entered
  document.querySelector("input[name='task-name']").value = "";

  document.querySelector("select[name='task-type']").selectedIndex = 0;

  // check if task is new or one being edited by seeing if it has a data-task-id attribute
  var isEdit = formEl.hasAttribute("data-task-id");

  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  } else {
   var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to-do",
    };
    createTaskEl(taskDataObj);
  }
};

var createTaskEl = function (taskDataObj) {
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML =
    "<h3 class='task-name'>" +
    taskDataObj.name +
    "</h3><span class='task-type'> + </span>";

  listItemEl.appendChild(taskInfoEl);

  // create task action (buttons & select) for task
  var taskActionsEl = createTaskAction(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);

  switch (taskDataObj.status) {
    case "to do":
      taskActionsEl.querySelector(
        "select[name='status-change']"
      ).selectedIndex = 0;
      taskActionsEl.appendChild(listItemEl);
      break;
    case "in progress":
      taskActionsEl.querySelector(
        "select[name='status-change']"
      ).selectedIndex = 1;
      taskActionsEl.appendChild(listenItemEl);
      break;
    case "completed":
      taskActionsEl.querySelector("select[name='status-change']");
      break;
    default:
      console.log("Something went wrong, please try again.");
  }

  // save task as an object w/: name, type, status, & ID properties; then push it into tasks array
  taskDataObj.id = taskIdCounter;
  tasks.push(taskDataObj);

  // save tasks to local storage
  saveTasks();

  // increase the task counter for every unique ID
  taskIdCounter++;
};

// task item functionality
var createTaskAction = function (taskId) {
  // create container element to hold multiple elements
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  // create edit button element
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);
  actionContainerEl.appendChild(editButtonEl);

  // create delete button element
 var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-button";
  deleteButtonEl.setAttribute("data-task-id", taskId);
  actionContainerEl.appendChild(deleteButtonEl);

  // create change status dropdown element
  var statusSelectEl = document.createElement("select");
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);
  statusSelectEl.className = "select-status";
  actionContainerEl.appendChild(statusSelectEl);

  // create status options element
  var statusChoices = ["To Start", "In Progress", "Completed"];

  for (var i = 0; i < statusChoices.length; i++) {
    // create option element
    var statusOptionEl = document.createElement("option");
    statusOptionEl.setAttribute("value", statusChoices[i]);
    statusOptionEl.textConent = statusChoices[i];

    // append to select
    statusSelectEl.appendChild(statusOptionEl);
  }
  return actionContainerEl;
};

var completeEditTask = function (taskName, taskType, taskId) {
  // find task list item associated w/ taskID value
  let taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  // set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  // loop through tasks array & task object w/ new content
  for (var i = 0; i < tasks.length; i++) {
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

  // save to localStorage
  saveTasks();
};

// button handler functionality
var taskButtonHandler = function (event) {
  // get target element from selectin event
  var targetEl = event.target;

  if (targetEl.matches(".edit-btn")) {
    console.log("edit", targetEl);
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  } else if (targetEl.matches(".delete-btn")) {
    console.log("delete", targetEl);
    var taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

var taskStatusChangeHandler = function (event) {
  // find task list item based on event.target's data-task-id attribute
 var taskId = event.target.getAttribute("data-taskid");

  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  // convert values to lower case
  var statusValue = event.target.value.toLowerCase();

  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  } else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }

  // update tasks in task's array
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    }
  }

  // save to localStorage
  saveTasks();
};

var editTask = function (taskId) {
  // get task list item element
 var taskSelected = document.querySelector(
    ".task-item[data-task-id'" + taskId + "']"
  );

  // get content from task name & type
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  var taskType = taskSelected.querySelector("span.task.type").textContent;

  // write values of taskName & taskType in form to be edited
  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;

  // set data attribute to the form w/ a value of the task's ide so it knows which one is being edited
  formEl.setAttribute("data-task-id", taskId);

  // update form's button to reflect editing a task rather than creating a new task
  formEl.querySelector("#save-task").textContent = "Save Task";
};

var deleteTask = function (taskId) {
  // find task list element w/ taskId value & then remove it
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );
  taskSelected.remove();

  // create new array to hold updated list of tasks
 var updatedTaskArr = [];

  // loop through current tasks
  for (var i = 0; i < tasks.length; i++) {
    // if tasks[i].id doesn't match the value of taskId, keep the task & push it to the new array
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }
  }

  // reaassign tasks arrasy to be the same as updated TaskArr
  tasks = updatedTaskArr;

  // save to localStorage
  saveTasks();
};

var saveTasks = function () {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function () {
  var savedTasks = localStorage.getItem("tasks");

  // if there are not tasks, set tasks to an empty array, then return out fo the fxn
  if (!tasks) {
    tasks = [];
    return false;
  }
  // this next line was commented out in the original project
//   savedTasks = JSON.parse(savedTasks);

  // loop through savedTasks array
  for (var i = 0; i < savedTasks.length; i++) {
    // pass each task object into the 'createTaskEl()' fxn
    createTaskEl(savedTasks[i]);
  }
};

// load the code
var taskIdCounter = 0;

// querySelectors listed up top to match a specific selector; if no match is found, null should be returned

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-start");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");

// create array to hold tasks for saving information
var tasks = [];

// start form handlers
var taskFormHandler = function (event) {
  event.preventDefault();

  var taskNameInput = document.querySelector("input[name='task-name']").value;

  var taskTypeInput = document.querySelector("select[name='task-type]").value;

  // verify if inputs have information (validation)
  if (taskNameInput === "" || taskTypeInput === "") {
    alert("Please fill out the form.");
    return false;
  }

  // reset the form fields for next task to be entered
  document.querySelector("input[name='task-name']").value = "";

  document.querySelector("select[name='task-type']").selectedIndex = 0;

  // check if task is new or one being edited by seeing if it has a data-task-id attribute
  var isEdit = formEl.hasAttribute("data-task-id");

  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  } else {
   var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to-do",
    };
    createTaskEl(taskDataObj);
  }
};

var createTaskEl = function (taskDataObj) {
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML =
    "<h3 class='task-name'>" +
    taskDataObj.name +
    "</h3><span class='task-type'> + </span>";

  listItemEl.appendChild(taskInfoEl);

  // create task action (buttons & select) for task
  var taskActionsEl = createTaskAction(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);

  switch (taskDataObj.status) {
    case "to do":
      taskActionsEl.querySelector(
        "select[name='status-change']"
      ).selectedIndex = 0;
      taskActionsEl.appendChild(listItemEl);
      break;
    case "in progress":
      taskActionsEl.querySelector(
        "select[name='status-change']"
      ).selectedIndex = 1;
      taskActionsEl.appendChild(listenItemEl);
      break;
    case "completed":
      taskActionsEl.querySelector("select[name='status-change']");
      break;
    default:
      console.log("Something went wrong, please try again.");
  }

  // save task as an object w/: name, type, status, & ID properties; then push it into tasks array
  taskDataObj.id = taskIdCounter;
  tasks.push(taskDataObj);

  // save tasks to local storage
  saveTasks();

  // increase the task counter for every unique ID
  taskIdCounter++;
};

// task item functionality
var createTaskAction = function (taskId) {
  // create container element to hold multiple elements
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  // create edit button element
  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId);
  actionContainerEl.appendChild(editButtonEl);

  // create delete button element
 var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-button";
  deleteButtonEl.setAttribute("data-task-id", taskId);
  actionContainerEl.appendChild(deleteButtonEl);

  // create change status dropdown element
  var statusSelectEl = document.createElement("select");
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);
  statusSelectEl.className = "select-status";
  actionContainerEl.appendChild(statusSelectEl);

  // create status options element
  var statusChoices = ["To Start", "In Progress", "Completed"];

  for (var i = 0; i < statusChoices.length; i++) {
    // create option element
    var statusOptionEl = document.createElement("option");
    statusOptionEl.setAttribute("value", statusChoices[i]);
    statusOptionEl.textConent = statusChoices[i];

    // append to select
    statusSelectEl.appendChild(statusOptionEl);
  }
  return actionContainerEl;
};

var completeEditTask = function (taskName, taskType, taskId) {
  // find task list item associated w/ taskID value
  let taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  // set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  // loop through tasks array & task object w/ new content
  for (var i = 0; i < tasks.length; i++) {
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

  // save to localStorage
  saveTasks();
};

// button handler functionality
var taskButtonHandler = function (event) {
  // get target element from selectin event
  var targetEl = event.target;

  if (targetEl.matches(".edit-btn")) {
    console.log("edit", targetEl);
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  } else if (targetEl.matches(".delete-btn")) {
    console.log("delete", targetEl);
    var taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

var taskStatusChangeHandler = function (event) {
  // find task list item based on event.target's data-task-id attribute
 var taskId = event.target.getAttribute("data-taskid");

  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );

  // convert values to lower case
  var statusValue = event.target.value.toLowerCase();

  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  } else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }

  // update tasks in task's array
  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    }
  }

  // save to localStorage
  saveTasks();
};

var editTask = function (taskId) {
  // get task list item element
 var taskSelected = document.querySelector(
    ".task-item[data-task-id'" + taskId + "']"
  );

  // get content from task name & type
  var taskName = taskSelected.querySelector("h3.task-name").textContent;
  var taskType = taskSelected.querySelector("span.task.type").textContent;

  // write values of taskName & taskType in form to be edited
  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;

  // set data attribute to the form w/ a value of the task's ide so it knows which one is being edited
  formEl.setAttribute("data-task-id", taskId);

  // update form's button to reflect editing a task rather than creating a new task
  formEl.querySelector("#save-task").textContent = "Save Task";
};

var deleteTask = function (taskId) {
  // find task list element w/ taskId value & then remove it
  var taskSelected = document.querySelector(
    ".task-item[data-task-id='" + taskId + "']"
  );
  taskSelected.remove();

  // create new array to hold updated list of tasks
 var updatedTaskArr = [];

  // loop through current tasks
  for (var i = 0; i < tasks.length; i++) {
    // if tasks[i].id doesn't match the value of taskId, keep the task & push it to the new array
    if (tasks[i].id !== parseInt(taskId)) {
      updatedTaskArr.push(tasks[i]);
    }
  }

  // reaassign tasks arrasy to be the same as updated TaskArr
  tasks = updatedTaskArr;

  // save to localStorage
  saveTasks();
};

var saveTasks = function () {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function () {
  var savedTasks = localStorage.getItem("tasks");

  // if there are not tasks, set tasks to an empty array, then return out fo the fxn
  if (!tasks) {
    tasks = [];
    return false;
  }
  // this next line was commented out in the original project
//   savedTasks = JSON.parse(savedTasks);

  // loop through savedTasks array
  for (var i = 0; i < savedTasks.length; i++) {
    // pass each task object into the 'createTaskEl()' fxn
    createTaskEl(savedTasks[i]);
  }
};

// load the code
// loadTasks();

