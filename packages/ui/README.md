# @datavise/ui

Composants UI partagés pour DataVise.

## Installation

Ce package fait partie du monorepo DataVise et est automatiquement disponible via Yarn workspace.

## Utilisation

```typescript
// Composants communs
import { Button, Modal, Card, LoadingSpinner } from '@datavise/ui';

// Composants de formulaire
import { InputField, SelectField } from '@datavise/ui/components/forms';

// Layouts
import { DashboardLayout, AuthLayout } from '@datavise/ui/layouts';
```

## Composants disponibles

### Common
- `Button` - Bouton réutilisable avec variantes
- `LoadingSpinner` - Indicateur de chargement
- `ErrorMessage` - Affichage d'erreurs
- `Card` - Carte de contenu
- `Modal` - Fenêtre modale
- `Notification` - Notifications toast

### Forms
- `InputField` - Champ de saisie texte
- `SelectField` - Liste déroulante
- `TextAreaField` - Zone de texte multiligne
- `CheckboxField` - Case à cocher

### Layouts
- `DashboardLayout` - Layout principal avec sidebar
- `AuthLayout` - Layout pour pages d'authentification

## Structure

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── common/       # Composants communs
│   │   └── forms/        # Composants de formulaire
│   ├── layouts/          # Layouts de page
│   └── index.ts          # Point d'entrée principal
├── package.json
└── tsconfig.json
```

## Développement

```bash
# Type check
yarn workspace @datavise/ui type-check

# Lint
yarn workspace @datavise/ui lint
```
