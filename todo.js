var notes = [],
    text,
    key = "notesapp";

window.onload = function() {
    var submitButton = document.getElementById("submit");
    submitButton.onclick = createNote;
    if (!window.localStorage) {
        alert("You are using a web browser that is too old for this program. Please upgrade your web browser if you wish to get the full experience.");
    } else {
        loadNotes();
    }
};

function createNote() {
    var noteText = document.getElementById("note");
    text = noteText.value;

    if (text == null || text == "" || text.length == 0) {
        alert("Please enter a note!");
        return;
    }

    var note = {},
        noteId = (new Date().getTime()).toString(36);
    note.text = text + '<button class="close-btn" onclick="deleteNote('+'this'+",'"+noteId+"'"+')">x</button>';
    note.id = noteId;
    notes.push(note);

    storeNotes();
    addNoteToPage(note);
}

function addNoteToPage(note) {
    // Determine where to place notes on page
    var notesUl = document.getElementById("notes"),
        li = document.createElement("li");

    // Add class name and attributes to notes
    li.className = "note";

    // Add event listeners for dragging/dropping notes
    li.setAttribute('data-draggable', 'item');
    li.setAttribute('draggable', 'true');
    li.setAttribute('aria-grabbed', 'false');
    li.addEventListener('dragstart', this.handleDragStart, false);
    li.addEventListener('dragenter', this.handleDragEnter, false);
    li.addEventListener('dragover', this.handleDragOver, false);
    li.addEventListener('dragleave', this.handleDragLeave, false);
    li.addEventListener('drop', this.handleDrop, false);
    li.addEventListener('dragend', this.handleDragEnd, false);

    // Display the note text with appropriate background color
    li.innerHTML = note.text;

    if (notesUl.childElementCount > 0) {
        notesUl.insertBefore(li, notesUl.firstChild);
    } else {
        notesUl.appendChild(li);
    }
}

function storeNotes() {
    var jsonNotes = JSON.stringify(notes);
    localStorage.setItem(key, jsonNotes);
}

function loadNotes() {
    var jsonNotes = localStorage.getItem(key);
    if (jsonNotes != null) {
        notes = JSON.parse(jsonNotes);
        for (var i = 0; i < notes.length; i++) {
            addNoteToPage(notes[i]);
        }
    }
}

function deleteNote(link, noteId) {
    var allKey = JSON.parse(localStorage.getItem(key));
    if (allKey != 0){
        allKey.forEach(function (item, index) {
            if(item.id == noteId) {
                allKey.splice(index, 1);
                link.parentNode.parentNode.removeChild(link.parentNode);
            }
        });
    }
    localStorage.setItem(key, JSON.stringify(allKey));
}

(function () {
    var id_ = 'notes',
        cols_ = document.querySelectorAll('#' + id_ + ' .note'),
        dragSrcEl_ = null;

    this.handleDragStart = function (e) {
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);

        dragSrcEl_ = this;
    };

    this.handleDragOver = function (e) {
        if (e.preventDefault) {
            e.preventDefault(); // Allows us to drop.
        }

        e.dataTransfer.dropEffect = 'move';

        return false;
    };

    this.handleDrop = function (e) {
        // this/e.target is current target element.
        if (e.stopPropagation) {
            e.stopPropagation(); // stops the browser from redirecting.
        }

        // Don't do anything if we're dropping on the same column we're dragging.
        if (dragSrcEl_ != this) {
            dragSrcEl_.innerHTML = this.innerHTML;
            this.innerHTML = e.dataTransfer.getData('text/html');
        }

        return false;
    };

    this.handleDragEnd = function (e) {
        // this/e.target is the source node.
        [].forEach.call(cols_, function (col) {
            col.removeClassName('over');
            col.removeClassName('moving');
        });
    };
})();
