// get id est for current date & time
const currentDate = document.getElementById("currentDate");
    // display current date & time using moment.js 
    currentDate.textContent = moment().format('MMM Do YYYY, h:mm:ss a');

// calendar row color functionality
function colorChange() {
    let hour = moment().hour();
    
}