// Setup file for Jest tests

// Mock window.scrollTo
window.scrollTo = jest.fn();

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    length: 0,
    key: jest.fn(i => Object.keys(store)[i] || null),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock sessionStorage
const sessionStorageMock = (function() {
  let store = {};
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn(key => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    length: 0,
    key: jest.fn(i => Object.keys(store)[i] || null),
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock,
});

// Mock document.createElement
const originalCreateElement = document.createElement;
document.createElement = jest.fn(tag => {
  const element = originalCreateElement.call(document, tag);
  
  // Add missing properties for specific elements
  if (tag === 'div') {
    element.classList = {
      add: jest.fn(),
      remove: jest.fn(),
      toggle: jest.fn(),
      contains: jest.fn().mockReturnValue(false),
    };
  }
  
  return element;
});

// Mock document.querySelector and document.querySelectorAll
document.querySelector = jest.fn().mockImplementation(selector => {
  if (selector === '.filing-progress-fill') {
    return { style: { width: '' } };
  }
  if (selector === '.filing-progress-text .current-step') {
    return { textContent: '' };
  }
  if (selector === '.filing-tool') {
    return { offsetTop: 100 };
  }
  return null;
});

document.querySelectorAll = jest.fn().mockImplementation(selector => {
  if (selector === '.next-step' || selector === '.prev-step') {
    return [];
  }
  if (selector === '.step-indicator') {
    return [];
  }
  if (selector === 'nav a') {
    return [];
  }
  if (selector === 'section') {
    return [];
  }
  if (selector === '.status-step') {
    return [
      { classList: { add: jest.fn(), remove: jest.fn(), contains: jest.fn() }, querySelector: jest.fn() },
      { classList: { add: jest.fn(), remove: jest.fn(), contains: jest.fn() }, querySelector: jest.fn() },
      { classList: { add: jest.fn(), remove: jest.fn(), contains: jest.fn() }, querySelector: jest.fn() },
      { classList: { add: jest.fn(), remove: jest.fn(), contains: jest.fn() }, querySelector: jest.fn() },
      { classList: { add: jest.fn(), remove: jest.fn(), contains: jest.fn() }, querySelector: jest.fn() },
    ];
  }
  return [];
});

// Mock getElementById
document.getElementById = jest.fn().mockImplementation(id => {
  if (id === 'claimProcessTracker') {
    return {
      querySelectorAll: jest.fn().mockReturnValue([
        { classList: { add: jest.fn(), remove: jest.fn() }, querySelector: jest.fn() },
        { classList: { add: jest.fn(), remove: jest.fn() }, querySelector: jest.fn() },
        { classList: { add: jest.fn(), remove: jest.fn() }, querySelector: jest.fn() },
        { classList: { add: jest.fn(), remove: jest.fn() }, querySelector: jest.fn() },
        { classList: { add: jest.fn(), remove: jest.fn() }, querySelector: jest.fn() },
      ])
    };
  }
  if (id === 'autoFillIRS' || id === 'autoFillTaxReturn' || id === 'autoFillManual') {
    return {
      classList: {
        add: jest.fn(),
        remove: jest.fn(),
      },
      addEventListener: jest.fn(),
    };
  }
  if (id === 'fullName' || id === 'ssn' || id === 'filingStatusTax' || id === 'phoneNumber') {
    return {
      value: '',
      dispatchEvent: jest.fn(),
    };
  }
  if (id.startsWith('filingStep')) {
    return {
      classList: {
        add: jest.fn(),
        remove: jest.fn(),
      }
    };
  }
  return null;
});

// Mock addEventListener
window.addEventListener = jest.fn();
document.addEventListener = jest.fn();

// Mock console methods
console.log = jest.fn();
console.warn = jest.fn();
console.error = jest.fn();
