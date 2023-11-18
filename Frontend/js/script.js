// #############  
//       Funciones Api
// #############
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

//funcion deslogeo 
function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('id');
    window.location.href = "login.html";
}

  // #############  
  //       Fin Api
  // #############


        