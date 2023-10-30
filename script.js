const createTaskBtn = document.querySelector('.create-task-btn');
const allBtn = document.getElementById('all-btn');
const completedBtn = document.getElementById('completed-btn');
const pendingBtn = document.getElementById('pending-btn');
const sortBtn = document.getElementById('sort-btn');
const tasks = document.querySelector('.tasks');

const taskTitle = document.getElementById('task-title');
const taskDescription = document.getElementById('task-description');
const radioButtons = document.querySelectorAll('input[type="radio"]');

const number = document.querySelector('.number');

const allNum = document.getElementById('all');
const completedNum = document.getElementById('completed');
const pendingNum = document.getElementById('pending');

let taskList = JSON.parse(localStorage.getItem('tasks')) || [];

// Global variables to store original counts
let allTasksCount = 0;
let completedTasksCount = 0;

// Event Listeners
createTaskBtn.addEventListener('click', () => {
    taskList = JSON.parse(localStorage.getItem('tasks')) || [];
    console.log('lalal');

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
    console.log(taskList);
    console.log(newTask);
    taskList.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(taskList));

    

    displayAllTasks();

    // Clear the input fields
    taskTitle.value = '';
    taskDescription.value = '';
    
})

allBtn.addEventListener('click', () => {
    displayAllTasks();
    setButtonSelected('all');
});

completedBtn.addEventListener('click', () => {
    displayCompletedTasks();
    setButtonSelected('completed');
});

pendingBtn.addEventListener('click', () => {
    displayPendingTasks();
    setButtonSelected('pending');
});


// Function to display all the tasks
function displayAllTasks() {
    allTasksCount = 0;
    completedTasksCount = 0;
    allTasksCount = taskList.length;
    taskList.forEach(task => task.completed && completedTasksCount++);
     
    const completedTasks = taskList;
    displayFilteredTasks(completedTasks);
}

// Function to display completed tasks
function displayCompletedTasks() {
    const completedTasks = taskList.filter(task => task.completed);
    displayFilteredTasks(completedTasks);
}

// Function to display pending tasks
function displayPendingTasks() {
    const pendingTasks = taskList.filter(task => !task.completed);
    displayFilteredTasks(pendingTasks);
}

function displayFilteredTasks(filteredTasks) {
    tasks.innerHTML = '';
    let completedTasks = 0;
    filteredTasks.forEach((task, i) => {
        const taskHtml = `
        <div class="task ${task.completed ? 'completed' : ''}">
            <label class="custom-checkbox">
                <input type="checkbox" ${task.completed ? 'checked' : ''}>
                <span class="checkmark"></span>
            </label>
            <input type="text" class="input-task" value="${task.title}" disabled>
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke-width="1.5" 
                stroke="currentColor" 
                class="icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
            <div class="hidden-box">
                <p class="hidden-description">Notes: ${task.description}</p>
                <p class="hidden-priority">Priority: ${task.priority}</p>
                <div class="action-buttons">
                    <button data-index="${i}" class="edit btn">EDIT</button>
                    <button data-index="${i}" class="delete btn">DELETE</button>
                </div>
            </div>

        </div>
        `;
        tasks.insertAdjacentHTML('afterbegin', taskHtml);
        task.completed && completedTasks++;

        // Need to study about event delegation

    });

    allNum.textContent = allTasksCount;
    completedNum.textContent = completedTasksCount;
    pendingNum.textContent = allTasksCount - completedTasksCount;
}


displayAllTasks();

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
            displayAllTasks(); // Update the displayed tasks after deletion
        }
    }
});



// Attach a click event listener to the tasks container (Event delegation)
// Show/hide additional task details
tasks.addEventListener('click', (event) => {
    const taskElement = event.target.closest('.task');

    if (taskElement) {
        const hiddenBox = taskElement.querySelector('.hidden-box');

        // if (hiddenBox) {
            const isVisible = hiddenBox.classList.contains('visible');

            if (isVisible) {
                hiddenBox.style.maxHeight = '0'; // Set max-height to 0 to hide the box
                hiddenBox.classList.remove('visible');
            } else {
                hiddenBox.classList.add('visible');
                hiddenBox.style.maxHeight = hiddenBox.scrollHeight + 'px'; // Set max-height to the actual height
            }
        // }
    }
});