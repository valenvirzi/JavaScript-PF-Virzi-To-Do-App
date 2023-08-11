// Declaración de variables para identificar los elementos del documento
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

    deleteButtons.forEach((btn) => btn.addEventListener("click", deleteElementFromContainer));

    completeButtons.forEach((btn) => btn.addEventListener("click", setElementToCompleted));

    // deleteButtons.forEach((btn) => {
    //   btn.addEventListener("click", function deleteElementFromContainer(e) {
    //     const btn = e.target;
    //     const taskId = btn.getAttribute("data-id");
    //     const indexTaskToDelete = allTasksArray.findIndex(
    //       (task) => task.id.toString() == taskId
    //     );
    //     if (indexTaskToDelete !== -1) {
    //       allTasksArray.splice(indexTaskToDelete, 1);
    //     }
    //     updateContainers();
    //     console.log(allTasksArray);
    //   });
    // });

    // completeButtons.forEach((btn) => {
    //   btn.addEventListener("click", function setElementToCompleted(e) {
    //     const btn = e.target;
    //     const taskId = btn.getAttribute("data-id");
    //     const indexTaskToComplete = allTasksArray.findIndex(
    //       (task) => task.id.toString() == taskId
    //     );
    //     if (indexTaskToComplete !== -1) {
    //       allTasksArray[indexTaskToComplete].completed = true;
    //     }
    //     updateContainers();
    //     console.log(allTasksArray);
    //   });
    // });
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
  // TODO: Asegurarse de que el HTML de la Tarea coincida con la version de abajo
  newTask.innerHTML = `
    <div class="card__color"></div>
    <div class="card__body">
    <h5 class="card__category">${categoryTask}</h5>
    <h4 class="card__name">${nameTask}</h4>
    <div class="card__div">
    <img class="card__svg" src="img/clock.svg" alt="clock">
    <p class="card__p">
    <span class="card__finish-time">${formatDatetime(finishTimeTaskDate)}</span>
    </p>
    </div>
    <div class="card__div">
    <img class="card__svg desc-svg" src="img/paragraph.svg" alt="description">
    <p class="card__p">
    <span class="card__description">${descriptionTask}</span>
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
  return newTask;
}

// Función para encontrar y borrar el objeto del array, eliminándolo del DOM
// function deleteElementFromContainer(e) {
//   const btn = e.target;
//   const taskId = btn.getAttribute("data-id");
//   const indexTaskToDelete = allTasksArray.findIndex(task => task.id.toString() === taskId);
//   if (indexTaskToDelete !== -1) {
//     allTasksArray.splice(indexTaskToDelete, 1);
//   }
//   updateContainers();
// }

// function setElementToCompleted(e) {
//   const btn = e.target;
//   const taskId = btn.getAttribute("data-id");
//   const indexTaskToDelete = allTasksArray.findIndex(task => task.id.toString() === taskId);
//   if (indexTaskToDelete !== -1) {
//     allTasksArray[indexTaskToDelete].completed = true;
//   }
//   updateContainers();
// }

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

//TODO: Crear función que tome las Tareas de los diferentes Arrays y les haga Append en los respectivos contenedores según su Array
//TODO: Crear función que itere por los arrays y vaya añadiendo los elementos a los respectivos contenedores

//TODO: Encontrar la manera de que el botón de ELIMINAR de cada Tarea remueva la Tarea del Array principal y actualice TODOS los Arrays para dejar de mostrar la Tarea Eliminada

//TODO: Encontrar la manera de que el botón de COMPLETAR de cada Tarea remueva la Tarea del Array de Pendientes, lo Añada al Array de Completadas & actualice TODOS los Arrays para mostrar la Tarea Completada en la sección de Tareas Completadas

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
  // Función para mostrar el formulario de la tarea a añadir
  btnAddTask.addEventListener("click", function showTaskForm(e) {
    taskFormDisplay.classList.remove("d-none");
  });
  // Función para cerrar el formulario y resetear lo escrito
  btnCloseForm.addEventListener("click", function closeTaskForm(e) {
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
    btnSubmitTask.addEventListener("click", resetForm());
  });
});
// console.log("Todas");
// console.log(allTasksArray);
// console.log("Pendientes");
// console.log(pendingTasksArray);
// console.log("Hoy");
// console.log(todayTasksArray);
// console.log("Importantes");
// console.log(importantTasksArray);
// console.log("Completadas");
// console.log(completedTasksArray);
