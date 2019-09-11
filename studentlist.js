"use strict";

document.addEventListener("DOMContentLoaded", getJson);

//Empty array that will contain the JSON-data:
let allStudents = [];

//Variable that selects HTML-element(s) with the "list" class:
let dest = document.querySelector(".list");

//Variable that will work as our filter:
let filter = "all";

//Function that retrieves the JSON-data:
async function getJson() {
    //Retrieving the data file
    let jsonData = await fetch("http://petlatkea.dk/2019/students1991.json");

    // The retrieved data is handled as JSON:
    allStudents = await jsonData.json();

    //Call function that shows data in DOM:
    start();
}


function start() {
    dest.innerHTML = "";
    allStudents.forEach(student => {

        if (filter == "all" || filter == student.house) {
            let template =
                //Place students in html
                `<div class="studentos">
<h2>${student.fullname}</h2>
<p>${student.house}</p>`;

            dest.insertAdjacentHTML("beforeend", template);
            dest.lastElementChild.addEventListener("click", () => {
                showSingle(student);
            });

            function showSingle(student) {

                document.querySelector("#content").innerHTML =
                    `<div class = "studentos">
                            <h2>${student.fullname}</h2>
<p>${student.house}</p>
</p>
                            </div>`;
                document.querySelector("#popup").style.display = "block";
                document.querySelector("#popup #close").addEventListener("click", close);

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



            function close() {
                document.querySelector("#popup").style.display = "none";
            }
        }
    });

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
