// Función para manejar el inicio de sesión (Login)
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();  

    const correo = document.getElementById('correo').value;
    const password = document.getElementById('password').value;

    try {
        // hace la solicitud al backend 
        const response = await fetch('https://skynet-by4s.onrender.com/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token); // guarda el token
            window.location.href = '../pages/dashboard.html'; // Redirige al dashboard 
        } else {
            const errorData = await response.json();
            document.getElementById('error-message').textContent = errorData.error || 'Error desconocido';
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        document.getElementById('error-message').textContent = 'Hubo un problema con el servidor';
    }
});

// Función para manejar el registro de un nuevo usuario
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();  // 

    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correoRegistro').value;
    const telefono = document.getElementById('telefono').value;
    const password = document.getElementById('passwordRegistro').value;

    try {
        // Hace la solicitud al backend para registrar al usuario
        const response = await fetch('https://skynet-by4s.onrender.com/usuarios', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nombre, correo, telefono, password })
        });

        if (response.ok) {
            const data = await response.json();
            document.getElementById('error-message').textContent = 'Usuario registrado con éxito';
            //le redirigira al login después de registrarse:
             window.location.href = '/pages/login.html';
        } else {
            const errorData = await response.json();
            document.getElementById('error-message').textContent = errorData.error || 'Error desconocido';
        }
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        document.getElementById('error-message').textContent = 'Hubo un problema con el servidor';
    }


});

