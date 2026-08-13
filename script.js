const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");

let current = "0";
let previous = null;
let operator = null;
let overwrite = false;

const OPERATOR_SYMBOLS = { "+": "+", "-": "−", "*": "×", "/": "÷", "%": "%" };

function updateDisplay() {
  resultEl.textContent = current;
  expressionEl.textContent =
    previous !== null && operator ? `${previous} ${OPERATOR_SYMBOLS[operator]}` : "";
}

function inputDigit(digit) {
  if (overwrite) {
    current = digit === "." ? "0." : digit;
    overwrite = false;
    return;
  }
  if (digit === "." && current.includes(".")) return;
  current = current === "0" && digit !== "." ? digit : current + digit;
}

function chooseOperator(op) {
  if (operator !== null && !overwrite) {
    compute();
  }
  previous = current;
  operator = op;
  overwrite = true;
}

function compute() {
  if (operator === null || previous === null) return;
  const a = parseFloat(previous);
  const b = parseFloat(current);
  if (Number.isNaN(a) || Number.isNaN(b)) return;

  let value;
  switch (operator) {
    case "+":
      value = a + b;
      break;
    case "-":
      value = a - b;
      break;
    case "*":
      value = a * b;
      break;
    case "/":
      value = b === 0 ? NaN : a / b;
      break;
    default:
      return;
  }

  current = Number.isNaN(value) ? "Error" : trimNumber(value);
  previous = null;
  operator = null;
  overwrite = true;
}

function trimNumber(value) {
  return parseFloat(value.toFixed(10)).toString();
}

function clearAll() {
  current = "0";
  previous = null;
  operator = null;
  overwrite = false;
}

function eraseLast() {
  if (overwrite) return;
  current = current.length > 1 ? current.slice(0, -1) : "0";
}

function applyPercent() {
  current = trimNumber(parseFloat(current) / 100);
}

document.querySelector(".buttons").addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;

  const { action, value } = btn.dataset;

  if (action === "clear") {
    clearAll();
  } else if (action === "erase") {
    eraseLast();
  } else if (action === "equals") {
    compute();
  } else if (value === "%") {
    applyPercent();
  } else if (["+", "-", "*", "/"].includes(value)) {
    chooseOperator(value);
  } else {
    inputDigit(value);
  }

  updateDisplay();
});

document.addEventListener("keydown", (e) => {
  if (e.key >= "0" && e.key <= "9") inputDigit(e.key);
  else if (e.key === ".") inputDigit(".");
  else if (["+", "-", "*", "/"].includes(e.key)) chooseOperator(e.key);
  else if (e.key === "Enter" || e.key === "=") compute();
  else if (e.key === "Backspace") eraseLast();
  else if (e.key === "Escape") clearAll();
  else return;

  updateDisplay();
});

updateDisplay();
