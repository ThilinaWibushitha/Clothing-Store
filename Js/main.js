// main.js - Enhanced main application file with error handling and modern practices
import { Slider } from "./slider.js";
import { Cart } from "./cart.js";
import { PaymentForm } from "./buy.js";

/**
 * Application initialization and error handling
 */
class App {
  constructor() {
    this.sliders = [];
    this.cart = null;
    this.init();
  }

  /**
   * Initialize the application
   */
  async init() {
    try {
      await this.initializeSliders();
      this.initializeCart();
      this.initializeEventListeners();
      this.initializeSearch();
      this.updateCartCount();
      console.log('App initialized successfully');
    } catch (error) {
      console.error('Failed to initialize app:', error);
      this.showError('Failed to load application. Please refresh the page.');
    }
  }

  /**
   * Initialize all sliders with error handling
   */
  async initializeSliders() {
    try {
      // Initialize the Image Slider
      const imageSlider = new Slider({
        type: "image",
        containerSelector: ".core-slider",
        itemSelector: ".img-slider",
        nextBtnSelector: "#next",
        prevBtnSelector: "#preview",
      });
      this.sliders.push(imageSlider);

      // Initialize Best Category Slider
      const bestCategorySlider = new Slider({
        type: "card",
        containerSelector: ".best-category .crd--container",
        itemSelector: ".best-category .card",
        nextBtnSelector: ".best-category .next",
        prevBtnSelector: ".best-category .preview",
        visibleItems: 3,
      });
      this.sliders.push(bestCategorySlider);

      // Initialize Best Choice Slider
      const bestChoiceSlider = new Slider({
        type: "card",
        containerSelector: ".best-choice .crd--container",
        itemSelector: ".best-choice .card",
        nextBtnSelector: ".best-choice .next-s",
        prevBtnSelector: ".best-choice .preview-s",
        visibleItems: 3,
      });
      this.sliders.push(bestChoiceSlider);

      // Initialize category-specific sliders
      this.initializeCategorySliders();
    } catch (error) {
      console.error('Error initializing sliders:', error);
      throw error;
    }
  }

  /**
   * Initialize category-specific sliders
   */
  initializeCategorySliders() {
    const categories = ['kids', 'men', 'women'];
    
    categories.forEach(category => {
      const container = document.querySelector(`.${category} .crd--container`);
      if (container) {
        try {
          const slider = new Slider({
            type: "card",
            containerSelector: `.${category} .crd--wrapper .crd--container`,
            itemSelector: `.${category} .card`,
            nextBtnSelector: `.${category} .next-s`,
            prevBtnSelector: `.${category} .preview-s`,
            visibleItems: 3,
          });
          this.sliders.push(slider);
        } catch (error) {
          console.warn(`Failed to initialize ${category} slider:`, error);
        }
      }
    });
  }

  /**
   * Initialize cart functionality
   */
  initializeCart() {
    try {
      this.cart = new Cart("cart-items", "empty-cart", "clear-cart");
    } catch (error) {
      console.error('Error initializing cart:', error);
    }
  }

  /**
   * Initialize event listeners
   */
  initializeEventListeners() {
    // Shop button event listeners
    this.initializeShopButtons();
    
    // Cancel button event listener
    this.initializeCancelButton();
    
    // Buy button event listener
    this.initializeBuyButton();
    
    // Payment form initialization
    this.initializePaymentForm();
    
    // Mobile menu toggle
    this.initializeMobileMenu();
  }

  /**
   * Initialize shop buttons with enhanced functionality
   */
  initializeShopButtons() {
    const shopButtons = document.querySelectorAll(".crd--open");
    
    shopButtons.forEach((button) => {
      button.addEventListener("click", (event) => {
        try {
          this.handleShopButtonClick(event);
        } catch (error) {
          console.error('Error handling shop button click:', error);
          this.showError('Failed to add item to cart. Please try again.');
        }
      });
    });
  }

