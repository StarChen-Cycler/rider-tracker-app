# Agent Handoff Protocol - Layer-by-Layer Boundaries

## 🎯 Overview

This document defines explicit handoff boundaries between AI agents in the Rider Tracker App architecture. Each agent has clearly defined inputs, outputs, and responsibilities that must be strictly followed to ensure clean separation of concerns and maintainable code.

## 📊 Layer Architecture & Handoff Matrix

### **1. Feature Specification Agent → All Other Agents**

**Handoff Boundary**: Requirements Definition
- **Receives**: User requirements, business needs, feature requests
- **Delivers**: `feature-spec.json` (canonical source of truth)
- **Responsibility End**: Defining what needs to be built, not how
- **Validation**: Must pass HT-Validation Agent review before handoff

**Required Handoff Contents**:
```json
{
  "featureId": "FEAT-YYYYMMDD-001", // Unique ID format: FEAT-YYYYMMDD-NNN
  "scope": "clear boundaries",
  "dependencies": {
    "ui": ["specific components needed"],
    "api": ["exact endpoints required"],
    "database": ["tables/indexes needed"],
    "business": ["rules and constraints"]
  },
  "acceptanceCriteria": ["measurable outcomes"],
  "constraints": ["performance, security, UX limits"],
  "tracking": {
    "originalFeatureId": "FEAT-YYYYMMDD-001",
    "validationChain": []
  }
}
```

### **2. UI/UX Agent → Frontend Agent**

**Handoff Boundary**: Visual Design Specification
- **Receives**: `feature-spec.json` (from Feature Agent)
- **Delivers**: `ui-design.json` (design system artifacts)
- **Responsibility End**: Visual design decisions, not implementation
- **Validation**: Must include accessibility compliance report

**Required Handoff Contents**:
```json
{
  "featureId": "FEAT-YYYYMMDD-001", // MUST match original feature ID
  "designSystem": "tailwind config values",
  "components": [
    {
      "componentId": "FEAT-YYYYMMDD-001-COMP-001", // Unique component ID
      "name": "component-name",
      "specs": "exact measurements and styles",
      "responsive": "mobile-first breakpoints",
      "accessibility": "WCAG compliance details"
    }
  ],
  "userFlows": "interaction patterns",
  "performance": "bundle size impact",
  "tracking": {
    "originalFeatureId": "FEAT-YYYYMMDD-001",
    "validationChain": ["UI/UX Agent"]
  }
}
```

### **3. API Contract Agent → Frontend & Backend Agents**

**Handoff Boundary**: Interface Definition
- **Receives**: `feature-spec.json` (from Feature Agent)
- **Delivers**: `api-contract.json` (OpenAPI specification)
- **Responsibility End**: Contract definition, not implementation
- **Validation**: Must include rate limiting and error response standards

**Required Handoff Contents**:
```json
{
  "featureId": "FEAT-YYYYMMDD-001", // MUST match original feature ID
  "endpoints": [
    {
      "endpointId": "FEAT-YYYYMMDD-001-API-001", // Unique endpoint ID
      "path": "/api/v1/specific-endpoint",
      "method": "GET|POST|PUT|DELETE",
      "request": "JSON Schema validation",
      "response": "JSON Schema validation",
      "auth": "required permissions",
      "rateLimit": "requests per minute"
    }
  ],
  "dataContracts": "TypeScript interfaces",
  "errorHandling": "standardized error responses",
  "tracking": {
    "originalFeatureId": "FEAT-YYYYMMDD-001",
    "validationChain": ["API Contract Agent"]
  }
}
```

### **4. Database Agent → Backend Agent**

**Handoff Boundary**: Data Architecture
- **Receives**: `feature-spec.json` (from Feature Agent)
- **Delivers**: `database-schema.json` (SQL migration files)
- **Responsibility End**: Schema design, not query implementation
- **Validation**: Must include RLS policies and performance indexes

