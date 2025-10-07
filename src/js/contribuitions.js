// Função abrangente para buscar TODAS as contribuições históricas do usuário
async function fetchAllUserContributions(username, options = {}) {
    const { per_page = 50 } = options;
    
    console.log('🔍 Iniciando busca abrangente de contribuições para:', username);
    
    try {
        // Estratégia 1: Buscar todos os Pull Requests do usuário
        const allPRs = await fetchAllUserPullRequests(username);
        console.log('📋 Pull Requests encontrados:', allPRs.length);
        
        // Estratégia 2: Buscar Issues criadas pelo usuário
        const allIssues = await fetchAllUserIssues(username);
        console.log('🐛 Issues encontradas:', allIssues.length);
        
        // Estratégia 3: Buscar eventos recentes (últimos 90 dias)
        const recentEvents = await fetchRecentContributions(username);
        console.log('⏰ Eventos recentes:', recentEvents.length);
        
        // Combinar todas as fontes e extrair repositórios únicos
        const allContributions = new Map();
        
        // Processar Pull Requests
        allPRs.forEach(pr => {
            const repoFullName = pr.repository_url.split('/').slice(-2).join('/');
            const repoOwner = repoFullName.split('/')[0];
            
            // Só incluir se não for repositório próprio
            if (repoOwner !== username) {
                if (!allContributions.has(repoFullName)) {
                    allContributions.set(repoFullName, {
                        fullName: repoFullName,
                        url: pr.repository_url,
                        contributions: [],
                        lastActivity: pr.updated_at
                    });
                }
                
                allContributions.get(repoFullName).contributions.push({
                    type: 'PullRequest',
                    title: pr.title,
                    state: pr.state,
                    date: pr.created_at,
                    url: pr.html_url,
                    number: pr.number
                });
            }
        });
        
        // Processar Issues
        allIssues.forEach(issue => {
            const repoFullName = issue.repository_url.split('/').slice(-2).join('/');
            const repoOwner = repoFullName.split('/')[0];
            
            if (repoOwner !== username) {
                if (!allContributions.has(repoFullName)) {
                    allContributions.set(repoFullName, {
                        fullName: repoFullName,
                        url: issue.repository_url,
                        contributions: [],
                        lastActivity: issue.updated_at
                    });
                }
                
                allContributions.get(repoFullName).contributions.push({
                    type: 'Issue',
                    title: issue.title,
                    state: issue.state,
                    date: issue.created_at,
                    url: issue.html_url,
                    number: issue.number
                });
            }
        });
        
        // Processar eventos recentes
        recentEvents.forEach(event => {
            const repoFullName = event.repo.name;
            const repoOwner = repoFullName.split('/')[0];
            
            if (repoOwner !== username) {
                if (!allContributions.has(repoFullName)) {
                    allContributions.set(repoFullName, {
                        fullName: repoFullName,
                        url: event.repo.url,
                        contributions: [],
                        lastActivity: event.created_at
                    });
                }
                
                allContributions.get(repoFullName).contributions.push({
                    type: event.type.replace('Event', ''),
                    date: event.created_at,
                    details: event.payload
                });
            }
        });
        
        console.log('📊 Total de repositórios únicos encontrados:', allContributions.size);
        
        // Buscar detalhes completos dos repositórios
        const contributionsList = Array.from(allContributions.values())
            .sort((a, b) => new Date(b.lastActivity) - new Date(a.lastActivity))
            .slice(0, per_page);
        
        const detailedContributions = await Promise.all(
            contributionsList.map(async (contrib) => {
                try {
                    const repoResponse = await fetch(contrib.url);
                    if (repoResponse.ok) {
                        const repoData = await repoResponse.json();
                        return {
                            ...repoData,
                            contributionSummary: {
                                totalContributions: contrib.contributions.length,
                                contributions: contrib.contributions,
                                lastActivity: contrib.lastActivity,
                                types: [...new Set(contrib.contributions.map(c => c.type))]
                            }
                        };
                    }
                } catch (error) {
                    console.warn(`Erro ao buscar detalhes do repositório ${contrib.fullName}:`, error);
                }
                return null;
            })
        );
        
        const validContributions = detailedContributions.filter(repo => repo !== null);
        console.log('✅ Contribuições válidas processadas:', validContributions.length);
        
        return validContributions;
        
    } catch (error) {
        console.error('❌ Erro ao buscar contribuições abrangentes:', error);
        throw error;
    }
}

