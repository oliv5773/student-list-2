"use strict";

//Load up the DOM and run the start-function:
document.addEventListener("DOMContentLoaded", start);



//---GLOBAL VARIABLES---
//Empty arrays to contain the JSON-data:
let allStudents = [];
let students = [];
let families = [];
let filteredList = [];
let expelledStudents = [];

//Constant defining the parameters contained within each student:
const Student = {
  firstName: "",
  middleName: "",
  lastName: "",
  house: "",
  gender: "",
  bloodType: "",
  studentImage: "",
}

//Variables for the different houses:
let hufflepuff;
let gryffindor;
let ravenclaw;
let slytherin;

//Variables to allow sorting and filtering:
let sortby;
let house = "all";



//---FETCH DATA---
//Function that begins the two async functions which retrieves the JSON-data:
function start() {
  getJson();
  getJsonFamilies();
}

//Async function that retrieves the list of students:
async function getJson() {
  let jsonData = await fetch("http://petlatkea.dk/2019/hogwartsdata/students.json");
  students = await jsonData.json();

  //Calls function that runs hacked student and creates UUID for the entries:
  fixArray(students);
}

//Async function that retrieves the list of student blood types:
async function getJsonFamilies() {
  let jsonData = await fetch("http://petlatkea.dk/2019/hogwartsdata/families.json");
  families = await jsonData.json();

  //Local variables for half and pure blood types:
  let halfBlood = families.half;
  let pureBlood = families.pure;

  //Functions are called that places data in the list:
  getPure(pureBlood);
  getHalf(halfBlood);
}



//---SORTING AND FILTERING---
//The HTML-element "sort-by" is targeted - when an element inside it changes, it runs sortBy():
document.querySelectorAll('#sort-by').forEach(option => {
  option.addEventListener("change", sortBy);
});

//Function that allows for sorting the JSON-data:
function sortBy() {

  //The global variable is set according to the value selected:
  sortby = this.value;

  //Sorting by first name:
  if (sortby == "First-name") {
    filteredList.sort(function (a, b) {
      return a.firstName.localeCompare(b.firstName);
    });
  }

  //Sorting by surname:
  else if (sortby == "Last-name") {
    filteredList.sort(function (a, b) {
      return a.lastName.localeCompare(b.lastName);
    });
  }

  //Sorting by house:
  else if (sortby == "House") {
    filteredList.sort(function (a, b) {
      return a.house.localeCompare(b.house);
    });
  }

  //Sorting by none:
  else if (sortby == "none") {
    filteredList = filterBy(house);
  }

  //Function is called to display students in the list:
  showStudents();
}


//The HTML-element "filter-by" is targeted - when an element inside it changes, it runs setFilter():
document.querySelectorAll('#filter-by').forEach(option => {
  option.addEventListener("change", setFilter);
});

//These two functions sets the filter according to the value selected:
function setFilter() {
  house = this.value;
  filteredList = filterBy(house);
  showStudents();
}

function filterBy(house) {
  let listOfStudents = allStudents.filter(filterByHouse);

  function filterByHouse(student) {
    if (student.house == house || house == "all") {
      return true;
    } else {
      return false;
    }
  }
  return listOfStudents;
}


//---PLACE DATA---
//Function that recognizes and places data for pure blood families:
function getPure(pureBlood) {

  //Local variable for pure blood:
  let pure;
  pureBlood.forEach(student => {
    pure = student;
    allStudents.forEach(student => {
      if (student.lastName == pure) {
        student.bloodType = "Pure-blood";
      }
    });
  });
}

//Function that recognizes and places data for half blood families:
function getHalf(halfBlood) {

  //Local variable for half blood:
  let half;
  halfBlood.forEach(student => {
    half = student;
    allStudents.forEach(student => {
      if (student.lastName == half) {
        student.bloodType = "Half-blood";
      }
    });
  });
}