**Required Handoff Contents**:
```json
{
  "featureId": "FEAT-YYYYMMDD-001", // MUST match original feature ID
  "migrations": [
    {
      "migrationId": "FEAT-YYYYMMDD-001-MIGRATION-001", // Unique migration ID
      "sql": "exact SQL statements",
      "rollback": "undo statements",
      "indexes": "performance optimization",
      "rls": "row level security policies"
    }
  ],
  "validation": "CHECK constraints",
  "performance": "query execution plans",
  "tracking": {
    "originalFeatureId": "FEAT-YYYYMMDD-001",
    "validationChain": ["Database Agent"]
  }
}
```

### **5. Frontend Agent → Integration Agent**

**Handoff Boundary**: Client Implementation
- **Receives**: `ui-design.json`, `api-contract.json`
- **Delivers**: `frontend-implementation.json` (built artifacts)
- **Responsibility End**: Working UI components, not integration
- **Validation**: Must pass unit tests and bundle size limits

**Required Handoff Contents**:
```json
{
  "featureId": "FEAT-YYYYMMDD-001", // MUST match original feature ID
  "components": [
    {
      "componentId": "FEAT-YYYYMMDD-001-COMP-001", // Unique component ID
      "file": "exact file path",
      "props": "defined interface",
      "tests": "unit test coverage",
      "bundle": "size in bytes"
    }
  ],
  "composables": [
    {
      "composableId": "FEAT-YYYYMMDD-001-COMPOSABLE-001", // Unique composable ID
      "name": "use[Feature]",
      "exports": "defined interface"
    }
  ],
  "performance": "lighthouse scores",
  "accessibility": "axe-core validation",
  "tracking": {
    "originalFeatureId": "FEAT-YYYYMMDD-001",
    "validationChain": ["Frontend Agent"]
  }
}
```

### **6. Backend Agent → Integration Agent**

**Handoff Boundary**: Server Implementation
- **Receives**: `api-contract.json`, `database-schema.json`
- **Delivers**: `backend-implementation.json` (API endpoints)
- **Responsibility End**: Working endpoints, not deployment
- **Validation**: Must pass API tests and security scans

**Required Handoff Contents**:
```json
{
  "featureId": "FEAT-YYYYMMDD-001", // MUST match original feature ID
  "endpoints": [
    {
      "endpointId": "FEAT-YYYYMMDD-001-ENDPOINT-001", // Unique endpoint ID
      "path": "exact route implementation",
      "handler": "function reference",
      "tests": "API test coverage",
      "security": "auth and validation passed"
    }
  ],
  "utilities": [
    {
      "utilityId": "FEAT-YYYYMMDD-001-UTIL-001", // Unique utility ID
      "name": "utility function name",
      "exports": "defined interface"
    }
  ],
  "performance": "response time benchmarks",
  "tracking": {
    "originalFeatureId": "FEAT-YYYYMMDD-001",
    "validationChain": ["Backend Agent"]
  }
}
```

### **7. Integration Agent → Testing Agent**

**Handoff Boundary**: System Assembly
- **Receives**: All implementation artifacts
- **Delivers**: `integration-package.json` (deployment-ready system)
- **Responsibility End**: Working system, not production deployment
- **Validation**: Must pass integration tests and security validation

**Required Handoff Contents**:
```json
{
  "featureId": "FEAT-YYYYMMDD-001", // MUST match original feature ID
  "integrationId": "FEAT-YYYYMMDD-001-INTEGRATION-001", // Unique integration ID
  "environment": "docker compose setup",
  "tests": "integration test suite",
  "validation": "HT-Validation report",
  "performance": "end-to-end benchmarks",
  "tracking": {
    "originalFeatureId": "FEAT-YYYYMMDD-001",
    "validationChain": ["Integration Agent"]
  }
}
```

### **8. Testing Agent → Integration Agent**

**Handoff Boundary**: Quality Assurance
- **Receives**: `integration-package.json`
- **Delivers**: `test-results.json` (quality validation)
- **Responsibility End**: Test results and recommendations
- **Validation**: All quality gates must pass

