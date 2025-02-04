/* primary control of the display and navigation */

/* global $ */

const databaseName = "musios.app-sheetviewer"
const sheetStoreName = "sheets"
const versionNumber = 1

class SheetData {
  static #instance = null;

  constructor() {
    if (SheetData.#instance) {
      throw new Error("Use SheetData.init() to get the single instance of this class.")
    }
    this.db = null
  }

  static async getInstance() {
    if (SheetData.#instance) return SheetData.#instance

    SheetData.#instance = new SheetData()

    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(databaseName, versionNumber)

      request.onsuccess = function (event) {
        SheetData.#instance.db = event.target.result
        resolve(SheetData.#instance)
      }

      request.onerror = function (event) {
        console.error(`Database error: ${event.target.error?.message}`);
        reject(event.target.error)
      }

      request.onupgradeneeded = function (event) {
        SheetData.#instance.db = event.target.result

        const storeRequest = SheetData.#instance.db.createObjectStore(sheetStoreName, { keyPath: "filename" })
        storeRequest.onsuccess = function (/* event */) {
          resolve(SheetData.#instance)
        }

        storeRequest.onerror = function (event) {
          console.error(`Sheet store error: ${event.target.error?.message}`);
          reject(event.target.error)
        }
      }
    })
  }

  async addSheet(filename, filetype, data) {
    console.debug("addSheet", filename, filetype)

    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction(sheetStoreName, "readwrite");
      const objectStore = transaction.objectStore(sheetStoreName);

      const request = objectStore.put({ filename, filetype, data });

      request.onsuccess = (/* event */) => {
        console.debug("Sheet added successfully");
        resolve();
      };

      request.onerror = (event) => {
        console.error(`Sheet add error: ${event.target.error?.message}`);
        reject(event.target.error);
      };
    });
  }

  async getSheetNames() {
    return new Promise((resolve, reject) => {
      // console.log("getSheetNames promise")
      // console.log(this)
      // console.log("this.db", this.db)
      // console.log("sheetStoreName", sheetStoreName)

      const transaction = this.db.transaction(sheetStoreName, "readonly");
      const objectStore = transaction.objectStore(sheetStoreName);

      const request = objectStore.getAllKeys();

      request.onsuccess = (event) => {
        resolve(event.target.result);
      };

      request.onerror = (event) => {
        console.error(`Sheet get error: ${event.target.error?.message}`);
        reject(event.target.error?.message);
      };
    });
  }

  getSheet(filename, success = null, error = null) {
    const transaction = this.db.transaction(sheetStoreName, "readonly");
    const objectStore = transaction.objectStore(sheetStoreName);

    const request = objectStore.get(filename);

    request.onsuccess = (event) => {
      success && success(event.target.result);
    };

    request.onerror = (event) => {
      console.error(`Sheet get error: ${event.target.error?.message}`);
      error && error(event.target.error?.message);
    };
  }

  deleteDatabase(success = null, error = null) {
    const request = window.indexedDB.deleteDatabase(databaseName, versionNumber);

    request.onsuccess = (/* event */) => {
      console.log("Database deleted successfully");
      success && success();
    };

    request.onerror = (event) => {
      console.error(`Database error: ${event.target.error?.message}`);
      error && error(event.target.error?.message);
    };
  }
}


