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
const importantCheckbox = document.getElementById("importantCheckbox");
const btnSubmitTask = document.getElementById("btnSubmitTask");
const btnCloseForm = document.getElementById("btnCloseForm");

function resetForm() {
  taskName.value = null;
  taskCategory.value = null;
  taskFinishTime.value = null;
  taskDescription.value = null;
  importantCheckbox.checked = false;
  taskFormDisplay.classList.add("d-none");
}

function firstLetterCap(phrase) {
  return phrase.charAt(0).toUpperCase() + phrase.slice(1);
}

TODO:
function formatDatetime() {}

function createTaskElement(
  nameTask,
  categoryTask,
  finishTimeTask,
  descriptionTask,
  importantTask
) {
  nameTask = firstLetterCap(nameTask);
  categoryTask = firstLetterCap(categoryTask);
  descriptionTask = firstLetterCap(descriptionTask);
  const newTask = document.createElement("li");
  newTask.classList.add("card");
  newTask.innerHTML = `
    <div class="card__color"></div>
    <div class="card__body">
        <h5 class="card__category">${categoryTask}</h5>
        <h4 class="card__name">${nameTask}</h4>
        <div class="card__div">
            <img class="card__svg" src="img/clock.svg" alt="clock">
            <p class="card__p">
                <span class="card__finish-time">${finishTimeTask}</span>
            </p>
        </div>
        <div class="card__div">
            <img class="card__svg desc-svg" src="img/paragraph.svg" alt="description">
            <p class="card__p">
                <span class="card__description">${descriptionTask}</span>
            </p>
        </div>
        <button type="button" class="card__btn close">
            <img class="card__btn-svg" src="img/close-x.svg" alt="close">
        </button>
        <button type="button" class="card__btn complete">
            <img class="card__btn-svg" src="img/tick.svg" alt="complete">
        </button>
    </div>
    `;
  return newTask;
}

document.addEventListener("DOMContentLoaded", function () {
  // Función para mostrar el formulario de la tarea a añadir
  btnAddTask.addEventListener("pointerdown", function showTaskForm(e) {
    taskFormDisplay.classList.remove("d-none");
  });
  // Función para cerrar el formulario y resetear lo escrito
  btnCloseForm.addEventListener("pointerdown", function closeTaskForm(e) {
    resetForm();
  });
  // Función para añadir la tarea al documento
  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const nameTask = taskName.value;
    const categoryTask = taskCategory.value;
    const finishTimeTask = taskFinishTime.value;
    const descriptionTask = taskDescription.value;
    const importantTask = importantCheckbox.checked;

    todayTaskContainer.appendChild(
      createTaskElement(
        nameTask,
        categoryTask,
        finishTimeTask,
        descriptionTask,
        importantTask
      )
    );
    btnSubmitTask.addEventListener("pointerdown", resetForm());
  });
});
