document.addEventListener("DOMContentLoaded", () => {
    cargarReportes();
});
//Funcion para obtenr los reportes
async function cargarReportes() {
    try {
        const token = localStorage.getItem("token"); 
        const response = await fetch("https://skynet-by4s.onrender.com/reportes", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Error al obtener los reportes");
        }

        const reportes = await response.json();
        mostrarReportes(reportes);
    } catch (error) {
        console.error("Error:", error);
    }
}
//Cargar los reportes en la tabla
function mostrarReportes(reportes) {
    const tbody = document.querySelector("#reportesTable tbody");
    tbody.innerHTML = ""; 

    reportes.forEach(reporte => {
        const fila = document.createElement("tr");

        fila.innerHTML = `
            <td>${reporte.id}</td>
            <td>${reporte.id_visita}</td>
            <td>${reporte.id_tecnico}</td>
            <td>${reporte.id_supervisor}</td>
            <td>${new Date(reporte.horaInicio).toLocaleString()}</td>
            <td>${reporte.horaFin ? new Date(reporte.horaFin).toLocaleString() : "En proceso"}</td>
            <td>${reporte.descripcion}</td>
            <td>${reporte.estado}</td>
            <td>${reporte.evidencia ? `<a href="${reporte.evidencia}" target="_blank">Ver</a>` : "No adjunta"}</td>
            <td>
                <button class="eliminar-reporte" data-id="${reporte.id}">Eliminar</button>
            </td>
        `;

        tbody.appendChild(fila);
    });

    agregarEventosEliminar();
}

function agregarEventosEliminar() {
    document.querySelectorAll(".eliminar-reporte").forEach(boton => {
        boton.addEventListener("click", async (event) => {
            const id = event.target.dataset.id;
            if (confirm("¿Estás seguro de que quieres eliminar este reporte?")) {
                await eliminarReporte(id);
                cargarReportes(); 
            }
        });
    });
}

async function eliminarReporte(id) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://skynet-by4s.onrender.com/reportes/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error("Error al eliminar el reporte");
        }

        alert("Reporte eliminado exitosamente");
    } catch (error) {
        console.error("Error:", error);
        alert("No se pudo eliminar el reporte");
    }
}