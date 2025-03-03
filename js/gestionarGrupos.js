// Obtener el token de autenticación
const token = localStorage.getItem('token');  

// Función para cargar los grupos
function cargarGruposYUsuarios() {
    fetch('https://skynet-by4s.onrender.com/grupos', {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (response.status === 403) {
            alert('Acceso denegado. No tienes permisos para ver los grupos.');
            throw new Error('Acceso denegado');
        }
        return response.json();
    })
    .then(grupos => {
        if (!Array.isArray(grupos)) {
            throw new Error('La respuesta no es un array de grupos');
        }
        mostrarGrupos(grupos);
    })
    .catch(error => {
        console.error('Error al cargar grupos:', error);
    });
}



// Función para cargar técnicos disponibles para un grupo específico
async function cargarTecnicosParaGrupo(grupoId) {
    try {
        const response = await fetch('https://skynet-by4s.onrender.com/usuarios/tecnicos-disponibles', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${await response.text()}`);
        }

        const tecnicos = await response.json();

        // Buscar el select específico dentro del grupo
        const selectTecnicos = document.getElementById(`tecnico-${grupoId}`);
        if (!selectTecnicos) {
            console.error(`Elemento tecnico-${grupoId} no encontrado`);
            return;
        }

        selectTecnicos.innerHTML = ''; // Limpiar el select

        tecnicos.forEach(tecnico => {
            const option = document.createElement('option');
            option.value = tecnico.id;
            option.textContent = `${tecnico.nombre} (${tecnico.correo})`;
            selectTecnicos.appendChild(option);
        });

    } catch (error) {
        console.error('Error al cargar técnicos:', error);
    }
}

// Función para asignar un técnico a un grupo
function asignarTecnico(grupoId) {
    const selectTecnicos = document.getElementById(`tecnico-${grupoId}`);
    const idTecnico = parseInt(selectTecnicos.value, 10); // Convertir a número entero

    if (!idTecnico) {
        alert('Selecciona un técnico antes de asignar.');
        return;
    }
    console.log("Enviando solicitud con:", { id_tecnico: idTecnico });
    fetch(`https://skynet-by4s.onrender.com/grupos/${grupoId}/asignar-tecnico`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Corregido
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_tecnico: idTecnico }) // Convertido a número
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(err.error || 'Error desconocido'); });
        }
        return response.json();
    })
    .then(data => {
        alert('Técnico asignado correctamente');
        mostrarGrupos(); // Volver a cargar la lista de grupos
    })
    .catch(error => {
        alert(`Error al asignar técnico: ${error.message}`);
        console.error('Error al asignar técnico:', error);
    });
}


// Cargar supervisores y grupos al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarSupervisores();
    mostrarGrupos();
});


