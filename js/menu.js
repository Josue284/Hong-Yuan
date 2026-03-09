// ──────────── FILTRADO ────────────
let filtroActivo = 'todos';

document.querySelectorAll('.filtro-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'));
    btn.classList.add('activo');
    filtroActivo = btn.dataset.filtro;

    const buscador = document.getElementById('buscador');
    if (buscador) buscador.value = '';

    document.querySelectorAll('.card-platillo').forEach(card => {
      const visible = filtroActivo === 'todos' || card.dataset.categoria === filtroActivo;
      card.style.display = visible ? 'flex' : 'none';
    });
  });
});

// ──────────── BÚSQUEDA EN TIEMPO REAL ────────────
document.getElementById('buscador').addEventListener('input', (e) => {
  const query = e.target.value.toLowerCase().trim();

  if (query === '') {
    document.querySelectorAll('.card-platillo').forEach(card => {
      const visible = filtroActivo === 'todos' || card.dataset.categoria === filtroActivo;
      card.style.display = visible ? 'flex' : 'none';
    });
    return;
  }

  document.querySelectorAll('.filtro-btn').forEach(b => b.classList.remove('activo'));
  document.querySelector('[data-filtro="todos"]').classList.add('activo');
  filtroActivo = 'todos';

  document.querySelectorAll('.card-platillo').forEach(card => {
    const nombre = (card.dataset.nombre || '').toLowerCase();
    const desc = (card.querySelector('.card-desc')?.textContent || '').toLowerCase();
    const tag = (card.querySelector('.card-tag')?.textContent || '').toLowerCase();
    const visible = nombre.includes(query) || desc.includes(query) || tag.includes(query);
    card.style.display = visible ? 'flex' : 'none';
  });
});

// ──────────── CARRITO ────────────
let carrito = [];

function agregarAlCarrito(btn) {
  const nombre = btn.dataset.nombre;
  const precio = parseFloat(btn.dataset.precio);
  const img = btn.dataset.img;
  const existente = carrito.find(item => item.nombre === nombre);
  if (existente) {
    existente.cantidad++;
  } else {
    carrito.push({ nombre, precio, img, cantidad: 1 });
  }
  actualizarCarrito();
  const iconoCarrito = document.getElementById('carrito-icono');
  iconoCarrito.classList.add('bounce');
  setTimeout(() => iconoCarrito.classList.remove('bounce'), 400);
  const original = btn.textContent;
  btn.textContent = '✓ Agregado';
  btn.style.background = 'rgba(30,130,30,0.9)';
  setTimeout(() => {
    btn.textContent = original;
    btn.style.background = '';
  }, 1200);
}

function actualizarCarrito() {
  const total = carrito.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  document.getElementById('carrito-contador').textContent = totalItems;
  document.getElementById('carrito-total').textContent = '$' + total.toFixed(2);

  const itemsEl = document.getElementById('carrito-items');
  if (carrito.length === 0) {
    itemsEl.innerHTML = `
      <div class="carrito-vacio">
        <span>🥢</span>
        <p>Tu carrito está vacío</p>
      </div>`;
    return;
  }
  itemsEl.innerHTML = carrito.map((item, i) => `
    <div class="carrito-item">
      <img src="${item.img}" alt="${item.nombre}" onerror="this.src='https://images.unsplash.com/photo-1563245372-f21724e3856d?w=100'">
      <div>
        <p>${item.nombre}</p>
        <p>$${(item.precio * item.cantidad).toFixed(2)}</p>
      </div>
      <div class="carrito-cantidad">
        <button onclick="cambiarCantidad(${i}, -1)">−</button>
        <span>${item.cantidad}</span>
        <button onclick="cambiarCantidad(${i}, 1)">+</button>
      </div>
      <button class="btn-eliminar" onclick="eliminarItem(${i})">✕</button>
    </div>
  `).join('');
}

function cambiarCantidad(index, delta) {
  carrito[index].cantidad += delta;
  if (carrito[index].cantidad <= 0) carrito.splice(index, 1);
  actualizarCarrito();
}

function eliminarItem(index) {
  carrito.splice(index, 1);
  actualizarCarrito();
}

function toggleCarrito() {
  const panel = document.getElementById('carrito-panel');
  const overlay = document.getElementById('carrito-overlay');
  panel.classList.toggle('carrito-cerrado');
  panel.classList.toggle('carrito-abierto');
  if (overlay) overlay.classList.toggle('visible');
}

document.getElementById('carrito-overlay')?.addEventListener('click', toggleCarrito);

document.querySelector('.btn-pagar')?.addEventListener('click', () => {
  if (carrito.length === 0) return;
  alert('¡Gracias por tu pedido! Total: $' + carrito.reduce((s, i) => s + i.precio * i.cantidad, 0).toFixed(2));
  carrito = [];
  actualizarCarrito();
  toggleCarrito();
});

actualizarCarrito();
