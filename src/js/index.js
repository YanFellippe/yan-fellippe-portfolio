console.log('JavaScript carregado!');

// Função de teste para verificar se o usuário existe
async function testGitHubUser(username) {
    try {
        console.log(`Testando usuário: ${username}`);
        const response = await fetch(`https://api.github.com/users/${username}`);
        console.log('Status da resposta:', response.status);

        if (response.ok) {
            const user = await response.json();
            console.log('Usuário encontrado:', {
                login: user.login,
                name: user.name,
                public_repos: user.public_repos,
                followers: user.followers,
            });
            return true;
        } else {
            console.error('Usuário não encontrado ou erro na API');
            return false;
        }
    } catch (error) {
        console.error('Erro ao testar usuário:', error);
        return false;
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    console.log('=== INICIALIZANDO PORTFOLIO ===');
    console.log('DOM carregado, inicializando funcionalidades...');

    initSmoothScroll();
    console.log('✓ Scroll suave inicializado');

    // Aguardar um pouco para garantir que todos os elementos estejam prontos
    setTimeout(async () => {
        try {
            const username = 'YanFellippe';
            console.log(`🚀 Iniciando carregamento para: ${username}`);

            // Carregar repositórios diretamente
            await loadRepositoriesWithUsername(username);
        } catch (error) {
            console.error('❌ Erro na inicialização:', error);
            const loading = document.getElementById('loading');
            if (loading) {
                loading.innerHTML = `
                    <div style="text-align: center; padding: 2rem;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem; color: #f59e0b;"></i>
                        <h3 style="margin-bottom: 1rem;">Erro de Inicialização</h3>
                        <p>Erro: ${error.message}</p>
                        <button onclick="location.reload()" 
                                style="padding: 0.5rem 1rem; background: var(--accent); color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 1rem;">
                            Recarregar Página
                        </button>
                    </div>
                `;
            }
        }
    }, 500);
});

// As funções de tema foram movidas para src/js/theme.js

// Scroll suave para âncoras
function initSmoothScroll() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // Só aplicar scroll suave para âncoras internas (que começam com #)
            if (targetId.startsWith('#')) {
                e.preventDefault();

                const targetSection = document.querySelector(targetId);

                if (targetSection) {
                    targetSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                    });
                }
            }
            // Para links externos (.html), deixar o comportamento padrão
        });
    });
}

// Carregar repositórios do GitHub
async function loadRepositories() {
    const username = 'YanFellippe'; // Username correto do GitHub
    return await loadRepositoriesWithUsername(username);
}

