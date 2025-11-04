export class ContactsForm {
  protected _container: HTMLElement;
  protected _form: HTMLFormElement;
  protected _emailInput: HTMLInputElement;
  protected _phoneInput: HTMLInputElement;
  protected _submitButton: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(
    container: HTMLElement,
    protected onSubmit?: (data: { email: string; phone: string }) => void
  ) {
    this._container = container;
    
    // Находим элементы
    this._form = this._container.querySelector('form') as HTMLFormElement;
    this._emailInput = this._container.querySelector('input[name="email"]') as HTMLInputElement;
    this._phoneInput = this._container.querySelector('input[name="phone"]') as HTMLInputElement;
    this._submitButton = this._container.querySelector('button[type="submit"]') as HTMLButtonElement;
    this._errors = this._container.querySelector('.form__errors') as HTMLElement;

    // Обработчики событий
    this._emailInput.addEventListener('input', () => this.validateForm());
    this._phoneInput.addEventListener('input', () => this.validateForm());
    this._form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  // Валидация формы
  validateForm() {
    const isEmailValid = this._emailInput.value.trim().length > 0;
    const isPhoneValid = this._phoneInput.value.trim().length > 0;

    // Обновляем ошибки
    this._errors.textContent = '';
    if (!isEmailValid && !isPhoneValid) {
      this._errors.textContent = 'Заполните email и телефон';
    } else if (!isEmailValid) {
      this._errors.textContent = 'Введите email';
    } else if (!isPhoneValid) {
      this._errors.textContent = 'Введите телефон';
    }

    // Активируем/деактивируем кнопку
    this._submitButton.disabled = !(isEmailValid && isPhoneValid);

    return isEmailValid && isPhoneValid;
  }

  // Обработка отправки формы
  protected handleSubmit(event: Event) {
    event.preventDefault();
    
    if (this.validateForm() && this.onSubmit) {
      this.onSubmit({
        email: this._emailInput.value.trim(),
        phone: this._phoneInput.value.trim()
      });
    }
  }

  render() {
    // Сбрасываем форму при каждом рендере
    this._emailInput.value = '';
    this._phoneInput.value = '';
    this._errors.textContent = '';
    this._submitButton.disabled = true;

    return this._container;
  }
}