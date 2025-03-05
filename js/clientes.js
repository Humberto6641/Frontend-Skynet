document.addEventListener("DOMContentLoaded", () => {
    checkAuthentication(); 
    obtenerClientes(); 
});
document.addEventListener("DOMContentLoaded", function () {
    console.log("✅ DOM cargado correctamente");


    ////////////////////////////////Mapa 
    ////////////////////////////////14.639505, -90.518479 por defecto ciudad capital
    var map = L.map('map').setView([14.639505, -90.518479], 13); 

    // Agregar capa de mapa utilizando (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Marcador inicial
    var marker = L.marker([14.639505, -90.518479], { draggable: true }).addTo(map);

    // se aasegura de actualizar coordenadas cuando se mueve el marcador
    marker.on('dragend', function (event) {
        var latlng = event.target.getLatLng();
        document.getElementById("latitud").value = latlng.lat;
        document.getElementById("longitud").value = latlng.lng;
    });

    // toma las coordenadas al hacer clic en el mapa
    map.on('click', function (event) {
        var latlng = event.latlng;
        marker.setLatLng(latlng);
        document.getElementById("latitud").value = latlng.lat;
        document.getElementById("longitud").value = latlng.lng;
    });
});


document.getElementById("clienteForm").addEventListener("submit", async function (event) {
    event.preventDefault(); 

   
    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const telefono = document.getElementById("telefono").value;
    const direccion = document.getElementById("direccion").value;
    const latitud = document.getElementById("latitud").value;
    const longitud = document.getElementById("longitud").value;

    // Validar coordenadas
    if (!latitud || !longitud || isNaN(latitud) || isNaN(longitud)) {
        alert("Por favor selecciona una ubicación válida en el mapa.");
        return; // Si las coordenadas no son válidas, no enviamos
    }

    // Crear el objeto con los datos a enviar
    const dataToSend = {
        nombre: nombre,
        correo: correo,
        telefono: telefono,
        direccion: direccion,
        ubicacion: { lat: parseFloat(latitud), lng: parseFloat(longitud) }
    };

    try {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Token JWT no encontrado.");
            return;
        }

        const response = await fetch("https://skynet-by4s.onrender.com/clientes", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(dataToSend)
        });

        const data = await response.json();

        if (response.ok) {
            alert("Cliente agregado correctamente.");
            document.getElementById("clienteForm").reset(); // Limpiar el formulario
        } else {
            alert("Error al agregar cliente: " + (data.error || data.message || "Desconocido"));
        }
    } catch (error) {
        alert("Error en la solicitud.");
        console.error(error);
    }
});




//obtiene tods los clientes
async function obtenerClientes() {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch("https://skynet-by4s.onrender.com/clientes", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const clientes = await response.json();
        mostrarClientes(clientes);
    } catch (error) {
        console.error("Error obteniendo clientes:", error);
    }
}

// Llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded", obtenerClientes);

// mostrar clientes en la tabla y habilitar edición en línea
function mostrarClientes(clientes) {
    const tablaBody = document.getElementById("clientesTablaBody");
    tablaBody.innerHTML = ""; // Limpiar la tabla antes de agregar nuevas filas

    clientes.forEach(cliente => {
        const fila = document.createElement("tr");
        fila.setAttribute("data-id", cliente.id);  // Añadir el ID a la fila para identificarlas

        fila.innerHTML = `
            
            <td><span class="cliente-nombre">${cliente.nombre}</span><input type="text" class="edit-input" value="${cliente.nombre}" style="display:none"></td>
            <td><span class="cliente-correo">${cliente.correo}</span><input type="email" class="edit-input" value="${cliente.correo}" style="display:none"></td>
            <td><span class="cliente-telefono">${cliente.telefono}</span><input type="text" class="edit-input" value="${cliente.telefono}" style="display:none"></td>
            <td><span class="cliente-direccion">${cliente.direccion}</span><input type="text" class="edit-input" value="${cliente.direccion}" style="display:none"></td>
            <td class="actions">
                <button class="btn" onclick="activarEdicionCliente(${cliente.id}, this)">Editar</button>
                <button class="btn" onclick="eliminarCliente(${cliente.id})">Eliminar</button>
                <button class="btn guardar" onclick="guardarEdicionCliente(${cliente.id})" style="display:none">Guardar</button>
                <button class="btn cancelar" onclick="cancelarEdicionCliente(${cliente.id})" style="display:none">Cancelar</button>
            </td>
        `;
        tablaBody.appendChild(fila);
    });
}


