// Sistema de Busca e Filtros - Versão Otimizada
class SearchAndFilters {
    constructor() {
        this.allData = [];
        this.filteredData = [];
        this.currentFilters = {
            search: '',
            language: 'all',
            type: 'all',
            sort: 'updated',
        };
        this.debounceTimer = null;
        this.isInitialized = false;
        this.init();
    }

    init() {
        // Aguardar o DOM estar pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        this.createSearchInterface();
        this.setupEventListeners();
        this.loadData();
        this.isInitialized = true;
    }

    // Criar interface de busca simplificada
    createSearchInterface() {
        const searchContainer = document.getElementById('searchContainer');
        if (!searchContainer) {
            console.warn('Container de busca não encontrado no HTML');
            return;
        }

        console.log('✅ Container de busca encontrado no HTML!');

        // Não precisa criar HTML, apenas mostrar o container existente
        this.showSearchContainer();
    }

    // Mostrar container de busca
    showSearchContainer() {
        const searchContainer = document.getElementById('searchContainer');
        if (searchContainer) {
            searchContainer.style.display = 'block';
            // Adicionar animação de entrada
            setTimeout(() => {
                searchContainer.classList.add('show');
            }, 100);
        }
    }

    // Adicionar estilos CSS
    addSearchStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .search-container {
                background: var(--card-bg);
                border-radius: 12px;
                padding: 25px;
                margin-bottom: 30px;
                border: 1px solid var(--border);
                box-shadow: 0 4px 12px var(--shadow);
            }
            
