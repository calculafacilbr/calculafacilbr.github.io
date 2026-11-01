
const money = n => new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
}).format(Number.isFinite(n) ? n : 0);

const defs = {
  juros: {
    title: 'Juros compostos',
    desc: 'Simule o crescimento de um valor com aportes mensais.',
    fields: [
      ['initial', 'Valor inicial (R$)', 'number', 1000],
      ['monthly', 'Aporte mensal (R$)', 'number', 100],
      ['rate', 'Taxa ao mês (%)', 'number', 0.8],
      ['months', 'Prazo (meses)', 'number', 24]
    ],
    calc: v => {
      let total = v.initial;
      for (let i = 0; i < v.months; i++) {
        total = total * (1 + v.rate / 100) + v.monthly;
      }
      const invested = v.initial + v.monthly * v.months;
      return [total, `Você teria investido ${money(invested)}. Rendimento estimado: ${money(total - invested)}.`];
    }
  },
  porcentagem: {
    title: 'Porcentagem',
    desc: 'Descubra quanto representa uma porcentagem de um valor.',
    fields: [
      ['base', 'Valor (R$)', 'number', 250],
      ['rate', 'Porcentagem (%)', 'number', 15]
    ],
    calc: v => {
      const r = v.base * v.rate / 100;
      return [r, `${v.rate}% de ${money(v.base)} equivale a ${money(r)}.`];
    }
  },
  desconto: {
    title: 'Calculadora de desconto',
    desc: 'Veja o preço final depois de aplicar um desconto.',
    fields: [
      ['base', 'Preço original (R$)', 'number', 199.9],
      ['rate', 'Desconto (%)', 'number', 20]
    ],
    calc: v => {
      const d = v.base * v.rate / 100;
      return [v.base - d, `Você economiza ${money(d)}. Preço antes do desconto: ${money(v.base)}.`];
    }
  },
  meta: {
    title: 'Meta de economia',
    desc: 'Calcule quanto guardar por mês para alcançar seu objetivo.',
    fields: [
      ['target', 'Meta (R$)', 'number', 5000],
      ['saved', 'Quanto já tem (R$)', 'number', 500],
      ['months', 'Em quantos meses?', 'number', 12]
    ],
    calc: v => {
      const left = Math.max(0, v.target - v.saved);
      const months = Math.max(1, v.months);
      return [
        left / months,
        `Guarde aproximadamente ${money(left / months)} por mês durante ${months} meses.`,
        'Por mês'
      ];
    }
  },
  parcelas: {
    title: 'Divisor de parcelas',
    desc: 'Divida o valor em parcelas iguais, sem juros.',
    fields: [
      ['base', 'Valor total (R$)', 'number', 1200],
      ['months', 'Número de parcelas', 'number', 10]
    ],
    calc: v => {
      const months = Math.max(1, v.months);
      return [v.base / months, `${months} parcelas iguais, sem juros. Total: ${money(v.base)}.`];
    }
  },
  rendimento: {
    title: 'Rendimento mensal',
    desc: 'Faça uma simulação simples de rendimento sobre um valor.',
    fields: [
      ['base', 'Valor aplicado (R$)', 'number', 1000],
      ['rate', 'Taxa ao mês (%)', 'number', 0.8]
    ],
    calc: v => {
      const r = v.base * v.rate / 100;
      return [r, `Estimativa de rendimento bruto em um mês. Saldo ilustrativo: ${money(v.base + r)}.`];
    }
  }
};

let current = 'juros';
const fields = document.getElementById('fields');

function render(key) {
  current = key;
  const d = defs[key];

  document.getElementById('calcTitle').textContent = d.title;
  document.getElementById('calcDesc').textContent = d.desc;

  fields.innerHTML = d.fields.map(([id, label, type, val]) =>
    `<div class="field">
      <label for="${id}">${label}</label>
      <input id="${id}" type="${type}" min="0" step="any" value="${val}">
    </div>`
  ).join('');

  fields.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', update);
  });

  update();

  document.querySelectorAll('.tool-card').forEach(button => {
    button.classList.toggle('active', button.dataset.tool === key);
  });
}

function update() {
  const d = defs[current];
  const v = {};

  d.fields.forEach(([id]) => {
    v[id] = Math.max(0, Number(document.getElementById(id)?.value) || 0);
  });

  const out = d.calc(v);

  document.getElementById('result').textContent = money(out[0]);
  document.getElementById('resultNote').textContent = out[1];
  document.getElementById('extra').textContent =
    out[2] || 'Resultado calculado automaticamente.';
}

document.querySelectorAll('.tool-card').forEach(button => {
  button.addEventListener('click', () => {
    render(button.dataset.tool);
    document.getElementById('calculator').scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  });
});

document.getElementById('search').addEventListener('input', event => {
  const q = event.target.value.toLocaleLowerCase('pt-BR');

  document.querySelectorAll('.tool-card').forEach(button => {
    button.hidden = !button.innerText.toLocaleLowerCase('pt-BR').includes(q);
  });
});

document.getElementById('year').textContent = new Date().getFullYear();

render('juros');
