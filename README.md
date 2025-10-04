# Timesheet Tracker

A simple, elegant timesheet tracking application built with React and Material-UI. Perfect for freelancers, contractors, and anyone who needs to track their working hours and generate professional invoices.

## 🚀 Features

### Version 1 (MVP) - Current
- **Simple Form**: Enter your name, select a period (Weekly/Bi-weekly/Monthly), and set hours per day
- **Auto-calculation**: Automatically calculates dates and total hours based on your selections
- **Live Preview**: See your invoice preview update in real-time as you type
- **Print to PDF**: Use your browser's print function to save invoices as PDF
- **Data Persistence**: Your timesheet data is automatically saved to localStorage
- **Clear & Reset**: Start fresh with the "Clear & Start New" button
- **Responsive Design**: Works perfectly on both desktop and mobile devices

## 🛠️ Tech Stack

- **React 19** - Modern React with hooks
- **Create React App** - Zero-configuration React setup
- **Material-UI v5** - Beautiful, accessible components
- **localStorage** - Client-side data persistence
- **Browser Print API** - Native PDF generation

## 📦 Installation & Setup

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

## 🎯 How to Use

1. **Enter your name** in the first field
2. **Select a period** from the dropdown:
   - Weekly (7 days)
   - Bi-weekly (14 days) 
   - Monthly (30 days)
3. **Set your hours per day** (defaults to 8)
4. **Watch the magic** - your invoice preview updates automatically!
5. **Print your invoice** using the "Print Invoice" button
6. **Save as PDF** from your browser's print dialog

## ⚙️ Environment Setup

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
- **Company Information** - Name, address, phone, email
- **Client Details** - Default client information
- **Billing Settings** - Hourly rate, job title, payment terms
- **Invoice Settings** - Invoice prefix, numbering

### Security Note:
The `.env` file is automatically excluded from version control (in `.gitignore`), so your business information stays private.

## 🔮 Future Roadmap

### Version 2 - Planned Features
- Invoice history (list of past invoices)
- Better invoice numbering (auto-increment)
- Export data as JSON backup
- Invoice templates and customization

### Version 3 - Advanced Features
- PDF generation library (no browser dependency)
- Email template generator
- Cloud sync capabilities
- Multiple client/project support

## 🏗️ Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
