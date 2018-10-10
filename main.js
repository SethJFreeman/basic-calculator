
const calculate = (n1, operator, n2) => {
  const firstNum = parseFloat(n1); // Number 1
  const secondNum = parseFloat(n2); // Number 2
  if (operator === 'add') return firstNum + secondNum; // Add Both Numbers
  if (operator === 'subtract') return firstNum - secondNum; // Subtract Both Numbers
  if (operator === 'multiply') return firstNum * secondNum; // Multiply Both Numbers
  if (operator === 'divide') return firstNum / secondNum; // Divide Both Numbers
}

const getKeyType = key => { // Check The Key Type
  const { action } = key.dataset;
  if (!action) return 'number'; // If Doesnt Include A data-action On The HTML Element Set Key Type As A Number (0-9)
  if (
    action === 'add' || // data-action = "add"
    action === 'subtract' ||  // data-action = "subtract"
    action === 'multiply' ||  // data-action = "multiply"
    action === 'divide'  // data-action = "divide"
  ) return 'operator';
  // For everything else, return the action
  return action;
}

const createResultString = (key, displayedNum, state) => {
  const keyContent = key.textContent
  const keyType = getKeyType(key)
  const {
    firstValue,
    operator,
    modValue,
    previousKeyType
  } = state

  if (keyType === 'number') {
    return displayedNum === '0' ||
      previousKeyType === 'operator' ||
      previousKeyType === 'calculate'
      ? keyContent
      : displayedNum + keyContent
  }

  if (keyType === 'decimal') { // Check If Pressed Key Is A Decimal
    if (!displayedNum.includes('.')) return displayedNum + '.'; // If There Is Not Already A Decimal On The Display, Add A Decimal
    if (previousKeyType === 'operator' || previousKeyType === 'calculate') return '0.'; // If The Previous Key Hit Was An Operator Or Equals Key And The User Hits The Decimal, Add A Zero + A Decimal To The Display
    return displayedNum;
  }

  if (keyType === 'operator') { // If The Clicked Key Was An Operator
    return firstValue &&
      operator &&
      previousKeyType !== 'operator' &&
      previousKeyType !== 'calculate'
      ? calculate(firstValue, operator, displayedNum)
      : displayedNum
  }

  if (keyType === 'clear') return 0; // If The Key Pressed Was The AC / CE Button Then Return 0

  if (keyType === 'calculate') {
    return firstValue
      ? previousKeyType === 'calculate'
        ? calculate(displayedNum, operator, modValue)
        : calculate(firstValue, operator, displayedNum)
      : displayedNum
  }
}

const updateCalculatorState = (key, calculator, calculatedValue, displayedNum) => {
  const keyType = getKeyType(key)
  const {
    firstValue,
    operator,
    modValue,
    previousKeyType
  } = calculator.dataset

  calculator.dataset.previousKeyType = keyType

  if (keyType === 'operator') {
    calculator.dataset.operator = key.dataset.action
    calculator.dataset.firstValue = firstValue &&
      operator &&
      previousKeyType !== 'operator' &&
      previousKeyType !== 'calculate'
      ? calculatedValue
      : displayedNum
  }

  if (keyType === 'calculate') {
    calculator.dataset.modValue = firstValue && previousKeyType === 'calculate'
      ? modValue
      : displayedNum
  }

  if (keyType === 'clear' && key.textContent === 'AC') { // If AC Button Was Pressed Clear All History
    calculator.dataset.firstValue = '';
    calculator.dataset.modValue = '';
    calculator.dataset.operator = '';
    calculator.dataset.previousKeyType = '';
  }
}

const updateVisualState = (key, calculator) => {
  const keyType = getKeyType(key); // Call getKeyType(key) function to retain the type of key
  Array.from(key.parentNode.children).forEach(k => k.classList.remove('is-depressed'))

  if (keyType === 'operator') key.classList.add('is-depressed'); // Make the background darker of an opperator button if it was pressed
  if (keyType === 'clear' && key.textContent !== 'AC') key.textContent = 'AC'; // If the keytype is "clear" change the button text to AC
  if (keyType !== 'clear') { // Also if the keytype is not clear...
    const clearButton = calculator.querySelector('[data-action=clear]'); // Set the variable clearButton to the clear key
    clearButton.textContent = 'CE'; // Change the text content to CE
  }
}

const calculator = document.querySelector('.calculator'); // Add Elements Into Variables
const display = calculator.querySelector('.calculator__display');  // Add Elements Into Variables
const keys = calculator.querySelector('.calculator__keys');  // Add Elements Into Variables

keys.addEventListener('click', e => { // Checks If Clicked Key
  if (!e.target.matches('button')) return;
  const key = e.target; // Set Target Key To A Variable
  const displayedNum = display.textContent; // Get The Displayed Text
  const resultString = createResultString(key, displayedNum, calculator.dataset);

  display.textContent = resultString; //  The Displayed Text Is Equal To The Result String
  updateCalculatorState(key, calculator, resultString, displayedNum); // call updateCalculatorState
  updateVisualState(key, calculator); // call updateVisualState
})
