class CustomerFormHandler {
  static initialized = false;

  static initializeIfNeeded() {
    const form = document.getElementById('customerForm');
    if (!form) {
      // If form not found, try again after a short delay
      setTimeout(() => this.initializeIfNeeded(), 100);
      return;
    }

    // Always reinitialize to ensure components are properly set up
    this.initialized = false;
    this.initialize(form);
    this.initialized = true;
  }

  static initialize(form) {
    // Add real-time validation to all inputs
    const allInputs = form.querySelectorAll('input, select, textarea');
    allInputs.forEach(input => {
      // Remove error styling when user starts typing
      input.addEventListener('input', () => {
        this.clearFieldError(input);
      });

      // Validate on blur
      input.addEventListener('blur', () => {
        FormValidator.validateField(input, this.getValidationRules(input));
      });

      // Special handling for checkbox (terms)
      if (input.type === 'checkbox') {
        input.addEventListener('change', () => {
          this.clearFieldError(input);
        });
      }
    });

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit(form, allInputs);
    });

    // Add input masks
    this.addInputMasks();
  }

  static clearFieldError(input) {
    input.classList.remove('is-invalid');
    const feedback = input.nextElementSibling;
    if (feedback && feedback.classList.contains('invalid-feedback')) {
      feedback.textContent = '';
    }
  }

  static handleFormSubmit(form, inputs) {
    let isValid = true;
    
    // Clear all previous errors
    FormValidator.clearAllErrors(form);

    // Validate all fields
    inputs.forEach(field => {
      const rules = this.getValidationRules(field);
      if (!FormValidator.validateField(field, rules)) {
        isValid = false;
      }
    });

    // Special validation for terms checkbox
    const termsCheckbox = form.querySelector('#terms');
    if (termsCheckbox && !termsCheckbox.checked) {
      FormValidator.setFieldError(termsCheckbox, 'Você deve aceitar os termos de uso');
      isValid = false;
    }

    if (isValid) {
      this.showSuccessModal(form);
    }
  }

  static getValidationRules(field) {
    const rules = [];
    const fieldName = this.getFieldDisplayName(field);

    if (field.hasAttribute('required')) {
      rules.push({ rule: 'required', fieldName });
    }

    switch (field.type) {
      case 'email':
        if (field.value.trim()) {
          rules.push({ rule: 'email', fieldName });
        }
        break;
      case 'tel':
        if (field.value.trim()) {
          rules.push({ rule: 'phone', fieldName });
        }
        break;
      case 'date':
        if (field.name === 'birthDate' && field.value.trim()) {
          rules.push({ rule: 'age', fieldName });
        }
        break;
    }

    if (field.name === 'cpf' && field.value.trim()) {
      rules.push({ rule: 'cpf', fieldName });
    }

    if ((field.name === 'firstName' || field.name === 'lastName') && field.value.trim()) {
      rules.push({ rule: 'name', fieldName });
    }

    if (field.name === 'cep' && field.value.trim()) {
      rules.push({ rule: 'cep', fieldName });
    }

    return rules;
  }

  static getFieldDisplayName(field) {
    const names = {
      firstName: 'Nome',
      lastName: 'Sobrenome', 
      cpf: 'CPF',
      birthDate: 'Data de nascimento',
      phone: 'Telefone',
      email: 'E-mail',
      cep: 'CEP',
      street: 'Endereço',
      number: 'Número',
      neighborhood: 'Bairro',
      city: 'Cidade',
      state: 'Estado'
    };
    return names[field.name] || field.name;
  }

  static addInputMasks() {
    // Apply CPF mask
    FormValidator.applyMask('cpf', 'cpf');
    
    // Apply phone mask
    FormValidator.applyMask('phone', 'phone');
    
    // Apply CEP mask
    FormValidator.applyMask('cep', 'cep');

    // Name fields - only letters and spaces
    const nameFields = document.querySelectorAll('input[name="firstName"], input[name="lastName"]');
    nameFields.forEach(field => {
      field.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, '');
      });
    });
  }

  static showSuccessModal(form) {
    const modal = document.getElementById('successModal');
    if (modal && typeof bootstrap !== 'undefined') {
      const bsModal = new bootstrap.Modal(modal);
      
      // Reset form and navigate on close
      modal.addEventListener('hidden.bs.modal', () => {
        form.reset();
        FormValidator.clearAllErrors(form);
        
        // Remove any lingering backdrops
        document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
          backdrop.remove();
        });
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('padding-right');
        
        // Navigate back to home
        if (window.router) {
          window.router.navigateTo('about');
        }
      }, { once: true });
      
      bsModal.show();
    }
  }
}

// Auto-initialize when page loads
document.addEventListener('pageLoaded', (e) => {
  if (e.detail.route === 'customer-register') {
    // Use setTimeout to ensure DOM is fully rendered
    setTimeout(() => {
      CustomerFormHandler.initializeIfNeeded();
    }, 50);
  }
});

// Also listen for DOMContentLoaded as backup
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on customer register page and initialize if needed
  if (document.getElementById('customerForm')) {
    CustomerFormHandler.initializeIfNeeded();
  }
});

// Legacy support
window.CustomerForm = CustomerFormHandler;

// Legacy support
window.CustomerForm = CustomerFormHandler;
