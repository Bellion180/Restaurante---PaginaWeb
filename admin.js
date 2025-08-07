// Inicialización del panel de administración
document.addEventListener('DOMContentLoaded', function() {
    loadAdminData();
    loadUsers();
    setupAdminForms();
    loadMenuCategories();
    loadCategorySelector();
    setupColorCustomization(); // Agregar inicialización de colores
    
    // Configurar vista previa de imagen para platillos
    const dishImageInput = document.getElementById('dish-image');
    if (dishImageInput) {
        dishImageInput.addEventListener('input', async function() {
            const url = this.value.trim();
            
            if (url) {
                try {
                    const isValid = await validateImageUrl(url);
                    if (isValid) {
                        showImagePreview(url);
                    } else {
                        hideImagePreview();
                        showAdminMessage('URL de imagen no válida o no accesible', 'error');
                    }
                } catch (error) {
                    hideImagePreview();
                }
            } else {
                hideImagePreview();
            }
        });
    }
});

// Cargar datos actuales en el panel de admin
function loadAdminData() {
    const restaurantData = JSON.parse(localStorage.getItem('restaurantData')) || {
        name: 'Sabores del Valle',
        logo: '/placeholder.svg?height=50&width=50',
        description: 'En Sabores del Valle, nos dedicamos a ofrecer una experiencia gastronómica excepcional. Nuestros chefs utilizan ingredientes frescos y locales para crear platillos que despiertan todos los sentidos. Con más de 15 años de experiencia, hemos perfeccionado el arte de combinar tradición e innovación en cada plato.'
    };

    const menuDescription = localStorage.getItem('menuDescription') || 'Descubre nuestra selección de platillos preparados con ingredientes frescos y técnicas culinarias tradicionales.';

    // Llenar formularios con datos actuales
    document.getElementById('admin-restaurant-name').value = restaurantData.name;
    document.getElementById('admin-restaurant-logo').value = restaurantData.logo;
    document.getElementById('admin-restaurant-description').value = restaurantData.description;
    document.getElementById('admin-menu-description').value = menuDescription;

    // Actualizar vista previa
    updatePreview();
}

// Actualizar vista previa
function updatePreview() {
    const name = document.getElementById('admin-restaurant-name').value;
    const logo = document.getElementById('admin-restaurant-logo').value;
    const description = document.getElementById('admin-restaurant-description').value;

    document.getElementById('preview-name').textContent = name;
    document.getElementById('preview-logo').src = logo || '/placeholder.svg?height=30&width=30';
    document.getElementById('preview-description').textContent = description.substring(0, 100) + '...';
}

// Configurar formularios del admin
function setupAdminForms() {
    // Formulario de información del restaurante
    document.getElementById('restaurant-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const restaurantData = {
            name: document.getElementById('admin-restaurant-name').value,
            logo: document.getElementById('admin-restaurant-logo').value || '/placeholder.svg?height=50&width=50',
            description: document.getElementById('admin-restaurant-description').value
        };

        localStorage.setItem('restaurantData', JSON.stringify(restaurantData));
        
        // Actualizar elementos en tiempo real
        updateElement('restaurant-name', restaurantData.name);
        updateElement('restaurant-logo', restaurantData.logo, 'src');
        updateElement('footer-name', restaurantData.name);
        updateElement('page-title', restaurantData.name);
        
        updatePreview();
        showAdminMessage('Información del restaurante actualizada exitosamente', 'success');
    });

    // Formulario de descripción del menú
    document.getElementById('menu-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const menuDescription = document.getElementById('admin-menu-description').value;
        localStorage.setItem('menuDescription', menuDescription);
        
        updateElement('menu-description', menuDescription);
        showAdminMessage('Descripción del menú actualizada exitosamente', 'success');
    });

    // Actualizar vista previa en tiempo real
    document.getElementById('admin-restaurant-name').addEventListener('input', updatePreview);
    document.getElementById('admin-restaurant-logo').addEventListener('input', updatePreview);
    document.getElementById('admin-restaurant-description').addEventListener('input', updatePreview);
}

