// DOM Elements
const navbar = document.querySelector('.navbar');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const addToCartBtns = document.querySelectorAll('.add-to-cart');
const cartBtn = document.querySelector('.cart-btn');
const cartCountElement = document.querySelector('.cart-count');
const cartSidebar = document.querySelector('.cart-sidebar');
const cartOverlay = document.querySelector('.cart-overlay');
const closeCartBtn = document.querySelector('.close-cart');
const cartItemsContainer = document.querySelector('.cart-items');
const cartTotalElement = document.querySelector('.cart-total-count');
const totalAmountElement = document.querySelector('.total-amount');
const checkoutBtn = document.querySelector('.checkout-btn');
const themeToggleBtn = document.querySelector('.theme-toggle');

// State
let cart = JSON.parse(localStorage.getItem('keshav_cart')) || [];
let isLightMode = localStorage.getItem('keshav_theme') === 'light';

// Init
if (isLightMode) {
    document.body.classList.add('light-mode');
    updateThemeIcon(true);
}
updateCartUI();

// Theme Toggle
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        isLightMode = !isLightMode;
        document.body.classList.toggle('light-mode');
        localStorage.setItem('keshav_theme', isLightMode ? 'light' : 'dark');
        updateThemeIcon(isLightMode);
        window.dispatchEvent(new Event('scroll'));
    });
}

function updateThemeIcon(isLight) {
    const icon = themeToggleBtn.querySelector('i');
    if (isLight) {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    } else {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    }
}

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const isLight = document.body.classList.contains('light-mode');
    if (window.scrollY > 50) {
        navbar.style.background = isLight ? 'rgba(255, 255, 255, 0.95)' : 'rgba(18, 18, 18, 0.95)';
        navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
    } else {
        navbar.style.background = isLight ? 'rgba(255, 255, 255, 0.9)' : 'rgba(18, 18, 18, 0.9)';
        navbar.style.boxShadow = 'none';
    }
});

// Mobile Menu
mobileMenuBtn.addEventListener('click', () => {
    alert('Mobile menu feature coming in next update!');
});

// Cart Toggle
cartBtn.addEventListener('click', () => {
    document.body.classList.add('cart-active');
});

closeCartBtn.addEventListener('click', () => {
    document.body.classList.remove('cart-active');
});

cartOverlay.addEventListener('click', () => {
    document.body.classList.remove('cart-active');
});

// Add to Cart Logic
addToCartBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
        e.preventDefault();

        // Get product data
        const id = this.dataset.id;
        const title = this.dataset.title;
        const price = parseInt(this.dataset.price);
        const img = this.dataset.img;

        addToCart({ id, title, price, img });

        // Feedback Animation
        this.innerHTML = '<i class="fa-solid fa-check"></i>';
        this.style.backgroundColor = '#4CAF50';
        this.style.color = 'white';

        showToast('Item added to cart!');

        setTimeout(() => {
            this.innerHTML = '<i class="fa-solid fa-plus"></i>';
            this.style.backgroundColor = '';
            this.style.color = '';
        }, 2000);
    });
});

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    document.body.classList.add('cart-active'); // Auto open cart on add
}

function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    updateCartUI();
}

function updateQuantity(id, change) {
    const item = cart.find(item => item.id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(id);
        } else {
            saveCart();
            updateCartUI();
        }
    }
}

function saveCart() {
    localStorage.setItem('keshav_cart', JSON.stringify(cart));
}

function updateCartUI() {
    // Update Counts
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalCount;
    cartTotalElement.textContent = totalCount;

    // Update List
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart-msg">Your cart is empty <br> <i class="fa-solid fa-cart-shopping" style="font-size: 2rem; margin-top: 10px; opacity: 0.5;"></i></div>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.img}" alt="${item.title}">
                <div class="cart-item-details">
                    <h4>${item.title}</h4>
                    <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
                    <div class="cart-item-actions">
                        <div class="quantity-controls">
                            <button class="qty-btn minus" data-id="${item.id}">-</button>
                            <span class="item-qty">${item.quantity}</span>
                            <button class="qty-btn plus" data-id="${item.id}">+</button>
                        </div>
                        <button class="remove-item" data-id="${item.id}"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        // Attach listeners to new buttons
        document.querySelectorAll('.qty-btn.plus').forEach(btn => {
            btn.addEventListener('click', () => updateQuantity(btn.dataset.id, 1));
        });
        document.querySelectorAll('.qty-btn.minus').forEach(btn => {
            btn.addEventListener('click', () => updateQuantity(btn.dataset.id, -1));
        });
        document.querySelectorAll('.remove-item').forEach(btn => {
            btn.addEventListener('click', () => removeFromCart(btn.dataset.id));
        });
    }

    // Update Total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalAmountElement.textContent = '₹' + total.toLocaleString();
}

// Checkout
checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
        showToast('Your cart is empty!');
        return;
    }

    // Simulate checkout
    if (confirm(`Proceed to checkout with total amount ₹${cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toLocaleString()}?`)) {
        cart = [];
        saveCart();
        updateCartUI();
        document.body.classList.remove('cart-active');
        showToast('Order placed successfully! Thank you.');
    }
});

// Simple Toast Notification System
function showToast(message) {
    const existingToast = document.querySelector('.toast');
    if (existingToast) document.body.removeChild(existingToast);

    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    // Style the toast
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        backgroundColor: '#FF6900',
        color: 'white',
        padding: '12px 24px',
        borderRadius: '8px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
        zIndex: '9999',
        transform: 'translateY(100px)',
        transition: 'transform 0.3s ease, opacity 0.3s ease',
        fontWeight: '500',
        display: 'flex',
        alignItems: 'center',
        gap: '10px'
    });

    const icon = document.createElement('i');
    icon.className = 'fa-solid fa-circle-check';
    toast.prepend(icon);

    document.body.appendChild(toast);

    requestAnimationFrame(() => {
        toast.style.transform = 'translateY(0)';
    });

    setTimeout(() => {
        toast.style.transform = 'translateY(100px)';
        toast.style.opacity = '0';
        setTimeout(() => {
            if (document.body.contains(toast)) document.body.removeChild(toast);
        }, 300);
    }, 3000);
}
