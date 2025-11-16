# Timesheet Tracker

A professional, feature-rich timesheet tracking and invoicing application built with React and Material-UI. Perfect for freelancers, contractors, and anyone who needs to track their working hours and generate professional invoices.

## Features

### Core Functionality
- **Editable Timesheet Grid**: Edit hours for each individual day with an intuitive interface
- **Smart Date Selection**: Choose custom start dates for your timesheets (automatically sets weekends to 0 hours)
- **Live Preview**: See your invoice preview update in real-time as you make changes
- **Auto-calculation**: Automatically calculates dates, hours, and totals

### Export Options
- **PDF Export**: Direct PDF download using jsPDF (no browser print dialog needed)
- **CSV Export**: Export to CSV for use in Excel, Google Sheets, or accounting software
- **Print Invoice**: Traditional browser print option for quick printing
- **Professional Formatting**: All exports include complete invoice details and branding

### Invoice Management
- **Invoice History**: Automatically saves all exported invoices
- **Smart Invoice Numbering**: Auto-incrementing invoice numbers (INV-0001, INV-0002, etc.)
- **View Past Invoices**: Browse and review all previously created invoices
- **Duplicate Invoices**: Quickly create a new invoice based on a previous one
- **Delete Invoices**: Remove invoices from history when needed

### User Experience
- **Two-Tab Interface**: Separate tabs for creating invoices and viewing history
- **Data Persistence**: Automatic saving to localStorage (never lose your work)
- **Confirmation Dialogs**: Prevents accidental data loss with clear warnings
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Weekend Detection**: Automatically highlights weekends and defaults them to 0 hours
- **Real-time Totals**: See your total hours and amount update as you type

## Tech Stack

- **React 19** - Modern React with hooks
- **Material-UI v5** - Beautiful, accessible components
- **jsPDF** - Client-side PDF generation
- **date-fns** - Modern date manipulation library
- **file-saver** - File download functionality
- **localStorage** - Client-side data persistence

## Installation & Setup

