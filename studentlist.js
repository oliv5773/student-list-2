"use strict";

//Activate the getJson-function, which activates the start-function that inserts data into our array, making it displayable as if it was written in HTML:
document.addEventListener("DOMContentLoaded", getJson);

//Empty array that will contain the JSON-data:
let allStudents = [];

//Variable that selects HTML-element(s) with the "list" class:
let dest = document.querySelector(".list");

//Variable that will work as our filter:
let filter = "all";

//Variable that allows sorting:
let sortData;

//Function that retrieves the JSON-data:
async function getJson() {
    //Retrieving the data file:
    let jsonData = await fetch("http://petlatkea.dk/2019/students1991.json");

    // The retrieved data is handled as JSON:
    allStudents = await jsonData.json();

    //Call function that shows data in DOM:
    start();
}

//Function that shows data in DOM and triggers the sort/filter-functions:
function start() {
    dest.innerHTML = "";
    allStudents.forEach(student => {

        //In order to separate the full name into first- and surname, a variable is created to find the space between the two (for each student):
        const space = student.fullname.indexOf(" ");

        //Then a variable is created for the first name - the full name can now be split thanks to the "space" variable:
        let firstName = student.fullname.substring(0, space);

        //The same thing is done for the surname:
        let surname = student.fullname.substring(space + 1);

        //The first- and surname are now added as objects to each student:
        student.firstName = firstName;
        student.surname = surname;

        //If the filter shows a particular house only, or/and if the filter shows every house...
        if (filter == "all" || filter == student.house) {
            //... the students are placed in a class created in the HTML by JavaScript:
            let template =
                `<div class="studentos">
<h2>${student.fullname}</h2>
<p>${student.house}</p>`;

            //They should be inserted before the end of the element (as the last child):
            dest.insertAdjacentHTML("beforeend", template);

            //When you click them, they should show an individual popup-window by calling the "showSingle" function:
            dest.lastElementChild.addEventListener("click", () => {
                showSingle(student);
            });

            //This function opens the popup window...
            function showSingle(student) {
                document.querySelector("#content").innerHTML =
                    `<div class = "studentos">
                            <h2>${student.fullname}</h2>
<p>${student.house}</p>
                            </div>`;
                //... by making #popup in HTML visible (block):
                document.querySelector("#popup").style.display = "block";

                //When you click the HTML-div "#close", it calls the "close" function:
                document.querySelector("#popup #close").addEventListener("click", close);

                //A variable is created for a student's house - certain parameters are set according to which house the student belongs to:
                let house = student.house;
                if (house == "Gryffindor") {
                    document.querySelector("#content .studentos").style.backgroundColor =
                        "red";
                }

                if (house == "Hufflepuff") {
                    document.querySelector("#content .studentos").style.backgroundColor =
                        "pink";
                }

                if (house == "Ravenclaw") {
                    document.querySelector("#content .studentos").style.backgroundColor =
                        "blue";
                }

                if (house == "Slytherin") {
                    document.querySelector("#content .studentos").style.backgroundColor =
                        "green";
                }
            }


            //The close-function closes the popup-window:
            function close() {
                document.querySelector("#popup").style.display = "none";
            }
        }
    });


    //When the "#sort-by" element in HTML is selected, JavaScript changes the content by running the "sortBy" function:
    document.querySelectorAll("#sort-by").forEach(option => {
        option.addEventListener("change", sortBy);
    });

    //It does the same thing for filtering:
    document.querySelectorAll("#filter-by").forEach(option => {
        option.addEventListener("change", filterBy);
    });
}



//This function is called during start():
function filterBy() {
    //It changes the variable "filter" to the given value from the HTML:
    filter = this.value;

    //Then it runs start() to refresh the student list once more:
    start();
}



//This function is also called during start():
function sortBy() {
    //It changes the variable "sortData" to the given value from the HTML:
    sortData = this.value;

    //If HTML-value "First-name" is selected...
    if (sortData == "First-name") {
        //... it runs this function, which sorts the data alphabetically by first names:
        allStudents.sort(function (a, b) {
            return a.firstName.localeCompare(b.firstName);
        });

        //If HTML-value "Last-name" is selected...
    } else if (sortData == "Last-name") {
        //... it runs this function, which sorts the data alphabetically by surnames:
        allStudents.sort(function (a, b) {
            return a.surname.localeCompare(b.surname);
        });

        //If HTML-value "House" is selected...
    } else if (sortData == "House") {
        //... it runs this function, which sorts the data alphabetically by house:
        allStudents.sort(function (a, b) {
            return a.house.localeCompare(b.house);
        });

        //If HTML-value "none" is selected...
    } else if (sortData == "none") {
        //... it runs our initial function, getJson() again:
        getJson();
    }

    //The start function is called upon in order to refresh the student list:
    start();
}
