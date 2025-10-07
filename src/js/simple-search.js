// Sistema de Busca Simples e Direto
function createSearchInterface() {
    console.log('🔍 Criando interface de busca...');
    
    const repoSection = document.getElementById('repositorios');
    if (!repoSection) {
        console.error('❌ Seção repositorios não encontrada');
        return false;
    }

    const container = repoSection.querySelector('.container');
    if (!container) {
        console.error('❌ Container não encontrado');
        return false;
    }

    // Verificar se já existe
    if (document.getElementById('searchContainer')) {
        console.log('⚠️ Interface de busca já existe');
        return true;
    }

    const searchHTML = `
        <div id="searchContainer" class="search-container" style="
            background: var(--card-bg);
            border-radius: 12px;
            padding: 25px;
            margin: 20px 0;
            border: 1px solid var(--border);
            box-shadow: 0 4px 12px var(--shadow);
        ">
            <div class="search-header" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            ">
                <h3 style="
                    color: var(--text-primary);
                    font-size: 1.2rem;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin: 0;
                ">
                    <i class="fas fa-search"></i> Buscar Projetos
                </h3>
                <span id="resultsCount" style="
                    background: var(--accent);
                    color: white;
                    padding: 4px 12px;
                    border-radius: 15px;
                    font-size: 0.8rem;
                    font-weight: 500;
                ">Carregando...</span>
            </div>
            
            <div class="search-controls" style="
                display: flex;
                flex-direction: column;
                gap: 15px;
            ">
                <div class="search-bar" style="
                    position: relative;
                    display: flex;
                    align-items: center;
                ">
                    <i class="fas fa-search" style="
                        position: absolute;
                        left: 15px;
                        color: var(--text-secondary);
                        z-index: 1;
                    "></i>
                    <input type="text" 
                           id="projectSearch" 
                           placeholder="Buscar por nome, descrição ou tecnologia..."
                           autocomplete="off"
                           style="
                               width: 100%;
                               padding: 12px 45px 12px 45px;
                               border: 2px solid var(--border);
                               border-radius: 25px;
                               background: var(--bg-primary);
                               color: var(--text-primary);
                               font-size: 0.95rem;
                               transition: all 0.3s ease;
                           ">
                    <button id="clearSearch" style="
                        position: absolute;
                        right: 12px;
                        background: none;
                        border: none;
                        color: var(--text-secondary);
                        cursor: pointer;
                        padding: 6px;
                        border-radius: 50%;
                        transition: all 0.3s ease;
                        display: none;
                    ">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="filters" style="
                    display: grid;
                    grid-template-columns: 1fr 1fr 1fr auto;
                    gap: 12px;
                    align-items: center;
                ">
                    <select id="languageFilter" style="
                        padding: 10px 12px;
                        border: 2px solid var(--border);
                        border-radius: 8px;
                        background: var(--bg-primary);
                        color: var(--text-primary);
                        font-size: 0.9rem;
                        cursor: pointer;
                        transition: border-color 0.3s ease;
                    ">
                        <option value="all">Todas as linguagens</option>
                    </select>
                    
                    <select id="typeFilter" style="
                        padding: 10px 12px;
                        border: 2px solid var(--border);
                        border-radius: 8px;
                        background: var(--bg-primary);
                        color: var(--text-primary);
                        font-size: 0.9rem;
                        cursor: pointer;
                        transition: border-color 0.3s ease;
                    ">
                        <option value="all">Todos os tipos</option>
                        <option value="own">Meus Repositórios</option>
                        <option value="contrib">Contribuições</option>
                    </select>
                    
                    <select id="sortFilter" style="
                        padding: 10px 12px;
                        border: 2px solid var(--border);
                        border-radius: 8px;
                        background: var(--bg-primary);
                        color: var(--text-primary);
                        font-size: 0.9rem;
                        cursor: pointer;
                        transition: border-color 0.3s ease;
                    ">
                        <option value="updated">Mais Recentes</option>
                        <option value="stars">Mais Estrelas</option>
                        <option value="name">Nome A-Z</option>
                    </select>
                    
                    <button id="resetFilters" style="
                        background: var(--bg-secondary);
                        border: 2px solid var(--border);
                        color: var(--text-secondary);
                        padding: 10px 12px;
                        border-radius: 8px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                    ">
                        <i class="fas fa-undo"></i>
                    </button>
                </div>
            </div>
            
            <div id="activeFilters" style="display: none; margin-top: 15px; padding-top: 15px; border-top: 1px solid var(--border);"></div>
        </div>
    `;

    // Inserir após o header
    const repoHeader = container.querySelector('.repositories-header');
    if (repoHeader) {
        repoHeader.insertAdjacentHTML('afterend', searchHTML);
    } else {
        container.insertAdjacentHTML('afterbegin', searchHTML);
    }

    console.log('✅ Interface de busca criada com sucesso!');
    return true;
}

// Dados para busca
let searchData = [];

// Extrair dados do DOM
function extractSearchData() {
    console.log('📊 Extraindo dados para busca...');
    searchData = [];
    
    // Extrair repositórios
    document.querySelectorAll('.repo-card').forEach(card => {
        const data = extractCardData(card, 'repository');
        if (data) searchData.push(data);
    });
    
    // Extrair contribuições
    document.querySelectorAll('.contribution-card').forEach(card => {
        const data = extractCardData(card, 'contribution');
        if (data) searchData.push(data);
    });
    
    console.log(`📦 ${searchData.length} itens extraídos para busca`);
    populateLanguageFilter();
    updateResultsCount();
}

