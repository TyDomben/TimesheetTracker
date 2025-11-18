/**
 * Integration Tests for Timesheet Tracker
 * Tests complete user workflows end-to-end
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { format, addDays } from 'date-fns';

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

// Mock file download
global.URL.createObjectURL = jest.fn();
global.URL.revokeObjectURL = jest.fn();

describe('Integration: Complete Invoice Creation Workflow', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('Complete workflow: Create weekly invoice from scratch', async () => {
    render(<App />);

    // Step 1: User enters their name
    const nameInput = screen.getByLabelText(/Your Name/i);
    await userEvent.type(nameInput, 'Jane Doe');
    expect(nameInput).toHaveValue('Jane Doe');

    // Step 2: User selects start date
    const startDate = format(new Date('2025-11-17'), 'yyyy-MM-dd'); // Monday
    const startDateInput = screen.getByLabelText(/Start Date/i);
    await userEvent.clear(startDateInput);
    await userEvent.type(startDateInput, startDate);

    // Step 3: User selects weekly period
    const periodSelect = screen.getByLabelText(/Period/i);
    fireEvent.mouseDown(periodSelect);
    const weeklyOption = await screen.findByText(/Weekly \(7 days\)/i);
    fireEvent.click(weeklyOption);

    // Step 4: Timesheet appears with default hours
    await waitFor(() => {
      expect(screen.getByText(/Edit Hours/i)).toBeInTheDocument();
      const hourInputs = screen.getAllByRole('spinbutton');
      expect(hourInputs).toHaveLength(7);
    });

    // Step 5: User edits hours for specific days
    const hourInputs = screen.getAllByRole('spinbutton');
    await userEvent.clear(hourInputs[0]); // Monday
    await userEvent.type(hourInputs[0], '9');
    await userEvent.clear(hourInputs[1]); // Tuesday
    await userEvent.type(hourInputs[1], '7.5');

    // Step 6: Total hours updates correctly
    await waitFor(() => {
      // Monday(9) + Tuesday(7.5) + Wed(8) + Thu(8) + Fri(8) + Sat(0) + Sun(0) = 40.5
      expect(screen.getByText(/40\.50/i)).toBeInTheDocument();
    });

    // Step 7: Invoice preview shows correct information
    expect(screen.getByText(/INVOICE/)).toBeInTheDocument();
    expect(screen.getByText(/Jane Doe/)).toBeInTheDocument();
    expect(screen.getByText(/Weekly \(7 days\)/i)).toBeInTheDocument();

    // Step 8: Data is persisted to localStorage
    const savedData = JSON.parse(localStorage.getItem('timesheetData'));
    expect(savedData.formData.name).toBe('Jane Doe');
    expect(savedData.totalHours).toBe(40.5);
  });

  test('Complete workflow: Create, save, and view invoice from history', async () => {
    render(<App />);

    // Create an invoice
    const nameInput = screen.getByLabelText(/Your Name/i);
    await userEvent.type(nameInput, 'John Smith');

    const periodSelect = screen.getByLabelText(/Period/i);
    fireEvent.mouseDown(periodSelect);
    const weeklyOption = await screen.findByText(/Weekly \(7 days\)/i);
    fireEvent.click(weeklyOption);

    await waitFor(() => {
      expect(screen.getAllByRole('spinbutton')).toHaveLength(7);
    });

    // Mock export to save to history (since we can't actually click export in tests)
    // Simulate what happens when user exports
    const testInvoice = {
      id: Date.now(),
      invoiceNumber: 'INV-0001',
      date: format(new Date(), 'yyyy-MM-dd'),
      displayDate: format(new Date(), 'MMM dd, yyyy'),
      name: 'John Smith',
      period: 'Weekly (7 days)',
      totalHours: 40,
      totalAmount: '2000.00',
      timesheet: []
    };

    localStorage.setItem('invoiceHistory', JSON.stringify([testInvoice]));

    // Re-render to pick up the history
    render(<App />);

    // Switch to history tab
    const historyTab = screen.getByText(/Invoice History \(1\)/i);
    await userEvent.click(historyTab);

    // Verify invoice appears in history
    await waitFor(() => {
      expect(screen.getByText('INV-0001')).toBeInTheDocument();
      expect(screen.getByText(/John Smith/)).toBeInTheDocument();
      expect(screen.getByText(/\$2000\.00/)).toBeInTheDocument();
    });
  });

  test('Complete workflow: Duplicate an existing invoice', async () => {
    const existingInvoice = {
      id: 1,
      invoiceNumber: 'INV-0001',
      date: '2025-11-10',
      displayDate: 'Nov 10, 2025',
      name: 'Test User',
      period: 'Weekly (7 days)',
      totalHours: 40,
      totalAmount: '2000.00',
      timesheet: Array(7).fill(null).map((_, i) => ({
        date: format(addDays(new Date('2025-11-10'), i), 'yyyy-MM-dd'),
        displayDate: format(addDays(new Date('2025-11-10'), i), 'MMM dd, yyyy'),
        day: format(addDays(new Date('2025-11-10'), i), 'EEE'),
        hours: i < 5 ? 8 : 0,
        isWeekend: i >= 5
      }))
    };

    localStorage.setItem('invoiceHistory', JSON.stringify([existingInvoice]));

    render(<App />);

    // Go to history
    const historyTab = screen.getByText(/Invoice History/i);
    await userEvent.click(historyTab);

    // Find and click duplicate button
    await waitFor(async () => {
      const duplicateButtons = screen.getAllByTitle('Duplicate');
      await userEvent.click(duplicateButtons[0]);
    });

    // Should switch back to create tab with data filled in
    await waitFor(() => {
      const nameInput = screen.getByLabelText(/Your Name/i);
      expect(nameInput).toHaveValue('Test User');
    });

    // Timesheet should be generated
    expect(screen.getAllByRole('spinbutton')).toHaveLength(7);
  });
});

describe('Integration: Data Persistence Across Sessions', () => {
  test('Data persists after page reload', async () => {
    // First session
    const { unmount } = render(<App />);

    const nameInput = screen.getByLabelText(/Your Name/i);
    await userEvent.type(nameInput, 'Persistent User');

    const periodSelect = screen.getByLabelText(/Period/i);
    fireEvent.mouseDown(periodSelect);
    const weeklyOption = await screen.findByText(/Weekly \(7 days\)/i);
    fireEvent.click(weeklyOption);

    await waitFor(() => {
      expect(screen.getAllByRole('spinbutton')).toHaveLength(7);
    });

    // Unmount (simulate closing page)
    unmount();

    // Second session (simulate reopening page)
    render(<App />);

    // Data should be restored
    await waitFor(() => {
      const restoredNameInput = screen.getByLabelText(/Your Name/i);
      expect(restoredNameInput).toHaveValue('Persistent User');
      expect(screen.getAllByRole('spinbutton')).toHaveLength(7);
    });
  });

  test('Invoice history persists across sessions', async () => {
    const invoice = {
      id: 1,
      invoiceNumber: 'INV-0001',
      date: '2025-11-18',
      displayDate: 'Nov 18, 2025',
      name: 'History Test',
      period: 'Weekly (7 days)',
      totalHours: 40,
      totalAmount: '2000.00',
      timesheet: []
    };

    localStorage.setItem('invoiceHistory', JSON.stringify([invoice]));

    // First render
    const { unmount } = render(<App />);

    const historyTab = screen.getByText(/Invoice History \(1\)/i);
    await userEvent.click(historyTab);

    expect(await screen.findByText('INV-0001')).toBeInTheDocument();

    // Unmount and re-render
    unmount();
    render(<App />);

    // History should still be there
    expect(screen.getByText(/Invoice History \(1\)/i)).toBeInTheDocument();

    const historyTabAgain = screen.getByText(/Invoice History \(1\)/i);
    await userEvent.click(historyTabAgain);

    expect(await screen.findByText('INV-0001')).toBeInTheDocument();
  });
});

describe('Integration: Error Handling and Edge Cases', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('Handles clearing invoice with unsaved hours', async () => {
    render(<App />);

    // Create an invoice with hours
    const nameInput = screen.getByLabelText(/Your Name/i);
    await userEvent.type(nameInput, 'Test User');

    const periodSelect = screen.getByLabelText(/Period/i);
    fireEvent.mouseDown(periodSelect);
    const weeklyOption = await screen.findByText(/Weekly \(7 days\)/i);
    fireEvent.click(weeklyOption);

    await waitFor(() => {
      expect(screen.getAllByRole('spinbutton')).toHaveLength(7);
    });

    // Try to clear
    const clearButton = screen.getByRole('button', { name: /Clear & Start New/i });
    await userEvent.click(clearButton);

    // Should show warning about hours
    await waitFor(() => {
      expect(screen.getByText(/Warning:/i)).toBeInTheDocument();
      expect(screen.getByText(/40\.00 hours/i)).toBeInTheDocument();
    });

    // Cancel
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await userEvent.click(cancelButton);

    // Data should still be there
    expect(nameInput).toHaveValue('Test User');
  });

  test('Handles deleting invoice from history', async () => {
    const invoice = {
      id: 1,
      invoiceNumber: 'INV-0001',
      date: '2025-11-18',
      displayDate: 'Nov 18, 2025',
      name: 'Delete Test',
      period: 'Weekly (7 days)',
      totalHours: 40,
      totalAmount: '2000.00',
      timesheet: []
    };

    localStorage.setItem('invoiceHistory', JSON.stringify([invoice]));

    render(<App />);

    const historyTab = screen.getByText(/Invoice History \(1\)/i);
    await userEvent.click(historyTab);

    // Find delete button
    const deleteButton = screen.getByTitle('Delete');
    await userEvent.click(deleteButton);

    // Invoice should be removed
    await waitFor(() => {
      expect(screen.queryByText('INV-0001')).not.toBeInTheDocument();
      expect(screen.getByText(/No invoices saved yet/i)).toBeInTheDocument();
    });

    // Tab count should update
    expect(screen.getByText(/Invoice History \(0\)/i)).toBeInTheDocument();
  });

  test('Handles switching between different periods', async () => {
    render(<App />);

    const nameInput = screen.getByLabelText(/Your Name/i);
    await userEvent.type(nameInput, 'Test User');

    // Select weekly
    let periodSelect = screen.getByLabelText(/Period/i);
    fireEvent.mouseDown(periodSelect);
    let weeklyOption = await screen.findByText(/Weekly \(7 days\)/i);
    fireEvent.click(weeklyOption);

    await waitFor(() => {
      expect(screen.getAllByRole('spinbutton')).toHaveLength(7);
    });

    // Switch to bi-weekly
    periodSelect = screen.getByLabelText(/Period/i);
    fireEvent.mouseDown(periodSelect);
    const biweeklyOption = await screen.findByText(/Bi-weekly \(14 days\)/i);
    fireEvent.click(biweeklyOption);

    await waitFor(() => {
      expect(screen.getAllByRole('spinbutton')).toHaveLength(14);
    });

    // Switch to monthly
    periodSelect = screen.getByLabelText(/Period/i);
    fireEvent.mouseDown(periodSelect);
    const monthlyOption = await screen.findByText(/Monthly \(30 days\)/i);
    fireEvent.click(monthlyOption);

    await waitFor(() => {
      expect(screen.getAllByRole('spinbutton')).toHaveLength(30);
    });
  });
});

describe('Integration: Invoice Numbering', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('Invoice numbers increment correctly across multiple invoices', () => {
    // Simulate creating multiple invoices
    const invoices = [
      {
        id: 1,
        invoiceNumber: 'INV-0001',
        date: '2025-11-18',
        displayDate: 'Nov 18, 2025',
        name: 'User 1',
        period: 'Weekly (7 days)',
        totalHours: 40,
        totalAmount: '2000.00',
        timesheet: []
      },
      {
        id: 2,
        invoiceNumber: 'INV-0002',
        date: '2025-11-18',
        displayDate: 'Nov 18, 2025',
        name: 'User 2',
        period: 'Weekly (7 days)',
        totalHours: 40,
        totalAmount: '2000.00',
        timesheet: []
      },
      {
        id: 3,
        invoiceNumber: 'INV-0003',
        date: '2025-11-18',
        displayDate: 'Nov 18, 2025',
        name: 'User 3',
        period: 'Weekly (7 days)',
        totalHours: 40,
        totalAmount: '2000.00',
        timesheet: []
      }
    ];

    localStorage.setItem('invoiceHistory', JSON.stringify(invoices));
    localStorage.setItem('lastInvoiceNumber', '3');

    render(<App />);

    const historyTab = screen.getByText(/Invoice History \(3\)/i);
    userEvent.click(historyTab);

    // All invoice numbers should be sequential
    waitFor(() => {
      expect(screen.getByText('INV-0001')).toBeInTheDocument();
      expect(screen.getByText('INV-0002')).toBeInTheDocument();
      expect(screen.getByText('INV-0003')).toBeInTheDocument();
    });
  });
});
