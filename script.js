const createTaskBtn = document.querySelector('.create-task-btn');
const allBtn = document.getElementById('all-btn');
const completedBtn = document.getElementById('completed-btn');
const pendingBtn = document.getElementById('pending-btn');
const sortBtn = document.getElementById('sort-btn');
const tasks = document.querySelector('.tasks');
const inputTask = document.querySelector('.input-task');
const taskTitle = document.getElementById('task-title');
const taskDescription = document.getElementById('task-description');
const radioButtons = document.querySelectorAll('input[type="radio"]');
const number = document.querySelector('.number');
const allNum = document.getElementById('all');
const completedNum = document.getElementById('completed');
const pendingNum = document.getElementById('pending');
const arrow = document.querySelector('.icon');
const buttons = document.querySelector('.buttons');
const selectedOption = document.querySelector(".selected-option");
const dropdownList = document.querySelector(".dropdown-list");
const container = document.querySelector(".container");

let taskList = JSON.parse(localStorage.getItem('tasks')) || [];
// Global variables to store original counts
let allTasksCount = 0;
let completedTasksCount = 0;

// Event Listeners

// Create a new task
createTaskBtn.addEventListener('click', () => {
    taskList = JSON.parse(localStorage.getItem('tasks')) || [];
    const title = taskTitle.value;
    if (title === '') {
        console.log('empty task');
        errorMessage.textContent = "Please fill in the task field";
        return;
    } else {
        errorMessage.textContent = "";
    }

    const description = taskDescription.value;
    let priority = '';

    // Find what priority got selected
    radioButtons.forEach(radio => {
        if (radio.checked) {
            priority = radio.value;
        }
    });
    const id = Math.floor(Math.random() * 10000) + 1;
    // Store info in localStorage
    const newTask = {
        title: title,
        description: description,
        priority: priority,
        completed: false,
        id: id
    }
    taskList.push(newTask);
    localStorage.setItem('tasks', JSON.stringify(taskList));
    displayAllTasks();

    // Clear the input fields
    taskTitle.value = '';
    taskDescription.value = ''; 
})

function adjustTextareaHeight() {
    var textarea = document.querySelector('.hidden-description');
    textarea.style.height = (textarea.scrollHeight) + 'px'; // Set the height to the scrollHeight
}

allBtn.addEventListener('click', displayAllTasks);

completedBtn.addEventListener('click', () => {
    const children = buttons.children;
    [...children].forEach(c => c.classList.remove('active'));
    completedBtn.classList.add('active');
    displayCompletedTasks();
});

pendingBtn.addEventListener('click', () => {
    displayPendingTasks();
    const children = buttons.children;
    [...children].forEach(c => c.classList.remove('active'));
    pendingBtn.classList.add('active');
});

sortBtn.addEventListener('click', displaySortedTasks);

// Function to display all the tasks
function displayAllTasks() {
    const children = buttons.children;
    [...children].forEach(c => c.classList.remove('active'));
    allBtn.classList.add('active');
    completedTasksCount = 0;
    allTasksCount = taskList.length;
    taskList.forEach(task => task.completed && completedTasksCount++);
    const completedTasks = taskList;
    displayFilteredTasks(completedTasks);
}

// Function to display completed tasks
function displayCompletedTasks() {
    const completedTasks = taskList.filter(task => task.completed);
    completedTasksCount = completedTasks.length;
    displayFilteredTasks(completedTasks);
}

// Function to display pending tasks
function displayPendingTasks() {
    const pendingTasks = taskList.filter(task => !task.completed);
    const completedTasks = taskList.length - pendingTasks.length;
    completedTasksCount = completedTasks;
    displayFilteredTasks(pendingTasks);
}

// Sort Tasks
// *Remember that i have afterbegin to display the tasks!!!
function displaySortedTasks () {
    const priorityMap = { low: 1, medium: 2, high: 3 };
    
    // Modifying the copy or original won't affect the other
    const sortedTasks = [...taskList];
    // The sort method takes a comparison function as an argument.
    sortedTasks.sort((task1, task2) => {
        // If a negative value is returned, it means that task1 should come before task2 in the sorted 
        // array. If zero is returned, the order remains unchanged, and if a positive value is returned, 
        // task1 should come after task2.
        return priorityMap[task1.priority] - priorityMap[task2.priority];
    });
    allTasksCount = 0;
    completedTasksCount = 0;
    allTasksCount = taskList.length;
    taskList.forEach(task => task.completed && completedTasksCount++);
    displayFilteredTasks(sortedTasks);
    const children = buttons.children;
    [...children].forEach(c => c.classList.remove('active'));
    sortBtn.classList.add('active');
}