  /**
   * Handle shop button click with product data extraction
   */
  handleShopButtonClick(event) {
    const card = event.target.closest(".card");
    if (!card) {
      throw new Error('Card element not found');
    }

    const titleElement = card.querySelector(".crd--title");
    const priceElement = card.querySelector("p");
    const imgElement = card.querySelector("img");

    if (!titleElement || !priceElement || !imgElement) {
      throw new Error('Required product elements not found');
    }

    const product = {
      title: titleElement.textContent.trim(),
      price: priceElement.textContent.trim(),
      imgSrc: imgElement.src,
      id: this.generateProductId(titleElement.textContent.trim()),
      quantity: 1
    };

    this.addToCart(product);
    this.showSuccessMessage(`${product.title} added to cart!`);
    this.updateCartCount();
  }

  /**
   * Add product to cart
   */
  addToCart(product) {
    let cart = this.getCartFromStorage();
    
    // Check if product already exists
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push(product);
    }

    this.saveCartToStorage(cart);
  }

  /**
   * Get cart from localStorage with error handling
   */
  getCartFromStorage() {
    try {
      const cartData = localStorage.getItem("cart");
      return cartData ? JSON.parse(cartData) : [];
    } catch (error) {
      console.error('Error reading cart from storage:', error);
      return [];
    }
  }

  /**
   * Save cart to localStorage with error handling
   */
  saveCartToStorage(cart) {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
      this.showError('Failed to save cart. Please try again.');
    }
  }

  /**
   * Generate unique product ID
   */
  generateProductId(title) {
    return title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  }

  /**
   * Update cart count display
   */
  updateCartCount() {
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
      const cart = this.getCartFromStorage();
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      cartCountElement.textContent = totalItems;
      cartCountElement.setAttribute('aria-label', `${totalItems} items in cart`);
    }
  }

  /**
   * Initialize search functionality
   */
  initializeSearch() {
    const searchInput = document.getElementById('search');
    const searchButton = document.getElementById('btn-search');
    
    if (searchInput && searchButton) {
      searchButton.addEventListener('click', () => this.performSearch());
      searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.performSearch();
        }
      });
    }
  }

  /**
   * Perform search functionality
   */
  performSearch() {
    const searchInput = document.getElementById('search');
    const query = searchInput.value.trim();
    
    if (query.length < 2) {
      this.showError('Please enter at least 2 characters to search.');
      return;
    }
    
    // Redirect to shop page with search query
    window.location.href = `./shop.html?search=${encodeURIComponent(query)}`;
  }

  /**
   * Initialize cancel button
   */
  initializeCancelButton() {
    const cancelButton = document.getElementById("btn");
    if (cancelButton) {
      cancelButton.addEventListener("click", () => {
        window.location.href = "./cart.html";
      });
    }
  }

  /**
   * Initialize buy button
   */
  initializeBuyButton() {
    const buyButton = document.getElementById("buy-item");
    if (buyButton) {
      buyButton.addEventListener("click", () => {
        window.location.href = "./buy.html";
      });
    }
  }

  /**
   * Initialize payment form
   */
  initializePaymentForm() {
    try {
      const paymentForm = new PaymentForm("payment-form", "payment-feedback");
    } catch (error) {
      console.error('Error initializing payment form:', error);
    }
  }

  /**
   * Initialize mobile menu toggle
   */
  initializeMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const menu = document.querySelector('.menu');
    
    if (mobileToggle && menu) {
      mobileToggle.addEventListener('click', () => {
        const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
        mobileToggle.setAttribute('aria-expanded', !isExpanded);
        menu.classList.toggle('mobile-open');
        mobileToggle.classList.toggle('active');
      });
    }
  }

  /**
   * Show success message
   */
  showSuccessMessage(message) {
    this.showNotification(message, 'success');
  }

  /**
   * Show error message
   */
  showError(message) {
    this.showNotification(message, 'error');
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    // Add styles
    Object.assign(notification.style, {
      position: 'fixed',
      top: '20px',
      right: '20px',
      padding: '12px 20px',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '600',
      zIndex: '10000',
      transform: 'translateX(100%)',
      transition: 'transform 0.3s ease',
      backgroundColor: type === 'error' ? '#e74c3c' : type === 'success' ? '#27ae60' : '#3498db'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
}

// Initialize app when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  new App();
});
