// Inicialización del panel de administración
document.addEventListener('DOMContentLoaded', function() {
    loadAdminData();
    loadUsers();
    setupAdminForms();
    loadMenuCategories();
    loadCategorySelector();
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
                "price": "$8.50"
            },
            {
                "name": "Carpaccio de Res",
                "description": "Finas láminas de res con rúcula y parmesano",
                "price": "$12.75"
            },
            {
                "name": "Ceviche de Camarones",
                "description": "Camarones frescos marinados en limón con cilantro",
                "price": "$14.25"
            }
        ],
        "Platos Principales": [
            {
                "name": "Filete de Res a la Parrilla",
                "description": "Acompañado de papas asadas y vegetales de temporada",
                "price": "$28.90"
            },
            {
                "name": "Salmón en Costra de Hierbas",
                "description": "Con puré de coliflor y salsa de mantequilla al limón",
                "price": "$24.50"
            },
            {
                "name": "Paella Valenciana",
                "description": "Arroz con mariscos, pollo y azafrán (para 2 personas)",
                "price": "$35.00"
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
            <div class="dish-item">
                <div class="dish-header">
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
    
    if (!selectedCategory) {
        showAdminMessage('Selecciona una categoría primero', 'error');
        return;
    }
    
    if (!dishName || !dishDescription || !dishPrice) {
        showAdminMessage('Por favor completa todos los campos', 'error');
        return;
    }
    
    const menuData = getMenuData();
    
    const newDish = {
        name: dishName,
        description: dishDescription,
        price: dishPrice
    };
    
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
    
    const addButton = document.querySelector('#add-dish-form .btn-add, #add-dish-form .btn-secondary');
    addButton.textContent = 'Agregar';
    addButton.className = 'btn-add';
    
    currentEditingDish = null;
}