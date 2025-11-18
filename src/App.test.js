import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { format } from 'date-fns';

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => {
      store[key] = value.toString();
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    }
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
});

// Mock window.print
global.print = jest.fn();

describe('Timesheet Tracker - Core Functionality', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('renders app with title', () => {
    render(<App />);
    const titleElement = screen.getByText(/Timesheet Tracker/i);
    expect(titleElement).toBeInTheDocument();
  });

  test('shows two tabs: Create Invoice and Invoice History', () => {
    render(<App />);
    expect(screen.getByText('Create Invoice')).toBeInTheDocument();
    expect(screen.getByText(/Invoice History/i)).toBeInTheDocument();
  });

  test('renders form fields correctly', () => {
    render(<App />);
    expect(screen.getByLabelText(/Your Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Start Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Period/i)).toBeInTheDocument();
  });

  test('export button is disabled when form is incomplete', () => {
    render(<App />);
    const exportButton = screen.getByRole('button', { name: /Export Invoice/i });
    expect(exportButton).toBeDisabled();
  });

  test('entering name enables input', async () => {
    render(<App />);
    const nameInput = screen.getByLabelText(/Your Name/i);

    await userEvent.type(nameInput, 'John Doe');

    expect(nameInput).toHaveValue('John Doe');
  });

  test('selecting period generates timesheet grid', async () => {
    render(<App />);

    // Fill required fields
    const nameInput = screen.getByLabelText(/Your Name/i);
    await userEvent.type(nameInput, 'John Doe');

    // Select period
    const periodSelect = screen.getByLabelText(/Period/i);
    fireEvent.mouseDown(periodSelect);

    const weeklyOption = await screen.findByText(/Weekly \(7 days\)/i);
    fireEvent.click(weeklyOption);

    // Check timesheet appears
    await waitFor(() => {
      expect(screen.getByText(/Edit Hours/i)).toBeInTheDocument();
    });
  });

  test('timesheet grid has correct number of days for weekly period', async () => {
    render(<App />);

    const nameInput = screen.getByLabelText(/Your Name/i);
    await userEvent.type(nameInput, 'John Doe');

    const periodSelect = screen.getByLabelText(/Period/i);
    fireEvent.mouseDown(periodSelect);
    const weeklyOption = await screen.findByText(/Weekly \(7 days\)/i);
    fireEvent.click(weeklyOption);

    await waitFor(() => {
      const hourInputs = screen.getAllByRole('spinbutton');
      expect(hourInputs).toHaveLength(7); // 7 days in a week
    });
  });

  test('weekends default to 0 hours, weekdays to 8', async () => {
    render(<App />);

    const nameInput = screen.getByLabelText(/Your Name/i);
    await userEvent.type(nameInput, 'John Doe');

    // Set start date to a known Monday
    const startDateInput = screen.getByLabelText(/Start Date/i);
    await userEvent.clear(startDateInput);
    await userEvent.type(startDateInput, '2025-11-17'); // Monday

    const periodSelect = screen.getByLabelText(/Period/i);
    fireEvent.mouseDown(periodSelect);
    const weeklyOption = await screen.findByText(/Weekly \(7 days\)/i);
    fireEvent.click(weeklyOption);

    await waitFor(() => {
      const hourInputs = screen.getAllByRole('spinbutton');
      // Monday-Friday should be 8, Saturday-Sunday should be 0
      expect(hourInputs[0]).toHaveValue(8); // Monday
      expect(hourInputs[5]).toHaveValue(0); // Saturday
      expect(hourInputs[6]).toHaveValue(0); // Sunday
    });
  });

  test('can edit hours in timesheet', async () => {
    render(<App />);

    const nameInput = screen.getByLabelText(/Your Name/i);
    await userEvent.type(nameInput, 'John Doe');

    const periodSelect = screen.getByLabelText(/Period/i);
    fireEvent.mouseDown(periodSelect);
    const weeklyOption = await screen.findByText(/Weekly \(7 days\)/i);
    fireEvent.click(weeklyOption);

    await waitFor(async () => {
      const hourInputs = screen.getAllByRole('spinbutton');
      const firstInput = hourInputs[0];

      await userEvent.clear(firstInput);
      await userEvent.type(firstInput, '10');

      expect(firstInput).toHaveValue(10);
    });
  });

  test('total hours updates when hours are changed', async () => {
    render(<App />);

    const nameInput = screen.getByLabelText(/Your Name/i);
    await userEvent.type(nameInput, 'John Doe');

    const periodSelect = screen.getByLabelText(/Period/i);
    fireEvent.mouseDown(periodSelect);
    const weeklyOption = await screen.findByText(/Weekly \(7 days\)/i);
    fireEvent.click(weeklyOption);

    await waitFor(async () => {
      // Initial total should be 40 (5 weekdays × 8 hours)
      expect(screen.getByText(/Total Hours:/)).toBeInTheDocument();
      expect(screen.getByText(/40\.00/)).toBeInTheDocument();

      // Change first day to 10 hours
      const hourInputs = screen.getAllByRole('spinbutton');
      await userEvent.clear(hourInputs[0]);
      await userEvent.type(hourInputs[0], '10');

      // Total should now be 42
      await waitFor(() => {
        expect(screen.getByText(/42\.00/)).toBeInTheDocument();
      });
    });
  });

  test('invoice preview appears when form is complete', async () => {
    render(<App />);

    const nameInput = screen.getByLabelText(/Your Name/i);
    await userEvent.type(nameInput, 'John Doe');

    const periodSelect = screen.getByLabelText(/Period/i);
    fireEvent.mouseDown(periodSelect);
    const weeklyOption = await screen.findByText(/Weekly \(7 days\)/i);
    fireEvent.click(weeklyOption);

    await waitFor(() => {
      expect(screen.getByText(/INVOICE/)).toBeInTheDocument();
      expect(screen.getByText(/Bill To:/)).toBeInTheDocument();
    });
  });
});

