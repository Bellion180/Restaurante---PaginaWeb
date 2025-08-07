// Variables globales
let currentSlide = 0;
const slides = document.querySelectorAll('.dish-card');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    loadRestaurantData();
    checkAdminStatus();
    initializeCarousel();
    applyCustomColorsOnLoad(); // Aplicar colores personalizados
});

// Cargar datos del restaurante desde localStorage
function loadRestaurantData() {
    const restaurantData = JSON.parse(localStorage.getItem('restaurantData')) || {
        name: 'Sabores del Valle',
        logo: '/placeholder.svg?height=50&width=50',
        description: 'En Sabores del Valle, nos dedicamos a ofrecer una experiencia gastronómica excepcional. Nuestros chefs utilizan ingredientes frescos y locales para crear platillos que despiertan todos los sentidos. Con más de 15 años de experiencia, hemos perfeccionado el arte de combinar tradición e innovación en cada plato.'
    };

    const menuDescription = localStorage.getItem('menuDescription') || 'Descubre nuestra selección de platillos preparados con ingredientes frescos y técnicas culinarias tradicionales.';

    // Actualizar elementos en todas las páginas
    updateElement('restaurant-name', restaurantData.name);
    updateElement('restaurant-logo', restaurantData.logo, 'src');
    updateElement('restaurant-description', restaurantData.description);
    updateElement('footer-name', restaurantData.name);
    updateElement('page-title', restaurantData.name);
    updateElement('menu-description', menuDescription);
}

// Función auxiliar para actualizar elementos
function updateElement(id, value, attribute = 'textContent') {
    const element = document.getElementById(id);
    if (element) {
        if (attribute === 'textContent') {
            element.textContent = value;
        } else {
            element.setAttribute(attribute, value);
        }
    }
}

// Verificar estado de administrador
function checkAdminStatus() {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const adminLink = document.getElementById('admin-link');
    
    if (adminLink) {
        adminLink.style.display = isAdmin ? 'block' : 'none';
    }

    // Proteger página de admin
    if (window.location.pathname.includes('admin.html') && !isAdmin) {
        alert('Acceso denegado. Solo administradores pueden acceder a esta página.');
        window.location.href = 'login.html';
    }
}

// Inicializar carrusel
function initializeCarousel() {
    if (slides.length > 0) {
        showSlide(0);
        // Auto-play del carrusel
        setInterval(nextSlide, 5000);
    }
}

// Mostrar slide específico
function showSlide(index) {
    slides.forEach((slide, i) => {
        slide.style.transform = `translateX(${(i - index) * 100}%)`;
        slide.classList.toggle('active', i === index);
    });
}

// Slide anterior
function prevSlide() {
    currentSlide = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
    showSlide(currentSlide);
}

// Slide siguiente
function nextSlide() {
    currentSlide = currentSlide < slides.length - 1 ? currentSlide + 1 : 0;
    showSlide(currentSlide);
}

// Cerrar sesión
function logout() {
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('currentUser');
    alert('Sesión cerrada exitosamente');
    window.location.href = 'index.html';
}

// Validación de formularios
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

// Mostrar mensajes
function showMessage(elementId, message, type = 'success') {
    const element = document.getElementById(elementId);
    if (element) {
        element.innerHTML = `<p class="${type}">${message}</p>`;
        setTimeout(() => {
            element.innerHTML = '';
        }, 5000);
    }
}

// Animaciones suaves al hacer scroll
function smoothScroll(target) {
    document.querySelector(target).scrollIntoView({
        behavior: 'smooth'
    });
}

// Lazy loading para imágenes
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Inicializar lazy loading si hay imágenes
if (document.querySelectorAll('img[data-src]').length > 0) {
    lazyLoadImages();
}

// Manejar errores de carga de imágenes
document.addEventListener('error', function(e) {
    if (e.target.tagName === 'IMG') {
        e.target.src = '/placeholder.svg?height=200&width=300';
    }
}, true);

// Efectos de hover para cards
document.querySelectorAll('.dish-card, .offer-card, .menu-item').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// ========== APLICACIÓN DE COLORES PERSONALIZADOS ==========

function applyCustomColorsOnLoad() {
    const savedColors = localStorage.getItem('customColors');
    if (savedColors) {
        const colors = JSON.parse(savedColors);
        applyColorsToPage(colors);
    }
}

