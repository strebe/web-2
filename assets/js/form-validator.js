class FormValidator {
  static rules = {
    required: (value, fieldName) => value.trim() ? null : `${fieldName} é obrigatório`,
    minLength: (value, fieldName, length) => value.length >= length ? null : `${fieldName} deve ter pelo menos ${length} caracteres`,
    pattern: (value, fieldName, pattern, message) => pattern.test(value) ? null : message,
    cpf: (value) => FormValidator.validateCPF(value) ? null : 'CPF inválido',
    age: (value) => FormValidator.validateAge(value) ? null : 'Idade deve ser entre 16 e 120 anos',
    phone: (value) => /^\(\d{2}\)\s\d{5}-\d{4}$/.test(value) ? null : 'Formato: (00) 00000-0000',
    email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? null : 'E-mail inválido',
    cep: (value) => /^\d{5}-\d{3}$/.test(value) ? null : 'Formato: 00000-000',
    name: (value) => /^[a-zA-ZÀ-ÿ\s]+$/.test(value) ? null : 'Apenas letras são permitidas'
  };

  static masks = {
    cpf: (value) => value.replace(/\D/g, '').replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4'),
    phone: (value) => value.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3'),
    cep: (value) => value.replace(/\D/g, '').replace(/(\d{5})(\d{3})/, '$1-$2')
  };

  static validateCPF(value) {
    const cpf = value.replace(/\D/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cpf[i]) * (10 - i);
    let digit1 = 11 - (sum % 11);
    if (digit1 > 9) digit1 = 0;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cpf[i]) * (11 - i);
    let digit2 = 11 - (sum % 11);
    if (digit2 > 9) digit2 = 0;

    return digit1 === parseInt(cpf[9]) && digit2 === parseInt(cpf[10]);
  }

  static validateAge(value) {
    const today = new Date();
    const birth = new Date(value);
    let age = today.getFullYear() - birth.getFullYear();
    if (today.getMonth() < birth.getMonth() || 
        (today.getMonth() === birth.getMonth() && today.getDate() < birth.getDate())) {
      age--;
    }
    return age >= 16 && age <= 120;
  }

  static setFieldError(field, message) {
    const feedback = field.parentElement.querySelector('.invalid-feedback');
    
    if (message) {
      field.classList.add('is-invalid');
      field.classList.remove('is-valid');
      if (feedback) feedback.textContent = message;
    } else {
      field.classList.remove('is-invalid');
      if (field.value.trim() && field.type !== 'checkbox') {
        field.classList.add('is-valid');
      }
      if (feedback) feedback.textContent = '';
    }
  }

  static clearAllErrors(form) {
    const errorElements = form.querySelectorAll('.invalid-feedback');
    errorElements.forEach(error => error.textContent = '');
    
    const invalidFields = form.querySelectorAll('.is-invalid, .is-valid');
    invalidFields.forEach(field => field.classList.remove('is-invalid', 'is-valid'));
  }

  static applyMask(fieldId, maskType) {
    const field = document.getElementById(fieldId);
    if (field && FormValidator.masks[maskType]) {
      field.addEventListener('input', (e) => {
        e.target.value = FormValidator.masks[maskType](e.target.value);
      });
    }
  }

  static validateField(field, validations) {
    const value = field.value.trim();
    
    for (const validation of validations) {
      const error = FormValidator.rules[validation.rule](value, validation.fieldName, validation.param, validation.message);
      if (error) {
        FormValidator.setFieldError(field, error);
        return false;
      }
    }
    
    FormValidator.setFieldError(field, '');
    return true;
  }
}

// Shared utilities
window.AddressDB = {
  '90040191': { street: 'Rua da Praia', neighborhood: 'Centro Histórico', city: 'Porto Alegre', state: 'RS' },
  '01310100': { street: 'Avenida Paulista', neighborhood: 'Bela Vista', city: 'São Paulo', state: 'SP' },
  '20040020': { street: 'Avenida Rio Branco', neighborhood: 'Centro', city: 'Rio de Janeiro', state: 'RJ' }
};
