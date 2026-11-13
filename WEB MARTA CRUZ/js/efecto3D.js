// Efecto 3D suave al pasar el ratón por las portadas de la página de inicio.
// (Se desactiva solo en pantallas táctiles y si la persona prefiere menos movimiento.)
const sinMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const conRaton = window.matchMedia('(hover: hover)').matches;

if (!sinMovimiento && conRaton) {
    document.querySelectorAll('.portada-container').forEach(container => {
        const img = container.querySelector('.portada');
        if (!img) return;

        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            img.style.transform = `rotateY(${x / 14}deg) rotateX(${-y / 14}deg)`;
        });

        container.addEventListener('mouseleave', () => {
            img.style.transform = 'rotateY(0) rotateX(0)';
        });
    });
}