// Carregar repositórios com username específico
async function loadRepositoriesWithUsername(username) {
    console.log('🔄 Iniciando carregamento de repositórios para:', username);

    const repositoriesGrid = document.getElementById('repositoriesGrid');
    const loading = document.getElementById('loading');

    if (!repositoriesGrid || !loading) {
        console.error('❌ Elementos não encontrados');
        return;
    }

    try {
        // Mostrar loading
        loading.style.display = 'block';
        loading.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            <p>Carregando repositórios de ${username}...</p>
        `;

        console.log('📡 Fazendo requisição para GitHub API...');

        const url = `https://api.github.com/users/${username}/repos?sort=updated&per_page=20`;
        console.log('🌐 URL:', url);

        const response = await fetch(url);
        console.log('📊 Status da resposta:', response.status);

        // Verificar rate limit
        const rateLimitRemaining = response.headers.get('X-RateLimit-Remaining');
        const rateLimitReset = response.headers.get('X-RateLimit-Reset');

        console.log('Rate limit restante:', rateLimitRemaining);

        if (response.status === 403) {
            // Rate limit excedido
            const resetTime = rateLimitReset ? new Date(parseInt(rateLimitReset) * 1000) : null;
            const resetTimeStr = resetTime ? resetTime.toLocaleTimeString() : 'desconhecido';

            loading.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <i class="fas fa-clock" style="font-size: 2rem; margin-bottom: 1rem; color: #f59e0b;"></i>
                    <h3>Rate Limit Excedido</h3>
                    <p>Você fez muitas requisições para a API do GitHub.</p>
                    <p>O limite será resetado às: <strong>${resetTimeStr}</strong></p>
                    <p>Por enquanto, aqui estão alguns repositórios de exemplo:</p>
                    <button onclick="showSampleRepos()" 
                            style="padding: 0.5rem 1rem; background: var(--accent); color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 1rem;">
                        Mostrar Repositórios de Exemplo
                    </button>
                    <br><br>
                    <button onclick="loadRepositoriesWithUsername('${username}')" 
                            style="padding: 0.5rem 1rem; background: #6b7280; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Tentar Novamente
                    </button>
                </div>
            `;
            return;
        }

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status} - ${response.statusText}`);
        }

        const allRepos = await response.json();
        console.log('📦 Total de repositórios recebidos:', allRepos.length);

        // Filtrar repositórios
        const repositories = allRepos.filter(repo => {
            return repo.owner.login === username && !repo.private && !repo.fork;
        });

        console.log('✅ Repositórios filtrados:', repositories.length);

        // Esconder loading
        loading.style.display = 'none';

        if (repositories.length === 0) {
            repositoriesGrid.innerHTML = `
                <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <i class="fas fa-info-circle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                    <h3>Nenhum repositório encontrado</h3>
                    <p>Não foram encontrados repositórios públicos próprios para "${username}".</p>
                    <button onclick="showSampleRepos()" 
                            style="padding: 0.5rem 1rem; background: var(--accent); color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 1rem;">
                        Ver Repositórios de Exemplo
                    </button>
                </div>
            `;
            return;
        }

        // Renderizar repositórios
        updateStatistics(repositories);
        renderRepositories(repositories, repositoriesGrid);
        updateRepositoryCounter(repositories.length);

        // Carregar linguagens detalhadas para cada repositório
        loadRepositoryLanguages(username, repositories);

        // Carregar gráfico de linguagens (sem fazer mais requisições)
        try {
            const languageStats = calculateLanguageStatsFromRepos(repositories);
            renderLanguagesChart(languageStats);
            renderLanguageTags(languageStats);
        } catch (chartError) {
            console.warn('⚠️ Erro ao carregar gráfico:', chartError);
        }

        // Carregar contribuições em paralelo
        try {
            console.log('🔍 Carregando contribuições...');
            await loadUserContributions(username);
        } catch (contributionsError) {
            console.warn('⚠️ Erro ao carregar contribuições:', contributionsError);
        }

        // Aguardar um pouco e depois atualizar o sistema de busca
        setTimeout(() => {
            if (window.searchFilters) {
                console.log('🔍 Atualizando sistema de busca...');
                window.searchFilters.refresh();
            } else {
                console.log('🔍 Inicializando sistema de busca...');
                // Tentar inicializar o sistema de busca se não existir
                try {
                    window.searchFilters = new SearchAndFilters();
                } catch (error) {
                    console.warn('Erro ao inicializar busca:', error);
                }
            }
        }, 2000);

        console.log('✅ Carregamento concluído!');

        // Mostrar sistema de busca
        const searchContainer = document.getElementById('searchContainer');
        if (searchContainer) {
            searchContainer.style.display = 'block';
            setTimeout(() => {
                searchContainer.classList.add('show');
            }, 500);
        }
    } catch (error) {
        console.error('❌ Erro ao carregar repositórios:', error);

        loading.innerHTML = `
            <div style="text-align: center; padding: 2rem;">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem; color: #f59e0b;"></i>
                <h3>Erro ao carregar repositórios</h3>
                <p>Erro: ${error.message}</p>
                <button onclick="showSampleRepos()" 
                        style="padding: 0.5rem 1rem; background: var(--accent); color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 1rem;">
                    Ver Repositórios de Exemplo
                </button>
                <br><br>
                <button onclick="loadRepositoriesWithUsername('${username}')" 
                        style="padding: 0.5rem 1rem; background: #6b7280; color: white; border: none; border-radius: 4px; cursor: pointer;">
                    Tentar Novamente
                </button>
            </div>
        `;
    }
}

