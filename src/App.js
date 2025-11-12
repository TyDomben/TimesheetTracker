import React, { useState, useEffect } from 'react'
import {
  Container,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Grid,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { Print, Clear } from '@mui/icons-material'
import { config, generateInvoiceNumber, calculateTotalAmount } from './config'

function App() {
  // POLISH OPPORTUNITY #1: Input Flexibility
  // Currently we only support "hours per day" which is uniform across all days.
  // We could enhance this to allow:
  // - Individual hour entry per day (edit each day separately)
  // - Import hours from CSV/JSON
  // - Copy/paste timesheet data
  // - Quick presets (full-time: 40hrs/week, part-time: 20hrs/week, etc.)
  const [formData, setFormData] = useState({
    name: '',
    period: '',
    hoursPerDay: 8,
  })

  // POLISH OPPORTUNITY #2: Enhanced Date Management
  // Instead of just calculated dates, we could store:
  // - Start date picker (instead of assuming "today")
  // - End date picker (for custom ranges)
  // - Exclude weekends/holidays option
  // - Individual day editing (click to edit hours for specific day)
  const [calculatedDates, setCalculatedDates] = useState([])
  const [totalHours, setTotalHours] = useState(0)

  // POLISH OPPORTUNITY #3: Enhanced Data Persistence
  // Currently we only save the current timesheet to localStorage.
  // We could enhance this to:
  // - Save multiple invoices (invoice history with auto-incrementing IDs)
  // - Export to JSON file (download backup of all data)
  // - Import from JSON file (restore from backup)
  // - Auto-save drafts with timestamps
  // - Sync to cloud storage (future: Firebase, Supabase, etc.)

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('timesheetData')
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      setFormData(parsedData.formData || formData)
      setCalculatedDates(parsedData.calculatedDates || [])
      setTotalHours(parsedData.totalHours || 0)
    }
  }, [])

  // Save data to localStorage whenever form data changes
  useEffect(() => {
    const dataToSave = {
      formData,
      calculatedDates,
      totalHours,
    }
    localStorage.setItem('timesheetData', JSON.stringify(dataToSave))
  }, [formData, calculatedDates, totalHours])

  const periodOptions = [
    { value: 'weekly', label: 'Weekly (7 days)', days: 7 },
    { value: 'biweekly', label: 'Bi-weekly (14 days)', days: 14 },
    { value: 'monthly', label: 'Monthly (30 days)', days: 30 },
  ]

  const calculateDates = (period, hoursPerDay) => {
    const selectedPeriod = periodOptions.find(p => p.value === period)
    if (!selectedPeriod) return []

    const dates = []
    const today = new Date()
    
    for (let i = 0; i < selectedPeriod.days; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push({
        date: date.toLocaleDateString(),
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        hours: hoursPerDay,
      })
    }
    
    return dates
  }

  const handleInputChange = (field, value) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)
    
    if (field === 'period' || field === 'hoursPerDay') {
      const dates = calculateDates(
        field === 'period' ? value : newFormData.period,
        field === 'hoursPerDay' ? value : newFormData.hoursPerDay
      )
      setCalculatedDates(dates)
      setTotalHours(dates.reduce((sum, day) => sum + day.hours, 0))
    }
  }

  // POLISH OPPORTUNITY #4: Enhanced Export & File Generation
  // Currently we only support browser print (which user can save as PDF).
  // We could add multiple export formats:
  // - PDF generation (using jsPDF or react-pdf) - no browser dependency
  // - CSV export (for spreadsheet software)
  // - Excel export (using xlsx library)
  // - Email template generator (formatted HTML for email)
  // - Multiple invoice formats/templates (modern, classic, minimal)
  // - Attach invoice to email directly (with email client integration)
  const handlePrint = () => {
    window.print()
  }

  // POLISH OPPORTUNITY #5: Smart Clear/Archive
  // Instead of just deleting data, we could:
  // - Archive completed invoices before clearing
  // - Confirm dialog before clearing (prevent accidental data loss)
  // - Quick "duplicate last invoice" to save time
  const handleClear = () => {
    setFormData({
      name: '',
      period: '',
      hoursPerDay: 8,
    })
    setCalculatedDates([])
    setTotalHours(0)
    localStorage.removeItem('timesheetData')
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Timesheet Tracker
        </Typography>
        
        <Grid container spacing={4}>
          {/* POLISH OPPORTUNITY #6: Enhanced Form Inputs
              We could add:
              - Date range picker (start/end date selection)
              - Client selector dropdown (save multiple clients, quick select)
              - Project/task description field
              - Notes/comments field for each invoice
              - Currency selector (USD, EUR, GBP, etc.)
              - Tax rate input (for locations that require tax)
          */}
          {/* Form Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Timesheet Details
            </Typography>

            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Your Name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                margin="normal"
                required
              />

              <FormControl fullWidth margin="normal" required>
                <InputLabel>Period</InputLabel>
                <Select
                  value={formData.period}
                  onChange={(e) => handleInputChange('period', e.target.value)}
                  label="Period"
                >
                  {periodOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* POLISH OPPORTUNITY #7: Replace with Editable Timesheet Grid
                  Instead of "hours per day", we could show a table where:
                  - Each row is a day with date, day of week, hours worked
                  - User can click any cell to edit individual day hours
                  - Add/remove days manually
                  - Drag to fill (like Excel)
                  - Quick actions: "Skip weekends", "Set all to 8", etc.
              */}
              <TextField
                fullWidth
                label="Hours per Day"
                type="number"
                value={formData.hoursPerDay}
                onChange={(e) => handleInputChange('hoursPerDay', parseFloat(e.target.value) || 0)}
                margin="normal"
                inputProps={{ min: 0, max: 24, step: 0.5 }}
                required
              />
            </Box>
            
            {/* POLISH OPPORTUNITY #8: Enhanced Action Buttons
                We could add more actions:
                - "Export as PDF" (direct download, no print dialog)
                - "Export as CSV" (open in Excel/Google Sheets)
                - "Export as JSON" (backup data)
                - "Copy Email Template" (formatted for email)
                - "Save to History" (archive this invoice)
                - "Send via Email" (integrate with email client)
                - Split button with dropdown for multiple export options
            */}
            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                startIcon={<Print />}
                onClick={handlePrint}
                disabled={!formData.name || !formData.period || calculatedDates.length === 0}
                fullWidth
              >
                Print Invoice
              </Button>

              <Button
                variant="outlined"
                startIcon={<Clear />}
                onClick={handleClear}
                fullWidth
              >
                Clear & Start New
              </Button>
            </Box>
          </Grid>

          {/* POLISH OPPORTUNITY #9: Enhanced Preview Features
              We could add:
              - Toggle between multiple invoice templates/themes
              - Live edit mode (click any field in preview to edit)
              - Preview for email template vs PDF vs print
              - Side-by-side comparison of different periods
              - Invoice validation warnings (missing info, unusual hours, etc.)
          */}
          {/* Invoice Preview Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Invoice Preview
            </Typography>
            
            {calculatedDates.length > 0 && formData.name && formData.period ? (
              <Paper variant="outlined" sx={{ p: 3 }}>
                {/* POLISH OPPORTUNITY #10: Smart Invoice Numbering
                    Current: Random timestamp-based number (regenerates on each render)
                    Better approach:
                    - Auto-increment based on invoice history (INV-001, INV-002, etc.)
                    - Persist last invoice number in localStorage
                    - Allow manual override
                    - Support different number formats (by client, by year, etc.)
                    - Show invoice date prominently
                */}
                {/* Invoice Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Box>
                    <Typography variant="h4" component="h1" gutterBottom>
                      INVOICE
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      {generateInvoiceNumber()}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="h6" gutterBottom>
                      {config.company.name}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {config.company.addressLine1}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {config.company.addressLine2}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {config.company.phone}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {config.company.email}
                    </Typography>
                  </Box>
                </Box>
                
                <Divider sx={{ my: 2 }} />
                
                {/* Bill To Section */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                  <Box>
                    <Typography variant="h6" gutterBottom>
                      Bill To:
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      {config.client.name}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {config.client.addressLine1}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {config.client.addressLine2}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      Attn: {config.client.contact}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body1" gutterBottom>
                      <strong>Service Provider:</strong> {formData.name}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Service:</strong> {config.billing.jobTitle}
                    </Typography>
                    <Typography variant="body1" gutterBottom>
                      <strong>Period:</strong> {periodOptions.find(p => p.value === formData.period)?.label}
                    </Typography>
                  </Box>
                </Box>
                
                {/* POLISH OPPORTUNITY #11: Interactive Timesheet Table
                    We could make this table interactive:
                    - Click to edit hours for individual days
                    - Color-code weekends vs weekdays
                    - Highlight days with 0 hours or unusual hours
                    - Add task/project description column
                    - Add notes column for each day
                    - Support different rates for different tasks
                    - Show running total as you scroll
                */}
                {/* Timesheet Table */}
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>Date</strong></TableCell>
                        <TableCell><strong>Day</strong></TableCell>
                        <TableCell align="right"><strong>Hours</strong></TableCell>
                        <TableCell align="right"><strong>Rate</strong></TableCell>
                        <TableCell align="right"><strong>Amount</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {calculatedDates.map((day, index) => (
                        <TableRow key={index}>
                          <TableCell>{day.date}</TableCell>
                          <TableCell>{day.day}</TableCell>
                          <TableCell align="right">{day.hours}</TableCell>
                          <TableCell align="right">${config.billing.hourlyRate}</TableCell>
                          <TableCell align="right">${(day.hours * config.billing.hourlyRate).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                
                <Divider sx={{ my: 2 }} />
                
                {/* Invoice Totals */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  <Box sx={{ minWidth: 200 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body1">Subtotal:</Typography>
                      <Typography variant="body1">${calculateTotalAmount(totalHours).toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body1">Tax (0%):</Typography>
                      <Typography variant="body1">$0.00</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="h6"><strong>Total:</strong></Typography>
                      <Typography variant="h6"><strong>${calculateTotalAmount(totalHours).toFixed(2)}</strong></Typography>
                    </Box>
                  </Box>
                </Box>
                
                {/* POLISH OPPORTUNITY #12: Enhanced Payment Information
                    We could add:
                    - Bank account details section (for wire transfers)
                    - Payment links (PayPal, Stripe, Venmo, etc.)
                    - QR code for quick payment
                    - Multiple payment options
                    - Late payment fee information
                    - Discount for early payment
                    - Payment instructions specific to client
                */}
                {/* Payment Terms */}
                <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                  <Typography variant="body2" gutterBottom>
                    <strong>Payment Terms:</strong> {config.billing.paymentTerms}
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    <strong>Total Hours:</strong> {totalHours} hours @ ${config.billing.hourlyRate}/hour
                  </Typography>
                </Box>
              </Paper>
            ) : (
              <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  Fill in the form to see your invoice preview
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  )
}

// POLISH OPPORTUNITY #13: Additional Features to Consider
//
// Invoice History & Management:
// - View all past invoices in a list/grid view
// - Search and filter invoices (by date, client, amount, status)
// - Mark invoices as paid/unpaid/overdue
// - Dashboard with analytics (total earned, hours worked, etc.)
//
// Data Export & Integration:
// - Batch export multiple invoices at once
// - Export invoice history as CSV for accounting software
// - Integration with QuickBooks, FreshBooks, or Xero
// - Automatic backup to cloud storage (Google Drive, Dropbox)
//
// Validation & Error Handling:
// - Form validation (email format, phone format, etc.)
// - Warning for unusual hours (>12 hours/day, 0 hours, etc.)
// - Prevent duplicate invoice numbers
// - Check for missing required fields before export
//
// User Experience:
// - Keyboard shortcuts (Ctrl+P for print, Ctrl+S for save, etc.)
// - Dark mode toggle
// - Multi-language support
// - Onboarding tutorial for first-time users
// - Undo/redo functionality
//
// Mobile Optimization:
// - Better mobile layout (stack form and preview vertically)
// - Touch-friendly controls for editing hours
// - Mobile-specific export options (share via WhatsApp, SMS, etc.)

export default App
