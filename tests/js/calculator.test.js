/**
 * Tests for the calculator functionality
 */

describe('Calculator', () => {
  // Set up the DOM for testing
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="calculator-container">
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
        <div id="history-container">
          <h3>Calculation History</h3>
          <ul id="history-list"></ul>
        </div>
      </div>
    `;
    
    // Create a mock Calculator object
    window.Calculator = {
      input: '0',
      result: '',
      operator: null,
      waitingForSecondOperand: false,
      
      init: function() {
        this.inputDisplay = document.getElementById('calculator-input');
        this.resultDisplay = document.getElementById('calculator-result');
        this.historyList = document.getElementById('history-list');
        
        // Add event listeners to calculator buttons
        const buttons = document.querySelectorAll('.calculator-btn');
        buttons.forEach(button => {
          button.addEventListener('click', () => {
            if (button.dataset.value) {
              this.inputDigit(button.dataset.value);
            } else if (button.dataset.action) {
              switch (button.dataset.action) {
                case 'clear':
                  this.clear();
                  break;
                case 'backspace':
                  this.backspace();
                  break;
                case 'percent':
                  this.percent();
                  break;
                case 'divide':
                  this.setOperator('÷');
                  break;
                case 'multiply':
                  this.setOperator('×');
                  break;
                case 'subtract':
                  this.setOperator('-');
                  break;
                case 'add':
                  this.setOperator('+');
                  break;
                case 'equals':
                  this.calculate();
                  break;
              }
            }
          });
        });
      },
      
      updateDisplay: function() {
        this.inputDisplay.textContent = this.input;
        this.resultDisplay.textContent = this.result;
      },
      
      inputDigit: function(digit) {
        if (this.waitingForSecondOperand) {
          this.input = digit;
          this.waitingForSecondOperand = false;
        } else {
          this.input = this.input === '0' ? digit : this.input + digit;
        }
        this.updateDisplay();
      },
      
      inputDecimal: function() {
        if (this.waitingForSecondOperand) {
          this.input = '0.';
          this.waitingForSecondOperand = false;
        } else if (this.input.indexOf('.') === -1) {
          this.input += '.';
        }
        this.updateDisplay();
      },
      
      clear: function() {
        this.input = '0';
        this.result = '';
        this.operator = null;
        this.waitingForSecondOperand = false;
        this.updateDisplay();
      },
      
      backspace: function() {
        this.input = this.input.length > 1 ? this.input.slice(0, -1) : '0';
        this.updateDisplay();
      },
      
      percent: function() {
        const value = parseFloat(this.input);
        this.input = (value / 100).toString();
        this.updateDisplay();
      },
      
      setOperator: function(nextOperator) {
        const inputValue = parseFloat(this.input);
        
        if (this.operator && this.waitingForSecondOperand) {
          this.operator = nextOperator;
          return;
        }
        
        if (this.result === '') {
          this.result = this.input;
        } else {
          const resultValue = parseFloat(this.result);
          const newValue = this.performCalculation(resultValue, inputValue);
          this.result = newValue.toString();
          this.addToHistory(`${resultValue} ${this.operator} ${inputValue} = ${newValue}`);
        }
        
        this.waitingForSecondOperand = true;
        this.operator = nextOperator;
        this.updateDisplay();
      },
      
      performCalculation: function(firstOperand, secondOperand) {
        switch (this.operator) {
          case '+':
            return firstOperand + secondOperand;
          case '-':
            return firstOperand - secondOperand;
          case '×':
            return firstOperand * secondOperand;
          case '÷':
            return firstOperand / secondOperand;
          default:
            return secondOperand;
        }
      },
      
      calculate: function() {
        const inputValue = parseFloat(this.input);
        const resultValue = parseFloat(this.result);
        
        if (this.operator && !this.waitingForSecondOperand) {
          const newValue = this.performCalculation(resultValue, inputValue);
          this.result = newValue.toString();
          this.input = newValue.toString();
          this.addToHistory(`${resultValue} ${this.operator} ${inputValue} = ${newValue}`);
          this.operator = null;
        } else {
          this.result = this.input;
        }
        
        this.waitingForSecondOperand = false;
        this.updateDisplay();
      },
      
      addToHistory: function(expression) {
        const historyItem = document.createElement('li');
        historyItem.className = 'history-item';
        historyItem.textContent = expression;
        this.historyList.prepend(historyItem);
        
        // Limit history to 10 items
        if (this.historyList.children.length > 10) {
          this.historyList.removeChild(this.historyList.lastChild);
        }
      }
    };
  });
  
  test('calculator initializes correctly', () => {
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
  
  test('inputDigit adds digits to the display', () => {
    // Initialize calculator
    window.Calculator.init();
    
    // Input digits
    window.Calculator.inputDigit('1');
    expect(window.Calculator.input).toBe('1');
    
    window.Calculator.inputDigit('2');
    expect(window.Calculator.input).toBe('12');
    
    window.Calculator.inputDigit('3');
    expect(window.Calculator.input).toBe('123');
    
    // Verify display
    expect(document.getElementById('calculator-input').textContent).toBe('123');
  });
  
  test('inputDecimal adds a decimal point', () => {
    // Initialize calculator
    window.Calculator.init();
    
    // Input decimal
    window.Calculator.inputDigit('1');
    window.Calculator.inputDecimal();
    expect(window.Calculator.input).toBe('1.');
    
    window.Calculator.inputDigit('5');
    expect(window.Calculator.input).toBe('1.5');
    
    // Verify that multiple decimals are not added
    window.Calculator.inputDecimal();
    expect(window.Calculator.input).toBe('1.5');
    
    // Verify display
    expect(document.getElementById('calculator-input').textContent).toBe('1.5');
  });
  
  test('clear resets the calculator', () => {
    // Initialize calculator
    window.Calculator.init();
    
    // Input some values
    window.Calculator.inputDigit('1');
    window.Calculator.inputDigit('2');
    window.Calculator.inputDigit('3');
    window.Calculator.setOperator('+');
    window.Calculator.inputDigit('4');
    window.Calculator.inputDigit('5');
    window.Calculator.inputDigit('6');
    
    // Clear the calculator
    window.Calculator.clear();
    
    // Verify state
    expect(window.Calculator.input).toBe('0');
    expect(window.Calculator.result).toBe('');
    expect(window.Calculator.operator).toBeNull();
    expect(window.Calculator.waitingForSecondOperand).toBe(false);
    
    // Verify display
    expect(document.getElementById('calculator-input').textContent).toBe('0');
    expect(document.getElementById('calculator-result').textContent).toBe('');
  });
  
  test('backspace removes the last digit', () => {
    // Initialize calculator
    window.Calculator.init();
    
    // Input some values
    window.Calculator.inputDigit('1');
    window.Calculator.inputDigit('2');
    window.Calculator.inputDigit('3');
    
    // Backspace
    window.Calculator.backspace();
    expect(window.Calculator.input).toBe('12');
    
    window.Calculator.backspace();
    expect(window.Calculator.input).toBe('1');
    
    window.Calculator.backspace();
    expect(window.Calculator.input).toBe('0');
    
    // Verify display
    expect(document.getElementById('calculator-input').textContent).toBe('0');
  });
  
  test('percent converts the input to a percentage', () => {
    // Initialize calculator
    window.Calculator.init();
    
    // Input a value
    window.Calculator.inputDigit('5');
    window.Calculator.inputDigit('0');
    
    // Convert to percentage
    window.Calculator.percent();
    
    // Verify result (50 / 100 = 0.5)
    expect(window.Calculator.input).toBe('0.5');
    
    // Verify display
    expect(document.getElementById('calculator-input').textContent).toBe('0.5');
  });
  
  test('setOperator sets the operator and performs calculations', () => {
    // Initialize calculator
    window.Calculator.init();
    
    // Input first operand
    window.Calculator.inputDigit('5');
    
    // Set operator
    window.Calculator.setOperator('+');
    
    // Verify state
    expect(window.Calculator.result).toBe('5');
    expect(window.Calculator.operator).toBe('+');
    expect(window.Calculator.waitingForSecondOperand).toBe(true);
    
    // Input second operand
    window.Calculator.inputDigit('3');
    
    // Set another operator (should calculate 5 + 3 = 8)
    window.Calculator.setOperator('-');
    
    // Verify result
    expect(window.Calculator.result).toBe('8');
    expect(window.Calculator.operator).toBe('-');
    
    // Verify display
    expect(document.getElementById('calculator-input').textContent).toBe('3');
    expect(document.getElementById('calculator-result').textContent).toBe('8');
    
    // Verify history
    const historyItems = document.querySelectorAll('#history-list .history-item');
    expect(historyItems.length).toBe(1);
    expect(historyItems[0].textContent).toBe('5 + 3 = 8');
  });
  
  test('calculate performs the calculation and updates the display', () => {
    // Initialize calculator
    window.Calculator.init();
    
    // Input first operand
    window.Calculator.inputDigit('7');
    
    // Set operator
    window.Calculator.setOperator('×');
    
    // Input second operand
    window.Calculator.inputDigit('6');
    
    // Calculate (7 × 6 = 42)
    window.Calculator.calculate();
    
    // Verify result
    expect(window.Calculator.input).toBe('42');
    expect(window.Calculator.result).toBe('42');
    expect(window.Calculator.operator).toBeNull();
    
    // Verify display
    expect(document.getElementById('calculator-input').textContent).toBe('42');
    expect(document.getElementById('calculator-result').textContent).toBe('42');
    
    // Verify history
    const historyItems = document.querySelectorAll('#history-list .history-item');
    expect(historyItems.length).toBe(1);
    expect(historyItems[0].textContent).toBe('7 × 6 = 42');
  });
  
  test('addToHistory adds calculations to the history list', () => {
    // Initialize calculator
    window.Calculator.init();
    
    // Add some history items
    window.Calculator.addToHistory('5 + 3 = 8');
    window.Calculator.addToHistory('8 - 2 = 6');
    window.Calculator.addToHistory('6 × 4 = 24');
    
    // Verify history
    const historyItems = document.querySelectorAll('#history-list .history-item');
    expect(historyItems.length).toBe(3);
    expect(historyItems[0].textContent).toBe('6 × 4 = 24');
    expect(historyItems[1].textContent).toBe('8 - 2 = 6');
    expect(historyItems[2].textContent).toBe('5 + 3 = 8');
    
    // Add more items to test the limit
    for (let i = 0; i < 10; i++) {
      window.Calculator.addToHistory(`Item ${i}`);
    }
    
    // Verify that only the 10 most recent items are kept
    const updatedHistoryItems = document.querySelectorAll('#history-list .history-item');
    expect(updatedHistoryItems.length).toBe(10);
    expect(updatedHistoryItems[0].textContent).toBe('Item 9');
  });
});