/*
const sheetData = {

    const sheetData = new SheetData();
    db: null,
    databaseName: "musios.app",
    sheetStoreName: "sheets",
    versionNumber: 1,

    init: (success=null, error=null) => {
        const request = window.indexedDB.open(sheetData.databaseName, sheetData.versionNumber);

        request.onupgradeneeded = (event) => {
            sheetData.db = event.target.result;
            console.log("Database upgrade needed");
            const objectStore = sheetData.db.createObjectStore(sheetData.sheetStoreName, { keyPath: "filename" });
        
            // objectStore.transaction.oncomplete = (event) => {
            //     const sheetObjectStore = 
            //         sheetData.db
            //             .transaction("sheets", "readwrite")
            //             .objectStore("sheets");
            // }
        };
        
        request.onsuccess = (event) => {
            console.log("Database openned successfully");
            sheetData.db = event.target.result;
            success && success();
        }

        request.onerror = (event) => {
            console.error(`Database error: ${event.target.error?.message}`);
            error && error(event.target.error?.message);
        }
    },

    addSheet: (filename, filetype, data, success=null, error=null) => {
        const transaction = sheetData.db.transaction(sheetData.sheetStoreName, "readwrite");
        const objectStore = transaction.objectStore(sheetData.sheetStoreName);

        const request = objectStore.put({ filename, filetype, data } );

        request.onsuccess = (event) => {
            console.log("Sheet added successfully");
            success && success();
        }

        request.onerror = (event) => {
            console.error(`Sheet add error: ${event.target.error?.message}`);
            error && error(event.target.error?.message);
        }
    },

    getSheetNames(success=null, error=null) {
        const transaction = sheetData.db.transaction(sheetData.sheetStoreName, "readonly");
        const objectStore = transaction.objectStore(sheetData.sheetStoreName);

        const request = objectStore.getAllKeys();

        request.onsuccess = (event) => {
            success && success(event.target.result);
        }

        request.onerror = (event) => {
            console.error(`Sheet get error: ${event.target.error?.message}`);
            error && error(event.target.error?.message);
        }
    },

    getSheet(filename, success=null, error=null) {
        const transaction = sheetData.db.transaction(sheetData.sheetStoreName, "readonly");
        const objectStore = transaction.objectStore(sheetData.sheetStoreName);

        const request = objectStore.get(filename);

        request.onsuccess = (event) => {
            success && success(event.target.result);
        }

        request.onerror = (event) => {
            console.error(`Sheet get error: ${event.target.error?.message}`);
            error && error(event.target.error?.message);
        }
    },

    deleteDatabase(success=null, error=null) {
        const request = window.indexedDB.deleteDatabase(sheetData.databaseName, sheetData.versionNumber);

        request.onsuccess = (event) => {
            console.log("Database deleted successfully");
            success && success();
        }

        request.onerror = (event) => {
            console.error(`Database error: ${event.target.error?.message}`);
            error && error(event.target.error?.message);
        }
    }


}

*/



const SV_Manager = {
  supportedMediaTypes: {

    "image/rtf": {
      type: "Text",
      imguri: "assets/images/filetypes/filetype-rtf.svg"
    },

    "text/plain": {
      type: "Text",
      imguri: "assets/images/filetypes/filetype-text.svg"
    },

    "application/pdf": {
      type: "PDF",
      imguri: "assets/images/filetypes/filetype-pdf.svg"
    },

    "image/jpeg": {
      type: "JPEG",
      imguri: "assets/images/filetypes/filetype-jpg.svg"
    },
  
    "image/jpg": {
      type: "JPEG",
      imguri: "assets/images/filetypes/filetype-jpg.svg"
    },
  
    "image/png": {
      type: "Text",
      imguri: "assets/images/filetypes/filetype-png.svg"
    },

    "image/svg+xml": {
      type: "SVG",
      imguri: "assets/images/filetypes/filetype-svg.svg"
    },
  },
  

  setDropArea(el, callback) {
    el.addEventListener('dragover', (event) => {
      event.preventDefault();
      el.classList.add('hover');
    });

    el.addEventListener('dragleave', () => {
      el.classList.remove('hover');
    });

    el.addEventListener('drop', (event) => {
      event.preventDefault();
      el.classList.remove('hover');

      // console.log(event.dataTransfer.files);

      [...event.dataTransfer.files]
        .filter(file => file)
        .forEach(file => {
          // console.log("file:", file);
          if (!file) return;

          const validTypes = ['image/jpeg', 'image/png', 'application/pdf', 'text/plain'];
          if (!validTypes.includes(file.type)) {
            alert('PDF, images and text files are supported. Images as JPEG or PNG.');
            return
          }

          const reader = new FileReader();
          reader.onload = function (e) {
            const dataURI = e.target.result;
            callback(file.name, file.type, dataURI);
          };

          reader.readAsDataURL(file);
        });
    });
  },


  updateSheetManagerTable(sheetData) {
    sheetData.getSheetNames()
      .then(filenames => {
        console.debug("filenames", filenames);

        filenames.forEach(filename => {
          sheetData.getSheet(filename, data => {
            console.debug("file", filename, data)

            $('#sheet-music-table').bootstrapTable('insertRow', {
              index: 1,
              row: {
                // order: `<img src="assets/images/fa-bars.svg" height="20px"/>`,
                view: `<img src="assets/images/fa-eye-regular.svg" height="20px"/>`,
                filename: filename,
                songname: filename,
                type: `<img src="${SV_Manager.supportedMediaTypes[data.filetype].imguri}" height="20px"/>`,
                size: data.data.length,
                delete: `<img src="assets/images/fa-trash-can-regular.svg" height="20px"/>`,
              }
            });
          }, error => console.error(error))
        });
      })

    $('#sheet-music-table').bootstrapTable({
      // dragHandle: '.reorder',
      columns: [
        // {
        //   title: 'Order',
        //   field: 'order',
        //   class: 'reorder'
        // },
        {
          title: 'View',
          field: 'view',
          class: 'view',
          align: 'center'
        },
        {
          title: 'Song name',
          field: 'songname',
          class: 'songname'
        },
        {
          title: 'Filename',
          field: 'filename',
          class: 'filename'
        },
        {
          title: 'Type',
          field: 'type',
          class: 'type',
          align: 'center',
        },
        {
          title: 'Size',
          field: 'size',
          class: 'size',
          align: 'right',
          formatter: function (value) {
            if (value < 1024) return value + ' bytes';
            value = value / 1024;
            if (value < 1024) return Math.round(value) + 'KB';
            value = value / 1024;
            if (value < 1024) return Math.round(value) + 'MB';
            value = value / 1024;
            if (value < 1024) return Math.round(value) + 'GB';
          }
        },
        {
          title: 'Delete',
          field: 'delete',
          class: 'delete',
          align: 'center',
        },
      ]
    });
  },


  // customSort(sortName, sortOrder, data) {
  //   console.log(sortName, sortOrder, data);

  //   var order = sortOrder === 'desc' ? -1 : 1
  //   data.sort(function (a, b) {
  //     var aa = +((a[sortName] + '').replace(/[^\d]/g, ''))
  //     var bb = +((b[sortName] + '').replace(/[^\d]/g, ''))

  //     if (aa < bb) {
  //       return order * -1
  //     }
  //     if (aa > bb) {
  //       return order
  //     }
  //     return 0
  //   })
  // }  
}


