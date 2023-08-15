// TODO: Pasar todo a un mismo archivo js
// Declaración de variables para identificar los elementos del documento
const registerBody = document.querySelector(".register-body");
const generateUserURL = "https://randomuser.me/api/?inc=name,location,email";
const userForm = document.getElementById("userForm");
const userName = document.getElementById("userName");
const userLastName = document.getElementById("userLastName");
const userEmail = document.getElementById("userEmail");
const userCountry = document.getElementById("userCountry");
const termsCheckbox = document.getElementById("termsCheckbox");
const btnGenerateUser = document.getElementById("btnGenerateUser");
const btnSubmitUser = document.getElementById("btnSubmitUser");
let nameUser, lastNameUser, emailUser, countryUser, termsCheck;

const header = document.querySelector(".header");
const indexBody = document.querySelector(".index-body");
const btnAddTask = document.getElementById("btnAddTask");
const spanUserName = document.getElementById("spanUserName");
const todayTaskContainer = document.getElementById("todayTaskContainer");
const importantTaskContainer = document.getElementById(
  "importantTaskContainer"
);
const pendingTaskContainer = document.getElementById("pendingTaskContainer");
const completedTaskContainer = document.getElementById(
  "completedTaskContainer"
);
const taskFormDisplay = document.getElementById("taskFormDisplay");
const taskForm = document.getElementById("taskForm");
const taskName = document.getElementById("taskName");
const taskCategory = document.getElementById("taskCategory");
const taskFinishTime = document.getElementById("taskFinishTime");
const taskDescription = document.getElementById("taskDescription");
const importanceCheckbox = document.getElementById("importanceCheckbox");
const btnSubmitTask = document.getElementById("btnSubmitTask");
const btnCloseForm = document.getElementById("btnCloseForm");
let allTasksArray = [];
let pendingTasksArray = [],
  todayTasksArray = [],
  importantTasksArray = [],
  completedTasksArray = [];
let taskId = 0;

class Task {
  constructor(
    id,
    name,
    category,
    finishTime,
    description,
    importance,
    completed
  ) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.finishTime = finishTime;
    this.description = description;
    this.importance = importance;
    this.completed = completed;
  }
}
// Función para encontrar y borrar el objeto del array, eliminándolo del DOM

function deleteElementFromContainer(e) {
  const btn = e.target;
  console.log(btn);
  const taskId = btn.getAttribute("data-id");
  const indexTaskToDelete = allTasksArray.findIndex(
    (task) => task.id.toString() == taskId
  );
  if (indexTaskToDelete !== -1) {
    allTasksArray.splice(indexTaskToDelete, 1);
  }
  updateContainers();
  e.stopPropagation();
}
// Función para encontrar y cambiar la propiedad completed del objeto encontrado, mostrándolo en la sección correspondiente

function setElementToCompleted(e) {
  const btn = e.target;
  console.log(btn);
  const taskId = btn.getAttribute("data-id");
  const indexTaskToComplete = allTasksArray.findIndex(
    (task) => task.id.toString() == taskId
  );
  if (indexTaskToComplete !== -1) {
    allTasksArray[indexTaskToComplete].completed = true;
  }
  updateContainers();
  e.stopPropagation();
}

function appendTasksToContainer(array, taskContainer) {
  emptyContainer(taskContainer);
  array.forEach((tarea) => {
    taskContainer.appendChild(
      createTaskElement(
        tarea.id,
        tarea.name,
        tarea.category,
        tarea.finishTime,
        tarea.description
      )
    );
    const deleteButtons = document.querySelectorAll(".supr");
    console.log(deleteButtons);
    const completeButtons = document.querySelectorAll(".complete");
    console.log(completeButtons);

    deleteButtons.forEach((btn) =>
      btn.addEventListener("pointerdown", deleteElementFromContainer)
    );

    completeButtons.forEach((btn) =>
      btn.addEventListener("pointerdown", setElementToCompleted)
    );
  });
  notifyEmptyContainer(taskContainer);
}

function updateContainers() {
  updateArrays();
  appendTasksToContainer(pendingTasksArray, pendingTaskContainer);
  appendTasksToContainer(todayTasksArray, todayTaskContainer);
  appendTasksToContainer(importantTasksArray, importantTaskContainer);
  appendTasksToContainer(completedTasksArray, completedTaskContainer);
}

