# AI Agent Development System - Responsibility Matrix

## 🎯 Overview

This document defines the roles, responsibilities, and communication protocols for AI agents working on the Rider Tracker App. Each agent operates independently and communicates through standardized configuration files, without direct knowledge of other agents' implementations.

## 🤖 Agent Definitions

### 1. **UI/UX Agent** - *Design & User Experience*

**Primary Responsibility**: All visual design, user interface, and user experience decisions
**Scope**: Pages, components, layouts, accessibility, responsive design
**Forbidden**: Business logic, database queries, API implementations

**Connection Window**:

- **Receives from**: Feature Specification Agent via `feature-spec.json`
- **Sends to**: Frontend Agent via `ui-design.json`
- **Configuration Interface**: `/config/ui/ui-requirements.json`

**Deliverables**:

- Component mockups and wireframes
- CSS/Tailwind configurations
- Accessibility compliance reports
- Mobile-first responsive designs

---

### 2. **Frontend Agent** - *Client-Side Implementation*

**Primary Responsibility**: Vue/Nuxt frontend code, state management, user interactions
**Scope**: Composables, pages, components, client-side validation
**Forbidden**: Server-side logic, direct database access, API route handlers

**Connection Window**:

- **Receives from**: UI/UX Agent via `ui-design.json`
- **Receives from**: API Contract Agent via `api-contract.json`
- **Sends to**: Integration Agent via `frontend-implementation.json`
- **Configuration Interface**: `/config/frontend/architecture.json`

**Deliverables**:

- Vue components and composables
- Client-side state management
- Form validation and error handling
- PWA features and offline capability

---

### 3. **API Contract Agent** - *Interface Definition*

**Primary Responsibility**: Defining API contracts, data schemas, and communication protocols
**Scope**: REST endpoints, request/response formats, validation rules
**Forbidden**: Implementation details, database schema, UI decisions

**Connection Window**:

- **Receives from**: Feature Specification Agent via `feature-spec.json`
- **Sends to**: Frontend Agent via `api-contract.json`
- **Sends to**: Backend Agent via `api-contract.json`
- **Configuration Interface**: `/config/api/contract-definitions.json`

**Deliverables**:

- OpenAPI specifications
- JSON Schema definitions
- Rate limiting rules
- Error response standards

---

### 4. **Backend Agent** - *Server-Side Implementation*

**Primary Responsibility**: Server API routes, business logic, server-side validation
**Scope**: Nuxt server routes, middleware, business rules, caching
**Forbidden**: Database schema design, UI decisions, client-side code

**Connection Window**:

- **Receives from**: API Contract Agent via `api-contract.json`
- **Receives from**: Database Agent via `database-schema.json`
- **Sends to**: Integration Agent via `backend-implementation.json`
- **Configuration Interface**: `/config/backend/server-architecture.json`

**Deliverables**:

- Server API endpoints
- Business logic implementation
- Authentication middleware
- Rate limiting and caching

---

### 5. **Database Agent** - *Data Architecture*

**Primary Responsibility**: Database schema, migrations, indexes, RLS policies
**Scope**: PostgreSQL schema, Supabase configurations, performance optimization
**Forbidden**: API design, UI decisions, business logic

**Connection Window**:

- **Receives from**: Feature Specification Agent via `feature-spec.json`
- **Sends to**: Backend Agent via `database-schema.json`
- **Configuration Interface**: `/config/database/schema-definitions.json`

**Deliverables**:

- SQL migration files
- RLS policy definitions
- Index optimization
- Database documentation

---

### 6. **Integration Agent** - *System Assembly*

**Primary Responsibility**: Integrating all components, resolving conflicts, ensuring compatibility
**Scope**: Environment setup, deployment configs, integration testing
**Forbidden**: Individual component implementation, design decisions

**Connection Window**:

- **Receives from**: Frontend Agent via `frontend-implementation.json`
- **Receives from**: Backend Agent via `backend-implementation.json`
- **Receives from**: Database Agent via `database-schema.json`
- **Configuration Interface**: `/config/integration/deployment.json`

**Deliverables**:

- Docker configurations
- Environment variable templates
- CI/CD pipeline definitions
- Integration test suites

---

### 7. **Feature Specification Agent** - *Requirements Definition*

**Primary Responsibility**: Translating user requirements into comprehensive technical specifications
**Scope**: User stories, acceptance criteria, feature scope definition, UI/UX requirements, API endpoint specifications
**Forbidden**: Implementation details, code decisions, technical architecture

**Connection Window**:

- **Sends to**: UI/UX Agent via `feature-spec.json`
- **Sends to**: API Contract Agent via `feature-spec.json`
- **Sends to**: Database Agent via `feature-spec.json`
- **Configuration Interface**: `/config/features/requirements.json`

