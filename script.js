const roomPlanArea = document.getElementById('room-plan-area');
const trashCanArea = document.getElementById('trash-can-area');
const addItemBtn = document.getElementById('add-itembutt');
const newItemNameInput = document.getElementById('new-item-name');
const sidebar = document.querySelector('.sidebar');

// Audio
const pickUpSound = new Audio('audio/pickup.mp3');
const dropSound = new Audio('audio/drop.mp3');
const deleteSound = new Audio('audio/delete.mp3');
let isMuted = false;

const muteBtn = document.getElementById('mute-btn');

//toggle mute
muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    muteBtn.textContent = isMuted ? '🔇' : '🔊';
});

// Play audio if not muted
function playSound(audio) {
    if (!isMuted) {
        audio.currentTime = 0;
        audio.play();
    }
}

//sidebar items draggable
function makeSidebarDraggable(item) {
    item.setAttribute('draggable', 'true');
    item.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', e.target.id);
        playSound(pickUpSound);
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
    playSound(dropSound);
});

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

// make items draggable inside the room
function makeRoomDraggable(el) {

    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;

    el.addEventListener('mousedown', e => {
        isDragging = true;
        const rect = el.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;

        // so it can only play pick-up sound if not over trash
        if (!checkTrashHover(el)) playSound(pickUpSound);

        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', stop);
    });

    function move(e) {
        if (!isDragging) return;
        const rect = roomPlanArea.getBoundingClientRect();
        el.style.left = `${e.clientX - rect.left - offsetX}px`;
        el.style.top = `${e.clientY - rect.top - offsetY}px`;

        trashCanArea.classList.toggle('drag-over-trash', checkTrashHover(el));
    }

    function stop() {
        document.removeEventListener('mousemove', move);
        document.removeEventListener('mouseup', stop);

        if (checkTrashHover(el)) {
            el.remove();
            playSound(deleteSound);
        }

        trashCanArea.classList.remove('drag-over-trash');
        isDragging = false;
    }
}

// Add custom items
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