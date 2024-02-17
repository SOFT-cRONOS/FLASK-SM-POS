/* Client table */
/* lectura elementos html */
const nuevoClienteForm = document.getElementById('nuevo-cliente-form');
const tabla = document.getElementById('tabla-clientes');
const tbody = document.getElementById('datos-tabla-clientes');

function loadClientTable() {
    getClient()
    .then ( resp => {
        // Vaciar todas las filas del <tbody>
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        resp.forEach((client) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${client.id}</td>
                <td>${client.lastname}</td>
                <td>${client.name_users}</td>
                <td>${client.phone}</td>
                <td>
                <a href="#" class="btn btn-primary btn-view" data-id-client="${client.id}">Ver</a>
                <a href="#" class="btn btn-secondary btn-edit" data-id-client="${client.id}">Editar</a>
                </td>
            `;
            tbody.appendChild(fila);

            const group_btnview = document.getElementsByClassName("btn-view");
            const group_btnedit = document.getElementsByClassName("btn-edit");
          
            for (const btnview of group_btnview) {
                btnview.addEventListener("click", modalClient_view);
            }
          
            for (const btnedit of group_btnedit) {
                btnedit.addEventListener("click", modalClient_edit);
            }
        })
    });


}

let idClient = 0;

/* Modal form config */
const modals_states = {
    new: 'new',
    view: 'view',
    edit: 'edit',
    delete: 'delete',
}

    /* inputs */
const modalClient = new bootstrap.Modal('#clientForm');
const modalClient_title = document.getElementById('clientFormLabel');
const modalClient_nick = document.getElementById('nick');
const modalClient_email = document.getElementById('email');
const modalClient_name = document.getElementById('name');
const modalClient_lastname = document.getElementById('lastname');
const modalClient_dni = document.getElementById('dni');
const modalClient_img = document.getElementById('user-img');
const modalClient_imglink = document.getElementById('img-link')
const modalClient_pass = document.getElementById('passwprd');
const modalClient_address = document.getElementById('adress');
const modalClient_naddress = document.getElementById('nadress');
const modalClient_dpto = document.getElementById('ndpto');
const modalClient_phone = document.getElementById('phone');

    /* buttom */
const btnViewAll = document.getElementById('btnviewall');
btnViewAll.addEventListener("click", viewAllClientdata)
const btnOk = document.getElementById('btnOk');
btnOk.addEventListener("click", saveClientdata);
const btnCancel = document.getElementById('btnCancel');
btnCancel.addEventListener("click", modalClient_close);

function modalClient_new () {
    modalClient_reset ()
    modalClient_imglink.style.display = 'block';
    modalClient_img.setAttribute("src", 'https://static-00.iconduck.com/assets.00/profile-user-icon-2048x2048-m41rxkoe.png');
    modalClient_show('new')
}

function modalClient_edit (event) {
    idClient = event.target.getAttribute("data-id-client");
    get_client_byid(idClient)
    .then ( resp => {
        modalClient_nick.value = resp[0].nik;
        modalClient_email.value = resp[0].email;
        modalClient_name.value = resp[0].name_users;
        modalClient_lastname.value = resp[0].lastname;
        modalClient_dni.value = resp[0].cuil;
        modalClient_pass.value = resp[0].pass;
        modalClient_imglink.value = resp[0].img;
        modalClient_imglink.style.display = 'block';
        modalClient_img.setAttribute("src", resp[0].img);

    })
    modalClient_show('edit')
}

function modalClient_view (event) {
    idClient = event.target.getAttribute("data-id-client");
    get_client_byid(idClient)
    .then ( resp => { 
        modalClient_nick.value = resp[0].nik;
        modalClient_email.value = resp[0].email;
        modalClient_name.value = resp[0].name_users;
        modalClient_lastname.value = resp[0].lastname;
        modalClient_dni.value = resp[0].cuil;
        modalClient_pass.value = resp[0].pass;
        modalClient_imglink.value = resp[0].img;
        modalClient_imglink.style.display = 'none';
        modalClient_address.value = resp[0].home_address;
        modalClient_naddress.value = resp[0].number_address;
        modalClient_dpto.value = resp[0].department;
        modalClient_phone.value = resp[0].phone;
        modalClient_img.setAttribute("src", resp[0].img);
        
    })
    modalClient_show('view')
}

function modalClient_reset () {
    modalClient_nick.value = '';
    modalClient_email.value = '';
    modalClient_name.value = '';
    modalClient_lastname.value = '';
    modalClient_dni.value = '';
    modalClient_pass.value = '';
    modalClient_imglink.value = '';
    modalClient_address.value = '';
    modalClient_naddress.value = '';
    modalClient_dpto.value = '';
    modalClient_phone.value = '';
}

function modalClient_show (state) {
    console.log(state);
    if (state === modals_states.new) {
        modalClient_title.innerHTML = 'Nuevo Cliente';
        btnOk.style.display = 'block';
        btnOk.innerHTML = 'Guardar';
        btnCancel.innerHTML = 'Cancelar';
    }
    if (state === modals_states.edit) {
        modalClient_title.innerHTML = 'Editar el Cliente';
        btnOk.style.display = 'block';
        btnOk.innerHTML = 'Guardar';
        btnCancel.innerHTML = 'Cancelar';
    }
    if (state === modals_states.view) {
        modalClient_title.innerHTML = 'Cliente';
        btnOk.style.display = 'none';
        btnOk.innerHTML = '';
        btnCancel.innerHTML = 'Cerrar';
    }
    modalClient.show();
}

function modalClient_close() {
    modalClient.hide();
}

function viewAllClientdata() {
    console.log(idClient);
    window.location.href = `client-data.html?client=${idClient}`;
}




/* Client Windows general Element */
const btnNewClient = document.getElementById('new-client');
btnNewClient.addEventListener("click", modalClient_new);

/* Save data function */
function saveClientdata () {
    const data = {
        'nik': modalClient_nick.value,
        'cuil': modalClient_dni.value,
        'cuit': '0000000',
        'name_users': modalClient_name.value,
        'lastname': modalClient_lastname.value,
        'pass': modalClient_pass.value,
        'img': modalClient_imglink.value,
        'home_address': modalClient_address.value,
        'number_address': modalClient_naddress.value,
        'department': modalClient_dpto.value,
        'phone': modalClient_phone.value,
        'email': modalClient_email.value,
    };

    // config de token
    const id = localStorage.getItem('id');
    const token = localStorage.getItem('token')
    const company = localStorage.getItem('company')
    const requestOptions = {
    method : 'POST',
    headers:{
        'Content-Type': 'application/json',
        'x-access-token': token,
        'user-id': id
        },
    body: JSON.stringify(data)
    }
    // fin config de token
    

    fetch(`${urlServidorAPI}/user/${company}`, requestOptions)
    .then(resp => {
        return resp.json();
    })
    .then(resp => {
        //limpia el modal
        modalClient_close();
        modalClient_reset();
    } )
    .catch(error => {
        console.error('Error al obtener datos del cliente:', error);
        throw error; // devuelve error
    }); 


}

/*Initial Functions */
loadClientTable();