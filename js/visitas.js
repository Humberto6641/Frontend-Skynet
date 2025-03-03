document.addEventListener("DOMContentLoaded", () => {
    controlarModulosSegunRol(); // 🔹 Ocultar/mostrar módulos según el rol
    obtenerClientes();
    obtenerTecnicosDelSupervisor();
    obtenerMisVisitas();
    obtenerGrupo();
    mostrarGrupo();
    mostrarVisitas();
    mostrarMisVisitas();
    mostrarTecnicos();
    actualizarUbicacionCliente();
});

// 🔹 Función para ocultar/mostrar módulos según el rol del usuario
function controlarModulosSegunRol() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decodificar token
        const rol = payload.rol; // Obtener el rol del usuario

        console.log("Rol detectado:", rol); // 👀 Verificar en consola

        // Obtener referencias a los módulos
        const moduloCrearVisita = document.getElementById("moduloCrearVisita");
        const moduloTodasVisitas = document.getElementById("moduloTodasVisitas");
        const revisaReporte = document.getElementById("revisaReporte");
        const moduloMisVisitas = document.getElementById("moduloMisVisitas");
        const moduloMiGrupo = document.getElementById("moduloMiGrupo");

        // Ocultar/mostrar según el rol
        if (rol === "TÃ©cnico") {
            moduloCrearVisita.style.display = "none";
            moduloTodasVisitas.style.display = "none";
            revisaReporte.style.display = "none";
            moduloMisVisitas.style.display = "block";
            moduloMiGrupo.style.display = "block";
        } else { // Administrador o Supervisor
            moduloCrearVisita.style.display = "block";
            moduloTodasVisitas.style.display = "block";
            revisaReporte.style.display = "block";
            moduloMisVisitas.style.display = "none";
            moduloMiGrupo.style.display = "none";
        }
    } catch (error) {
        console.error("Error procesando el rol del usuario:", error);
    }
}





