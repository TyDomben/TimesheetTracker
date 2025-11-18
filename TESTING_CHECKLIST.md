# Testing Checklist

Use this checklist to verify all features are working correctly.

## Pre-Testing Setup
- [ ] `.env` file exists and is populated with test data
- [ ] `npm install` completed successfully
- [ ] `npm start` runs without errors
- [ ] App opens at http://localhost:3000
- [ ] No console errors on initial load

## Core Functionality Tests

### 1. Form Input Tests
- [ ] Can enter name in "Your Name" field
- [ ] Start date picker shows calendar
- [ ] Can select a date from date picker
- [ ] Period dropdown shows 3 options (Weekly, Bi-weekly, Monthly)
- [ ] Can select each period option
- [ ] Timesheet grid appears after selecting period
- [ ] Timesheet shows correct number of days (7, 14, or 30)

### 2. Timesheet Grid Tests
- [ ] Weekends are highlighted (grey background)
- [ ] Weekdays default to 8 hours
- [ ] Weekends default to 0 hours
- [ ] Can click and edit any hour field
- [ ] Hour values accept decimal numbers (e.g., 7.5)
- [ ] Hour values reject negative numbers
- [ ] Hour values max out at 24
- [ ] Total hours updates in real-time as you edit
- [ ] Edited hours persist when switching between days

### 3. Invoice Preview Tests
- [ ] Preview shows "fill in form" message when incomplete
- [ ] Preview appears after form is complete
- [ ] Invoice number shows in format INV-0001
- [ ] Company name appears from .env file
- [ ] Company address appears from .env file
- [ ] Client name appears from .env file
- [ ] Service provider name matches your input
- [ ] Period label is correct (Weekly/Bi-weekly/Monthly)
- [ ] Timesheet table shows all days
- [ ] Each row shows: date, day, hours, rate, amount
- [ ] Subtotal calculates correctly (total hours × rate)
- [ ] Total amount matches subtotal
- [ ] Payment terms display from .env

### 4. Export Functionality Tests

#### PDF Export
- [ ] "Export Invoice" button is disabled when form incomplete
- [ ] "Export Invoice" button is enabled when form complete
- [ ] Clicking button shows dropdown menu
- [ ] Menu has 3 options: PDF, CSV, Print
- [ ] Selecting PDF downloads a file
- [ ] PDF filename format: INV-XXXX_YourName.pdf
- [ ] PDF opens and displays correctly
- [ ] PDF contains all invoice information
- [ ] PDF table is properly formatted
- [ ] PDF shows company info in header
- [ ] PDF shows totals at bottom

#### CSV Export
- [ ] Selecting CSV downloads a file
- [ ] CSV filename format: INV-XXXX_YourName.csv
- [ ] CSV opens in spreadsheet software
- [ ] CSV contains all invoice details
- [ ] CSV data is properly structured
- [ ] CSV includes company and client info
- [ ] CSV includes timesheet table
- [ ] CSV includes totals

#### Print Option
- [ ] Selecting Print opens browser print dialog
- [ ] Print preview shows invoice correctly
- [ ] Can print or save as PDF from dialog

### 5. Invoice Numbering Tests
- [ ] First invoice gets number INV-0001
- [ ] Second invoice gets number INV-0002
- [ ] Numbers increment sequentially
- [ ] Invoice numbers persist after page refresh
- [ ] Each export gets a unique number
- [ ] Previewing doesn't increment number