//Activar la edicion de un cliente
function activarEdicionCliente(id, button) {
    const fila = document.querySelector(`tr[data-id='${id}']`); 
    if (!fila) {
        console.error("Fila no encontrada.");
        return;
    }

    // Mostrar los campos de edicion
    fila.querySelector(".cliente-nombre").style.display = "none";
    fila.querySelector(".cliente-correo").style.display = "none";
    fila.querySelector(".cliente-telefono").style.display = "none";
    fila.querySelector(".cliente-direccion").style.display = "none";

    // Mostrar los inputs de edición
    fila.querySelectorAll(".edit-input").forEach(input => input.style.display = "inline-block");

    // Mostrar los botones de Guardar y Cancelar
    fila.querySelector(".guardar").style.display = "inline-block";
    fila.querySelector(".cancelar").style.display = "inline-block";
    
    // Ocultar el boton de Editar
    button.style.display = "none";
}

// guardar la edición de un cliente
async function guardarEdicionCliente(id) {
    const fila = document.querySelector(`tr[data-id='${id}']`);  
    if (!fila) {
        console.error("Fila no encontrada.");
        return;
    }

    // Obtener los nuevos valores de los campos de entrada
    const nombre = fila.querySelector(".edit-input:nth-child(1)").value;
    const correo = fila.querySelector(".edit-input:nth-child(2)").value;
    const telefono = fila.querySelector(".edit-input:nth-child(3)").value;
    const direccion = fila.querySelector(".edit-input:nth-child(4)").value;

    // Llamar a la API para actualizar el cliente
    const response = await fetch(`https://skynet-by4s.onrender.com/clientes/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({ nombre, correo, telefono, direccion })
    });

    if (response.ok) {
        alert('Cliente actualizado correctamente');
        obtenerClientes();  
    } else {
        alert('Error al actualizar cliente');
    }
}

//Cancelar la edicion de un cliente
function cancelarEdicionCliente(id) {
    const fila = document.querySelector(`tr[data-id='${id}']`);  
    if (!fila) {
        console.error("Fila no encontrada.");
        return;
    }

    // Restaurar los valores originales de los campos
    fila.querySelector(".cliente-nombre").style.display = "inline-block";
    fila.querySelector(".cliente-correo").style.display = "inline-block";
    fila.querySelector(".cliente-telefono").style.display = "inline-block";
    fila.querySelector(".cliente-direccion").style.display = "inline-block";

    // Ocultar los campos de edicion
    fila.querySelectorAll(".edit-input").forEach(input => input.style.display = "none");
    // Ocultar botones de Guardar y Cancelar
    fila.querySelector(".guardar").style.display = "none";
    fila.querySelector(".cancelar").style.display = "none";
    fila.querySelector(".btn").style.display = "inline-block";
}










// Asigna la función al formulario
document.getElementById("clienteForm").addEventListener("submit", agregarCliente);

//////////// actualizar al editar un cliente
async function editarCliente(id) {
    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://skynet-by4s.onrender.com/clientes/${id}`, {
            method: "GET",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const cliente = await response.json();

        if (response.ok) {
            document.getElementById("nombre").value = cliente.nombre;
            document.getElementById("correo").value = cliente.correo;
            document.getElementById("telefono").value = cliente.telefono;
            document.getElementById("direccion").value = cliente.direccion;
            document.getElementById("clienteId").value = cliente.id;
        } else {
            alert("Error al obtener cliente: " + cliente.error);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}

// Actualizar cliente
async function actualizarCliente(event) {
    event.preventDefault();

    const id = document.getElementById("clienteId").value;
    const nombre = document.getElementById("nombre").value;
    const correo = document.getElementById("correo").value;
    const telefono = document.getElementById("telefono").value;
    const direccion = document.getElementById("direccion").value;

    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://skynet-by4s.onrender.com/clientes/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ nombre, correo, telefono, direccion })
        });

        const data = await response.json();

        if (response.ok) {
            alert("Cliente actualizado correctamente");
            obtenerClientes(); 
            document.getElementById("clienteForm").reset();
        } else {
            alert("Error al actualizar cliente: " + data.error);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}

//Eliminar un cliente
async function eliminarCliente(id) {
    if (!confirm("¿Estás seguro de eliminar este cliente?")) return;

    try {
        const token = localStorage.getItem("token");
        const response = await fetch(`https://skynet-by4s.onrender.com/clientes/${id}`, {
            method: "DELETE",
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (response.ok) {
            alert("Cliente eliminado correctamente");
            obtenerClientes(); 
        } else {
            alert("Error al eliminar cliente");
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
    }
}
