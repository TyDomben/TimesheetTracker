import { config, generateInvoiceNumber, calculateTotalAmount } from './config';

// Mock process.env
const originalEnv = process.env;

describe('Config Module', () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  describe('config object structure', () => {
    test('has company section with all required fields', () => {
      expect(config.company).toBeDefined();
      expect(config.company).toHaveProperty('name');
      expect(config.company).toHaveProperty('addressLine1');
      expect(config.company).toHaveProperty('addressLine2');
      expect(config.company).toHaveProperty('phone');
      expect(config.company).toHaveProperty('email');
    });

    test('has client section with all required fields', () => {
      expect(config.client).toBeDefined();
      expect(config.client).toHaveProperty('name');
      expect(config.client).toHaveProperty('addressLine1');
      expect(config.client).toHaveProperty('addressLine2');
      expect(config.client).toHaveProperty('contact');
    });

    test('has billing section with all required fields', () => {
      expect(config.billing).toBeDefined();
      expect(config.billing).toHaveProperty('hourlyRate');
      expect(config.billing).toHaveProperty('jobTitle');
      expect(config.billing).toHaveProperty('paymentTerms');
    });

    test('has invoice section with all required fields', () => {
      expect(config.invoice).toBeDefined();
      expect(config.invoice).toHaveProperty('prefix');
    });
  });

  describe('default values', () => {
    test('company name has default value', () => {
      expect(config.company.name).toBeTruthy();
      expect(typeof config.company.name).toBe('string');
    });

    test('hourly rate has numeric default', () => {
      expect(config.billing.hourlyRate).toBeTruthy();
      expect(typeof config.billing.hourlyRate).toBe('number');
      expect(config.billing.hourlyRate).toBeGreaterThan(0);
    });

    test('invoice prefix has default value', () => {
      expect(config.invoice.prefix).toBeTruthy();
      expect(typeof config.invoice.prefix).toBe('string');
    });

    test('payment terms has default value', () => {
      expect(config.billing.paymentTerms).toBeTruthy();
      expect(typeof config.billing.paymentTerms).toBe('string');
    });
  });

  describe('generateInvoiceNumber function', () => {
    beforeEach(() => {
      // Clear localStorage before each test
      localStorage.clear();
    });

    test('generates invoice number in correct format', () => {
      const invoiceNumber = generateInvoiceNumber();
      expect(invoiceNumber).toMatch(/^[A-Z]+-\d{4}$/);
    });

    test('increments invoice number on subsequent calls', () => {
      const first = generateInvoiceNumber();
      const second = generateInvoiceNumber();

      const firstNum = parseInt(first.split('-')[1]);
      const secondNum = parseInt(second.split('-')[1]);

      expect(secondNum).toBe(firstNum + 1);
    });

    test('pads invoice number with zeros', () => {
      localStorage.clear();
      const invoiceNumber = generateInvoiceNumber();
      const numberPart = invoiceNumber.split('-')[1];

      expect(numberPart).toHaveLength(4);
      expect(numberPart).toMatch(/^\d{4}$/);
    });

    test('uses config prefix in invoice number', () => {
      const invoiceNumber = generateInvoiceNumber();
      expect(invoiceNumber).toContain(config.invoice.prefix);
    });

    test('persists counter to localStorage', () => {
      generateInvoiceNumber();
      const savedNumber = localStorage.getItem('lastInvoiceNumber');

      expect(savedNumber).toBeTruthy();
      expect(parseInt(savedNumber)).toBeGreaterThan(0);
    });

    test('continues from last number after page reload', () => {
      // Generate some invoices
      generateInvoiceNumber();
      generateInvoiceNumber();
      const third = generateInvoiceNumber();

      // Simulate page reload by getting the stored number
      const lastNumber = parseInt(localStorage.getItem('lastInvoiceNumber'));

      // Generate next invoice
      const fourth = generateInvoiceNumber();
      const fourthNum = parseInt(fourth.split('-')[1]);

      expect(fourthNum).toBe(lastNumber + 1);
    });

    test('starts at 1 when no previous invoices exist', () => {
      localStorage.clear();
      const invoiceNumber = generateInvoiceNumber();
      const numberPart = invoiceNumber.split('-')[1];

      expect(numberPart).toBe('0001');
    });
  });

  describe('calculateTotalAmount function', () => {
    test('calculates correct amount for whole hours', () => {
      const totalHours = 40;
      const amount = calculateTotalAmount(totalHours);

      expect(amount).toBe(totalHours * config.billing.hourlyRate);
    });

    test('calculates correct amount for decimal hours', () => {
      const totalHours = 37.5;
      const amount = calculateTotalAmount(totalHours);

      expect(amount).toBe(totalHours * config.billing.hourlyRate);
    });

    test('returns 0 for 0 hours', () => {
      const amount = calculateTotalAmount(0);
      expect(amount).toBe(0);
    });

    test('handles large hour amounts', () => {
      const totalHours = 160; // Full month
      const amount = calculateTotalAmount(totalHours);

      expect(amount).toBe(totalHours * config.billing.hourlyRate);
      expect(amount).toBeGreaterThan(0);
    });

    test('returns numeric value', () => {
      const amount = calculateTotalAmount(10);
      expect(typeof amount).toBe('number');
    });

    test('uses hourly rate from config', () => {
      const hours = 10;
      const amount = calculateTotalAmount(hours);
      const expectedAmount = hours * config.billing.hourlyRate;

      expect(amount).toBe(expectedAmount);
    });
  });

  describe('integration tests', () => {
    test('config values are used in calculations', () => {
      const hours = 40;
      const amount = calculateTotalAmount(hours);

      expect(amount).toBe(hours * config.billing.hourlyRate);
    });

    test('invoice numbers use prefix from config', () => {
      localStorage.clear();
      const invoice = generateInvoiceNumber();

      expect(invoice.startsWith(config.invoice.prefix + '-')).toBe(true);
    });
  });
});

describe('Config Environment Variables', () => {
  test('exports config object', () => {
    expect(config).toBeDefined();
    expect(typeof config).toBe('object');
  });

  test('exports generateInvoiceNumber function', () => {
    expect(generateInvoiceNumber).toBeDefined();
    expect(typeof generateInvoiceNumber).toBe('function');
  });

  test('exports calculateTotalAmount function', () => {
    expect(calculateTotalAmount).toBeDefined();
    expect(typeof calculateTotalAmount).toBe('function');
  });
});
