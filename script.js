const furnitureItems = document.querySelectorAll('.furniture-item');
const roomPlanArea = document.getElementById('room-plan-area');

let draggedElementId = null;

furnitureItems.forEach(item => {
    item.addEventListener('dragstart', (e) => {

        draggedElementId = e.target.id;
      
        e.dataTransfer.setData('text/plain', draggedElementId);
     
        setTimeout(() => e.target.classList.add('dragging'), 0);
    });

    item.addEventListener('dragend', (e) => {
     
        e.target.classList.remove('dragging');
    });
});

roomPlanArea.addEventListener('dragover', (e) => {
    e.preventDefault(); 
    roomPlanArea.classList.add('drag-over');
});

roomPlanArea.addEventListener('dragleave', () => {
    roomPlanArea.classList.remove('drag-over');
});

roomPlanArea.addEventListener('drop', (e) => {
    e.preventDefault();
    roomPlanArea.classList.remove('drag-over');

    const id = e.dataTransfer.getData('text/plain');
    const draggableElement = document.getElementById(id);

    
    if (draggableElement) {
        
        draggableElement.style.position = 'absolute';
        draggableElement.style.left = (e.clientX - roomPlanArea.getBoundingClientRect().left - (draggableElement.offsetWidth / 2)) + 'px';
        draggableElement.style.top = (e.clientY - roomPlanArea.getBoundingClientRect().top - (draggableElement.offsetHeight / 2)) + 'px';

        e.target.appendChild(draggableElement);
    }
});

const trashCanArea = document.getElementById('trash-can-area');

trashCanArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move'; 
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

    if (draggableElement && draggableElement.parentElement.id === 'room-plan-area') {
        draggableElement.remove(); 
    }
});



