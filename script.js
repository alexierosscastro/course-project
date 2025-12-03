const roomPlanArea = document.getElementById('room-plan-area');
const trashCanArea = document.getElementById('trash-can-area');
const addItemBtn = document.getElementById('add-itembutt');
const newItemNameInput = document.getElementById('new-item-name');
const sidebar = document.querySelector('.sidebar');

function makeSidebarDraggable(item) {
    item.setAttribute('draggable', 'true');
    item.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', e.target.id);
    });
}

document.querySelectorAll('.furniture-item').forEach(makeSidebarDraggable);

roomPlanArea.addEventListener('dragover', e => e.preventDefault());
roomPlanArea.addEventListener('drop', e => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    const original = document.getElementById(id);
    if (!original) return;

    const clone = original.cloneNode(true);
    clone.className = 'placed-item';
    clone.id = `placed-${Date.now()}`;
    roomPlanArea.appendChild(clone);

    const rect = roomPlanArea.getBoundingClientRect();
    clone.style.left = `${e.clientX - rect.left - clone.offsetWidth / 2}px`;
    clone.style.top = `${e.clientY - rect.top - clone.offsetHeight / 2}px`;

    makeRoomDraggable(clone);
});

/*trashcan*/
function checkTrashHover(el) {
    const trashRect = trashCanArea.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    return (
        elRect.right > trashRect.left &&
        elRect.left < trashRect.right &&
        elRect.bottom > trashRect.top &&
        elRect.top < trashRect.bottom
    );
}

/*drag*/
function makeRoomDraggable(el) {
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;

    el.addEventListener('mousedown', e => {
    
        if (e.offsetX > el.offsetWidth - 10 && e.offsetY > el.offsetHeight - 10) return;

        isDragging = true;
        const rect = el.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', stop);
    });

    function move(e) {
        if (!isDragging) return;
        const rect = roomPlanArea.getBoundingClientRect();
        el.style.left = `${e.clientX - rect.left - offsetX}px`;
        el.style.top = `${e.clientY - rect.top - offsetY}px`;

        if (checkTrashHover(el)) {
            trashCanArea.classList.add('drag-over-trash');
        } else {
            trashCanArea.classList.remove('drag-over-trash');
        }
    }

    function stop() {
        isDragging = false;
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', stop);

        if (checkTrashHover(el)) {
            el.remove();
        }
        trashCanArea.classList.remove('drag-over-trash');
    }
}

/*add custom item*/

addItemBtn.addEventListener('click', () => {
    const name = newItemNameInput.value.trim();
    if (!name) return alert('Enter a name!');

    const newItem = document.createElement('div');
    newItem.className = 'furniture-item';
    newItem.textContent = name;
    newItem.id = `item-${Date.now()}`;
    sidebar.appendChild(newItem);

    makeSidebarDraggable(newItem);
    newItemNameInput.value = '';
});
