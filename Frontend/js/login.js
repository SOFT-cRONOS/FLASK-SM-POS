window.onload = function(){
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('id');


    var loginColapse = document.getElementById('login-colapse');
    loginColapse.style.maxWidth = '50%'
    loginColapse.classList.add('show-active');

    var registerColapse = document.getElementById('register-colapse');
    registerColapse.style.maxWidth = '0%';

    var msgCount = document.getElementById('msgCount');
    
    var btnRegLogChange = document.getElementById('register');
    register.addEventListener('click', function() {
        if (loginColapse.style.maxWidth === '0%') {
            /* reduzco la ventana registro */
            registerColapse.style.maxWidth = '0%';
            /* apago los botones */
            btnRegLogChange.style.opacity = '0%';
            msgCount.style.opacity = '0%';
            setTimeout( function () {
              /* Cmbio el texto de los botones  */
              btnRegLogChange.textContent = 'Registrarme';
              msgCount.textContent = 'No tienes una cuenta?';
              /* maximiso ventana login  */
              loginColapse.style.maxWidth = '50%';
            }, 500)
            setTimeout( function () {
              /* prendo los botones */
              msgCount.style.opacity = '100%';
              btnRegLogChange.style.opacity = '100%';
            }, 500)

        } else {
            /* animateCollapse(loginColapse, 300, 0);
            animateCollapse(registerColapse, 300, 70); */
            loginColapse.style.maxWidth = '0%';
            btnRegLogChange.style.opacity = '0%';
            msgCount.style.opacity = '0%';
            setTimeout( function () {
            btnRegLogChange.textContent = 'Login';
            msgCount.textContent = 'tienes cuenta?'
            registerColapse.style.maxWidth = '70%';
            }, 500)
            setTimeout( function () {
              msgCount.style.opacity = '100%';
              btnRegLogChange.style.opacity = '100%';
            }, 500)
        }
    });


}


function animateCollapse(element, duration, targetWidth) {
    var startWidth = parseFloat(element.style.maxWidth);
    var startTime = null;

    function easeInOutQuad(t) {
        return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
    }

    function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = timestamp - startTime;
        var percentage = Math.min(progress / duration, 1);

        // Aplica el ancho máximo con la función de tiempo ease-in-out
        element.style.maxWidth = startWidth + (targetWidth - startWidth) * easeInOutQuad(percentage) + '%';

        if (progress < duration) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}


/*---- Funciones de logeo - login funcitions -----*/

//funcion logeo, pidiendo token. (boton entrar)
// Funcion boton Login.
var btnLogin = document.getElementById('btnlogin');

function credencialLogin  () {
    /* event.preventDefault(); */
    console.log('caca')
    localStorage.removeItem('authToken');
  
    const username = document.getElementById('nik').value;
    const password = document.getElementById('pass').value;
    
    let url = `${urlServidorAPI}/login`;
    let method = 'POST';
    
    const data = { "username": username, "password": password };
    console.log(data)
    console.log("probando conexion");
    const response = fetch(url, {
      method,
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });

    console.log(response.status);
    if (response.status === 200) {
      const result = response.json();
  
      const token = result.token;
  
      localStorage.setItem('token', token);
  
      window.location.href = 'index.html';
    } else {
      alert('Datos incorrectos');
    }

}

btnLogin.addEventListener('click', login); 

function login() {
    console.log("hola");
    // Limpia el mensaje de la interfaz.
    document.getElementById('message').innerHTML = '';

    // Obtiene el nombre de usuario y la contraseña del formulario.
    const username = document.getElementById('nik').value;
    const password = document.getElementById('pass').value;
    var msgError = document.getElementById('msgError');

    // Verificar si están en blanco
    if (username === '' && password === '') {
        msgError.innerText = 'Completar el Nick y la contraseña';
    } else if (username === '') {
        msgError.innerText = 'Completar el Nick';
    } else if (password === '') {
        msgError.innerText = 'Ingrese una contraseña';
    } else {
        // post
        msgError.innerText = '';
        console.log('conecto to:', urlServidorAPI);
        credencialLogin();
}




}
//funcion deslogeo 
function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('id');
    window.location.href = "login.html";
}
