import * as $ from "jquery"

export class Note {
  static create(note) {
    return fetch("https://todo-list-708ef-default-rtdb.europe-west1.firebasedatabase.app/notes.json", {
      method: "POST",
      body: JSON.stringify(note),
      headers: {
        "Content-type": "application/json"
      }
    })
      .then(response => response.json())
      .then(response => {
        note.id = response.name
        return note
      })
      .then(addToLocalStorage)
      .then($(".note").remove())
      .then(Note.renderList)
  }

  static fetch(token) {
    if (!token) {
      return Promise.resolve(`<p class="error">You don't have token</p>`)
    }
    return fetch(`https://todo-list-708ef-default-rtdb.europe-west1.firebasedatabase.app/notes.json?auth=${token}`)
      .then(response => response.json())
      .then(response => {
        if (response.error) {
          return `<p class="error">${response.error}</p>`
        }

        return response ? Object.keys(response).map(key => ({ ...response[key], id: key })) : []
      })
  }

  static delNote() {
    $(".btn-del-note").on("click", function () {
      let noteId = $(this).parent().attr("id")

      if (confirm("Delete this note?")) {
        $(`#${noteId}`).hide(200)
        let notes = JSON.parse(localStorage.getItem("notes"))
        let filtered = notes.filter(notes => notes.id !== noteId)
        localStorage.setItem("notes", JSON.stringify(filtered))

        fetch(`https://todo-list-708ef-default-rtdb.europe-west1.firebasedatabase.app/notes/${noteId}.json`, {
          method: "DELETE",
          headers: {
            "Content-type": "application/json"
          }
        })
      }
    })
  }

  static renderList() {
    let notes = getNoteFromLocalStorage()

    let html = notes.length
      ? notes.map(toCard).join("")
      : `<div class="no-notes">You don't have notes</div>`

    let list = $("#list")
    $(list).prepend(html)
  }
}

export function addToLocalStorage(note) {
  let all = getNoteFromLocalStorage()
  all.unshift(note)
  localStorage.setItem("notes", JSON.stringify(all))
}


function getNoteFromLocalStorage() {
  return JSON.parse(localStorage.getItem("notes") || "[]")
}

function toCard(note) {
  return `
  <div class="note" id="${note.id}">
    <p class="note-text">${note.text}</p>
    <p class="date">Date: <time>${new Date(note.date).toLocaleString()}</time></p>
    <button class="btn btn-del-note btn-outline-danger btn-sm" type="button">Delete note</button>
  </div>
  `
}