// Função para buscar TODOS os Pull Requests do usuário (histórico completo)
async function fetchAllUserPullRequests(username, options = {}) {
    const { state = 'all', per_page = 100 } = options;
    
    try {
        let allPRs = [];
        let page = 1;
        let hasMore = true;
        
        while (hasMore && page <= 10) { // Limitar a 10 páginas para evitar rate limit
            const searchUrl = `https://api.github.com/search/issues?q=author:${username}+type:pr+state:${state}&per_page=${per_page}&page=${page}&sort=updated`;
            
            console.log(`📄 Buscando PRs - Página ${page}...`);
            
            const response = await fetch(searchUrl);
            
            if (!response.ok) {
                if (response.status === 403) {
                    console.warn('⚠️ Rate limit atingido na busca de PRs');
                    break;
                }
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                allPRs = allPRs.concat(data.items);
                page++;
                
                // Se retornou menos que per_page, não há mais páginas
                if (data.items.length < per_page) {
                    hasMore = false;
                }
                
                // Pequena pausa para evitar rate limit
                await new Promise(resolve => setTimeout(resolve, 100));
            } else {
                hasMore = false;
            }
        }
        
        console.log(`📋 Total de PRs coletados: ${allPRs.length}`);
        return allPRs;
        
    } catch (error) {
        console.error('❌ Erro ao buscar Pull Requests:', error);
        return [];
    }
}

