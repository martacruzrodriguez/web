// Sección YouTube: último vídeo + galería «Más vídeos».
// Los datos se editan en js/youtube-datos.js (aquí no hace falta tocar nada).
//
// De dónde salen los vídeos, por orden:
//   1) La lista "videos" escrita a mano en youtube-datos.js.
//   2) Si no hay lista pero hay una "clave" de la API de YouTube, se leen del canal automáticamente
//      (último vídeo, foto de perfil, títulos y descripciones; solo vídeos, sin shorts).
//   3) Si no hay ninguna de las dos, se deja la sección con sus textos y un enlace al canal.
(function () {
    var sec = document.getElementById('youtube');
    if (!sec) return;

    var D = window.YOUTUBE || {};
    var CANAL = D.canal || 'https://www.youtube.com/@mcruzrod06';
    var USUARIO = D.usuario || '@mcruzrod06';
    var MAXIMO = D.maximo || 12;
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function q(sel) { return sec.querySelector(sel); }
    var marco = q('.yt__marco');
    var poster = q('[data-yt-poster]');
    var galeria = q('[data-yt-galeria]');
    var pista = q('.yt__pista');
    var etiqueta = q('[data-yt-etiqueta]');
    var titulo = q('[data-yt-titulo]');
    var fechaEl = q('[data-yt-fecha]');
    var descEl = q('[data-yt-desc]');
    var leerBtn = q('[data-yt-leer]');
    var verYT = q('[data-yt-ver]');
    var avatarEl = q('[data-yt-avatar]');
    var nombreEl = q('[data-yt-nombre]');
    var flechaIzq = q('[data-yt-prev]');
    var flechaDer = q('[data-yt-next]');

    // ---------- Utilidades ----------
    // Saca el identificador de un enlace de YouTube (watch?v=, youtu.be/, embed/, shorts/...) o de un id suelto.
    function idDe(txt) {
        txt = String(txt || '').trim();
        var m = txt.match(/(?:[?&]v=|youtu\.be\/|embed\/|shorts\/|live\/|\/v\/)([\w-]{11})/);
        if (m) return m[1];
        return /^[\w-]{11}$/.test(txt) ? txt : null;
    }
    function urlVideo(id) { return 'https://www.youtube.com/watch?v=' + encodeURIComponent(id); }

    function fechaLarga(f) {
        if (!f) return '';
        var d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(f) ? f + 'T12:00:00' : f);
        if (isNaN(d.getTime())) return '';
        try { return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }); }
        catch (e) { return ''; }
    }


    

