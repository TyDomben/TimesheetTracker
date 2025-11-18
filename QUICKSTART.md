# Quick Start Guide

Get your first invoice created in under 2 minutes!

## Prerequisites

- Node.js 14+ installed
- Basic command line knowledge

## Installation (One Time Setup)

1. **Clone or download this repository**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure your business information:**

   Open the `.env` file and update with your actual information:
   ```bash
   # Edit these values
   REACT_APP_COMPANY_NAME=Acme Consulting
   REACT_APP_COMPANY_EMAIL=billing@acmeconsulting.com
   REACT_APP_HOURLY_RATE=100
   # ... etc
   ```

4. **Start the app:**
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## Creating Your First Invoice

### Step 1: Enter Basic Information
1. Type your name in the **"Your Name"** field
2. Select today's date (or your preferred start date)
3. Choose a period: **Weekly (7 days)**, **Bi-weekly (14 days)**, or **Monthly (30 days)**

The timesheet grid will appear automatically!

### Step 2: Edit Your Hours
- A table appears with all the days in your selected period
- **Weekends are automatically set to 0 hours** (you can change them if you work weekends)
- Click any hour field to edit it
- Tab through the fields for quick entry
- Watch the total hours update in real-time!

### Step 3: Review the Invoice Preview
- The right side shows a live preview of your invoice
- Check that all information looks correct
- Review the total amount (hours × hourly rate)

### Step 4: Export Your Invoice
1. Click the **"Export Invoice"** button
2. Choose your format:
   - **PDF** - Professional, ready to send to clients
   - **CSV** - Open in Excel/Google Sheets
   - **Print** - Traditional print dialog

Your invoice will download automatically and save to history!

## Managing Your Invoice History

### View Past Invoices
1. Click the **"Invoice History"** tab at the top
2. See all your exported invoices listed
3. Each shows: Invoice number, date, hours, and amount

### Invoice Actions
- **👁 View** - Load an invoice to review it
- **🔄 Duplicate** - Create a new invoice with the same hours/pattern
- **🗑 Delete** - Remove an invoice from history

## Tips for Efficient Use

### Quick Workflow
1. Enter name and select period (generates timesheet)
2. Tab through hours fields, entering your actual hours
3. Click Export → PDF
4. Done! Invoice saved to history

### For Recurring Clients
1. Go to Invoice History
2. Find your last invoice for that client
3. Click **Duplicate**
4. Adjust the dates/hours as needed
5. Export again!

### Keyboard Shortcuts
- **Tab** - Move between hour fields quickly
- **Enter** - Confirm hour entry
- **Cmd/Ctrl + P** - Quick print (when print dialog is open)

## Common Scenarios

### Scenario 1: Full-time Contractor (40 hrs/week)
1. Select "Weekly (7 days)"
2. Default is already 8 hrs on weekdays, 0 on weekends
3. Export! (No editing needed)

### Scenario 2: Part-time Work
1. Select your period
2. Edit each day to your actual hours
3. Some days might be 4 hrs, some 6 hrs, etc.
4. Export when done

### Scenario 3: Project-based Billing
1. Select "Monthly (30 days)"
2. Enter hours for days you worked on the project
3. Leave non-work days at 0
4. Export your monthly summary

### Scenario 4: Multiple Projects Same Period
Currently, create separate invoices:
1. Create first invoice for Project A (e.g., first 2 weeks)
2. Clear and create second invoice for Project B
3. Both saved to history

## Troubleshooting

### The hours don't save when I type them
- Make sure to click outside the field or press Enter after typing
- The hours save to localStorage automatically
- Refresh the page to verify they persisted

### My invoice number reset to 1
- This happens if you cleared your browser data
- Invoice numbers are stored in localStorage
- Export your invoices regularly as backup (CSV)

### I need to change my hourly rate
- Stop the server (Ctrl+C)
- Edit the `.env` file
- Update `REACT_APP_HOURLY_RATE=100` to your new rate
- Restart: `npm start`

### The PDF doesn't look right
- Make sure all company info is filled in `.env`
- Check that you entered your name
- Verify the timesheet has hours entered
- Try exporting again

## Next Steps

Once you're comfortable:
- Customize your `.env` file completely
- Set up your client's default information
- Export invoices regularly (don't lose them!)
- Consider backing up your invoice history

## Need Help?

- Check the main [README.md](./README.md) for detailed documentation
- Review your `.env` file configuration
- Verify you completed all installation steps

---

**You're all set!** Start tracking your time and generating professional invoices. 🎉