// Renderizar cards dos repositórios
function renderRepositories(repositories, container) {
    if (!repositories || repositories.length === 0) {
        container.innerHTML = '<p>Nenhum repositório encontrado.</p>';
        return;
    }

    const repositoryCards = repositories.map(repo => createRepositoryCard(repo)).join('');
    container.innerHTML = repositoryCards;
}

// Formatar data para exibição
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
        return 'ontem';
    } else if (diffDays < 7) {
        return `há ${diffDays} dias`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `há ${weeks} semana${weeks > 1 ? 's' : ''}`;
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30);
        return `há ${months} mês${months > 1 ? 'es' : ''}`;
    } else {
        const years = Math.floor(diffDays / 365);
        return `há ${years} ano${years > 1 ? 's' : ''}`;
    }
}

// Cores das linguagens de programação
function getLanguageColor(language) {
    const colors = {
        JavaScript: '#f1e05a',
        TypeScript: '#2b7489',
        Python: '#3572A5',
        Java: '#b07219',
        'C++': '#f34b7d',
        'C#': '#239120',
        PHP: '#4F5D95',
        Ruby: '#701516',
        Go: '#00ADD8',
        Rust: '#dea584',
        Swift: '#ffac45',
        Kotlin: '#F18E33',
        HTML: '#e34c26',
        CSS: '#1572B6',
        Vue: '#4FC08D',
        React: '#61DAFB',
        Angular: '#DD0031',
        'Node.js': '#68a063',
        Dart: '#0175C2',
        Flutter: '#02569B',
        C: '#555555',
        Shell: '#89e051',
        Dockerfile: '#384d54',
        SCSS: '#c6538c',
        Less: '#1d365d',
        Sass: '#a53b70',
        JSON: '#292929',
        XML: '#0060ac',
        Markdown: '#083fa1',
        YAML: '#cb171e',
        'Jupyter Notebook': '#DA5B0B',
        R: '#198CE7',
        Scala: '#c22d40',
        Perl: '#0298c3',
        Lua: '#000080',
        'Objective-C': '#438eff',
        Assembly: '#6E4C13',
        PowerShell: '#012456',
    };

    return colors[language] || '#586069';
}
// Atualizar estatísticas gerais
function updateStatistics(repositories) {
    if (!repositories || repositories.length === 0) {
        console.warn('Nenhum repositório para calcular estatísticas');
        return;
    }

    const totalRepos = repositories.length;
    const totalStars = repositories.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    const languages = new Set(repositories.map(repo => repo.language).filter(lang => lang));
    const totalLanguages = languages.size;

    // Encontrar a data de atualização mais recente
    const lastUpdate = repositories.reduce((latest, repo) => {
        const repoDate = new Date(repo.updated_at);
        return repoDate > latest ? repoDate : latest;
    }, new Date(0));

    // Atualizar elementos do DOM com verificação de existência
    const totalReposEl = document.getElementById('totalRepos');
    const totalStarsEl = document.getElementById('totalStars');
    const totalLanguagesEl = document.getElementById('totalLanguages');
    const lastUpdateEl = document.getElementById('lastUpdate');

    if (totalReposEl) totalReposEl.textContent = totalRepos;
    if (totalStarsEl) totalStarsEl.textContent = totalStars;
    if (totalLanguagesEl) totalLanguagesEl.textContent = totalLanguages;
    if (lastUpdateEl) lastUpdateEl.textContent = formatDate(lastUpdate.toISOString());
}

// Atualizar contador de repositórios
function updateRepositoryCounter(count) {
    const counter = document.getElementById('repoCounter');
    if (counter) {
        counter.textContent = `Total de ${count} repositório${count !== 1 ? 's' : ''}`;
    }
}

// Carregar e renderizar gráfico de linguagens (versão simplificada)
function loadLanguagesChart(repositories) {
    try {
        const languageStats = calculateLanguageStatsFromRepos(repositories);
        renderLanguagesChart(languageStats);
        renderLanguageTags(languageStats);
    } catch (error) {
        console.error('Erro ao carregar estatísticas de linguagens:', error);
    }
}

