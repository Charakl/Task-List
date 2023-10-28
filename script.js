const createTaskBtn = document.querySelector('.create-task-btn');
const allBtn = document.getElementById('all-btn');
const completedBtn = document.getElementById('completed-btn');
const pendingBtn = document.getElementById('pending-btn');
const sortBtn = document.getElementById('sort-btn');
const tasks = document.querySelector('.tasks');

const taskTitle = document.getElementById('task-title');
const taskDescription = document.getElementById('task-description');
const radioButtons = document.querySelectorAll('input[type="radio"]');

let taskList = JSON.parse(localStorage.getItem('tasks')) || [];

// Event Listeners
createTaskBtn.addEventListener('click', () => {
    // taskList = JSON.parse(localStorage.getItem('tasks')) || [];

    const title = taskTitle.value;
    const description = taskDescription.value;
    
    let priority = '';

    // Find what priority got selected
    radioButtons.forEach(radio => {
        // radio.addEventListener('change', function() {
            if (radio.checked) {
                console.log('Selected priority: ' + radio.value);
                priority = radio.value;
            }
        // });
    });

    // Store info in localStorage

    const newTask = {
        title: title,
        description: description,
        priority: priority,
        completed: false
    }
    taskList.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    // updateLocalStorage(taskList);

    // console.log(taskList);
    displayTasks();
    
})

// function updateLocalStorage(taskList) {
//     console.log('sodfh');
//     localStorage.setItem('tasks', JSON.stringify(taskList));
// }

function displayTasks() {
    tasks.innerHTML = '';
    // Get info from localStorage
    taskList = JSON.parse(localStorage.getItem('tasks'));
    // ssconsole.log(taskList);
    taskList.forEach((task, i) => {
        const taskHtml = `
        <div class="task">
            <input type="text" placeholder="${task.title}">
            <button data-index="${i}" class="edit btn">EDIT</button>
            <button data-index="${i}" class="delete btn">DELETE</button>
        </div>
        `;
        tasks.insertAdjacentHTML('afterbegin', taskHtml);
    })

}
displayTasks();


// Attach a click event listener to the tasks container (Event delegation)
// Delete task
tasks.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete')) {
        // Find the index of the task to delete
        const taskIndex = event.target.getAttribute('data-index');
        console.log(taskIndex);
        if (taskIndex !== null) {
            // Delete the task and update the UI and local storage
            taskList.splice(taskIndex, 1);
            console.log(taskList);
            // updateTaskList();
            localStorage.setItem('tasks', JSON.stringify(taskList));
            // updateLocalStorage(taskList);
            displayTasks(); // Update the displayed tasks after deletion
        }
    }
});
