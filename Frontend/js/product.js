const tabla = document.getElementById('table-item');
const tbody = document.getElementById('data-table-item');
getItems()
.then ( resp => {
    // Vaciar todas las filas del <tbody>
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }
    resp.forEach((item) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${item.id_}</td>
            <td>${item.product_name}</td>
            <td>${item.detail}</td>
            <td>${item.stock}</td>
            <td>${item.buy_price}</td>
            <td>${item.sell_price}</td>
            <td>
            <a href="#" class="btn btn-primary btn-view" data-id-client="${item.id}">Ver</a>
            <a href="#" class="btn btn-secondary btn-edit" data-id-client="${item.id}">Editar</a>
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

feather.replace();