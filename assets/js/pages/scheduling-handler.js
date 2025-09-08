class SchedulingFormHandler {
  static initialized = false;
  static currentMonth = new Date().getMonth();
  static currentYear = new Date().getFullYear();

  static initializeIfNeeded() {
    const form = document.getElementById('schedulingForm');
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
    // Initialize calendar and time slots
    this.initializeCalendar();
    this.initializeTimeSlots();
    
    // Service type selection
    this.initializeServiceSelection();
    
    // Form validation
    this.initializeFormValidation(form);
    
    // Add input masks
    this.addInputMasks();
  }

  static initializeServiceSelection() {
    document.querySelectorAll('.service-option').forEach(option => {
      option.addEventListener('click', () => {
        // Remove previous selections
        document.querySelectorAll('.service-option').forEach(opt => {
          opt.classList.remove('selected');
        });
        
        // Select current option
        option.classList.add('selected');
        const radio = option.querySelector('input[type="radio"]');
        if (radio) {
          radio.checked = true;
          
          // Clear service type error
          const serviceError = document.getElementById('serviceTypeError');
          if (serviceError) {
            serviceError.textContent = '';
          }
          
          // Show/hide delivery address
          const deliveryAddress = document.getElementById('deliveryAddress');
          if (deliveryAddress) {
            if (radio.value === 'delivery') {
              deliveryAddress.classList.remove('d-none');
            } else {
              deliveryAddress.classList.add('d-none');
            }
          }
        }
      });
    });
  }

  static initializeFormValidation(form) {
    const allInputs = form.querySelectorAll('input, select, textarea');
    
    allInputs.forEach(input => {
      input.addEventListener('input', () => {
        FormValidator.setFieldError(input, '');
      });

      input.addEventListener('blur', () => {
        this.validateSchedulingField(input);
      });

      // Clear service type error when selecting
      if (input.name === 'serviceType') {
        input.addEventListener('change', () => {
          document.getElementById('serviceTypeError').textContent = '';
        });
      }
    });

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleFormSubmit(form);
    });
  }

  static handleFormSubmit(form) {
    let isValid = true;
    
    // Clear all errors
    FormValidator.clearAllErrors(form);
    document.getElementById('serviceTypeError').textContent = '';
    document.getElementById('dateError').textContent = '';
    document.getElementById('timeError').textContent = '';

    // Validate service type
    const serviceType = form.querySelector('input[name="serviceType"]:checked');
    if (!serviceType) {
      document.getElementById('serviceTypeError').textContent = 'Selecione um tipo de serviço';
      isValid = false;
    }

    // Validate customer data
    const customerName = form.querySelector('#customerName');
    const customerPhone = form.querySelector('#customerPhone');
    
    if (!customerName.value.trim()) {
      FormValidator.setFieldError(customerName, 'Nome é obrigatório');
      isValid = false;
    }
    
    if (!customerPhone.value.trim()) {
      FormValidator.setFieldError(customerPhone, 'Telefone é obrigatório');
      isValid = false;
    } else if (customerPhone.value.replace(/\D/g, '').length < 10) {
      FormValidator.setFieldError(customerPhone, 'Telefone inválido');
      isValid = false;
    }

    // Validate delivery address if needed
    if (serviceType && serviceType.value === 'delivery') {
      const deliveryFields = ['deliveryCep', 'deliveryStreet', 'deliveryNumber', 'deliveryNeighborhood'];
      deliveryFields.forEach(fieldName => {
        const field = form.querySelector(`#${fieldName}`);
        if (field && !field.value.trim()) {
          FormValidator.setFieldError(field, 'Campo obrigatório para entrega');
          isValid = false;
        }
      });
    }

    // Validate date and time
    const selectedDate = document.getElementById('selectedDate');
    const selectedTime = document.getElementById('selectedTime');
    
    if (!selectedDate.value) {
      document.getElementById('dateError').textContent = 'Selecione uma data';
      isValid = false;
    }
    
    if (!selectedTime.value) {
      document.getElementById('timeError').textContent = 'Selecione um horário';
      isValid = false;
    }

    if (isValid) {
      this.showSuccessModal(form);
    }
  }

  static validateSchedulingField(field) {
    const value = field.value.trim();
    const isDeliveryField = field.name && field.name.startsWith('delivery');
    const isDeliverySelected = document.querySelector('input[name="serviceType"]:checked')?.value === 'delivery';
    
    if (field.hasAttribute('required') && !value) {
      // Skip validation of delivery fields if pickup is selected
      if (isDeliveryField && !isDeliverySelected) {
        return true;
      }
      FormValidator.setFieldError(field, 'Este campo é obrigatório');
      return false;
    }
    
    if (field.type === 'tel' && value && value.replace(/\D/g, '').length < 10) {
      FormValidator.setFieldError(field, 'Telefone inválido');
      return false;
    }

    FormValidator.setFieldError(field, '');
    return true;
  }

  static initializeCalendar() {
    const today = new Date();
    this.currentMonth = today.getMonth();
    this.currentYear = today.getFullYear();

    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    const renderCalendar = () => {
      const monthYear = document.getElementById('monthYear');
      const calendarDays = document.getElementById('calendarDays');
      
      if (!monthYear || !calendarDays) return;

      monthYear.textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;
      calendarDays.innerHTML = '';

      // Get first day of month and number of days
      const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
      const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

      // Add empty cells for days before month starts
      for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('calendar-day', 'disabled');
        calendarDays.appendChild(emptyDay);
      }

      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        dayElement.textContent = day;

        // Disable past dates
        const dayDate = new Date(this.currentYear, this.currentMonth, day);
        if (dayDate < today) {
          dayElement.classList.add('disabled');
        } else {
          dayElement.addEventListener('click', () => {
            // Remove previous selection
            document.querySelectorAll('.calendar-day.selected').forEach(selected => {
              selected.classList.remove('selected');
            });
            
            // Select current day
            dayElement.classList.add('selected');
            
            // Set selected date
            const selectedDate = document.getElementById('selectedDate');
            if (selectedDate) {
              const dateString = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              selectedDate.value = dateString;
            }
            
            // Clear date error
            document.getElementById('dateError').textContent = '';
          });
        }

        calendarDays.appendChild(dayElement);
      }
    };

    // Navigation buttons
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');

    if (prevMonth) {
      prevMonth.addEventListener('click', () => {
        this.currentMonth--;
        if (this.currentMonth < 0) {
          this.currentMonth = 11;
          this.currentYear--;
        }
        renderCalendar();
      });
    }

    if (nextMonth) {
      nextMonth.addEventListener('click', () => {
        this.currentMonth++;
        if (this.currentMonth > 11) {
          this.currentMonth = 0;
          this.currentYear++;
        }
        renderCalendar();
      });
    }

    renderCalendar();
  }

  static initializeTimeSlots() {
    const timeSlots = document.getElementById('timeSlots');
    if (!timeSlots) return;

    const times = [
      '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
      '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
      '16:00', '16:30', '17:00', '17:30', '18:00'
    ];

    timeSlots.innerHTML = '';

    times.forEach(time => {
      const timeSlot = document.createElement('div');
      timeSlot.classList.add('time-slot');
      timeSlot.textContent = time;
      
      timeSlot.addEventListener('click', () => {
        // Remove previous selection
        document.querySelectorAll('.time-slot.selected').forEach(selected => {
          selected.classList.remove('selected');
        });
        
        // Select current time
        timeSlot.classList.add('selected');
        
        // Set selected time
        const selectedTime = document.getElementById('selectedTime');
        if (selectedTime) {
          selectedTime.value = time;
        }
        
        // Clear time error
        document.getElementById('timeError').textContent = '';
      });
      
      timeSlots.appendChild(timeSlot);
    });
  }

  static addInputMasks() {
    // Apply phone mask
    FormValidator.applyMask('customerPhone', 'phone');
    
    // Apply CEP mask
    FormValidator.applyMask('deliveryCep', 'cep');
  }

  static showSuccessModal(form) {
    const modal = document.getElementById('schedulingSuccessModal');
    if (modal && typeof bootstrap !== 'undefined') {
      const bsModal = new bootstrap.Modal(modal);
      
      // Reset form and navigate on close
      modal.addEventListener('hidden.bs.modal', () => {
        form.reset();
        
        // Reset UI elements
        this.initializeCalendar();
        this.initializeTimeSlots();
        
        // Clear selections
        document.querySelectorAll('.service-option').forEach(opt => {
          opt.classList.remove('selected');
        });
        document.getElementById('deliveryAddress').classList.add('d-none');
        
        // Clean up modal
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
  if (e.detail.route === 'scheduling') {
    // Use setTimeout to ensure DOM is fully rendered
    setTimeout(() => {
      SchedulingFormHandler.initializeIfNeeded();
    }, 50);
  }
});

// Also listen for DOMContentLoaded as backup
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on scheduling page and initialize if needed
  if (document.getElementById('schedulingForm')) {
    SchedulingFormHandler.initializeIfNeeded();
  }
});

// Legacy support
window.SchedulingSystem = SchedulingFormHandler;
