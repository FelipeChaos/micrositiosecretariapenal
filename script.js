// const username = "usuario@prueba.com";
// const password = "contraseña";

// function authenticate() {
//     const enteredUsername = prompt("Ingrese su nombre de usuario:");
//     const enteredPassword = prompt("Ingrese su contraseña:");
  
//     if (enteredUsername === username && enteredPassword === password) {
//       alert("Autenticación exitosa. Puede acceder a la página restringida.");
//     } else {
//       alert("Credenciales incorrectas. Inténtelo de nuevo.");
//     }
// }

// Obtener referencias a los elementos HTML
var dropdown = document.querySelector(".dropdown");
var regresarInicioButton = document.querySelector(".regresar-inicio");
var descargarPDFButton = document.getElementById("descargarPDF");
var actaDetails = document.getElementById("actaDetails");
var salirButton= document.querySelector ("Salir")

// Evento para el botón "Regresar al Inicio"
regresarInicioButton.addEventListener("click", function () {
    window.location.href = 'index.html';
});

// Evnto para el botón "Salir"

salirButton.addEventListener('click',function(){
    window.location.href = 'login.html';  //Cerramos la ventana actual
    })

// Evento para mostrar el menú desplegable al hacer clic en el botón
dropdown.addEventListener("click", function () {
    var dropdownContent = document.querySelector(".dropdown-content");
    if (dropdownContent.style.display === "block") {
        dropdownContent.style.display = "none";
    } else {
        dropdownContent.style.display = "block";
    }
    event.stopPropagation();
});



// Cerrar el menú desplegable si el usuario hace clic fuera de él
window.addEventListener("click", function (event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.style.display === "block") {
                openDropdown.style.display = "none";
            }
        }
    }
});

// Función para mostrar el grid y generar el PDF
async function mostrarGrid() {
    // Ocultar el elemento select y los botones
    dropdown.style.display = "none";
    document.querySelector(".generar-acta").style.display = "none";
    document.querySelector(".regresar-inicio").style.display = "none";

    // Mostrar el grid (agregar aquí tu código para mostrar el grid)
    // Por ejemplo, puedes crear elementos div y agregarlos al actaDetails

    // Ejemplo de creación de un elemento div:
    var grid = document.createElement("div");
    grid.className = "grid";
    // Agregar elementos al grid (reemplazar con tu propio código)
    grid.innerHTML = `
        <div class="div1">Contenido 1</div>
        <div class="div2">Contenido 2</div>
        <!-- Agregar más contenido aquí -->
    `;
    actaDetails.appendChild(grid);

    // Mostrar el botón de descarga del PDF
    descargarPDFButton.style.display = "block";

    // Llamar a la función para generar el PDF
    await generarPDF();
}

// Evento para descargar el PDF
descargarPDFButton.addEventListener("click", function () {
    // Redireccionar a la ruta del PDF generado
    window.location.href = 'ruta_del_pdf_generado.pdf';
});

// Función para generar el PDF utilizando ReportLab (ejemplo)
async function generarPDF() {
    const fs = require('fs');
    const { PDFDocument, rgb } = require('pdf-lib');

    // Crear un nuevo documento PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 400]);

    // Agregar contenido al PDF
    const helveticaFont = await pdfDoc.embedFont('Helvetica');
    page.drawText('¡Este es un PDF generado con ReportLab!', {
        x: 50,
        y: 350,
        size: 30,
        font: helveticaFont,
        color: rgb(0, 0, 0),
    });

    // Guardar el PDF en un archivo
    const pdfBytes = await pdfDoc.save();

    fs.writeFileSync('ruta_del_pdf_generado.pdf', pdfBytes);
}
