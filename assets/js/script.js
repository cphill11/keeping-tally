const taskIdCounter = 0;

// query selectors listed up top to match a specific selector; if no match is found, null should be returned
const formEl = document.querySelector("#task-form");

const tasksToDoEl = document.querySelector("#tasks-to-start");

const tasksInProgressEl = document.querySelector("#tasks-in-progress");

const tasksCompleted = document.querySelector("#tasks-completed");

// this function might need to be first!
const pageContentEl = document.querySelector("#page-content");

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
    docuemnt.querySelector("input[name='task-name']").value = "";

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


}