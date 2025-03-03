// Función para manejar el inicio de sesión (Login)
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();  // Evita que se recargue la página al enviar el formulario

    const correo = document.getElementById('correo').value;
    const password = document.getElementById('password').value;

    try {
        // Hacer la solicitud al backend para iniciar sesión
        const response = await fetch('https://skynet-by4s.onrender.com/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ correo, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.token); // Almacenar el token
            window.location.href = '../pages/dashboard.html'; // Redirigir al dashboard o donde sea necesario
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
    e.preventDefault();  // Evita que se recargue la página al enviar el formulario

    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correoRegistro').value;
    const telefono = document.getElementById('telefono').value;
    const password = document.getElementById('passwordRegistro').value;

    try {
        // Hacer la solicitud al backend para registrar al usuario
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
            //O redirigir al login después de registrarse:
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

