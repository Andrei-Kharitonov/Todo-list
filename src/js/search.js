export function search() {
  $("#search").on("keyup", function () {
    let value = $(this).val().toLowerCase()
    $("#list .note").filter(function () {
      let text = $(this).children(".note-text")
      $(this).toggle($(text).text().toLowerCase().indexOf(value) > -1)
    })
  })
}