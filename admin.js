// Inicialización del panel de administración
document.addEventListener('DOMContentLoaded', function() {
    loadAdminData();
    loadUsers();
    setupAdminForms();
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