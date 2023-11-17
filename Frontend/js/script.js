// #############  
//       Funciones Api
// #############
// Función para cargar la lista de clientes desde la API
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
                <td>${cliente.id}</td>
                <td>${cliente.dni}</td>
                <td>${cliente.apellido}</td>
                <td>${cliente.nombre}</td>
                <td>
                <a href="#" class="btn btn-primary" onclick="editClient(${cliente.id})">Editar</a>
                <a href="#" class="btn btn-secondary" onclick="bajaClint(${cliente.id})">Baja</a>
                </td>
            `;
            tbody.appendChild(fila);
        });

    }

   )
}

function get_client_by_id(id_cliente){
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

        fetch(`http://127.0.0.1:4500/client/${id}/byid/${id_cliente}`, requestOptions).then(
        resp => {return resp.json()}
        ).then(
        resp => {console.log(resp)

            //action
            // Vaciar todas los input del form
            console.log('cargar datos cliente:', id_cliente);

        }

        )    
}




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


        