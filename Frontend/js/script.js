//######################################################################
//#####################   Funciones Api     ############################
//######################################################################


// - * chek de token */
    // Esta función se ejecuta cuando la ventana carga.
    window.onload = function() {
    // Obtiene el token almacenado en el localStorage (disco)
    var token = localStorage.getItem('token');
    // Verifica si hay un token.
    if(token){
        // Si hay un token, obtiene el nombre de usuario almacenado en el localStorage.
        const username = localStorage.getItem('username');
        
        // Muestra el nombre de usuario en el elemento con el id "username".
        document.getElementById("username").innerHTML = username;
    }
    else{
        // Si no hay token, redirige a la página de inicio de sesión.
        window.location.href = "login.html";
    }
    feather.replace();
    }

// - * User login data */

function logout(){
    localStorage.removeItem('username');
    localStorage.removeItem('token');
    window.location.href = "login.html"
}



//         ----------------------------------------------------
//####################### Funciones cliente ############################
// Función para cargar la lista de clientes desde la API
//separar la funcion getCLient de otra q genere la tabla
    function getClient() {
        // config de token
        const id = localStorage.getItem('id');
        const token = localStorage.getItem('token')
        const company = localStorage.getItem('company')
        console.log(token);
        const requestOptions = {
        method : 'GET',
        headers:{
            'Content-Type': 'application/json',
            'x-access-token': token,
            'user-id': id
            }
        }
        // fin config de token
        

        return fetch(`${urlServidorAPI}/user/${company}`, requestOptions)
        .then(resp => {
            return resp.json()
        })
        .catch(error => {
            console.error('Error al obtener datos del cliente:', error);
            throw error; // devuelve error
        });  
    }

    //Funcion para obtener datos de un cliente por id
    function get_client_byid(id_cliente){
        // config de token
        const id = localStorage.getItem('id');
        const token = localStorage.getItem('token')
        const company = localStorage.getItem('company')
        console.log(token);
        const requestOptions = {
        method : 'GET',
        headers:{
            'Content-Type': 'application/json',
            'x-access-token': token,
            'user-id': id
            }
        }
        // fin config de token

        //Retorna la respuesta
        return fetch(`${urlServidorAPI}/user/${company}/${id_cliente}`, requestOptions)
        .then(resp => {
            return resp.json();
           
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
        function getItems(){
            // config de token
            const id = localStorage.getItem('id');
            const token = localStorage.getItem('token');
            const company = localStorage.getItem('company')

            const requestOptions = {
            method : 'GET',
            headers:{
                'Content-Type': 'application/json',
                'x-access-token': token,
                'user-id': id
                }
            }
            // fin config de token
            


        return fetch(`http://127.0.0.1:4500/product/${company}`, requestOptions)
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
        function get_item_code(code){
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
            const code = document.getElementById('code');
            const nombre = document.getElementById('nombre');
            const detalle = document.getElementById('detalle');
            const cantidad = document.getElementById('cantidad');
            const compra = document.getElementById('compra');
            const venta = document.getElementById('venta');


            
            if (titulo.innerText.trim() === 'Nuevo Item') {
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
                get_item_code(code.value)
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
                            detalle: detalle.value,
                            cantidad: cantidad.value,
                            compra: compra.value,
                            venta: venta.value
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


//######################################################################
//###################   Funciones Api     ##########################
//######################################################################

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




//######################################################################
//###################   Fin Funciones Api     ##########################
//######################################################################

//         ----------------------------------------------------

//######################################################################
//####################### Funciones Sell ############################
//######################################################################


function getSells(){
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
    


return fetch(`http://127.0.0.1:4500/sell/${id}/getall`, requestOptions)
.then(
    resp => {return resp.json()
    })
.catch(error => {
    console.error('Error al obtener datos del cliente:', error);
    throw error; // devuelve error
}); 
}

function getSells_byid(id_venta){
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
    


return fetch(`http://127.0.0.1:4500/sell/${id}/getall`, requestOptions)
.then(
    resp => {return resp.json()
    })
.catch(error => {
    console.error('Error al obtener datos del cliente:', error);
    throw error; // devuelve error
});  
}

function loadTablaSells() {
    //lectura elementos html
    const tabla = document.getElementById('tabla-sell');
    const tbody = document.getElementById('datos-tabla-sell');
    getSells()
    .then( resp => {console.log(resp)
        //action
        // Vaciar todas las filas del <tbody>
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }

        resp.forEach((sell) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${sell.id_venta}</td>
                <td>${formatoFecha(sell.fecha)}</td>
                <td>${sell.cant_productos}</td>                
                <td>${formatoMoneda(sell.total_venta)}</td>
                <td>${sell.apellido_cliente } ${sell.nombre_cliente } </td>
                <td>
                <a href="#" class="btn btn-primary" onclick="editClient(${sell.id_venta})">Ver</a>
                </td>
            `;
            tbody.appendChild(fila);
        });
    })
}

//Funcion ventana Nuevo item
function viewSells(){
    // Muestra el modal usando JavaScript
    //primero busca el modal de nuevo usuario itemForm
    var myModal = new bootstrap.Modal(document.getElementById('viewSellsForm'), {
    backdrop: 'static', //que no se cierre al hacer click
    keyboard: false //que no se cierra al tocar esc
    });

    // Llama al método 'show' para mostrar el modal
    myModal.show();

        //busca los campos por id
        // Selecciona el formulario y los campos relevantes
        const titulo = document.getElementById("sellFormLabel"); //titulo del modal

        titulo.innerText = "Ultimas ventas"

}
//######################################################################
//##################   Fin Funciones Sell     ##########################
//######################################################################

//######################################################################
//#################   Funciones de interfaz     ########################
//######################################################################
const btnLogout = document.getElementById('btn-logout');
btnLogout.addEventListener("click", logout);

//######################################################################
//################   Fin Funciones de interfaz #########################
//######################################################################
//         ----------------------------------------------------

// Función para dar formato a moneda
function formatoMoneda(valor) {
    return Number(valor).toLocaleString('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2
    });
}

//formato fecha dd/mm/yyyy
function formatoFecha(dateString) {
    var options = { day: '2-digit', month: '2-digit', year: 'numeric'};
    return new Date(dateString).toLocaleDateString('es-ES', options);
  }