// Função para buscar TODAS as Issues criadas pelo usuário
async function fetchAllUserIssues(username, options = {}) {
    const { state = 'all', per_page = 100 } = options;
    
    try {
        let allIssues = [];
        let page = 1;
        let hasMore = true;
        
        while (hasMore && page <= 5) { // Limitar a 5 páginas para Issues
            const searchUrl = `https://api.github.com/search/issues?q=author:${username}+type:issue+state:${state}&per_page=${per_page}&page=${page}&sort=updated`;
            
            console.log(`📄 Buscando Issues - Página ${page}...`);
            
            const response = await fetch(searchUrl);
            
            if (!response.ok) {
                if (response.status === 403) {
                    console.warn('⚠️ Rate limit atingido na busca de Issues');
                    break;
                }
                throw new Error(`Erro HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.items && data.items.length > 0) {
                allIssues = allIssues.concat(data.items);
                page++;
                
                if (data.items.length < per_page) {
                    hasMore = false;
                }
                
                await new Promise(resolve => setTimeout(resolve, 100));
            } else {
                hasMore = false;
            }
        }
        
        console.log(`🐛 Total de Issues coletadas: ${allIssues.length}`);
        return allIssues;
        
    } catch (error) {
        console.error('❌ Erro ao buscar Issues:', error);
        return [];
    }
}

// Função para buscar eventos recentes (últimos 90 dias)
async function fetchRecentContributions(username) {
    try {
        const eventsUrl = `https://api.github.com/users/${username}/events/public?per_page=100`;
        const response = await fetch(eventsUrl);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const events = await response.json();
        
        // Filtrar apenas eventos de contribuição em repositórios de outros usuários
        const contributionEvents = events.filter(event => {
            const isContribution = [
                'PushEvent',
                'PullRequestEvent', 
                'IssuesEvent',
                'CreateEvent',
                'ForkEvent',
                'WatchEvent'
            ].includes(event.type);
            
            const isNotOwner = event.repo && !event.repo.name.startsWith(`${username}/`);
            return isContribution && isNotOwner;
        });
        
        console.log(`⏰ Eventos recentes de contribuição: ${contributionEvents.length}`);
        return contributionEvents;
        
    } catch (error) {
        console.error('❌ Erro ao buscar eventos recentes:', error);
        return [];
    }
}

// Função para renderizar contribuições com informações detalhadas
function renderDetailedContributions(contributions, containerId) {
    const container = document.getElementById(containerId);
    
    if (!container) {
        console.error(`Container ${containerId} não encontrado`);
        return;
    }
    
    if (!contributions || contributions.length === 0) {
        container.innerHTML = `
            <div class="no-contributions">
                <i class="fas fa-code-branch"></i>
                <p>Nenhuma contribuição encontrada</p>
                <small>Isso pode acontecer devido a limitações da API do GitHub ou se você ainda não contribuiu em repositórios públicos de outros usuários.</small>
            </div>
        `;
        return;
    }
    
    const contributionsHTML = contributions.map(repo => {
        const summary = repo.contributionSummary;
        const contributionTypes = summary.types.join(', ');
        const lastActivity = new Date(summary.lastActivity).toLocaleDateString('pt-BR');
        
        // Agrupar contribuições por tipo
        const prCount = summary.contributions.filter(c => c.type === 'PullRequest').length;
        const issueCount = summary.contributions.filter(c => c.type === 'Issue').length;
        const otherCount = summary.totalContributions - prCount - issueCount;
        
        return `
            <div class="contribution-card detailed">
                <div class="contribution-header">
                    <div class="contribution-info">
                        <h3 class="contribution-title">
                            <a href="${repo.html_url}" target="_blank">
                                ${repo.name}
                            </a>
                        </h3>
                        <p class="contribution-owner">por ${repo.owner.login}</p>
                        <div class="contribution-summary">
                            <span class="total-contributions">${summary.totalContributions} contribuições</span>
                        </div>
                    </div>
                    <div class="contribution-badges">
                        ${prCount > 0 ? `<span class="badge pr-badge">${prCount} PR${prCount > 1 ? 's' : ''}</span>` : ''}
                        ${issueCount > 0 ? `<span class="badge issue-badge">${issueCount} Issue${issueCount > 1 ? 's' : ''}</span>` : ''}
                        ${otherCount > 0 ? `<span class="badge other-badge">${otherCount} Outras</span>` : ''}
                    </div>
                </div>
                
                <p class="contribution-description">
                    ${repo.description || 'Sem descrição disponível'}
                </p>
                
                <div class="contribution-stats">
                    <div class="stat">
                        <i class="fas fa-star"></i>
                        <span>${repo.stargazers_count}</span>
                    </div>
                    <div class="stat">
                        <i class="fas fa-code-branch"></i>
                        <span>${repo.forks_count}</span>
                    </div>
                    ${repo.language ? `
                        <div class="stat">
                            <span class="language-dot" style="background-color: ${getLanguageColor(repo.language)}"></span>
                            <span>${repo.language}</span>
                        </div>
                    ` : ''}
                </div>
                
                <div class="contribution-footer">
                    <span class="contribution-date">
                        Última atividade: ${lastActivity}
                    </span>
                    <span class="contribution-types">
                        Tipos: ${contributionTypes}
                    </span>
                </div>
                
                <div class="contribution-details">
                    <button class="toggle-details" onclick="toggleContributionDetails('${repo.id}')">
                        <i class="fas fa-chevron-down"></i>
                        Ver detalhes
                    </button>
                    <div class="details-content" id="details-${repo.id}" style="display: none;">
                        ${renderContributionList(summary.contributions)}
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = contributionsHTML;
}

// Função para renderizar lista detalhada de contribuições
function renderContributionList(contributions) {
    if (!contributions || contributions.length === 0) {
        return '<p>Nenhum detalhe disponível</p>';
    }
    
    const sortedContributions = contributions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10); // Mostrar apenas as 10 mais recentes
    
    return `
        <div class="contributions-list">
            ${sortedContributions.map(contrib => `
                <div class="contribution-item">
                    <div class="contribution-item-header">
                        <span class="contribution-type-badge ${contrib.type.toLowerCase()}">${contrib.type}</span>
                        <span class="contribution-date">${new Date(contrib.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    ${contrib.title ? `<p class="contribution-title">${contrib.title}</p>` : ''}
                    ${contrib.url ? `<a href="${contrib.url}" target="_blank" class="contribution-link">Ver no GitHub</a>` : ''}
                </div>
            `).join('')}
            ${contributions.length > 10 ? `<p class="more-contributions">... e mais ${contributions.length - 10} contribuições</p>` : ''}
        </div>
    `;
}

// Função para alternar detalhes das contribuições
function toggleContributionDetails(repoId) {
    const detailsElement = document.getElementById(`details-${repoId}`);
    const button = detailsElement.previousElementSibling;
    const icon = button.querySelector('i');
    
    if (detailsElement.style.display === 'none') {
        detailsElement.style.display = 'block';
        icon.className = 'fas fa-chevron-up';
        button.innerHTML = '<i class="fas fa-chevron-up"></i> Ocultar detalhes';
    } else {
        detailsElement.style.display = 'none';
        icon.className = 'fas fa-chevron-down';
        button.innerHTML = '<i class="fas fa-chevron-down"></i> Ver detalhes';
    }
}

// Função auxiliar para obter cor da linguagem
function getLanguageColor(language) {
    const colors = {
        'JavaScript': '#f1e05a',
        'TypeScript': '#2b7489',
        'Python': '#3572A5',
        'Java': '#b07219',
        'C++': '#f34b7d',
        'C#': '#239120',
        'PHP': '#4F5D95',
        'Ruby': '#701516',
        'Go': '#00ADD8',
        'Rust': '#dea584',
        'Swift': '#ffac45',
        'Kotlin': '#F18E33',
        'HTML': '#e34c26',
        'CSS': '#1572B6',
        'Vue': '#4FC08D',
        'React': '#61DAFB'
    };
    
    return colors[language] || '#586069';
}

// Função principal atualizada para usar a busca abrangente
async function loadUserContributions(username, containerId = 'contributionsGrid') {
    const loadingElement = document.getElementById('contributionsLoading');
    const errorElement = document.getElementById('contributionsError');
    
    try {
        // Mostrar loading
        if (loadingElement) {
            loadingElement.style.display = 'block';
            loadingElement.innerHTML = `
                <i class="fas fa-spinner fa-spin"></i>
                <p>Buscando TODAS as suas contribuições históricas...</p>
                <small>Isso pode levar alguns segundos...</small>
            `;
        }
        
        // Esconder erro
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        
        console.log('🔍 Iniciando busca abrangente de contribuições para:', username);
        
        // Usar a nova função abrangente
        const allContributions = await fetchAllUserContributions(username, { per_page: 30 });
        
        console.log('📊 Total de contribuições processadas:', allContributions.length);
        
        // Renderizar contribuições detalhadas
        renderDetailedContributions(allContributions, containerId);
        
        // Atualizar contador
        const counterElement = document.getElementById('contributionsCounter');
        if (counterElement) {
            const totalContribs = allContributions.reduce((sum, repo) => 
                sum + (repo.contributionSummary?.totalContributions || 0), 0
            );
            counterElement.textContent = `${allContributions.length} repositórios • ${totalContribs} contribuições totais`;
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar contribuições:', error);
        
        // Mostrar erro
        if (errorElement) {
            errorElement.style.display = 'block';
            errorElement.textContent = `Erro ao carregar contribuições: ${error.message}`;
        }
        
        // Mostrar dados de exemplo em caso de erro
        renderDetailedContributions(getExampleDetailedContributions(), containerId);
        
    } finally {
        // Esconder loading
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }
    }
}

// Dados de exemplo mais detalhados
function getExampleDetailedContributions() {
    return [
        {
            id: 'example1',
            name: 'awesome-open-source',
            full_name: 'community/awesome-open-source',
            html_url: 'https://github.com/community/awesome-open-source',
            description: 'Uma coleção incrível de projetos open source',
            owner: { login: 'community' },
            stargazers_count: 2500,
            forks_count: 450,
            language: 'JavaScript',
            contributionSummary: {
                totalContributions: 8,
                contributions: [
                    { type: 'PullRequest', title: 'Add new awesome project', date: '2024-01-15', url: '#' },
                    { type: 'Issue', title: 'Bug in search functionality', date: '2024-01-10', url: '#' },
                    { type: 'PullRequest', title: 'Fix documentation typos', date: '2023-12-20', url: '#' }
                ],
                lastActivity: '2024-01-15',
                types: ['PullRequest', 'Issue']
            }
        },
        {
            id: 'example2',
            name: 'developer-tools',
            full_name: 'devtools/developer-tools',
            html_url: 'https://github.com/devtools/developer-tools',
            description: 'Ferramentas essenciais para desenvolvedores',
            owner: { login: 'devtools' },
            stargazers_count: 1200,
            forks_count: 180,
            language: 'Python',
            contributionSummary: {
                totalContributions: 5,
                contributions: [
                    { type: 'PullRequest', title: 'Improve CLI interface', date: '2023-11-30', url: '#' },
                    { type: 'Issue', title: 'Feature request: dark mode', date: '2023-11-25', url: '#' }
                ],
                lastActivity: '2023-11-30',
                types: ['PullRequest', 'Issue']
            }
        }
    ];
}

// Exportar funções para uso global
window.fetchAllUserContributions = fetchAllUserContributions;
window.loadUserContributions = loadUserContributions;
window.renderDetailedContributions = renderDetailedContributions;
window.toggleContributionDetails = toggleContributionDetails;