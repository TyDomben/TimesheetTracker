// Configuration utility for environment variables
// This centralizes all environment variable access

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

// Helper function to generate invoice number
export const generateInvoiceNumber = () => {
  const timestamp = Date.now().toString().slice(-6)
  return `${config.invoice.prefix}-${timestamp}`
}

// Helper function to calculate total amount
export const calculateTotalAmount = (totalHours) => {
  return totalHours * config.billing.hourlyRate
}