// Extrair dados de um card
function extractCardData(card, type) {
    const titleEl = card.querySelector('.repo-name, .contribution-title a, h3 a, a[href*="github.com"]');
    const descEl = card.querySelector('.repo-description, .contribution-description, p');
    const langEl = card.querySelector('.repo-language span:last-child, .language-dot + span');
    const starsEl = card.querySelector('.repo-stars span, .stat i.fa-star + span');

    if (!titleEl) return null;

    return {
        name: titleEl.textContent.trim(),
        description: descEl ? descEl.textContent.trim() : '',
        language: langEl ? langEl.textContent.trim() : '',
        stars: starsEl ? parseInt(starsEl.textContent) || 0 : 0,
        type: type,
        element: card
    };
}

// Popular filtro de linguagens
function populateLanguageFilter() {
    const languageFilter = document.getElementById('languageFilter');
    if (!languageFilter) return;

    const languages = [...new Set(searchData
        .map(item => item.language)
        .filter(lang => lang && lang !== 'N/A' && lang !== '')
    )].sort();

    // Limpar e recriar opções
    languageFilter.innerHTML = '<option value="all">Todas as linguagens</option>';
    
    languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang;
        option.textContent = lang;
        languageFilter.appendChild(option);
    });
    
    console.log(`🏷️ ${languages.length} linguagens adicionadas ao filtro`);
}

// Aplicar filtros
function applyFilters() {
    const searchTerm = document.getElementById('projectSearch')?.value.toLowerCase() || '';
    const languageFilter = document.getElementById('languageFilter')?.value || 'all';
    const typeFilter = document.getElementById('typeFilter')?.value || 'all';
    const sortFilter = document.getElementById('sortFilter')?.value || 'updated';
    
    let filtered = [...searchData];
    
    // Filtro de busca
    if (searchTerm) {
        filtered = filtered.filter(item => 
            item.name.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.language.toLowerCase().includes(searchTerm)
        );
    }
    
    // Filtro de linguagem
    if (languageFilter !== 'all') {
        filtered = filtered.filter(item => item.language === languageFilter);
    }
    
    // Filtro de tipo
    if (typeFilter !== 'all') {
        const typeMap = { 'own': 'repository', 'contrib': 'contribution' };
        filtered = filtered.filter(item => item.type === typeMap[typeFilter]);
    }
    
    // Ordenação
    if (sortFilter === 'stars') {
        filtered.sort((a, b) => b.stars - a.stars);
    } else if (sortFilter === 'name') {
        filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    // Aplicar visibilidade
    searchData.forEach(item => {
        if (item.element) {
            item.element.style.display = 'none';
        }
    });
    
    filtered.forEach(item => {
        if (item.element) {
            item.element.style.display = 'block';
        }
    });
    
    updateResultsCount(filtered.length);
    console.log(`🔍 Filtros aplicados: ${filtered.length} de ${searchData.length} itens`);
}

// Atualizar contador
function updateResultsCount(filteredCount = null) {
    const counter = document.getElementById('resultsCount');
    if (counter) {
        const count = filteredCount !== null ? filteredCount : searchData.length;
        counter.textContent = `${count} de ${searchData.length}`;
    }
}

// Configurar event listeners
function setupSearchListeners() {
    const searchInput = document.getElementById('projectSearch');
    const languageFilter = document.getElementById('languageFilter');
    const typeFilter = document.getElementById('typeFilter');
    const sortFilter = document.getElementById('sortFilter');
    const clearBtn = document.getElementById('clearSearch');
    const resetBtn = document.getElementById('resetFilters');

    if (searchInput) {
        let debounceTimer;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            
            // Mostrar/esconder botão limpar
            if (clearBtn) {
                clearBtn.style.display = e.target.value ? 'block' : 'none';
            }
            
            debounceTimer = setTimeout(() => {
                applyFilters();
            }, 300);
        });
    }

    if (languageFilter) {
        languageFilter.addEventListener('change', applyFilters);
    }

    if (typeFilter) {
        typeFilter.addEventListener('change', applyFilters);
    }

    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }

    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            searchInput.value = '';
            clearBtn.style.display = 'none';
            applyFilters();
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (searchInput) searchInput.value = '';
            if (languageFilter) languageFilter.value = 'all';
            if (typeFilter) typeFilter.value = 'all';
            if (sortFilter) sortFilter.value = 'updated';
            if (clearBtn) clearBtn.style.display = 'none';
            applyFilters();
        });
    }

    console.log('✅ Event listeners configurados!');
}

// Inicialização principal
function initializeSearch() {
    console.log('🚀 Inicializando sistema de busca...');
    
    // Criar interface
    if (createSearchInterface()) {
        // Configurar listeners
        setupSearchListeners();
        
        // Aguardar dados e extrair
        setTimeout(() => {
            extractSearchData();
        }, 1000);
        
        console.log('✅ Sistema de busca inicializado!');
    } else {
        console.error('❌ Falha ao criar interface de busca');
    }
}

// Função pública para atualizar dados
function refreshSearchData() {
    extractSearchData();
}

// Inicializar quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initializeSearch, 2000);
});

// Exportar funções globais
window.initializeSearch = initializeSearch;
window.refreshSearchData = refreshSearchData;