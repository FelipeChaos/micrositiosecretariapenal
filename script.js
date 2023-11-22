var dropdown = document.querySelector(".dropdown");
var tipoCasoSelect = document.getElementById("tipo-providencia"); 
var salirButton = document.querySelector(".Salir");
var dropdownContent = document.getElementById("dropdownOptions");


document.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && event.target.classList.contains("anotacion")) {
        agregarFila();
    }
});

dropdown.addEventListener("click", function (event) {
    if (dropdownContent) {
        dropdownContent.style.display = "none";
    }
    var dropdownContent = document.querySelector(".dropdown-content");
    if (dropdownContent.style.display === "block") {
        dropdownContent.style.display = "none";
    } else {
        dropdownContent.style.display = "block";
    }
    event.stopPropagation();
});

function cambiarTipoCaso(tipo) {
    document.getElementById('tabla-ordinarios').style.display = 'none';
    document.getElementById('tabla-tutelas').style.display = 'none';

    if (tipo === 'Ordinarios') {
        document.getElementById('tabla-ordinarios').style.display = 'table';
    } else if (tipo === 'Tutelas') {
        document.getElementById('tabla-tutelas').style.display = 'table';
    }
}
