class SimpleRouter {
  constructor() {
    this.routes = {
      'about': 'pages/about.html',
      'products': 'pages/products.html',
      'services': 'pages/services.html',
      'customer-register': 'pages/customer-register.html',
      'scheduling': 'pages/scheduling.html'
    };
    this.currentRoute = 'about';
    this.contentContainer = null;
    this.init();
  }

  init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    this.contentContainer = document.getElementById('spa-content');
    if (!this.contentContainer) {
      console.error('Content container with ID "spa-content" not found');
      return;
    }

    this.setupNavigationListeners();

    // Handle initial route
    const hash = window.location.hash.substring(1);
    const initialRoute = hash || 'about';
    this.loadRoute(initialRoute, false);

    // Handle back/forward buttons
    window.addEventListener('popstate', (e) => {
      const route = e.state?.route || 'about';
      this.loadRoute(route, false);
    });

    console.log('SimpleRouter initialized - HTML files only, no duplication!');
  }

  setupNavigationListeners() {
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a[data-page]');
      if (link) {
        e.preventDefault();
        const page = link.getAttribute('data-page');
        this.navigateTo(page);
      }
    });
  }

  navigateTo(route) {
    this.loadRoute(route, true);
  }

  async loadRoute(route, updateHistory = true) {
    if (!this.routes[route]) {
      console.error(`Route "${route}" not found`);
      return;
    }

    this.showLoading();

    try {
      const htmlFile = this.routes[route];
      const content = await this.loadHTMLFile(htmlFile);

      if (content) {
        // Clear any existing content completely before loading new content
        this.contentContainer.innerHTML = '';
        this.contentContainer.innerHTML = content;
        this.currentRoute = route;
        
        // Update URL and history
        if (updateHistory) {
          const url = `#${route}`;
          history.pushState({ route }, '', url);
        }
        
        // Update navigation
        this.updateActiveNavigation(route);
        
        // Update page title
        document.title = this.getPageTitle(route);
        
        // Initialize components after content load
        setTimeout(() => {
          this.initializePageComponents(route);
        }, 150);
      }
    } catch (error) {
      console.error('Error loading route:', error);
      this.showError(error);
    } finally {
      this.hideLoading();
    }
  }

  async loadHTMLFile(filePath) {
    try {
      // Try fetch first (works with http://)
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`Failed to load ${filePath}: ${response.status}`);
      }
      const html = await response.text();
      
      // Extract only the body content to avoid conflicts
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const bodyContent = doc.querySelector('body > .container-fluid');
      
      if (bodyContent) {
        return bodyContent.outerHTML;
      } else {
        return doc.body.innerHTML;
      }
      
    } catch (error) {
      console.warn(`Failed to fetch ${filePath}, using fallback content:`, error);
      
      // Return minimal fallback content based on the route
      const route = Object.keys(this.routes).find(key => this.routes[key] === filePath);
      return this.getFallbackContent(route || 'about');
    }
  }

  getFallbackContent(route) {
    const pageInfo = {
      'about': { title: 'Sobre', icon: 'bi-shop', desc: 'Conheça nossa história e localização' },
      'products': { title: 'Produtos', icon: 'bi-basket-fill', desc: 'Carnes, hortifruti e mercearia frescos' },
      'services': { title: 'Serviços', icon: 'bi-gear-fill', desc: 'Entrega domiciliar e retirada na loja' },
      'customer-register': { title: 'Cadastro', icon: 'bi-person-plus-fill', desc: 'Registre-se para fazer pedidos' },
      'scheduling': { title: 'Agendamento', icon: 'bi-calendar-check-fill', desc: 'Agende sua entrega ou retirada' }
    };

    const info = pageInfo[route] || { title: 'Página', icon: 'bi-exclamation-triangle-fill', desc: 'Página não encontrada' };

    return `
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-lg-8">
            <div class="card shadow">
              <div class="card-header bg-primary text-white text-center py-4">
                <i class="${info.icon} display-4 mb-3"></i>
                <h2 class="mb-0">${info.title} - Minimercado Web</h2>
              </div>
              <div class="card-body p-5 text-center">
                <h4 class="mb-4">${info.desc}</h4>
                <div class="alert alert-info">
                  <i class="bi bi-info-circle me-2"></i>
                  <strong>Modo Básico Ativo:</strong> Para experiência completa, use um servidor web local.
                </div>
                
                <div class="row g-4 mt-4">
                  <div class="col-md-6">
                    <div class="card bg-light h-100">
                      <div class="card-body p-3">
                        <h5 class="text-primary"><i class="bi bi-telephone-fill me-2"></i>Contato</h5>
                        <p class="mb-2">(00) 1234-5678</p>
                        <small class="text-muted">Segunda a Sábado: 7h-20h</small>
                      </div>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <div class="card bg-light h-100">
                      <div class="card-body p-3">
                        <h5 class="text-success"><i class="bi bi-shop me-2"></i>Produtos</h5>
                        <p class="mb-2">Carnes, Hortifruti, Mercearia</p>
                        <small class="text-muted">Produtos frescos diários</small>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mt-4">
                  <h6 class="text-muted mb-3">Navegação:</h6>
                  <div class="d-flex flex-wrap gap-2 justify-content-center">
                    ${Object.entries(pageInfo).map(([key, data]) => `
                      <button class="btn btn-outline-primary btn-sm" onclick="window.router.navigateTo('${key}')">
                        <i class="${data.icon} me-1"></i>${data.title}
                      </button>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  initializePageComponents(route) {
    // Initialize Bootstrap components
    this.initializeBootstrapComponents();
    
    // Let each page initialize itself if it has specific components
    const pageInitEvent = new CustomEvent('pageLoaded', { 
      detail: { route, router: this }
    });
    document.dispatchEvent(pageInitEvent);
    
    // Legacy support - remove eventually
    if (route === 'customer-register' && window.CustomerForm) {
      window.CustomerForm.initializeIfNeeded?.();
    } else if (route === 'scheduling' && window.SchedulingSystem) {
      window.SchedulingSystem.initializeIfNeeded?.();
    }
  }

  // Utility methods for shared functionality
  showSuccessModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal && typeof bootstrap !== 'undefined') {
      const bsModal = new bootstrap.Modal(modal);
      
      // When modal closes, navigate back to about page
      modal.addEventListener('hidden.bs.modal', () => {
        this.navigateTo('about');
      }, { once: true });
      
      bsModal.show();
    }
  }

  showLoading() {
    this.contentContainer.innerHTML = `
      <div class="d-flex justify-content-center align-items-center" style="min-height: 300px;">
        <div class="text-center">
          <div class="spinner-border text-primary mb-3" role="status">
            <span class="visually-hidden">Carregando...</span>
          </div>
          <p class="text-muted">Carregando página...</p>
        </div>
      </div>
    `;
  }

  hideLoading() {
    // Loading is replaced by content, no need to explicitly hide
  }

  showError(error) {
    this.contentContainer.innerHTML = `
      <div class="container-fluid">
        <div class="row justify-content-center">
          <div class="col-md-8">
            <div class="alert alert-danger" role="alert">
              <h4 class="alert-heading">
                <i class="bi bi-exclamation-triangle-fill me-2"></i>Erro ao Carregar Página
              </h4>
              <p class="mb-3">${error.message}</p>
              <hr>
              <div class="d-flex gap-2">
                <button class="btn btn-outline-danger" onclick="location.reload()">
                  <i class="bi bi-arrow-clockwise me-1"></i>Recarregar
                </button>
                <button class="btn btn-primary" onclick="window.router.navigateTo('about')">
                  <i class="bi bi-house me-1"></i>Ir para Início
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  updateActiveNavigation(route) {
    // Update navigation active states
    document.querySelectorAll('.nav-link').forEach(link => {
      const page = link.getAttribute('data-page');
      if (page === route) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  getPageTitle(route) {
    const titles = {
      'about': 'Sobre - Minimercado Web',
      'products': 'Produtos - Minimercado Web',
      'services': 'Serviços - Minimercado Web', 
      'customer-register': 'Cadastro - Minimercado Web',
      'scheduling': 'Agendamento - Minimercado Web'
    };
    return titles[route] || 'Minimercado Web';
  }

  getCurrentRoute() {
    return this.currentRoute;
  }

  initializeBootstrapComponents() {
    // Initialize Bootstrap carousels
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => {
      if (typeof bootstrap !== 'undefined' && bootstrap.Carousel) {
        new bootstrap.Carousel(carousel);
      }
    });

    // Initialize Bootstrap modals
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
        // Just ensure they're ready, don't auto-initialize
      }
    });
  }
}

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  if (!window.router) {
    window.router = new SimpleRouter();
    window.minimercadoWeb = window.router;
  }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SimpleRouter;
}
