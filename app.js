class App {
  constructor() {
    this.notes = JSON.parse(localStorage.getItem("notes")) || [];
    this.title = "";
    this.text = "";
    this.id = "";

    this.$form = document.querySelector("#form");
    this.$modal = document.querySelector(".modal");
    this.$noteTitle = document.querySelector("#note-title");
    this.$notes = document.querySelector("#notes");
    this.$noteText = document.querySelector("#note-text");
    this.$modelTitle = document.querySelector(".modal-title");
    this.$modelText = document.querySelector(".modal-text");
    this.$modalCloseButton = document.querySelector(".modal-close-button");
    this.$formButtons = document.querySelector("#form-buttons");
    this.$placeholder = document.querySelector("#placeholder");
    this.$formCloseButton = document.querySelector("#form-close-button");
    this.$colorTooltip = document.querySelector("#color-tooltip");

    this.addEventListeners();
  }

  addEventListeners() {
    document.body.addEventListener("click", (event) => {
      this.handleClickListen(event);
      this.selectNote(event);
      this.openModal(event);
      this.deleteNote(event);
    });

    this.$form.addEventListener("submit", (event) => {
      event.preventDefault();
      const title = this.$noteTitle.value;
      const text = this.$noteText.value;
      const hasNote = title || text;

      if (hasNote) {
        this.addNote({ title, text });
      }
    });

    this.$formCloseButton.addEventListener("click", (event) => {
      event.stopPropagation();
      this.closeForm();
    });

    this.$modalCloseButton.addEventListener("click", (event) => {
      this.closeModal();
    });

    document.body.addEventListener("mouseover", (event) =>
      this.openTooltip(event)
    );

    document.body.addEventListener("mouseout", (event) => {
      this.closeTooltip(event);
    });

    this.$colorTooltip.addEventListener("mouseover", function () {
      this.style.display = "flex";
    });

    this.$colorTooltip.addEventListener("mouseout", function () {
      this.style.display = "none";
    });

    this.$colorTooltip.addEventListener("click", (event) => {
      this.changeColor(event);
    });

    this.render();
  }

  handleClickListen(event) {
    const isFormClicked = this.$form.contains(event.target);
    const title = this.$noteTitle.value;
    const text = this.$noteText.value;
    const hasNote = title || text;

    if (isFormClicked) {
      this.openForm();
    } else if (hasNote) {
      this.addNote({ title, text });
    } else {
      this.closeForm();
    }
  }

  openForm() {
    this.$form.classList.add("form-open");
    this.$formButtons.style.display = "block";
    this.$noteTitle.style.display = "block";
  }

  closeForm() {
    this.$form.classList.remove("form-open");
    this.$formButtons.style.display = "none";
    this.$noteTitle.style.display = "none";
    this.$noteTitle.value = "";
    this.$noteText.value = "";
  }

  selectNote(event) {
    const $selectedNote = event.target.closest(".note");
    if (!$selectedNote) return;
    const [$noteTitle, $noteText] = $selectedNote.children;
    this.title = $noteTitle.innerText;
    this.text = $noteText.innerText;
    this.id = $selectedNote.dataset.id;
  }

  openModal(event) {
    if (event.target.matches(".toolbar-delete")) return;

    if (event.target.closest(".note")) {
      this.$modelTitle.value = this.title;
      this.$modelText.value = this.text;
      this.$modal.classList.toggle("open-modal");
    }
  }

  closeModal() {
    this.editNote();
    this.$modal.classList.toggle("open-modal");
  }

  addNote(note) {
    const newNote = {
      title: note.title,
      text: note.text,
      color: "white",
      id: this.notes.length > 0 ? this.notes[this.notes.length - 1].id + 1 : 1,
    };
    this.notes = [...this.notes, newNote];
    this.render();
    this.closeForm();
  }

  editNote() {
    const title = this.$modelTitle.value;
    const text = this.$modelText.value;
    this.notes = this.notes.map((note) =>
      note.id === Number(this.id) ? { ...note, title, text } : note
    );
    this.render();
  }

  openTooltip(event) {
    if (!event.target.matches(".toolbar-color")) return;
    console.log(event.target.getBoundingClientRect());
    this.id = event.target.dataset.id;
    const noteCoords = event.target.getBoundingClientRect();
    const horizontal = noteCoords.left + window.scrollX - 20;
    const vertical = noteCoords.top + window.scrollY + 20;
    this.$colorTooltip.style.transform = `translate(${horizontal}px, ${vertical}px)`;
    this.$colorTooltip.style.display = "flex";
  }

  closeTooltip(event) {
    if (!event.target.matches(".toolbar-color")) return;
    this.$colorTooltip.style.display = "none";
  }

  changeColor(event) {
    const color = event.target.dataset.color;
    if (color) {
      this.notes = this.notes.map((note) =>
        note.id === Number(this.id) ? { ...note, color } : note
      );
      this.render();
    }
  }

  deleteNote(event) {
    event.stopPropagation();
    if (!event.target.matches(".toolbar-delete")) return;
    const id = event.target.dataset.id;
    this.notes = this.notes.filter((note) => note.id !== Number(id));
    this.render();
  }

  render() {
    this.saveNotes();
    this.displayNotes();
  }

  saveNotes() {
    localStorage.setItem("notes", JSON.stringify(this.notes));
  }

  displayNotes() {
    const hasNotes = this.notes.length > 0;
    this.$placeholder.style.display = hasNotes ? "none" : "flex";

    this.$notes.innerHTML = this.notes
      .map(
        (note) =>
          `<div style="background: ${note.color};" class="note" data-id=${
            note.id
          }>
        <div class="${note.title && "note-title"}">${note.title}</div>
        <div class="note-text">${note.text}</div>
        <div class="toolbar-container">
          <div class="toolbar">
            <img class="toolbar-color" data-id="${note.id}" data-color="${
            note.color
          }" src="https://img.icons8.com/change">
            <img class="toolbar-delete" data-id="${
              note.id
            }" src="https://img.icons8.com/delete">
          </div>
        </div>
      </div>`
      )
      .join("");
  }
}

new App();