//Function that fixes the letters:
function fixArray(students) {
  students.forEach(jsonObject => {

    //Total amount of students is set according to the number of all students:
    document.querySelector(".total-count").innerHTML = `Total students: ${allStudents.length}`;

    //The same is done for expelled students:
    document.querySelector(".expel-count").innerHTML = `Expelled students: ${expelledStudents.length}`;
    filteredList = filterBy("all");

    //Local constant that creates a student object:
    const student = Object.create(Student);

    //Names are being trimmed and split:
    jsonObject.fullname = jsonObject.fullname.trim();
    jsonObject.fullname = jsonObject.fullname.split(" ");

    //House is trimmed, and first letter is set to uppercase. The remaining letters are set to lowercase:
    jsonObject.house = jsonObject.house.trim();
    student.house = jsonObject.house.charAt(0).toUpperCase() + jsonObject.house.slice(1).toLowerCase();

    //For gender, the first letter is set to uppercase, the rest to lowercase:
    student.gender = jsonObject.gender.charAt(0).toUpperCase() + jsonObject.gender.slice(1).toLowerCase();

    //The student is assigned a UUID from the function that is called:
    student.id = create_UUID();

    //If the full name has 3 entries...
    if (jsonObject.fullname.length == 3) {

      //... the first name is the first entry:
      student.firstName = jsonObject.fullname[0];

      //The first letter is set to uppercase, the rest to lowercase:
      student.firstName = student.firstName.charAt(0).toUpperCase() + student.firstName.slice(1).toLowerCase();

      //The middle name is the second entry:
      student.middleName = jsonObject.fullname[1];

      //The first letter is set to uppercase, the rest to lowercase:
      student.middleName = student.middleName.charAt(0).toUpperCase() + student.middleName.slice(1).toLowerCase();

      //The surname is the last entry:
      student.lastName = jsonObject.fullname[2];

      //The first letter is set to uppercase, the rest to lowercase:
      student.lastName = student.lastName.charAt(0).toUpperCase() + student.lastName.slice(1).toLowerCase();

      //The same principle is used for the image-names:
      student.studentImage = `${student.lastName.toLowerCase()}_${student.firstName.substring(0, 1).toLowerCase()}.png`;
    }

    //If the name only has 2 entries...
    else if (jsonObject.fullname.length == 2) {

      //... the first name is the first entry:
      student.firstName = jsonObject.fullname[0];

      //The first letter is set to uppercase, the rest to lowercase:
      student.firstName = student.firstName.charAt(0).toUpperCase() + student.firstName.slice(1).toLowerCase();

      //The last name is the second entry:
      student.lastName = jsonObject.fullname[1];

      //The first letter is set to uppercase, the rest to lowercase:
      student.lastName = student.lastName.charAt(0).toUpperCase() + student.lastName.slice(1).toLowerCase();

      //For Patil's images...
      if (student.lastName == "Patil") {

        //... both names are set to lowercase without calling the substring:
        student.studentImage = `${student.lastName.toLowerCase()}_${student.firstName.toLowerCase()}.png`;
      }

      //For everyone else, it is called:
      else {
        student.studentImage = `${student.lastName.toLowerCase()}_${student.firstName.substring(0, 1).toLowerCase()}.png`;
      }

      //For Finch-Fletchley, the split is used at the "-", making the letter after that uppercase:
      if (student.lastName == "Finch-fletchley") {
        student.lastName = student.lastName.split("-");
        student.lastName = `${student.lastName[0].charAt(0).toUpperCase() + student.lastName[0].slice(1).toLowerCase()}-${student.lastName[1].charAt(0).toUpperCase() + student.lastName[1].slice(1).toLowerCase()}`;
      }
    }

    //If the full name contains only one entry...
    else if (jsonObject.fullname.length == 1) {

      //... The first entry is the first name:
      student.firstName = jsonObject.fullname[0];

      //First letter is set to uppercase, the rest to lower:
      student.firstName = student.firstName.charAt(0).toUpperCase() + student.firstName.slice(1).toLowerCase();

      //The surname is set to "Unknown":
      student.lastName = "Unknown";
      student.studentImage = `unknown.png`;
    }

    //If blood status contains nothing, this means that the student was born a muggle:
    if (student.bloodType == "") {
      student.bloodType = "Muggle born"
    }

    //Student is pushed into every student to make the list appear again:
    allStudents.push(student);
  });

  //The following functions are then called upon out of this function:
  hackStudent();
  create_UUID();
  showStudents();
  countStudentsInHouse();
}

