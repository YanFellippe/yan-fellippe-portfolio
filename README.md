# 🚀 Portfolio Yan Fellippe

Portfolio pessoal moderno e responsivo desenvolvido com HTML5, CSS3 e JavaScript vanilla. Apresenta projetos, habilidades e experiências de forma interativa e profissional.

## ✨ Funcionalidades

### 🎨 Interface e Design
- **Design Responsivo**: Adaptável a todos os dispositivos (desktop, tablet, mobile)
- **Tema Dark/Light**: Alternância entre modo claro e escuro com persistência
- **Animações Suaves**: Efeitos de entrada e transições elegantes
- **Tipografia Moderna**: Fontes otimizadas para legibilidade
- **Ícones Font Awesome**: Biblioteca completa de ícones

### 🔍 Sistema de Busca e Filtros
- **Busca Inteligente**: Pesquisa por nome, descrição ou tecnologia
- **Filtros Avançados**: Por linguagem de programação, tipo de projeto
- **Sugestões Automáticas**: Sugestões baseadas no conteúdo
- **Ordenação**: Por data, estrelas ou nome
- **Resultados em Tempo Real**: Filtragem instantânea

### 📊 Integração com GitHub
- **API do GitHub**: Carregamento automático de repositórios
- **Estatísticas Dinâmicas**: Contadores de projetos, estrelas e linguagens
- **Gráfico de Linguagens**: Visualização com Chart.js
- **Rate Limit Handling**: Tratamento inteligente de limites da API
- **Dados de Fallback**: Repositórios de exemplo quando API indisponível

### 🎯 Animações e Interatividade
- **Scroll Animations**: Elementos aparecem conforme rolagem
- **Intersection Observer**: Performance otimizada
- **Efeito de Digitação**: Texto animado no título principal
- **Contadores Animados**: Números crescem gradualmente
- **Barras de Progresso**: Animação das habilidades técnicas

### 📱 Páginas Especializadas
- **Sobre Mim**: Biografia detalhada, habilidades e experiência
- **Contato**: Formulário funcional e informações de contato
- **Teste de Funcionalidades**: Página para testar recursos JavaScript

## 🛠️ Tecnologias Utilizadas

### Frontend
- **HTML5**: Estrutura semântica e acessível
- **CSS3**: Flexbox, Grid, Custom Properties, Animações
- **JavaScript ES6+**: Módulos, Classes, Async/Await, APIs modernas

### Bibliotecas e APIs
- **Chart.js**: Gráficos interativos
- **Font Awesome**: Ícones vetoriais
- **GitHub API**: Dados dos repositórios
- **Intersection Observer API**: Animações de scroll

### Ferramentas de Desenvolvimento
- **Git**: Controle de versão
- **GitHub Pages**: Hospedagem
- **VS Code**: Editor de código
- **Browser DevTools**: Debug e otimização

## 📁 Estrutura do Projeto

```
portfolio/
├── index.html                 # Página principal
├── public/
│   ├── about-me.html         # Página sobre mim
│   ├── contact.html          # Página de contato
│   └── test-functions.html   # Teste de funcionalidades
├── src/
│   ├── styles/
│   │   └── index.css         # Estilos principais
│   ├── js/
│   │   ├── index.js          # Script principal
│   │   ├── theme.js          # Gerenciador de tema
│   │   ├── animations.js     # Sistema de animações
│   │   ├── search-filters.js # Busca e filtros
│   │   ├── api.js           # Integração com APIs
│   │   └── contribuitions.js # Contribuições GitHub
│   └── img/                  # Imagens (vazio - usando CDN)
└── README.md                 # Documentação
```

## 🚀 Como Executar

### Opção 1: Servidor Local
```bash
# Clone o repositório
git clone https://github.com/YanFellippe/portfolio.git

# Entre no diretório
cd portfolio

# Inicie um servidor local (Python)
python -m http.server 8000

# Ou com Node.js
npx serve .

# Acesse http://localhost:8000
```

### Opção 2: Live Server (VS Code)
1. Instale a extensão "Live Server"
2. Clique com botão direito em `index.html`
3. Selecione "Open with Live Server"

