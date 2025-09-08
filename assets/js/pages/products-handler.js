class ProductsPageHandler {
  static initialized = false;

  static initializeIfNeeded() {
    if (this.initialized) return;
    
    const carousel = document.getElementById('productsCarousel');
    if (!carousel) return;

    this.initialize();
    this.initialized = true;
  }

  static initialize() {
    // Initialize Bootstrap carousel
    this.initializeCarousel();
    
    // Add product card interactions
    this.initializeProductCards();
    
    // Initialize navigation buttons
    this.initializeNavigation();
  }

  static initializeCarousel() {
    const carousel = document.getElementById('productsCarousel');
    if (carousel && typeof bootstrap !== 'undefined') {
      new bootstrap.Carousel(carousel, {
        interval: 5000,
        wrap: true
      });
    }
  }

  static initializeProductCards() {
    // Add hover effects and interactions to product cards
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        const image = card.querySelector('.product-image');
        if (image) {
          image.style.transform = 'scale(1.05)';
        }
      });

      card.addEventListener('mouseleave', () => {
        const image = card.querySelector('.product-image');
        if (image) {
          image.style.transform = 'scale(1)';
        }
      });
    });
  }

  static initializeNavigation() {
    // Handle navigation links in call-to-action sections
    const ctaButtons = document.querySelectorAll('[data-page]');
    ctaButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const page = button.getAttribute('data-page');
        if (window.router && page) {
          window.router.navigateTo(page);
        }
      });
    });
  }
}

// Auto-initialize when page loads
document.addEventListener('pageLoaded', (e) => {
  if (e.detail.route === 'products') {
    ProductsPageHandler.initializeIfNeeded();
  }
});

// Legacy support
window.ProductsHandler = ProductsPageHandler;