// Cargar lista de usuarios
function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const usersList = document.getElementById('users-list');
    
    if (users.length === 0) {
        usersList.innerHTML = '<p>No hay usuarios registrados</p>';
        return;
    }

    usersList.innerHTML = users.map(user => `
        <div class="user-item">
            <div class="user-info">
                <div class="user-name">${user.name}</div>
                <div class="user-email">${user.email}</div>
            </div>
            <div class="user-phone">${user.phone}</div>
        </div>
    `).join('');
}

// Mostrar mensajes en el panel de admin
function showAdminMessage(message, type = 'success') {
    // Crear elemento de mensaje si no existe
    let messageDiv = document.getElementById('admin-message');
    if (!messageDiv) {
        messageDiv = document.createElement('div');
        messageDiv.id = 'admin-message';
        messageDiv.className = 'message';
        document.querySelector('.admin-main .container').appendChild(messageDiv);
    }
    
    messageDiv.innerHTML = `<p class="${type}">${message}</p>`;
    messageDiv.scrollIntoView({ behavior: 'smooth' });
    
    setTimeout(() => {
        messageDiv.innerHTML = '';
    }, 5000);
}

// Función auxiliar para actualizar elementos (reutilizada de script.js)
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

// Validar URL de imagen
function validateImageUrl(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

// Previsualizar imagen del logo
document.getElementById('admin-restaurant-logo').addEventListener('change', async function() {
    const url = this.value;
    const previewLogo = document.getElementById('preview-logo');
    
    if (url) {
        const isValid = await validateImageUrl(url);
        if (isValid) {
            previewLogo.src = url;
        } else {
            previewLogo.src = '/placeholder.svg?height=30&width=30';
            showAdminMessage('URL de imagen no válida', 'error');
        }
    } else {
        previewLogo.src = '/placeholder.svg?height=30&width=30';
    }
});

// ========== GESTIÓN DEL MENÚ ==========

// Variables globales para la gestión del menú
let currentEditingDish = null;
let currentEditingCategory = null;

// Obtener datos del menú
function getMenuData() {
    return JSON.parse(localStorage.getItem('menuData')) || {
        "Entradas": [
            {
                "name": "Bruschetta Mediterránea",
                "description": "Pan tostado con tomate, albahaca y mozzarella fresca",
                "price": "$8.50",
                "image": "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=300&h=200&fit=crop"
            },
            {
                "name": "Carpaccio de Res",
                "description": "Finas láminas de res con rúcula y parmesano",
                "price": "$12.75",
                "image": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop"
            },
            {
                "name": "Ceviche de Camarones",
                "description": "Camarones frescos marinados en limón con cilantro",
                "price": "$14.25",
                "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=300&h=200&fit=crop"
            }
        ],
        "Platos Principales": [
            {
                "name": "Filete de Res a la Parrilla",
                "description": "Acompañado de papas asadas y vegetales de temporada",
                "price": "$28.90",
                "image": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=300&h=200&fit=crop"
            },
            {
                "name": "Salmón en Costra de Hierbas",
                "description": "Con puré de coliflor y salsa de mantequilla al limón",
                "price": "$24.50",
                "image": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=300&h=200&fit=crop"
            },
            {
                "name": "Paella Valenciana",
                "description": "Arroz con mariscos, pollo y azafrán (para 2 personas)",
                "price": "$35.00",
                "image": "https://images.unsplash.com/photo-1534080564583-6be75777b70a?w=300&h=200&fit=crop"
            },
            {
                "name": "Lasaña de la Casa",
                "description": "Con carne, bechamel y quesos gratinados",
                "price": "$18.75"
            }
        ],
        "Postres": [
            {
                "name": "Tiramisú Clásico",
                "description": "Con café espresso y mascarpone",
                "price": "$7.50"
            },
            {
                "name": "Cheesecake de Frutos Rojos",
                "description": "Con salsa de fresas y arándanos",
                "price": "$8.25"
            },
            {
                "name": "Flan de Vainilla",
                "description": "Tradicional flan casero con caramelo",
                "price": "$6.75"
            }
        ],
        "Bebidas": [
            {
                "name": "Vinos de la Casa",
                "description": "Selección de vinos tintos y blancos",
                "price": "$6.00 - $15.00"
            },
            {
                "name": "Cócteles Especiales",
                "description": "Mojito, Margarita, Pisco Sour",
                "price": "$8.50"
            },
            {
                "name": "Jugos Naturales",
                "description": "Naranja, mango, maracuyá",
                "price": "$4.50"
            }
        ]
    };
}

// Guardar datos del menú
function saveMenuData(menuData) {
    localStorage.setItem('menuData', JSON.stringify(menuData));
}

// Cargar categorías del menú
function loadMenuCategories() {
    const menuData = getMenuData();
    const categoriesList = document.getElementById('categories-list');
    
    categoriesList.innerHTML = Object.keys(menuData).map(category => `
        <div class="category-item">
            <span class="category-name">${category}</span>
            <div class="category-actions">
                <button class="btn-small btn-edit" onclick="editCategory('${category}')" title="Editar categoría"></button>
                <button class="btn-small btn-delete" onclick="deleteCategory('${category}')" title="Eliminar categoría"></button>
            </div>
        </div>
    `).join('');
}

// Cargar selector de categorías
function loadCategorySelector() {
    const menuData = getMenuData();
    const selector = document.getElementById('selected-category');
    
    selector.innerHTML = '<option value="">Selecciona una categoría</option>' + 
        Object.keys(menuData).map(category => 
            `<option value="${category}">${category}</option>`
        ).join('');
}

// Agregar nueva categoría
function addCategory() {
    const categoryName = document.getElementById('new-category-name').value.trim();
    
    if (!categoryName) {
        showAdminMessage('Por favor ingresa un nombre para la categoría', 'error');
        return;
    }
    
    const menuData = getMenuData();
    
    if (menuData[categoryName]) {
        showAdminMessage('Esta categoría ya existe', 'error');
        return;
    }
    
    menuData[categoryName] = [];
    saveMenuData(menuData);
    
    document.getElementById('new-category-name').value = '';
    loadMenuCategories();
    loadCategorySelector();
    showAdminMessage('Categoría agregada exitosamente', 'success');
}

// Editar categoría
function editCategory(oldName) {
    const newName = prompt('Nuevo nombre para la categoría:', oldName);
    
    if (!newName || newName.trim() === '') {
        return;
    }
    
    const trimmedName = newName.trim();
    
    if (trimmedName === oldName) {
        return;
    }
    
    const menuData = getMenuData();
    
    if (menuData[trimmedName]) {
        alert('Ya existe una categoría con ese nombre');
        return;
    }
    
    // Crear nueva categoría con los mismos platillos
    menuData[trimmedName] = menuData[oldName];
    delete menuData[oldName];
    
    saveMenuData(menuData);
    loadMenuCategories();
    loadCategorySelector();
    showAdminMessage('Categoría editada exitosamente', 'success');
}

// Eliminar categoría
function deleteCategory(categoryName) {
    if (!confirm(`¿Estás seguro de que quieres eliminar la categoría "${categoryName}" y todos sus platillos?`)) {
        return;
    }
    
    const menuData = getMenuData();
    delete menuData[categoryName];
    
    saveMenuData(menuData);
    loadMenuCategories();
    loadCategorySelector();
    
    // Limpiar la vista de platillos si era la categoría seleccionada
    const selectedCategory = document.getElementById('selected-category').value;
    if (selectedCategory === categoryName) {
        document.getElementById('selected-category').value = '';
        document.getElementById('add-dish-form').style.display = 'none';
        document.getElementById('dishes-list').innerHTML = '';
    }
    
    showAdminMessage('Categoría eliminada exitosamente', 'success');
}

// Cargar platillos para una categoría
function loadDishesForCategory() {
    const selectedCategory = document.getElementById('selected-category').value;
    const addDishButtonContainer = document.getElementById('add-dish-button-container');
    const addDishForm = document.getElementById('add-dish-form');
    const dishesList = document.getElementById('dishes-list');
    
    if (!selectedCategory) {
        addDishButtonContainer.style.display = 'none';
        addDishForm.style.display = 'none';
        dishesList.innerHTML = '';
        return;
    }
    
    // Mostrar botón de agregar platillo
    addDishButtonContainer.style.display = 'block';
    // Ocultar formulario inicialmente
    addDishForm.style.display = 'none';
    
    const menuData = getMenuData();
    const dishes = menuData[selectedCategory] || [];
    
    if (dishes.length === 0) {
        dishesList.innerHTML = '<div class="no-dishes"><p>No hay platillos en esta categoría. ¡Agrega el primero!</p></div>';
    } else {
        dishesList.innerHTML = dishes.map((dish, index) => `
            <div class="dish-item-admin">
                <div class="dish-header-admin">
                    ${dish.image ? 
                        `<img src="${dish.image}" alt="${dish.name}" class="dish-image-admin">` :
                        `<div class="dish-image-placeholder">Sin imagen</div>`
                    }
                    <div class="dish-info">
                        <h4>${dish.name}</h4>
                        <p>${dish.description}</p>
                        <span class="dish-price">${dish.price}</span>
                    </div>
                    <div class="dish-actions">
                        <button class="btn-small btn-edit" onclick="editDish(${index})" title="Editar platillo"></button>
                        <button class="btn-small btn-delete" onclick="deleteDish(${index})" title="Eliminar platillo"></button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Mostrar formulario de agregar platillo
function showAddDishForm() {
    const addDishForm = document.getElementById('add-dish-form');
    const addDishButtonContainer = document.getElementById('add-dish-button-container');
    
    addDishForm.style.display = 'block';
    addDishButtonContainer.style.display = 'none';
    
    // Limpiar formulario
    clearDishForm();
    
    // Scroll al formulario
    addDishForm.scrollIntoView({ behavior: 'smooth' });
}

// Agregar nuevo platillo
function addDish() {
    const selectedCategory = document.getElementById('selected-category').value;
    const dishName = document.getElementById('dish-name').value.trim();
    const dishDescription = document.getElementById('dish-description').value.trim();
    const dishPrice = document.getElementById('dish-price').value.trim();
    const dishImage = document.getElementById('dish-image').value.trim();
    
    if (!selectedCategory) {
        showAdminMessage('Selecciona una categoría primero', 'error');
        return;
    }
    
    if (!dishName || !dishDescription || !dishPrice) {
        showAdminMessage('Por favor completa todos los campos obligatorios', 'error');
        return;
    }
    
    const menuData = getMenuData();
    
    const newDish = {
        name: dishName,
        description: dishDescription,
        price: dishPrice
    };
    
    // Agregar imagen solo si se proporcionó una URL
    if (dishImage) {
        newDish.image = dishImage;
    }
    
    if (currentEditingDish !== null) {
        // Editando platillo existente
        menuData[selectedCategory][currentEditingDish] = newDish;
        currentEditingDish = null;
        showAdminMessage('Platillo editado exitosamente', 'success');
    } else {
        // Agregando nuevo platillo
        if (!menuData[selectedCategory]) {
            menuData[selectedCategory] = [];
        }
        menuData[selectedCategory].push(newDish);
        showAdminMessage('Platillo agregado exitosamente', 'success');
    }
    
    saveMenuData(menuData);
    clearDishForm();
    hideAddDishForm();
    loadDishesForCategory();
}

// Editar platillo
function editDish(index) {
    const selectedCategory = document.getElementById('selected-category').value;
    const menuData = getMenuData();
    const dish = menuData[selectedCategory][index];
    
    // Mostrar el formulario
    showAddDishForm();
    
    // Llenar con datos del platillo
    document.getElementById('dish-name').value = dish.name;
    document.getElementById('dish-description').value = dish.description;
    document.getElementById('dish-price').value = dish.price;
    document.getElementById('dish-image').value = dish.image || '';
    
    // Mostrar vista previa de imagen si existe
    if (dish.image) {
        showImagePreview(dish.image);
    } else {
        hideImagePreview();
    }
    
    currentEditingDish = index;
    
    // Cambiar el texto del botón
    const addButton = document.querySelector('#add-dish-form .btn-add');
    addButton.textContent = 'Guardar';
    addButton.className = 'btn-secondary';  // Cambiar estilo durante edición
    
    // Scroll al formulario
    document.getElementById('add-dish-form').scrollIntoView({ behavior: 'smooth' });
}

// Eliminar platillo
function deleteDish(index) {
    const selectedCategory = document.getElementById('selected-category').value;
    const menuData = getMenuData();
    const dish = menuData[selectedCategory][index];
    
    if (!confirm(`¿Estás seguro de que quieres eliminar "${dish.name}"?`)) {
        return;
    }
    
    menuData[selectedCategory].splice(index, 1);
    saveMenuData(menuData);
    loadDishesForCategory();
    showAdminMessage('Platillo eliminado exitosamente', 'success');
}

// Cancelar edición de platillo
function cancelEditDish() {
    clearDishForm();
    hideAddDishForm();
    currentEditingDish = null;
}

// Ocultar formulario de agregar platillo
function hideAddDishForm() {
    const addDishForm = document.getElementById('add-dish-form');
    const addDishButtonContainer = document.getElementById('add-dish-button-container');
    
    addDishForm.style.display = 'none';
    addDishButtonContainer.style.display = 'block';
}

// Limpiar formulario de platillo
function clearDishForm() {
    document.getElementById('dish-name').value = '';
    document.getElementById('dish-description').value = '';
    document.getElementById('dish-price').value = '';
    document.getElementById('dish-image').value = '';
    hideImagePreview();
    
    const addButton = document.querySelector('#add-dish-form .btn-add, #add-dish-form .btn-secondary');
    addButton.textContent = 'Agregar';
    addButton.className = 'btn-add';
    
    currentEditingDish = null;
}

// ========== GESTIÓN DE IMÁGENES ==========

// Mostrar vista previa de imagen
function showImagePreview(imageUrl) {
    const previewContainer = document.getElementById('dish-image-preview');
    const previewImg = document.getElementById('preview-dish-img');
    
    previewImg.src = imageUrl;
    previewContainer.style.display = 'flex';
}

// Ocultar vista previa de imagen
function hideImagePreview() {
    const previewContainer = document.getElementById('dish-image-preview');
    previewContainer.style.display = 'none';
}

// Quitar imagen del platillo
function removeDishImage() {
    document.getElementById('dish-image').value = '';
    hideImagePreview();
}

// ========== PERSONALIZACIÓN DE COLORES ==========

function setupColorCustomization() {
    // Cargar colores guardados
    loadSavedColors();
    
    // Configurar eventos para los inputs de color
    const colorInputs = [
        { color: 'primary-color', text: 'primary-color-text' },
        { color: 'secondary-color', text: 'secondary-color-text' },
        { color: 'text-color', text: 'text-color-text' },
        { color: 'background-color', text: 'background-color-text' }
    ];
    
    colorInputs.forEach(input => {
        const colorInput = document.getElementById(input.color);
        const textInput = document.getElementById(input.text);
        
        if (colorInput && textInput) {
            // Sincronizar color picker con input de texto
            colorInput.addEventListener('input', function() {
                textInput.value = this.value.toLowerCase();
                updateColorPreview();
            });
            
            // Sincronizar input de texto con color picker
            textInput.addEventListener('input', function() {
                const value = this.value.trim();
                if (isValidHexColor(value)) {
                    colorInput.value = value;
                    updateColorPreview();
                } else if (value === '') {
                    // Permitir campo vacío temporalmente
                } else {
                    // Marcar como inválido visualmente
                    this.style.borderColor = '#e74c3c';
                    return;
                }
                this.style.borderColor = '#ddd';
            });
            
            textInput.addEventListener('blur', function() {
                const value = this.value.trim();
                if (!isValidHexColor(value) && value !== '') {
                    // Restaurar valor del color picker si el hex es inválido
                    this.value = colorInput.value;
                    this.style.borderColor = '#ddd';
                }
            });
        }
    });
    
    // Configurar formulario de colores
    const colorForm = document.getElementById('color-customization-form');
    if (colorForm) {
        colorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            applyCustomColors();
        });
    }
    
    // Actualizar vista previa inicial
    updateColorPreview();
}

function isValidHexColor(hex) {
    const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexRegex.test(hex);
}

function loadSavedColors() {
    const savedColors = JSON.parse(localStorage.getItem('customColors')) || {
        primary: '#d4a574',
        secondary: '#b8956a',
        text: '#333333',
        background: '#fafafa'
    };
    
    // Establecer valores en los inputs
    document.getElementById('primary-color').value = savedColors.primary;
    document.getElementById('primary-color-text').value = savedColors.primary;
    document.getElementById('secondary-color').value = savedColors.secondary;
    document.getElementById('secondary-color-text').value = savedColors.secondary;
    document.getElementById('text-color').value = savedColors.text;
    document.getElementById('text-color-text').value = savedColors.text;
    document.getElementById('background-color').value = savedColors.background;
    document.getElementById('background-color-text').value = savedColors.background;
}

function updateColorPreview() {
    const colors = getCurrentColors();
    
    // Actualizar vista previa
    const previewHeader = document.getElementById('color-preview-header');
    const previewLogo = document.getElementById('color-preview-logo');
    const previewLink = document.getElementById('color-preview-link');
    const previewContent = document.getElementById('color-preview-content');
    const previewTitle = document.getElementById('color-preview-title');
    const previewText = document.getElementById('color-preview-text');
    const previewButton = document.getElementById('color-preview-button');
    
    if (previewHeader) {
        previewHeader.style.background = `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`;
    }
    
    if (previewLogo) {
        previewLogo.style.color = 'white';
    }
    
    if (previewLink) {
        previewLink.style.color = 'white';
    }
    
    if (previewContent) {
        previewContent.style.backgroundColor = colors.background;
    }
    
    if (previewTitle) {
        previewTitle.style.color = colors.text;
    }
    
    if (previewText) {
        previewText.style.color = colors.text;
    }
    
    if (previewButton) {
        previewButton.style.background = `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`;
        previewButton.style.color = 'white';
    }
}

function getCurrentColors() {
    return {
        primary: document.getElementById('primary-color').value,
        secondary: document.getElementById('secondary-color').value,
        text: document.getElementById('text-color').value,
        background: document.getElementById('background-color').value
    };
}

function applyCustomColors() {
    const colors = getCurrentColors();
    
    // Guardar colores en localStorage
    localStorage.setItem('customColors', JSON.stringify(colors));
    
    // Aplicar colores a la página actual
    applyColorsToPage(colors);
    
    // Mostrar mensaje de éxito
    showAdminMessage('Colores aplicados correctamente. Los cambios se reflejarán en toda la página web.', 'success');
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
        
        .color-section h3 {
            color: ${colors.text} !important;
            border-bottom-color: ${colors.primary} !important;
        }
        
        .preview-content h4 {
            color: ${colors.text} !important;
        }
        
        .preview-content p {
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

function resetColors() {
    // Restaurar colores por defecto
    const defaultColors = {
        primary: '#d4a574',
        secondary: '#b8956a',
        text: '#333333',
        background: '#fafafa'
    };
    
    // Actualizar inputs
    document.getElementById('primary-color').value = defaultColors.primary;
    document.getElementById('primary-color-text').value = defaultColors.primary;
    document.getElementById('secondary-color').value = defaultColors.secondary;
    document.getElementById('secondary-color-text').value = defaultColors.secondary;
    document.getElementById('text-color').value = defaultColors.text;
    document.getElementById('text-color-text').value = defaultColors.text;
    document.getElementById('background-color').value = defaultColors.background;
    document.getElementById('background-color-text').value = defaultColors.background;
    
    // Aplicar colores
    applyCustomColors();
    
    showAdminMessage('Colores restaurados a los valores por defecto.', 'success');
}

// Función auxiliar para convertir hex a RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? 
        `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : 
        '212, 165, 116'; // Valor por defecto
}

// Aplicar colores guardados al cargar cualquier página
document.addEventListener('DOMContentLoaded', function() {
    const savedColors = localStorage.getItem('customColors');
    if (savedColors) {
        const colors = JSON.parse(savedColors);
        applyColorsToPage(colors);
    }
});