### 6. Invoice History Tests
- [ ] "Invoice History" tab shows count (e.g., "Invoice History (0)")
- [ ] After first export, count updates to (1)
- [ ] Switching to History tab shows exported invoices
- [ ] Each invoice shows: number, name, date, period, hours, amount
- [ ] Invoices are sorted newest first
- [ ] Can view an old invoice (loads into form)
- [ ] Can duplicate an invoice (creates new with today's date)
- [ ] Can delete an invoice (removes from list)
- [ ] Invoice count updates after deletion
- [ ] History persists after page refresh

### 7. Clear/Reset Tests
- [ ] "Clear & Start New" button exists
- [ ] Clicking shows confirmation dialog
- [ ] Dialog shows warning if hours > 0
- [ ] Dialog shows hour count in warning
- [ ] Clicking "Cancel" keeps data
- [ ] Clicking "Clear" resets all fields
- [ ] Timesheet grid disappears after clear
- [ ] Preview shows "fill in form" message after clear

### 8. Data Persistence Tests
- [ ] Entering name and refreshing page keeps name
- [ ] Entering hours and refreshing page keeps hours
- [ ] Creating invoice history and refreshing keeps history
- [ ] Invoice numbers persist across sessions
- [ ] Clearing localStorage resets all data

### 9. UI/UX Tests
- [ ] Layout is responsive (try resizing window)
- [ ] Form and preview are side-by-side on desktop
- [ ] UI adapts for mobile (stacks vertically)
- [ ] All buttons have clear labels
- [ ] All buttons show correct icons
- [ ] Hover states work on buttons
- [ ] Tab key navigates through form fields
- [ ] Enter key submits hour values
- [ ] Loading states appear during operations
- [ ] Success feedback after export

### 10. Edge Cases & Error Handling
- [ ] Can't export without name
- [ ] Can't export without period
- [ ] Can't export with empty timesheet
- [ ] Entering 0 hours for all days shows $0.00 total
- [ ] Entering very large hours (e.g., 100) works
- [ ] Special characters in name don't break export
- [ ] Very long names don't break layout
- [ ] Future dates work as start date
- [ ] Past dates work as start date

### 11. Configuration Tests (.env)
- [ ] Changing COMPANY_NAME updates in preview
- [ ] Changing HOURLY_RATE updates calculations
- [ ] Changing INVOICE_PREFIX changes invoice numbers
- [ ] Changing client info updates in preview
- [ ] Missing .env values show defaults
- [ ] Invalid hourly rate (non-number) falls back to default

### 12. Browser Compatibility
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge
- [ ] Works on mobile browsers

## Production Build Tests
- [ ] `npm run build` completes without errors
- [ ] Build folder is created
- [ ] Static files are generated
- [ ] Build size is reasonable (< 1MB gzipped)
- [ ] No warnings in build output

## Performance Tests
- [ ] App loads in < 3 seconds
- [ ] Hour inputs respond instantly
- [ ] Preview updates in real-time
- [ ] PDF generation completes in < 5 seconds
- [ ] CSV export completes instantly
- [ ] Switching tabs is smooth
- [ ] No lag when entering data
- [ ] History list loads quickly (even with 50+ invoices)

## Accessibility Tests
- [ ] Can navigate entire form with keyboard only
- [ ] Tab order is logical
- [ ] All interactive elements are focusable
- [ ] Focus indicators are visible
- [ ] Labels are associated with inputs
- [ ] Buttons have descriptive text/aria-labels
- [ ] Color contrast meets WCAG standards
- [ ] Works with screen reader (basic test)

## Security Tests
- [ ] .env file is in .gitignore
- [ ] No sensitive data in console logs
- [ ] No XSS vulnerabilities in user input
- [ ] localStorage data is namespaced properly
- [ ] No API keys or secrets in client code

## Documentation Tests
- [ ] README is complete and accurate
- [ ] Installation steps work from scratch
- [ ] All examples in docs are correct
- [ ] Links in README work
- [ ] QUICKSTART guide is accurate
- [ ] Troubleshooting section is helpful
- [ ] Environment variable docs are clear

## Final Verification
- [ ] App works for complete user journey (setup → invoice → export)
- [ ] No console errors during normal use
- [ ] No console warnings during normal use
- [ ] All features from README are implemented
- [ ] Code is clean and well-commented
- [ ] Project is ready for production use

---

**Testing Status:**
- Total Tests: ~120+
- Passed: ___
- Failed: ___
- Blocked: ___
- Date Tested: ___
- Tested By: ___

**Notes:**
_Add any issues found or improvements needed here_
