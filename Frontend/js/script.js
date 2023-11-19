//######################################################################
//#####################   Funciones Api     ############################
//######################################################################
window.servidorURL = 'http://127.0.0.1:4500';


//         ----------------------------------------------------
//####################### Funciones cliente ############################
// Función para cargar la lista de clientes desde la API
//separar la funcion getCLient de otra q genere la tabla
        function getClient(){
            // config de token
            const id = localStorage.getItem('id');
            const token = localStorage.getItem('token')

            const requestOptions = {
            method : 'GET',
            headers:{
                'Content-Type': 'application/json',
                'x-access-token': token,
                'user-id': id
                }
            }
            // fin config de token
            
            //lectura elementos html
            const nuevoClienteForm = document.getElementById('nuevo-cliente-form');
            const tabla = document.getElementById('tabla-clientes');
            const tbody = document.getElementById('datos-tabla-clientes');

        fetch(`http://127.0.0.1:4500/client/${id}/getall`, requestOptions).then(
            resp => {return resp.json()}
        ).then(
            resp => {console.log(resp)

                //action
                // Vaciar todas las filas del <tbody>
                while (tbody.firstChild) {
                    tbody.removeChild(tbody.firstChild);
                }
                resp.forEach((cliente) => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${cliente.id_cliente}</td>
                        <td>${cliente.dni}</td>
                        <td>${cliente.apellido}</td>
                        <td>${cliente.nombre}</td>
                        <td>
                        <a href="#" class="btn btn-primary" onclick="editClient(${cliente.id_cliente})">Editar</a>
                        <a href="#" class="btn btn-secondary" onclick="bajaClint(${cliente.id_cliente})">Baja</a>
                        </td>
                    `;
                    tbody.appendChild(fila);
                });

            }

        )
        }


        //Funcion para obtener datos de un cliente por id
        function get_client_byid(id_cliente){
                // config de token
                const id = localStorage.getItem('id');
                const token = localStorage.getItem('token')

                const requestOptions = {
                method : 'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                    'user-id': id
                    }
                }
                // fin config de token

                //lectura elementos html
                //Retorna la respuesta
                return fetch(`http://127.0.0.1:4500/client/${id}/byid/${id_cliente}`, requestOptions)
                .then(resp => {
                    return resp.json()
                })
                .catch(error => {
                    console.error('Error al obtener datos del cliente:', error);
                    throw error; // devuelve error
                });  
        }

        //Funcion para obtener datos de un cliente por id
        function get_client_dni(dni){
            // config de token
            const id = localStorage.getItem('id');
            const token = localStorage.getItem('token')

            const requestOptions = {
            method : 'GET',
            headers:{
                'Content-Type': 'application/json',
                'x-access-token': token,
                'user-id': id
                }
            }
            // fin config de token

            //lectura elementos html
            //Retorna la respuesta
            return fetch(`http://127.0.0.1:4500/client/${id}/bydni/${dni}`, requestOptions)
            .then(resp => {
                return resp.json()
            })
            .catch(error => {
                console.error('Error al obtener datos del cliente:', error);
                throw error; // devuelve error
            });  
        }

        //Funcion ventana Nuevo Cliente
        function newClient(id_cliente){
            // Muestra el modal usando JavaScript
            //primero busca el modal de nuevo usuario clientForm
            var myModal = new bootstrap.Modal(document.getElementById('clientForm'), {
            backdrop: 'static', //que no se cierre al hacer click
            keyboard: false //que no se cierra al tocar esc
            });

            // Llama al método 'show' para mostrar el modal
            myModal.show();

                //busca los campos por id
                // Selecciona el formulario y los campos relevantes
                const titulo = document.getElementById("clientFormLabel"); //titulo del modal
                const form = document.getElementById('formClient');
                const nickInput = document.getElementById('nick');
                const emailInput = document.getElementById('email');
                const nombreInput = document.getElementById('nombre');
                const apellidoInput = document.getElementById('apellido');
                const dni = document.getElementById('dni');
                // Vaciar todas los input del form

                // cargar el form con los datos del usuario
                titulo.innerText = "Nuevo Cliente";
                //nickInput.value = resp.nick;
                //emailInput.value = resp.email;
                nombreInput.value = "";
                apellidoInput.value = "";
                dni.value = "";  
        }
        //Funcion ventana para editar un cliente
        function editClient(id_cliente){
            // Muestra el modal usando JavaScript
            //primero busca el modal de nuevo usuario clientForm
            var myModal = new bootstrap.Modal(document.getElementById('clientForm'), {
            backdrop: 'static', //que no se cierre al hacer click
            keyboard: false //que no se cierra al tocar esc
            });

            // Llama al método 'show' para mostrar el modal
            myModal.show();
            //llena el form del modal con los datos del servidor
            get_client_byid(id_cliente)
            .then(resp => {
                console.log(resp)
                //action
                //busca los campos por id
                const titulo = document.getElementById("clientFormLabel"); //titulo del modal
                const form = document.getElementById('formClient');
                const nickInput = document.getElementById('nick');
                const emailInput = document.getElementById('email');
                const nombreInput = document.getElementById('nombre');
                const apellidoInput = document.getElementById('apellido');
                const dni = document.getElementById('dni');
                // Vaciar todas los input del form

                // cargar el form con los datos del usuario
                titulo.innerText = "Editando Cliente";
                //nickInput.value = resp.nick;
                //emailInput.value = resp.email;
                nombreInput.value = resp.nombre;
                apellidoInput.value = resp.apellido;
                dni.value = resp.dni;

            })    
        }

        //Funcion para guardar datos de un cliente
        function saveCLient() {
            // config de token
            const id = localStorage.getItem('id');
            const token = localStorage.getItem('token')
            // fin config de token

            //Lee los datos del input
            //busca los campos por id
            // Selecciona el formulario y los campos relevantes
            const titulo = document.getElementById("clientFormLabel"); //titulo del modal
            const form = document.getElementById('formClient');
            const nickInput = document.getElementById('nick');
            const emailInput = document.getElementById('email');
            const nombreInput = document.getElementById('nombre');
            const apellidoInput = document.getElementById('apellido');
            const dni = document.getElementById('dni');


            
            if (titulo.innerText.trim() === 'Nuevo Cliente') {
                const requestOptions = {
                    method : 'POST',
                    headers:{
                        'Content-Type': 'application/json',
                        'x-access-token': token,
                        'user-id': id
                        },
                    body: JSON.stringify({
                        nombre: nombreInput.value,
                        apellido: apellidoInput.value,
                        dni: dni.value,
                    }),
                    }
                fetch(`http://127.0.0.1:4500/client/${id}/save`, requestOptions)
                .then(
                resp => {
                    return resp.json()
                })
                .then(resp => {
                    console.log(resp)
                    //action del fetch
                    //recargar tabla
                    getClient()
                    //fin action del fetch
                })
            } else {
                //primero obtengo el id del cliente
                get_client_dni(dni.value)
                .then(resp => {
                    const requestOptions = {
                        method : 'PUT',
                        headers:{
                            'Content-Type': 'application/json',
                            'x-access-token': token,
                            'user-id': id
                            },
                        body: JSON.stringify({
                            nombre: nombreInput.value,
                            apellido: apellidoInput.value,
                            dni: dni.value,
                        })}
                    console.log(token)
                    fetch(`http://127.0.0.1:4500/client/${id}/update/${resp.id_cliente}`, requestOptions)
                    .then(
                    respa => {
                        return respa.json()
                    })
                    .then(respa => {
                        console.log(respa)
                        //action del fetch
                        //cierra la ventana modal
                        // Obtén el modal por su ID y ejecuta el boton cerrar 
                        document.getElementById('clientForm').querySelector('.btn-close').click();
                        //recargar tabla
                        getClient();
                        //fin action del fetch
                    })
                    .catch((error) => console.error('Error al agregar cliente:', error));
                })
            }
        }
//Funcion para dar de baja un cliente
//######################################################################
//####################### Funciones cliente ############################
//######################################################################

//         ----------------------------------------------------

//######################################################################
//####################### Funciones Item ############################
//######################################################################
        // Función todos los items
        function getItem(){
            // config de token
            const id = localStorage.getItem('id');
            const token = localStorage.getItem('token')

            const requestOptions = {
            method : 'GET',
            headers:{
                'Content-Type': 'application/json',
                'x-access-token': token,
                'user-id': id
                }
            }
            // fin config de token
            


        return fetch(`http://127.0.0.1:4500/item/${id}/getall`, requestOptions)
        .then(
            resp => {return resp.json()
            })
        .catch(error => {
            console.error('Error al obtener datos del cliente:', error);
            throw error; // devuelve error
        }); 
        }

        //Funcion para obtener datos de un item por id
        function get_item_byid(id_item){
                // config de token
                const id = localStorage.getItem('id');
                const token = localStorage.getItem('token')

                const requestOptions = {
                method : 'GET',
                headers:{
                    'Content-Type': 'application/json',
                    'x-access-token': token,
                    'user-id': id
                    }
                }
                // fin config de token

                //lectura elementos html
                //Retorna la respuesta
                return fetch(`http://127.0.0.1:4500/item/${id}/byid/${id_item}`, requestOptions)
                .then(resp => {
                    return resp.json()
                })
                .catch(error => {
                    console.error('Error al obtener datos del item:', error);
                    throw error; // devuelve error
                });  
        }

        //Funcion para obtener datos de un item por codigo
        function get_client_code(code){
            // config de token
            const id = localStorage.getItem('id');
            const token = localStorage.getItem('token')

            const requestOptions = {
            method : 'GET',
            headers:{
                'Content-Type': 'application/json',
                'x-access-token': token,
                'user-id': id
                }
            }
            // fin config de token

            //lectura elementos html
            //Retorna la respuesta
            return fetch(`http://127.0.0.1:4500/item/${id}/bycode/${code}`, requestOptions)
            .then(resp => {
                return resp.json()
            })
            .catch(error => {
                console.error('Error al obtener datos del cliente:', error);
                throw error; // devuelve error
            });  
        }

        //Funcion ventana Nuevo item
        function newItem(id_item){
            // Muestra el modal usando JavaScript
            //primero busca el modal de nuevo usuario itemForm
            var myModal = new bootstrap.Modal(document.getElementById('itemForm'), {
            backdrop: 'static', //que no se cierre al hacer click
            keyboard: false //que no se cierra al tocar esc
            });

            // Llama al método 'show' para mostrar el modal
            myModal.show();

                //busca los campos por id
                // Selecciona el formulario y los campos relevantes
                const titulo = document.getElementById("itemFormLabel"); //titulo del modal
                const form = document.getElementById('formItem');
                const nombre = document.getElementById('nombre');
                const detalle = document.getElementById('detalle');
                const cantidad = document.getElementById('cantidad');
                const compra = document.getElementById('compra');
                const venta = document.getElementById('venta');
                
                // Vaciar todas los input del form

                // cargar el form con los datos del usuario
                titulo.innerText = "Nuevo Item";
                nombre.value = "";
                detalle.value = "";
                cantidad.value = "";
                compra.value = "";  
                venta.value = ""
        }

        //Funcion ventana para editar un item
        function editItem(id_item){
            // Muestra el modal usando JavaScript
            //primero busca el modal de nuevo usuario clientForm
            var myModal = new bootstrap.Modal(document.getElementById('clientForm'), {
            backdrop: 'static', //que no se cierre al hacer click
            keyboard: false //que no se cierra al tocar esc
            });

            // Llama al método 'show' para mostrar el modal
            myModal.show();
            //llena el form del modal con los datos del servidor
            get_client_byid(id_item)
            .then(resp => {
                console.log(resp)
                //action
                //busca los campos por id
                const titulo = document.getElementById("clientFormLabel"); //titulo del modal
                const form = document.getElementById('formClient');
                const nickInput = document.getElementById('nick');
                const emailInput = document.getElementById('email');
                const nombreInput = document.getElementById('nombre');
                const apellidoInput = document.getElementById('apellido');
                const dni = document.getElementById('dni');
                // Vaciar todas los input del form

                // cargar el form con los datos del usuario
                titulo.innerText = "Editando Cliente";
                //nickInput.value = resp.nick;
                //emailInput.value = resp.email;
                nombreInput.value = resp.nombre;
                apellidoInput.value = resp.apellido;
                dni.value = resp.dni;

            })    
        }

        //Funcion para guardar datos de un item
        function saveItem() {
            // config de token
            const id = localStorage.getItem('id');
            const token = localStorage.getItem('token')
            // fin config de token

            //Lee los datos del input
            //busca los campos por id
            // Selecciona el formulario y los campos relevantes
            const titulo = document.getElementById("itemFormLabel"); //titulo del modal
            const form = document.getElementById('formItem');
            const nombre = document.getElementById('nombre');
            const detalle = document.getElementById('detalle');
            const cantidad = document.getElementById('cantidad');
            const compra = document.getElementById('compra');
            const venta = document.getElementById('venta');


            
            if (titulo.innerText.trim() === 'Nuevo Cliente') {
                const requestOptions = {
                    method : 'POST',
                    headers:{
                        'Content-Type': 'application/json',
                        'x-access-token': token,
                        'user-id': id
                        },
                    body: JSON.stringify({
                        nombre: nombre.value,
                        detalle: detalle.value,
                        cantidad: cantidad.value,
                        compra : compra.value,
                        venta : venta.value
                    }),
                    }
                fetch(`http://127.0.0.1:4500/item/${id}/save`, requestOptions)
                .then(
                resp => {
                    return resp.json()
                })
                .then(resp => {
                    console.log(resp)
                    //action del fetch
                    //recargar tabla
                    loadTablaItem()
                    //fin action del fetch
                })
            } else {
                //primero obtengo el id del cliente
                get_client_dni(dni.value)
                .then(resp => {
                    const requestOptions = {
                        method : 'PUT',
                        headers:{
                            'Content-Type': 'application/json',
                            'x-access-token': token,
                            'user-id': id
                            },
                        body: JSON.stringify({
                            nombre: nombreInput.value,
                            apellido: apellidoInput.value,
                            dni: dni.value,
                        })}
                    console.log(token)
                    fetch(`http://127.0.0.1:4500/client/${id}/update/${resp.id_cliente}`, requestOptions)
                    .then(
                    respa => {
                        return respa.json()
                    })
                    .then(respa => {
                        console.log(respa)
                        //action del fetch
                        //cierra la ventana modal
                        // Obtén el modal por su ID y ejecuta el boton cerrar 
                        document.getElementById('clientForm').querySelector('.btn-close').click();
                        //recargar tabla
                        getClient();
                        //fin action del fetch
                    })
                    .catch((error) => console.error('Error al agregar cliente:', error));
                })
            }
        }

        function loadTablaItem() {
            //lectura elementos html
            const tabla = document.getElementById('tabla-item');
            const tbody = document.getElementById('datos-tabla-item');
            getItem()
            .then( resp => {console.log(resp)
                //action
                // Vaciar todas las filas del <tbody>
                while (tbody.firstChild) {
                    tbody.removeChild(tbody.firstChild);
                }

                resp.forEach((item) => {
                    const fila = document.createElement('tr');
                    fila.innerHTML = `
                        <td>${item.id_item}</td>
                        <td>${item.nombre_producto}</td>
                        <td>${item.detalle}</td>
                        <td>${item.cantidad}</td>
                        <td>${formatoMoneda(item.precio_compra)}</td>
                        <td>${formatoMoneda(item.precio_venta)}</td>
                        <td>
                        <a href="#" class="btn btn-primary" onclick="editClient(${item.id_item})">Editar</a>
                        <a href="#" class="btn btn-secondary" onclick="bajaClint(${item.id_item})">Baja</a>
                        </td>
                    `;
                    tbody.appendChild(fila);
                });
            })}
//######################################################################
//####################### Fin Funciones Item ###########################
//######################################################################

//         ----------------------------------------------------

 // #modelo consulta por token
 function test() {
    // config de token
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token')

    const requestOptions = {
    method : 'GET',
    headers:{
        'Content-Type': 'application/json',
        'x-access-token': token,
        'user-id': id
        }
    }
    // fin config de token

   fetch(`http://127.0.0.1:4500/client/${id}/getall`, requestOptions).then(
    resp => {return resp.json()}
   ).then(
    resp => {console.log(resp)

        //action del fetch
        
        //fin action del fetch

    }

   )
}



//funcion logeo, pidiendo token. (boton entrar)
// Funcion boton entrar.
function inciarSesion() {
    // Limpia el mensaje de la interfaz.
    document.getElementById('message').innerHTML = '';

    // Obtiene el nombre de usuario y la contraseña del formulario.
    const username = document.getElementById('floatingInput').value;
    const password = document.getElementById('floatingPassword').value;
    // Configuración de las opciones para la solicitud de tipo POST.
    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
            'Authorization': 'Basic ' + btoa(username + ":" + password)
        }  
    }
    // Realiza una solicitud POST para el inicio de sesión.
    fetch('http://127.0.0.1:4500/login', requestOptions)
    .then(
        res => {return res.json()}
    ).then(
        resp => {
            console.log(resp);
            // Verifica si la respuesta contiene un token.
            if(resp.token){
                // Almacena el token, el nombre de usuario y el id en el localStorage.
                console.log('Token a almacenar:', resp.token);
                localStorage.setItem('token', resp.token);
                localStorage.setItem('username', resp.username);
                localStorage.setItem('id', resp.id);
                
                // Muestra un mensaje de bienvenida y redirige al usuario al panel de control.
                // document.getElementById("message").innerHTML = 'Bienvenido ' + resp.username;
                window.location = 'index.html';
            }
            else{
                // Muestra un mensaje de error si no se obtiene un token.
                document.getElementById("message").innerHTML = resp.message;
            }
        }
    )
  }
//funcion deslogeo 
function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('id');
    window.location.href = "login.html";
}

//######################################################################
//###################   Fin Funciones Api     ##########################
//######################################################################

// Función para dar formato a moneda
function formatoMoneda(valor) {
    return Number(valor).toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    });
}

        