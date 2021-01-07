// variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

// Eventos

eventListeners();
function eventListeners() {
  document.addEventListener('DOMContentLoaded', preguntarPresupuesto);
  formulario.addEventListener('submit', agregarGasto);
}

// clases
class Presupuesto {
  constructor(presupuesto) {
    this.presupuesto = Number(presupuesto);
    this.restante = Number(presupuesto);
    this.gastos = [];
  }

  nuevoGasto(gasto) {
    this.gastos = [...this.gastos, gasto];
    this.calcularRestante();
  }

  calcularRestante() {
    const gastado =
        this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
    this.restante = this.presupuesto - gastado;
  }

  eliminarGasto(id) {
    this.gastos = this.gastos.filter((gasto) => gasto.id !== id);
    this.calcularRestante();
  }
}

class UI {
  insertarPresupuesto(cantidad) {
    // Extrayendo los valores
    const {presupuesto, restante} = cantidad;

    // Agregados al html
    document.querySelector('#total').textContent = presupuesto;
    document.querySelector('#restante').textContent = restante;
  }

  imprimirAlerta(mensaje, tipo) {
    // crear div
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('text-center', 'alert');

    if (tipo === 'error') {
      divMensaje.classList.add('alert-danger');
    } else {
      divMensaje.classList.add('alert-success');
    }
    // Mensaje de error
    divMensaje.textContent = mensaje;

    // Insertar el mensaje
    document.querySelector('.primario').insertBefore(divMensaje, formulario);

    // Quitar html
    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }

  agregarGastoListado(gastos) {
    limpiarHTML();
    // Iterar sobre los gastos
    gastos.forEach((gasto) => {
      const {cantidad, nombre, id} = gasto;
      // crear un li
      const li = document.createElement('li');
      li.className =
          'list-group-item d-flex justify-content-between align-items-center';
      li.dataset.id = id;
      // Agregar el html del gasto
      li.innerHTML =
          `${nombre} <span class="badge badge-primary badge-pill"> $ ${
              cantidad} </span>`;
      // Agregar boton de borrar el gasto
      const btnBorrar = document.createElement('button');
      btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
      btnBorrar.textContent = 'Borrar x';
      btnBorrar.onclick = () => {
        eliminarGasto(id);
      };
      li.appendChild(btnBorrar);

      // Agregar html
      gastoListado.appendChild(li);
    });
  }

  actualizarRestante(restante) {
    document.querySelector('#restante').textContent = restante;
  }

  comprobarPresupuesto(presupuestObj) {
    const restanteDiv = document.querySelector('.restante');
    const {presupuesto, restante} = presupuestObj;

    if (presupuesto / 4 > restante) {
      restanteDiv.classList.remove('alert-success', 'alert-warning');
      restanteDiv.classList.add('alert-danger');
    } else if (presupuesto / 2 > restante) {
      restanteDiv.classList.remove('alert-success');
      restanteDiv.classList.add('alert-warning');
    } else {
      restanteDiv.classList.remove('alert-danger', 'alert-warning');
      restanteDiv.classList.add('alert-success');
    }

    // si el total es 0 o menor
    if (restante <= 0) {
      ui.imprimirAlerta('El presupuesto se agoto', 'error');
      formulario.querySelector('button[type="submit"]').disabled = true;
    }
  }
}

let presupuesto;
const ui = new UI();

// funciones
function preguntarPresupuesto() {
  preguntarUsuario = prompt('Cual es tu presupuesto?');
  if (preguntarUsuario === '' || preguntarUsuario === null ||
      isNaN(preguntarUsuario) || preguntarUsuario <= 0) {
    window.location.reload();
  }

  presupuesto = new Presupuesto(preguntarUsuario);
  console.log(presupuesto);
  ui.insertarPresupuesto(presupuesto);
}

// Agrega gasto
function agregarGasto(e) {
  e.preventDefault();

  // leer los datos del formulario
  const nombre = document.querySelector('#gasto').value;
  const cantidad = Number(document.querySelector('#cantidad').value);

  // validar
  if (nombre === '' || cantidad === '') {
    ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
    return;
  } else if (cantidad <= 0 || isNaN(cantidad)) {
    ui.imprimirAlerta('Cantidad no valida', 'error');
    return;
  }

  // generar objeto con el gasto
  const gasto = {nombre, cantidad, id: Date.now()};
  // agregar un nuevo gasto
  presupuesto.nuevoGasto(gasto);

  ui.imprimirAlerta('Gasto agregado correctamente');

  const {gastos, restante} = presupuesto;
  ui.agregarGastoListado(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarPresupuesto(presupuesto);
  // Reiniciar formulario
  formulario.reset();
}

function limpiarHTML() {
  while (gastoListado.firstChild) {
    gastoListado.removeChild(gastoListado.firstChild);
  }
}

function eliminarGasto(id) {
  // Elimina el objeto.
  presupuesto.eliminarGasto(id);
  // Refresca el html con los nuevos datos.
  const {gastos, restante} = presupuesto;
  ui.agregarGastoListado(gastos);
  ui.actualizarRestante(restante);
  ui.comprobarPresupuesto(presupuesto);
}
