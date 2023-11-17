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

    if (title === '') {
        console.log('empty task');
        errorMessage.textContent = "Please fill in the task field";
        return;
    } else {
        errorMessage.textContent = "";
    }
    console.log('non');

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
    const id = Math.floor(Math.random() * 10000) + 1;
    // Store info in localStorage

    const newTask = {
        title: title,
        description: description,
        priority: priority,
        completed: false,
        id: id
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
    console.log('all button clicked');
    
    // const children = buttons.children;
    // [...children].forEach(c => c.classList.remove('active'));
    // allBtn.classList.add('active');
    displayAllTasks();
    // setButtonSelected('all');

});

completedBtn.addEventListener('click', () => {
    console.log('Completed button clicked');
    
    const children = buttons.children;
    [...children].forEach(c => c.classList.remove('active'));
    completedBtn.classList.add('active');
    console.log('lala');
    displayCompletedTasks();

    // setButtonSelected('completed');
});

pendingBtn.addEventListener('click', () => {
    console.log('pending button clicked');
    displayPendingTasks();
    const children = buttons.children;
    [...children].forEach(c => c.classList.remove('active'));
    pendingBtn.classList.add('active');
    // setButtonSelected('pending');
});

// Sort Tasks
// *Remember that i have afterbegin to display the tasks!!!
function displaySortedTasks () {
    
    console.log('sort button clicked');
    // console.log(tasks);
    
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
    console.log(sortedTasks);
    allTasksCount = 0;
    completedTasksCount = 0;
    allTasksCount = taskList.length;
    taskList.forEach(task => task.completed && completedTasksCount++);
    // hiddenDescription.style.height = hiddenDescription.scrollHeight + 'px';
     
    displayFilteredTasks(sortedTasks);
    const children = buttons.children;
    [...children].forEach(c => c.classList.remove('active'));
    sortBtn.classList.add('active');
}
sortBtn.addEventListener('click', displaySortedTasks);

function adjustTextareaHeight() {
    var textarea = document.querySelector('.hidden-description');
    // textarea.style.height = 'auto'; // Reset height to auto
    textarea.style.height = (textarea.scrollHeight) + 'px'; // Set the height to the scrollHeight
    
}