/////////Crear nueva la visita
document.addEventListener("DOMContentLoaded", function () {
    const crearVisitaForm = document.getElementById("crearVisitaForm");
    const clienteSelect = document.getElementById("cliente");
    const ubicacionInput = document.getElementById("ubicacion");

    if (!crearVisitaForm) {
        console.error("No se encontró el formulario de visitas.");
        return;
    }

    // Evento para cambiar automáticamente la ubicación según el cliente seleccionado
    clienteSelect.addEventListener("change", async function () {
        const clienteId = clienteSelect.value;
        if (!clienteId) return;

        try {
            const response = await fetch(`https://skynet-by4s.onrender.com/clientes/${clienteId}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}` // 🔹 Asegura autenticación
                }
            });

            if (!response.ok) {
                throw new Error(`Error al obtener la ubicación del cliente. Código: ${response.status}`);
            }

            const cliente = await response.json();
            ubicacionInput.value = cliente.ubicacion || ""; // Asegura que no sea undefined
        } catch (error) {
            console.error("Error obteniendo ubicación del cliente:", error);
        }
    });

    // Evento de submit para crear una visita
    document.getElementById("crearVisitaForm").addEventListener("submit", async function (event) {
        event.preventDefault();
    
        const id_cliente = document.getElementById("cliente").value;
        const id_tecnico = document.getElementById("selectTecnico").value;
        const motivo = document.getElementById("motivo").value.trim();
        const tipo_servicio = document.getElementById("tipo_servicio").value;
        const fecha = document.getElementById("fecha").value;
        const estado = document.getElementById("estado").value;
        const observaciones = document.getElementById("observaciones").value.trim();
        
        let ubicacion;
        try {
            ubicacion = JSON.parse(document.getElementById("ubicacion").value.trim());
        } catch (error) {
            console.error("Error al parsear la ubicación:", error);
            alert("Ubicación inválida, intenta nuevamente.");
            return;
        }
    
        // Obtener el ID del supervisor desde el token
        let id_supervisor;
        try {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("Token no encontrado");
        
            const payload = JSON.parse(atob(token.split(".")[1])); // Decodificar JWT
            console.log("Token decodificado:", payload); // Verificar qué contiene el token
        
            id_supervisor = payload.userId; // CORRECCIÓN: Obtener `userId` en lugar de `id`
        
            if (!id_supervisor) throw new Error("ID de supervisor no disponible en el token");
        } catch (error) {
            console.error("Error obteniendo ID del supervisor:", error);
            alert("Error de autenticación. Inicia sesión nuevamente.");
            return;
        }
    
        const visitaData = {
            id_cliente,
            id_tecnico,
            id_supervisor, // 🔥 Se agrega al payload
            motivo,
            tipo_servicio,
            fecha,
            ubicacion,
            estado,
            observaciones,
        };
    
        try {
            const response = await fetch("https://skynet-by4s.onrender.com/visitas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(visitaData),
            });
    
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error al crear la visita. Código: ${response.status} - ${errorText}`);
            }
    
            alert("Visita creada correctamente.");
            this.reset();
        } catch (error) {
            console.error("Error al enviar visita:", error);
            alert("Hubo un problema al guardar la visita.");
        }
    });
});











// 🔄 Obtener ID del usuario desde el token
function obtenerIdUsuario() {
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("No hay token disponible en localStorage.");
        return null;
    }

    try {
        const payload = JSON.parse(atob(token.split(".")[1])); // Decodifica el token
        console.log("Token decodificado:", payload); // Para verificar en la consola

        return payload.userId; // Corregimos aquí para extraer 'userId' en lugar de 'id'
    } catch (error) {
        console.error("Error al decodificar el token:", error);
        return null;
    }
}
// 🔄 Obtener visitas del técnico logueado
async function obtenerMisVisitas() {
    const token = localStorage.getItem("token");
    const id_tecnico = obtenerIdUsuario();

    if (!id_tecnico) {
        console.error("Error: ID de técnico no encontrado en el token.");
        return;
    }

    try {
        const response = await fetch(`https://skynet-by4s.onrender.com/visitas/tecnico/${id_tecnico}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.statusText}`);
        }

        const visitas = await response.json();
        mostrarVisitas(visitas, "tablaMisVisitas"); // Asegúrate de tener una tabla con este ID en tu HTML
    } catch (error) {
        console.error("Error obteniendo mis visitas:", error);
    }
}

// ✅ Mostrar la información del grupo en el HTML
function mostrarGrupo(grupo) {
    const grupoInfoDiv = document.getElementById("grupoInfo");

    if (!grupoInfoDiv || !grupo) return;

    grupoInfoDiv.innerHTML = `
        <p><strong>Grupo:</strong> ${grupo.nombre_grupo || 'No disponible'}</p>
        <p><strong>Descripción:</strong> ${grupo.descripcion || 'No disponible'}</p>
        <p><strong>Supervisor:</strong> ${grupo.supervisor || 'No disponible'}</p>
    `;

    console.log("📌 Mostrando grupo en HTML:", grupo); // 👀 Verificar qué está llegando
}