**Deliverables**:

- User stories with acceptance criteria
- Feature specifications
- Non-functional requirements
- Success metrics definition
- **UI/UX Requirements**: Detailed interface specifications, user flow descriptions, accessibility requirements
- **API Endpoint Specifications**: Complete endpoint definitions, request/response formats, authentication requirements
- **Data Requirements**: Schema specifications, validation rules, business constraints

---

### 8. **Testing Agent** - *Quality Assurance*

**Primary Responsibility**: Test strategy, test cases, quality validation
**Scope**: Unit tests, integration tests, E2E tests, performance tests
**Forbidden**: Implementation fixes, feature decisions

**Connection Window**:

- **Receives from**: All other agents via `[agent-name]-test-requirements.json`
- **Sends to**: Integration Agent via `test-results.json`
- **Configuration Interface**: `/config/testing/test-strategy.json`

**Deliverables**:

- Test case definitions
- Test data fixtures
- Performance benchmarks
- Security test scenarios

---

### 9. **HT-Validation Agent** - *Configuration Validation*

**Primary Responsibility**: Validating consistency between feature specifications and implementation configurations
**Scope**: Cross-referencing feature-spec.json with implementation files, API endpoint matching, schema validation
**Forbidden**: Implementation changes, feature modifications

**Connection Window**:

- **Receives from**: Feature Specification Agent via `feature-spec.json`
- **Receives from**: Frontend Agent via `frontend-implementation.json`
- **Receives from**: Backend Agent via `backend-implementation.json`
- **Receives from**: Database Agent via `database-schema.json`
- **Sends to**: Integration Agent via `validation-report.json`
- **Configuration Interface**: `/config/validation/validation-rules.json`

**Deliverables**:

- API endpoint consistency reports
- Configuration drift detection
- Feature implementation mapping
- Validation summary reports

**Validation Checks**:

- API endpoints in feature-spec.json match backend-implementation.json
- UI components in feature-spec.json are present in frontend-implementation.json
- Database tables in feature-spec.json match database-schema.json
- All specified dependencies are implemented

## 🔗 Agent Communication Protocol

### Configuration File Standards

**⚠️ IMPORTANT: Configuration files are EXAMPLE templates only**

- **Agents must adapt these examples** to their specific feature requirements
- **Examples are not mandatory structures** - agents should extend/modify as needed
- **Each feature may require different configuration structures**
- **Agents must document their actual configuration formats** in their deliverables

**🔁 Additive Configuration Protocol**

- **New features must NOT replace existcoming configurations**
- **All configuration files must be additive** - append new features without modifying existing ones
- **Feature isolation**: Each feature gets its own configuration namespace
- **Version compatibility**: New features must maintain backward compatibility
- **Merge strategy**: Integration Agent handles configuration merging

### Configuration File Standards

#### **Feature Specification Format** (`feature-spec.json`)

```json
{
  "featureId": "ride-sharing-001",
  "title": "Ride Sharing Feature",
  "description": "Allow users to share their rides with friends",
  "priority": "high",
  "dependencies": {
    "ui": ["new-sharing-button", "sharing-modal"],
    "api": ["POST /api/v1/rides/:id/share", "GET /api/v1/shares/:id"],
    "database": ["shares table", "share_permissions table"],
    "business": ["sharing-policy", "privacy-settings"]
  },
  "acceptanceCriteria": [
    "User can generate shareable link",
    "Shared rides display with viewer permissions",
    "Owner can revoke sharing at any time"
  ],
  "constraints": {
    "maxSharesPerRide": 10,
    "shareExpiry": "30 days",
    "privacyLevels": ["public", "friends", "private"]
  }
}
```

#### **UI Design Specification** (`ui-design.json`)

```json
{
  "component": "ride-sharing-ui",
  "screens": [
    {
      "name": "sharing-button",
      "type": "floating-action",
      "position": "bottom-right",
      "accessibility": {
        "label": "Share this ride",
        "role": "button"
      }
    },
    {
      "name": "sharing-modal",
      "type": "modal",
      "fields": ["privacy-level", "expiry-date", "recipients"]
    }
  ],
  "responsive": {
    "mobile": "full-width",
    "tablet": "modal-width-80",
    "desktop": "modal-width-50"
  }
}
```

#### **API Contract Definition** (`api-contract.json`)

```json
{
  "endpoint": "/api/v1/rides/:id/share",
  "method": "POST",
  "authentication": "required",
  "request": {
    "privacyLevel": "enum[public,friends,private]",
    "expiryDate": "ISO8601",
    "recipients": "array[email]"
  },
  "response": {
    "200": {
      "shareId": "uuid",
      "shareUrl": "string",
      "qrCode": "base64"
    },
    "400": {
      "error": "VALIDATION_ERROR",
      "details": "object"
    }
  }
}
```

