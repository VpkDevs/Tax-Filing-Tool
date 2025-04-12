/**
 * Simple test file to verify that Jest is working correctly
 */

describe('Basic Tests', () => {
  test('true should be true', () => {
    expect(true).toBe(true);
  });

  test('1 + 1 should equal 2', () => {
    expect(1 + 1).toBe(2);
  });

  test('string concatenation works', () => {
    expect('hello ' + 'world').toBe('hello world');
  });
});

// Test DOM manipulation
describe('DOM Tests', () => {
  beforeEach(() => {
    // Set up the DOM for testing
    document.body.innerHTML = `
      <div id="test-div">
        <button id="test-button">Click me</button>
        <p id="test-paragraph">Test paragraph</p>
      </div>
    `;
  });

  test('can select elements', () => {
    // Get elements
    const button = document.querySelector('#test-button');
    const paragraph = document.querySelector('#test-paragraph');

    // Verify that elements exist
    expect(button).not.toBeNull();
    expect(paragraph).not.toBeNull();

    // Verify element content
    expect(button.textContent).toBe('Click me');
    expect(paragraph.textContent).toBe('Test paragraph');
  });

  test('can modify elements', () => {
    // Get element
    const button = document.querySelector('#test-button');

    // Modify element
    button.textContent = 'Modified';

    // Verify modification
    expect(button.textContent).toBe('Modified');
  });

  test('can add event listeners', () => {
    // Get elements
    const button = document.querySelector('#test-button');
    const paragraph = document.querySelector('#test-paragraph');

    // Add event listener
    button.addEventListener('click', () => {
      paragraph.textContent = 'Button clicked';
    });

    // Simulate click
    button.click();

    // Verify that event listener worked
    expect(paragraph.textContent).toBe('Button clicked');
  });
});
