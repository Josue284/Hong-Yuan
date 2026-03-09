document.addEventListener('DOMContentLoaded', () => {

  const form = document.getElementById('form-contacto');
  if (!form) return;

  // Limpiar error al escribir
  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('input', () => {
      const errorEl = document.getElementById('error-' + field.id);
      if (errorEl) {
        errorEl.textContent = '';
        field.style.borderColor = '';
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const email = document.getElementById('email').value.trim();
    const mensaje = document.getElementById('mensaje').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let valido = true;

    // Limpiar errores previos
    document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
    document.querySelectorAll('.error-border').forEach(el => el.classList.remove('error-border'));

    if (nombre.length < 3) {
      mostrarError('nombre', 'Por favor ingresa tu nombre completo (mín. 3 caracteres)');
      valido = false;
    }
    if (!emailRegex.test(email)) {
      mostrarError('email', 'Por favor ingresa un correo electrónico válido');
      valido = false;
    }
    if (mensaje.length < 10) {
      mostrarError('mensaje', 'El mensaje debe tener al menos 10 caracteres');
      valido = false;
    }

    if (valido) {
      // Simular envío con animación
      const btnEnviar = form.querySelector('.btn-enviar');
      btnEnviar.textContent = 'Enviando...';
      btnEnviar.disabled = true;

      setTimeout(() => {
        form.style.display = 'none';
        const exitoMsg = document.getElementById('exito-msg');
        if (exitoMsg) {
          exitoMsg.style.display = 'flex';
          // Animación de entrada
          exitoMsg.style.opacity = '0';
          exitoMsg.style.transform = 'scale(0.9)';
          setTimeout(() => {
            exitoMsg.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            exitoMsg.style.opacity = '1';
            exitoMsg.style.transform = 'scale(1)';
          }, 50);
        }
      }, 1200);
    }
  });

  function mostrarError(campo, msg) {
    const errorEl = document.getElementById('error-' + campo);
    const fieldEl = document.getElementById(campo);
    if (errorEl) errorEl.textContent = msg;
    if (fieldEl) fieldEl.style.borderColor = 'var(--color-rojo)';
  }
});
