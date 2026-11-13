// Carrusel de reseñas: avanza despacio de izquierda a derecha y se puede arrastrar con el ratón (o el dedo).
(function () {
    var m = document.body.className.match(/libro--(\w+)/);
    var datos = m && window.RESENAS && window.RESENAS[m[1]];
    var sec = document.getElementById('resenas');
    if (!datos || !sec || !datos.lista.length) { if (sec) sec.hidden = true; return; }

    var visor = sec.querySelector('.resenas__visor');
    var pista = sec.querySelector('.resenas__pista');
    var enlace = sec.querySelector('.resenas__cab a');
    if (enlace) enlace.href = datos.amazon;

    function tarjeta(r) {
    var d = document.createElement('article');
    d.className = 'resena';
    var a = document.createElement('p');
    a.className = 'resena__autor';
    a.textContent = r.autor;
    var e = document.createElement('div');
    e.className = 'resena__estrellas';
    e.setAttribute('aria-label', r.estrellas + ' de 5 estrellas');
    e.textContent = '★★★★★'.slice(0, r.estrellas) + '☆☆☆☆☆'.slice(0, 5 - r.estrellas);
    var h = document.createElement('p');
    h.className = 'resena__titulo';
    h.textContent = r.titulo;
    var t = document.createElement('p');
    t.className = 'resena__texto';
    t.textContent = r.texto;
    d.appendChild(a); d.appendChild(e); d.appendChild(h); d.appendChild(t);
    return d;
}

    // Se repite la lista las veces necesarias para que la pista siempre sea más ancha que la pantalla
    function montar() {
        pista.innerHTML = '';
        datos.lista.forEach(function (r) { pista.appendChild(tarjeta(r)); });
        var uno = pista.scrollWidth;
        var copias = Math.max(2, Math.ceil((window.innerWidth * 2) / uno) + 1);
        for (var i = 1; i < copias; i++) datos.lista.forEach(function (r) { pista.appendChild(tarjeta(r)); });
        return uno + 20; // ancho de un ciclo (incluye el hueco entre tarjetas)
    }

    var ciclo = montar();
    var x = -ciclo;          // posición actual
    var vel = 28;            // píxeles por segundo, hacia la derecha
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var parado = false, arrastrando = false, ultimo = 0, inicioX = 0, inicioPos = 0;

    function ajustar() {
        while (x > 0) x -= ciclo;
        while (x < -ciclo) x += ciclo;
        pista.style.transform = 'translate3d(' + x + 'px,0,0)';
    }

    function paso(t) {
        var dt = ultimo ? Math.min((t - ultimo) / 1000, .05) : 0;
        ultimo = t;
        if (!reduce && !parado && !arrastrando) { x += vel * dt; ajustar(); }
        requestAnimationFrame(paso);
    }

    visor.addEventListener('pointerdown', function (e) {
        if (e.button !== undefined && e.button !== 0) return;
        arrastrando = true; inicioX = e.clientX; inicioPos = x;
        visor.classList.add('arrastrando');
        visor.setPointerCapture(e.pointerId);
    });
    visor.addEventListener('pointermove', function (e) {
        if (!arrastrando) return;
        x = inicioPos + (e.clientX - inicioX); ajustar();
    });
    function soltar() { arrastrando = false; visor.classList.remove('arrastrando'); }
    visor.addEventListener('pointerup', soltar);
    visor.addEventListener('pointercancel', soltar);
    visor.addEventListener('mouseenter', function () { parado = true; });
    visor.addEventListener('mouseleave', function () { parado = false; });

    window.addEventListener('resize', function () { ciclo = montar(); ajustar(); });
    ajustar();
    requestAnimationFrame(paso);
})();
