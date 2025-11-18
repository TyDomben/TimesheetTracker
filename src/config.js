/**
 * Configuration utility for Timesheet Tracker
 * Centralizes all environment variable access and provides utility functions
 */

export const config = {
  // Company Information
  company: {
    name: process.env.REACT_APP_COMPANY_NAME || 'Your Company Name',
    addressLine1: process.env.REACT_APP_COMPANY_ADDRESS_LINE1 || 'Your Address',
    addressLine2: process.env.REACT_APP_COMPANY_ADDRESS_LINE2 || 'City, State ZIP',
    phone: process.env.REACT_APP_COMPANY_PHONE || '(555) 123-4567',
    email: process.env.REACT_APP_COMPANY_EMAIL || 'your.email@company.com',
  },

  // Client Information (default client)
  client: {
    name: process.env.REACT_APP_CLIENT_NAME || 'Client Company Name',
    addressLine1: process.env.REACT_APP_CLIENT_ADDRESS_LINE1 || 'Client Address',
    addressLine2: process.env.REACT_APP_CLIENT_ADDRESS_LINE2 || 'Client City, State ZIP',
    contact: process.env.REACT_APP_CLIENT_CONTACT || 'Client Contact Name',
  },

  // Billing Information
  billing: {
    hourlyRate: parseFloat(process.env.REACT_APP_HOURLY_RATE) || 75,
    jobTitle: process.env.REACT_APP_JOB_TITLE || 'Software Development',
    paymentTerms: process.env.REACT_APP_PAYMENT_TERMS || 'Net 30',
  },

  // Invoice Settings
  invoice: {
    prefix: process.env.REACT_APP_INVOICE_PREFIX || 'INV',
  },
}

/**
 * Generates the next invoice number with auto-incrementing
 * Format: {PREFIX}-{NUMBER} (e.g., INV-0001, INV-0002, etc.)
 *
 * The invoice number is stored in localStorage and increments with each call.
 * This ensures unique, sequential invoice numbers that persist across sessions.
 *
 * @returns {string} The next invoice number (e.g., "INV-0001")
 */
export const generateInvoiceNumber = () => {
  const lastNumber = localStorage.getItem('lastInvoiceNumber')
  const nextNumber = lastNumber ? parseInt(lastNumber) + 1 : 1
  localStorage.setItem('lastInvoiceNumber', nextNumber.toString())
  return `${config.invoice.prefix}-${String(nextNumber).padStart(4, '0')}`
}

/**
 * Calculates the total amount for an invoice based on hours and hourly rate
 *
 * @param {number} totalHours - Total hours worked
 * @returns {number} Total amount to bill
 */
export const calculateTotalAmount = (totalHours) => {
  return totalHours * config.billing.hourlyRate
}
