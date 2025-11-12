// Configuration utility for environment variables
// This centralizes all environment variable access
//
// POLISH OPPORTUNITY #14: Enhanced Configuration Management
// Current approach: Single static config from .env file
// Improvements:
// - Support multiple clients (array of client configs)
// - Support multiple company profiles (for contractors with multiple businesses)
// - Save/load configurations from JSON files
// - Import/export configuration backups
// - UI for editing configuration (instead of manual .env editing)
// - Validate configuration on load (check for missing fields)

export const config = {
  // Company Information
  company: {
    name: process.env.REACT_APP_COMPANY_NAME || 'Your Company Name',
    addressLine1: process.env.REACT_APP_COMPANY_ADDRESS_LINE1 || 'Your Address',
    addressLine2: process.env.REACT_APP_COMPANY_ADDRESS_LINE2 || 'City, State ZIP',
    phone: process.env.REACT_APP_COMPANY_PHONE || '(555) 123-4567',
    email: process.env.REACT_APP_COMPANY_EMAIL || 'your.email@company.com',
  },
  
  // Client Information (default)
  client: {
    name: process.env.REACT_APP_CLIENT_NAME || 'Client Company Name',
    addressLine1: process.env.REACT_APP_CLIENT_ADDRESS_LINE1 || 'Client Address',
    addressLine2: process.env.REACT_APP_CLIENT_ADDRESS_LINE2 || 'Client City, State ZIP',
    contact: process.env.REACT_APP_CLIENT_CONTACT || 'Client Contact Name',
  },
  
  // Billing Information
  billing: {
    hourlyRate: parseFloat(process.env.REACT_APP_HOURLY_RATE) || 50,
    jobTitle: process.env.REACT_APP_JOB_TITLE || 'Software Engineering',
    paymentTerms: process.env.REACT_APP_PAYMENT_TERMS || 'Net 30',
  },
  
  // Invoice Settings
  invoice: {
    prefix: process.env.REACT_APP_INVOICE_PREFIX || 'INV',
  },
}

// POLISH OPPORTUNITY #15: Smart Invoice Number Generation
// Current: Uses timestamp (regenerates on every render, not persistent)
// Better approach:
// - Store last invoice number in localStorage
// - Auto-increment: INV-001, INV-002, etc.
// - Support custom formats: INV-2024-001, CLIENT-001, etc.
// - Allow manual override when needed
// - Prevent duplicate invoice numbers
// - Reset counter yearly or monthly if desired
export const generateInvoiceNumber = () => {
  const timestamp = Date.now().toString().slice(-6)
  return `${config.invoice.prefix}-${timestamp}`
}

// POLISH OPPORTUNITY #16: Enhanced Calculation Utilities
// We could add more calculation helpers:
// - calculateTax(totalHours, taxRate)
// - calculateDiscount(amount, discountPercent)
// - calculateLateFee(amount, daysLate, feePercent)
// - calculateSubtotal with line items (different rates for different tasks)
// - Support for different billing methods (fixed price, milestone-based, etc.)
export const calculateTotalAmount = (totalHours) => {
  return totalHours * config.billing.hourlyRate
}
