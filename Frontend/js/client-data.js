const urlParams = new URLSearchParams(window.location.search);
const idClient = urlParams.get('client');

console.log(idClient);
feather.replace();
/* inputs */

const Client_title = document.getElementById('title-name');
const Client_nick = document.getElementById('nick');
const Client_email = document.getElementById('email');
const Client_name = document.getElementById('name');
const Client_lastname = document.getElementById('lastname');
const Client_dni = document.getElementById('dni');
const Client_img = document.getElementById('user-img');
const Client_imglink = document.getElementById('img-link')
const Client_pass = document.getElementById('passwprd');
const Client_address = document.getElementById('adress');
const Client_naddress = document.getElementById('nadress');
const Client_dpto = document.getElementById('ndpto');
const Client_phone = document.getElementById('phone');

get_client_byid(idClient)
.then ( resp => {
    Client_title.innerHTML = resp[0].name_users + ' ' + resp[0].lastname;
    Client_nick.value = resp[0].nik;
    Client_email.value = resp[0].email;
    Client_name.value = resp[0].name_users;
    Client_lastname.value = resp[0].lastname;
    Client_dni.value = resp[0].cuil;
    Client_pass.value = resp[0].pass;
    Client_address.value = resp[0].home_address;
    Client_naddress.value = resp[0].number_address;
    Client_dpto.value = resp[0].department;
    Client_phone.value = resp[0].phone;
    Client_imglink.value = resp[0].img;
    Client_imglink.style.display = 'block';
    Client_img.setAttribute("src", resp[0].img);

})

