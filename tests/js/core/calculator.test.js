/**
 * Tests for the Calculator functionality
 * 
 * This test suite defines how the calculator OUGHT to function.
 * The implementation should be modified to meet these specifications.
 */

describe('Calculator', () => {
  // Set up the DOM for testing
  beforeEach(() => {
    document.body.innerHTML = `
      <div class="calculator">
        <div class="calculator-display">
          <div id="calculator-input">0</div>
          <div id="calculator-result"></div>
        </div>
        <div class="calculator-buttons">
          <button class="calculator-btn" data-action="clear">C</button>
          <button class="calculator-btn" data-action="backspace">⌫</button>
          <button class="calculator-btn" data-action="percent">%</button>
          <button class="calculator-btn" data-action="divide">÷</button>
          <button class="calculator-btn" data-value="7">7</button>
          <button class="calculator-btn" data-value="8">8</button>
          <button class="calculator-btn" data-value="9">9</button>
          <button class="calculator-btn" data-action="multiply">×</button>
          <button class="calculator-btn" data-value="4">4</button>
          <button class="calculator-btn" data-value="5">5</button>
          <button class="calculator-btn" data-value="6">6</button>
          <button class="calculator-btn" data-action="subtract">-</button>
          <button class="calculator-btn" data-value="1">1</button>
          <button class="calculator-btn" data-value="2">2</button>
          <button class="calculator-btn" data-value="3">3</button>
          <button class="calculator-btn" data-action="add">+</button>
          <button class="calculator-btn" data-value="0">0</button>
          <button class="calculator-btn" data-value=".">.</button>
          <button class="calculator-btn" data-action="equals">=</button>
        </div>
        <div class="calculator-history">
          <h3>Calculation History</h3>
          <ul id="history-list"></ul>
          <button id="clear-history">Clear History</button>
        </div>
      </div>
    `;
  });
  
  test('Calculator should initialize with default values', () => {
    // Initialize calculator
    window.Calculator.init();
    
    // Verify initial state
    expect(window.Calculator.input).toBe('0');
    expect(window.Calculator.result).toBe('');
    expect(window.Calculator.operator).toBeNull();
    expect(window.Calculator.waitingForSecondOperand).toBe(false);
    
    // Verify display
    expect(document.getElementById('calculator-input').textContent).toBe('0');
    expect(document.getElementById('calculator-result').textContent).toBe('');
  });
  
  test('Calculator should handle digit input', () => {
    // Initialize calculator
    window.Calculator.init();
    
    // Get digit buttons
    const button1 = document.querySelector('[data-value="1"]');
    const button2 = document.querySelector('[data-value="2"]');
    const button3 = document.querySelector('[data-value="3"]');
    
    // Click digit buttons
    button1.click();
    expect(window.Calculator.input).toBe('1');
    expect(document.getElementById('calculator-input').textContent).toBe('1');
    
    button2.click();
    expect(window.Calculator.input).toBe('12');
    expect(document.getElementById('calculator-input').textContent).toBe('12');
    
    button3.click();
    expect(window.Calculator.input).toBe('123');
    expect(document.getElementById('calculator-input').textContent).toBe('123');
  });
  
  test('Calculator should handle decimal point input', () => {
    // Initialize calculator
    window.Calculator.init();
    
    // Get decimal button and digit buttons
    const decimalButton = document.querySelector('[data-value="."]');
    const button5 = document.querySelector('[data-value="5"]');
    
    // Click decimal button
    decimalButton.click();
    expect(window.Calculator.input).toBe('0.');
    expect(document.getElementById('calculator-input').textContent).toBe('0.');
    
    // Click digit button
    button5.click();
    expect(window.Calculator.input).toBe('0.5');
    expect(document.getElementById('calculator-input').textContent).toBe('0.5');
    
    // Try to add another decimal point (should be ignored)
    decimalButton.click();
    expect(window.Calculator.input).toBe('0.5');
    expect(document.getElementById('calculator-input').textContent).toBe('0.5');
  });
  
  test('Calculator should handle clear action', () => {
    // Initialize calculator
    window.Calculator.init();
    
    // Get clear button and digit buttons
    const clearButton = document.querySelector('[data-action="clear"]');
    const button1 = document.querySelector('[data-value="1"]');
    const button2 = document.querySelector('[data-value="2"]');
    
    // Input some digits
    button1.click();
    button2.click();
    expect(window.Calculator.input).toBe('12');
    
    // Click clear button
    clearButton.click();
    
    // Verify that calculator was reset
    expect(window.Calculator.input).toBe('0');
    expect(window.Calculator.result).toBe('');
    expect(window.Calculator.operator).toBeNull();
    expect(window.Calculator.waitingForSecondOperand).toBe(false);
    expect(document.getElementById('calculator-input').textContent).toBe('0');
    expect(document.getElementById('calculator-result').textContent).toBe('');
  });
  
  test('Calculator should handle backspace action', () => {
    // Initialize calculator
    window.Calculator.init();
    
    // Get backspace button and digit buttons
    const backspaceButton = document.querySelector('[data-action="backspace"]');
    const button1 = document.querySelector('[data-value="1"]');
    const button2 = document.querySelector('[data-value="2"]');
    const button3 = document.querySelector('[data-value="3"]');
    
    // Input some digits
    button1.click();
    button2.click();
    button3.click();
    expect(window.Calculator.input).toBe('123');
    
    // Click backspace button
    backspaceButton.click();
    expect(window.Calculator.input).toBe('12');
    expect(document.getElementById('calculator-input').textContent).toBe('12');
    
    // Click backspace button again
    backspaceButton.click();
    expect(window.Calculator.input).toBe('1');
    expect(document.getElementById('calculator-input').textContent).toBe('1');
    
    // Click backspace button again
    backspaceButton.click();
    expect(window.Calculator.input).toBe('0');
    expect(document.getElementById('calculator-input').textContent).toBe('0');
    
    // Click backspace button when input is already 0
    backspaceButton.click();
    expect(window.Calculator.input).toBe('0');
    expect(document.getElementById('calculator-input').textContent).toBe('0');
  });
  
  test('Calculator should handle percent action', () => {
    // Initialize calculator
    window.Calculator.init();
    
    // Get percent button and digit buttons
    const percentButton = document.querySelector('[data-action="percent"]');
    const button5 = document.querySelector('[data-value="5"]');
    const button0 = document.querySelector('[data-value="0"]');
    
    // Input 50
    button5.click();
    button0.click();
    expect(window.Calculator.input).toBe('50');
    
    // Click percent button
    percentButton.click();
    
    // Verify that input was converted to percentage
    expect(window.Calculator.input).toBe('0.5');
    expect(document.getElementById('calculator-input').textContent).toBe('0.5');
  });
  
  test('Calculator should handle basic arithmetic operations', () => {
    // Initialize calculator
    window.Calculator.init();
    
    // Get operation buttons and digit buttons
    const addButton = document.querySelector('[data-action="add"]');
    const subtractButton = document.querySelector('[data-action="subtract"]');
    const multiplyButton = document.querySelector('[data-action="multiply"]');
    const divideButton = document.querySelector('[data-action="divide"]');
    const equalsButton = document.querySelector('[data-action="equals"]');
    
    const button2 = document.querySelector('[data-value="2"]');
    const button3 = document.querySelector('[data-value="3"]');
    const button5 = document.querySelector('[data-value="5"]');
    const button7 = document.querySelector('[data-value="7"]');
    
    // Test addition: 2 + 3 = 5
    button2.click();
    addButton.click();
    expect(window.Calculator.operator).toBe('+');
    expect(window.Calculator.result).toBe('2');
    expect(window.Calculator.waitingForSecondOperand).toBe(true);
    
    button3.click();
    equalsButton.click();
    expect(window.Calculator.input).toBe('5');
    expect(window.Calculator.result).toBe('5');
    expect(window.Calculator.operator).toBeNull();
    expect(document.getElementById('calculator-input').textContent).toBe('5');
    expect(document.getElementById('calculator-result').textContent).toBe('5');
    
    // Test subtraction: 7 - 2 = 5
    button7.click();
    subtractButton.click();
    expect(window.Calculator.operator).toBe('-');
    expect(window.Calculator.result).toBe('7');
    
    button2.click();
    equalsButton.click();
    expect(window.Calculator.input).toBe('5');
    expect(window.Calculator.result).toBe('5');
    expect(document.getElementById('calculator-input').textContent).toBe('5');
    expect(document.getElementById('calculator-result').textContent).toBe('5');
    
    // Test multiplication: 3 × 5 = 15
    button3.click();
    multiplyButton.click();
    expect(window.Calculator.operator).toBe('×');
    expect(window.Calculator.result).toBe('3');
    
    button5.click();
    equalsButton.click();
    expect(window.Calculator.input).toBe('15');
    expect(window.Calculator.result).toBe('15');
    expect(document.getElementById('calculator-input').textContent).toBe('15');
    expect(document.getElementById('calculator-result').textContent).toBe('15');
    
    // Test division: 15 ÷ 3 = 5
    divideButton.click();
    expect(window.Calculator.operator).toBe('÷');
    expect(window.Calculator.result).toBe('15');
    
    button3.click();
    equalsButton.click();
    expect(window.Calculator.input).toBe('5');
    expect(window.Calculator.result).toBe('5');
    expect(document.getElementById('calculator-input').textContent).toBe('5');
    expect(document.getElementById('calculator-result').textContent).toBe('5');
  });
  
  test('Calculator should handle chained operations', () => {
    // Initialize calculator
    window.Calculator.init();
    
    // Get operation buttons and digit buttons
    const addButton = document.querySelector('[data-action="add"]');
    const multiplyButton = document.querySelector('[data-action="multiply"]');
    const equalsButton = document.querySelector('[data-action="equals"]');
    
    const button2 = document.querySelector('[data-value="2"]');
    const button3 = document.querySelector('[data-value="3"]');
    const button4 = document.querySelector('[data-value="4"]');
    
    // Test chained operations: 2 + 3 × 4 = 14
    // (follows order of operations: 2 + (3 × 4) = 2 + 12 = 14)
    button2.click();
    addButton.click();
    button3.click();
    multiplyButton.click();
    button4.click();
    equalsButton.click();
    
    expect(window.Calculator.input).toBe('14');
    expect(window.Calculator.result).toBe('14');
    expect(document.getElementById('calculator-input').textContent).toBe('14');
    expect(document.getElementById('calculator-result').textContent).toBe('14');
  });
  
  test('Calculator should handle division by zero', () => {
    // Initialize calculator
    window.Calculator.init();
    
    // Get operation buttons and digit buttons
    const divideButton = document.querySelector('[data-action="divide"]');
    const equalsButton = document.querySelector('[data-action="equals"]');
    
    const button5 = document.querySelector('[data-value="5"]');
    const button0 = document.querySelector('[data-value="0"]');
    
    // Test division by zero: 5 ÷ 0
    button5.click();
    divideButton.click();
    button0.click();
    equalsButton.click();
    
    // Verify that error message is displayed
    expect(document.getElementById('calculator-input').textContent).toBe('Error');
    expect(document.getElementById('calculator-result').textContent).toBe('Cannot divide by zero');
  });
  
  test('Calculator should add calculations to history', () => {
    // Initialize calculator
    window.Calculator.init();
    
    // Get operation buttons and digit buttons
    const addButton = document.querySelector('[data-action="add"]');
    const subtractButton = document.querySelector('[data-action="subtract"]');
    const equalsButton = document.querySelector('[data-action="equals"]');
    
    const button2 = document.querySelector('[data-value="2"]');
    const button3 = document.querySelector('[data-value="3"]');
    const button5 = document.querySelector('[data-value="5"]');
    
    // Perform calculation: 2 + 3 = 5
    button2.click();
    addButton.click();
    button3.click();
    equalsButton.click();
    
    // Verify that calculation was added to history
    const historyItems = document.querySelectorAll('#history-list li');
    expect(historyItems.length).toBe(1);
    expect(historyItems[0].textContent).toContain('2 + 3 = 5');
    
    // Perform another calculation: 5 - 2 = 3
    button5.click();
    subtractButton.click();
    button2.click();
    equalsButton.click();
    
    // Verify that calculation was added to history
    const updatedHistoryItems = document.querySelectorAll('#history-list li');
    expect(updatedHistoryItems.length).toBe(2);
    expect(updatedHistoryItems[0].textContent).toContain('5 - 2 = 3');
    expect(updatedHistoryItems[1].textContent).toContain('2 + 3 = 5');
  });
  
  test('Calculator should clear history', () => {
    // Initialize calculator
    window.Calculator.init();
    
    // Get operation buttons and digit buttons
    const addButton = document.querySelector('[data-action="add"]');
    const equalsButton = document.querySelector('[data-action="equals"]');
    const clearHistoryButton = document.getElementById('clear-history');
    
    const button2 = document.querySelector('[data-value="2"]');
    const button3 = document.querySelector('[data-value="3"]');
    
    // Perform calculation: 2 + 3 = 5
    button2.click();
    addButton.click();
    button3.click();
    equalsButton.click();
    
    // Verify that calculation was added to history
    const historyItems = document.querySelectorAll('#history-list li');
    expect(historyItems.length).toBe(1);
    
    // Clear history
    clearHistoryButton.click();
    
    // Verify that history was cleared
    const updatedHistoryItems = document.querySelectorAll('#history-list li');
    expect(updatedHistoryItems.length).toBe(0);
  });
  
  test('Calculator should save history to localStorage', () => {
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
    
    // Initialize calculator
    window.Calculator.init();
    
    // Get operation buttons and digit buttons
    const addButton = document.querySelector('[data-action="add"]');
    const equalsButton = document.querySelector('[data-action="equals"]');
    
    const button2 = document.querySelector('[data-value="2"]');
    const button3 = document.querySelector('[data-value="3"]');
    
    // Perform calculation: 2 + 3 = 5
    button2.click();
    addButton.click();
    button3.click();
    equalsButton.click();
    
    // Verify that history was saved to localStorage
    const savedHistory = JSON.parse(localStorage.getItem('calculatorHistory'));
    expect(savedHistory.length).toBe(1);
    expect(savedHistory[0].expression).toBe('2 + 3 = 5');
  });
  
  test('Calculator should load history from localStorage', () => {
    // Mock localStorage with saved history
    const savedHistory = [
      { expression: '2 + 3 = 5', result: '5' },
      { expression: '10 - 4 = 6', result: '6' }
    ];
    
    const localStorageMock = (function() {
      let store = {
        calculatorHistory: JSON.stringify(savedHistory)
      };
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
    
    // Initialize calculator
    window.Calculator.init();
    
    // Verify that history was loaded from localStorage
    const historyItems = document.querySelectorAll('#history-list li');
    expect(historyItems.length).toBe(2);
    expect(historyItems[0].textContent).toContain('10 - 4 = 6');
    expect(historyItems[1].textContent).toContain('2 + 3 = 5');
  });
});
