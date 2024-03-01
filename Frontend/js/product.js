function loadProduct() {
    const tabla = document.getElementById('table-item');
    const tbody = document.getElementById('data-table-item');
    getItems()
    .then ( resp => {
        // Vaciar todas las filas del <tbody>
        while (tbody.firstChild) {
            tbody.removeChild(tbody.firstChild);
        }
        
        resp.forEach((item) => {
            const stock_alert = item.stock_alert
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${item.id_}</td>
                <td>${item.brand_name}</td>
                <td>${item.product_category_name}</td>
                <td>${item.product_name}</td>
                <td>${item.detail}</td>
                <td style="${item.stock <= stock_alert ? 'color: var(--color-text-light); background-color: var(--color-alert);' : ''}">${item.stock}</td>
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
}

const bulk_unit = document.getElementById('bulk-unit');
bulk_unit.addEventListener("input", calc_buy_price)
const bulk_price = document.getElementById('bulk-price');
bulk_price.addEventListener("input", calc_buy_price)

const buy_price = document.getElementById('buy-price');
buy_price.addEventListener("input", calc_f_price);
buy_price.addEventListener("change", calc_f_price);

const control_calc_price = document.getElementById('calc-price-controls');
control_calc_price.addEventListener("click", ed_price_calc)

function calc_buy_price() {
    buy_price.value = bulk_price.value/bulk_unit.value;
    calc_f_price();
}

function ed_price_calc() {
    if (bulk_unit.hasAttribute('disabled')) {
        bulk_unit.removeAttribute('disabled');
        bulk_price.removeAttribute('disabled');
        buy_price.setAttribute('disabled','');
        bulk_unit.value = 1;
        bulk_price.value =  1;
        buy_price.value = 1;
        calc_f_price();
    } else {
        bulk_unit.setAttribute('disabled','');
        bulk_price.setAttribute('disabled','');
        buy_price.removeAttribute('disabled');
        bulk_unit.value = '';
        bulk_price.value =  '';
        buy_price.value = '';

    }
}

const gain = document.getElementById('gain');
gain.value = 110;
gain.addEventListener("input", calc_f_price);
gain.addEventListener("change", calc_f_price);
const sell_price = document.getElementById('sell-price');
sell_price.addEventListener("input", calc_margin_price)
sell_price.addEventListener("change", calc_margin_price)
const gain_margin = document.getElementById('gain-margin');

function calc_f_price() {
    sell_price.value = buy_price.value * ((gain.value/100)+1);
    calc_margin_price();
}
function calc_margin_price () {
    gain_margin.value = sell_price.value - buy_price.value;
    if (gain_margin.value <= 0) {
        gain_margin.classList.add('text-alert');
    } else {
        gain_margin.classList.remove('text-alert');
    };
    /* gain.value = (gain_margin.value*100)/buy_price.value; */
}


loadProduct();
feather.replace();