function createTaskElement(
  idTask,
  nameTask,
  categoryTask,
  finishTimeTask,
  descriptionTask
) {
  let finishTimeTaskDate = new Date(finishTimeTask);
  nameTask = firstLetterCap(nameTask);
  categoryTask = firstLetterCap(categoryTask);
  descriptionTask = firstLetterCap(descriptionTask);
  const newTask = document.createElement("li");
  newTask.classList.add("card");
  newTask.innerHTML = `
    <div class="card__color"></div>
    <div class="card__body">
    <h5 class="card__category"></h5>
    <h4 class="card__name"></h4>
    <div class="card__div">
    <img class="card__svg" src="img/clock.svg" alt="clock">
    <p class="card__p">
    <span class="card__finish-time"></span>
    </p>
    </div>
    <div class="card__div">
    <img class="card__svg desc-svg" src="img/paragraph.svg" alt="description">
    <p class="card__p">
    <span class="card__description"></span>
    </p>
    </div>
    <button type="button" class="card__btn supr" data-id="${idTask}">
    <img class="card__btn-svg" src="img/close-x.svg" alt="close" data-id="${idTask}">
    </button>
    <button type="button" class="card__btn complete" data-id="${idTask}">
    <img class="card__btn-svg" src="img/tick.svg" alt="complete" data-id="${idTask}">
    </button>
    </div>
    `;
  let category, name, description, time;
  category = newTask.querySelector(".card__category");
  name = newTask.querySelector(".card__name");
  description = newTask.querySelector(".card__description");
  time = newTask.querySelector(".card__finish-time");
  category.textContent = String(categoryTask);
  name.textContent = String(nameTask);
  description.textContent = String(descriptionTask);
  time.textContent = String(formatDatetime(finishTimeTaskDate));
  return newTask;
}

function emptyContainer(container) {
  container.innerHTML = "";
}

function notifyEmptyContainer(container) {
  if (container.innerHTML == "") {
    let p = document.createElement("p");
    p.classList.add("main__section-p");
    p.innerText = "No tienes tareas en esta categoría.";
    container.appendChild(p);
  }
}

function resetForm() {
  taskName.value = null;
  taskCategory.value = null;
  taskFinishTime.value = null;
  taskDescription.value = null;
  importanceCheckbox.checked = false;
  taskFormDisplay.classList.add("d-none");
}

function firstLetterCap(phrase) {
  return phrase.charAt(0).toUpperCase() + phrase.slice(1);
}

function formatDatetime(finishTimeTaskDate) {
  return `${finishTimeTaskDate.getDate().toString().padStart(2, "0")}/${(
    finishTimeTaskDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${finishTimeTaskDate.getFullYear()} ${finishTimeTaskDate
    .getHours()
    .toString()
    .padStart(2, "0")}:${finishTimeTaskDate
    .getMinutes()
    .toString()
    .padStart(2, "0")}hs`;
}

//TODO: Usar librería de Alerts para notificar que la tarea fue eliminada

function updateArrays() {
  pendingTasksArray = allTasksArray.filter((task) => task.completed == false);
  todayTasksArray = pendingTasksArray.filter((task) => {
    const currentDate = new Date();
    let finishTimeTaskDate = new Date(task.finishTime);
    if (
      currentDate.setHours(0, 0, 0, 0) ==
      finishTimeTaskDate.setHours(0, 0, 0, 0)
    ) {
      return true;
    } else {
      return false;
    }
  });
  importantTasksArray = pendingTasksArray.filter(
    (task) => task.importance == true
  );
  completedTasksArray = allTasksArray.filter((task) => task.completed == true);
}

document.addEventListener("DOMContentLoaded", function () {
  btnGenerateUser.addEventListener("pointerdown", async () => {
    const response = await fetch(generateUserURL);
    const data = await response.json();

    userName.value = data.results[0].name.first;
    userLastName.value = data.results[0].name.last;
    userEmail.value = data.results[0].email;
    userCountry.value = data.results[0].location.country;
  });

  userForm.addEventListener("submit", (e) => {
    e.preventDefault();

    nameUser = String(userName.value);
    lastNameUser = userLastName.value;
    emailUser = userEmail.value;
    countryUser = userCountry.value;
    termsCheck = termsCheckbox.checked;
    spanUserName.textContent = nameUser;
    registerBody.classList.toggle("d-none");
    header.classList.toggle("d-none");
    indexBody.classList.toggle("d-none");
  });
  // Función para mostrar el formulario de la tarea a añadir
  btnAddTask.addEventListener("pointerdown", function showTaskForm(e) {
    taskFormDisplay.classList.remove("d-none");
  });
  // Función para cerrar el formulario y resetear lo escrito
  btnCloseForm.addEventListener("pointerdown", function closeTaskForm(e) {
    resetForm();
  });
  // Función para añadir la tarea a los Arrays
  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const nameTask = taskName.value;
    const categoryTask = taskCategory.value;
    const descriptionTask = taskDescription.value;
    const importanceTask = importanceCheckbox.checked;
    const finishTimeTask = taskFinishTime.value;

    let newTask = new Task(
      taskId,
      nameTask,
      categoryTask,
      finishTimeTask,
      descriptionTask,
      importanceTask,
      false
    );
    allTasksArray.push(newTask);
    updateContainers();
    console.log("Todas");
    console.log(allTasksArray);
    console.log("Pendientes");
    console.log(pendingTasksArray);
    console.log("Hoy");
    console.log(todayTasksArray);
    console.log("Importantes");
    console.log(importantTasksArray);
    console.log("Completadas");
    console.log(completedTasksArray);
    // Aumento el valor de ID en 1 para diferenciar el siguiente objeto del objeto recién creado
    taskId++;
    btnSubmitTask.addEventListener("pointerdown", resetForm());
  });
});
