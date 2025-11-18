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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  IconButton,
  Chip,
  Menu,
  MenuItem as MenuItemComponent,
  Tabs,
  Tab,
} from '@mui/material'
import {
  Print,
  Clear,
  Download,
  History,
  Delete,
  Visibility,
  PictureAsPdf,
  TableChart,
} from '@mui/icons-material'
import { format, addDays, parseISO } from 'date-fns'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { saveAs } from 'file-saver'
import { config } from './config'

function App() {
  const [formData, setFormData] = useState({
    name: '',
    period: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
  })
  const [timesheet, setTimesheet] = useState([])
  const [totalHours, setTotalHours] = useState(0)
  const [invoiceHistory, setInvoiceHistory] = useState([])
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false)
  const [currentTab, setCurrentTab] = useState(0)
  const [exportMenuAnchor, setExportMenuAnchor] = useState(null)

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('timesheetData')
    const savedHistory = localStorage.getItem('invoiceHistory')

    if (savedData) {
      const parsedData = JSON.parse(savedData)
      setFormData(parsedData.formData || {
        name: '',
        period: '',
        startDate: format(new Date(), 'yyyy-MM-dd'),
      })
      setTimesheet(parsedData.timesheet || [])
      setTotalHours(parsedData.totalHours || 0)
    }

    if (savedHistory) {
      setInvoiceHistory(JSON.parse(savedHistory))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Save current data to localStorage whenever it changes
  useEffect(() => {
    const dataToSave = {
      formData,
      timesheet,
      totalHours,
    }
    localStorage.setItem('timesheetData', JSON.stringify(dataToSave))
  }, [formData, timesheet, totalHours])

  // Save invoice history to localStorage
  useEffect(() => {
    localStorage.setItem('invoiceHistory', JSON.stringify(invoiceHistory))
  }, [invoiceHistory])

  const periodOptions = [
    { value: 'weekly', label: 'Weekly (7 days)', days: 7 },
    { value: 'biweekly', label: 'Bi-weekly (14 days)', days: 14 },
    { value: 'monthly', label: 'Monthly (30 days)', days: 30 },
  ]

  const getNextInvoiceNumber = () => {
    const lastNumber = localStorage.getItem('lastInvoiceNumber')
    const nextNumber = lastNumber ? parseInt(lastNumber) + 1 : 1
    localStorage.setItem('lastInvoiceNumber', nextNumber.toString())
    return `${config.invoice.prefix}-${String(nextNumber).padStart(4, '0')}`
  }

  const calculateTimesheet = (period, startDate) => {
    const selectedPeriod = periodOptions.find(p => p.value === period)
    if (!selectedPeriod) return []

    const dates = []
    const start = parseISO(startDate)

    for (let i = 0; i < selectedPeriod.days; i++) {
      const date = addDays(start, i)
      const dayOfWeek = date.getDay()
      // Default to 8 hours for weekdays, 0 for weekends
      const defaultHours = (dayOfWeek === 0 || dayOfWeek === 6) ? 0 : 8

      dates.push({
        date: format(date, 'yyyy-MM-dd'),
        displayDate: format(date, 'MMM dd, yyyy'),
        day: format(date, 'EEE'),
        hours: defaultHours,
        isWeekend: dayOfWeek === 0 || dayOfWeek === 6,
      })
    }

    return dates
  }

  const handleInputChange = (field, value) => {
    const newFormData = { ...formData, [field]: value }
    setFormData(newFormData)

    if (field === 'period' || field === 'startDate') {
      const dates = calculateTimesheet(
        field === 'period' ? value : newFormData.period,
        field === 'startDate' ? value : newFormData.startDate
      )
      setTimesheet(dates)
      updateTotalHours(dates)
    }
  }

  const handleHoursChange = (index, newHours) => {
    const updatedTimesheet = [...timesheet]
    updatedTimesheet[index].hours = parseFloat(newHours) || 0
    setTimesheet(updatedTimesheet)
    updateTotalHours(updatedTimesheet)
  }

  const updateTotalHours = (timesheetData) => {
    const total = timesheetData.reduce((sum, day) => sum + day.hours, 0)
    setTotalHours(total)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleExportPDF = () => {
    const doc = new jsPDF()
    const invoiceNumber = getNextInvoiceNumber()
    const invoiceDate = format(new Date(), 'MMM dd, yyyy')

    // Header
    doc.setFontSize(24)
    doc.text('INVOICE', 20, 20)

    doc.setFontSize(12)
    doc.text(invoiceNumber, 20, 30)
    doc.text(`Date: ${invoiceDate}`, 20, 37)

    // Company Info
    doc.setFontSize(10)
    doc.text(config.company.name, 140, 20)
    doc.text(config.company.addressLine1, 140, 26)
    doc.text(config.company.addressLine2, 140, 32)
    doc.text(config.company.phone, 140, 38)
    doc.text(config.company.email, 140, 44)

    // Client Info
    doc.setFontSize(12)
    doc.text('Bill To:', 20, 55)
    doc.setFontSize(10)
    doc.text(config.client.name, 20, 62)
    doc.text(config.client.addressLine1, 20, 68)
    doc.text(config.client.addressLine2, 20, 74)
    doc.text(`Attn: ${config.client.contact}`, 20, 80)

    // Service Info
    doc.text(`Service Provider: ${formData.name}`, 120, 62)
    doc.text(`Service: ${config.billing.jobTitle}`, 120, 68)
    const selectedPeriod = periodOptions.find(p => p.value === formData.period)
    doc.text(`Period: ${selectedPeriod?.label || ''}`, 120, 74)

    // Timesheet Table
    const tableData = timesheet.map(day => [
      day.displayDate,
      day.day,
      day.hours.toFixed(2),
      `$${config.billing.hourlyRate}`,
      `$${(day.hours * config.billing.hourlyRate).toFixed(2)}`
    ])

    autoTable(doc, {
      startY: 90,
      head: [['Date', 'Day', 'Hours', 'Rate', 'Amount']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [66, 66, 66] },
    })

    const finalY = doc.lastAutoTable.finalY + 10

    // Totals
    const subtotal = totalHours * config.billing.hourlyRate
    doc.setFontSize(10)
    doc.text('Subtotal:', 130, finalY)
    doc.text(`$${subtotal.toFixed(2)}`, 170, finalY)
    doc.text('Tax (0%):', 130, finalY + 6)
    doc.text('$0.00', 170, finalY + 6)

    doc.setFontSize(12)
    doc.setFont(undefined, 'bold')
    doc.text('Total:', 130, finalY + 15)
    doc.text(`$${subtotal.toFixed(2)}`, 170, finalY + 15)

    // Payment Terms
    doc.setFontSize(9)
    doc.setFont(undefined, 'normal')
    doc.text(`Payment Terms: ${config.billing.paymentTerms}`, 20, finalY + 25)
    doc.text(`Total Hours: ${totalHours.toFixed(2)} hours @ $${config.billing.hourlyRate}/hour`, 20, finalY + 31)

    // Save PDF
    doc.save(`${invoiceNumber}_${formData.name.replace(/\s+/g, '_')}.pdf`)

    // Save to history
    saveToHistory(invoiceNumber)
  }

  const handleExportCSV = () => {
    const invoiceNumber = getNextInvoiceNumber()

    // Create CSV content
    let csv = 'Timesheet Invoice\n\n'
    csv += `Invoice Number:,${invoiceNumber}\n`
    csv += `Date:,${format(new Date(), 'MMM dd, yyyy')}\n`
    csv += `Service Provider:,${formData.name}\n`
    csv += `Service:,${config.billing.jobTitle}\n`
    const selectedPeriod = periodOptions.find(p => p.value === formData.period)
    csv += `Period:,${selectedPeriod?.label || ''}\n\n`

    csv += 'Company Information\n'
    csv += `${config.company.name}\n`
    csv += `${config.company.addressLine1}\n`
    csv += `${config.company.addressLine2}\n`
    csv += `${config.company.phone}\n`
    csv += `${config.company.email}\n\n`

    csv += 'Bill To\n'
    csv += `${config.client.name}\n`
    csv += `${config.client.addressLine1}\n`
    csv += `${config.client.addressLine2}\n`
    csv += `Attn: ${config.client.contact}\n\n`

    csv += 'Timesheet Details\n'
    csv += 'Date,Day,Hours,Rate,Amount\n'

    timesheet.forEach(day => {
      const amount = day.hours * config.billing.hourlyRate
      csv += `${day.displayDate},${day.day},${day.hours},${config.billing.hourlyRate},${amount.toFixed(2)}\n`
    })

    const subtotal = totalHours * config.billing.hourlyRate
    csv += `\nSubtotal:,,,,${subtotal.toFixed(2)}\n`
    csv += `Tax (0%):,,,,0.00\n`
    csv += `Total:,,,,${subtotal.toFixed(2)}\n\n`
    csv += `Payment Terms:,${config.billing.paymentTerms}\n`
    csv += `Total Hours:,${totalHours.toFixed(2)} hours @ $${config.billing.hourlyRate}/hour\n`

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, `${invoiceNumber}_${formData.name.replace(/\s+/g, '_')}.csv`)

    // Save to history
    saveToHistory(invoiceNumber)
  }

  const saveToHistory = (invoiceNumber) => {
    const invoice = {
      id: Date.now(),
      invoiceNumber,
      date: format(new Date(), 'yyyy-MM-dd'),
      displayDate: format(new Date(), 'MMM dd, yyyy'),
      name: formData.name,
      period: periodOptions.find(p => p.value === formData.period)?.label || '',
      totalHours,
      totalAmount: (totalHours * config.billing.hourlyRate).toFixed(2),
      timesheet: [...timesheet],
    }

    setInvoiceHistory([invoice, ...invoiceHistory])
  }

  const handleClear = () => {
    setClearConfirmOpen(true)
  }

  const confirmClear = () => {
    setFormData({
      name: '',
      period: '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
    })
    setTimesheet([])
    setTotalHours(0)
    setClearConfirmOpen(false)
  }

  const deleteInvoice = (id) => {
    setInvoiceHistory(invoiceHistory.filter(inv => inv.id !== id))
  }

  const viewInvoice = (invoice) => {
    setFormData({
      name: invoice.name,
      period: periodOptions.find(p => p.label === invoice.period)?.value || '',
      startDate: invoice.timesheet[0]?.date || format(new Date(), 'yyyy-MM-dd'),
    })
    setTimesheet(invoice.timesheet)
    setTotalHours(invoice.totalHours)
    setCurrentTab(0)
  }

  const duplicateInvoice = (invoice) => {
    setFormData({
      name: invoice.name,
      period: periodOptions.find(p => p.label === invoice.period)?.value || '',
      startDate: format(new Date(), 'yyyy-MM-dd'),
    })
    const newTimesheet = calculateTimesheet(
      periodOptions.find(p => p.label === invoice.period)?.value || '',
      format(new Date(), 'yyyy-MM-dd')
    )
    setTimesheet(newTimesheet)
    updateTotalHours(newTimesheet)
    setCurrentTab(0)
  }

  const InvoicePreview = () => {
    if (!formData.name || !formData.period || timesheet.length === 0) {
      return (
        <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Fill in the form and generate timesheet to see your invoice preview
          </Typography>
        </Paper>
      )
    }

    const invoiceNumber = `${config.invoice.prefix}-${String(parseInt(localStorage.getItem('lastInvoiceNumber') || '0') + 1).padStart(4, '0')}`

    return (
      <Paper variant="outlined" sx={{ p: 3 }}>
        {/* Invoice Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              INVOICE
            </Typography>
            <Typography variant="h6" gutterBottom>
              {invoiceNumber}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {format(new Date(), 'MMM dd, yyyy')}
            </Typography>
          </Box>
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h6" gutterBottom>
              {config.company.name}
            </Typography>
            <Typography variant="body2">{config.company.addressLine1}</Typography>
            <Typography variant="body2">{config.company.addressLine2}</Typography>
            <Typography variant="body2">{config.company.phone}</Typography>
            <Typography variant="body2">{config.company.email}</Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Bill To Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Bill To:
            </Typography>
            <Typography variant="body1">{config.client.name}</Typography>
            <Typography variant="body2">{config.client.addressLine1}</Typography>
            <Typography variant="body2">{config.client.addressLine2}</Typography>
            <Typography variant="body2">Attn: {config.client.contact}</Typography>
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
              {timesheet.map((day, index) => (
                <TableRow key={index} sx={{ bgcolor: day.isWeekend ? 'grey.50' : 'inherit' }}>
                  <TableCell>{day.displayDate}</TableCell>
                  <TableCell>{day.day}</TableCell>
                  <TableCell align="right">{day.hours.toFixed(2)}</TableCell>
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
              <Typography variant="body1">${(totalHours * config.billing.hourlyRate).toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body1">Tax (0%):</Typography>
              <Typography variant="body1">$0.00</Typography>
            </Box>
            <Divider sx={{ my: 1 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6"><strong>Total:</strong></Typography>
              <Typography variant="h6"><strong>${(totalHours * config.billing.hourlyRate).toFixed(2)}</strong></Typography>
            </Box>
          </Box>
        </Box>

        {/* Payment Terms */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="body2" gutterBottom>
            <strong>Payment Terms:</strong> {config.billing.paymentTerms}
          </Typography>
          <Typography variant="body2" gutterBottom>
            <strong>Total Hours:</strong> {totalHours.toFixed(2)} hours @ ${config.billing.hourlyRate}/hour
          </Typography>
        </Box>
      </Paper>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Timesheet Tracker
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={currentTab} onChange={(e, newValue) => setCurrentTab(newValue)}>
            <Tab label="Create Invoice" />
            <Tab label={`Invoice History (${invoiceHistory.length})`} />
          </Tabs>
        </Box>

        {currentTab === 0 && (
          <Grid container spacing={4}>
            {/* Form Section */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Timesheet Details
              </Typography>

              <Box component="form" sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Your Name"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  margin="normal"
                  required
                  helperText="This will appear on your invoice as the service provider"
                />

                <TextField
                  fullWidth
                  label="Start Date"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  required
                  helperText="First day of the billing period"
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

                {timesheet.length > 0 && (
                  <Box sx={{ mt: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1">
                        Edit Hours
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        💡 Weekends are pre-set to 0 hours
                      </Typography>
                    </Box>
                    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 400 }}>
                      <Table size="small" stickyHeader>
                        <TableHead>
                          <TableRow>
                            <TableCell>Date</TableCell>
                            <TableCell>Day</TableCell>
                            <TableCell align="right">Hours</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {timesheet.map((day, index) => (
                            <TableRow
                              key={index}
                              sx={{
                                bgcolor: day.isWeekend ? 'grey.50' : 'inherit',
                                '&:hover': { bgcolor: 'action.hover' }
                              }}
                            >
                              <TableCell>{day.displayDate}</TableCell>
                              <TableCell>{day.day}</TableCell>
                              <TableCell align="right">
                                <TextField
                                  type="number"
                                  value={day.hours}
                                  onChange={(e) => handleHoursChange(index, e.target.value)}
                                  size="small"
                                  inputProps={{ min: 0, max: 24, step: 0.5, style: { textAlign: 'right' } }}
                                  sx={{ width: 80 }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.50', borderRadius: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1">
                        <strong>Total Hours:</strong> {totalHours.toFixed(2)}
                      </Typography>
                      <Typography variant="body1" color="primary">
                        <strong>Amount:</strong> ${(totalHours * config.billing.hourlyRate).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>

              <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={(e) => setExportMenuAnchor(e.currentTarget)}
                  disabled={!formData.name || !formData.period || timesheet.length === 0}
                  fullWidth
                >
                  Export Invoice
                </Button>
                <Menu
                  anchorEl={exportMenuAnchor}
                  open={Boolean(exportMenuAnchor)}
                  onClose={() => setExportMenuAnchor(null)}
                >
                  <MenuItemComponent onClick={() => { handleExportPDF(); setExportMenuAnchor(null); }}>
                    <PictureAsPdf sx={{ mr: 1 }} /> Export as PDF
                  </MenuItemComponent>
                  <MenuItemComponent onClick={() => { handleExportCSV(); setExportMenuAnchor(null); }}>
                    <TableChart sx={{ mr: 1 }} /> Export as CSV
                  </MenuItemComponent>
                  <MenuItemComponent onClick={() => { handlePrint(); setExportMenuAnchor(null); }}>
                    <Print sx={{ mr: 1 }} /> Print Invoice
                  </MenuItemComponent>
                </Menu>

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

            {/* Invoice Preview Section */}
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom>
                Invoice Preview
              </Typography>
              <InvoicePreview />
            </Grid>
          </Grid>
        )}

        {currentTab === 1 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Invoice History
            </Typography>
            {invoiceHistory.length === 0 ? (
              <Paper variant="outlined" sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="text.secondary">
                  No invoices saved yet. Create and export an invoice to see it here.
                </Typography>
              </Paper>
            ) : (
              <List>
                {invoiceHistory.map((invoice) => (
                  <Paper key={invoice.id} variant="outlined" sx={{ mb: 2, p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6">{invoice.invoiceNumber}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {invoice.name} • {invoice.displayDate}
                        </Typography>
                        <Typography variant="body2">
                          {invoice.period} • {invoice.totalHours.toFixed(2)} hours
                        </Typography>
                        <Chip
                          label={`$${invoice.totalAmount}`}
                          color="primary"
                          size="small"
                          sx={{ mt: 1 }}
                        />
                      </Box>
                      <Box>
                        <IconButton onClick={() => viewInvoice(invoice)} title="View">
                          <Visibility />
                        </IconButton>
                        <IconButton onClick={() => duplicateInvoice(invoice)} title="Duplicate">
                          <History />
                        </IconButton>
                        <IconButton onClick={() => deleteInvoice(invoice.id)} title="Delete" color="error">
                          <Delete />
                        </IconButton>
                      </Box>
                    </Box>
                  </Paper>
                ))}
              </List>
            )}
          </Box>
        )}
      </Paper>

      {/* Clear Confirmation Dialog */}
      <Dialog open={clearConfirmOpen} onClose={() => setClearConfirmOpen(false)}>
        <DialogTitle>Clear Current Invoice?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to clear the current invoice? This will reset all fields and timesheet data.
            {totalHours > 0 && (
              <Box sx={{ mt: 2, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                <Typography variant="body2">
                  <strong>Warning:</strong> You have {totalHours.toFixed(2)} hours entered. Make sure you've exported this invoice if you need to keep it.
                </Typography>
              </Box>
            )}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearConfirmOpen(false)}>Cancel</Button>
          <Button onClick={confirmClear} color="error" variant="contained">
            Clear
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default App
