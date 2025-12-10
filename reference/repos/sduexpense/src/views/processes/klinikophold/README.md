# Klinikophold Process

## Overview
The Klinikophold process handles expense reporting for clinic stays by students at SDU (University of Southern Denmark). This is a multi-step form process that collects personal information, trip details, expense line items with attachments, and submits them for approval.

## Architecture
This module follows the modular architecture pattern established by the `externals` process. All code is organized under `src/views/processes/klinikophold/` with clear separation of concerns.

## Directory Structure

```
klinikophold/
├── index.tsx                      # Main entry point / orchestrator
├── config.ts                      # Page structure & field configurations
├── types.ts                       # TypeScript interfaces & types
├── README.md                      # This file
│
├── api/                           # API layer
│   └── klinikopholdApi.ts        # API calls, formulas, data fetching
│
├── components/                    # Reusable UI components
│   ├── modals.ts                 # Modal dialogs
│   ├── PDFGuideViewer.tsx        # PDF guide viewer
│   └── UploadComponent.tsx       # File upload component
│
├── steps/                         # Step components
│   ├── index.ts                  # Export all steps
│   ├── Step1PersonalInfo.tsx     # Personal information form
│   ├── Step2TripDetails.tsx      # Trip details (dates, cities)
│   ├── Step3GuideInstructions.tsx # PDF guide with checkbox
│   ├── Step4Expenses.tsx         # Expense list management
│   └── Step5ReviewSubmit.tsx     # Review & submit
│
├── utils/                         # Utility functions
│   ├── fieldHelpers.ts           # Field validation helpers
│   ├── formatters.ts             # Data formatting utilities
│   ├── stepHandlers.ts           # Step navigation handlers
│   └── validators.ts             # Validation logic
│
└── hooks/                         # Custom React hooks (empty for now)
```

**Note:** All dependencies are now internal to the `klinikophold/` module. No external shared files are used.

---

## Key Files
```

## Key Files

### `index.tsx` - Main Orchestrator
The entry point that:
1. Creates the page structure
2. Builds all step sections
3. Registers steps with the Steps component
4. Fetches initial data
5. Returns the configured section

### `config.ts` - Configuration Layer
Defines the entire page structure including:
- All form fields with their configurations
- Step sections
- Conditions and validation hooks
- Default values and constants

### `types.ts` - Type Definitions
Contains TypeScript interfaces for:
- `KlinikopholdPageStructure` - The main page structure
- `ExpenseItem` - UI format for expense items
- `ExpenseApiPayload` - API format for expense items
- `DataObject` - API response structure
- `KontoStreng` - Account string structure

### `api/klinikopholdApi.ts` - API Layer
Handles all API interactions:
- `createFormula()` - Main save formula (PUT)
- `createSubmitFormula()` - Submit formula (PUT /submit)
- `createNewFormula()` - Create new record (POST)
- `getInitialData()` - Fetch existing data (GET)
- `restartFlow()` - Restart with new record

**IMPORTANT:** All API calls and mappings are preserved exactly as they were in the original implementation.

## Process Flow

### Step 1: Personal Information
- Collects CPR number, name, address, city, postal code
- Includes hidden fields for backend configuration (underkonto, analysenummer, etc.)
- Validates CPR format and required fields

### Step 2: Trip Details
- Education/program selection (dropdown)
- City names where clinic took place
- Date range (week picker) for clinic stay
- Validates all fields are filled

### Step 3: Guide Instructions
- Displays PDF guide for expense documentation
- Requires checkbox confirmation that guide was read
- Cannot proceed until checkbox is checked

### Step 4: Expenses
- List management for expense line items
- Add/edit/delete expense rows
- Categories: Train tickets, Bus tickets, Mileage, Accommodation, Hotel
- File upload for each expense (receipts, invoices)
- Validates that each expense has date, amount, category, and attachment
- Information alerts for different expense types

### Step 5: Review & Submit
- Final review of all entered data
- Submit button that calls two endpoints:
  1. Save formula (PUT to update)
  2. Complete formula (PUT to /complete)
- Three states: Ready, Success, Fail
- Success state prevents further editing

## API Endpoints

### GET `/RejseAfregning`
Fetches existing expense reports for the user.

### POST `/RejseAfregning`
Creates a new expense report record.

### PUT `/RejseAfregning/{id}`
Updates an existing expense report (auto-save).

### PUT `/RejseAfregning/{id}/complete`
Marks the expense report as complete and submitted.

### POST/DELETE `/RejseAfregning/{id}/udgiftpost/{expenseId}/attachment`
Upload or delete attachments for expense line items.

## URL Parameters
The process expects these URL parameters:
- `godkender` - Approver email
- `underkonto` - Sub-account code
- `omkostningsted` - Cost center
- `analysenummer` - Analysis number
- `formaal` - Purpose code
- `projektnummer` - Project number
- `omkostningsted2` - Secondary cost center
- `branch` - Branch code
- `department` - Department code

Missing parameters will trigger an alert.

## Data Mappings

### UI to API (formatRecordToUdgiftspost)
```typescript
{
  id: record.id === '' ? null : record.id,
  dato: record.date,
  kategori: record.category ?? '2',
  bemærkninger: record.text,
  valuta: record.currency ?? '2',
  beløb: record.amount,
  attachments: record.upload
}
```

### API to UI (formatUdgiftspost)
```typescript
{
  id: apiData.id,
  date: apiData.dato,
  text: apiData.bemærkninger ?? '',
  category: apiData.kategori,
  amount: apiData.beløb,
  upload: apiData.attachments
}
```

## Validation Rules

### Step 1
- CPR must be valid Danish CPR format
- Name, address, city, and postal code are required

### Step 2
- City name(s) required
- Start week and end week must be valid dates

### Step 3
- Checkbox must be checked (value === 1)

### Step 4
- At least one expense row required
- Each expense must have:
  - Valid date
  - Amount > 0
  - Category selected
  - At least one attachment

## State Management
- Form state is stored in the `page` object
- Fields are bound via `.key()` method
- Auto-save on field changes via formula
- Status stored in `main.$store()`
- Completed forms are read-only

## Development Guidelines

### Adding a New Field
1. Add to `types.ts` in appropriate interface
2. Add to `config.ts` in `createPageStructure()`
3. Add to relevant step file
4. Update validators if needed
5. Update API mappings if needed

### Adding a New Step
1. Create `StepX[Name].tsx` in `steps/`
2. Export from `steps/index.ts`
3. Import in `index.tsx`
4. Call step function to build section
5. Register with `page.steps.add()`
6. Add validation to `validators.ts`

### Modifying API Calls
All API modifications should be done in `api/klinikopholdApi.ts`. Do not modify:
- Endpoint URLs
- Request/response mappings
- Header configurations

Unless explicitly required by backend changes.

## Testing
- Test each step independently
- Test full workflow end-to-end
- Test with existing data (edit mode)
- Test with no data (create mode)
- Test with completed status (read-only mode)
- Test file upload/download/delete
- Test validation on all steps
- Test form submission success/failure scenarios

## Known Limitations
- Maximum 10 expense rows per report
- File upload types: .doc, .docx, .xls, .xlsx, .pdf, .png, .jpg, .jpeg
- File names truncated to 40 characters in display
- Requires all URL parameters to be present

## Maintenance Notes
- This refactored structure was created on October 8, 2025
- Original file: `src/views/processes/klinikophold.tsx` (382 lines)
- All functionality preserved from original implementation
- API calls and mappings remain unchanged
- Shared utilities in `/processes/` are still used: `fieldchangers.ts`, `onclickers.ts`

---

**For questions or issues, contact the development team.**
