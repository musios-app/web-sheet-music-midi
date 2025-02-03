

function setDropArea(el, callback) {
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
}


setDropArea(document.getElementById('droparea'), (filename, filetype, dataURI) => {
  sheetData.addSheet(filename, filetype, dataURI, () => {
    updateMenu();
    showSheet(dataURI);
  }, (error) => {
    console.error(error);
  });
})



const supportedMediaTypes = {
  "application/pdf": {
    type: "PDF",
    icon: "assets/images/fa-pdf.svg",
  }
};


function updateSheetManagerTable() {
  const tbody = $("#sheet-music-table tbody");

  sheetData.getSheetNames(filenames => {
    // console.log("filenames", filenames);

    filenames.forEach(filename => {
      sheetData.getSheet(filename, data => {
        $('#sheet-music-table').bootstrapTable('insertRow', {
          index: 1,
          row: {
            order: `<img src="assets/images/fa-bars.svg" height="20px"/>`,
            view: `<img src="assets/images/fa-eye-regular.svg" height="20px"/>`,
            filename: filename,
            songname: filename,
            type: `<!-- ${supportedMediaTypes[data.filetype].type} --> <img src="${supportedMediaTypes[data.filetype].icon}" height="20px"/>`,
            size: data.data.length,
          }
        });
      }, error => console.error(error));
    });
  });

  $('#sheet-music-table').bootstrapTable({
    dragHandle: '.reorder',
    columns: [
      {
        title: 'Order',
        field: 'order',
        class: 'reorder'
      },
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
    ]
  });
}


function customSort(sortName, sortOrder, data) {
  console.log(sortName, sortOrder, data);

  var order = sortOrder === 'desc' ? -1 : 1
  data.sort(function (a, b) {
    var aa = +((a[sortName] + '').replace(/[^\d]/g, ''))
    var bb = +((b[sortName] + '').replace(/[^\d]/g, ''))

    if (aa < bb) {
      return order * -1
    }
    if (aa > bb) {
      return order
    }
    return 0
  })
}  