document.addEventListener("DOMContentLoaded", () => {
  const textarea = document.getElementById("noteInput");

  // Auto-resize
  textarea.addEventListener("input", () => {
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  });

  // Enter = add block
  textarea.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      addBlock();
      textarea.style.height = "auto";
    }
  });

  // Global shortcuts (Ctrl+1 => heading, etc.)
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === '1') {
      e.preventDefault();
      document.getElementById('blockType').value = 'heading';
      textarea.focus();
    } else if (e.ctrlKey && e.key === '2') {
      e.preventDefault();
      document.getElementById('blockType').value = 'todo';
      textarea.focus();
    }
  });

  // Slash-commands (/todo => change blockType to 'todo', etc.)
  textarea.addEventListener("keyup", (e) => {
    const inputVal = e.target.value;
    const slashCommand = inputVal.match(/\/(\w+)$/);
    if (slashCommand) {
      const command = slashCommand[1];
      if (command === 'todo') {
        document.getElementById('blockType').value = 'todo';
      } else if (command === 'heading') {
        document.getElementById('blockType').value = 'heading';
      } else if (command === 'quote') {
        document.getElementById('blockType').value = 'quote';
      }
      // You could extend this to /embed or /image if desired
    }
  });

  // Initial load
  loadNotes();
  enableDrag();
});

let sortableInstance = null;

function addBlock() {
  const type = document.getElementById('blockType').value;
  const input = document.getElementById('noteInput');
  let content = input.value.trim();

  // NEW: If user chose "embed" but typed nothing, prompt for URL
  if (type === 'embed' && !content) {
    content = prompt("Enter the URL to embed (website or PDF):");
    if (!content) return; // if user cancels or leaves blank, stop
  }

  // If user typed nothing for other types, do nothing
  if (!content && type !== 'image') return;

  // If user chose "image," open file dialog
  if (type === 'image') {
    document.getElementById('imageUpload').click();
    return;
  }

  const notes = getNotesFromStorage();
  const block = { 
    type, 
    content, 
    createdAt: Date.now()
  };
  if (type === 'todo') block.checked = false;

  notes.push(block);
  saveNotesToStorage(notes);
  
  // Clear input and refresh
  input.value = '';
  input.style.height = "auto";
  loadNotes();
}

function loadNotes() {
  const notes = getNotesFromStorage();
  const list = document.getElementById('notesList');
  list.innerHTML = '';

  notes.forEach((note, index) => {
    const block = document.createElement('div');
    block.className = 'note-block';
    block.setAttribute('data-id', index);

    const content = document.createElement('div');
    content.className = `note-content ${note.type}`;

    // -- DETERMINE HOW TO RENDER EACH BLOCK TYPE --
    if (note.type === 'todo') {
      // To-do with a checkbox
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'todo-checkbox';
      checkbox.checked = note.checked;
      checkbox.onchange = () => toggleCheckbox(index, checkbox.checked);

      const span = document.createElement('span');
      span.innerText = note.content;
      span.contentEditable = true;
      span.onblur = () => updateContent(index, span.innerText);

      content.appendChild(checkbox);
      content.appendChild(span);
    }
    else if (note.type === 'image') {
      // Image block
      const img = document.createElement('img');
      img.src = note.content;  // base64 from uploadImage()
      img.className = 'embedded-image';

      content.appendChild(img);
      content.contentEditable = false;
    }
    // NEW: If type is 'embed', create an <iframe>
    else if (note.type === 'embed') {
      const iframe = document.createElement('iframe');
      iframe.src = note.content;   // user-provided URL
      iframe.width = "400";
      iframe.height = "300";
      iframe.setAttribute('frameborder', '0');

      content.appendChild(iframe);
      content.contentEditable = false;
    }
    else {
      // text, heading, quote, etc.
      content.innerText = note.content;
      content.contentEditable = true;
      content.onblur = () => updateContent(index, content.innerText);
    }

    // Toolbar (Convert, Duplicate, Delete)
    const toolbar = document.createElement('div');
    toolbar.className = 'note-toolbar';
    toolbar.innerHTML = `
      <button onclick="convertType(${index})">Convert</button>
      <button onclick="duplicateNote(${index})">Duplicate</button>
      <button onclick="deleteNote(${index})">Delete</button>
    `;

    block.appendChild(content);
    block.appendChild(toolbar);
    list.appendChild(block);
  });

  enableDrag();
}

// Handle image upload via hidden file input
function uploadImage(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(evt) {
    const notes = getNotesFromStorage();
    const block = {
      type: 'image',
      content: evt.target.result, // base64 data
      createdAt: Date.now()
    };
    notes.push(block);
    saveNotesToStorage(notes);
    loadNotes();
  };
  reader.readAsDataURL(file);
}

// Sorting
function sortNotes(mode) {
  const notes = getNotesFromStorage();

  if (mode === 'newest') {
    notes.sort((a, b) => b.createdAt - a.createdAt);
  } else if (mode === 'oldest') {
    notes.sort((a, b) => a.createdAt - b.createdAt);
  } else if (mode === 'alphabetical') {
    notes.sort((a, b) => a.content.localeCompare(b.content));
  }

  saveNotesToStorage(notes);
  loadNotes();
}

// Update text content
function updateContent(index, newText) {
  const notes = getNotesFromStorage();
  notes[index].content = newText.trim();
  saveNotesToStorage(notes);
}

// Checkbox toggling
function toggleCheckbox(index, isChecked) {
  const notes = getNotesFromStorage();
  notes[index].checked = isChecked;
  saveNotesToStorage(notes);
}

// Delete
function deleteNote(index) {
  const notes = getNotesFromStorage();
  notes.splice(index, 1);
  saveNotesToStorage(notes);
  loadNotes();
}

// Duplicate
function duplicateNote(index) {
  const notes = getNotesFromStorage();
  const copy = { ...notes[index] };
  notes.splice(index + 1, 0, copy);
  saveNotesToStorage(notes);
  loadNotes();
}

// Convert cycle
function convertType(index) {
  const notes = getNotesFromStorage();
  const typeList = ['text', 'heading', 'todo', 'quote'];
  const currentType = notes[index].type;
  let nextType = typeList[(typeList.indexOf(currentType) + 1) % typeList.length];
  notes[index].type = nextType;
  if (nextType !== 'todo') delete notes[index].checked;
  if (nextType === 'todo') notes[index].checked = false;
  saveNotesToStorage(notes);
  loadNotes();
}

// LocalStorage helpers
function getNotesFromStorage() {
  return JSON.parse(localStorage.getItem('notionBlocks')) || [];
}
function saveNotesToStorage(notes) {
  localStorage.setItem('notionBlocks', JSON.stringify(notes));
}

// Draggable reorder
function enableDrag() {
  if (sortableInstance) return;
  const container = document.getElementById('notesList');
  sortableInstance = Sortable.create(container, {
    animation: 150,
    onEnd(evt) {
      const notes = getNotesFromStorage();
      const movedItem = notes.splice(evt.oldIndex, 1)[0];
      notes.splice(evt.newIndex, 0, movedItem);
      saveNotesToStorage(notes);
      loadNotes();
    }
  });
}
