// Sistema de Animações de Entrada Inteligentes - Versão Focada
class ScrollAnimations {
    constructor() {
        this.animatedElements = new Set();
        this.observer = null;
        this.init();
    }

    init() {
        this.setupIntersectionObserver();
        this.addAnimationClasses();
        this.observeElements();
        this.setupCounters();
        this.setupProgressBars();
    }

    // Configurar Intersection Observer
    setupIntersectionObserver() {
        const options = {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
                    this.animateElement(entry.target);
                    this.animatedElements.add(entry.target);
                }
            });
        }, options);
    }

    // Adicionar classes CSS para animações
    addAnimationClasses() {
        const style = document.createElement('style');
        style.textContent = `
            .animate-fade-up {
                opacity: 0;
                transform: translateY(30px);
                transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .animate-fade-up.animate-in {
                opacity: 1;
                transform: translateY(0);
            }
            
            .animate-slide-left {
                opacity: 0;
                transform: translateX(-50px);
                transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .animate-slide-left.animate-in {
                opacity: 1;
                transform: translateX(0);
            }
            
            .animate-slide-right {
                opacity: 0;
                transform: translateX(50px);
                transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .animate-slide-right.animate-in {
                opacity: 1;
                transform: translateX(0);
            }
            
            .animate-scale {
                opacity: 0;
                transform: scale(0.8);
                transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            }
            
            .animate-scale.animate-in {
                opacity: 1;
                transform: scale(1);
            }
            
            .animate-stagger > * {
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            }
            
            .animate-stagger.animate-in > * {
                opacity: 1;
                transform: translateY(0);
            }
            
            .typing-cursor::after {
                content: '|';
                animation: blink 1s infinite;
                color: var(--accent);
            }
            
            @keyframes blink {
                0%, 50% { opacity: 1; }
                51%, 100% { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    // Observar elementos automaticamente
    observeElements() {
        // Elementos que devem ser animados
        const selectors = [
            '.repo-card',
            '.contribution-card', 
            '.skill-category',
            '.timeline-item',
            '.stat-card',
            '.value-card',
            '.contact-method',
            '.hero-text',
            '.hero-image'
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                this.addAnimationClass(el);
                this.observer.observe(el);
            });
        });
    }

    // Adicionar classe de animação baseada no elemento
    addAnimationClass(element) {
        if (element.classList.contains('repo-card') || 
            element.classList.contains('stat-card') ||
            element.classList.contains('value-card')) {
            element.classList.add('animate-scale');
        } else if (element.classList.contains('skill-category') ||
                   element.classList.contains('contact-method')) {
            element.classList.add('animate-slide-left');
        } else if (element.classList.contains('timeline-item')) {
            element.classList.add('animate-slide-right');
        } else if (element.classList.contains('hero-image')) {
            element.classList.add('animate-slide-right');
        } else if (element.classList.contains('hero-text')) {
            element.classList.add('animate-slide-left');
        } else {
            element.classList.add('animate-fade-up');
        }
    }

    // Animar elemento
    animateElement(element) {
        // Animação stagger para containers com filhos
        if (element.classList.contains('repositories-grid') ||
            element.classList.contains('contributions-grid') ||
            element.classList.contains('skills-grid')) {
            this.staggerChildren(element);
        } else {
            element.classList.add('animate-in');
        }

        // Disparar eventos especiais
        if (element.classList.contains('stat-number')) {
            this.animateCounter(element);
        }
        
        if (element.querySelector('.skill-progress')) {
            this.animateProgressBars(element);
        }
    }

    // Animação stagger para filhos
    staggerChildren(container) {
        const children = Array.from(container.children);
        children.forEach((child, index) => {
            setTimeout(() => {
                child.classList.add('animate-in');
            }, index * 100);
        });
    }

    // Configurar contadores animados
    setupCounters() {
        document.querySelectorAll('[data-counter]').forEach(counter => {
            this.observer.observe(counter);
        });
    }

    // Animar contador
    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-counter')) || 
                      parseInt(element.textContent) || 0;
        
        if (target === 0) return;

        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    // Configurar barras de progresso
    setupProgressBars() {
        document.querySelectorAll('.skill-item').forEach(item => {
            this.observer.observe(item);
        });
    }

    // Animar barras de progresso
    animateProgressBars(container) {
        const progressBar = container.querySelector('.skill-progress');
        if (progressBar) {
            const width = progressBar.style.width;
            progressBar.style.width = '0%';
            
            setTimeout(() => {
                progressBar.style.transition = 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
                progressBar.style.width = width;
            }, 200);
        }
    }

    // Efeito de digitação
    typeText(element, text, speed = 50) {
        element.textContent = '';
        element.classList.add('typing-cursor');
        
        let index = 0;
        const typeInterval = setInterval(() => {
            element.textContent += text[index];
            index++;
            
            if (index >= text.length) {
                clearInterval(typeInterval);
                setTimeout(() => {
                    element.classList.remove('typing-cursor');
                }, 1000);
            }
        }, speed);
    }

    // Observar novos elementos (para conteúdo dinâmico)
    observeNewElements() {
        this.observeElements();
    }

    // Adicionar elemento específico
    addElement(element, animationType = 'fade-up') {
        element.classList.add(`animate-${animationType}`);
        this.observer.observe(element);
    }

    // Cleanup
    destroy() {
        if (this.observer) {
            this.observer.disconnect();
        }
        this.animatedElements.clear();
    }
}

// Inicializar automaticamente
document.addEventListener('DOMContentLoaded', () => {
    window.scrollAnimations = new ScrollAnimations();
    
    // Adicionar efeito de digitação ao título principal
    const heroTitle = document.querySelector('.hero h2');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        setTimeout(() => {
            window.scrollAnimations.typeText(heroTitle, originalText, 80);
        }, 1000);
    }
});

// Exportar para uso global
window.ScrollAnimations = ScrollAnimations;