document.addEventListener('DOMContentLoaded', () => {
    obtenerReportesSupervisor();
});
// Obtener los reportes de todos los técnicos asignados a un supervisor
async function obtenerReportesSupervisor() {
    const token = localStorage.getItem("token");
    const id_supervisor = obtenerIdUsuario();  // Obtener el ID del supervisor desde el token

    if (!id_supervisor) {
        console.error("Error: No se pudo obtener el ID del supervisor.");
        return;
    }

    console.log("\ud83d\udccc ID Supervisor obtenido:", id_supervisor);

    try {
        const response = await fetch(`https://skynet-by4s.onrender.com/reportes/supervisor/${id_supervisor}/reportes`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const reportes = await response.json();
        console.log("\ud83d\udccc Reportes recibidos:", reportes); // Verifica qué devuelve la API
        mostrarReportes(reportes);  // Función para mostrar los reportes
    } catch (error) {
        console.error("Error obteniendo reportes del supervisor:", error);
    }
}

// Función para mostrar los reportes en la interfaz
function mostrarReportes(reportes) {
    const container = document.getElementById("reportesContainer");

    if (reportes.length === 0) {
        container.innerHTML = "<p>No hay reportes disponibles para los técnicos asignados a este grupo.</p>";
        return;
    }

    // Limpiar el contenedor antes de agregar los reportes
    container.innerHTML = "";

    // Crear la tabla de reportes
    const table = document.createElement("table");
    table.classList.add("reportes-table");

    const headerRow = document.createElement("tr");
    const headers = ["ID", "Técnico", "Descripción", "Fecha Inicio", "Fecha Fin", "Estado", "Acción", "PDF"];
    headers.forEach(headerText => {
        const th = document.createElement("th");
        th.textContent = headerText;
        headerRow.appendChild(th);
    });
    table.appendChild(headerRow);

    // Agregar las filas con los reportes
    reportes.forEach(reporte => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${reporte.id}</td>
            <td>${reporte.id_tecnico}</td>
            <td>${reporte.descripcion}</td>
            <td>${new Date(reporte.horaInicio).toLocaleString()}</td>
            <td>${new Date(reporte.horaFin).toLocaleString()}</td>
      <td>
  <select id="estado-${reporte.id}" class="estado-reporte">
    <option value="Pendiente" ${reporte.estado === "Pendiente" ? "selected" : ""}>Pendiente</option>
    <option value="Cancelado" ${reporte.estado === "Cancelado" ? "selected" : ""}>Cancelado</option>
    <option value="Corregir" ${reporte.estado === "Corregir" ? "selected" : ""}>Corregir</option>
    <option value="Aprobado" ${reporte.estado === "Aprobado" ? "selected" : ""}>Aprobado</option>
  </select>
</td>
<td>
  <button class="editar-estado" data-id="${reporte.id}">Editar Estado</button>
</td>
            <td><button onclick="verReporte(${reporte.id})">Ver</button></td>
        `;
        table.appendChild(row);

    });

    container.appendChild(table);
    document.querySelectorAll('.editar-estado').forEach(boton => {
        boton.addEventListener('click', actualizarEstadoReporte);
    });
    
}


//////////////////////////////////////////////////////
async function actualizarEstadoReporte(event) {
    const boton = event.target; // Boton que activó el evento
    const idReporte = boton.dataset.id; // Obtener el ID del reporte
    const select = document.getElementById(`estado-${idReporte}`); // Buscar el select asociado
    const nuevoEstado = select.value; // Obtener el valor seleccionado

    try {
        const response = await fetch(`https://skynet-by4s.onrender.com/reportes/${idReporte}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ estado: nuevoEstado })
        });

        if (response.ok) {
            alert('Estado actualizado correctamente');
        } else {
            const data = await response.json();
            alert(`Error al actualizar el estado: ${data.error || response.statusText}`);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}











//////////////////////////////////////////////////////////PDF

async function verReporte(id) {
    console.log("Generando PDF para el reporte ID:", id);

    const token = localStorage.getItem("token");

    try {
        // Obtener los datos del reporte específico desde el backend
        const response = await fetch(`https://skynet-by4s.onrender.com/reportes/${id}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const reporte = await response.json();
        console.log(" Reporte recibido:", reporte);

        // Llamar a la función para generar el PDF
        generarPDF(reporte);
    } catch (error) {
        console.error("Error obteniendo reporte:", error);
    }
}

function generarPDF(reporte) {
    const { id, id_tecnico, id_supervisor, descripcion, horaInicio, horaFin, estado, evidencia } = reporte;

    // Asegurar acceso a jsPDF
    if (!window.jspdf) {
        console.error(" jsPDF no está definido. Verifica la carga del script en el HTML.");
        return;
    }
    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    // Titulo del documento
    doc.setFontSize(18);
    doc.text("Reporte de Visita Técnica", 20, 20);

    // Información del reporte
    doc.setFontSize(12);
    doc.text(`ID del Reporte: ${id}`, 20, 30);
    doc.text(`Técnico: ${id_tecnico}`, 20, 40);
    doc.text(`Supervisor: ${id_supervisor}`, 20, 50);
    doc.text(`Fecha de Inicio: ${new Date(horaInicio).toLocaleString()}`, 20, 60);
    doc.text(`Fecha de Fin: ${new Date(horaFin).toLocaleString()}`, 20, 70);
    doc.text(`Estado: ${estado}`, 20, 80);

    
    doc.text("Descripción:", 20, 90);
    doc.text(doc.splitTextToSize(descripcion, 170), 20, 100);

    
    if (evidencia) {
        let yPos = 120; 
        let evidenciasArray = typeof evidencia === "string" ? [evidencia] : evidencia; // Convertir a array si es necesario

        evidenciasArray.forEach((imgUrl, index) => {
            if (yPos > 250) { 
                doc.addPage();
                yPos = 20;
            }

            doc.text(`Evidencia ${index + 1}:`, 20, yPos);
            yPos += 10;

            //Convertir imagen a Base64 y agregarla al PDF
            convertImageToBase64(imgUrl, (base64) => {
                doc.addImage(base64, "JPEG", 20, yPos, 80, 60);
                yPos += 70;

                // Guardar el PDF 
                if (index === evidenciasArray.length - 1) {
                    doc.save(`Reporte_${id}.pdf`);
                }
            });
        });
    } else {
        
        doc.save(`Reporte_${id}.pdf`);
    }
}

function convertImageToBase64(url, callback) {
    const img = new Image();
    img.crossOrigin = "Anonymous"; 
    img.src = url;

    img.onload = function () {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);

        const dataURL = canvas.toDataURL("image/jpeg");
        callback(dataURL);
    };

    img.onerror = function () {
        console.error("Error cargando la imagen:", url);
        callback(null); 
    };
}


// Obtener el ID del usuario 
function obtenerIdUsuario() {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.userId;  
    } catch (e) {
        console.error("Error obteniendo ID del usuario desde el token", e);
        return null;
    }
}