const SV_Navigation = {

  setDisplayMode(mode) {
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
    } else {
      console.error("Invalid display mode")
    }
  },

  updateMenu() {
    const fileSelectionMenu = $("#file-selection")
    const fileSelectionList = $('#file-selection-list')

    SheetData.getInstance()
      .then(sheetData => {
        sheetData.getSheetNames(filenames => {
          console.log("updateMenu filenames", filenames)
          if (!filenames || filenames.length === 0) {
            fileSelectionMenu.addClass("disabled")
            return
          }

          // fileSelectionList.empty()
          // fileSelectionMenu.removeClass("disabled")

          // const liItem = $(`<li><a class='dropdown-item' href='#'>${filename}</a></li>`)
          // fileSelectionList.append(liItem)

          // liItem.click(event => {
          //   console.log(filename)
          // })
        })
      })
  }
}


/*
const pdfMidiDevice = "IAC Driver PDFBrowser"

initMidiSheetRequest(
  pdfMidiDevice,
  songName => selectSong(songName)
)
*/

const SV_Midi = {
  /*
    const pdfMidiDevice = "IAC Driver PDFBrowser"

    initMidiSheetRequest(
      pdfMidiDevice,
      songName => selectSong(songName)
    )
  */


  initMidiSheetRequest(midiDeviceName, callback, errorCallback) {
    let _midiAccess = null;
    let _pdfDevice = null;

    let inMessage = false;
    let songName = null;

    function processEvent(message) {
        if (message.data[0] === 0xB0 && message.data[1] === 110 && message.data[2] === 0x7F) {
            inMessage = true;
            songName = "";
            console.log("Start new song name");
        }
        else if (message.data[0] === 0xB0 && message.data[1] === 110 && message.data[2] === 0x00) {
            inMessage = false;
            console.log("Song name: " + songName);
            selectSong(songName);
        }
        else if (message.data[0] === 0xB0 && message.data[1] === 111) {
            songName += String.fromCharCode(message.data[2]);
        }
    }


    function onMIDISuccess(midiAccess) {
        _midiAccess = midiAccess;

        console.log("onMIDISuccess")
        console.log(_midiAccess);

        _midiAccess.inputs.forEach(input => {
            if (input.name === midiDeviceName) {
                _pdfDevice = input;
                input.onmidimessage = (message) => {
                    processEvent(message);
                };
            }
        });
    }

    function onMIDIFailure() {
        alert('ERROR: could not access MIDI devices');
        console.error('ERROR: could not access MIDI devices');
    }

    if (navigator.requestMIDIAccess) {
        console.log("requesting MIDI access")
        navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
    } else {
        alert('MIDI is not supported by this browser.');
    }
  }
}