1. **Clone or download** this project

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `env.example` to `.env`
   - Update the values with your business information
   - See [Environment Setup](#environment-setup) section below

4. **Start the development server**:
   ```bash
   npm start
   ```

5. **Open your browser** to `http://localhost:3000`

## How to Use

### Creating Your First Invoice

1. **Enter your name** in the "Your Name" field
2. **Select a start date** for the timesheet period
3. **Choose a period** (Weekly, Bi-weekly, or Monthly)
4. **Edit individual day hours** in the timesheet grid that appears
   - Weekends are automatically set to 0 hours
   - Click any hour field to edit it
   - Hours update in real-time
5. **Review the invoice preview** on the right side
6. **Export your invoice**:
   - Click "Export Invoice" button
   - Choose PDF, CSV, or Print
   - Invoice is automatically saved to history

### Managing Invoice History

1. **Switch to the "Invoice History" tab** to see all saved invoices
2. **View** any invoice by clicking the eye icon
3. **Duplicate** an invoice to create a new one with the same details
4. **Delete** invoices you no longer need

### Keyboard Workflow Tips

- Fill in name and date first
- Select period to generate timesheet
- Tab through the hours fields to quickly enter your time
- Use the export button dropdown to choose your preferred format

## Environment Setup

The app uses environment variables to store your business information securely. This keeps sensitive data out of your code and makes it easy to change without touching the application.

### Quick Setup:
1. **Copy the template**:
   ```bash
   cp env.example .env
   ```
2. **Edit `.env`** with your business information:
   ```env
   REACT_APP_COMPANY_NAME=Your Company Name
   REACT_APP_COMPANY_ADDRESS_LINE1=Your Address
   REACT_APP_COMPANY_ADDRESS_LINE2=City, State ZIP
   REACT_APP_COMPANY_PHONE=(555) 123-4567
   REACT_APP_COMPANY_EMAIL=your.email@company.com
   REACT_APP_HOURLY_RATE=50
   # ... and more
   ```
3. **Restart the development server**:
   ```bash
   npm start
   ```

### What Gets Configured:
- **Company Information** - Name, address, phone, email (appears on your invoices)
- **Client Details** - Default client information (can be customized per invoice later)
- **Billing Settings** - Hourly rate, job title, payment terms
- **Invoice Settings** - Invoice prefix (e.g., "INV", "INVOICE"), numbering format

### Security Note:
The `.env` file is automatically excluded from version control (in `.gitignore`), so your business information stays private.

## Invoice Numbering System

The app uses a smart auto-incrementing invoice numbering system:

- **Format**: `{PREFIX}-{NUMBER}` (e.g., INV-0001, INV-0002)
- **Persistent**: Numbers are saved and continue incrementing even after page refresh
- **No Duplicates**: Each invoice gets a unique number
- **Customizable**: Change the prefix in your `.env` file

The invoice number is generated when you export (PDF or CSV), not when you create the timesheet. This means you can preview and edit without using up invoice numbers.

## Exported File Formats

### PDF Export
- **Professional Layout**: Company branding, client information, detailed timesheet table
- **Complete Details**: All invoice information, totals, payment terms
- **File Naming**: `{InvoiceNumber}_{YourName}.pdf`
- **No Browser Needed**: Direct download without print dialog

### CSV Export
- **Spreadsheet Ready**: Opens directly in Excel, Google Sheets, Numbers
- **Structured Data**: Organized sections for easy reading
- **Accounting Software Compatible**: Import into QuickBooks, FreshBooks, etc.
- **File Naming**: `{InvoiceNumber}_{YourName}.csv`
- **Complete Information**: All invoice details in text format

## Data Persistence

All data is automatically saved to your browser's localStorage:

- **Current Invoice**: Auto-saves as you type (name, dates, hours)
- **Invoice History**: Permanent storage of all exported invoices
- **Invoice Counter**: Remembers the last invoice number used
- **No Server Required**: Everything works offline

**Note**: Data is stored per browser. If you clear your browser data or use a different browser, you'll lose your history. For backup, you can export invoices to CSV and save them separately.

## Tips & Best Practices

### For Freelancers
- Set up your `.env` file once with your standard information
- Export invoices regularly (don't let them pile up)
- Use the duplicate feature for recurring clients
- Keep CSV exports as backup records

### For Contractors
- Update the client information in `.env` for your main client
- Use the start date picker to align with your pay periods
- Export both PDF (for clients) and CSV (for your records)
- Review the invoice history tab to track earnings

### For Multiple Clients
- Currently uses one default client from `.env`
- For different clients, manually export and edit the client section in the exported file
- Future versions will support multiple client profiles

## Troubleshooting

### Invoice Numbers Reset
If your invoice numbers reset to 1, your browser's localStorage was cleared. To prevent this:
- Don't clear browser data
- Consider exporting your invoice history regularly
- Keep CSV exports as backup

### Exported Files Don't Download
- Check your browser's download settings
- Ensure pop-ups aren't blocked
- Try a different browser

### Hours Don't Save
- Make sure you're clicking outside the input field after editing
- Check that your browser allows localStorage
- Try refreshing the page to see if data persists

## Future Enhancements

Potential features for future versions:
- Multiple client management
- Custom invoice templates
- Tax calculation options
- Cloud sync and backup
- Email integration
- Recurring invoice templates
- Project/task tracking
- Time tracking timer
- Mobile app version
- Multi-currency support

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Deployment

This app can be deployed to any static hosting service:

- **Netlify**: Drag and drop the `build` folder
- **Vercel**: Connect your Git repository
- **GitHub Pages**: Use the `gh-pages` package
- **AWS S3**: Upload build files to S3 bucket
- **Firebase Hosting**: Use Firebase CLI

**Important**: Remember to set up your environment variables in your hosting platform's settings!

## License

This project is open source and available for personal and commercial use.

## Support

For issues, questions, or feature requests, please open an issue on GitHub.

---

Built with ❤️ using React and Material-UI
