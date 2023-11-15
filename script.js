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
    const children = buttons.children;
    [...children].forEach(c => c.classList.remove('active'));
    allBtn.classList.add('active');
    // setButtonSelected('all');

});

completedBtn.addEventListener('click', () => {
    displayCompletedTasks();
    const children = buttons.children;
    [...children].forEach(c => c.classList.remove('active'));
    completedBtn.classList.add('active');

    // setButtonSelected('completed');
});

pendingBtn.addEventListener('click', () => {
    displayPendingTasks();
    const children = buttons.children;
    [...children].forEach(c => c.classList.remove('active'));
    pendingBtn.classList.add('active');
    // setButtonSelected('pending');
});

function adjustTextareaHeight() {
    var textarea = document.querySelector('.hidden-description');
    // textarea.style.height = 'auto'; // Reset height to auto
    textarea.style.height = (textarea.scrollHeight) + 'px'; // Set the height to the scrollHeight
    
}


// Function to display all the tasks
function displayAllTasks() {
    allTasksCount = 0;
    completedTasksCount = 0;
    allTasksCount = taskList.length;
    taskList.forEach(task => task.completed && completedTasksCount++);
    // hiddenDescription.style.height = hiddenDescription.scrollHeight + 'px';
     
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
        <div class="task ${task.completed ? 'completed' : ''}" data-index="${i}">
            
            <label class="custom-checkbox">
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
                <textarea class="hidden-description" placeholder="Description" disabled>${task.description}</textarea>
                <p class="hidden-priority">Priority:</p>
                <div class="radio-container">
                    <input type="radio" id="high-${i}" name="priority-${i}" value="high" ${task.priority === 'high' ? 'checked' : ''}>
                    <label for="high-${i}">High</label>

                    <input type="radio" id="medium-${i}" name="priority-${i}" value="medium" ${task.priority === 'medium' ? 'checked' : ''}>
                    <label for="medium-${i}">Medium</label>

                    <input type="radio" id="low-${i}" name="priority-${i}" value="low" ${task.priority === 'low' ? 'checked' : ''}>
                    <label for="low-${i}">Low</label>
                </div>
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
        adjustTextareaHeight();

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

// Complete/Uncomplete task

// Event Delegation 
// The event listener is attached to the tasks element. It listens for the 'change' event bubbling up from 
// its children. When a change event occurs within the tasks element or its children, the function is 
// triggered. The function then checks if the event target (the element that triggered the event) has 
// the class 'checkbox'. This allows you to selectively respond to change events specifically on elements 
// with the 'checkbox' class.

// This is a form of event delegation because the parent element (tasks) is handling events on behalf of 
// its children, allowing you to control or manipulate certain elements based on specific conditions without 
// attaching individual event listeners to each child element. Event delegation can improve performance and 
// makes your code more maintainable, especially when dealing with a large number of elements.

// The concept of delegation is related to entrusting tasks or responsibilities to another person or 
// entity. In the context of programming and events (as in event delegation), it refers to the process of 
// assigning the responsibility of handling events to a parent or higher-level element, allowing it to 
// manage events on behalf of its children. This term is commonly used in software development and 
// programming to describe this method of event handling.

tasks.addEventListener('change', (event) => {
    // It ensures that the change event is related to an element with the 'checkbox' class.
    // event.target -> where the event originated
    console.log(event.target);
    if (event.target.classList.contains('checkbox')) {
        // finds the closest ancestor of the event target that has the class 'task'.
        const taskElement = event.target.closest('.task');
        if (taskElement) {
            const taskIndex = taskElement.getAttribute('data-index');
            const isChecked = event.target.checked;
            console.log('the' + taskIndex);
            console.log('is checked' + isChecked);
            taskList[taskIndex].completed = isChecked;
            localStorage.setItem('tasks', JSON.stringify(taskList));
        }
    }
})

// Edit task
tasks.addEventListener('click', (event) => {
    if (event.target.classList.contains('edit')) {
        // Find the index of the task to edit
        const taskIndex = event.target.getAttribute('data-index');
        console.log(taskIndex);

        if (taskIndex !== null) {
            // Allow editing of the task details by enabling the input field
            const taskElement = event.target.closest('.task');
            const inputField = taskElement.querySelector('.input-task');
            // getElementEyId will not work
            const textArea = taskElement.querySelector('.hidden-description');
            inputField.disabled = false;
            textArea.disabled = false;

            // Change the button text to 'Save'
            // event.target.textContent = 'SAVE';
            // event.target.textContent === 'EDIT' ? event.target.textContent = 'SAVE' : event.target.textContent = 'EDIT';
            if (event.target.textContent === 'EDIT') {
                event.target.textContent = 'SAVE';
                // inputField.classList.add('')
                inputField.disabled ? '' : inputField.style.borderBottom = '1px solid black';
                textArea.classList.add('notDisabled');
                // if (!textArea.disabled) {
                //     textArea.style.border = '1px solid red';
                //     textArea.style.pointerEvents = 'auto';
                //     textArea.style.resize = 'both';
                // }
            } else {
                event.target.textContent = 'EDIT';
                inputField.disabled = true;
                textArea.disabled = true;
                textArea.classList.remove('notDisabled');
                inputField.disabled && (inputField.style.borderBottom = 'none');
                console.log(inputField.value);
                adjustTextareaHeight();
                // inputField.disabled ? '' : inputField.style.borderBottom = '1px solid red';
                // if (!textArea.disabled) {
                //     textArea.style.border = '1px solid red';
                //     textArea.style.pointerEvents = 'auto';
                //     textArea.style.resize = 'both';
                // }
                // const newTask = {
                //     title: title,
                //     description: description,
                //     priority: priority,
                //     completed: false
                // }
                taskList[taskIndex].title = inputField.value;
                taskList[taskIndex].description = textArea.value;
                localStorage.setItem('tasks', JSON.stringify(taskList));
            }
            // Stop the propagation of this specific event
            event.stopPropagation();
        }
    }
});

// Edit task priority
tasks.addEventListener('change', (event) => {
    if (event.target.matches('input[type="radio"]')) {
        const taskElement = event.target.closest('.task');
        if (taskElement) {
            const taskIndex = taskElement.getAttribute('data-index');
            console.log('the' + taskIndex);
            const selectedValue = event.target.value;
            // const taskIndex = Array.from(tasks.children).indexOf(taskElement);
            // console.log("Task index:", taskIndex);
            console.log("Selected value:", selectedValue);
            taskList[taskIndex].priority = selectedValue;
            localStorage.setItem('tasks', JSON.stringify(taskList));
        }
    }
})

// Show/hide additional task details
// tasks.addEventListener('click', (event) => {
    // const taskElement = event.target.closest('.task');

    // ['arrow-up', 'arrow-down'].forEach(id => {
    //     const element = document.getElementById(id);
    //     element.classList.toggle('visible');
    //     element.classList.toggle('hidden');
    //   });

    

    document.querySelectorAll('.icon').forEach(icon => {
        icon.addEventListener('click', (event) => {
            const taskElement = event.target.closest('.task');
            console.log(taskElement);
            const hiddenBox = taskElement.querySelector('.hidden-box');
            
            ['arrow-up', 'arrow-down'].forEach(id => {
                const element = taskElement.querySelector(`#${id}`);
                element.classList.toggle('hidden');
            });
    
            if (hiddenBox) {
                const isVisible = hiddenBox.classList.contains('visible');
    
                if (isVisible) {
                    hiddenBox.style.maxHeight = '0'; // Set max-height to 0 to hide the box
                    hiddenBox.classList.remove('visible');
                } else {
                    hiddenBox.classList.add('visible');
                    hiddenBox.style.maxHeight = hiddenBox.scrollHeight + 'px'; // Set max-height to the actual height
                }
            }
        });
    });
// });

