document.addEventListener('DOMContentLoaded', function() {
  // Cache DOM elements
  const elements = {
    mobileMenuButton: document.getElementById('mobile-menu-button'),
    mobileMenu: document.getElementById('mobile-menu'),
    themeToggle: document.getElementById('theme-toggle'),
    mobileThemeToggle: document.getElementById('mobile-theme-toggle'),
    themeText: document.getElementById('theme-text'),
    sections: document.querySelectorAll('section'),
    navLinks: document.querySelectorAll('.nav-link, .mobile-nav-link'),
    mobileNavLinks: document.querySelectorAll('.mobile-nav-link'),
    animatedElements: document.querySelectorAll('.animate-slide-up, .animate-fade-in')
  };

  // Mobile menu functionality
  if (elements.mobileMenuButton && elements.mobileMenu) {
    elements.mobileMenuButton.addEventListener('click', () => {
      elements.mobileMenu.classList.toggle('hidden');
    });
  }

  // Theme management
  const themeManager = {
    init() {
      this.setInitialTheme();
      this.setupThemeToggles();
    },

    setInitialTheme() {
      const isDark = localStorage.getItem('color-theme') === 'dark' || 
        (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
      
      document.documentElement.classList.toggle('dark', isDark);
      if (elements.themeText) {
        elements.themeText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
      }
    },

    setupThemeToggles() {
      const toggleTheme = () => {
        const isDark = document.documentElement.classList.contains('dark');
        document.documentElement.classList.toggle('dark');
        localStorage.setItem('color-theme', isDark ? 'light' : 'dark');
        if (elements.themeText) {
          elements.themeText.textContent = isDark ? 'Dark Mode' : 'Light Mode';
        }
      };

      if (elements.themeToggle) elements.themeToggle.addEventListener('click', toggleTheme);
      if (elements.mobileThemeToggle) elements.mobileThemeToggle.addEventListener('click', toggleTheme);
    }
  };

  // Navigation highlighting
  const navigationManager = {
    init() {
      this.updateActiveLink();
      window.addEventListener('scroll', this.debounce(this.updateActiveLink.bind(this), 100));
    },

    updateActiveLink() {
      const scrollPosition = window.scrollY + 100;
      let activeIndex = elements.sections.length;

      while (--activeIndex && scrollPosition < elements.sections[activeIndex].offsetTop) {}

      elements.navLinks.forEach(link => link.classList.remove('active'));
      elements.navLinks[activeIndex]?.classList.add('active');
    },

    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  };

  // Smooth scrolling
  const scrollManager = {
    init() {
      document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', this.handleSmoothScroll);
      });
    },

    handleSmoothScroll(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: 'smooth'
        });
      }
    }
  };

  // Animation manager
  const animationManager = {
    init() {
      this.setInitialState();
      this.animateOnScroll();
      window.addEventListener('load', () => this.animateOnScroll());
      window.addEventListener('scroll', this.debounce(() => this.animateOnScroll(), 100));
    },

    setInitialState() {
      elements.animatedElements.forEach(el => {
        if (el.classList.contains('animate-slide-up')) {
          el.style.opacity = '0';
          el.style.transform = 'translateY(20px)';
          el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        } else if (el.classList.contains('animate-fade-in')) {
          el.style.opacity = '0';
          el.style.transition = 'opacity 0.6s ease-out';
        }
      });
    },

    animateOnScroll() {
      const windowHeight = window.innerHeight;
      
      elements.animatedElements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        
        if (elementPosition < windowHeight - 100) {
          element.style.opacity = '1';
          element.style.transform = 'translateY(0)';
        }
      });
    },

    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    }
  };

  // Mobile menu link handling
  if (elements.mobileNavLinks.length && elements.mobileMenu) {
    elements.mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        elements.mobileMenu.classList.add('hidden');
      });
    });
  }

  // Initialize all managers
  themeManager.init();
  navigationManager.init();
  scrollManager.init();
  animationManager.init();
});