//////////////////////CARGAR LOS SUPERVISORES PARA MOSTRARLOS EN EL SELECT
// Función para cargar supervisores y llenar el select en el formulario de creación de grupo
// Cargar supervisores en el select al crear grupo
function cargarSupervisores() {
    fetch('https://skynet-by4s.onrender.com/usuarios', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(usuarios => {
        const selectSupervisores = document.getElementById('supervisorGrupo');
        selectSupervisores.innerHTML = '';

        // Filtrar solo los supervisores
        const supervisores = usuarios.filter(user => user.rol === 'Supervisor');

        supervisores.forEach(supervisor => {
            const option = document.createElement('option');
            option.value = supervisor.id;
            option.textContent = supervisor.nombre;
            selectSupervisores.appendChild(option);
        });
    })
    .catch(error => console.error('Error al cargar supervisores:', error));
}




















































///////////////////////////////////////////////////////////////


function obtenerTecnicosDisponibles(grupoId) {
    fetch(`https://skynet-by4s.onrender.com/grupos/${grupoId}/tecnicos-disponibles`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    .then(response => response.json())  // Convertir la respuesta a JSON
    .then(data => {
        if (Array.isArray(data)) {  // Verificar si 'data' es un array
            const selectTecnicos = document.getElementById(`tecnico-${grupoId}`);
            selectTecnicos.innerHTML = '';  // Limpiar el select antes de agregar nuevos elementos

            data.forEach(tecnico => {
                const option = document.createElement('option');
                option.value = tecnico.id;
                option.textContent = tecnico.nombre;
                selectTecnicos.appendChild(option);
            });
        } else {
            console.error('Error: La respuesta no es un array de técnicos', data);
        }
    })
    .catch(error => {
        console.error('Error al obtener los técnicos:', error);
    });
}


////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////
async function mostrarGrupos(grupos) {
    const gruposContainer = document.getElementById('gruposContainer');
    gruposContainer.innerHTML = '';

    for (const grupo of grupos) {
        const nombreSupervisor = await obtenerNombreSupervisor(grupo.id_supervisor);
        const grupoDiv = document.createElement('div');
        grupoDiv.classList.add('grupo');
        grupoDiv.innerHTML = `
            <h3 contenteditable="true" onblur="editarGrupo(${grupo.id}, this.textContent, 'nombre')">${grupo.nombre}</h3>
            <p contenteditable="true" onblur="editarGrupo(${grupo.id}, this.textContent, 'descripcion')">${grupo.descripcion}</p>
            <p>Supervisor: <strong>${nombreSupervisor}</strong></p>
            <button onclick="eliminarGrupo(${grupo.id})">Eliminar Grupo</button>
            <h4>Técnicos Asignados:</h4>
            <ul id="tecnicos-lista-${grupo.id}"></ul>
            <h4>Asignar Técnico:</h4>
            <select id="tecnico-${grupo.id}"></select>
            <button onclick="asignarTecnico(${grupo.id})">Asignar</button>
        `;
        gruposContainer.appendChild(grupoDiv);
        await cargarTecnicosDelGrupo(grupo.id);
        await cargarTecnicosParaGrupo(grupo.id);
    }
}

// Función para obtener el nombre del supervisor
async function obtenerNombreSupervisor(idSupervisor) {
    try {
        const response = await fetch(`https://skynet-by4s.onrender.com/usuarios/${idSupervisor}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('No se pudo obtener el nombre del supervisor');
        }

        const supervisor = await response.json();
        return supervisor.nombre; // Suponiendo que la API devuelve { nombre: "Juan Pérez" }
    } catch (error) {
        console.error('Error al obtener supervisor:', error);
        return 'Desconocido'; // Valor por defecto en caso de error
    }
}

// Cargar técnicos de un grupo
async function cargarTecnicosDelGrupo(grupoId) {
    try {
        const response = await fetch(`https://skynet-by4s.onrender.com/grupos/${grupoId}/tecnicos`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const tecnicos = await response.json();
        const listaTecnicos = document.getElementById(`tecnicos-lista-${grupoId}`);
        listaTecnicos.innerHTML = '';

        tecnicos.forEach(tecnico => {
            const li = document.createElement('li');
            li.innerHTML = `${tecnico.nombre} (${tecnico.correo}) <button onclick="quitarTecnico(${grupoId}, ${tecnico.id})">X</button>`;
            listaTecnicos.appendChild(li);
        });
    } catch (error) {
        console.error(`Error al cargar técnicos del grupo ${grupoId}:`, error);
    }
}

// Quitar técnico de un grupo
async function quitarTecnico(grupoId, tecnicoId) {
    if (confirm('¿Seguro que quieres quitar este técnico del grupo?')) {
        try {
            await fetch(`https://skynet-by4s.onrender.com/grupos/${grupoId}/quitar-tecnico/${tecnicoId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }

            });
            
            cargarTecnicosDelGrupo(grupoId);
        } catch (error) {
            console.error('Error al quitar técnico:', error);
        }
    }
}


// Eliminar grupo
async function eliminarGrupo(grupoId) {
    if (confirm('¿Estás seguro de eliminar este grupo?')) {
        try {
            await fetch(`https://skynet-by4s.onrender.com/grupos/${grupoId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            cargarGruposYUsuarios();
        } catch (error) {
            console.error('Error al eliminar grupo:', error);
        }
    }
}

// Editar grupo (nombre o descripción)
async function editarGrupo(grupoId, nuevoValor, campo) {
    try {
        await fetch(`https://skynet-by4s.onrender.com/grupos/${grupoId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            
            body: JSON.stringify({ [campo]: nuevoValor })
        });
    } catch (error) {
        console.error(`Error al actualizar el grupo ${campo}:`, error);
    }
}



document.getElementById("formCrearGrupo").addEventListener("submit", async function (event) {
    event.preventDefault(); // Evitar el envío normal del formulario

    // Capturar los valores del formulario
    const nombre = document.getElementById("nombreGrupo").value;
    const descripcion = document.getElementById("descripcionGrupo").value;
    const id_supervisor = document.getElementById("supervisorGrupo").value;

    // Crear el objeto con los datos a enviar
    const dataToSend = {
        nombre: nombre,
        descripcion: descripcion,
        id_supervisor: id_supervisor
    
    };

    try {
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Token JWT no encontrado.");
            return;
        }

        const response = await fetch("https://skynet-by4s.onrender.com/grupos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(dataToSend)
        });

        const data = await response.json();

        if (response.ok) {
            alert("Grupo Creado correctamente.");
            document.getElementById("formCrearGrupo").reset(); // Limpiar el formulario
        } else {
            alert("Error al crear grupo: " + (data.error || data.message || "Desconocido"));
        }
    } catch (error) {
        alert("Error en la solicitud.");
        console.error(error);
    }
});





// Cargar datos cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', cargarGruposYUsuarios, cargarSupervisores );