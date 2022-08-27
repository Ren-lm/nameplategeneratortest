function generatePDF()
{
  // Choose the element id which you want to export.
  var element = document.getElementById("preview-panel-container");

  //A4 pdf output will be element.style.width  = '595px';
  //                      element.style.height = '841px';
  //PDF file size is 21.10cm by 29.71cm
  var opt = {
    margin: 0.0,
    filename: 'nametags.pdf',
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { scale: 1 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait', precision: '12' }
  };

  // choose the element and pass it to html2pdf() function and call the save() on it to save as pdf.
  html2pdf().set(opt).from(element).save();
}