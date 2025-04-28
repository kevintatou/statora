# 🚦 Statora - Backstage Plugin for Service Health & Metadata Mapping (WIP)

Statora is a Backstage plugin that gives you a single pane of glass for service health — with dynamic metadata mapping, DORA metrics, and YAML-free configuration.

Connect your GitHub, ArgoCD, Jira, Sentry, and GCP tools to Backstage — without digging through annotations.

![Dashboard Screenshot](./media/statora-dashboard.png)

---

## ✨ Features

- 📊 View DORA metrics per service
- 🧹 Map GitHub, ArgoCD, Jira, Sentry, and GCP projects to Backstage components
- 🧠 Visualize health scores and product groupings
- 🚼 YAML-free mapping UI (via Supabase)
- 🔐 Backend plugin with identity-based access
- 📦 Easily demo with prefilled mock data

---

## 🔧 Installation

### 1. Backend Plugin Setup
Install the backend plugin:
```ts
// packages/backend/
yarn add @tatou/plugin-statora-backend
```
Add the backend plugin to your Backstage backend:

```ts
// packages/backend/src/index.ts
backend.add(import('@tatou/plugin-statora-backend'));
```

Ensure your `app-config.local.yaml` includes Supabase credentials for the backend:

```yaml
statora:
  supabase:
    url: https://your-project.supabase.co
    serviceRoleKey: ${SUPABASE_SERVICE_ROLE_KEY} # or hardcoded for now
```

This enables secure API routes to fetch DORA metrics and mappings.

---

### 2. Frontend Plugin Setup

Install the frontend plugin:

```bash
// packages/app/
yarn add @tatou/plugin-statora
```

Add the routes to your app:

```tsx
// App.tsx or routes.tsx
import {
  DashboardPage,
  EntityStatoraContent,
  ProductDetailPage,
} from '@tatou/plugin-statora';

<Route path="/" element={<DashboardPage />} />
<Route path="/catalog/:namespace/:kind/:name/statora" element={<EntityStatoraContent />} />
<Route path="/statora/product/:productName" element={<ProductDetailPage />} />
```

Include the statora factory in `apis.ts`:

```ts
import { statoraApiFactory } from '@tatou/plugin-statora';

export const apis: AnyApiFactory[] = [
  createApiFactory({
    api: scmIntegrationsApiRef,
    deps: { configApi: configApiRef },
    factory: ({ configApi }) => ScmIntegrationsApi.fromConfig(configApi),
  }),
  ScmAuth.createDefaultApiFactory(),
  statoraApiFactory // <----- add this line
];
```

---

## 🗃 Supabase Setup

Create a new [Supabase](https://supabase.com) project and apply the schema:

- Schema:
  ```
  mock-data/schema.sql
  ```

- Demo seed data:
  ```
  mock-data/seed.sql
  ```

---

## 🚀 OSS vs Premium

| Feature                              | OSS (This Repo) ✅ | SaaS (Upcoming) 🌐 |
|--------------------------------------|--------------------|--------------------|
| YAML-free metadata editor            | ✅                 | ✅                 |
| Product health dashboard             | ✅                 | ✅                 |
| UI to edit GitHub/Jira/Sentry links  | ✅                 | ✅                 |
| Autocomplete & mapping suggestions   | ❌                 | ✅                 |
| GitHub App / Jira Cloud integrations | ❌                 | ✅                 |
| Multi-team view, filters, auth       | ❌                 | ✅                 |

---

## 📸 Screenshots

_Dashboard (Product + Service toggle):_

![Dashboard](./media/statora-dashboard.png)

_Service Detail:_

![Service Detail](./media/statora-detail.png)

---

## 🧪 Mock Demo Data

You can seed mock services like `payments-service`, `auth-service`, and `checkout-flow`.  
YAML files and SQL scripts are included in `mock-data/schema.sql` and `mock-data/seed.sql`.

---

## 🧭 Metadata Source

All service metadata (e.g. GitHub repo, Sentry project, ArgoCD app, etc.) is stored in a central Supabase database.

This allows teams to manage mappings dynamically — without editing YAML or opening PRs.

---

## 🤝 Contributing

This is an early open-source version. PRs and feedback welcome!  
Feel free to fork and adapt the Supabase schema or plugin UI.

---

## 📄 License

MIT

