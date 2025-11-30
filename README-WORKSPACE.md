# Yarn Workspace - DataVise

## Structure des packages

```
datavise/
├── packages/
│   ├── ui/              # @datavise/ui - Composants UI partagés
│   └── utils/           # @datavise/utils - Utilitaires partagés
└── src/                 # Application principale
```

## Installation

```bash
# Installer toutes les dépendances (racine + packages)
yarn install

# Ou avec npm
npm install
```

## Utilisation des packages

### @datavise/ui

Composants UI réutilisables :

```typescript
// Importer depuis le package
import { Button, Modal, Card } from '@datavise/ui';
import { InputField, SelectField } from '@datavise/ui/components/forms';
import { DashboardLayout } from '@datavise/ui/layouts';
```

**Composants disponibles :**
- **Common** : Button, LoadingSpinner, ErrorMessage, Card, Modal, Notification
- **Forms** : InputField, SelectField, TextAreaField, CheckboxField
- **Layouts** : DashboardLayout, AuthLayout

### @datavise/utils

Utilitaires réutilisables :

```typescript
// Importer depuis le package
import { formatDate, parseDate } from '@datavise/utils/date';
import { formatCurrency, formatNumber } from '@datavise/utils/format';
import { validateEmail, validateUrl } from '@datavise/utils/validation';
import { apiClient, createApiError } from '@datavise/utils/api';
```

**Modules disponibles :**
- **date** : Manipulation de dates
- **format** : Formatage de données
- **validation** : Validation de données
- **api** : Utilitaires API

## Commandes Yarn Workspace

```bash
# Ajouter une dépendance à un package spécifique
yarn workspace @datavise/ui add react-icons
yarn workspace @datavise/utils add lodash

# Exécuter un script dans un package
yarn workspace @datavise/ui lint
yarn workspace @datavise/utils type-check

# Exécuter un script dans tous les packages
yarn workspaces run lint
yarn workspaces run type-check

# Construire tous les packages
yarn workspaces run build
```

## Développement

### Ajouter un nouveau composant dans @datavise/ui

1. Créer le composant dans `packages/ui/src/components/`
2. Exporter dans `packages/ui/src/components/[category]/index.ts`
3. Utiliser dans l'application avec `import { Component } from '@datavise/ui'`

### Ajouter un nouvel utilitaire dans @datavise/utils

1. Créer l'utilitaire dans `packages/utils/src/[module]/`
2. Exporter dans `packages/utils/src/[module]/index.ts`
3. Utiliser dans l'application avec `import { util } from '@datavise/utils/[module]'`

## Avantages de cette architecture

✅ **Modularité** : Code organisé en packages indépendants
✅ **Réutilisabilité** : Composants et utils partagés facilement
✅ **Type Safety** : TypeScript complet avec références croisées
✅ **DX** : Hot reload fonctionne pour tous les packages
✅ **Maintenance** : Changements isolés par domaine
✅ **Scalabilité** : Facile d'ajouter de nouveaux packages

## Prochaines étapes

Packages potentiels à ajouter :
- `@datavise/hooks` : Hooks React personnalisés
- `@datavise/domain` : Logique métier et entités
- `@datavise/api` : Couche API et repositories
- `@datavise/config` : Configuration partagée
- `@datavise/types` : Types TypeScript partagés