// 🔄 Obtener grupo del técnico
async function obtenerGrupo() {
    const token = localStorage.getItem("token");
    const id_tecnico = obtenerIdUsuario(); // Obtener el ID del usuario logueado
    if (!id_tecnico) {
        console.error("Error: ID de técnico no encontrado en el token.");
        return;
    }

    try {
        const responseTecnicos = await fetch(`https://skynet-by4s.onrender.com/grupos/tecnico/${id_tecnico}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        console.log("Respuesta del backend:", responseTecnicos); // Imprime la respuesta

        if (!responseTecnicos.ok) {
            throw new Error(`Error HTTP: ${responseTecnicos.status}`);
        }

        const grupo = await responseTecnicos.json();
        console.log("Datos del grupo:", grupo); // Verifica los datos que llegan

        if (grupo && grupo.nombre_grupo) {
            mostrarGrupo(grupo);
        } else {
            console.error("Error: Datos de grupo no válidos.");
        }
    } catch (error) {
        console.error("Error obteniendo grupo:", error);
    }
}

function mostrarVisitas(visitas, tablaId) {
    const tablaBody = document.getElementById(tablaId);
    if (!tablaBody) {
        console.error(`Error: No se encontró la tabla con ID ${tablaId}`);
        return;
    }

    tablaBody.innerHTML = "";

    visitas.forEach(visita => {
        const fila = document.createElement("tr");

        // Verificar si la ubicación está en formato JSON
        let ubicacion = visita.ubicacion;
        if (typeof ubicacion === "string") {
            try {
                ubicacion = JSON.parse(ubicacion); // Convertir de string a objeto JSON
            } catch (error) {
                console.error("Error al parsear la ubicación:", error);
                ubicacion = null;
            }
        }

        // Si la ubicación es válida, crear un enlace a Google Maps
        let ubicacionContenido = 'Ubicación no disponible';
        if (ubicacion && ubicacion.lat && ubicacion.lng) {
            const link = document.createElement('a');
            link.href = `https://www.google.com/maps?q=${ubicacion.lat},${ubicacion.lng}`;
            link.target = '_blank'; // Abrir en una nueva pestaña
            link.textContent = 'Ver ubicación 📍'; // Texto del enlace
            link.style.color = 'blue'; // Estilo opcional
            link.style.textDecoration = 'underline';
            ubicacionContenido = link.outerHTML; // Usamos el HTML del enlace como contenido de la celda
        }

        fila.innerHTML = `
            <td>${visita.id}</td>
            <td>${visita.id_cliente}</td>
            <td>${visita.id_tecnico}</td>
            <td>${visita.motivo}</td>
            <td>${visita.tipo_servicio}</td>
            <td>${visita.fecha}</td>
            <td>${ubicacionContenido}</td> <!-- Aquí mostramos la ubicación como enlace -->
            <td>${visita.estado}</td>
            <td>${visita.observaciones}</td>
            <td>
                <button class="iniciar-reporte" data-id="${visita.id}" 
                    data-tecnico="${visita.id_tecnico}" 
                    data-supervisor="${visita.id_supervisor}">
                    Iniciar Reporte
                </button>
            </td>
            <td>
                <button onclick="editarVisita(${visita.id})">✏️ Editar</button>
            </td>
        `;
        tablaBody.appendChild(fila);
    });
    agregarEventosIniciarReporte();
}


function agregarEventosIniciarReporte() {
    document.querySelectorAll(".iniciar-reporte").forEach(boton => {
        boton.addEventListener("click", (event) => {
            const idVisita = event.target.dataset.id;
            const idTecnico = event.target.dataset.tecnico;
            const idSupervisor = event.target.dataset.supervisor;
            const horaInicio = new Date().toISOString(); // Captura la hora actual en formato ISO

            // Redirigir a infoReporte.html con los datos en la URL
            window.location.href = `infoReporte.html?id_visita=${idVisita}&id_tecnico=${idTecnico}&id_supervisor=${idSupervisor}&horaInicio=${horaInicio}`;
        });
    });
}












/////////////////////////////////////////////
////////////////////////////////////////////
///////////////////////////////////////////////
// Función que se ejecutará al cambiar el cliente seleccionado
function actualizarUbicacionCliente() {
    const selectCliente = document.getElementById('cliente');
    const inputUbicacion = document.getElementById('ubicacion');

    selectCliente.addEventListener('change', () => {
        const clienteId = selectCliente.value;
        
        // Buscar el cliente en la lista de clientes obtenida
        fetch("https://skynet-by4s.onrender.com/clientes", {
            headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
        })
        .then(response => response.json())
        .then(clientes => {
            const clienteSeleccionado = clientes.find(cliente => cliente.id == clienteId);
            if (clienteSeleccionado) {
                inputUbicacion.value = clienteSeleccionado.ubicacion || ''; // Asigna la ubicación
            }
        })
        .catch(error => console.error("Error obteniendo clientes:", error));
    });
}





