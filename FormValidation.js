const vFields = {
  validateName: {
    minLength: 3,
    error: 'Name must be longer than 3 characters and must be letters only'
  },
  validateEmail: {
    regEx: /^.+@.+\..+$/,
    error: 'Please enter a valid email'
  },
  validatePhone: {
    regEx: /[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]/,
    error: 'Please enter a valid phone number'
  }
};

export default class FormValidation {
  constructor(el, customValidations) {
    this.el = el || '[data-form-validation]';
    this.customValidations = customValidations || null;
    this.fields = [];
    this.errors = {};
    this.valid = false;
    this.validateName = this.validateName.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
    this.validatePhone = this.validatePhone.bind(this);
    this.runValidation();
  }

  runValidation() {
    this.node = document.querySelector(this.el);
    this.collectFields();
    this.apply();
  }

  collectFields() {
    if (this.node.getElementsByTagName('input').length) {
      let inputs = this.node.getElementsByTagName('input');
      for (let i = 0; i < inputs.length; i++) {
        if (Object.keys(inputs[i].dataset).length) {
          this.fields.push(inputs[i]);
        }
      }
    }

    //if (this.node.getElementsByTagName('select').length) {
    //}

    //if (this.node.getElementsByTagName('textarea').length) {
    //}
  }

  assignValidation() {
    this.fields.forEach((el) => {
      for (let prop in vFields) {
        if (el.dataset.hasOwnProperty(prop)) {
          this[prop](el);
        }
      }

      if (this.customValidations) {
        for (let prop in this.customValidations) {
          if (el.dataset.hasOwnProperty(prop)) {
            this.customValidations[prop](el);
          }
        }
      }
    });
  }

  validateName(el) {
    const vName = vFields.validateName;

    el.addEventListener('blur', () => {
      if (el.value.length < vName.minLength) {
        if (!this.errors.hasOwnProperty('name')) {
          this.errors.name = {
            el: el,
            id: 'name-error',
            msg: vName.error
          };
          this.showMsg('name');
        }
      } else {
        this.removeMsg('name');
      }
    });
  }

  validatePhone(el) {
    const vPhone = vFields.validatePhone;

    el.addEventListener('blur', () => {
      if (!vPhone.regEx.test(el.value)) {
        if (!this.errors.hasOwnProperty('phone')) {
          this.errors.phone = {
            el: el,
            id: 'phone-error',
            msg: vPhone.error
          };
          this.showMsg('phone');
        }
      } else {
        this.removeMsg('phone');
      }
    });
  }

  validateEmail(el) {
    const vEmail = vFields.validateEmail;

    el.addEventListener('blur', () => {
      if (!vEmail.regEx.test(el.value)) {
        if (!this.errors.hasOwnProperty('email')) {
          this.errors.email = {
            el: el,
            id: 'email-error',
            msg: vEmail.error
          };
          this.showMsg('email');
        }
      } else {
        this.removeMsg('email');
      }
    });
  }

  errorTemplate(error) {
    let errEl = document.createElement('span');
    errEl.className = 'error-msg';
    errEl.id = error.id;
    errEl.innerHTML = `${error.msg}`;
    error.el.parentNode.prepend(errEl);
  }

  showMsg(error) {
    if (!this.node.querySelector(`${error}-msg`)) {
      this.errorTemplate(this.errors[error]);
      this.updateValid();
    }
  }

  removeMsg(error) {
    if (this.errors[error]) {
      document.querySelector(`#${this.errors[error].id}`).remove();
      delete this.errors[error];
      this.updateValid();
    }
  }

  updateValid() {
    let fields = [];

    for (let field in this.fields) {
      if (!this.fields[field].value.length) {
        fields.push(field);
      } else {
        fields.pop(field);
      }
    }

    if (Object.keys(this.errors).length == 0 && fields.length == 0) {
      this.node.querySelector('input[type=submit]').disabled = false;
    } else {
      this.node.querySelector('input[type=submit]').disabled = true;
    }
  }

  apply() {
    this.assignValidation();
    this.node.querySelector('input[type=submit]').disabled = true;
  }
}