function tiempoTranscurrido(fechaTexto) {
    if (!fechaTexto) return '';

    var fecha;
    var iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(fechaTexto.trim());

    if (iso) {
        fecha = new Date(+iso[1], +iso[2] - 1, +iso[3]);
    } else {
        var meses = {
            ene: 0, feb: 1, mar: 2, abr: 3,
            may: 4, jun: 5, jul: 6, ago: 7,
            sep: 8, oct: 9, nov: 10, dic: 11
        };

        var partes = fechaTexto.toLowerCase().trim().split(/\s+/);
        var dia = parseInt(partes[0], 10);
        var mes = meses[partes[1]?.slice(0, 3)];
        var año = parseInt(partes[2], 10);

        if (!Number.isInteger(dia) || mes === undefined || !Number.isInteger(año)) {
            return '';
        }

        fecha = new Date(año, mes, dia);
    }

    var ahora = new Date();

    var diaFecha = Date.UTC(
        fecha.getFullYear(),
        fecha.getMonth(),
        fecha.getDate()
    );

    var diaAhora = Date.UTC(
        ahora.getFullYear(),
        ahora.getMonth(),
        ahora.getDate()
    );

    var diferencia = Math.floor((diaAhora - diaFecha) / 86400000);

    if (diferencia < 0) return 'En el futuro';
    if (diferencia === 0) return 'Hoy';
    if (diferencia === 1) return 'Ayer';

    // Menos de 30 días: contar días
    if (diferencia < 30) {
        return 'Hace ' + diferencia + ' días';
    }

    // Calcular meses naturales completos
    var mesesTranscurridos =
        (ahora.getFullYear() - fecha.getFullYear()) * 12 +
        (ahora.getMonth() - fecha.getMonth());

    var aniversarioMes = new Date(fecha);
    aniversarioMes.setMonth(fecha.getMonth() + mesesTranscurridos);

    if (aniversarioMes > ahora) {
        mesesTranscurridos--;
    }

    // Menos de 12 meses: contar meses
    if (mesesTranscurridos < 12) {
        return 'Hace ' + mesesTranscurridos + ' ' +
            (mesesTranscurridos === 1 ? 'mes' : 'meses');
    }

    // A partir de 12 meses: contar años
    var añosTranscurridos = Math.floor(mesesTranscurridos / 12);

    return 'Hace ' + añosTranscurridos + ' ' +
        (añosTranscurridos === 1 ? 'año' : 'años');
}



    // Escribe un texto respetando los saltos de línea y convirtiendo las direcciones web en enlaces.
    function rellenarTexto(el, texto) {
        el.textContent = '';
        String(texto || '').split(/(https?:\/\/[^\s<>"']+)/g).forEach(function (trozo, i) {
            if (i % 2 === 0) { if (trozo) el.appendChild(document.createTextNode(trozo)); return; }
            var cola = (trozo.match(/[.,;:!?)\]]+$/) || [''])[0];
            var url = cola ? trozo.slice(0, -cola.length) : trozo;
            var a = document.createElement('a');
            a.href = url; a.target = '_blank'; a.rel = 'noopener';
            a.textContent = url;
            el.appendChild(a);
            if (cola) el.appendChild(document.createTextNode(cola));
        });
    }
    function resumen(txt) { return String(txt || '').replace(/https?:\/\/\S+/g, '').replace(/\s+/g, ' ').trim(); }

    // Miniatura en 16:9 y buena calidad. «maxresdefault» no existe en todos los vídeos (entonces YouTube
    // devuelve una imagen diminuta) y se cambia por «mqdefault», que también es 16:9 y sin franjas negras.
    function ponerMiniatura(img, id, propia) {
        if (propia) { img.src = propia; return; }
        var base = 'https://i.ytimg.com/vi/' + encodeURIComponent(id) + '/';
        var cambiada = false;
        function reserva() { if (!cambiada) { cambiada = true; img.src = base + 'mqdefault.jpg'; } }
        img.addEventListener('load', function () { if (img.naturalWidth <= 120) reserva(); });
        img.addEventListener('error', reserva);
        img.src = base + 'maxresdefault.jpg';
    }

    // ---------- Canal: foto de perfil y nombre ----------
    function ponerCanal(nombre, avatar) {
        if (nombre && nombreEl) nombreEl.textContent = nombre;
        if (avatar && avatarEl) {
            var img = new Image();
            img.alt = '';
            img.referrerPolicy = 'no-referrer';
            img.onload = function () {
                [].forEach.call(avatarEl.querySelectorAll('img'), function (x) { x.remove(); });
                avatarEl.appendChild(img);
            };
            img.src = avatar;
        }
    }

    // ---------- Último vídeo ----------
    function medirDescripcion() {
        if (!leerBtn || !descEl || descEl.hidden) { if (leerBtn) leerBtn.hidden = true; return; }
        if (descEl.classList.contains('abierta')) return;
        leerBtn.hidden = !(descEl.scrollHeight > descEl.clientHeight + 2);
    }
    if (leerBtn) leerBtn.addEventListener('click', function () {
        var abrir = !descEl.classList.contains('abierta');
        descEl.classList.toggle('abierta', abrir);
        leerBtn.setAttribute('aria-expanded', abrir ? 'true' : 'false');
        leerBtn.textContent = abrir ? 'Leer menos' : 'Leer más';
        if (!abrir) descEl.scrollTop = 0;
    });
    var tm;
    window.addEventListener('resize', function () { clearTimeout(tm); tm = setTimeout(medirDescripcion, 150); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(medirDescripcion);

    function ponerIframe(src, tit) {
        var f = document.createElement('iframe');
        f.src = src;
        f.title = tit || 'Vídeo de YouTube';
        f.loading = 'lazy';
        f.allow = 'accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        f.allowFullscreen = true;
        f.referrerPolicy = 'strict-origin-when-cross-origin';
        marco.appendChild(f);
    }

    function ponerDestacado(v) {
        if (etiqueta) etiqueta.textContent = 'Último vídeo';
        if (v.titulo) titulo.textContent = v.titulo;
        var f = tiempoTranscurrido(v.fecha);
        fechaEl.textContent = f;
        fechaEl.hidden = !f;
        if (v.descripcion) { rellenarTexto(descEl, v.descripcion.trim()); descEl.hidden = false; }
        else if (v.titulo) { descEl.hidden = true; }
        descEl.classList.remove('abierta');
        if (leerBtn) { leerBtn.textContent = 'Leer más'; leerBtn.setAttribute('aria-expanded', 'false'); }
        verYT.href = urlVideo(v.id);

        // Portada con la imagen del vídeo (enlace al vídeo) y, encima, el reproductor.
        poster.href = urlVideo(v.id);
        poster.setAttribute('aria-label', 'Ver «' + (v.titulo || 'el vídeo') + '» en YouTube');
        if (!poster.querySelector('img')) {
            var img = document.createElement('img');
            img.className = 'yt__poster-img'; img.alt = ''; img.draggable = false;
            ponerMiniatura(img, v.id, v.miniatura);
            poster.insertBefore(img, poster.firstChild);
            poster.classList.add('con-imagen');
        }
        ponerIframe('https://www.youtube-nocookie.com/embed/' + encodeURIComponent(v.id) + '?rel=0&modestbranding=1&playsinline=1', v.titulo);
        requestAnimationFrame(medirDescripcion);
    }

    // ---------- Galería «Más vídeos» ----------
    // Cada tarjeta es un enlace normal al vídeo en YouTube (se abre en otra pestaña).
    function tarjeta(v) {
        var a = document.createElement('a');
        a.className = 'yt__tarjeta';
        a.href = urlVideo(v.id);
        a.target = '_blank';
        a.rel = 'noopener';
        a.draggable = false;
        a.setAttribute('aria-label', (v.titulo || 'Vídeo') + ' (se abre en YouTube)');

        var mini = document.createElement('span');
        mini.className = 'yt__mini';
        var img = document.createElement('img');
        img.alt = ''; img.width = 640; img.height = 360; img.loading = 'lazy'; img.draggable = false;
        ponerMiniatura(img, v.id, v.miniatura);
        var play = document.createElement('span');
        play.className = 'yt__play'; play.setAttribute('aria-hidden', 'true');
        mini.appendChild(img); mini.appendChild(play);

        var cuerpo = document.createElement('span');
        cuerpo.className = 'yt__tarjeta-cuerpo';
        var t = document.createElement('span');
        t.className = 'yt__tarjeta-t';
        t.textContent = v.titulo || 'Vídeo';
        cuerpo.appendChild(t);
        var d = resumen(v.descripcion);
        if (d) {
            var dd = document.createElement('span');
            dd.className = 'yt__tarjeta-d'; dd.textContent = d;
            cuerpo.appendChild(dd);
        }
        var f = tiempoTranscurrido(v.fecha);
        if (f) {
            var ff = document.createElement('span');
            ff.className = 'yt__tarjeta-f'; ff.textContent = f;
            cuerpo.appendChild(ff);
        }
        a.appendChild(mini); a.appendChild(cuerpo);
        return a;
    }

    function esqueleto() {
        pista.innerHTML = '';
        for (var i = 0; i < 4; i++) {
            var a = document.createElement('div');
            a.className = 'yt__tarjeta yt__tarjeta--carga';
            a.setAttribute('aria-hidden', 'true');
            a.innerHTML = '<span class="yt__mini"></span><span class="yt__tarjeta-cuerpo"><span></span><span></span><span></span></span>';
            pista.appendChild(a);
        }
        actualizarFlechas();
    }

    function construirGaleria(lista) {
        if (!lista.length) { galeria.hidden = true; return; }
        galeria.hidden = false;
        pista.innerHTML = '';
        lista.forEach(function (v) { pista.appendChild(tarjeta(v)); });
        pista.scrollLeft = 0;
        actualizarFlechas();
    }

    // ---------- Flechas y arrastre ----------
    function actualizarFlechas() {
        var max = pista.scrollWidth - pista.clientWidth;
        var hay = max > 4;
        if (flechaIzq) { flechaIzq.disabled = !hay || pista.scrollLeft <= 4; flechaIzq.hidden = !hay; }
        if (flechaDer) { flechaDer.disabled = !hay || pista.scrollLeft >= max - 4; flechaDer.hidden = !hay; }
        pista.classList.toggle('mas-der', hay && pista.scrollLeft < max - 4);
    }
    function mover(dir) {
        pista.scrollBy({ left: dir * pista.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' });
    }
    if (flechaIzq) flechaIzq.addEventListener('click', function () { mover(-1); });
    if (flechaDer) flechaDer.addEventListener('click', function () { mover(1); });
    var pend = false;
    pista.addEventListener('scroll', function () {
        if (pend) return; pend = true;
        requestAnimationFrame(function () { pend = false; actualizarFlechas(); });
    }, { passive: true });
    window.addEventListener('resize', actualizarFlechas);

    // Arrastrar con el ratón (en el móvil ya se desliza con el dedo).
    var arr = { activo: false, x: 0, inicio: 0, movido: false, id: null };
    pista.addEventListener('pointerdown', function (e) {
        if (e.pointerType !== 'mouse' || e.button !== 0) return;
        arr.activo = true; arr.movido = false; arr.x = e.clientX; arr.inicio = pista.scrollLeft; arr.id = e.pointerId;
    });
    pista.addEventListener('pointermove', function (e) {
        if (!arr.activo) return;
        var dx = e.clientX - arr.x;
        if (!arr.movido && Math.abs(dx) > 5) {
            arr.movido = true;
            pista.classList.add('arrastrando');
            try { pista.setPointerCapture(arr.id); } catch (err) { /* no pasa nada */ }
        }
        if (arr.movido) pista.scrollLeft = arr.inicio - dx;
    });
    function soltar() {
        if (!arr.activo) return;
        arr.activo = false;
        pista.classList.remove('arrastrando');
        try { pista.releasePointerCapture(arr.id); } catch (err) { /* no pasa nada */ }
    }
    pista.addEventListener('pointerup', soltar);
    pista.addEventListener('pointercancel', soltar);
    // Si se ha arrastrado, el «clic» de soltar no debe abrir ningún vídeo.
    pista.addEventListener('click', function (e) {
        if (arr.movido) { e.preventDefault(); e.stopPropagation(); arr.movido = false; }
    }, true);
    pista.addEventListener('dragstart', function (e) { e.preventDefault(); });

    // ---------- Datos escritos a mano (youtube-datos.js) ----------
    function listaManual() {
        var salida = [];
        (D.videos || []).forEach(function (v) {
            if (!v) return;
            var id = idDe(v.enlace || v.url || v.id);
            if (!id) { if (window.console) console.warn('YouTube: enlace no válido →', v.enlace || v.url || v.id); return; }
            salida.push({
                id: id,
                titulo: v.titulo || '',
                descripcion: v.descripcion || '',
                fecha: v.fecha || '',
                miniatura: v.miniatura || ''
            });
        });
        // Si todos llevan fecha, se ordenan solos del más nuevo al más antiguo.
        if (salida.length > 1 && salida.every(function (v) { return v.fecha; })) {
            salida.sort(function (a, b) { return new Date(b.fecha) - new Date(a.fecha); });
        }
        return salida;
    }

    // ---------- Lectura automática con la API de YouTube ----------
    function api(ruta, params) {
        var qs = Object.keys(params).map(function (k) { return k + '=' + encodeURIComponent(params[k]); }).join('&');
        return fetch('https://www.googleapis.com/youtube/v3/' + ruta + '?' + qs + '&key=' + encodeURIComponent(D.clave))
            .then(function (r) {
                return r.json().then(function (j) {
                    if (!r.ok || j.error) throw new Error((j.error && j.error.message) || ('HTTP ' + r.status));
                    return j;
                });
            });
    }
    function segundos(iso) {
        var m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso || '');
        return m ? (+m[1] || 0) * 3600 + (+m[2] || 0) * 60 + (+m[3] || 0) : 0;
    }
    function idsDeLista(lista, n) {
        return api('playlistItems', { part: 'contentDetails', playlistId: lista, maxResults: n }).then(function (j) {
            return (j.items || []).map(function (i) { return i.contentDetails && i.contentDetails.videoId; }).filter(Boolean);
        });
    }
    function cacheLeer() {
        try {
            var c = JSON.parse(sessionStorage.getItem('yt-seccion') || 'null');
            if (c && Date.now() - c.t < 10 * 60 * 1000 && c.v && c.v.lista && c.v.lista.length) return c.v;
        } catch (e) { /* sin caché */ }
        return null;
    }
    function cacheGuardar(v) {
        try { sessionStorage.setItem('yt-seccion', JSON.stringify({ t: Date.now(), v: v })); } catch (e) { /* sin caché */ }
    }

    function cargarAPI() {
        var guardado = cacheLeer();
        if (guardado) return Promise.resolve(guardado);

        var pedirCanal = D.canalId
            ? api('channels', { part: 'snippet,contentDetails', id: D.canalId })
            : api('channels', { part: 'snippet,contentDetails', forHandle: USUARIO });

        return pedirCanal.then(function (j) {
            var c = j.items && j.items[0];
            if (!c) throw new Error('No se encontró el canal ' + USUARIO);
            var th = (c.snippet && c.snippet.thumbnails) || {};
            var canal = {
                nombre: c.snippet && c.snippet.title,
                avatar: (th.high || th.medium || th.default || {}).url
            };
            // Lista «Vídeos» del canal (UULF…): no incluye shorts ni directos.
            return idsDeLista('UULF' + c.id.slice(2), MAXIMO + 1)
                .catch(function () { return []; })
                .then(function (ids) {
                    if (ids.length) return { ids: ids, filtrar: false };
                    // Respaldo: todas las subidas, quitando los vídeos de 60 s o menos (shorts).
                    return idsDeLista(c.contentDetails.relatedPlaylists.uploads, 50).then(function (x) { return { ids: x, filtrar: true }; });
                })
                .then(function (r) {
                    if (!r.ids.length) throw new Error('El canal no tiene vídeos');
                    return api('videos', { part: 'snippet,contentDetails', id: r.ids.slice(0, 50).join(',') }).then(function (j2) {
                        var lista = (j2.items || []).map(function (it) {
                            return {
                                id: it.id,
                                titulo: it.snippet.title,
                                descripcion: it.snippet.description || '',
                                fecha: it.snippet.publishedAt,
                                seg: segundos(it.contentDetails && it.contentDetails.duration)
                            };
                        });
                        if (r.filtrar) lista = lista.filter(function (v) { return v.seg > 60; });
                        lista.sort(function (a, b) { return new Date(b.fecha) - new Date(a.fecha); });
                        var res = { lista: lista.slice(0, MAXIMO + 1), canal: canal };
                        if (res.lista.length) cacheGuardar(res);
                        return res;
                    });
                });
        });
    }

    // ---------- Arranque ----------
    function sinDatos(motivo) {
        if (motivo && window.console) console.warn('YouTube: no se han podido cargar los vídeos. ' + motivo);
        galeria.hidden = true;
        pista.innerHTML = '';
        // Con el identificador del canal (canalId) se puede enseñar su último vídeo sin clave.
        if (D.canalId && /^UC[\w-]{22}$/.test(D.canalId)) {
            ponerIframe('https://www.youtube-nocookie.com/embed/videoseries?list=UULF' + D.canalId.slice(2) + '&rel=0&modestbranding=1&playsinline=1', 'Últimos vídeos del canal');
        }
    }

    function pintar(lista) {
        if (!lista.length) { sinDatos('La lista está vacía.'); return; }
        ponerDestacado(lista[0]);
        construirGaleria(lista.slice(1, MAXIMO + 1));
    }

    verYT.href = CANAL;
    ponerCanal(D.nombre, D.avatar); // lo que escribas a mano en youtube-datos.js manda sobre lo de YouTube

    var manual = listaManual();
    if (manual.length) {
        pintar(manual);
    } else if (D.clave && window.fetch) {
        esqueleto();
        cargarAPI().then(function (res) {
            ponerCanal(D.nombre ? '' : res.canal.nombre, D.avatar ? '' : res.canal.avatar);
            pintar(res.lista);
        }).catch(function (e) { sinDatos(e && e.message); });
    } else {
        sinDatos('Falta la lista "videos" o la "clave" en js/youtube-datos.js.');
    }
    actualizarFlechas();
})();
