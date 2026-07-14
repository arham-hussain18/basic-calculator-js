const exprEl = document.getElementById('expr');
const resultEl = document.getElementById('result');

let current = '0';
let previous = null;
let operator = null;
let justEvaluated = false;

function updateDisplay(){
  resultEl.textContent = formatNumber(current);
  exprEl.textContent = previous !== null
    ? `${formatNumber(previous)} ${operator}`
    : '\u00A0';
}

function formatNumber(numStr){
  if(numStr === '' || numStr === '-') return numStr;
  const num = Number(numStr);
  if(Number.isNaN(num)) return 'Error';
  return num.toLocaleString('en-US', { maximumFractionDigits: 8 });
}

function inputDigit(d){
  if(justEvaluated){ current = d === '.' ? '0.' : d; justEvaluated = false; updateDisplay(); return; }
  if(current === '0' && d !== '.') current = d;
  else if(d === '.' && current.includes('.')) return;
  else current += d;
  updateDisplay();
}

function chooseOperator(op){
  if(operator && !justEvaluated) compute();
  previous = current;
  operator = op;
  current = '0';
  justEvaluated = false;
  updateDisplay();
}

function compute(){
  const a = parseFloat(previous);
  const b = parseFloat(current);
  if(Number.isNaN(a) || Number.isNaN(b)) return;
  let res;
  switch(operator){
    case '+': res = a + b; break;
    case '−': res = a - b; break;
    case '×': res = a * b; break;
    case '÷': res = b === 0 ? NaN : a / b; break;
    default: return;
  }
  current = Number.isNaN(res) ? 'Error' : String(round(res));
  operator = null;
  previous = null;
  justEvaluated = true;
  updateDisplay();
}

function round(n){ return Math.round((n + Number.EPSILON) * 1e8) / 1e8; }

function clearAll(){
  current = '0'; previous = null; operator = null; justEvaluated = false;
  updateDisplay();
}

function toggleSign(){
  if(current === '0') return;
  current = current.startsWith('-') ? current.slice(1) : '-' + current;
  updateDisplay();
}

function percent(){
  current = String(round(parseFloat(current) / 100));
  updateDisplay();
}

document.querySelector('.keys').addEventListener('click', e => {
  const btn = e.target.closest('button');
  if(!btn) return;
  const { num, op, action } = btn.dataset;
  if(num !== undefined) inputDigit(num);
  else if(op) chooseOperator(op);
  else if(action === 'equals') compute();
  else if(action === 'clear') clearAll();
  else if(action === 'sign') toggleSign();
  else if(action === 'percent') percent();
  else if(action === 'decimal') inputDigit('.');
});

// Keyboard support
const opMap = { '/': '÷', '*': '×', '-': '−', '+': '+' };
window.addEventListener('keydown', e => {
  if(e.key >= '0' && e.key <= '9') inputDigit(e.key);
  else if(e.key === '.') inputDigit('.');
  else if(opMap[e.key]) chooseOperator(opMap[e.key]);
  else if(e.key === 'Enter' || e.key === '=') { e.preventDefault(); compute(); }
  else if(e.key === 'Escape') clearAll();
  else if(e.key === 'Backspace'){
    current = current.length > 1 ? current.slice(0, -1) : '0';
    updateDisplay();
  } else if(e.key === '%'){ percent(); }
});

updateDisplay();
