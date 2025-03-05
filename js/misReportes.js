document.addEventListener("DOMContentLoaded", () => {
    obtenerMisReportes();
});

// Obtener ID del usuario desde el token
function obtenerIdUsuario() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No hay token disponible en localStorage.");
        return null;
    }

    try {
        const payload = JSON.parse(atob(token.split(".")[1])); 
        console.log("Token decodificado:", payload); 
        return payload.userId; 
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null;
    }
}

// Obtener los reportes del tecnico logueado
async function obtenerMisReportes() {
    const token = localStorage.getItem("token");
    const id_tecnico = obtenerIdUsuario();

    if (!id_tecnico) {
        console.error("Error: No se pudo obtener el ID del técnico.");
        return;
    }

    console.log("ID Técnico obtenido:", id_tecnico); 

    try {
        const response = await fetch(`https://skynet-by4s.onrender.com/reportes/tecnico/${id_tecnico}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const reportes = await response.json();
        console.log("Reportes recibidos:", reportes); 
        mostrarMisReportes(reportes);
    } catch (error) {
        console.error("Error obteniendo reportes del técnico:", error);
    }
}

// Mostrar los reportes en la tabla
function mostrarMisReportes(reportes) {
    const tablaBody = document.querySelector("#tablaMisReportes tbody");

    if (!tablaBody) {
        console.error("Error: No se encontró el tbody de la tabla de reportes.");
        return;
    }

    tablaBody.innerHTML = ""; // Limpiar la tabla antes de agregar nuevas filas

    reportes.forEach((reporte) => {
        const fila = document.createElement("tr");

    
        const celdaId = document.createElement("td");
        celdaId.innerText = reporte.id;
        fila.appendChild(celdaId);

     
        const celdaIdTecnico = document.createElement("td");
        celdaIdTecnico.innerText = reporte.id_tecnico;
        fila.appendChild(celdaId);

        
        const celdaDescripcion = document.createElement("td");
        celdaDescripcion.innerText = reporte.descripcion || "Sin descripción";
        fila.appendChild(celdaDescripcion);

        const celdaEstado = document.createElement("td");
        celdaEstado.innerText = reporte.estado || "Desconocido";
        fila.appendChild(celdaEstado);

      
        const celdaHoraInicio = document.createElement("td");
        celdaHoraInicio.innerText = reporte.horaInicio || "No registrado";
        fila.appendChild(celdaHoraInicio);

      
        const celdaHoraFin = document.createElement("td");
        celdaHoraFin.innerText = reporte.horaFin || "No registrado";
        fila.appendChild(celdaHoraFin);

       
        const celdaEvidencia = document.createElement("td");
        let contenedorEvidencia = document.createElement("div");

        let evidencia = reporte.evidencia;

        if (evidencia) {
            try {
                if (typeof evidencia === "string" && evidencia.startsWith("[")) {
                    evidencia = JSON.parse(evidencia); 
                } else if (typeof evidencia === "string") {
                    evidencia = [evidencia]; 
                }

                if (!Array.isArray(evidencia)) {
                    evidencia = []; 
                }
            } catch (error) {
                console.error("Error procesando la evidencia:", error);
                evidencia = []; 
            }

            evidencia.forEach((item) => {
                if (typeof item !== "string" || !item.trim()) return; 
                
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

        
        tablaBody.appendChild(fila);
    });
}


//pendiente

function editarReporte(id_reporte) {
    window.location.href = `editarReporte.html?id=${id_reporte}`;
}