document.addEventListener('DOMContentLoaded', function () {
    let isPanelVisible = true;  

    // imagenes de fondo
    const backgrounds = [
        "https://images.unsplash.com/photo-1515266591878-f93e32bc5937?q=80&w=987&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
        "https://images.unsplash.com/photo-1486728297118-82a07bc48a28?q=80&w=1229&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
        "https://images.unsplash.com/photo-1484542603127-984f4f7d14cb?q=80&w=1265&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ];

    let index = 0;

    
    function changeBackground() {
        document.getElementById("background").style.backgroundImage = `url('${backgrounds[index]}')`;
        index = (index + 1) % backgrounds.length; 
    }

    // gundos
    changeBackground();
    setInterval(changeBackground, 15000);

    
    function init() {
        const loginModule = document.querySelector('.form-module.login');
        const registerModule = document.querySelector('.form-module.register');
        const panel = document.getElementById('infoPanel');
        //oculta los paneles cuando el texto lo cubre
        panel.style.transform = "translateX(0%)"; //
        loginModule.classList.remove('invisible'); 
        registerModule.classList.add('invisible'); 
    }

    // Alternar entre Login y Registro
    function togglePanel() {
        const loginModule = document.querySelector('.form-module.login');
        const registerModule = document.querySelector('.form-module.register');
        const panel = document.getElementById('infoPanel');
        
        if (isPanelVisible) {
            panel.style.transition = "transform 0.5s ease"; 
            panel.style.transform = "translateX(-104.5%)"; 
            loginModule.classList.add('invisible'); 
            registerModule.classList.remove('invisible'); 
        } else {
            panel.style.transition = "transform 0.5s ease"; 
            panel.style.transform = "translateX(0%)"; 
            loginModule.classList.remove('invisible'); 
            registerModule.classList.add('invisible'); 
        }

        // Alternar la visibilidad de los paneles
        isPanelVisible = !isPanelVisible;
    }

    // Mostrar el formulario de registro y ocultar el de login
    function goToRegister() {
        const loginModule = document.querySelector('.form-module.login');
        const registerModule = document.querySelector('.form-module.register');
        const panel = document.getElementById('infoPanel');
        
        
        panel.style.transition = "transform 0.5s ease"; 
        panel.style.transform = "translateX(-104.5%)";
        loginModule.classList.add('invisible'); 
        registerModule.classList.remove('invisible'); 
        isPanelVisible = false; 
    }

    function goToLogin() {
        const loginModule = document.querySelector('.form-module.login');
        const registerModule = document.querySelector('.form-module.register');
        const panel = document.getElementById('infoPanel');
        
        // El panel se mueve hacia la derecha para cubrir el registro
        panel.style.transition = "transform 0.5s ease"; 
        panel.style.transform = "translateX(0%)";
        loginModule.classList.remove('invisible'); 
        registerModule.classList.add('invisible'); 
        isPanelVisible = true; 
    }

    // Inicializar la vista
    init();
    const goToRegisterBtn = document.getElementById('goToRegisterBtn');
    const goToLoginBtn = document.getElementById('goToLoginBtn');
    
    if (goToRegisterBtn) {
        goToRegisterBtn.addEventListener("click", goToRegister);
    }

    if (goToLoginBtn) {
        goToLoginBtn.addEventListener("click", goToLogin);
    }
});