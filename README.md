# 🚀 Yan Fellippe - Portfolio

Portfolio pessoal desenvolvido com HTML, CSS e JavaScript, integrado com a API do GitHub para exibir repositórios e estatísticas em tempo real.

## ✨ Funcionalidades

- 🎨 **Tema Claro/Escuro**: Alternância entre temas com persistência no localStorage
- 📊 **Estatísticas do GitHub**: Exibição de repositórios, stars, linguagens e última atualização
- 📈 **Gráfico de Linguagens**: Visualização interativa das linguagens mais utilizadas
- 📱 **Design Responsivo**: Adaptável a diferentes tamanhos de tela
- 🔄 **Rate Limit Handling**: Sistema inteligente para lidar com limitações da API
- 🎯 **Repositórios de Exemplo**: Fallback quando a API não está disponível

## 🛠️ Tecnologias Utilizadas

- **HTML5**: Estrutura semântica
- **CSS3**: Estilização moderna com variáveis CSS e animações
- **JavaScript ES6+**: Funcionalidades interativas e integração com API
- **Chart.js**: Gráficos interativos
- **Font Awesome**: Ícones
- **GitHub API**: Dados dos repositórios

## 📁 Estrutura do Projeto

```
portfolio-yan/
├── index.html              # Página principal
├── public/
│   ├── about-me.html       # Página sobre
│   └── contact.html        # Página de contato
├── src/
│   ├── styles/
│   │   └── index.css       # Estilos principais
│   └── js/
│       ├── index.js        # Funcionalidades principais
│       └── api.js          # Integração com GitHub API
└── README.md
```

## 🚀 Como Usar

1. Clone o repositório:
```bash
git clone https://github.com/YanFellippe/yan-fellippe-portfolio.git
```

2. Abra o arquivo `index.html` no navegador

3. Para personalizar com seus dados:
   - Altere o username no arquivo `src/js/index.js` (linha com `const username = 'YanFellippe'`)
   - Atualize as informações pessoais no HTML
   - Modifique os links das redes sociais

## 🎨 Personalização

### Alterando o Tema
O sistema de temas utiliza variáveis CSS que podem ser facilmente modificadas no arquivo `src/styles/index.css`:

```css
:root {
    --bg-primary: #ffffff;
    --text-primary: #1e293b;
    --accent: #4f46e5;
    /* ... outras variáveis */
}
```

### Adicionando Novas Linguagens
Para adicionar cores para novas linguagens, edite a função `getLanguageColor()` em `src/js/index.js`.

## 📊 Funcionalidades da API

- **Repositórios**: Lista repositórios públicos próprios (não-fork)
- **Estatísticas**: Conta total de repos, stars, linguagens e última atualização
- **Linguagens**: Gráfico com todas as linguagens utilizadas
- **Rate Limit**: Tratamento inteligente quando o limite da API é excedido

## 🔧 Desenvolvimento

O projeto foi desenvolvido com foco em:
- **Performance**: Carregamento rápido e otimizado
- **Acessibilidade**: Navegação por teclado e leitores de tela
- **SEO**: Estrutura semântica e meta tags
- **Responsividade**: Design mobile-first

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Yan Fellippe**
- GitHub: [@YanFellippe](https://github.com/YanFellippe)
- LinkedIn: [Yan Fellippe](https://www.linkedin.com/in/yan-fellippe-gomes-basilio-3229b81b9/)

---

⭐ Se este projeto te ajudou, considere dar uma estrela!