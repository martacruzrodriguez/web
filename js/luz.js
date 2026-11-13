// Luz ambiental, apariciones al desplazarse y botón «Descubrir».
// Compartido por la página de inicio, la biografía y los cuatro libros.
(function () {
    var html = document.documentElement;
    html.classList.add('js');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var hayIO = 'IntersectionObserver' in window;

    // 1) Aparición suave de los elementos .revelar
    var revelar = [].slice.call(document.querySelectorAll('.revelar'));
    if (reduce || !hayIO) {
        revelar.forEach(function (e) { e.classList.add('visto'); });
    } else {
        var ioR = new IntersectionObserver(function (es) {
            es.forEach(function (en) {
                if (en.isIntersecting) { en.target.classList.add('visto'); ioR.unobserve(en.target); }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
        revelar.forEach(function (e) { ioR.observe(e); });
    }

    // 2) La luz de la portada se intensifica cuando está visible (funciona en móvil, sin hover)
    var escenas = [].slice.call(document.querySelectorAll('[data-escena]'));
    if (hayIO) {
        var ioE = new IntersectionObserver(function (es) {
            es.forEach(function (en) {
                var cerca = en.intersectionRatio >= 0.3;
                en.target.classList.toggle('is-near', cerca);
                if (!cerca && en.intersectionRatio === 0) en.target.classList.remove('is-lit');
            });
        }, { threshold: [0, 0.3, 0.6] });
        escenas.forEach(function (e) { ioE.observe(e); });
    } else {
        escenas.forEach(function (e) { e.classList.add('is-near'); });
    }

    // 3) La luz sigue suavemente al ratón (solo con ratón)
    if (!reduce && window.matchMedia('(hover: hover)').matches) {
        [].forEach.call(document.querySelectorAll('.portada-wrap'), function (w) {
            w.addEventListener('pointermove', function (e) {
                var r = w.getBoundingClientRect();
                w.style.setProperty('--dx', ((e.clientX - r.left) / r.width - 0.5) * 60 + 'px');
                w.style.setProperty('--dy', ((e.clientY - r.top) / r.height - 0.5) * 60 + 'px');
            });
            w.addEventListener('pointerleave', function () {
                w.style.setProperty('--dx', '0px');
                w.style.setProperty('--dy', '0px');
            });
        });
    }

    // 4) «Descubrir»: enciende la luz. En el inicio abre el libro; dentro del libro baja a la siguiente sección.
    [].forEach.call(document.querySelectorAll('[data-descubrir]'), function (a) {
        a.addEventListener('click', function (e) {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
            var esc = a.closest('[data-escena]');
            [].forEach.call(document.querySelectorAll('[data-escena].is-lit'), function (x) { if (x !== esc) x.classList.remove('is-lit'); });
            if (esc) esc.classList.add('is-lit');
            var href = a.getAttribute('href');
            if (href && href.charAt(0) === '#') {
                e.preventDefault();
                var t = document.querySelector(href);
                if (t) setTimeout(function () { t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }, reduce ? 0 : 400);
            } else if (!reduce) {
                e.preventDefault();
                setTimeout(function () { window.location.href = a.href; }, 900);
            }
        });
    });
    window.addEventListener('pageshow', function () {
        [].forEach.call(document.querySelectorAll('.is-lit'), function (x) { x.classList.remove('is-lit'); });
    });

    // 5) Parallax muy suave en los fondos fotográficos
    var fondos = [].slice.call(document.querySelectorAll('.fondo'));
    if (!reduce && fondos.length) {
        var pend = false;
        var mover = function () {
            pend = false;
            var h = window.innerHeight;
            fondos.forEach(function (el) {
                var r = el.parentElement.getBoundingClientRect();
                if (r.bottom < 0 || r.top > h) return;
                el.style.transform = 'translate3d(0,' + ((r.top + r.height / 2 - h / 2) * -0.07).toFixed(1) + 'px,0)';
            });
        };
        window.addEventListener('scroll', function () { if (!pend) { pend = true; requestAnimationFrame(mover); } }, { passive: true });
        mover();
    }

    // 6) El aviso «Desliza» desaparece en cuanto se empieza a bajar
    var avisar = function () { html.classList.toggle('scrolled', window.pageYOffset > 60); };
    window.addEventListener('scroll', avisar, { passive: true });
    avisar();
})();
