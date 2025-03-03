document.addEventListener('DOMContentLoaded', function () {
    let isPanelVisible = true;  // Estado inicial, el login está visible y el registro oculto

    // Lista de imágenes de fondo
    const backgrounds = [
        "https://images.unsplash.com/photo-1515266591878-f93e32bc5937?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
        "https://images.unsplash.com/photo-1486728297118-82a07bc48a28?q=80&w=1229&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
        "https://images.unsplash.com/photo-1484542603127-984f4f7d14cb?q=80&w=1265&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ];

    let index = 0;

    // Cambiar el fondo cada 15 segundos
    function changeBackground() {
        document.getElementById("background").style.backgroundImage = `url('${backgrounds[index]}')`;
        index = (index + 1) % backgrounds.length; // Ciclo infinito entre imágenes
    }

    // Llamar a la función para cambiar el fondo inmediatamente y después cada 15 segundos
    changeBackground();
    setInterval(changeBackground, 15000);

    // Inicializar los formularios
    function init() {
        const loginModule = document.querySelector('.form-module.login');
        const registerModule = document.querySelector('.form-module.register');
        const panel = document.getElementById('infoPanel');
        
        panel.style.transform = "translateX(0%)"; // El panel cubre el login
        loginModule.classList.remove('invisible'); // Mostrar el login
        registerModule.classList.add('invisible'); // Ocultar el registro
    }

    // Alternar entre Login y Registro
    function togglePanel() {
        const loginModule = document.querySelector('.form-module.login');
        const registerModule = document.querySelector('.form-module.register');
        const panel = document.getElementById('infoPanel');
        
        if (isPanelVisible) {
            panel.style.transition = "transform 0.5s ease"; // Movimiento suave
            panel.style.transform = "translateX(-104.5%)"; // Mueve el panel para cubrir el login
            loginModule.classList.add('invisible'); // Ocultar el login
            registerModule.classList.remove('invisible'); // Mostrar el registro
        } else {
            panel.style.transition = "transform 0.5s ease"; // Movimiento suave
            panel.style.transform = "translateX(0%)"; // Mueve el panel para cubrir el registro
            loginModule.classList.remove('invisible'); // Mostrar el login
            registerModule.classList.add('invisible'); // Ocultar el registro
        }

        // Alternar la visibilidad del panel
        isPanelVisible = !isPanelVisible;
    }

    // Mostrar el formulario de registro y ocultar el de login
    function goToRegister() {
        const loginModule = document.querySelector('.form-module.login');
        const registerModule = document.querySelector('.form-module.register');
        const panel = document.getElementById('infoPanel');
        
        // El panel se mueve hacia la izquierda para cubrir el login
        panel.style.transition = "transform 0.5s ease"; // Movimiento suave
        panel.style.transform = "translateX(-104.5%)";
        loginModule.classList.add('invisible'); // Ocultar el login
        registerModule.classList.remove('invisible'); // Mostrar el registro
        isPanelVisible = false; // Actualizar el estado del panel
    }

    // Mostrar el formulario de login y ocultar el de registro
    function goToLogin() {
        const loginModule = document.querySelector('.form-module.login');
        const registerModule = document.querySelector('.form-module.register');
        const panel = document.getElementById('infoPanel');
        
        // El panel se mueve hacia la derecha para cubrir el registro
        panel.style.transition = "transform 0.5s ease"; // Movimiento suave
        panel.style.transform = "translateX(0%)";
        loginModule.classList.remove('invisible'); // Mostrar el login
        registerModule.classList.add('invisible'); // Ocultar el registro
        isPanelVisible = true; // Actualizar el estado del panel
    }

    // Inicializar la vista
    init();

    // Asignar eventos a los botones
    const goToRegisterBtn = document.getElementById('goToRegisterBtn');
    const goToLoginBtn = document.getElementById('goToLoginBtn');
    
    if (goToRegisterBtn) {
        goToRegisterBtn.addEventListener("click", goToRegister);
    }

    if (goToLoginBtn) {
        goToLoginBtn.addEventListener("click", goToLogin);
    }
});