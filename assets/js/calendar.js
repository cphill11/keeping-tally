// get id est for current date & time
const currentDate = document.getElementById("currentDate");
    // display current date & time using moment.js 
    currentDate.textContent = moment().format('MMM Do YYYY, h:mm:ss a');

// save key / value to to local Storage
$(".saveBtn").on("click", function () {
    let saveKey = $(this).parent().attr("id");
    let saveValue = $(this).siblings(".description").val();
    localStorage.setItem(saveKey, saveValue);
});

//pull row info from localStorage & display it in the description
$("#row-5 .description").val(localStorage.getItem("row-5)"));
$("#row-6 .description").val(localStorage.getItem("row-6)"));
$("#row-7 .description").val(localStorage.getItem("row-7)"));
$("#row-8 .description").val(localStorage.getItem("row-8)"));
$("#row-9 .description").val(localStorage.getItem("row-9)"));
$("#row-11 .description").val(localStorage.getItem("row-11)"));
$("#row-12 .description").val(localStorage.getItem("row-12)"));
$("#row-13 .description").val(localStorage.getItem("row-13)"));
$("#row-14 .description").val(localStorage.getItem("row-14)"));
$("#row-15 .description").val(localStorage.getItem("row-15)"));
$("#row-16 .description").val(localStorage.getItem("row-16)"));
$("#row-17 .description").val(localStorage.getItem("row-17)"));
$("#row-18 .description").val(localStorage.getItem("row-18)"));
$("#row-19 .description").val(localStorage.getItem("row-19)"));
$("#row-20 .description").val(localStorage.getItem("row-20)"));
$("#row-21 .description").val(localStorage.getItem("row-21)"));
$("#row-22 .description").val(localStorage.getItem("row-22)"));
$("#row-23 .description").val(localStorage.getItem("row-23)"));
$("#row-24 .description").val(localStorage.getItem("row-24)"));
$("#row-25 .description").val(localStorage.getItem("row-25)"));
$("#row-26 .description").val(localStorage.getItem("row-26)"));
$("#row-27 .description").val(localStorage.getItem("row-27)"));
$("#row-28 .description").val(localStorage.getItem("row-28)"));