describe('Timesheet Tracker - Data Persistence', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('saves form data to localStorage', async () => {
    render(<App />);

    const nameInput = screen.getByLabelText(/Your Name/i);
    await userEvent.type(nameInput, 'Jane Smith');

    await waitFor(() => {
      const savedData = JSON.parse(localStorage.getItem('timesheetData'));
      expect(savedData.formData.name).toBe('Jane Smith');
    });
  });

  test('restores data from localStorage on mount', () => {
    const testData = {
      formData: {
        name: 'Test User',
        period: 'weekly',
        startDate: format(new Date(), 'yyyy-MM-dd')
      },
      timesheet: [],
      totalHours: 0
    };

    localStorage.setItem('timesheetData', JSON.stringify(testData));

    render(<App />);

    const nameInput = screen.getByLabelText(/Your Name/i);
    expect(nameInput).toHaveValue('Test User');
  });

  test('clears localStorage when clear button is used', async () => {
    render(<App />);

    const nameInput = screen.getByLabelText(/Your Name/i);
    await userEvent.type(nameInput, 'Test User');

    // Verify data is saved
    expect(localStorage.getItem('timesheetData')).toBeTruthy();

    // Click clear button
    const clearButton = screen.getByRole('button', { name: /Clear & Start New/i });
    await userEvent.click(clearButton);

    // Confirm in dialog
    const confirmButton = await screen.findByRole('button', { name: /^Clear$/i });
    await userEvent.click(confirmButton);

    // Verify data is cleared
    await waitFor(() => {
      const nameInputAfter = screen.getByLabelText(/Your Name/i);
      expect(nameInputAfter).toHaveValue('');
    });
  });
});

describe('Timesheet Tracker - Invoice History', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('shows invoice history tab', () => {
    render(<App />);
    expect(screen.getByText(/Invoice History \(0\)/i)).toBeInTheDocument();
  });

  test('can switch to invoice history tab', async () => {
    render(<App />);

    const historyTab = screen.getByText(/Invoice History/i);
    await userEvent.click(historyTab);

    expect(screen.getByText(/No invoices saved yet/i)).toBeInTheDocument();
  });

  test('invoice count updates in tab label', async () => {
    const testHistory = [{
      id: 1,
      invoiceNumber: 'INV-0001',
      date: '2025-11-18',
      displayDate: 'Nov 18, 2025',
      name: 'Test User',
      period: 'Weekly (7 days)',
      totalHours: 40,
      totalAmount: '2000.00',
      timesheet: []
    }];

    localStorage.setItem('invoiceHistory', JSON.stringify(testHistory));

    render(<App />);

    expect(screen.getByText(/Invoice History \(1\)/i)).toBeInTheDocument();
  });
});