function applyColorsToPage(colors) {
    // Crear o actualizar hoja de estilos dinámica
    let dynamicStyles = document.getElementById('dynamic-colors');
    if (!dynamicStyles) {
        dynamicStyles = document.createElement('style');
        dynamicStyles.id = 'dynamic-colors';
        document.head.appendChild(dynamicStyles);
    }
    
    const css = `
        /* Colores personalizados dinámicos */
        body {
            background-color: ${colors.background} !important;
            color: ${colors.text} !important;
        }
        
        .restaurant-name {
            color: ${colors.primary} !important;
        }
        
        .nav-list a:hover {
            color: ${colors.primary} !important;
        }
        
        .hero {
            background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%) !important;
        }
        
        .dish-card {
            color: ${colors.text} !important;
        }
        
        .dish-card h3 {
            color: ${colors.text} !important;
        }
        
        .daily-dishes h2, .daily-offers h2, .about h2 {
            color: ${colors.text} !important;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%) !important;
        }
        
        .btn-primary:hover {
            background: linear-gradient(135deg, ${colors.secondary} 0%, ${colors.primary} 100%) !important;
        }
        
        .price {
            color: ${colors.primary} !important;
        }
        
        /* Flechas del carrusel */
        .carousel-btn {
            background: rgba(${hexToRgb(colors.primary)}, 0.9) !important;
        }
        
        .carousel-btn:hover {
            background: rgba(${hexToRgb(colors.primary)}, 1) !important;
        }
        
        /* Títulos principales de páginas */
        .admin-main h1 {
            color: ${colors.text} !important;
        }
        
        .menu-main h1 {
            color: ${colors.text} !important;
        }
        
        .offers-main h1 {
            color: ${colors.text} !important;
        }
        
        /* Otros títulos y elementos */
        .menu-category h2 {
            color: ${colors.text} !important;
        }
        
        .item-info h3 {
            color: ${colors.text} !important;
        }
        
        .offer-card-large h2 {
            color: ${colors.text} !important;
        }
        
        .special-events h2 {
            color: ${colors.text} !important;
        }
        
        .event-card h3 {
            color: ${colors.text} !important;
        }
        
        .menu-categories-section h3, .menu-items-section h3 {
            color: ${colors.text} !important;
        }
        
        .add-dish-form h4 {
            color: ${colors.text} !important;
        }
        
        .admin-section h2 {
            color: ${colors.text} !important;
            border-bottom-color: ${colors.primary} !important;
        }
        
        .form-group label {
            color: ${colors.text} !important;
        }
        
        .auth-form h2 {
            color: ${colors.text} !important;
        }
        
        .menu-item h3 {
            color: ${colors.text} !important;
        }
        
        .menu-item .price {
            color: ${colors.primary} !important;
        }
        
        .offer-card h3 {
            color: ${colors.text} !important;
        }
        
        .offer-card .original-price {
            color: #999 !important;
        }
        
        .offer-card .discounted-price {
            color: ${colors.primary} !important;
        }
        
        /* Sección "Sobre Nosotros" */
        .info-item strong {
            color: ${colors.primary} !important;
        }
        
        .info-item p {
            color: ${colors.text} !important;
        }
        
        /* Ofertas especiales - página de ofertas */
        .offers-subtitle {
            color: ${colors.text} !important;
        }
        
        .offer-card-large > p {
            color: ${colors.text} !important;
        }
        
        .offer-details li {
            color: ${colors.text} !important;
        }
        
        .offer-details li:before {
            color: ${colors.primary} !important;
        }
        
        .offer-validity {
            color: ${colors.text} !important;
            opacity: 0.7;
        }
        
        .offer-badge {
            background: ${colors.primary} !important;
        }
        
        .old-price {
            color: #999 !important;
        }
        
        .new-price {
            color: ${colors.primary} !important;
        }
        
        .event-time {
            color: ${colors.primary} !important;
        }
        
        .footer {
            color: ${colors.text} !important;
        }
        
        .message.success {
            background-color: rgba(46, 125, 50, 0.1) !important;
            border-color: #2e7d32 !important;
            color: #2e7d32 !important;
        }
        
        .message.error {
            background-color: rgba(231, 76, 60, 0.1) !important;
            border-color: #e74c3c !important;
            color: #e74c3c !important;
        }
    `;
    
    dynamicStyles.innerHTML = css;
}

// Función auxiliar para convertir hex a RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
        '212, 165, 116'; // Valor por defecto
}