// Renderizar gráfico de linguagens com Chart.js
function renderLanguagesChart(languageStats) {
    const ctx = document.getElementById('languagesChart').getContext('2d');

    const data = {
        labels: languageStats.map(stat => stat.language),
        datasets: [
            {
                data: languageStats.map(stat => parseFloat(stat.percentage)),
                backgroundColor: languageStats.map(stat => getLanguageColor(stat.language)),
                borderWidth: 2,
                borderColor: getComputedStyle(document.documentElement).getPropertyValue(
                    '--card-bg'
                ),
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.label}: ${context.parsed}%`;
                    },
                },
            },
        },
    };

    new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options,
    });
}

// Renderizar tags das linguagens
function renderLanguageTags(languageStats) {
    const container = document.getElementById('languagesTags');

    const tags = languageStats
        .map(
            stat => `
        <div class="language-tag">
            <span class="language-dot" style="background-color: ${getLanguageColor(
                stat.language
            )}"></span>
            <span class="language-name">${stat.language}</span>
            <span class="percentage">${stat.percentage}%</span>
        </div>
    `
        )
        .join('');

    container.innerHTML = tags;
}

// Criar card individual do repositório com tags de linguagem
// Buscar linguagens detalhadas de um repositório
async function fetchRepositoryLanguages(username, repoName) {
    try {
        const response = await fetch(
            `https://api.github.com/repos/${username}/${repoName}/languages`
        );
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.warn(`Erro ao buscar linguagens do repositório ${repoName}:`, error);
    }
    return null;
}

// Processar linguagens e calcular percentuais
function processLanguages(languagesData) {
    if (!languagesData) return [];

    const total = Object.values(languagesData).reduce((sum, bytes) => sum + bytes, 0);

    return Object.entries(languagesData)
        .map(([language, bytes]) => ({
            name: language,
            bytes: bytes,
            percentage: ((bytes / total) * 100).toFixed(1),
        }))
        .sort((a, b) => b.bytes - a.bytes)
        .slice(0, 5); // Mostrar no máximo 5 linguagens
}

// Criar badges de linguagens múltiplas
function createLanguageBadges(languages) {
    if (!languages || languages.length === 0) {
        return '<div class="repo-language-badge no-language">Sem linguagens detectadas</div>';
    }

    const badges = languages
        .map((lang, index) => {
            const color = getLanguageColor(lang.name);
            return `
            <div class="repo-language-badge" 
                 style="background-color: ${color}20; color: ${color}; border: 1px solid ${color}40; animation-delay: ${
                index * 0.1
            }s;"
                 title="${lang.name}: ${lang.percentage}%">
                <span class="language-dot" style="background-color: ${color}"></span>
                <span class="language-name">${lang.name}</span>
                <span class="language-percentage">${lang.percentage}%</span>
            </div>
        `;
        })
        .join('');

    return badges;
}

function createRepositoryCard(repo) {
    const description = repo.description || 'Sem descrição disponível';
    const language = repo.language || 'N/A';
    const stars = repo.stargazers_count || 0;
    const updatedAt = formatDate(repo.updated_at);
    const languageColor = getLanguageColor(language);

    // Placeholder para linguagens (será preenchido depois)
    const languagesPlaceholder = `
        <div class="repo-languages-loading" data-repo="${repo.name}">
            <i class="fas fa-spinner fa-spin"></i>
            <span>Carregando linguagens...</span>
        </div>
    `;

    return `
        <div class="repo-card" data-repo-name="${repo.name}">
            <div class="repo-header">
                <a href="${repo.html_url}" target="_blank" class="repo-name">
                    ${repo.name}
                </a>
                <div class="repo-stars">
                    <i class="fas fa-star"></i>
                    <span>${stars}</span>
                </div>
            </div>
            <p class="repo-description">${description}</p>
            <div class="repo-tags" id="languages-${repo.name}">
                ${languagesPlaceholder}
            </div>
            <div class="repo-footer">
                <div class="repo-language">
                    <span class="language-dot" style="background-color: ${languageColor}"></span>
                    <span>${language}</span>
                </div>
                <span class="repo-updated">Atualizado ${updatedAt}</span>
            </div>
        </div>
    `;
}

