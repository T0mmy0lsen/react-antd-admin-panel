# Questions & Clarifications - React-Antd-Admin-Panel v2

**Last Updated:** December 9, 2025  
**Status:** Initial Setup

## Project Scope Questions

### 1. Package Location & Access
**Priority:** HIGH  
**Question:** Where is the react-antd-admin-panel v1 package located? (NPM registry, GitHub, private repo?)  
**Context:** Need access to source code for analysis  
**Status:** 🟢 ANSWERED

**Answer:** Package is in NPM registry. Git repo exists but may be out of sync with published version.  
**Date Answered:** December 9, 2025  
**Impact:** Can fetch package from NPM for analysis. Will use NPM version as source of truth.

### 2. Projects Using the Package
**Priority:** HIGH  
**Question:** Which specific projects have used and extended react-antd-admin-panel?  
**Context:** Need to identify all implementations for analysis  
**Status:** 🟡 IN PROGRESS

**Partial Answer:** 
- **sduexpense** (07-sduexpense) - Newest implementation with copy/pasted evolved version
- **Older projects** - Use package functionality more extensively (to be added to /reference/)
- Mix of NPM package usage and copy/pasted versions  
**Date Answered:** December 9, 2025  
**Impact:** Will analyze both NPM-based and evolved copy/pasted implementations. Older extensive usage will provide more patterns.

**Action:** Waiting for project references to be added to /reference/ folder

### 3. Version 1 Documentation
**Priority:** MEDIUM  
**Question:** Is there existing documentation for v1 (README, API docs, examples)?  
**Context:** Will speed up discovery process  
**Status:**  OPEN

### 4. Breaking Changes Tolerance
**Priority:** MEDIUM  
**Question:** What's the tolerance for breaking changes in v2?  
**Options:**
- Full backward compatibility required
- Major version bump acceptable with migration guide
- Clean break if justified  
**Status:**  OPEN

### 5. Target React/Ant Design Versions
**Priority:** MEDIUM  
**Question:** What React and Ant Design versions should v2 target?  
**Context:** Affects available features and patterns  
**Status:**  OPEN

## Discovery Planning

### 6. Discovery Session Format
**Priority:** LOW  
**Question:** Should discovery be done:
- All at once (comprehensive deep dive)
- Incrementally (package  projects  consolidation)
- Interactively (with stakeholder input)  
**Status:**  OPEN

---

## Question Template
`markdown
### [Number]. [Question Title]
**Priority:** HIGH|MEDIUM|LOW
**Question:** [Detailed question]
**Context:** [Why this matters]
**Status:**  OPEN |  IN PROGRESS |  ANSWERED

**Answer:** [When answered]
**Date Answered:** [Date]
**Impact:** [How this affects project]
`

