/**
 * Tests for the Tax Logic functionality
 * 
 * This test suite defines how the tax calculation logic OUGHT to function.
 * The implementation should be modified to meet these specifications.
 */

describe('Tax Logic', () => {
  beforeEach(() => {
    // Set up any necessary DOM elements
    document.body.innerHTML = `
      <div id="tax-calculator">
        <div class="tax-inputs">
          <div class="form-group">
            <label for="income">Annual Income</label>
            <input type="number" id="income" name="income" min="0" step="0.01">
          </div>
          <div class="form-group">
            <label for="filingStatus">Filing Status</label>
            <select id="filingStatus" name="filingStatus">
              <option value="single">Single</option>
              <option value="married">Married Filing Jointly</option>
              <option value="marriedSeparate">Married Filing Separately</option>
              <option value="headOfHousehold">Head of Household</option>
              <option value="widow">Qualifying Widow(er)</option>
            </select>
          </div>
          <div class="form-group">
            <label for="dependents">Number of Dependents</label>
            <input type="number" id="dependents" name="dependents" min="0" step="1" value="0">
          </div>
          <div class="form-group">
            <label for="deductions">Itemized Deductions</label>
            <input type="number" id="deductions" name="deductions" min="0" step="0.01" value="0">
          </div>
          <button id="calculate-tax" class="btn btn-primary">Calculate Tax</button>
        </div>
        <div class="tax-results">
          <div class="result-item">
            <span class="result-label">Gross Income:</span>
            <span id="gross-income" class="result-value">$0.00</span>
          </div>
          <div class="result-item">
            <span class="result-label">Adjusted Gross Income:</span>
            <span id="adjusted-income" class="result-value">$0.00</span>
          </div>
          <div class="result-item">
            <span class="result-label">Standard Deduction:</span>
            <span id="standard-deduction" class="result-value">$0.00</span>
          </div>
          <div class="result-item">
            <span class="result-label">Itemized Deductions:</span>
            <span id="itemized-deduction" class="result-value">$0.00</span>
          </div>
          <div class="result-item">
            <span class="result-label">Taxable Income:</span>
            <span id="taxable-income" class="result-value">$0.00</span>
          </div>
          <div class="result-item">
            <span class="result-label">Tax Liability:</span>
            <span id="tax-liability" class="result-value">$0.00</span>
          </div>
          <div class="result-item">
            <span class="result-label">Effective Tax Rate:</span>
            <span id="effective-tax-rate" class="result-value">0.00%</span>
          </div>
        </div>
        <div class="tax-breakdown">
          <h3>Tax Bracket Breakdown</h3>
          <div id="tax-brackets"></div>
        </div>
      </div>
    `;
  });
  
  test('TaxLogic should calculate standard deduction based on filing status', () => {
    // Test standard deduction for different filing statuses
    expect(window.TaxLogic.getStandardDeduction('single')).toBe(12950);
    expect(window.TaxLogic.getStandardDeduction('married')).toBe(25900);
    expect(window.TaxLogic.getStandardDeduction('marriedSeparate')).toBe(12950);
    expect(window.TaxLogic.getStandardDeduction('headOfHousehold')).toBe(19400);
    expect(window.TaxLogic.getStandardDeduction('widow')).toBe(25900);
  });
  
  test('TaxLogic should calculate tax brackets based on filing status', () => {
    // Test tax brackets for single filing status
    const singleBrackets = window.TaxLogic.getTaxBrackets('single');
    expect(singleBrackets.length).toBe(7);
    expect(singleBrackets[0].rate).toBe(0.10);
    expect(singleBrackets[0].min).toBe(0);
    expect(singleBrackets[0].max).toBe(10275);
    expect(singleBrackets[6].rate).toBe(0.37);
    expect(singleBrackets[6].min).toBe(539900);
    expect(singleBrackets[6].max).toBe(Infinity);
    
    // Test tax brackets for married filing jointly
    const marriedBrackets = window.TaxLogic.getTaxBrackets('married');
    expect(marriedBrackets.length).toBe(7);
    expect(marriedBrackets[0].rate).toBe(0.10);
    expect(marriedBrackets[0].min).toBe(0);
    expect(marriedBrackets[0].max).toBe(20550);
    expect(marriedBrackets[6].rate).toBe(0.37);
    expect(marriedBrackets[6].min).toBe(647850);
    expect(marriedBrackets[6].max).toBe(Infinity);
  });
  
  test('TaxLogic should calculate dependent exemptions', () => {
    // Test dependent exemptions
    expect(window.TaxLogic.getDependentExemption(0)).toBe(0);
    expect(window.TaxLogic.getDependentExemption(1)).toBe(2000);
    expect(window.TaxLogic.getDependentExemption(3)).toBe(6000);
  });
  
  test('TaxLogic should calculate taxable income', () => {
    // Test taxable income calculation
    const grossIncome = 75000;
    const filingStatus = 'single';
    const dependents = 2;
    const itemizedDeductions = 10000;
    
    // Standard deduction for single is $12,950
    // Dependent exemption is $2,000 per dependent
    // Taxable income should be: $75,000 - $12,950 - $4,000 = $58,050
    
    const taxableIncome = window.TaxLogic.calculateTaxableIncome(
      grossIncome,
      filingStatus,
      dependents,
      itemizedDeductions
    );
    
    expect(taxableIncome).toBe(58050);
    
    // Test with itemized deductions greater than standard deduction
    const largeItemizedDeductions = 15000;
    
    // Taxable income should be: $75,000 - $15,000 - $4,000 = $56,000
    
    const taxableIncomeWithItemized = window.TaxLogic.calculateTaxableIncome(
      grossIncome,
      filingStatus,
      dependents,
      largeItemizedDeductions
    );
    
    expect(taxableIncomeWithItemized).toBe(56000);
  });
  
  test('TaxLogic should calculate tax liability', () => {
    // Test tax liability calculation for single filing status
    const taxableIncome = 58050;
    const filingStatus = 'single';
    
    // Tax brackets for single:
    // 10%: $0 - $10,275
    // 12%: $10,276 - $41,775
    // 22%: $41,776 - $89,075
    // ...
    
    // Tax calculation:
    // 10% of $10,275 = $1,027.50
    // 12% of ($41,775 - $10,275) = $3,780.00
    // 22% of ($58,050 - $41,775) = $3,580.50
    // Total: $8,388.00
    
    const taxLiability = window.TaxLogic.calculateTaxLiability(taxableIncome, filingStatus);
    
    expect(Math.round(taxLiability)).toBe(8388);
  });
  
  test('TaxLogic should calculate effective tax rate', () => {
    // Test effective tax rate calculation
    const grossIncome = 75000;
    const taxLiability = 8388;
    
    // Effective tax rate = (Tax Liability / Gross Income) * 100
    // $8,388 / $75,000 * 100 = 11.18%
    
    const effectiveTaxRate = window.TaxLogic.calculateEffectiveTaxRate(grossIncome, taxLiability);
    
    expect(Math.round(effectiveTaxRate * 100) / 100).toBe(11.18);
  });
  
  test('TaxLogic should calculate tax breakdown by bracket', () => {
    // Test tax breakdown calculation
    const taxableIncome = 58050;
    const filingStatus = 'single';
    
    const breakdown = window.TaxLogic.calculateTaxBreakdown(taxableIncome, filingStatus);
    
    expect(breakdown.length).toBe(3);
    
    // First bracket: 10% of $10,275
    expect(breakdown[0].rate).toBe(0.10);
    expect(breakdown[0].amount).toBe(1027.50);
    expect(breakdown[0].income).toBe(10275);
    
    // Second bracket: 12% of ($41,775 - $10,275) = $31,500
    expect(breakdown[1].rate).toBe(0.12);
    expect(breakdown[1].amount).toBe(3780.00);
    expect(breakdown[1].income).toBe(31500);
    
    // Third bracket: 22% of ($58,050 - $41,775) = $16,275
    expect(breakdown[2].rate).toBe(0.22);
    expect(breakdown[2].amount).toBe(3580.50);
    expect(breakdown[2].income).toBe(16275);
  });
  
  test('TaxLogic should handle zero income', () => {
    // Test with zero income
    const grossIncome = 0;
    const filingStatus = 'single';
    const dependents = 0;
    const itemizedDeductions = 0;
    
    const taxableIncome = window.TaxLogic.calculateTaxableIncome(
      grossIncome,
      filingStatus,
      dependents,
      itemizedDeductions
    );
    
    expect(taxableIncome).toBe(0);
    
    const taxLiability = window.TaxLogic.calculateTaxLiability(taxableIncome, filingStatus);
    
    expect(taxLiability).toBe(0);
    
    const effectiveTaxRate = window.TaxLogic.calculateEffectiveTaxRate(grossIncome, taxLiability);
    
    expect(effectiveTaxRate).toBe(0);
  });
  
  test('TaxLogic should handle negative taxable income', () => {
    // Test with deductions exceeding income
    const grossIncome = 10000;
    const filingStatus = 'single';
    const dependents = 0;
    const itemizedDeductions = 15000;
    
    const taxableIncome = window.TaxLogic.calculateTaxableIncome(
      grossIncome,
      filingStatus,
      dependents,
      itemizedDeductions
    );
    
    // Taxable income should be 0, not negative
    expect(taxableIncome).toBe(0);
    
    const taxLiability = window.TaxLogic.calculateTaxLiability(taxableIncome, filingStatus);
    
    expect(taxLiability).toBe(0);
  });
  
  test('TaxLogic should calculate tax for high income', () => {
    // Test with high income
    const grossIncome = 1000000;
    const filingStatus = 'single';
    const dependents = 0;
    const itemizedDeductions = 20000;
    
    const taxableIncome = window.TaxLogic.calculateTaxableIncome(
      grossIncome,
      filingStatus,
      dependents,
      itemizedDeductions
    );
    
    // Taxable income should be $1,000,000 - $20,000 = $980,000
    expect(taxableIncome).toBe(980000);
    
    const taxLiability = window.TaxLogic.calculateTaxLiability(taxableIncome, filingStatus);
    
    // Tax calculation for high income is complex, but should be around $330,000
    expect(taxLiability).toBeGreaterThan(300000);
    expect(taxLiability).toBeLessThan(350000);
    
    const effectiveTaxRate = window.TaxLogic.calculateEffectiveTaxRate(grossIncome, taxLiability);
    
    // Effective tax rate should be around 33%
    expect(effectiveTaxRate).toBeGreaterThan(30);
    expect(effectiveTaxRate).toBeLessThan(35);
  });
  
  test('TaxLogic should update UI with calculation results', () => {
    // Set up input values
    document.getElementById('income').value = '75000';
    document.getElementById('filingStatus').value = 'single';
    document.getElementById('dependents').value = '2';
    document.getElementById('deductions').value = '10000';
    
    // Initialize tax calculator
    window.TaxLogic.init();
    
    // Trigger calculation
    document.getElementById('calculate-tax').click();
    
    // Verify that UI was updated with calculation results
    expect(document.getElementById('gross-income').textContent).toBe('$75,000.00');
    expect(document.getElementById('adjusted-income').textContent).toBe('$71,000.00'); // After dependent exemptions
    expect(document.getElementById('standard-deduction').textContent).toBe('$12,950.00');
    expect(document.getElementById('itemized-deduction').textContent).toBe('$10,000.00');
    expect(document.getElementById('taxable-income').textContent).toBe('$58,050.00');
    expect(document.getElementById('tax-liability').textContent).toBe('$8,388.00');
    expect(document.getElementById('effective-tax-rate').textContent).toBe('11.18%');
    
    // Verify that tax bracket breakdown was generated
    const taxBrackets = document.getElementById('tax-brackets');
    expect(taxBrackets.children.length).toBe(3); // 3 brackets used in calculation
  });
  
  test('TaxLogic should save calculation history', () => {
    // Mock localStorage
    const localStorageMock = (function() {
      let store = {};
      return {
        getItem: function(key) {
          return store[key] || null;
        },
        setItem: function(key, value) {
          store[key] = value.toString();
        },
        clear: function() {
          store = {};
        }
      };
    })();
    
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });
    
    // Set up input values
    document.getElementById('income').value = '75000';
    document.getElementById('filingStatus').value = 'single';
    document.getElementById('dependents').value = '2';
    document.getElementById('deductions').value = '10000';
    
    // Initialize tax calculator
    window.TaxLogic.init();
    
    // Trigger calculation
    document.getElementById('calculate-tax').click();
    
    // Verify that calculation was saved to history
    const savedHistory = JSON.parse(localStorage.getItem('taxCalculationHistory'));
    expect(savedHistory.length).toBe(1);
    expect(savedHistory[0].grossIncome).toBe(75000);
    expect(savedHistory[0].filingStatus).toBe('single');
    expect(savedHistory[0].dependents).toBe(2);
    expect(savedHistory[0].itemizedDeductions).toBe(10000);
    expect(savedHistory[0].taxLiability).toBe(8388);
  });
});