### Opção 3: Acesso Online
Visite: [https://yanfellippe.github.io/portfolio](https://yanfellippe.github.io/portfolio)

## ⚙️ Configuração

### Personalização do GitHub
Para usar com seu próprio perfil, edite o arquivo `src/js/index.js`:

```javascript
// Linha 45 - Altere o username
const username = 'SeuUsername'; // Substitua por seu username do GitHub
```

### Customização de Cores
Edite as variáveis CSS no arquivo `src/js/theme.js`:

```css
:root {
    --accent: #4f46e5;        /* Cor principal */
    --accent-hover: #4338ca;  /* Cor hover */
    /* ... outras variáveis */
}
```

## 🎨 Temas

### Tema Claro
- Fundo branco/cinza claro
- Texto escuro
- Bordas suaves
- Sombras leves

### Tema Escuro
- Fundo escuro/preto
- Texto claro
- Bordas destacadas
- Sombras intensas

### Alternância
- **Botão**: Clique no ícone lua/sol no header
- **Atalho**: Ctrl/Cmd + Shift + T
- **Persistência**: Tema salvo no localStorage
- **Sistema**: Detecta preferência do OS

## 📊 Funcionalidades Avançadas

### Sistema de Busca
```javascript
// Busca por múltiplos critérios
const searchFilters = new SearchAndFilters();
searchFilters.refresh(); // Atualizar dados
```

### Animações
```javascript
// Adicionar animação a elemento
const animations = new ScrollAnimations();
animations.addElement(element, 'fade-up');
```

### Tema
```javascript
// Controle programático do tema
const themeManager = new ThemeManager();
themeManager.setThemeManually('dark');
```

## 🔧 Otimizações

### Performance
- **Lazy Loading**: Imagens carregadas sob demanda
- **Debounce**: Busca otimizada com delay
- **Intersection Observer**: Animações eficientes
- **CSS Minificado**: Estilos otimizados

### SEO
- **Meta Tags**: Descrições e palavras-chave
- **Estrutura Semântica**: HTML5 semântico
- **Alt Text**: Imagens com descrições
- **Schema Markup**: Dados estruturados

### Acessibilidade
- **ARIA Labels**: Elementos acessíveis
- **Contraste**: Cores com boa legibilidade
- **Navegação por Teclado**: Suporte completo
- **Screen Readers**: Compatibilidade

## 🐛 Solução de Problemas

### API do GitHub não carrega
- **Causa**: Rate limit excedido (60 req/hora)
- **Solução**: Aguardar reset ou usar dados de exemplo
- **Prevenção**: Implementar cache local

### Animações não funcionam
- **Causa**: JavaScript desabilitado
- **Solução**: Habilitar JS no navegador
- **Fallback**: CSS puro como alternativa

### Tema não persiste
- **Causa**: localStorage bloqueado
- **Solução**: Verificar configurações do navegador
- **Alternativa**: Usar preferência do sistema

## 📈 Métricas e Analytics

### Estatísticas Automáticas
- Total de repositórios
- Soma de estrelas
- Linguagens utilizadas
- Última atualização

### Gráficos Interativos
- Distribuição de linguagens
- Atividade no GitHub
- Progresso das habilidades

## 🤝 Contribuições

Contribuições são bem-vindas! Para contribuir:

1. **Fork** o projeto
2. **Crie** uma branch para sua feature
3. **Commit** suas mudanças
4. **Push** para a branch
5. **Abra** um Pull Request

### Diretrizes
- Código limpo e comentado
- Testes para novas funcionalidades
- Documentação atualizada
- Compatibilidade com navegadores modernos

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 📞 Contato

- **Email**: yangomesbasilio@gmail.com
- **LinkedIn**: [Yan Fellippe](https://www.linkedin.com/in/yan-fellippe-gomes-basilio-3229b81b9/)
- **GitHub**: [@YanFellippe](https://github.com/YanFellippe)

---

⭐ **Se este projeto foi útil para você, considere dar uma estrela!**

Desenvolvido com ❤️ por [Yan Fellippe](https://github.com/YanFellippe)