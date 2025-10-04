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
  const [formData, setFormData] = useState({
    name: '',
    period: '',
    hoursPerDay: 8,
  })
  const [calculatedDates, setCalculatedDates] = useState([])
  const [totalHours, setTotalHours] = useState(0)

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

  const handlePrint = () => {
    window.print()
  }

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
          
          {/* Invoice Preview Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" gutterBottom>
              Invoice Preview
            </Typography>
            
            {calculatedDates.length > 0 && formData.name && formData.period ? (
              <Paper variant="outlined" sx={{ p: 3 }}>
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

export default App
