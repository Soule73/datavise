# @datavise/utils

Utilitaires partagés pour DataVise.

## Installation

Ce package fait partie du monorepo DataVise et est automatiquement disponible via Yarn workspace.

## Utilisation

```typescript
// Utilitaires de dates
import { formatDate, parseDate } from '@datavise/utils/date';

// Utilitaires de formatage
import { formatCurrency, formatNumber } from '@datavise/utils/format';

// Utilitaires de validation
import { validateEmail, validateUrl } from '@datavise/utils/validation';

// Utilitaires API
import { apiClient, createApiError } from '@datavise/utils/api';

// Ou importer tout
import * as dateUtils from '@datavise/utils/date';
import * as formatUtils from '@datavise/utils/format';
```

## Modules disponibles

### Date (`@datavise/utils/date`)
Utilitaires pour manipuler les dates :
- Formatage de dates
- Parsing de dates
- Calculs de dates

### Format (`@datavise/utils/format`)
Utilitaires de formatage :
- Formatage de nombres
- Formatage de devises
- Formatage de pourcentages
- Formatage de tailles de fichiers

### Validation (`@datavise/utils/validation`)
Utilitaires de validation :
- Validation d'emails
- Validation d'URLs
- Validation de formats
- Schémas Zod réutilisables

### API (`@datavise/utils/api`)
Utilitaires pour les appels API :
- Client API configuré
- Gestion d'erreurs
- Helpers de requêtes

## Structure

```
packages/utils/
├── src/
│   ├── date/             # Utilitaires de dates
│   ├── format/           # Utilitaires de formatage
│   ├── validation/       # Utilitaires de validation
│   ├── api/              # Utilitaires API
│   └── index.ts          # Point d'entrée principal
├── package.json
└── tsconfig.json
```

## Développement

```bash
# Type check
yarn workspace @datavise/utils type-check

# Lint
yarn workspace @datavise/utils lint
```

## Dépendances

- `zod` - Validation de schémas
