// Función para cargar ofertas al cargar la página
document.addEventListener('DOMContentLoaded', loadOffers);

function loadOffers() {
    const offersGrid = document.getElementById('offers-grid');
    const menuData = JSON.parse(localStorage.getItem('menuData')) || {};
    const currentDate = new Date();
    let hasOffers = false;

    offersGrid.innerHTML = '';

    // Recorrer todas las categorías buscando platillos en oferta
    Object.entries(menuData).forEach(([category, dishes]) => {
        dishes.forEach((dish) => {
            if (dish.isOffer) {
                // Verificar si la oferta aún está vigente
                const offerEndDate = new Date(dish.offerEnd);
                if (offerEndDate >= currentDate) {
                    hasOffers = true;
                    const offerCard = createOfferCard(dish, category);
                    offersGrid.appendChild(offerCard);
                }
            }
        });
    });

    // Si no hay ofertas, mostrar un mensaje
    if (!hasOffers) {
        offersGrid.innerHTML = `
            <div class="no-offers">
                <p>No hay ofertas disponibles en este momento.</p>
            </div>
        `;
    }
}

function createOfferCard(dish, category) {
    const card = document.createElement('div');
    card.className = 'offer-card-large';

    // Calcular el porcentaje de descuento
    const originalPrice = parseFloat(dish.originalPrice.replace('$', ''));
    const currentPrice = parseFloat(dish.price.replace('$', ''));
    const discountPercent = Math.round((1 - currentPrice / originalPrice) * 100);

    card.innerHTML = `
        <div class="offer-badge">${discountPercent}% OFF</div>
        <h2>${dish.name}</h2>
        <p>${dish.description}</p>
        ${dish.image ? `<img src="${dish.image}" alt="${dish.name}" class="offer-image">` : ''}
        <div class="price-section">
            <span class="old-price">${dish.originalPrice}</span>
            <span class="new-price">${dish.price}</span>
        </div>
        <p class="offer-category">Categoría: ${category}</p>
        <p class="offer-validity">Válido hasta: ${new Date(dish.offerEnd).toLocaleDateString()}</p>
    `;

    return card;
}
