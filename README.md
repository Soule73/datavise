# DataVise Frontend

Application React/TypeScript pour la visualisation de données avec système de dashboards interactifs.

## Documentation des Visualisations

### Guides Disponibles
- **[Documentation Complète](./docs/VISUALIZATIONS_DOCUMENTATION.md)** - Guide utilisateur détaillé avec exemples
- **[Guide Technique](./docs/TECHNICAL_VISUALIZATIONS_GUIDE.md)** - Documentation développeur et architecture

### Système de Visualisations
**10 types de widgets** supportés avec filtres globaux unifiés :
- Indicateurs : KPI, Card, KPI Group
- Graphiques Chart.js : Bar, Line, Pie
- Graphiques spécialisés : Radar, Bubble, Scatter  
- Données : Table avec pagination et recherche

### Fonctionnalités Clés
- **Filtres globaux** sur toutes les visualisations
- **Multi-métriques** et buckets configurables
- **Styles personnalisés** par widget
- **Rétrocompatibilité** avec les anciens filtres
- **Performance optimisée** avec filtrage en amont

## Setup Technique

### Plugins Vite
- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
