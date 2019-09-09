 "use strict";

 let allStudents = [];

 //Get JSON-file in async function
 async function getJson() {

     //Retrieving the data file
     let jsonData = await fetch("http://petlatkea.dk/2019/students1991.json");
     console.log(jsonData);

     // The retrieved data is handled as JSON
     allStudents = await jsonData.json();
     console.log(allStudents);

     //Call function that shows data in DOM
     start();

 }

 document.addEventListener("DOMContentLoaded", getJson);

 function start() {
     let dest = document.querySelector(".list");
     //Run through the list of students and insert data in a template

     allStudents.forEach(student => {
         //Place students in html
         dest.innerHTML +=
             `<div class="list">
                 <h2>${student.fullname}</h2>
<p>House: ${student.house}</p>`;
     })
 }
