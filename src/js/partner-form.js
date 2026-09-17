import { $, $$ } from './utils.js';

const MAX_FILE_MB = 10;

const onlyDigits = (value) => value.replace(/\D/g, '');

function applyPattern(digits, pattern) {
  let out = '';
  let i = 0;
  for (const char of pattern) {
    if (i >= digits.length) break;
    out += char === '#' ? digits[i++] : char;
  }
  return out;
}

const MASKS = {
  cpf: (d) => applyPattern(d, '###.###.###-##'),
  cnpj: (d) => applyPattern(d, '##.###.###/####-##'),
  cep: (d) => applyPattern(d, '#####-###'),
  phone: (d) => applyPattern(d, d.length > 10 ? '(##) #####-####' : '(##) ####-####'),
};

function isValidCPF(digits) {
  if (digits.length !== 11 || /^(\d)\1+$/.test(digits)) return false;
  const check = (len) => {
    let sum = 0;
    for (let i = 0; i < len; i++) sum += Number(digits[i]) * (len + 1 - i);
    const rest = (sum * 10) % 11;
    return rest === 10 ? 0 : rest;
  };
  return check(9) === Number(digits[9]) && check(10) === Number(digits[10]);
}

function isValidCNPJ(digits) {
  if (digits.length !== 14 || /^(\d)\1+$/.test(digits)) return false;
  const check = (len) => {
    const weights = len === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const sum = weights.reduce((total, weight, i) => total + Number(digits[i]) * weight, 0);
    const rest = sum % 11;
    return rest < 2 ? 0 : 11 - rest;
  };
  return check(12) === Number(digits[12]) && check(13) === Number(digits[13]);
}

function validateMasked(input) {
  const digits = onlyDigits(input.value);
  let message = '';
  if (digits) {
    const type = input.dataset.mask;
    if (type === 'cpf' && !isValidCPF(digits)) message = 'Informe um CPF válido.';
    if (type === 'cnpj' && !isValidCNPJ(digits)) message = 'Informe um CNPJ válido.';
    if (type === 'phone' && digits.length < 10) message = 'Informe o telefone com DDD.';
    if (type === 'cep' && digits.length !== 8) message = 'Informe um CEP com 8 dígitos.';
  }
  input.setCustomValidity(message);
}

/**
 * Formulário "Seja Parceiro": alterna PF/PJ, campos condicionais, máscaras,
 * validação de CPF/CNPJ, anexos e envio.
 * O destino do envio fica em data-endpoint no <form> (vazio = envio desativado).
 */
export function initPartnerForm() {
  const form = $('#partnerForm');
  if (!form) return;

  const status = $('#formStatus');
  const submit = $('[type="submit"]', form);

  const showStatus = (kind, message) => {
    status.className = `pform__status is-${kind}`;
    status.textContent = message;
    status.hidden = false;
  };

  // Pessoa Física / Pessoa Jurídica
  const setType = (type) => {
    form.dataset.type = type;
    $$('[data-for]', form).forEach((group) => {
      const active = group.dataset.for === type;
      group.hidden = !active;
      $$('input, select, textarea', group).forEach((field) => { field.disabled = !active; });
    });
  };

  // campos que só aparecem com determinada resposta (data-show-if="campo=valor")
  const updateConditionals = () => {
    $$('[data-show-if]', form).forEach((block) => {
      const [name, value] = block.dataset.showIf.split('=');
      const selected = [...form.elements]
        .filter((f) => f.name === name && !f.disabled && (!['radio', 'checkbox'].includes(f.type) || f.checked))
        .map((f) => f.value);
      const visible = selected.includes(value);
      const groupHidden = Boolean(block.closest('[data-for]')?.hidden);
      block.hidden = !visible;
      $$('input, select, textarea', block).forEach((field) => { field.disabled = !visible || groupHidden; });
    });
  };

  const resetFiles = () => {
    $$('.pfile', form).forEach((box) => {
      box.classList.remove('has-file');
      const name = $('.pfile__name', box);
      name.textContent = name.dataset.empty;
    });
  };

  const params = new URLSearchParams(window.location.search);
  const initialType = params.get('tipo') === 'pj' ? 'pj' : 'pf';
  $(`input[name="tipo"][value="${initialType}"]`, form).checked = true;
  setType(initialType);
  updateConditionals();

  form.addEventListener('change', (event) => {
    if (event.target.name === 'tipo') setType(event.target.value);
    updateConditionals();
  });

  // máscaras
  $$('[data-mask]', form).forEach((input) => {
    input.addEventListener('input', () => {
      input.value = MASKS[input.dataset.mask](onlyDigits(input.value));
      validateMasked(input);
    });
  });

  // anexos
  $$('.pfile', form).forEach((box) => {
    const input = $('input[type="file"]', box);
    const name = $('.pfile__name', box);
    name.dataset.empty = name.textContent;

    input.addEventListener('change', () => {
      const files = [...input.files];
      const tooBig = files.find((file) => file.size > MAX_FILE_MB * 1024 * 1024);
      input.setCustomValidity(tooBig ? `O arquivo "${tooBig.name}" passa de ${MAX_FILE_MB} MB.` : '');
      box.classList.toggle('has-file', files.length > 0 && !tooBig);
      name.textContent = files.length ? files.map((file) => file.name).join(', ') : name.dataset.empty;
    });
    ['dragenter', 'dragover'].forEach((type) => box.addEventListener(type, () => box.classList.add('is-drag')));
    ['dragleave', 'drop'].forEach((type) => box.addEventListener(type, () => box.classList.remove('is-drag')));
  });

  // envio
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    $$('[data-mask]', form).forEach(validateMasked);
    form.classList.add('was-validated');
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const endpoint = form.dataset.endpoint?.trim();
    if (!endpoint) {
      showStatus('pending', 'Cadastro preenchido corretamente. O envio será ativado assim que a X3 definir o destino dos cadastros.');
      return;
    }

    submit.disabled = true;
    try {
      const response = await fetch(endpoint, { method: 'POST', body: new FormData(form) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      form.reset();
      form.classList.remove('was-validated');
      resetFiles();
      $('input[name="tipo"][value="pf"]', form).checked = true;
      setType('pf');
      updateConditionals();
      showStatus('success', 'Cadastro enviado! A equipe comercial da X3 vai entrar em contato com você.');
    } catch {
      showStatus('error', 'Não foi possível enviar agora. Tente novamente ou fale com a Central: (35) 3311-3920.');
    } finally {
      submit.disabled = false;
    }
  });
}
