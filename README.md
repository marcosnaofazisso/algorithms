# Algorithm Visual Guide

Um guia visual interativo para algoritmos de busca e ordenação, começando com Linear Search. O projeto apresenta visualizações passo a passo de como os algoritmos funcionam, combinando diagramas de fluxo com representações visuais dos dados.

## 🎯 Características

- **Visualização Interativa**: Veja o algoritmo executar passo a passo
- **Diagrama de Fluxo**: Acompanhe a lógica do algoritmo em tempo real usando React Flow
- **Visualização de Dados**: Array visual com estados diferentes para cada elemento
- **Controles Completos**: Gere arrays aleatórios ou insira manualmente
- **Código Python**: Implementação completa com exemplos
- **Design Minimalista**: Interface clean preto e branco, sem distrações

## 🚀 Tecnologias

- **React 19** + **TypeScript** - Framework e type safety
- **Vite** - Build tool ultra-rápido
- **React Flow** - Visualização de diagramas de fluxo
- **ShadcnUI** - Componentes UI minimalistas
- **Tailwind CSS** - Estilização utilitária

## 📦 Instalação

```bash
# Clone o repositório
git clone https://github.com/marcosnaofazisso/algorithms.git

# Entre no diretório
cd algorithms

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:5173/`

## 🎨 Design System

O projeto segue um design minimalista:

- **Cores**: Preto (`#000000`) e Branco (`#FFFFFF`)
- **Tipografia**: Fontes serifadas (Georgia, Times New Roman)
- **Bordas**: Sólidas, sem border-radius
- **Layout**: Clean e focado no conteúdo

## 🔍 Algoritmos Implementados

### Linear Search

Algoritmo de busca sequencial que percorre cada elemento até encontrar o alvo.

**Complexidade:**
- Melhor caso: O(1)
- Caso médio: O(n)
- Pior caso: O(n)
- Espaço: O(1)

**Recursos:**
- Visualização em tempo real do elemento sendo verificado
- Destaque quando o elemento é encontrado
- Feedback visual para cada passo
- Diagrama de fluxo sincronizado

## 📖 Como Usar

1. **Gerar Array**:
   - Clique em "Random Array" para gerar números aleatórios
   - Ou insira manualmente números separados por vírgula

2. **Definir Alvo**:
   - Digite o número que deseja buscar no campo "Target Value"

3. **Executar**:
   - Clique em "Start Search" para iniciar a animação
   - Observe o diagrama de fluxo e a visualização do array

4. **Reset**:
   - Clique em "Reset" para reiniciar com um novo array

## 🏗️ Estrutura do Projeto

```
src/
├── components/
│   ├── ui/                      # Componentes base ShadcnUI
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   └── separator.tsx
│   ├── AlgorithmLayout.tsx      # Layout principal
│   ├── AlgorithmSelector.tsx    # Seletor de algoritmos
│   ├── CodeSnippet.tsx          # Exibição de código Python
│   ├── DataVisualization.tsx    # Visualização do array
│   ├── FlowDiagram.tsx          # Diagrama de fluxo React Flow
│   └── LinearSearchViz.tsx      # Componente principal Linear Search
├── data/
│   └── algorithms.ts            # Dados dos algoritmos
├── lib/
│   ├── linearSearch.ts          # Lógica do Linear Search
│   └── utils.ts                 # Utilitários
├── types/
│   └── algorithms.ts            # Tipos TypeScript
├── App.tsx                      # Componente raiz
├── main.tsx                     # Entry point
└── index.css                    # Estilos globais
```

## 🎯 Roadmap

Algoritmos futuros planejados:

- [ ] Binary Search
- [ ] Bubble Sort
- [ ] Selection Sort
- [ ] Insertion Sort
- [ ] Quick Sort
- [ ] Merge Sort

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📄 Licença

Este projeto está sob a licença ISC.

## 👨‍💻 Autor

Desenvolvido com ❤️ para aprender e ensinar algoritmos de forma visual e interativa.

---

**Dica**: Use a aplicação para estudar algoritmos ou para ensinar conceitos de forma visual e interativa!
