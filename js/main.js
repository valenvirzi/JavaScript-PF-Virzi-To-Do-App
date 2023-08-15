/*
El proyecto se trata de un mánager de tareas para el día a día,
se me ocurrió la idea de instanciar los objetos "Tarea" en base a una clase creada para construirlos e ir almacenándolos en un Array principal en el que se guardarían todas las tareas.
Cada objeto Tarea tiene ciertas propiedades que luego serviran para filtrarlas y así formar nuevos Arrays a partir de los cuales cargar el DOM:
Arrays:
- Pendientes (En general): Todas las tareas cuya propiedad "completed" sea igual a "false", el cual será el estado inicial de todas las tareas creadas.
- Pendientes para hoy (Basado en "Pendientes"): Todas las tareas cuya tiempo de finalización coincida con la fecha actual, sin importar la hora.
- Importantes (Basado en "Pendientes"): Todas las tareas que hayan sido marcadas como importantes en su formulario de creación.
- Completadas: Todas las tareas que hayan sido marcadas como completadas luego de su creación.
[Todos los arrays son creados con el método Filter en base a algún otro array]

A continuación dejaré comentarios solo para mencionar el accionar de cada función o la identificación de algún otro detalle relevante.
*/

// Declaración de variables para identificar los elementos del documento
// Dark Mode
const btnSwitchTheme = document.getElementById("btnSwitchTheme");
let darkMode;
const body = document.querySelector(".body");
const indexTitle = document.querySelector(".main__welcome-h1");
const registerTitle = document.querySelector(".register-main__h1");
const taskFormTitle = document.querySelector(".form-div__title");
const taskFormDiv = document.querySelector(".main__form-div");
const indexH2 = document.querySelector(".agenda__intro-h2");
const lightBulb = document.getElementById("lightBulb");
const darkBulb = document.getElementById("darkBulb");
// Usuario
let nameUser, lastNameUser, emailUser, countryUser, termsCheck;
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
// Display
const header = document.querySelector(".header");
const indexBody = document.querySelector(".index-body");
const footer = document.querySelector(".footer");
// Tareas
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

// Clase Tarea para la construcción del objeto Tarea
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
// Función para encontrar y cambiar la propiedad "completed" del objeto encontrado, mostrándolo en la sección correspondiente

function setElementToCompleted(e) {
  const btn = e.target;
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

// Función para crear y añadir las tareas al elemento contenedor, en base a su respectivo array, para ser mostrado en el DOM
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
    const completeButtons = document.querySelectorAll(".complete");

    deleteButtons.forEach((btn) =>
      btn.addEventListener("pointerdown", deleteElementFromContainer)
    );

    completeButtons.forEach((btn) =>
      btn.addEventListener("pointerdown", setElementToCompleted)
    );
  });
  notifyEmptyContainer(taskContainer);
}

// Función para actualizar el contenido de los elementos contenedores de las tareas en el DOM, se llama cada vez que se realiza un cambio
function updateContainers() {
  updateArrays();
  appendTasksToContainer(pendingTasksArray, pendingTaskContainer);
  appendTasksToContainer(todayTasksArray, todayTaskContainer);
  appendTasksToContainer(importantTasksArray, importantTaskContainer);
  appendTasksToContainer(completedTasksArray, completedTaskContainer);
}

// Función para crear el elemento Tarea, en base a las propiedades del objeto Tarea, para luego poder ser agregado al contenedor correspondiente
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

// Función para vaciar el contenido del elemento contenedor en el DOM
function emptyContainer(container) {
  container.innerHTML = "";
}

// Fonción para mostrar un texto en caso de que el contenedor no posea ningún elemento Tarea en su interior
function notifyEmptyContainer(container) {
  if (container.innerHTML == "") {
    let p = document.createElement("p");
    p.classList.add("main__section-p");
    p.innerText = "No tienes tareas en esta categoría.";
    container.appendChild(p);
  }
}

// Función pára borrar la información ingresada en el formulario de creación de tareas
function resetForm() {
  taskName.value = null;
  taskCategory.value = null;
  taskFinishTime.value = null;
  taskDescription.value = null;
  importanceCheckbox.checked = false;
  taskFormDisplay.classList.add("d-none");
}

// Función para que el texto ingresado en el formulario de creación de tareas comience siempre con el primer caracter en mayuscula
function firstLetterCap(phrase) {
  return phrase.charAt(0).toUpperCase() + phrase.slice(1);
}

// Función para cambiar el formato en que se muestra la fecha para poder hacerlo de forma más clara
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

/*
Swal.fire({
  title: "¿Seguro que que quieres eliminar la Tarea?",
  text: "¡No podrás revertirlo!",
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#57cc99",
  cancelButtonColor: "#d33",
  confirmButtonText: "Sí, deseo eliminarla",
  cancelButtonText: "Cancelar",
}).then((result) => {
  if (result.isConfirmed) {
    Swal.fire("Tarea Elminada", "La tarea ha sido eliminada.", "success");
  }
});
*/

// Función para actualizar los datos contenidos por los Arrays, en base al Array Principal
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

// Función para cambiar el tema de de la página
function switchTheme(darkMode) {
  if (darkMode == true && body.classList.contains("body__dark")) {
    return;
  } else if (darkMode == true) {
    body.classList.add("body__dark");
    indexTitle.classList.add("main__welcome-h1__dark");
    registerTitle.classList.add("register-main__h1__dark");
    taskFormTitle.classList.add("form-div__title__dark");
    taskFormDiv.classList.add("main__form-div__dark");
    indexH2.classList.add("agenda__intro-h2__dark");
    lightBulb.classList.remove("d-none");
    darkBulb.classList.add("d-none");
  } else {
    body.classList.remove("body__dark");
    indexTitle.classList.remove("main__welcome-h1__dark");
    registerTitle.classList.remove("register-main__h1__dark");
    taskFormTitle.classList.remove("form-div__title__dark");
    taskFormDiv.classList.remove("main__form-div__dark");
    indexH2.classList.remove("agenda__intro-h2__dark");
    lightBulb.classList.add("d-none");
    darkBulb.classList.remove("d-none");
  }
  localStorage.setItem("dark", JSON.stringify(darkMode));
}

document.addEventListener("DOMContentLoaded", function () {
  let darkModeLS = localStorage.getItem("dark");
  darkMode = JSON.parse(darkModeLS);
  switchTheme(darkMode);

  // Utilización de la API de Generación Aleatoria de Usuarios, para poder generar un Usuario para la aplicación rápidamente
  btnGenerateUser.addEventListener("pointerdown", async () => {
    const response = await fetch(generateUserURL);
    const data = await response.json();

    userName.value = data.results[0].name.first;
    userLastName.value = data.results[0].name.last;
    userEmail.value = data.results[0].email;
    userCountry.value = data.results[0].location.country;
  });

  // Utilización de la información proveída por el Formulario de Registro, en este caso utilizo sólo el nombre del usuario para luego darle la bienvenida, pero toda esta información puede ser usada para la creación de un usuario real y su posterior almacenamiento euna base de datos
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
    footer.classList.toggle("d-none");
  });

  // Botón de cambio de Tema
  btnSwitchTheme.addEventListener("pointerdown", (e) => {
    darkMode = !darkMode;
    switchTheme(darkMode);
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
    // Creación del objeto Tarea
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
    // Aumento el valor de ID en 1 para diferenciar el siguiente objeto del objeto recién creado
    taskId++;
    btnSubmitTask.addEventListener("pointerdown", resetForm());
  });
});
