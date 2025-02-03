/* primary control of the display and navigation */

function setDisplayMode(mode) {
    if (mode === "viewer") {
        $("#radioViewerMode").prop("checked", true)
        $("#radioManagerMode").prop("checked", false)

        $("body .display-viewer").show()
        $("body .display-manager").hide()
    } else if (mode === "manager") {
        $("#radioViewerMode").prop("checked", false)
        $("#radioManagerMode").prop("checked", true)

        $("body .display-viewer").hide()
        $("body .display-manager").show()
    }
  }
  
  function updateMenu() {
    const fileSelectionMenu = $("#file-selection")
    const fileSelectionList = $('#file-selection-list')
  
    SheetData.getInstance()
      .then(sheetData => {
        sheetData.getSheetNames(filenames => {
          console.log(filenames)
          if (!filenames || filenames.length === 0) {
            fileSelectionMenu.addClass("disabled")
            return
          } x
  
          fileSelectionList.empty()
          fileSelectionMenu.removeClass("disabled")
  
          const liItem = $(`<li><a class='dropdown-item' href='#'>${filename}</a></li>`)
          fileSelectionList.append(liItem)
  
          liItem.click(event => {
            console.log(filename)
          })
        })
      })
  }
  