class YouTubeSidebar {
  constructor() {
    this.sidebar = document.getElementById('sidebar');
    this.menuToggle = document.getElementById('menuToggle');
    this.sidebarOverlay = document.getElementById('sidebarOverlay');
    this.sidebarItems = document.querySelectorAll('.sidebar-item');
    
    this.isExpanded = window.innerWidth > 768;
    this.isMobile = window.innerWidth <= 768;
    
    this.init();
  }
  
  init() {
    // Toggle sidebar
    this.menuToggle.addEventListener('click', () => this.toggleSidebar());
    
    // Fechar sidebar no mobile ao clicar no overlay
    if (this.sidebarOverlay) {
      this.sidebarOverlay.addEventListener('click', () => {
        if (this.isMobile) {
          this.collapseSidebar();
        }
      });
    }
    
    // Navegação
    this.sidebarItems.forEach(item => {
      item.addEventListener('click', (e) => this.handleNavigation(e));
    });
    
    // Responsividade
    window.addEventListener('resize', () => this.handleResize());
    
    // Estado inicial
    this.updateSidebarState();
  }
  
  toggleSidebar() {
    this.isExpanded = !this.isExpanded;
    this.updateSidebarState();
  }
  
  collapseSidebar() {
    this.isExpanded = false;
    this.updateSidebarState();
  }
  
  expandSidebar() {
    this.isExpanded = true;
    this.updateSidebarState();
  }
  
  updateSidebarState() {
    if (this.isExpanded) {
      this.sidebar.classList.add('expanded');
      this.menuToggle.innerHTML = '✕';
    } else {
      this.sidebar.classList.remove('expanded');
      this.menuToggle.innerHTML = '☰';
    }
  }
  
  handleNavigation(e) {
    e.preventDefault();
    
    // Remove active de todos os itens
    this.sidebarItems.forEach(item => item.classList.remove('active'));
    
    // Adiciona active no item clicado
    e.currentTarget.classList.add('active');
    
    // Fecha sidebar no mobile após navegação
    if (this.isMobile) {
      this.collapseSidebar();
    }
    
    // Aqui você pode adicionar lógica para carregar conteúdo ou redirecionar
    const href = e.currentTarget.getAttribute('href');
    if (href && href !== '#') {
      window.location.href = href;
    }
  }
  
  handleResize() {
    const wasMobile = this.isMobile;
    this.isMobile = window.innerWidth <= 768;
    
    // Se mudou de desktop para mobile
    if (!wasMobile && this.isMobile) {
      this.collapseSidebar();
    }
    // Se mudou de mobile para desktop
    else if (wasMobile && !this.isMobile) {
      this.isExpanded = false; // Começa colapsado no desktop
      this.updateSidebarState();
    }
  }
  
  // Método para definir item ativo programaticamente
  setActiveItem(selector) {
    this.sidebarItems.forEach(item => item.classList.remove('active'));
    const activeItem = document.querySelector(selector);
    if (activeItem) {
      activeItem.classList.add('active');
    }
  }
}

// Inicializar quando DOM carregar
document.addEventListener('DOMContentLoaded', () => {
  new YouTubeSidebar();
});