**Required Handoff Contents**:
```json
{
  "featureId": "FEAT-YYYYMMDD-001", // MUST match original feature ID
  "testReportId": "FEAT-YYYYMMDD-001-TEST-001", // Unique test report ID
  "coverage": {
    "unit": "percentage coverage",
    "integration": "api coverage",
    "e2e": "critical flows"
  },
  "performance": "load test results",
  "security": "vulnerability scan",
  "accessibility": "WCAG compliance",
  "tracking": {
    "originalFeatureId": "FEAT-YYYYMMDD-001",
    "validationChain": ["Testing Agent"]
  }
}
```

## 🔒 Handoff Validation Checkpoints

### **Pre-Handoff Requirements**
Each agent must complete these before handoff:

1. **Configuration Validation**
   - All inputs validated against expected schema
   - Dependencies clearly documented
   - Breaking changes identified and communicated

2. **Quality Gates**
   - Unit tests: 80%+ coverage
   - Performance: meets defined budgets
   - Security: passed vulnerability scans
   - Accessibility: WCAG 2.1 AA compliance

3. **Documentation**
   - Clear handoff documentation provided
   - Migration instructions if applicable
   - Known limitations documented

### **Post-Handoff Responsibilities**
Once handoff is complete:

- **Receiving Agent**: Responsible for all downstream decisions
- **Handing-off Agent**: No further changes without explicit request
- **Integration Agent**: Resolves any conflicts between handoffs

## 📋 Handoff Protocol Steps

### **Step 1: Preparation**
```bash
# Agent creates handoff package
npm run validate:handoff
npm run test:agent
npm run build:agent-bundle
```

### **Step 2: Validation**
```bash
# HT-Validation Agent reviews
npm run validate:cross-agent
npm run check:dependencies
npm run verify:constraints
```

### **Step 3: Acceptance**
```bash
# Receiving agent accepts handoff
npm run accept:handoff
npm run integrate:agent-output
```

### **Step 4: Confirmation**
```bash
# Integration agent confirms
npm run confirm:integration
npm run test:handoff-completeness
```

## 🚨 Boundary Violations

### **Strictly Forbidden**
- **Cross-layer dependencies**: UI agent cannot reference database schema
- **Implementation assumptions**: API agent cannot assume frontend framework
- **Direct communication**: Agents must use configuration files only
- **Breaking changes**: Must maintain backward compatibility

### **Violation Detection**
- **Automated scanning**: Detects cross-layer references
- **Configuration drift**: Monitors for unauthorized changes
- **Dependency analysis**: Ensures clean separation
- **Integration testing**: Validates boundary integrity

## 📊 Handoff Metrics

### **Quality Indicators**
- **Handoff Success Rate**: % of successful handoffs without rework
- **Integration Time**: Time from handoff to integration
- **Conflict Resolution**: Number of cross-agent conflicts
- **Performance Impact**: Bundle size and response time changes

### **Monitoring Dashboard**
```typescript
// utils/handoff/monitoring.ts
export const handoffMetrics = {
  trackHandoff: (from: Agent, to: Agent, featureId: string) => {
    // Log handoff event
    // Track success/failure
    // Monitor performance impact
  },
  
  validateBoundaries: () => {
    // Check for cross-layer violations
    // Verify configuration integrity
    // Ensure additive changes only
  }
}
```

## 🔧 Emergency Procedures

### **Handoff Failure Protocol**
1. **Immediate**: Revert to last known good state
2. **Analysis**: Identify root cause of failure
3. **Communication**: Notify all affected agents
4. **Resolution**: Implement fix with approval
5. **Validation**: Re-run full validation suite

### **Rollback Strategy**
- **Feature-level**: Rollback individual feature
- **Agent-level**: Revert specific agent output
- **System-level**: Full system rollback
- **Configuration**: Reset to stable configuration

## 🆔 Unique Feature ID System

### **ID Generation Standards**

**Format**: `FEAT-YYYYMMDD-NNN`
- `FEAT`: Fixed prefix for features
- `YYYYMMDD`: Date when feature was specified
- `NNN`: Sequential number starting from 001

**Example**: `FEAT-20240813-001` (first feature on Aug 13, 2024)