describe('Timesheet Tracker - Clear Confirmation', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('shows confirmation dialog when clearing', async () => {
    render(<App />);

    const clearButton = screen.getByRole('button', { name: /Clear & Start New/i });
    await userEvent.click(clearButton);

    expect(await screen.findByText(/Clear Current Invoice\?/i)).toBeInTheDocument();
  });

  test('can cancel clear operation', async () => {
    render(<App />);

    const nameInput = screen.getByLabelText(/Your Name/i);
    await userEvent.type(nameInput, 'Test User');

    const clearButton = screen.getByRole('button', { name: /Clear & Start New/i });
    await userEvent.click(clearButton);

    const cancelButton = await screen.findByRole('button', { name: /Cancel/i });
    await userEvent.click(cancelButton);

    // Data should still be there
    expect(nameInput).toHaveValue('Test User');
  });

  test('shows warning when clearing invoice with hours', async () => {
    render(<App />);

    const nameInput = screen.getByLabelText(/Your Name/i);
    await userEvent.type(nameInput, 'Test User');

    const periodSelect = screen.getByLabelText(/Period/i);
    fireEvent.mouseDown(periodSelect);
    const weeklyOption = await screen.findByText(/Weekly \(7 days\)/i);
    fireEvent.click(weeklyOption);

    await waitFor(async () => {
      const clearButton = screen.getByRole('button', { name: /Clear & Start New/i });
      await userEvent.click(clearButton);

      // Should show warning about hours
      expect(await screen.findByText(/Warning:/i)).toBeInTheDocument();
      expect(screen.getByText(/40\.00 hours/i)).toBeInTheDocument();
    });
  });
});

describe('Timesheet Tracker - Edge Cases', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('handles decimal hours correctly', async () => {
    render(<App />);

    const nameInput = screen.getByLabelText(/Your Name/i);
    await userEvent.type(nameInput, 'John Doe');

    const periodSelect = screen.getByLabelText(/Period/i);
    fireEvent.mouseDown(periodSelect);
    const weeklyOption = await screen.findByText(/Weekly \(7 days\)/i);
    fireEvent.click(weeklyOption);

    await waitFor(async () => {
      const hourInputs = screen.getAllByRole('spinbutton');
      await userEvent.clear(hourInputs[0]);
      await userEvent.type(hourInputs[0], '7.5');

      expect(hourInputs[0]).toHaveValue(7.5);
    });
  });

  test('handles zero hours for all days', async () => {
    render(<App />);

    const nameInput = screen.getByLabelText(/Your Name/i);
    await userEvent.type(nameInput, 'John Doe');

    const periodSelect = screen.getByLabelText(/Period/i);
    fireEvent.mouseDown(periodSelect);
    const weeklyOption = await screen.findByText(/Weekly \(7 days\)/i);
    fireEvent.click(weeklyOption);

    await waitFor(async () => {
      const hourInputs = screen.getAllByRole('spinbutton');

      // Set all to zero
      for (const input of hourInputs) {
        await userEvent.clear(input);
        await userEvent.type(input, '0');
      }

      // Total should be 0
      expect(await screen.findByText(/Total Hours:.*0\.00/i)).toBeInTheDocument();
    });
  });

  test('handles bi-weekly period correctly', async () => {
    render(<App />);

    const nameInput = screen.getByLabelText(/Your Name/i);
    await userEvent.type(nameInput, 'John Doe');

    const periodSelect = screen.getByLabelText(/Period/i);
    fireEvent.mouseDown(periodSelect);
    const biweeklyOption = await screen.findByText(/Bi-weekly \(14 days\)/i);
    fireEvent.click(biweeklyOption);

    await waitFor(() => {
      const hourInputs = screen.getAllByRole('spinbutton');
      expect(hourInputs).toHaveLength(14); // 14 days
    });
  });

  test('handles monthly period correctly', async () => {
    render(<App />);

    const nameInput = screen.getByLabelText(/Your Name/i);
    await userEvent.type(nameInput, 'John Doe');

    const periodSelect = screen.getByLabelText(/Period/i);
    fireEvent.mouseDown(periodSelect);
    const monthlyOption = await screen.findByText(/Monthly \(30 days\)/i);
    fireEvent.click(monthlyOption);

    await waitFor(() => {
      const hourInputs = screen.getAllByRole('spinbutton');
      expect(hourInputs).toHaveLength(30); // 30 days
    });
  });
});
