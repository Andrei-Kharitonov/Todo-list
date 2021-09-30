export function sortNotes() {
  let allNotes = JSON.parse(localStorage.getItem("notes") || "[]")
  let sortNotes = []

  allNotes.forEach(note => {
    sortNotes.unshift(note)
  })

  localStorage.setItem("notes", JSON.stringify(sortNotes))
  location.reload()
}