// Função simplificada - não há mais abas, apenas repositórios próprios
function initRepositoryTabs() {
    console.log('Sistema de abas removido - mostrando apenas repositórios próprios');
}

// Funções de contribuições removidas - agora mostra apenas repositórios próprios
// Função para testar username customizado
async function testCustomUsername() {
    const input = document.getElementById('usernameInput');
    const username = input.value.trim();

    if (!username) {
        alert('Por favor, digite um username');
        return;
    }

    console.log(`Testando username customizado: ${username}`);

    const loading = document.getElementById('loading');
    if (loading) {
        loading.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            <p>Testando username "${username}"...</p>
        `;
    }

    const exists = await testGitHubUser(username);

    if (exists) {
        console.log(`Username ${username} é válido! Carregando repositórios...`);
        loadRepositoriesWithUsername(username);
    } else {
        if (loading) {
            loading.innerHTML = `
                <div style="text-align: center; padding: 2rem;">
                    <i class="fas fa-times-circle" style="font-size: 2rem; margin-bottom: 1rem; color: #ef4444;"></i>
                    <p>Username "${username}" não encontrado no GitHub.</p>
                    <p>Tente novamente com um username diferente.</p>
                    <div style="margin: 1.5rem 0;">
                        <input type="text" id="usernameInput" placeholder="Digite seu username do GitHub" 
                               style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 4px; margin-right: 0.5rem;">
                        <button onclick="testCustomUsername()" 
                                style="padding: 0.5rem 1rem; background: var(--accent); color: white; border: none; border-radius: 4px; cursor: pointer;">
                            Testar
                        </button>
                    </div>
                </div>
            `;
        }
    }
}

// Função para mostrar repositórios de exemplo quando API não está disponível
function showSampleRepos() {
    console.log('📋 Mostrando repositórios de exemplo...');

    const repositoriesGrid = document.getElementById('repositoriesGrid');
    const loading = document.getElementById('loading');

    if (loading) loading.style.display = 'none';

    // Repositórios de exemplo com múltiplas linguagens
    const sampleRepos = [
        {
            name: 'portfolio-website',
            description: 'Meu portfolio pessoal desenvolvido com HTML, CSS e JavaScript',
            language: 'JavaScript',
            stargazers_count: 5,
            html_url: 'https://github.com/YanFellippe/portfolio-website',
            updated_at: new Date().toISOString(),
        },
        {
            name: 'react-todo-app',
            description: 'Aplicativo de tarefas desenvolvido com React e TypeScript',
            language: 'TypeScript',
            stargazers_count: 12,
            html_url: 'https://github.com/YanFellippe/react-todo-app',
            updated_at: new Date(Date.now() - 86400000).toISOString(),
        },
        {
            name: 'python-data-analysis',
            description: 'Scripts para análise de dados usando Python e Pandas',
            language: 'Python',
            stargazers_count: 8,
            html_url: 'https://github.com/YanFellippe/python-data-analysis',
            updated_at: new Date(Date.now() - 172800000).toISOString(),
        },
        {
            name: 'node-api-rest',
            description: 'API REST desenvolvida com Node.js e Express',
            language: 'JavaScript',
            stargazers_count: 15,
            html_url: 'https://github.com/YanFellippe/node-api-rest',
            updated_at: new Date(Date.now() - 259200000).toISOString(),
        },
    ];

    // Linguagens de exemplo para cada repositório
    const sampleLanguages = {
        'portfolio-website': [
            { name: 'JavaScript', percentage: '45.2' },
            { name: 'HTML', percentage: '32.1' },
            { name: 'CSS', percentage: '22.7' },
        ],
        'react-todo-app': [
            { name: 'TypeScript', percentage: '68.4' },
            { name: 'JavaScript', percentage: '18.3' },
            { name: 'CSS', percentage: '10.1' },
            { name: 'HTML', percentage: '3.2' },
        ],
        'python-data-analysis': [
            { name: 'Python', percentage: '89.7' },
            { name: 'Jupyter Notebook', percentage: '10.3' },
        ],
        'node-api-rest': [
            { name: 'JavaScript', percentage: '78.9' },
            { name: 'JSON', percentage: '12.4' },
            { name: 'Dockerfile', percentage: '5.2' },
            { name: 'Shell', percentage: '3.5' },
        ],
    };

    // Atualizar estatísticas com dados de exemplo
    updateStatistics(sampleRepos);

    // Renderizar repositórios de exemplo
    renderRepositories(sampleRepos, repositoriesGrid);

    // Simular carregamento de linguagens para repositórios de exemplo
    setTimeout(() => {
        sampleRepos.forEach(repo => {
            const languagesContainer = document.getElementById(`languages-${repo.name}`);
            if (languagesContainer && sampleLanguages[repo.name]) {
                languagesContainer.innerHTML = createLanguageBadges(sampleLanguages[repo.name]);
            }
        });
    }, 1000);

    // Atualizar contador
    updateRepositoryCounter(sampleRepos.length);

    // Mostrar gráfico de linguagens
    const languageStats = calculateLanguageStatsFromRepos(sampleRepos);
    renderLanguagesChart(languageStats);
    renderLanguageTags(languageStats);

    // Adicionar aviso
    const warning = document.createElement('div');
    warning.style.cssText =
        'text-align: center; padding: 1rem; background: #fef3c7; border: 1px solid #f59e0b; border-radius: 8px; margin-bottom: 1rem; color: #92400e;';
    warning.innerHTML = `
        <i class="fas fa-info-circle"></i>
        <strong>Repositórios de Exemplo</strong> - A API do GitHub está temporariamente indisponível devido ao rate limit.
    `;
    repositoriesGrid.insertBefore(warning, repositoriesGrid.firstChild);
}

// Função para calcular estatísticas de linguagens sem fazer requisições adicionais
function calculateLanguageStatsFromRepos(repositories) {
    const languageCount = {};

    repositories.forEach(repo => {
        if (repo.language) {
            languageCount[repo.language] = (languageCount[repo.language] || 0) + 1;
        }
    });

    const total = Object.values(languageCount).reduce((sum, count) => sum + count, 0);

    return Object.entries(languageCount)
        .map(([language, count]) => ({
            language,
            bytes: count * 1000, // Valor fictício
            percentage: ((count / total) * 100).toFixed(1),
        }))
        .sort((a, b) => b.bytes - a.bytes);
}

// Tornar as funções globais
window.testCustomUsername = testCustomUsername;
window.showSampleRepos = showSampleRepos;

// Carregar linguagens para todos os repositórios
async function loadRepositoryLanguages(username, repositories) {
    console.log('🔍 Carregando linguagens detalhadas dos repositórios...');

    const languagePromises = repositories.map(async repo => {
        try {
            const languages = await fetchRepositoryLanguages(username, repo.name);
            const processedLanguages = processLanguages(languages);

            // Atualizar o card com as linguagens
            const languagesContainer = document.getElementById(`languages-${repo.name}`);
            if (languagesContainer) {
                languagesContainer.innerHTML = createLanguageBadges(processedLanguages);
            }

            return { repo: repo.name, languages: processedLanguages };
        } catch (error) {
            console.warn(`Erro ao carregar linguagens do ${repo.name}:`, error);

            // Mostrar linguagem principal como fallback
            const languagesContainer = document.getElementById(`languages-${repo.name}`);
            if (languagesContainer) {
                const fallbackLanguage = repo.language
                    ? [
                          {
                              name: repo.language,
                              percentage: '100.0',
                          },
                      ]
                    : [];
                languagesContainer.innerHTML = createLanguageBadges(fallbackLanguage);
            }

            return { repo: repo.name, languages: [] };
        }
    });

    // Processar em lotes para evitar rate limit
    const batchSize = 3;
    const results = [];

    for (let i = 0; i < languagePromises.length; i += batchSize) {
        const batch = languagePromises.slice(i, i + batchSize);
        const batchResults = await Promise.all(batch);
        results.push(...batchResults);

        // Pequena pausa entre lotes
        if (i + batchSize < languagePromises.length) {
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }

    console.log('✅ Linguagens carregadas para todos os repositórios!');
    return results;
}
