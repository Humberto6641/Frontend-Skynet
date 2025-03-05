
document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(window.location.search);

    document.getElementById("id_visita").value = params.get("id_visita");
    document.getElementById("id_tecnico").value = params.get("id_tecnico");
    document.getElementById("id_supervisor").value = params.get("id_supervisor");
    document.getElementById("horaInicio").value = new Date(params.get("horaInicio")).toLocaleString();
});

document.getElementById("formReporte").addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("id_visita", document.getElementById("id_visita").value);
    formData.append("id_tecnico", document.getElementById("id_tecnico").value);
    formData.append("id_supervisor", document.getElementById("id_supervisor").value);
    formData.append("horaInicio", document.getElementById("horaInicio").value);
    formData.append("horaFin", new Date().toISOString());
    formData.append("descripcion", document.getElementById("descripcion").value);
    formData.append("estado", document.getElementById("estado").value);
// Adjuntar el archivo de evidencia
    const evidenciaInput = document.getElementById("evidencia");
    if (evidenciaInput.files.length > 0) {
        formData.append("evidencia", evidenciaInput.files[0]); 
    }

    try {
        const response = await fetch("https://skynet-by4s.onrender.com/reportes", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: formData
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        alert("✅ Reporte enviado con éxito.");
        window.location.href = "misReportes.html";
    } catch (error) {
        console.error("Error al enviar el reporte:", error);
        alert("Hubo un error al enviar el reporte.");
    }
});