//Function that places data in HTML:
function showStudents() {

  //The HTML-element .list is targeted and emptied:
  document.querySelector(".list").innerHTML = "";

  //Local variable for destination to the list:
  let dest = document.querySelector(".list");

  //Local template variable:
  let temp = document.querySelector("template");

  //Each student is targeted and...
  filteredList.forEach(student => {

    //Local clone variable is set:
    let klon = temp.cloneNode(!0).content;

    //These if-statements informs the script how the students should be displayed once sorted:
    if (student == "lastName") {

      //If last name is selected, show last name first:
      if (sortby == "Last-name") {
        klon.querySelector(".student h2").innerHTML = student.lastName + ", " + student.firstName;
      }

      //Otherwise show them with first name first:
      else {
        klon.querySelector(".student h2").innerHTML = student.firstName + " " + student.lastName;
      }
    }

    //If the student has a middle name...
    else {

      //... and sorting set to last name, sort by last, first then middle:
      if (sortby == "Last-name") {
        klon.querySelector(".student h2").innerHTML = student.lastName + ", " + student.firstName + student.middleName;
      }

      //If set to first name, show first, middle then last name:
      else {
        klon.querySelector(".student h2").innerHTML = student.firstName + " " + student.middleName + " " + student.lastName;
      }
    }

    //The HTML-element .student p should contain the house:
    klon.querySelector(".student p").innerHTML = student.house;

    //The img class should contain the image:
    klon.querySelector(".student img").src = `img/${student.studentImage}`;

    //House is set to lower case, and the student is targeted by their ID:
    klon.querySelector(".student").dataset.house = student.house.toLowerCase();
    klon.querySelector(".student").dataset.id = student.id;
    klon.querySelector("button").dataset.id = student.id;

    //The child of the destination is appended with the clone:
    dest.appendChild(klon);
  });

  //When "expel" is clicked, the function expelStudent runs:
  document.querySelectorAll(".student .expelliarmus").forEach(expelliarmus => {
    expelliarmus.addEventListener('click', expelStudent);
  });

  document.querySelectorAll(".student .content").forEach(student => {
    student.addEventListener("click", showPopup);
  });

  //This function opens the popup window...
  function showPopup(student) {


    //... and at this point of time, none of this crappy code seems to work as intended. At one point it sort of did, but... if you're reading this, what you see in this section is an act of sheer desperation after 20 hours of failure.
    const singleStudent = Object.create(student);
    singleStudent.firstName = student.firstName;
    singleStudent.middleName = student.middleName;
    singleStudent.lastName = student.lastName;
    singleStudent.gender = student.gender;
    singleStudent.house = student.house;
    singleStudent.studentImage = student.studentImage;
    singleStudent.id = student.id;
    singleStudent.bloodType = student.bloodType;
    allStudents.push(singleStudent);

    document.querySelector(".content").innerHTML +=
      `<div class="single-student">
                  <div>
                      <h2>${singleStudent.firstName + " " + singleStudent.middleName + " " + singleStudent.lastName}</h2>
                      <p>${singleStudent.house}</p>
                      <p>${singleStudent.bloodType}
                      </p>
                  </div>
              </div>`;

    document.querySelector(".popup").style.display = "block";

    document
      .querySelector(".content")
      .addEventListener("click", close);
  }

  //The close-function closes the popup-window:
  function close() {
    document.querySelector(".popup").style.display = "none";
  }
}