            .search-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .search-header h3 {
                color: var(--text-primary);
                font-size: 1.2rem;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .results-count {
                background: var(--accent);
                color: white;
                padding: 4px 12px;
                border-radius: 15px;
                font-size: 0.8rem;
                font-weight: 500;
            }
            
            .search-controls {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .search-bar {
                position: relative;
                display: flex;
                align-items: center;
            }
            
            .search-bar i {
                position: absolute;
                left: 15px;
                color: var(--text-secondary);
                z-index: 1;
            }
            
            .search-bar input {
                width: 100%;
                padding: 12px 45px 12px 45px;
                border: 2px solid var(--border);
                border-radius: 25px;
                background: var(--bg-primary);
                color: var(--text-primary);
                font-size: 0.95rem;
                transition: all 0.3s ease;
            }
            
            .search-bar input:focus {
                outline: none;
                border-color: var(--accent);
                box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
            }
            
            .clear-btn {
                position: absolute;
                right: 12px;
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                padding: 6px;
                border-radius: 50%;
                transition: all 0.3s ease;
            }
            
            .clear-btn:hover {
                background: var(--bg-secondary);
                color: var(--text-primary);
            }
            
            .filters {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr auto;
                gap: 12px;
                align-items: center;
            }
            
            .filter-select {
                padding: 10px 12px;
                border: 2px solid var(--border);
                border-radius: 8px;
                background: var(--bg-primary);
                color: var(--text-primary);
                font-size: 0.9rem;
                cursor: pointer;
                transition: border-color 0.3s ease;
            }
            
            .filter-select:focus {
                outline: none;
                border-color: var(--accent);
            }
            
            .reset-btn {
                background: var(--bg-secondary);
                border: 2px solid var(--border);
                color: var(--text-secondary);
                padding: 10px 12px;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .reset-btn:hover {
                background: var(--accent);
                border-color: var(--accent);
                color: white;
            }
            
            .active-filters {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
                margin-top: 15px;
                padding-top: 15px;
                border-top: 1px solid var(--border);
            }
            
            .filter-tag {
                background: var(--accent);
                color: white;
                padding: 4px 10px;
                border-radius: 12px;
                font-size: 0.8rem;
                display: flex;
                align-items: center;
                gap: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .filter-tag:hover {
                background: var(--accent-hover);
                transform: scale(1.05);
            }
            
            .suggestions {
                background: var(--card-bg);
                border: 1px solid var(--border);
                border-radius: 8px;
                margin-top: 5px;
                box-shadow: 0 4px 12px var(--shadow);
                max-height: 200px;
                overflow-y: auto;
            }
            
            .suggestion-item {
                padding: 10px 15px;
                cursor: pointer;
                transition: background-color 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .suggestion-item:hover {
                background: var(--bg-secondary);
            }
            
            .no-results {
                text-align: center;
                padding: 40px 20px;
                color: var(--text-secondary);
            }
            
            .no-results i {
                font-size: 2.5rem;
                margin-bottom: 15px;
                opacity: 0.5;
            }
            
            @media (max-width: 768px) {
                .search-container {
                    padding: 20px;
                }
                
                .search-header {
                    flex-direction: column;
                    gap: 10px;
                    text-align: center;
                }
                
                .filters {
                    grid-template-columns: 1fr;
                    gap: 10px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Configurar event listeners
    setupEventListeners() {
        const searchInput = document.getElementById('projectSearch');
        const languageFilter = document.getElementById('languageFilter');
        const typeFilter = document.getElementById('typeFilter');
        const sortFilter = document.getElementById('sortFilter');
        const clearBtn = document.getElementById('clearSearch');
        const resetBtn = document.getElementById('resetFilters');

        if (searchInput) {
            searchInput.addEventListener('input', e => {
                this.handleSearch(e.target.value);
            });

            searchInput.addEventListener('focus', () => {
                if (searchInput.value.length > 1) {
                    this.showSuggestions(searchInput.value);
                }
            });

            searchInput.addEventListener('blur', () => {
                setTimeout(() => this.hideSuggestions(), 200);
            });
        }

        if (languageFilter) {
            languageFilter.addEventListener('change', e => {
                this.currentFilters.language = e.target.value;
                this.applyFilters();
                this.updateActiveFilters();
            });
        }

        if (typeFilter) {
            typeFilter.addEventListener('change', e => {
                this.currentFilters.type = e.target.value;
                this.applyFilters();
                this.updateActiveFilters();
            });
        }

        if (sortFilter) {
            sortFilter.addEventListener('change', e => {
                this.currentFilters.sort = e.target.value;
                this.applyFilters();
            });
        }

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                searchInput.value = '';
                this.currentFilters.search = '';
                this.updateClearButton();
                this.applyFilters();
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetAllFilters();
            });
        }
    }

    // Carregar dados
    async loadData() {
        try {
            // Aguardar dados dos repositórios existentes
            await this.waitForRepositories();
            this.populateLanguageFilter();
            this.applyFilters();
        } catch (error) {
            console.warn('Erro ao carregar dados para busca:', error);
            this.showFallbackData();
        }
    }

    // Aguardar repositórios carregarem
    waitForRepositories() {
        return new Promise(resolve => {
            const checkData = () => {
                const repoCards = document.querySelectorAll('.repo-card');
                const contribCards = document.querySelectorAll('.contribution-card');

                if (repoCards.length > 0 || contribCards.length > 0) {
                    this.extractDataFromDOM();
                    this.showSearchContainer(); // Mostrar busca quando dados carregarem
                    resolve();
                } else {
                    setTimeout(checkData, 500);
                }
            };
            checkData();
        });
    }

    // Extrair dados do DOM
    extractDataFromDOM() {
        this.allData = [];

        // Extrair repositórios
        document.querySelectorAll('.repo-card').forEach(card => {
            const data = this.extractCardData(card, 'repository');
            if (data) this.allData.push(data);
        });

        // Extrair contribuições
        document.querySelectorAll('.contribution-card').forEach(card => {
            const data = this.extractCardData(card, 'contribution');
            if (data) this.allData.push(data);
        });
    }

    // Extrair dados de um card
    extractCardData(card, type) {
        const titleEl = card.querySelector('.repo-name, .contribution-title a, h3 a');
        const descEl = card.querySelector('.repo-description, .contribution-description, p');
        const langEl = card.querySelector('.repo-language span:last-child, .language-dot + span');
        const starsEl = card.querySelector('.repo-stars span, .stat i.fa-star + span');
        const linkEl = card.querySelector('a[href*="github.com"]');

        if (!titleEl) return null;

        return {
            name: titleEl.textContent.trim(),
            description: descEl ? descEl.textContent.trim() : '',
            language: langEl ? langEl.textContent.trim() : '',
            stars: starsEl ? parseInt(starsEl.textContent) || 0 : 0,
            url: linkEl ? linkEl.href : '',
            type: type,
            element: card,
        };
    }

    // Popular filtro de linguagens
    populateLanguageFilter() {
        const languageFilter = document.getElementById('languageFilter');
        if (!languageFilter) return;

        const languages = [
            ...new Set(
                this.allData.map(item => item.language).filter(lang => lang && lang !== 'N/A')
            ),
        ].sort();

        // Limpar opções existentes (exceto "Todas")
        languageFilter.innerHTML = '<option value="all">Todas as linguagens</option>';

        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang;
            option.textContent = lang;
            languageFilter.appendChild(option);
        });
    }

    // Manipular busca com debounce
    handleSearch(query) {
        clearTimeout(this.debounceTimer);
        this.currentFilters.search = query;
        this.updateClearButton();

        if (query.length > 1) {
            this.showSuggestions(query);
        } else {
            this.hideSuggestions();
        }

        this.debounceTimer = setTimeout(() => {
            this.applyFilters();
        }, 300);
    }

    // Aplicar filtros
    applyFilters() {
        let filtered = [...this.allData];

        // Filtro de busca
        if (this.currentFilters.search) {
            const query = this.currentFilters.search.toLowerCase();
            filtered = filtered.filter(
                item =>
                    item.name.toLowerCase().includes(query) ||
                    item.description.toLowerCase().includes(query) ||
                    item.language.toLowerCase().includes(query)
            );
        }

        // Filtro de linguagem
        if (this.currentFilters.language !== 'all') {
            filtered = filtered.filter(item => item.language === this.currentFilters.language);
        }

        // Filtro de tipo
        if (this.currentFilters.type !== 'all') {
            const typeMap = { own: 'repository', contrib: 'contribution' };
            filtered = filtered.filter(item => item.type === typeMap[this.currentFilters.type]);
        }

        // Ordenação
        this.sortData(filtered);

        this.filteredData = filtered;
        this.renderResults();
        this.updateResultsCount();
    }

    // Ordenar dados
    sortData(data) {
        switch (this.currentFilters.sort) {
            case 'stars':
                data.sort((a, b) => b.stars - a.stars);
                break;
            case 'name':
                data.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'updated':
            default:
                // Manter ordem original (mais recentes primeiro)
                break;
        }
    }

    // Renderizar resultados
    renderResults() {
        // Esconder todos os elementos
        this.allData.forEach(item => {
            if (item.element) {
                item.element.style.display = 'none';
            }
        });

        // Mostrar elementos filtrados
        this.filteredData.forEach(item => {
            if (item.element) {
                item.element.style.display = 'block';
            }
        });

        // Mostrar mensagem se não há resultados
        this.showNoResultsMessage();
    }

    // Mostrar mensagem de "sem resultados"
    showNoResultsMessage() {
        let noResultsEl = document.getElementById('noResultsMessage');

        if (this.filteredData.length === 0) {
            if (!noResultsEl) {
                noResultsEl = document.createElement('div');
                noResultsEl.id = 'noResultsMessage';
                noResultsEl.className = 'no-results';
                noResultsEl.innerHTML = `
                    <i class="fas fa-search"></i>
                    <h3>Nenhum projeto encontrado</h3>
                    <p>Tente ajustar os filtros ou usar termos diferentes.</p>
                `;

                const repoGrid = document.getElementById('repositoriesGrid');
                const contribGrid = document.getElementById('contributionsGrid');
                const targetGrid = repoGrid || contribGrid;

                if (targetGrid) {
                    targetGrid.appendChild(noResultsEl);
                }
            }
            noResultsEl.style.display = 'block';
        } else if (noResultsEl) {
            noResultsEl.style.display = 'none';
        }
    }

    // Mostrar sugestões
    showSuggestions(query) {
        const suggestions = this.generateSuggestions(query);
        const container = document.getElementById('searchSuggestions');

        if (suggestions.length > 0 && container) {
            const suggestionsHTML = suggestions
                .map(
                    suggestion =>
                        `<div class="suggestion-item" onclick="searchFilters.applySuggestion('${suggestion}')">
                    <i class="fas fa-search"></i>
                    ${suggestion}
                </div>`
                )
                .join('');

            container.innerHTML = suggestionsHTML;
            container.style.display = 'block';
        } else {
            this.hideSuggestions();
        }
    }

    // Gerar sugestões
    generateSuggestions(query) {
        const suggestions = new Set();
        const queryLower = query.toLowerCase();

        this.allData.forEach(item => {
            // Sugestões de nomes
            if (item.name.toLowerCase().includes(queryLower)) {
                suggestions.add(item.name);
            }

            // Sugestões de linguagens
            if (item.language && item.language.toLowerCase().includes(queryLower)) {
                suggestions.add(item.language);
            }
        });

        return Array.from(suggestions).slice(0, 5);
    }

    // Aplicar sugestão
    applySuggestion(suggestion) {
        const searchInput = document.getElementById('projectSearch');
        if (searchInput) {
            searchInput.value = suggestion;
            this.handleSearch(suggestion);
            this.hideSuggestions();
        }
    }

    // Esconder sugestões
    hideSuggestions() {
        const container = document.getElementById('searchSuggestions');
        if (container) {
            container.style.display = 'none';
        }
    }

    // Atualizar botão de limpar
    updateClearButton() {
        const clearBtn = document.getElementById('clearSearch');
        const searchInput = document.getElementById('projectSearch');

        if (clearBtn && searchInput) {
            clearBtn.style.display = searchInput.value ? 'block' : 'none';
        }
    }

    // Atualizar filtros ativos
    updateActiveFilters() {
        const container = document.getElementById('activeFilters');
        if (!container) return;

        const activeFilters = [];

        if (this.currentFilters.language !== 'all') {
            activeFilters.push({
                type: 'language',
                label: `Linguagem: ${this.currentFilters.language}`,
            });
        }

        if (this.currentFilters.type !== 'all') {
            const typeLabels = { own: 'Meus Repositórios', contrib: 'Contribuições' };
            activeFilters.push({
                type: 'type',
                label: `Tipo: ${typeLabels[this.currentFilters.type]}`,
            });
        }

        if (activeFilters.length > 0) {
            const tagsHTML = activeFilters
                .map(
                    filter =>
                        `<span class="filter-tag" onclick="searchFilters.removeFilter('${filter.type}')">
                    ${filter.label}
                    <i class="fas fa-times"></i>
                </span>`
                )
                .join('');

            container.innerHTML = tagsHTML;
            container.style.display = 'flex';
        } else {
            container.style.display = 'none';
        }
    }

    // Remover filtro específico
    removeFilter(filterType) {
        if (filterType === 'language') {
            this.currentFilters.language = 'all';
            document.getElementById('languageFilter').value = 'all';
        } else if (filterType === 'type') {
            this.currentFilters.type = 'all';
            document.getElementById('typeFilter').value = 'all';
        }

        this.applyFilters();
        this.updateActiveFilters();
    }

    // Resetar todos os filtros
    resetAllFilters() {
        this.currentFilters = {
            search: '',
            language: 'all',
            type: 'all',
            sort: 'updated',
        };

        const searchInput = document.getElementById('projectSearch');
        const languageFilter = document.getElementById('languageFilter');
        const typeFilter = document.getElementById('typeFilter');
        const sortFilter = document.getElementById('sortFilter');

        if (searchInput) searchInput.value = '';
        if (languageFilter) languageFilter.value = 'all';
        if (typeFilter) typeFilter.value = 'all';
        if (sortFilter) sortFilter.value = 'updated';

        this.updateClearButton();
        this.updateActiveFilters();
        this.hideSuggestions();
        this.applyFilters();
    }

    // Atualizar contador de resultados
    updateResultsCount() {
        const counter = document.getElementById('resultsCount');
        if (counter) {
            counter.textContent = `${this.filteredData.length} de ${this.allData.length}`;
        }
    }

    // Dados de fallback
    showFallbackData() {
        const counter = document.getElementById('resultsCount');
        if (counter) {
            counter.textContent = 'Carregando...';
        }
    }

    // Método público para recarregar dados
    refresh() {
        if (this.isInitialized) {
            this.extractDataFromDOM();
            this.populateLanguageFilter();
            this.applyFilters();
        }
    }
}

// Inicializar automaticamente
document.addEventListener('DOMContentLoaded', () => {
    console.log('🔍 Inicializando sistema de busca...');

    // Aguardar um pouco para garantir que outros scripts carregaram
    setTimeout(() => {
        try {
            window.searchFilters = new SearchAndFilters();
            console.log('✅ Sistema de busca inicializado!');
        } catch (error) {
            console.error('❌ Erro ao inicializar busca:', error);
        }
    }, 1500);
});

// Exportar para uso global
window.SearchAndFilters = SearchAndFilters;
