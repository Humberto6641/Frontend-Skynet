document.addEventListener("DOMContentLoaded", () => {
    obtenerMisReportes();
});

// 🔄 Obtener ID del usuario desde el token
function obtenerIdUsuario() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No hay token disponible en localStorage.");
        return null;
    }

    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decodificar el token
        console.log("📌 Token decodificado:", payload); // Verificar estructura del token
        return payload.userId; // ✅ Mantenerlo como userId
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null;
    }
}

// 🔄 Obtener los reportes del técnico logueado
async function obtenerMisReportes() {
    const token = localStorage.getItem("token");
    const id_tecnico = obtenerIdUsuario();

    if (!id_tecnico) {
        console.error("Error: No se pudo obtener el ID del técnico.");
        return;
    }

    console.log("📌 ID Técnico obtenido:", id_tecnico); // 🔹 Verifica si realmente obtenemos el ID correcto

    try {
        const response = await fetch(`https://skynet-by4s.onrender.com/reportes/tecnico/${id_tecnico}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const reportes = await response.json();
        console.log("📌 Reportes recibidos:", reportes); // 🔹 Verifica qué devuelve la API
        mostrarMisReportes(reportes);
    } catch (error) {
        console.error("Error obteniendo reportes del técnico:", error);
    }
}

// 🔹 Mostrar los reportes en la tabla
function mostrarMisReportes(reportes) {
    const tablaBody = document.querySelector("#tablaMisReportes tbody");

    if (!tablaBody) {
        console.error("❌ Error: No se encontró el tbody de la tabla de reportes.");
        return;
    }

    tablaBody.innerHTML = ""; // Limpiar la tabla antes de agregar nuevas filas

    reportes.forEach((reporte) => {
        const fila = document.createElement("tr");

        // 🔹 Celda ID del reporte
        const celdaId = document.createElement("td");
        celdaId.innerText = reporte.id;
        fila.appendChild(celdaId);

        // 🔹 Celda ID del técnico
        const celdaIdTecnico = document.createElement("td");
        celdaIdTecnico.innerText = reporte.id_tecnico;
        fila.appendChild(celdaId);

        // 🔹 Celda Descripción
        const celdaDescripcion = document.createElement("td");
        celdaDescripcion.innerText = reporte.descripcion || "Sin descripción";
        fila.appendChild(celdaDescripcion);

        // 🔹 Celda Estado del Reporte
        const celdaEstado = document.createElement("td");
        celdaEstado.innerText = reporte.estado || "Desconocido";
        fila.appendChild(celdaEstado);

        // 🔹 Celda Hora de Inicio
        const celdaHoraInicio = document.createElement("td");
        celdaHoraInicio.innerText = reporte.horaInicio || "No registrado";
        fila.appendChild(celdaHoraInicio);

        // 🔹 Celda Hora de Fin
        const celdaHoraFin = document.createElement("td");
        celdaHoraFin.innerText = reporte.horaFin || "No registrado";
        fila.appendChild(celdaHoraFin);

        // 🔹 Celda para la evidencia
        const celdaEvidencia = document.createElement("td");
        let contenedorEvidencia = document.createElement("div");

        let evidencia = reporte.evidencia;

        if (evidencia) {
            try {
                if (typeof evidencia === "string" && evidencia.startsWith("[")) {
                    evidencia = JSON.parse(evidencia); // Parsear solo si es un array en JSON
                } else if (typeof evidencia === "string") {
                    evidencia = [evidencia]; // Convertir en array si es una única URL
                }

                if (!Array.isArray(evidencia)) {
                    evidencia = []; // Si sigue sin ser array, lo vaciamos
                }
            } catch (error) {
                console.error("Error procesando la evidencia:", error);
                evidencia = []; // Evita que la tabla falle
            }

            evidencia.forEach((item) => {
                if (typeof item !== "string" || !item.trim()) return; // Evita errores si item no es string
                
                let url = item.startsWith("http") ? item : `https://skynet-by4s.onrender.com/uploads/${item}`;
                
                const link = document.createElement("a");
                link.href = url;
                link.target = "_blank";
                link.innerText = "Ver";
                link.style.marginRight = "5px";
                contenedorEvidencia.appendChild(link);
            });
        } else {
            contenedorEvidencia.innerText = "Sin evidencia";
        }

        celdaEvidencia.appendChild(contenedorEvidencia);
        fila.appendChild(celdaEvidencia);

        // 🔹 Agregar la fila completa a la tabla
        tablaBody.appendChild(fila);
    });
}



// ✏️ Editar un reporte (Redirige a la página de edición)
function editarReporte(id_reporte) {
    window.location.href = `editarReporte.html?id=${id_reporte}`;
}