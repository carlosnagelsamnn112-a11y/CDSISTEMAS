// Establece el año actual en el pie de página
document.getElementById('year').textContent = new Date().getFullYear();

// Efecto Scroll Reveal para secciones
const revealTargets = document.querySelectorAll('.service-card, .process-list li, .title-block');
revealTargets.forEach(el => el.classList.add('reveal'));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach(el => observer.observe(el));

// Efecto interactivo de paralaje en el Hero (solo escritorio)
const diagram = document.querySelector('.hero-diagram');
const specSheet = document.querySelector('.spec-sheet');

if (diagram && specSheet) {
  const handleMouseMove = (e) => {
    if (window.innerWidth <= 1024) {
      specSheet.style.transform = '';
      return;
    }
    const rect = diagram.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Parámetros de desplazamiento suave y rotación sutil
    const moveX = (x / rect.width) * 16;
    const moveY = (y / rect.height) * 16;
    const rotate = -0.5 + (x / rect.width) * 2;
    
    specSheet.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${rotate}deg)`;
    specSheet.style.transition = 'transform 0.1s ease-out';
  };

  const handleMouseLeave = () => {
    specSheet.style.transform = '';
    specSheet.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
  };

  diagram.addEventListener('mousemove', handleMouseMove);
  diagram.addEventListener('mouseleave', handleMouseLeave);
}