#### **Database Schema Definition** (`database-schema.json`)

```json
{
  "tables": {
    "shares": {
      "columns": {
        "id": "uuid primary key",
        "ride_id": "uuid references rides(id)",
        "user_id": "uuid references auth.users(id)",
        "share_token": "varchar(255) unique",
        "privacy_level": "enum[public,friends,private]",
        "expires_at": "timestamp",
        "created_at": "timestamp default now()"
      },
      "indexes": ["ride_id", "share_token", "expires_at"],
      "rls": true
    }
  }
}
```

#### **Frontend Implementation Specification** (`frontend-implementation.json`)

```json
{
  "component": "ride-sharing-frontend",
  "implementation": {
    "framework": "vue3",
    "styling": "tailwindcss",
    "stateManagement": "pinia",
    "routing": "nuxt3"
  },
  "files": {
    "components": [
      {
        "path": "components/ride-sharing/ShareButton.vue",
        "props": ["rideId", "disabled"],
        "emits": ["share-clicked"]
      },
      {
        "path": "components/ride-sharing/ShareModal.vue",
        "props": ["rideId", "isOpen"],
        "emits": ["close", "share-created"]
      }
    ],
    "composables": [
      {
        "path": "composables/useRideSharing.ts",
        "exports": ["useShareRide", "useGetShareUrl", "useRevokeShare"]
      }
    ],
    "stores": [
      {
        "path": "stores/sharingStore.ts",
        "state": ["shares", "isLoading", "error"],
        "actions": ["createShare", "revokeShare", "fetchShares"]
      }
    ]
  },
  "validation": {
    "bundleSize": "< 500KB",
    "performance": {
      "tti": "< 3s",
      "lighthouse": "> 90"
    },
    "accessibility": "WCAG 2.1 AA"
  }
}
```

#### **Backend Implementation Specification** (`backend-implementation.json`)

```json
{
  "service": "ride-sharing-backend",
  "implementation": {
    "framework": "nuxt3",
    "runtime": "nitro",
    "database": "supabase-postgresql",
    "auth": "supabase-auth"
  },
  "endpoints": [
    {
      "path": "/api/v1/rides/:id/share",
      "method": "POST",
      "handler": "createShare",
      "middleware": ["auth", "rate-limit"],
      "validation": {
        "body": {
          "privacyLevel": "enum[public,friends,private]",
          "expiryDate": "ISO8601",
          "recipients": "array[email]"
        }
      }
    },
    {
      "path": "/api/v1/shares/:id",
      "method": "GET",
      "handler": "getShare",
      "middleware": ["optional-auth"]
    },
    {
      "path": "/api/v1/shares/:id",
      "method": "DELETE",
      "handler": "revokeShare",
      "middleware": ["auth", "ownership-check"]
    }
  ],
  "utilities": [
    {
      "path": "server/utils/sharing.ts",
      "functions": ["generateShareToken", "validateShareExpiry", "checkSharePermissions"]
    },
    {
      "path": "server/utils/validation.ts",
      "functions": ["validateShareInput", "validateEmailList"]
    }
  ],
  "security": {
    "rateLimit": "100 requests per minute",
    "rls": true,
    "inputSanitization": true,
    "cors": ["https://rider-tracker.app"]
  }
}
```

## 🔄 Agent Sequence for New Features

### Phase 1: Requirements Definition

```
Feature Specification Agent
    ↓
feature-spec.json (created)
    ↓
All other agents receive notification
```

### Phase 2: Design & Architecture

```
UI/UX Agent ←→ API Contract Agent ←→ Database Agent
    ↓         ↓            ↓
ui-design.json  api-contract.json  database-schema.json
    ↓         ↓            ↓
Frontend Agent  Backend Agent  (schema ready)
```

### Phase 3: Implementation

```
Frontend Agent ←→ Backend Agent
    ↓         ↓
frontend-implementation.json  backend-implementation.json
    ↓         ↓
Integration Agent receives both
```

### Phase 4: Validation & Integration

```
Integration Agent
    ↓
HT-Validation Agent (validates configurations)
    ↓
Testing Agent (receives all implementations)
    ↓
Validation report + Test results → Integration Agent
    ↓
Deployment ready package
```

## 📋 Agent Workflow Checklist

### New Feature Request Workflow

#### Step 1: Feature Initiation

- [ ] **Feature Specification Agent** creates `feature-spec.json`
- [ ] Validates with all agents via notification system
- [ ] Creates feature branch: `feature/[feature-name]`

