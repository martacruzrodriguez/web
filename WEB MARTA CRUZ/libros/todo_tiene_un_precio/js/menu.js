document.addEventListener("DOMContentLoaded", function () {
    const menuToggle = document.getElementById("menu-toggle");
    const menu = document.getElementById("menu");
    if (!menuToggle || !menu) return;

    // Abre o cierra el menú (solo se usa en móvil y tablet)
    function setOpen(open) {
        menu.classList.toggle("active", open);
        menuToggle.setAttribute("aria-expanded", String(open));
        menuToggle.textContent = open ? "✕" : "☰";
        document.body.classList.toggle("menu-open", open);
    }

    menuToggle.addEventListener("click", function (event) {
        setOpen(!menu.classList.contains("active"));
        event.stopPropagation();
    });

    // Cierra el menú al pulsar fuera, al elegir un enlace o con la tecla Escape
    document.addEventListener("click", function (event) {
        if (!menu.contains(event.target) && !menuToggle.contains(event.target)) setOpen(false);
    });
    menu.addEventListener("click", function (event) {
        if (event.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape") setOpen(false);
    });

    // Si se cambia el tamaño de la ventana, el menú se cierra
    window.matchMedia("(max-width: 960px)").addEventListener("change", function () {
        setOpen(false);
    });

    // Marca la página en la que estás
    const aqui = location.pathname.split("/").pop() || "index.html";
    menu.querySelectorAll("a").forEach(function (a) {
        const href = a.getAttribute("href");
        if (href && href === aqui) a.setAttribute("aria-current", "page");
    });
});
