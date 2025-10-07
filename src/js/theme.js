// Sistema de Tema Dark/Light Mode - Versão Aprimorada
class ThemeManager {
    constructor() {
        this.currentTheme = 'light';
        this.themeToggle = null;
        this.init();
    }

    init() {
        this.setupThemeToggle();
        this.loadSavedTheme();
        this.setupEventListeners();
        this.addThemeStyles();
    }

    // Configurar botão de alternância de tema
    setupThemeToggle() {
        this.themeToggle = document.getElementById('themeToggle');
        
        if (!this.themeToggle) {
            console.warn('Botão de tema não encontrado');
            return;
        }
    }

    // Carregar tema salvo
    loadSavedTheme() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        this.setTheme(savedTheme);
    }

    // Configurar event listeners
    setupEventListeners() {
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Detectar preferência do sistema
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addEventListener('change', (e) => {
                if (!localStorage.getItem('theme')) {
                    this.setTheme(e.matches ? 'dark' : 'light');
                }
            });
        }

        // Atalho de teclado (Ctrl/Cmd + Shift + T)
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggleTheme();
            }
        });
    }

    // Alternar tema
    toggleTheme() {
        const newTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
        
        // Animação suave na transição
        this.animateThemeTransition();
    }

    // Definir tema
    setTheme(theme) {
        this.currentTheme = theme;
        document.body.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        this.updateThemeIcon();
        this.updateMetaThemeColor();
        
        // Disparar evento customizado
        document.dispatchEvent(new CustomEvent('themeChanged', {
            detail: { theme }
        }));
    }

    // Atualizar ícone do botão
    updateThemeIcon() {
        if (!this.themeToggle) return;
        
        const icon = this.themeToggle.querySelector('i');
        if (icon) {
            if (this.currentTheme === 'dark') {
                icon.className = 'fas fa-sun';
                this.themeToggle.setAttribute('aria-label', 'Alternar para tema claro');
                this.themeToggle.setAttribute('title', 'Modo Claro');
            } else {
                icon.className = 'fas fa-moon';
                this.themeToggle.setAttribute('aria-label', 'Alternar para tema escuro');
                this.themeToggle.setAttribute('title', 'Modo Escuro');
            }
        }
    }

    // Atualizar cor do tema no meta tag
    updateMetaThemeColor() {
        let metaThemeColor = document.querySelector('meta[name="theme-color"]');
        
        if (!metaThemeColor) {
            metaThemeColor = document.createElement('meta');
            metaThemeColor.name = 'theme-color';
            document.head.appendChild(metaThemeColor);
        }
        
        const colors = {
            light: '#ffffff',
            dark: '#1a1a1a'
        };
        
        metaThemeColor.content = colors[this.currentTheme];
    }

    // Animação de transição suave
    animateThemeTransition() {
        document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
        
        setTimeout(() => {
            document.body.style.transition = '';
        }, 300);
    }

    // Adicionar estilos CSS para temas
    addThemeStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Variáveis CSS para temas */
            :root {
                /* Tema Claro */
                --bg-primary: #ffffff;
                --bg-secondary: #f8fafc;
                --bg-tertiary: #f1f5f9;
                --text-primary: #1e293b;
                --text-secondary: #64748b;
                --text-muted: #94a3b8;
                --border: #e2e8f0;
                --border-light: #f1f5f9;
                --card-bg: #ffffff;
                --shadow: rgba(0, 0, 0, 0.1);
                --shadow-light: rgba(0, 0, 0, 0.05);
                --accent: #4f46e5;
                --accent-hover: #4338ca;
                --accent-light: #eef2ff;
                --success: #10b981;
                --warning: #f59e0b;
                --error: #ef4444;
                --info: #3b82f6;
            }

            [data-theme="dark"] {
                /* Tema Escuro */
                --bg-primary: #0f172a;
                --bg-secondary: #1e293b;
                --bg-tertiary: #334155;
                --text-primary: #f8fafc;
                --text-secondary: #cbd5e1;
                --text-muted: #94a3b8;
                --border: #334155;
                --border-light: #475569;
                --card-bg: #1e293b;
                --shadow: rgba(0, 0, 0, 0.3);
                --shadow-light: rgba(0, 0, 0, 0.2);
                --accent: #6366f1;
                --accent-hover: #5b21b6;
                --accent-light: #312e81;
                --success: #059669;
                --warning: #d97706;
                --error: #dc2626;
                --info: #2563eb;
            }

            /* Transições suaves */
            * {
                transition: background-color 0.3s ease, 
                           border-color 0.3s ease, 
                           color 0.3s ease,
                           box-shadow 0.3s ease;
            }

            /* Aplicar variáveis aos elementos */
            body {
                background-color: var(--bg-primary);
                color: var(--text-primary);
            }

            /* Botão de tema */
            .theme-toggle {
                background: var(--card-bg);
                border: 2px solid var(--border);
                color: var(--text-primary);
                border-radius: 50%;
                width: 44px;
                height: 44px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .theme-toggle:hover {
                background: var(--accent);
                border-color: var(--accent);
                color: white;
                transform: scale(1.1);
            }

            .theme-toggle:active {
                transform: scale(0.95);
            }

            /* Animação do ícone */
            .theme-toggle i {
                transition: transform 0.3s ease;
            }

            .theme-toggle:hover i {
                transform: rotate(20deg);
            }

            /* Efeito de ondulação no clique */
            .theme-toggle::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: translate(-50%, -50%);
                transition: width 0.3s ease, height 0.3s ease;
            }

            .theme-toggle:active::before {
                width: 100%;
                height: 100%;
            }

            /* Indicador visual do tema ativo */
            [data-theme="dark"] .theme-toggle {
                box-shadow: 0 0 20px rgba(99, 102, 241, 0.3);
            }

            /* Scrollbar personalizada para tema escuro */
            [data-theme="dark"] ::-webkit-scrollbar {
                width: 8px;
            }

            [data-theme="dark"] ::-webkit-scrollbar-track {
                background: var(--bg-secondary);
            }

            [data-theme="dark"] ::-webkit-scrollbar-thumb {
                background: var(--border);
                border-radius: 4px;
            }

            [data-theme="dark"] ::-webkit-scrollbar-thumb:hover {
                background: var(--text-secondary);
            }

            /* Seleção de texto personalizada */
            [data-theme="dark"] ::selection {
                background: var(--accent-light);
                color: var(--text-primary);
            }

            /* Foco personalizado para tema escuro */
            [data-theme="dark"] *:focus {
                outline-color: var(--accent);
            }

            /* Animação de entrada para o tema */
            @keyframes themeTransition {
                0% { opacity: 0.8; }
                100% { opacity: 1; }
            }

            [data-theme] {
                animation: themeTransition 0.3s ease;
            }
        `;
        document.head.appendChild(style);
    }

    // Método público para obter tema atual
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Método público para definir tema programaticamente
    setThemeManually(theme) {
        if (['light', 'dark'].includes(theme)) {
            this.setTheme(theme);
        }
    }

    // Detectar preferência do sistema
    getSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    // Resetar para preferência do sistema
    resetToSystemPreference() {
        localStorage.removeItem('theme');
        const systemTheme = this.getSystemPreference();
        this.setTheme(systemTheme);
    }
}

// Inicializar automaticamente
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎨 Inicializando gerenciador de tema...');
    
    try {
        window.themeManager = new ThemeManager();
        console.log('✅ Gerenciador de tema inicializado!');
    } catch (error) {
        console.error('❌ Erro ao inicializar tema:', error);
    }
});

// Exportar para uso global
window.ThemeManager = ThemeManager;