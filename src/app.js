// Styles and images ======================================
require.context('@img/', true, /\.(png|jpg|svg|webp)$/)
require.context('@css/', true, /\.(css|scss|sass|less)$/)
// Styles and images ====================================

import * as $ from "jquery"
import { isValid } from "@js/utils"
import { Note } from "@js/note"
import { authWithEmailAndPasword } from "@js/auth"
import { addToLocalStorage } from "@js/note"
import { sortNotes } from "@js/sort"
import { search } from "@js/search"


window.addEventListener("load", Note.renderList)
$(window).on("load", Note.delNote)
$("#form_note").on("submit", submitFormHandler)
$("#auth").on("submit", authFormHandler)
$("#sortButton").on("click", sortNotes)
$("#search").on("input", search)

$("#note_inp").on("input", () => {
  if (isValid($("#note_inp").val())) {
    $("#note_btn").prop("disabled", false)
  } else {
    $("#note_btn").prop("disabled", true)
  }
})

function submitFormHandler(event) {
  event.preventDefault()

  if (isValid($("#note_inp").val())) {
    $("#note_btn").prop("disabled", false)

    let note = {
      text: $("#note_inp").val(),
      date: new Date().toJSON()
    }

    // Async request to server to save note
    Note.create(note).then(() => {
      $("#note_inp").val("")
      $("#note_btn").prop("disabled", true)
      location.reload()
    })
  }
}


function authFormHandler(event) {
  event.preventDefault()

  authWithEmailAndPasword($("#email").val(), $("#pwd").val())
    .then(Note.fetch)
    .then(renderListAfterAuth)
}

function renderListAfterAuth(content) {
  if (typeof content !== "string") {
    localStorage.clear()
    content.forEach(addToLocalStorage)
    location.reload()
  }
}