// Function to display all the tasks
function displayAllTasks() {
    const children = buttons.children;
    [...children].forEach(c => c.classList.remove('active'));
    allBtn.classList.add('active');
    // allTasksCount = 0;
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
    console.log(completedTasks);
    console.log(completedTasks.length);
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

function displayFilteredTasks(filteredTasks) {
    // completedTasksCount = 0;
    // allTasksCount = taskList.length;
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
        // const taskField = document.querySelector('.task');
        // if (task.priority === 'high') {
        //     taskField.style.border = '1px solid red';
        // }
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
// tasks.addEventListener('click', (event) => {
//     if (event.target.classList.contains('delete')) {
//         // Find the index of the task to delete
//         const taskIndex = event.target.getAttribute('data-index');
//         console.log(taskIndex);
//         if (taskIndex !== null) {
//             // Delete the task and update the UI and local storage
//             taskList.splice(taskIndex, 1);
//             console.log(taskList);
//             // updateTaskList();
//             localStorage.setItem('tasks', JSON.stringify(taskList));
//             // updateLocalStorage(taskList);
//             displayAllTasks(); // Update the displayed tasks after deletion
//         }
//     }
// });

function checkActive() {
    const buttonsChildren = buttons.children;

    [...buttonsChildren].forEach((button, index) => {
      if (button.classList.contains('active')) {
        console.log('Button ' + (index + 1) + ' is active.');
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
    console.log('Edit button clicked');
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
    console.log('Delete button clicked');
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
    console.log('Checkbox clicked');
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
        checkActive();
    }
}

// Complete/Uncomplete task
// tasks.addEventListener('change', (event) => {
//     // It ensures that the change event is related to an element with the 'checkbox' class.
//     // event.target -> where the event originated
//     console.log(event.target);
    
//     if (event.target.classList.contains('checkbox')) {
//         // finds the closest ancestor of the event target that has the class 'task'.
//         const taskElement = event.target.closest('.task');
//         if (taskElement) {
//             const checkbox = taskElement.querySelector('.custom-checkbox');
//             const id = taskElement.getAttribute('data-index');
//             console.log(typeof id);
//             const taskIndex = taskList.findIndex(task => task.id === Number(id));
//             console.log(typeof taskIndex);
//             const isChecked = event.target.checked;
//             console.log(event.target.checked);
//             isChecked ? checkbox.classList.add('completed') : checkbox.classList.remove('completed');
//             // isChecked ? taskElement.style.opacity = '0.4' : taskElement.style.opacity = '1';
//             console.log('the' + taskIndex);
//             console.log('is checked' + isChecked);
//             taskList[taskIndex].completed = isChecked;
//             localStorage.setItem('tasks', JSON.stringify(taskList));
//         }
//     }
//     console.log(taskList);
//     checkActive();
//     // displayFilteredTasks(taskList);
//     // displayAllTasks();
    
// });

// Edit task
// tasks.addEventListener('click', (event) => {
//     console.log('Save button clicked');
//     if (event.target.classList.contains('edit')) {
//         // Find the index of the task to edit
//         const id = event.target.getAttribute('data-index');
//         console.log(id);
//         const taskIndex = taskList.findIndex(task => task.id === Number(id));
//         console.log(taskIndex);

//         if (taskIndex !== null) {
//             // Allow editing of the task details by enabling the input field
//             const taskElement = event.target.closest('.task');
//             const inputField = taskElement.querySelector('.input-task');
//             // getElementEyId will not work
//             const textArea = taskElement.querySelector('.hidden-description');
//             inputField.disabled = false;
//             textArea.disabled = false;

//             // Change the button text to 'Save'
//             // event.target.textContent = 'SAVE';
//             // event.target.textContent === 'EDIT' ? event.target.textContent = 'SAVE' : event.target.textContent = 'EDIT';
//             if (event.target.textContent === 'EDIT') {
//                 event.target.textContent = 'SAVE';
//                 // inputField.classList.add('')
//                 inputField.disabled ? '' : inputField.style.borderBottom = '1px solid black';
//                 textArea.classList.add('notDisabled');
//                 // if (!textArea.disabled) {
//                 //     textArea.style.border = '1px solid red';
//                 //     textArea.style.pointerEvents = 'auto';
//                 //     textArea.style.resize = 'both';
//                 // }
//             } else {
//                 event.target.textContent = 'EDIT';
//                 if (textArea.value === '') {
//                     document.querySelector('.no-notes').innerHTML = 'No notes';
//                 } else {
//                     document.querySelector('.no-notes').innerHTML = '';
//                 }
                

//                 inputField.disabled = true;
//                 textArea.disabled = true;
//                 textArea.classList.remove('notDisabled');
//                 inputField.disabled && (inputField.style.borderBottom = 'none');
//                 console.log(inputField.value);
//                 console.log(textArea.value);
//                 adjustTextareaHeight();
//                 // inputField.disabled ? '' : inputField.style.borderBottom = '1px solid red';
//                 // if (!textArea.disabled) {
//                 //     textArea.style.border = '1px solid red';
//                 //     textArea.style.pointerEvents = 'auto';
//                 //     textArea.style.resize = 'both';
//                 // }
//                 // const newTask = {
//                 //     title: title,
//                 //     description: description,
//                 //     priority: priority,
//                 //     completed: false
//                 // }
//                 taskList[taskIndex].title = inputField.value;
//                 taskList[taskIndex].description = textArea.value;
//                 localStorage.setItem('tasks', JSON.stringify(taskList));
//             }
//             // Stop the propagation of this specific event
//             event.stopPropagation();
//         }
//     }
// });

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
//     // const taskElement = event.target.closest('.task');

//     // ['arrow-up', 'arrow-down'].forEach(id => {
//     //     const element = document.getElementById(id);
//     //     element.classList.toggle('visible');
//     //     element.classList.toggle('hidden');
//     //   });

    

//     document.querySelectorAll('.icon').forEach(icon => {
//         icon.addEventListener('click', (event) => {
//             const taskElement = event.target.closest('.task');
//             console.log(taskElement);
//             const hiddenBox = taskElement.querySelector('.hidden-box');
            
//             ['arrow-up', 'arrow-down'].forEach(id => {
//                 const element = taskElement.querySelector(`#${id}`);
//                 element.classList.toggle('hidden');
//             });
    
//             if (hiddenBox) {
//                 const isVisible = hiddenBox.classList.contains('visible');
    
//                 if (isVisible) {
//                     hiddenBox.style.maxHeight = '0'; // Set max-height to 0 to hide the box
//                     hiddenBox.classList.remove('visible');
//                 } else {
//                     hiddenBox.classList.add('visible');
//                     hiddenBox.style.maxHeight = hiddenBox.scrollHeight + 'px'; // Set max-height to the actual height
//                 }
//             }
//         });
//     });
// });





// arrow animation
tasks.addEventListener('click', (event) => {
    const taskElement = event.target.closest('.task');

    if (taskElement) {
        const icon = taskElement.querySelector('.icon');
        console.log(icon);
        console.log(event.target);
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
