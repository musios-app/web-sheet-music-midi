
const aboutHTML = `
<html>
  <head>
    <style>
      body {
        font-family: Arial, sans-serif;
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <h1>Sheet Viewer by musios.app</h1>
    <p>This is a simple web-based sheet music viewer that can be controlled via MIDI messages.</p>
  </body>
</html>
`
const aboutHTML_dataURI = `data:text/html;base64,${btoa(unescape(encodeURIComponent(aboutHTML)))}`

function showSheet(filename) {
    if (filename === "about")
        filename = aboutHTML_dataURI

    // Display parameters: https://pdfobject.com/pdf/pdf_open_parameters_acro8.pdf
    //
    // view=FitH | FitV, FitR, FitB, FitBH, FitBV
    // zoom=nn%
    // 
    // navpanes=1 | 0
    // toolbar=1 | 0
    // toolbar: 0, 1, 2 top|bottom|both|none
    //
    // scrollbar=1|0

    const pdfDisplayOpts = "#view=FitB&toolbar=1";

    if (filename.startsWith('data:')) {
      document.getElementById("pdf-iframe").setAttribute('src', filename + pdfDisplayOpts);
    }
    else {
      const dataURI = sheetData.getSheet(filename,
        sheet => document.getElementById("pdf-iframe").setAttribute('src', sheet.data + pdfDisplayOpts),
        error => console.error(error)
      );
    }
}


