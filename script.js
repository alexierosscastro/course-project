const furnitureItems = document.querySelectorAll('.furniture-item');
const roomPlanArea = document.getElementById('room-plan-area');

let draggedElementId = null;

// Add event listeners to all furniture items
furnitureItems.forEach(item => {
    item.addEventListener('dragstart', (e) => {
        // Store the ID of the dragged element
        draggedElementId = e.target.id;
        // Set the data to be transferred
        e.dataTransfer.setData('text/plain', draggedElementId);
        // Add a visual class to the original element
        setTimeout(() => e.target.classList.add('dragging'), 0);
    });

    item.addEventListener('dragend', (e) => {
        // Remove the visual class when dragging stops
        e.target.classList.remove('dragging');
    });
});

// Add event listeners to the drop zone (the room)
roomPlanArea.addEventListener('dragover', (e) => {
    e.preventDefault(); // Prevent default behavior (e.g., opening as a link)
    roomPlanArea.classList.add('drag-over');
});

roomPlanArea.addEventListener('dragleave', () => {
    roomPlanArea.classList.remove('drag-over');
});

roomPlanArea.addEventListener('drop', (e) => {
    e.preventDefault();
    roomPlanArea.classList.remove('drag-over');

    // Get the ID of the dragged element from the dataTransfer object
    const id = e.dataTransfer.getData('text/plain');
    const draggableElement = document.getElementById(id);

    // Append the element to the drop zone
    // Note: this code moves the *original* element. For a real room planner, 
    // you would typically clone the element to leave the original in the sidebar.
    if (draggableElement) {
        // Set the position where it was dropped (relative to the room container)
        // This is a basic implementation; advanced planners use more complex coordinate systems.
        draggableElement.style.position = 'absolute';
        draggableElement.style.left = (e.clientX - roomPlanArea.getBoundingClientRect().left - (draggableElement.offsetWidth / 2)) + 'px';
        draggableElement.style.top = (e.clientY - roomPlanArea.getBoundingClientRect().top - (draggableElement.offsetHeight / 2)) + 'px';

        e.target.appendChild(draggableElement);
    }
});

const trashCanArea = document.getElementById('trash-can-area');

// Add event listeners to the trash can drop zone
trashCanArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move'; // Optional: indicates a move operation
    trashCanArea.classList.add('drag-over-trash');
});

trashCanArea.addEventListener('dragleave', () => {
    trashCanArea.classList.remove('drag-over-trash');
});

trashCanArea.addEventListener('drop', (e) => {
    e.preventDefault();
    trashCanArea.classList.remove('drag-over-trash');

    const id = e.dataTransfer.getData('text/plain');
    const draggableElement = document.getElementById(id);

    // Remove the element from the DOM when dropped into the trash
    if (draggableElement && draggableElement.parentElement.id === 'room-plan-area') {
        draggableElement.remove(); 
    }
});



