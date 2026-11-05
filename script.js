
let notes = JSON.parse(localStorage.getItem("notes")) || [];

let editingId = null;

const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");
const searchInput = document.getElementById("search");
const addButton = document.getElementById("add-btn");
const notesContainer = document.getElementById("notes-container");

// Add or update a note
addButton.addEventListener("click", function () {

    let title = titleInput.value.trim();
    let content = contentInput.value.trim();

    if (title === "" || content === "") {
        alert("Please enter both title and content.");
        return;
    }

    if (editingId === null) {

        let note = {
            id: Date.now(),
            title: title,
            content: content,
            date: new Date().toLocaleString()
        };

        notes.push(note);

    } else {

        for (let i = 0; i < notes.length; i++) {
            if (notes[i].id === editingId) {
                notes[i].title = title;
                notes[i].content = content;
                notes[i].date = new Date().toLocaleString();
            }
        }

        editingId = null;
        addButton.textContent = "Add Note";
    }

    saveNotes();
    displayNotes();

    titleInput.value = "";
    contentInput.value = "";
});

// Display notes
function displayNotes() {

    notesContainer.innerHTML = "";

    let searchText = searchInput.value.toLowerCase();

    let filteredNotes = notes.filter(function (note) {
        return note.title.toLowerCase().includes(searchText) ||
               note.content.toLowerCase().includes(searchText);
    });

    if (filteredNotes.length === 0) {
        let message = document.createElement("p");
        message.textContent = "No notes found.";
        notesContainer.appendChild(message);
        return;
    }

    for (let i = 0; i < filteredNotes.length; i++) {

        let note = filteredNotes[i];

        let card = document.createElement("div");
        card.className = "note-card";

        let heading = document.createElement("h3");
        heading.textContent = note.title;

        let paragraph = document.createElement("p");
        paragraph.textContent = note.content;

        let date = document.createElement("small");
        date.textContent = "Updated: " + note.date;

        let actions = document.createElement("div");
        actions.className = "note-actions";

        let editButton = document.createElement("button");
        editButton.textContent = "Edit";
        editButton.className = "edit-btn";

        editButton.addEventListener("click", function () {
            editNote(note.id);
        });

        let deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete-btn";

        deleteButton.addEventListener("click", function () {
            deleteNote(note.id);
        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        card.appendChild(heading);
        card.appendChild(paragraph);
        card.appendChild(date);
        card.appendChild(actions);

        notesContainer.appendChild(card);
    }
}

// Edit a note
function editNote(id) {

    for (let i = 0; i < notes.length; i++) {
        if (notes[i].id === id) {
            titleInput.value = notes[i].title;
            contentInput.value = notes[i].content;
            editingId = id;
            addButton.textContent = "Update Note";
            break;
        }
    }

    titleInput.focus();
}

// Delete a note
function deleteNote(id) {

    let confirmDelete = confirm("Are you sure you want to delete this note?");

    if (confirmDelete) {
        notes = notes.filter(function (note) {
            return note.id !== id;
        });

        if (editingId === id) {
            editingId = null;
            titleInput.value = "";
            contentInput.value = "";
            addButton.textContent = "Add Note";
        }

        saveNotes();
        displayNotes();
    }
}

// Save notes in Local Storage
function saveNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

// Search notes
searchInput.addEventListener("input", function () {
    displayNotes();
});

// Initial display
displayNotes();
