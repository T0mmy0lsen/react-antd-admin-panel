# Externals Process - Modular Architecture

## ✅ Phase 1, Day 1: COMPLETE!

This is the new **modular** structure for the externals expense reimbursement process.

---

## What's Been Built

### ✅ Foundation (Complete)
- [x] Folder structure created
- [x] TypeScript interfaces defined (`types.ts`)
- [x] Page configuration (`config.ts`)
- [x] Main process orchestrator (`index.tsx`)
- [x] Registered in `Process.tsx`

### ✅ Step 1: Personal Information (Complete)
- [x] Form fields: Name, Email, Phone, Address, City, Zip
- [x] Validation logic
- [x] Field change handlers

### ✅ Step 2: Bank Details (Complete)
- [x] IBAN input with validation
- [x] SWIFT/BIC code input
- [x] Account holder name
- [x] Currency selection
- [x] MOD-97 IBAN checksum validation

### ✅ Step 3: Project Details (Complete)
- [x] Project number (pre-filled from invite)
- [x] Contract number (pre-filled)
- [x] Approver (pre-filled)
- [x] Cost center (pre-filled)
- [x] Purpose textarea

### 🚧 Step 4: Godtgørelse (Placeholder)
- [ ] Editable list with expense types
- [ ] Distance calculator for km-godtgørelse
- [ ] File upload per row
- [ ] TODO: Implement in Phase 4

### 🚧 Step 5: Review & Submit (Basic)
- [x] Success/fail state machine
- [ ] TODO: Display full summary
- [ ] TODO: Real submission logic

### ✅ API Layer (Mock Ready)
- [x] `externalsApi.ts` - Main API calls (mock)
- [x] `inviteToken.ts` - Token validation (URL params)
- [x] `distanceApi.ts` - Distance calculator (mock)
- [x] `bankValidation.ts` - SWIFT lookup (mock)

### ✅ Utilities (Complete)
- [x] `validators.ts` - All validation functions
- [x] `formatters.ts` - Data formatters
- [x] `calculations.ts` - Amount calculations
- [x] `fieldHandlers.ts` - onChange handlers

---

## How to Test

### URL Format
```
http://localhost:3000/?type=externals&inviteToken=TEST123&email=external@example.com&projectNumber=P2025-001&contractNumber=C123&approver=manager@sdu.dk&costCenter=93200
```

### Test Steps
1. Navigate to URL above
2. Fill in Step 1 (Personal Info) - all fields required
3. Fill in Step 2 (Bank Details) - try these IBANs:
   - Valid: `DK50 0040 0440 1162 43` ✅
   - Invalid: `DK50 0040 0440 1162 44` ❌
4. Step 3 should be pre-filled from URL
5. Step 4 is placeholder (skip for now)
6. Step 5 will show submit button

---

## Next Steps (From Migration Plan)

### Phase 2: Bank Details Enhancement (Week 2)
- [ ] Real-time IBAN validation feedback (green/red indicator)
- [ ] Auto-fill bank name from SWIFT code
- [ ] Enhanced UI with visual feedback

### Phase 3: Distance Calculator (Week 3)
- [ ] Google Maps API integration
- [ ] Address autocomplete
- [ ] Distance calculation
- [ ] Manual override option

### Phase 4: Godtgørelse List (Week 4)
- [ ] Dynamic editable list
- [ ] Multiple godtgørelse types
- [ ] File upload per row
- [ ] Type-specific fields

### Phase 5: Review & Submit (Week 5)
- [ ] Full data summary
- [ ] Terms & conditions
- [ ] Real backend submission
- [ ] Email confirmation

---

## File Structure

```
externals/
├── index.tsx                    # Main entry point
├── config.ts                    # Configuration & page structure
├── types.ts                     # TypeScript interfaces
│
├── api/                         # API layer
│   ├── externalsApi.ts         # Main CRUD operations
│   ├── inviteToken.ts          # Token validation
│   ├── distanceApi.ts          # Distance calculations (mock)
│   └── bankValidation.ts       # SWIFT lookup (mock)
│
├── components/                  # Custom UI components (future)
│   └── index.ts
│
├── steps/                       # Step definitions
│   ├── Step1PersonalInfo.tsx   # ✅ Complete
│   ├── Step2BankDetails.tsx    # ✅ Complete
│   ├── Step3ProjectDetails.tsx # ✅ Complete
│   ├── Step4Godtgoerelse.tsx   # 🚧 Placeholder
│   └── Step5ReviewSubmit.tsx   # 🚧 Basic
│
└── utils/                       # Helper functions
    ├── validators.ts            # ✅ Complete
    ├── formatters.ts            # ✅ Complete
    ├── calculations.ts          # ✅ Complete
    └── fieldHandlers.ts         # ✅ Complete
```

---

## Development Notes

### Mock Data
All API calls are currently mocked. To connect to real backend:
1. Update `api/externalsApi.ts` - uncomment production code
2. Update `api/inviteToken.ts` - implement real token validation
3. Update `api/distanceApi.ts` - add Google Maps API key
4. Update `api/bankValidation.ts` - add SWIFT lookup service

### Validation
- **IBAN**: Full MOD-97 checksum validation implemented
- **SWIFT**: Pattern validation (8 or 11 characters)
- **Steps**: Each step validates before allowing navigation

### Styling
Uses same styling as klinikophold process:
- 54px padding
- Ant Design components
- Responsive layout

---

## Documentation

See project root `.docs/` folder for:
- `01-FRAMEWORK-ARCHITECTURE.md` - Framework overview
- `02-KLINIKOPHOLD-PATTERNS.md` - Reusable patterns
- `03-EXTERNALS-REQUIREMENTS.md` - Full requirements
- `04-EXTERNALS-ARCHITECTURE.md` - Architecture details
- `05-MIGRATION-PLAN.md` - Development roadmap
- `06-PO-USER-STORIES.md` - User stories
- `07-TECH-DECISIONS.md` - Technical decisions

---

## Contributors

- AI Assistant (BMad Master) - Initial implementation
- [Your Name] - To be updated

---

*Last updated: October 7, 2025*
*Status: Phase 1 Complete ✅ | Steps 1-3 Functional | Steps 4-5 Placeholder*
