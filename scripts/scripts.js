const productos = {
    1: { nombre: "Maceta artesanal", precio: 3200, imagenSrc: "img/productos/macetas.webp", imagenAlt: "Maceta artesanal"},
    2: { nombre: "Centro de mes", precio: 4500, imagenSrc: "img/productos/centro-de-mesa.webp", imagenAlt: "Centro de mesa"},
    3: { nombre: "Portallaves con estante", precio: 2800, imagenSrc: "img/productos/portallaves.webp", imagenAlt: "Portallaves con estante"}
};

const carrito = {}
function manejarClicComprar(evento) {
    const productoId = evento.target.dataset.id;
    agregarProductoAlCarrito(productoId);
}


function agregarProductoAlCarrito(idProducto) {
    const productoOriginal = productos[idProducto];

    if (!productoOriginal) {
        console.error("Producto no encontrado:", idProducto);
        return;
    }

    if (carrito.hasOwnProperty(idProducto)) {
        carrito[idProducto].cantidad++;
    } else {
        carrito[idProducto] = {
            nombre: productoOriginal.nombre,
            precio: productoOriginal.precio,
            cantidad: 1
        };
    }

    actualizarCarritoHTML();
}

function agregarProductos() {
    const divProductos = document.querySelector(".productos-container");
    for (const [id, producto] of Object.entries(productos)) {
        divProductos.insertAdjacentHTML("beforeend",
            `
            <div class="producto" data-id="${id}">
                    <div class="imagen-producto">
                        <img src="${producto.imagenSrc}" alt="${producto.imagenAlt}">
                    </div>
                    <h3>${producto.nombre}</h3>
                    <p>$${producto.precio}</p>
                    <button class="btn-comprar" type="button" data-id="${id}">Comprar</button>
            </div>
            `
        );
    }

    divProductos.addEventListener("click", manejarClicComprar);
}

function manejarClicCarrito(evento) {
    const target = evento.target;

    if (target.classList.contains("btn-cantidad") || target.classList.contains("btn-eliminar")) {
        const productoId = target.dataset.id;
        const accion = target.dataset.action;

        if (accion === "eliminar") {
            eliminarProductoDelCarrito(productoId);
        } else if (accion === "restar") {
            restarCantidadProducto(productoId);
        } else if (accion === "sumar") {
            sumarCantidadProducto(productoId);
        }
    }
}

function actualizarCarritoHTML() {
    const carritoCompras = document.querySelector(".carritoCompras");

    if (!carritoCompras) {
        console.error("Error: No se encontró el contenedor con la clase 'carritoCompras'.");
        return;
    }

    carritoCompras.innerHTML = `
        <h2>Tu Carrito de Compras</h2>
        <ul class="lista-carrito"></ul>
        <p class="total-carrito"></p>
        <p class="cantidad-carrito"></p>
    `;

    const listaCarrito = carritoCompras.querySelector(".lista-carrito");

    const items = Object.entries(carrito);
    let totalPagar = 0;
    let cantidadProductosUnicos = 0;

    if (items.length === 0) {
        listaCarrito.innerHTML = "<p>El carrito está vacío.</p>";
    } else {
        for (const [id, item] of items) {
            const li = document.createElement("li");
            li.innerHTML = `
                <span>${item.nombre} - $${item.precio} x ${item.cantidad}</span>
                <div>
                    <button class="btn-cantidad" data-id="${id}" data-action="restar" aria-label="Restar uno">-</button>
                    <button class="btn-cantidad" data-id="${id}" data-action="sumar" aria-label="Sumar uno">+</button>
                    <button class="btn-eliminar" data-id="${id}" data-action="eliminar" aria-label="Eliminar producto">x</button>
                </div>
            `;
            listaCarrito.appendChild(li);
            totalPagar += item.precio * item.cantidad;
            cantidadProductosUnicos++;
        }
    }

    carritoCompras.querySelector(".total-carrito").textContent = `Total a pagar: $${totalPagar}`;
    carritoCompras.querySelector(".cantidad-carrito").textContent = `Productos en carrito: ${cantidadProductosUnicos}`;

    listaCarrito.addEventListener("click", manejarClicCarrito);
}

function sumarCantidadProducto(id) {
    if (carrito[id]) {
        carrito[id].cantidad++;
        actualizarCarritoHTML();
    }
}


function restarCantidadProducto(id) {
    if (carrito[id]) {
        carrito[id].cantidad--;
        if (carrito[id].cantidad <= 0) {
            eliminarProductoDelCarrito(id);
        } else {
            actualizarCarritoHTML();
        }
    }
}

function eliminarProductoDelCarrito(id) {
    delete carrito[id];
    actualizarCarritoHTML();
}



agregarProductos()
actualizarCarritoHTML()