function displayFilteredTasks(filteredTasks) {
    tasks.innerHTML = '';
    let completedTasks = 0;

    filteredTasks.forEach((task, i) => {
        let borderColor = '';

        // Determine border color based on priority
        switch (task.priority) {
            case 'high':
                borderColor = '#FF6F61';
                break;
            case 'medium':
                borderColor = '#FFD700';
                break;
            case 'low':
                borderColor = '#ADFF2F';
                break;
            default:
                borderColor = 'black';
        }

        const taskHtml = `
        <div class="task ${task.completed ? 'completed' : ''}" data-index="${task.id}" style="border: 2px solid ${borderColor};">
            
            <!-- added the checked class for the line-through style -->
            <label class="custom-checkbox ${task.completed ? 'completed' : ''}">
                <input class="checkbox" type="checkbox" ${task.completed ? 'checked' : ''}>
                <span class="checkmark"></span>
            </label>
            <input type="text" class="input-task" value="${task.title}" disabled>
            
            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke-width="1.5" 
                stroke="currentColor" 
                id="arrow-down"
                class="icon visible">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>

            <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke-width="1.5" 
                stroke="currentColor"
                id="arrow-up" 
                class="icon hidden hide">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>

            <div class="hidden-box">
                <label class="notes-label">Notes:</label>
                <p class="no-notes">${task.description ? '' : 'No notes'}</p>
                <textarea class="hidden-description" disabled>${task.description}</textarea>
                <p class="hidden-priority">Priority:</p>
                <div class="radio-container">
                    <input type="radio" id="high-${i}" name="priority-${i}" value="high" ${task.priority === 'high' ? 'checked' : ''}>
                    <label for="high-${i}" style="font-size: 1.6rem;">High</label>

                    <input type="radio" id="medium-${i}" name="priority-${i}" value="medium" ${task.priority === 'medium' ? 'checked' : ''}>
                    <label for="medium-${i}" style="font-size: 1.6rem;">Medium</label>

                    <input type="radio" id="low-${i}" name="priority-${i}" value="low" ${task.priority === 'low' ? 'checked' : ''}>
                    <label for="low-${i}" style="font-size: 1.6rem;">Low</label>
                </div>
                <div class="action-buttons">
                    <button data-index="${task.id}" class="edit btn">EDIT</button>
                    <button data-index="${task.id}" class="delete btn">DELETE</button>
                </div>
            </div>
        </div>
        `;
        tasks.insertAdjacentHTML('afterbegin', taskHtml);
        task.completed && completedTasks++;
        adjustTextareaHeight();
    });
    allNum.textContent = allTasksCount;
    completedNum.textContent = completedTasksCount;
    pendingNum.textContent = allTasksCount - completedTasksCount;
}

displayAllTasks();
// Function to handle item click
function handleItemClick(event) {
    if (event.target.tagName === "LI") {
        
        // Update the selected option text
        selectedOption.textContent = event.target.textContent;

        // Close the dropdown
        // dropdownList.style.display = "none";
        dropdownList.classList.remove("show");
        container.classList.remove("dropdown-shown");
        const selectedValue = selectedOption.textContent;
        switch (selectedValue) {
            case 'All':
                displayAllTasks();
                break;
            case 'Completed':
                displayCompletedTasks();
                break;
            case 'Pending':
                displayPendingTasks();
                break;
            case 'Sort':
                displaySortedTasks();
                break;
        }
    }
}

dropdownList.addEventListener("click", handleItemClick);

document.querySelector(".custom-dropdown").addEventListener("mouseenter", function() {
    // Show the dropdown by adding the "show" class
    dropdownList.classList.add("show");
    container.classList.add("dropdown-shown");
});
    
// Hide the dropdown list when the container is not hovered
document.querySelector(".custom-dropdown").addEventListener("mouseleave", function() {
    // Hide the dropdown by removing the "show" class
    dropdownList.classList.remove("show");
    container.classList.remove("dropdown-shown");
});

function checkActive() {
    const buttonsChildren = buttons.children;
    [...buttonsChildren].forEach((button, index) => {
      if (button.classList.contains('active')) {
        // You can use index + 1 or button.textContent to get the button text or index
        switch (index) {
            case 0:
                displayAllTasks();
                break;
            case 1:
                displayCompletedTasks();
                break;
            case 2:
                displayPendingTasks();
                break;
            case 3:
                displaySortedTasks();
                break;
        }
      }
    });
}