//This function creates a UUID for each student:
function create_UUID() {
  var dt = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0;
    dt = Math.floor(dt / 16);
    return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

//This function places me as a new student in the array. Somehow I've made it to Slytherin, despite being a Muggle:
function hackStudent() {
  const student = Object.create(Student);
  student.firstName = "Oliver"
  student.lastName = "Nielsen";
  student.house = "Slytherin"
  student.gender = "Boy"
  student.studentImage = `blaxkjaer_o.png`;
  student.id = create_UUID();
  student.bloodType = "Muggle born"
  allStudents.push(student);
}

//This function counts the students within each house:
function countStudentsInHouse() {

  //The house is based upon the currently shown house from the filter:
  hufflepuff = allStudents.filter(x => x.house === 'Hufflepuff');
  gryffindor = allStudents.filter(x => x.house.includes('Gryffindor'));
  ravenclaw = allStudents.filter(x => x.house.includes('Ravenclaw'));
  slytherin = allStudents.filter(x => x.house.includes('Slytherin'));

  //Then it counts the length of these and places the number in innerHTML:
  document.querySelector(".hufflepuff-count").innerHTML = `Hufflepuff students: ${hufflepuff.length}`;
  document.querySelector(".gryffindor-count").innerHTML = `Gryffindor students: ${gryffindor.length}`;
  document.querySelector(".ravenclaw-count").innerHTML = `Ravenclaw students: ${ravenclaw.length}`;
  document.querySelector(".slytherin-count").innerHTML = `Slytherin students: ${slytherin.length}`;
}



//---EXPELLING---
//This function allows for expelling students
function expelStudent(event) {
  document.querySelector(".expel-count").classList.remove("disable");

  //Local constant to target students with:
  const element = event.target;

  //Local constant to target UUID:
  const id = element.dataset.id;

  //Local constants used within findFunction():
  const index = filteredList.findIndex(findFunction);
  const indexAll = allStudents.findIndex(findFunction);

  //Function that targets the student's UUID:
  function findFunction(student) {
    if (student.id == id) {
      return true;
    } else {
      return false;
    }
  }

  //Local variable that allows moving a student from the main list to the list of expelled students:
  let RemovedStudent = filteredList.slice(index, index + 1);
  RemovedStudent.forEach(ExpelledList);

  //Hide a student from the main list when expelling them:
  element.parentElement.classList.add("hide");

  //Count expelled students:
  document.querySelector(".expel-count").innerHTML = `Expelled students: ${expelledStudents.length}`;
  countStudentsInHouse();

  //Form a list with expelled students:
  function ExpelledList(student) {
    const studentExpel = {
      firstName: "",
      middleName: "",
      lastName: "",
      gender: "",
      house: "",
      studentImage: "",
      id: ""
    }

    //Local constant with the information for an expelled student:
    const studentExpelled = Object.create(studentExpel);
    studentExpelled.firstName = student.firstName;
    studentExpelled.middleName = student.middleName;
    studentExpelled.lastName = student.lastName;
    studentExpelled.gender = student.gender;
    studentExpelled.house = student.house;
    studentExpelled.studentImage = student.studentImage;
    studentExpelled.id = student.id;
    studentExpelled.bloodType = student.bloodType;
    expelledStudents.push(studentExpelled);
  }

  document.querySelector('.expel-count').addEventListener('click', showExpelledList);
}

function showExpelledList() {
  document.querySelector(".expelled-list").innerHTML = `<h1 class="">Expelled students (${expelledStudents.length})</h1>`;
  document.querySelector(".expelled-list").classList.remove("hide");

  expelledStudents.forEach(expelledStudent => {
    document.querySelector(".expelled-list").innerHTML +=
      `<div class="expelled-student">
                <img src="img/${expelledStudent.studentImage}" alt="">
                <div>
                    <h2>${expelledStudent.firstName + " " + expelledStudent.middleName + " " + expelledStudent.lastName}</h2>
                    <p>${expelledStudent.house}</p>
                    <p>${expelledStudent.gender} <br> ${expelledStudent.bloodType}
                    </p>
                </div>
            </div>`;
  });
}
function inConstruction() {
  alert("This function is coming in the near future!");
}
