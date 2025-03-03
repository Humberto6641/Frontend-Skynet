// 📌 Obtener los usuarios
async function obtenerUsuarios() {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch("https://skynet-by4s.onrender.com/usuarios", {
            headers: { "Authorization": `Bearer ${token}` }
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const usuarios = await response.json();
        mostrarUsuarios(usuarios);
    } catch (error) {
        console.error("Error obteniendo usuarios:", error);
    }
}

// 📌 Mostrar usuarios en la tabla y habilitar edición en línea
function mostrarUsuarios(usuarios) {
    const tablaBody = document.getElementById("usuariosTablaBody");
    tablaBody.innerHTML = ""; // Limpiar la tabla antes de agregar nuevas filas

    usuarios.forEach(usuario => {
        const fila = document.createElement("tr");
        fila.setAttribute("data-id", usuario.id);  // Añadir el ID a la fila para identificarlas

        fila.innerHTML = `
            <td><span class="usuario-id">${usuario.id}</span></td>
            <td><span class="usuario-nombre">${usuario.nombre}</span><input type="text" class="edit-input" value="${usuario.nombre}" style="display:none"></td>
            <td><span class="usuario-correo">${usuario.correo}</span><input type="email" class="edit-input" value="${usuario.correo}" style="display:none"></td>
            <td><span class="usuario-telefono">${usuario.telefono}</span><input type="text" class="edit-input" value="${usuario.telefono}" style="display:none"></td>
            <td><span class="usuario-rol">${usuario.rol}</span><select class="edit-input" style="display:none">
                    <option value="Técnico" ${usuario.rol === 'Técnico' ? 'selected' : ''}>Técnico</option>
                    <option value="Supervisor" ${usuario.rol === 'Supervisor' ? 'selected' : ''}>Supervisor</option>
                    <option value="Administrador" ${usuario.rol === 'Administrador' ? 'selected' : ''}>Administrador</option>
                </select>
            </td>
            <td><span class="usuario-contraseña">********</span><input type="password" class="edit-input" value="" style="display:none"></td> <!-- Campo de contraseña -->
            <td class="actions">
                <button class="btn" onclick="activarEdicion(${usuario.id}, this)">Editar</button>
                <button class="btn" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
                <button class="btn guardar" onclick="guardarEdicion(${usuario.id})" style="display:none">Guardar</button>
                <button class="btn cancelar" onclick="cancelarEdicion(${usuario.id})" style="display:none">Cancelar</button>
            </td>
        `;
        tablaBody.appendChild(fila);
    });
}


// 📌 Activar la edición de un usuario
function activarEdicion(id, button) {
    const fila = document.querySelector(`tr[data-id='${id}']`);  // Buscar la fila por el id
    if (!fila) {
        console.error("Fila no encontrada.");
        return;
    }

    // Mostrar los campos de edición
    fila.querySelector(".usuario-nombre").style.display = "none";  // Ocultar nombre
    fila.querySelector(".usuario-correo").style.display = "none";  // Ocultar correo
    fila.querySelector(".usuario-telefono").style.display = "none";  // Ocultar teléfono
    fila.querySelector(".usuario-rol").style.display = "none";  // Ocultar rol
    fila.querySelector(".usuario-contraseña").style.display = "none";  // Ocultar contraseña

    // Mostrar los inputs de edición
    fila.querySelectorAll(".edit-input").forEach(input => input.style.display = "inline-block");

    // Mostrar los botones de Guardar y Cancelar
    fila.querySelector(".guardar").style.display = "inline-block";
    fila.querySelector(".cancelar").style.display = "inline-block";
    
    // Ocultar el botón de Editar
    button.style.display = "none";
}


// 📌 Guardar los cambios de un usuario
async function guardarEdicion(id) {
    const fila = document.querySelector(`tr[data-id='${id}']`);
    if (!fila) {
        console.error("Fila no encontrada.");
        return;
    }

    const nombre = fila.querySelector("td:nth-child(2) .edit-input").value;
    const correo = fila.querySelector("td:nth-child(3) .edit-input").value;
    const telefono = fila.querySelector("td:nth-child(4) .edit-input").value;
    const rol = fila.querySelector("td:nth-child(5) select").value;
    const password = fila.querySelector("td:nth-child(6) .edit-input").value; // ✅ Ahora selecciona correctamente la contraseña

    const usuarioActualizado = {
        nombre,
        correo,
        telefono,
        rol,
        password // ✅ Ahora este campo contiene realmente la contraseña
    };

    const token = localStorage.getItem("token");
    console.log("📌 Datos enviados al backend:", usuarioActualizado);

    try {
        const response = await fetch(`https://skynet-by4s.onrender.com/usuarios/${id}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(usuarioActualizado),
        });

        if (response.ok) {
            alert("Usuario actualizado correctamente.");
            obtenerUsuarios(); // Recargar la lista de usuarios después de la actualización
        } else {
            throw new Error(`Error HTTP: ${response.status}`);
        }
    } catch (error) {
        console.error("Error actualizando usuario:", error);
        alert("Hubo un error al actualizar el usuario.");
    }
}

// 📌 Cancelar la edición
function cancelarEdicion(id) {
    const fila = document.querySelector(`tr[data-id='${id}']`);  // Buscar la fila por el id
    if (!fila) {
        console.error("Fila no encontrada.");
        return;
    }
    
    // Restaurar los valores originales y ocultar los campos de edición
    fila.querySelector(".usuario-nombre").style.display = "inline-block";
    fila.querySelector(".usuario-correo").style.display = "inline-block";
    fila.querySelector(".usuario-telefono").style.display = "inline-block";
    fila.querySelector(".usuario-rol").style.display = "inline-block";
    fila.querySelector(".usuario-contraseña").style.display = "inline-block";
    
    // Ocultar los campos de edición
    fila.querySelectorAll(".edit-input").forEach(input => input.style.display = "none");
    fila.querySelector("select").style.display = "none";

    // Ocultar botones de Guardar y Cancelar
    fila.querySelector(".guardar").style.display = "none";
    fila.querySelector(".cancelar").style.display = "none";
    
    // Mostrar botón de editar
    fila.querySelector(".btn").style.display = "inline-block";
}











// 📌 Eliminar un usuario
async function eliminarUsuario(id) {
    const token = localStorage.getItem("token");

    // Confirmar eliminación
    const confirmacion = confirm("¿Estás seguro de que deseas eliminar a este usuario?");
    if (!confirmacion) return;

    try {
        const response = await fetch(`https://skynet-by4s.onrender.com/usuarios/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            alert("Usuario eliminado exitosamente.");
            obtenerUsuarios(); // Recargar la lista de usuarios después de la eliminación
        } else {
            throw new Error(`Error HTTP: ${response.status}`);
        }
    } catch (error) {
        console.error("Error eliminando usuario:", error);
        alert("Hubo un error al eliminar el usuario.");
    }
}




// Llamar a la función al cargar la página
document.addEventListener("DOMContentLoaded", obtenerUsuarios);