function checkActiveMobile() {
    const value = selectedOption.textContent;
    switch (value) {
        case 'All':
            displayAllTasks();
            break;
        case 'Completed':
            displayCompletedTasks();
            break;
        case 'Pending':
            displayPendingTasks();
            break;
        case 'Sort':
            displaySortedTasks();
            break;
    }
}

// Edit, Delete, and Complete/Uncomplete Actions
tasks.addEventListener('click', (event) => {
    const editButton = event.target.closest('.edit');
    const deleteButton = event.target.closest('.delete');
    const checkbox = event.target.closest('.checkbox');

    if (editButton) {
        handleEditAction(editButton);
    } else if (deleteButton) {
        handleDeleteAction(deleteButton);
    } else if (checkbox) {
        handleCheckboxAction(checkbox);
    }
});

// Function to handle the Edit action
function handleEditAction(editButton) {
    const id = editButton.getAttribute('data-index');
    const taskIndex = taskList.findIndex(task => task.id === Number(id));

    if (taskIndex !== null) {
        const taskElement = editButton.closest('.task');
        const inputField = taskElement.querySelector('.input-task');
        const textArea = taskElement.querySelector('.hidden-description');

        inputField.disabled = !inputField.disabled;
        textArea.disabled = !textArea.disabled;

        // Change the button text to 'Save'
        editButton.textContent = inputField.disabled ? 'EDIT' : 'SAVE';

        if (!inputField.disabled) {
            inputField.style.borderBottom = '1px solid black';
            textArea.classList.add('notDisabled');
        } else {
            if (textArea.value === '') {
                document.querySelector('.no-notes').innerHTML = 'No notes';
            } else {
                document.querySelector('.no-notes').innerHTML = '';
            }

            inputField.style.borderBottom = 'none';
            textArea.classList.remove('notDisabled');
            adjustTextareaHeight();

            taskList[taskIndex].title = inputField.value;
            taskList[taskIndex].description = textArea.value;
            localStorage.setItem('tasks', JSON.stringify(taskList));
        }
    }
}

// Function to handle the Delete action
function handleDeleteAction(deleteButton) {
    const id = deleteButton.getAttribute('data-index');
    const taskIndex = taskList.findIndex(task => task.id === Number(id));

    if (taskIndex !== null) {
        taskList.splice(taskIndex, 1);
        localStorage.setItem('tasks', JSON.stringify(taskList));
        displayAllTasks(); // Update the displayed tasks after deletion
    }
}

// Function to handle the Completed/Uncompleted action
function handleCheckboxAction(checkbox) {
    const id = checkbox.closest('.task').getAttribute('data-index');
    const taskIndex = taskList.findIndex(task => task.id === Number(id));

    if (taskIndex !== null) {
        const isChecked = checkbox.checked;
        const taskElement = checkbox.closest('.task');
        const checkboxElement = taskElement.querySelector('.custom-checkbox');

        isChecked ? checkboxElement.classList.add('completed') : checkboxElement.classList.remove('completed');
        isChecked ? taskElement.style.opacity = '0.4' : taskElement.style.opacity = '1';
        taskList[taskIndex].completed = isChecked;
        localStorage.setItem('tasks', JSON.stringify(taskList));
        const computedStyle = window.getComputedStyle(buttons);
        const displayStyle = computedStyle.display;
        displayStyle === 'flex' ? checkActive() : checkActiveMobile();
    }
}

// Edit task priority
tasks.addEventListener('change', (event) => {
    if (event.target.matches('input[type="radio"]')) {
        const taskElement = event.target.closest('.task');
        if (taskElement) {
            const taskIndex = taskElement.getAttribute('data-index');
            const selectedValue = event.target.value;
            taskList[taskIndex].priority = selectedValue;
            localStorage.setItem('tasks', JSON.stringify(taskList));
        }
    }
})

// Arrow animation
tasks.addEventListener('click', (event) => {
    const taskElement = event.target.closest('.task');
    if (taskElement) {
        const icon = taskElement.querySelector('.icon');
        if (icon && event.target === icon) {
            const hiddenBox = taskElement.querySelector('.hidden-box');

            ['arrow-up', 'arrow-down'].forEach(id => {
                const element = taskElement.querySelector(`#${id}`);
                element.classList.toggle('hidden');
            });

            if (hiddenBox) {
                const isVisible = hiddenBox.classList.contains('visible');

                if (isVisible) {
                    hiddenBox.style.maxHeight = '0';
                    hiddenBox.classList.remove('visible');
                } else {
                    hiddenBox.classList.add('visible');
                    hiddenBox.style.maxHeight = hiddenBox.scrollHeight + 'px';
                }
            }
        }
    }
});
