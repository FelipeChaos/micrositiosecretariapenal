document.addEventListener("DOMContentLoaded", function () {
    const pdfForm = document.getElementById("pdfForm");
    const extractButton = document.getElementById("extractButton");
    const downloadExcelButton = document.getElementById("downloadExcel");
    const notificationDiv = document.getElementById("notification");

    extractButton.addEventListener("click", function () {
        const formData = new FormData(pdfForm);

        fetch("/upload", {
            method: "POST",
            body: formData,
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error al cargar archivos PDF: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            notificationDiv.innerHTML = data.message;
            if (data.message === 'Archivos PDF cargados exitosamente.') {
                downloadExcelButton.style.display = 'block';
            }
        })
        .catch((error) => {
            console.error('Error al cargar archivos PDF:', error.message);
        });
    });
        downloadExcelButton.addEventListener("click", function () {
        fetch("/download_excel", {
            method: "GET",
        })
            .then(response => response.blob())
            .then(data => {
                const url = window.URL.createObjectURL(data);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = 'datos_extraidos.xlsx';
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            });
    });
});
