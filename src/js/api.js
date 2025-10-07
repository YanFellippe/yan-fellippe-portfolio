// API para buscar dados do GitHub

// Função principal para buscar repositórios do GitHub
async function fetchGitHubRepositories(username, options = {}) {
    const {
        sort = 'updated',
        per_page = 12,
        type = 'owner'
    } = options;
    
    const url = `https://api.github.com/users/${username}/repos?sort=${sort}&per_page=${per_page}&type=${type}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const repositories = await response.json();
        
        // Filtrar repositórios privados e forks (opcional)
        const filteredRepos = repositories.filter(repo => {
            return !repo.private && !repo.fork;
        });
        
        return filteredRepos;
        
    } catch (error) {
        console.error('Erro ao buscar repositórios:', error);
        throw error;
    }
}

// Função para buscar informações do usuário do GitHub
async function fetchGitHubUser(username) {
    const url = `https://api.github.com/users/${username}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const user = await response.json();
        return user;
        
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        throw error;
    }
}

// Função para buscar um repositório específico
async function fetchGitHubRepository(username, repoName) {
    const url = `https://api.github.com/repos/${username}/${repoName}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const repository = await response.json();
        return repository;
        
    } catch (error) {
        console.error('Erro ao buscar repositório:', error);
        throw error;
    }
}

// Função para buscar linguagens de um repositório
async function fetchRepositoryLanguages(username, repoName) {
    const url = `https://api.github.com/repos/${username}/${repoName}/languages`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const languages = await response.json();
        return languages;
        
    } catch (error) {
        console.error('Erro ao buscar linguagens:', error);
        throw error;
    }
}

// Função para buscar commits recentes de um repositório
async function fetchRepositoryCommits(username, repoName, options = {}) {
    const {
        per_page = 10,
        sha = 'main'
    } = options;
    
    const url = `https://api.github.com/repos/${username}/${repoName}/commits?per_page=${per_page}&sha=${sha}`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        
        const commits = await response.json();
        return commits;
        
    } catch (error) {
        console.error('Erro ao buscar commits:', error);
        throw error;
    }
}

// Função utilitária para lidar com rate limiting da API do GitHub
function handleRateLimit(response) {
    const remaining = response.headers.get('X-RateLimit-Remaining');
    const resetTime = response.headers.get('X-RateLimit-Reset');
    
    if (remaining && parseInt(remaining) < 10) {
        console.warn(`Atenção: Restam apenas ${remaining} requisições para a API do GitHub`);
        
        if (resetTime) {
            const resetDate = new Date(parseInt(resetTime) * 1000);
            console.warn(`Rate limit será resetado em: ${resetDate.toLocaleString()}`);
        }
    }
}

// Função para cache simples dos dados (opcional)
class GitHubCache {
    constructor(ttl = 300000) { // 5 minutos por padrão
        this.cache = new Map();
        this.ttl = ttl;
    }
    
    set(key, data) {
        const expiry = Date.now() + this.ttl;
        this.cache.set(key, { data, expiry });
    }
    
    get(key) {
        const item = this.cache.get(key);
        
        if (!item) {
            return null;
        }
        
        if (Date.now() > item.expiry) {
            this.cache.delete(key);
            return null;
        }
        
        return item.data;
    }
    
    clear() {
        this.cache.clear();
    }
}

// Instância global do cache
const githubCache = new GitHubCache();

// Função wrapper que usa cache
async function fetchGitHubRepositoriesWithCache(username, options = {}) {
    const cacheKey = `repos_${username}_${JSON.stringify(options)}`;
    
    // Tentar buscar do cache primeiro
    const cachedData = githubCache.get(cacheKey);
    if (cachedData) {
        console.log('Dados carregados do cache');
        return cachedData;
    }
    
    // Se não estiver no cache, buscar da API
    try {
        const data = await fetchGitHubRepositories(username, options);
        githubCache.set(cacheKey, data);
        return data;
    } catch (error) {
        throw error;
    }
}// Funções de contribuições removidas - focando apenas em repositórios próprios