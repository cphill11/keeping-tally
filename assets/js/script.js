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
let taskFormHandler = function(event){
    event.preventDefault();

    let taskNameInput = document.querySelector("input[name='task-name']").value;

    let taskTypeInput = document.querySelector("select[name='task-type]").value;

    // verify if inputs have information (validation)
    if (taskNameInput === "" || taskTypeInput === "" ) {
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

let createTaskEl = function(taskDataObj){
    let listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    listItemEl.setAttribute("data-task-id", taskIdCounter);

    let taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";
    taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'> + </span>";

    listItemEl.appendChild(taskInfoEl);

    // create task action (buttons & select) for task
    let taskActions = createTaskAction(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    switch (taskDataObj.status) {
        case "to do":
            taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 0;
            taskActionsEl.appendChild(listItemEl);
            break;
        case "in progress":
            taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
            taskActionsEl.appendChild(listenItemEl);
            break;
        case "completed":
            taskActionsEl.querySelector("select[name='status-change']");
            break;
        default:
            console.log("Something went wrong, please try again.");
    }
}