// Haetaan HTML-elementit
const onHoldTasks = document.getElementById("on-hold-tasks");
const addTaskBtn = document.getElementById("add-task-btn");
const completedTasks = document.getElementById("completed-tasks");
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskError = document.getElementById("task-error");
const totalTasks = document.getElementById("totalTasks");

// Haetaan tallennetut tehtävät tai luodaan tyhjä taulukko
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Tallennetaan tehtävät selaimeen
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Uuden tehtävän lisääminen
function addTask() {

    // Luetaan käyttäjän kirjoittama teksti
    const title = taskInput.value.trim();

    // Tyhjennetään aikaisemmat virheet
    taskError.textContent = "";
    taskInput.classList.remove("input-error");

    // Tarkistetaan tyhjä syöte
    if (title === "") {
        taskError.textContent = "Task cannot be empty.";
        taskInput.classList.add("input-error");
        return;
    }

    // Tarkistetaan liian lyhyt syöte
    if (title.length < 3) {
        taskError.textContent = "Task must contain at least 3 characters.";
        taskInput.classList.add("input-error");
        return;
    }

    // Luodaan uusi tehtävä
    const newTask = {
        id: Date.now(),
        title: title,
        completed: false
    };

    // Lisätään tehtävä taulukkoon
    tasks.push(newTask);

    updateTotalTasks();

    // Tallennetaan tehtävät LocalStorageen
    saveTasks();

    // Lisätään tehtävä verkkosivulle
    appendTaskToDOM(newTask);

    // Tyhjennetään syötekenttä
    taskInput.value = "";

    // Tulostetaan tehtävät konsoliin
    console.log(tasks);
}


// Tehtäväkortin luominen
function appendTaskToDOM(task) {

    // Luodaan tehtäväkortti
    const taskItem = document.createElement("div");
    taskItem.className = "task-item";

    // Luodaan checkbox
    const checkbox = document.createElement("div");
    checkbox.className = "task-checkbox";

    // Luodaan tehtävän nimi
    const taskTitle = document.createElement("div");
    taskTitle.className = "task-title";
    taskTitle.textContent = task.title;

    // Luodaan poistopainike
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "icon-btn";
    deleteBtn.type = "button";
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';

    // Lisätään elementit tehtäväkorttiin
    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskTitle);
    taskItem.appendChild(deleteBtn);

    // Näytetään tehtävä oikeassa osiossa
    if (task.completed) {
        completedTasks.appendChild(taskItem);
        checkbox.classList.add("checked");
        taskTitle.classList.add("checked");
    } else {
        onHoldTasks.appendChild(taskItem);
    }


    // VALINTARUUDUN TOIMINTA
    checkbox.addEventListener("click", function() {

        // Vaihdetaan tehtävän valmistumistila
        task.completed = !task.completed;

        // Tallennetaan muutos
        saveTasks();

        // Muutetaan checkboxin ulkoasua
        checkbox.classList.toggle("checked");

        // Yliviivataan tehtävän nimi
        taskTitle.classList.toggle("checked");

        // Siirretään tehtävä oikeaan osioon
        if (task.completed) {
            completedTasks.appendChild(taskItem);
        } else {
            onHoldTasks.appendChild(taskItem);
        }

    });


    // POISTOPAINIKKEEN TOIMINTA
    deleteBtn.addEventListener("click", function() {

        // Kysytään vahvistus
        const confirmed = confirm("Delete this task?");

        if (!confirmed) {
            return;
        }

        // Poistetaan tehtävä taulukosta
        tasks = tasks.filter(function(item) {
            return item.id !== task.id;
        });

        // Tallennetaan muutos
        saveTasks();

        updateTotalTasks();

        // Poistetaan tehtäväkortti sivulta
        taskItem.remove();

    });

}


// LOMAKKEEN TOIMINTA
taskForm.addEventListener("submit", function(event) {

    // Estetään sivun uudelleenlataus
    event.preventDefault();

    // Lisätään uusi tehtävä
    addTask();

});


// VIRHEILMOITUKSEN POISTAMINEN KIRJOITETTAESSA
taskInput.addEventListener("input", function() {

    taskError.textContent = "";
    taskInput.classList.remove("input-error");

});


// NÄYTETÄÄN TALLENNETUT TEHTÄVÄT SIVUN LATAUTUESSA
tasks.forEach(function(task) {
    appendTaskToDOM(task);
});

// Päivitetään tehtävien kokonaismäärä
function updateTotalTasks() {
    totalTasks.textContent = tasks.length;
}
updateTotalTasks();