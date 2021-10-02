import * as $ from "jquery"

let url = "https://todo-list-708ef-default-rtdb.europe-west1.firebasedatabase.app/"

export class Note {
  static create(note) {
    return fetch(url + "notes.json", {
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
  }

  static fetch(token) {
    if (!token) {
      return Promise.resolve(`<p class="error">You don't have token</p>`)
    }
    return fetch(url + `notes.json?auth=${token}`)
      .then(response => response.json())
      .then(response => {
        if (response.error) {
          return `<p class="error">${response.error}</p>`
        }

        return response ? Object.keys(response).map(key => ({ ...response[key], id: key })) : []
      })
  }

  static delete() {
    $(".btn-del-note").on("click", function () {
      let noteId = $(this).parent().attr("id")

      if (confirm("Delete this note?")) {
        $(`#${noteId}`).hide(200)
        let notes = getNoteFromLocalStorage()
        let filtered = notes.filter(notes => notes.id !== noteId)
        localStorage.setItem("notes", JSON.stringify(filtered))

        fetch(url + `notes/${noteId}.json`, {
          method: "DELETE",
          headers: {
            "Content-type": "application/json"
          }
        })
      }
    })
  }

  static completed() {
    $(".btn-completed").on("click", function () {
      $(this).attr("disabled", true)
      let noteId = $(this).parent().attr("id")
      let notes = getNoteFromLocalStorage()

      let filtered = notes.filter(notes => notes.id !== noteId)
      localStorage.setItem("notes", JSON.stringify(filtered))

      let noteComplete = notes.find(x => x.id === noteId)
      noteComplete.completed = true
      addToLocalStorage(noteComplete)

      fetch(url + `notes/${noteId}/completed.json`, {
        method: "PUT",
        body: JSON.stringify("true"),
        headers: {
          "Content-type": "application/json"
        }
      }).then(() => { location.reload() })
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
  if (note.completed) {
    return `
    <div class="note" id="${note.id}" style="border: 1px solid green; opacity: 0.5;">
      <p class="note-text">${note.text}</p>
      <p class="date">Date: <time>${new Date(note.date).toLocaleString()}</time></p>
      <p class="status" style="color: green;">Status: completed</p>
      <button class="btn btn-completed btn-outline-success btn-sm" type="button" disabled>Completed</button>
      <button class="btn btn-del-note btn-outline-danger btn-sm" type="button">Delete note</button>
    </div>`
  } else {
    return `
    <div class="note" id="${note.id}">
      <p class="note-text">${note.text}</p>
      <p class="date">Date: <time>${new Date(note.date).toLocaleString()}</time></p>
      <p class="status" style="color: darkblue">Status: in process</p>
      <button class="btn btn-completed btn-outline-success btn-sm" type="button">Completed</button>
      <button class="btn btn-del-note btn-outline-danger btn-sm" type="button">Delete note</button>
    </div>`
  }
}