### **Downstream ID Propagation**

Every artifact must include the original feature ID and generate unique IDs:

```json
{
  "featureId": "FEAT-20240813-001",
  "componentId": "FEAT-20240813-001-COMP-001",
  "endpointId": "FEAT-20240813-001-API-001",
  "migrationId": "FEAT-20240813-001-MIGRATION-001",
  "tracking": {
    "originalFeatureId": "FEAT-20240813-001",
    "validationChain": ["Agent1", "Agent2", "Agent3"]
  }
}
```

### **Validation Agent Tracking**

The HT-Validation Agent uses these IDs to:

1. **Cross-reference components**: Match UI components to API endpoints
2. **Verify completeness**: Ensure all required components exist
3. **Detect gaps**: Identify missing implementations
4. **Track lineage**: Follow feature through entire pipeline

### **ID Validation Rules**

- **Must propagate**: Original feature ID must appear in all downstream artifacts
- **Must be unique**: Each artifact gets its own unique ID
- **Must be consistent**: Same feature across all agents uses same base ID
- **Must be traceable**: Validation chain shows agent progression

### **Downstream ID Patterns**

| Agent | ID Pattern | Example |
|-------|------------|---------|
| UI/UX | `FEAT-YYYYMMDD-NNN-COMP-XXX` | `FEAT-20240813-001-COMP-001` |
| API Contract | `FEAT-YYYYMMDD-NNN-API-XXX` | `FEAT-20240813-001-API-001` |
| Database | `FEAT-YYYYMMDD-NNN-TABLE-XXX` | `FEAT-20240813-001-TABLE-001` |
| Frontend | `FEAT-YYYYMMDD-NNN-COMP-XXX` | `FEAT-20240813-001-COMP-001` |
| Backend | `FEAT-YYYYMMDD-NNN-ENDPOINT-XXX` | `FEAT-20240813-001-ENDPOINT-001` |
| Integration | `FEAT-YYYYMMDD-NNN-INTEGRATION-XXX` | `FEAT-20240813-001-INTEGRATION-001` |
| Testing | `FEAT-YYYYMMDD-NNN-TEST-XXX` | `FEAT-20240813-001-TEST-001` |

### **Validation Check Script**

```typescript
// utils/validation/feature-tracking.ts
export const validateFeatureIds = (artifacts: any[]) => {
  const featureId = artifacts[0]?.featureId;
  
  return artifacts.every(artifact => 
    artifact.featureId === featureId &&
    artifact.tracking.originalFeatureId === featureId
  );
};

export const traceFeatureLineage = (featureId: string) => {
  // Return complete chain of artifacts for this feature
  return getAllArtifacts().filter(a => a.featureId === featureId);
};
```

## 📚 Documentation Requirements

### **Per-Handoff Documentation**
Each agent must provide:

1. **Handoff Summary**: What was delivered
2. **Configuration Changes**: Exact modifications made
3. **Known Issues**: Any limitations or concerns
4. **Migration Guide**: How to integrate changes
5. **Performance Impact**: Bundle/API/database impact
6. **Feature ID**: Original feature ID being implemented
7. **Generated IDs**: All unique IDs created during implementation

### **Living Documentation**
- **Feature mapping**: Track which agent owns what using feature IDs
- **Version history**: Log of all handoff events with IDs
- **Dependency graph**: Visual representation of agent relationships via IDs
- **Performance baseline**: Track changes over time by feature ID
- **Validation reports**: HT-Validation Agent findings by feature ID

---

**⚠️ CRITICAL REMINDERS:**

- **No agent may exceed their boundary** without explicit approval
- **All handoffs must be validated** by HT-Validation Agent
- **Additive changes only** - never replace existing configurations
- **Performance budgets enforced** at every handoff
- **Security scans required** before any integration
- **Rollback plan required** for all changes

**✅ APPROVAL REQUIRED FOR:**
- Cross-layer dependencies
- Breaking configuration changes
- Performance budget modifications
- New agent introduction
- Emergency handoff procedures