let taskIdCounter = 0;

// querySelectors listed up top to match a specific selector; if no match is found, null should be returned

let formEl = document.querySelector("#task-form");
let tasksToDoEl = document.querySelector("#tasks-to-start");
let tasksInProgressEl = document.querySelector("#tasks-in-progress");
let tasksCompleted = document.querySelector("#tasks-completed");
let pageContentEl = document.querySelector("#page-content");

// create array to hold tasks for saving information
let tasks = [];

// start form handlers
let taskFormHandler = function (event) {
  event.preventDefault();

  let taskNameInput = document.querySelector("input[name='task-name']").value;

  let taskTypeInput = document.querySelector("select[name='task-type]").value;

  // verify if inputs have information (validation)
  if (taskNameInput === "" || taskTypeInput === "") {
    alert("Please fill out the form.");
    return false;
  }

  // reset the form fields for next task to be entered
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
      status: "to-do",
    };
    createTaskEl(taskDataObj);
  }
};

let createTaskEl = function (taskDataObj) {
  let listItemEl = document.createElement("li");
  listItemEl.className = "task-item";
  listItemEl.setAttribute("data-task-id", taskIdCounter);

  let taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";
  taskInfoEl.innerHTML =
    "<h3 class='task-name'>" +
    taskDataObj.name +
    "</h3><span class='task-type'> + </span>";

  listItemEl.appendChild(taskInfoEl);

  // create task action (buttons & select) for task
  let taskActionsEl = createTaskAction(taskIdCounter);
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
let createTaskAction = function(taskId) {
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
    deleteButtonEl.className = "btn delete-button";
    deleteButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(deleteButtonEl);

    // create change status dropdown element
    let statusSelectEl = document.createElement("select");
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);
    statusSelectEl.className = "select-status";
    actionContainerEl.appendChild(statusSelectEl);

    // create status options element
    let statusChoices = ["To Start", "In Progress", "Completed"];
    
    for (let i = 0; i < statusChoices.length; i++) {
        // create option element
        let statusOptionEl = document.createElement("option");
        statusOptionEl.setAttribute("value", statusChoices[i]);
        statusOptionEl.textConent = statusChoices[i];

        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    }
    return actionContainerEl;
};

let completeEditTask = function (taskName, taskType, taskId) {
    // find task list item associated w/ taskID value
    let taskSelected = document.querySelector(".task-item[data-task-id='" +taskId + "']");

    // set new values
    taskSelected.querySelector("h3.task-name").textContent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    // loop through tasks array & task object w/ new content
    for (let i = 0; i <tasks.length; i++) {
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
let taskButtonHandler = function (event) {
    // get target element from selectin event
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

let taskStatusChangeHandler = function (event) {
    // find task list item based on event.target's data-task-id attribute
}