#### Step 2: Parallel Development

- [ ] **UI/UX Agent** designs interface → `ui-design.json`
- [ ] **API Contract Agent** defines contracts → `api-contract.json`
- [ ] **Database Agent** designs schema → `database-schema.json`
- [ ] **Agents coordinate through configuration files only**

#### Step 3: Implementation Phase

- [ ] **Frontend Agent** implements UI based on `ui-design.json` + `api-contract.json`
- [ ] **Backend Agent** implements API based on `api-contract.json` + `database-schema.json`
- [ ] **Agents validate against configuration files only**

#### Step 4: Validation Phase

- [ ] **Integration Agent** collects all implementations
- [ ] **HT-Validation Agent** validates configurations against feature-spec.json
- [ ] **Testing Agent** creates and runs tests
- [ ] **Integration Agent** resolves any conflicts based on validation reports

#### Step 5: Deployment

- [ ] **developer checks the implementation**

## 🚨 Agent Interaction Rules

### Strict Communication Protocols

1. **No direct code dependencies** between agents
2. **Configuration files are the only communication medium**
3. **Each agent validates inputs against their configuration schema**
4. **Breaking changes must be versioned and announced**
5. **Additive configuration only** - new features must not replace existing ones
6. **HT-Validation Agent must approve all configuration changes** before integration

### Additive Configuration Rules

- **Feature isolation**: Each feature gets its own configuration namespace
- **No replacements**: New features append to existing configurations
- **Backward compatibility**: All new features must maintain compatibility
- **Merge responsibility**: Integration Agent handles configuration merging
- **Validation requirement**: HT-Validation Agent checks all additive changes

### Error Handling

- **Agent failures** are isolated and don't affect others
- **Configuration validation** catches issues before integration
- **Rollback procedures** defined for each agent type

### Quality Gates

- **Configuration validation** before any agent starts work
- **Integration testing** before deployment
- **Performance benchmarks** for each agent's deliverables

## 📊 Agent Performance Metrics

### Individual Agent Metrics

- **Feature Specification Agent**: Requirements clarity score
- **UI/UX Agent**: Design consistency score, accessibility score
- **Frontend Agent**: Bundle size, performance metrics
- **Backend Agent**: API response times, error rates
- **Database Agent**: Query performance, schema efficiency
- **Integration Agent**: Integration success rate, conflict resolution time
- **Testing Agent**: Test coverage, bug detection rate

### Cross-Agent Metrics

- **Configuration compatibility rate**
- **Integration success rate**
- **Feature delivery time**
- **Rollback frequency**

---

**⚠️ AGENT VIOLATION CONSEQUENCES:**

- **Configuration drift** detected via automated validation
- **Breaking changes** trigger immediate rollback
- **Communication outside protocol** results in agent isolation
- **Quality gates** must pass before integration

**✅ AGENT APPROVAL REQUIRED:**

- New feature specifications
- API contract changes
- Database schema modifications
- Configuration format updates
- Deployment procedures
- HT-Validation Agent creation and configuration

## 📚 Agent Documentation Standards

### Configuration File Documentation

Each agent must document:

1. **Input configuration format** they expect
2. **Output configuration format** they produce
3. **Validation rules** for their configurations
4. **Version compatibility** requirements

### Example Documentation

```typescript
/**
 * @agent UI/UX Agent
 * @input feature-spec.json
 * @output ui-design.json
 * @validation UI/UX validation rules
 * @compatibility Frontend Agent v1.0+
 */
```

## 🚨 Emergency Procedures

### Agent Conflict Resolution

1. **Configuration Validation Failure**: Return to previous stable configuration
2. **Dependency Mismatch**: Feature Specification Agent intervenes
3. **Integration Issues**: Integration Agent creates rollback plan
4. **Quality Gate Failure**: Testing Agent blocks deployment

### Agent Replacement Protocol

If an agent fails or needs replacement:

1. **Feature Specification Agent** updates `feature-spec.json`
2. **All dependent agents** receive update notification
3. **Integration Agent** coordinates new agent onboarding
4. **Testing Agent** validates new agent compatibility

---

**⚠️ AGENT VIOLATION CONSEQUENCES:**

- **Build failure** if agents communicate outside defined protocols
- **Isolation violation** triggers immediate agent rollback
- **Configuration drift** detected via automated validation
- **Cross-layer dependencies** result in deployment rejection

**✅ AGENT APPROVAL REQUIRED:**

- New agent creation
- API interface changes
- Service configuration modifications
- Cross-layer communication protocols
- Breaking changes to data transforms
- HT-Validation Agent creation and configuration