//////////////////////////////////////////////////////////////////////////

///////////////////////OBTIENE LOS CLIENTES 

async function obtenerClientes() {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch("https://skynet-by4s.onrender.com/clientes", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const clientes = await response.json();

        console.log("✅ Clientes obtenidos:", clientes);

        mostrarClientes(clientes);
    } catch (error) {
        console.error("Error obteniendo clientes:", error);
    }
}



// OBTIENE LOS TECNICOS ASIGNADOS AL MISMO GRUPO QUE EL SUPERVISOR
async function obtenerTecnicosDelSupervisor() {
    const token = localStorage.getItem("token");
    const id_supervisor = obtenerIdUsuario(); // Obtiene el ID del supervisor desde el token
    if (!id_supervisor) {
        console.error("Error: ID del supervisor no encontrado en el token.");
        return;
    }

    try {
        console.log("🟡 Token enviado:", token);
        const response = await fetch(`https://skynet-by4s.onrender.com/grupos/supervisor/${id_supervisor}/tecnicos`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const tecnicos = await response.json();

        console.log("✅ Técnicos obtenidos:", tecnicos);

        mostrarTecnicos(tecnicos); // Llamar función para mostrarlos en la página
    } catch (error) {
        console.error("Error obteniendo técnicos del supervisor:", error);
    }
}





// Nueva función para cargar los clientes en el select
function cargarClientes(clientes) {
    const selectCliente = document.getElementById('cliente');
    const inputUbicacion = document.getElementById("ubicacion"); // Capturamos el input de ubicación

    if (!selectCliente || !inputUbicacion) {
        console.error("No se encontró el elemento select de clientes o el input de ubicación.");
        return;
    }

    // Limpiamos el select antes de cargar las nuevas opciones
    selectCliente.innerHTML = '';

    // Agregar la opción por defecto
    const optionDefault = document.createElement('option');
    optionDefault.value = '';
    optionDefault.textContent = 'Selecciona un Cliente';
    selectCliente.appendChild(optionDefault);

    // Llenar el select con los clientes
    clientes.forEach(cliente => {
        const option = document.createElement('option');
        option.value = cliente.id;
        option.textContent = cliente.nombre;
        option.dataset.ubicacion = cliente.ubicacion;
        selectCliente.appendChild(option);
    });

    // Evento para actualizar el campo de ubicación cuando se selecciona un cliente
    selectCliente.addEventListener("change", function () {
        const selectedOption = selectCliente.options[selectCliente.selectedIndex]; // Opción seleccionada
        const ubicacionCliente = selectedOption.dataset.ubicacion || ""; // Obtener ubicación

        inputUbicacion.value = ubicacionCliente; // Actualizar el campo de ubicación
    });

}

// Nueva función para cargar los técnicos en el select
function cargarTecnicos(tecnicos) {
    const selectTecnico = document.getElementById('selectTecnico');

    // Limpiamos el select antes de cargar las nuevas opciones
    selectTecnico.innerHTML = '';

    // Agregar la opción por defecto
    const optionDefault = document.createElement('option');
    optionDefault.value = '';
    optionDefault.textContent = 'Selecciona un Técnico';
    selectTecnico.appendChild(optionDefault);

    // Llenar el select con los técnicos
    tecnicos.forEach(tecnico => {
        const option = document.createElement('option');
        option.value = tecnico.id;
        option.textContent = tecnico.nombre;
        selectTecnico.appendChild(option);
    });
}

// Función que se encarga de obtener los clientes y cargar el select
async function obtenerYMostrarClientes() {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch("https://skynet-by4s.onrender.com/clientes", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const clientes = await response.json();

        console.log("✅ Clientes obtenidos:", clientes);

        cargarClientes(clientes); // Cargar los clientes en el select
    } catch (error) {
        console.error("Error obteniendo clientes:", error);
    }
}

// Función que se encarga de obtener los técnicos y cargar el select
async function obtenerYMostrarTecnicos() {
    const token = localStorage.getItem("token");
    const id_supervisor = obtenerIdUsuario(); // Obtiene el ID del supervisor desde el token
    if (!id_supervisor) {
        console.error("Error: ID del supervisor no encontrado en el token.");
        return;
    }

    try {
        console.log("🟡 Token enviado:", token);
        const response = await fetch(`https://skynet-by4s.onrender.com/grupos/supervisor/${id_supervisor}/tecnicos`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const tecnicos = await response.json();

        console.log("✅ Técnicos obtenidos:", tecnicos);

        cargarTecnicos(tecnicos); // Cargar los técnicos en el select
    } catch (error) {
        console.error("Error obteniendo técnicos del supervisor:", error);
    }
}



///////////////////////////////////////////
//////////////////////////////////////////
//////////////////////////////////////////

// 📌 Mostrar visitas en la tabla
let clientesCache = [];  // Para almacenar los clientes
let tecnicosCache = [];  // Para almacenar los técnicos
let supervisorCache = {};  // Para almacenar el supervisor (si es necesario)

// Función para obtener todos los clientes
async function obtenerClientes() {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch("https://skynet-by4s.onrender.com/clientes", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        clientesCache = await response.json(); // Almacenar los clientes en la cache

        console.log("✅ Clientes obtenidos:", clientesCache);
    } catch (error) {
        console.error("Error obteniendo clientes:", error);
    }
}

// Función para obtener los técnicos asignados al supervisor
async function obtenerTecnicosDelSupervisor() {
    const token = localStorage.getItem("token");
    const id_supervisor = obtenerIdUsuario(); // Obtiene el ID del supervisor desde el token
    if (!id_supervisor) {
        console.error("Error: ID del supervisor no encontrado en el token.");
        return;
    }

    try {
        const response = await fetch(`https://skynet-by4s.onrender.com/grupos/supervisor/${id_supervisor}/tecnicos`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        tecnicosCache = await response.json(); // Almacenar los técnicos en la cache

        console.log("✅ Técnicos obtenidos:", tecnicosCache);
    } catch (error) {
        console.error("Error obteniendo técnicos del supervisor:", error);
    }
}

// Función para obtener el nombre del supervisor
async function obtenerSupervisor(id_supervisor) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`https://skynet-by4s.onrender.com/usuarios/${id_supervisor}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const supervisor = await response.json(); // Almacenar el supervisor
        supervisorCache = supervisor;

        console.log("✅ Supervisor obtenido:", supervisorCache);
    } catch (error) {
        console.error("Error obteniendo supervisor:", error);
    }
}

// Función para obtener el nombre de un cliente desde su ID
function obtenerClienteNombre(id_cliente) {
    const cliente = clientesCache.find(cliente => cliente.id === id_cliente);
    return cliente ? cliente.nombre : "Desconocido";
}

// Función para obtener el nombre de un técnico desde su ID
function obtenerTecnicoNombre(id_tecnico) {
    const tecnico = tecnicosCache.find(tecnico => tecnico.id === id_tecnico);
    return tecnico ? tecnico.nombre : "Desconocido";
}

// Función para obtener el nombre del supervisor desde su ID
function obtenerSupervisorNombre(id_supervisor) {
    return supervisorCache && supervisorCache.id === id_supervisor ? supervisorCache.nombre : "Desconocido";
}

// Función para cargar las visitas en la tabla
function cargarVisitas(visitas) {
    const tablaVisitasBody = document.getElementById('todasVisitasTablaBody');

    // Limpiar la tabla antes de cargar las nuevas visitas
    tablaVisitasBody.innerHTML = '';

    // Verificar si hay visitas
    if (visitas.length === 0) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 10; // Número de columnas en la tabla (ahora 10)
        cell.textContent = 'No hay visitas registradas';
        row.appendChild(cell);
        tablaVisitasBody.appendChild(row);
        return;
    }

    // Recorrer las visitas y crear filas en la tabla
    visitas.forEach(visita => {
        const row = document.createElement('tr');

        
        // Crear las celdas para cada columna
        const cellId = document.createElement('td');
        cellId.textContent = visita.id;

        const cellCliente = document.createElement('td');
        cellCliente.textContent = obtenerClienteNombre(visita.id_cliente); // Mostrar nombre del cliente

        const cellTecnico = document.createElement('td');
        cellTecnico.textContent = obtenerTecnicoNombre(visita.id_tecnico); // Mostrar nombre del técnico

        const cellSupervisor = document.createElement('td');
        cellSupervisor.textContent = obtenerSupervisorNombre(visita.id_supervisor); // Mostrar nombre del supervisor

        const cellMotivo = document.createElement('td');
        cellMotivo.textContent = visita.motivo;

        const cellTipoServicio = document.createElement('td');
        cellTipoServicio.textContent = visita.tipo_servicio;

        const cellFecha = document.createElement('td');
        cellFecha.textContent = visita.fecha;

        const cellUbicacion = document.createElement('td');

        // Verificar si la ubicación está en formato JSON
        let ubicacion = visita.ubicacion;
        if (typeof ubicacion === "string") {
            try {
                ubicacion = JSON.parse(ubicacion); // Convertir de string a objeto JSON
            } catch (error) {
                console.error("Error al parsear la ubicación:", error);
                ubicacion = null;
            }
        }
        
        // Si la ubicación es válida, crear el enlace a Google Maps
        if (ubicacion && ubicacion.lat && ubicacion.lng) {
            const link = document.createElement('a');
            link.href = `https://www.google.com/maps?q=${ubicacion.lat},${ubicacion.lng}`;
            link.target = '_blank'; // Abrir en una nueva pestaña
            link.textContent = 'Ver ubicación 📍'; // Texto del enlace
            link.style.color = 'blue'; // Estilo opcional
            link.style.textDecoration = 'underline';
            cellUbicacion.appendChild(link);
        } else {
            cellUbicacion.textContent = 'Ubicación no disponible';
        }

        const cellEstado = document.createElement('td');
        cellEstado.textContent = visita.estado;

        const cellObservaciones = document.createElement('td');
        cellObservaciones.textContent = visita.observaciones;

        const cellAcciones = document.createElement('td');
        const btnVer = document.createElement('button');
        btnVer.textContent = 'Ver';
        btnVer.onclick = () => verDetalles(visita.id); // Función para ver detalles de la visita (opcional)
        cellAcciones.appendChild(btnVer);

        // Agregar las celdas a la fila
        row.appendChild(cellId);
        row.appendChild(cellCliente);
        row.appendChild(cellTecnico);
        row.appendChild(cellSupervisor);
        row.appendChild(cellMotivo);
        row.appendChild(cellTipoServicio);
        row.appendChild(cellFecha);
        row.appendChild(cellUbicacion);
        row.appendChild(cellEstado);
        row.appendChild(cellObservaciones);
        row.appendChild(cellAcciones);

        // Agregar la fila a la tabla
        tablaVisitasBody.appendChild(row);
    });
}

// Función para obtener todas las visitas desde la API
async function obtenerVisitas() {
    const token = localStorage.getItem("token");

    // Primero obtenemos los clientes y técnicos, luego las visitas
    await obtenerClientes();
    await obtenerTecnicosDelSupervisor();

    const id_supervisor = obtenerIdUsuario();
    if (id_supervisor) {
        await obtenerSupervisor(id_supervisor);
    }

    try {
        const response = await fetch("https://skynet-by4s.onrender.com/visitas", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
        
        const visitas = await response.json();

        console.log("✅ Visitas obtenidas:", visitas);

        cargarVisitas(visitas); // Llamar a la función para cargar las visitas en la tabla
    } catch (error) {
        console.error("Error obteniendo visitas:", error);
    }
}











document.addEventListener("DOMContentLoaded",obtenerVisitas(), mostrarVisitas, obtenerYMostrarClientes(), obtenerYMostrarTecnicos()); // ✅ Llamar cuando el DOM esté listo