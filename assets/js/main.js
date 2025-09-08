class MinimercadoWeb {
  constructor() {
    this.router = null;
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeComponents();
    console.log('Minimercado Web initialized');
  }

  setupEventListeners() {
    // Use global router instance
    this.router = window.router;

    // Handle window resize
    window.addEventListener('resize', this.handleResize.bind(this));
    
    // Handle scroll for fixed header
    window.addEventListener('scroll', this.handleScroll.bind(this));
  }

  handleResize() {
    // Handle responsive adjustments if needed
    const content = document.getElementById('spa-content');
    if (content && window.innerWidth < 768) {
      content.style.minHeight = '500px';
    } else if (content) {
      content.style.minHeight = '600px';
    }
  }

  handleScroll() {
    const header = document.querySelector('.main-header');
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }

  initializeComponents() {
    // Initialize any additional components here
    this.setupAccessibility();
  }

  setupAccessibility() {
    // Add keyboard navigation support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        // Handle tab navigation
        document.body.classList.add('keyboard-navigation');
      }
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  // Public methods
  navigateTo(route) {
    if (this.router) {
      this.router.navigateTo(route);
    }
  }

  getCurrentRoute() {
    return this.router ? this.router.getCurrentRoute() : null;
  }

  // Utility methods (removidas funções não utilizadas)
  static showLoading(show = true) {
    const loading = document.querySelector('.loading');
    if (loading) {
      loading.style.display = show ? 'flex' : 'none';
    }
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.minimercadoWeb = new MinimercadoWeb();
});

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MinimercadoWeb;
}
