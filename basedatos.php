<?php
$conexion = mysqli_connect("tu_servidor", "tu_usuario", "tu_contraseña", "tu_base_de_datos");

if (!$conexion) {
    die("Error de conexión: " . mysqli_connect_error());
}

$fecha_labor = $_POST['fecha_labor'];
$fecha_descargado = $_POST['fecha_descargado'];
$ponente = $_POST['ponente'];
$numero_providencia = $_POST['numero_providencia'];
$radicado_interno = $_POST['radicado_interno'];

$sql = "INSERT INTO providencias (fecha_labor, fecha_descargado, ponente, numero_providencia, radicado_interno)
        VALUES ('$fecha_labor', '$fecha_descargado', '$ponente', '$numero_providencia', '$radicado_interno')";

if (mysqli_query($conexion, $sql)) {
    echo "Datos guardados exitosamente";
} else {
    echo "Error al guardar datos: " . mysqli_error($conexion);
}

mysqli_close($conexion);
?>
