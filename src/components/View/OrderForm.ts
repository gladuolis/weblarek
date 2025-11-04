import { TPayment } from '../../types';

export class OrderForm {
  protected _container: HTMLElement;
  protected _form: HTMLFormElement;
  protected _cardButton: HTMLButtonElement;
  protected _cashButton: HTMLButtonElement;
  protected _addressInput: HTMLInputElement;
  protected _submitButton: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(
    container: HTMLElement,
    protected onSubmit?: (data: { payment: TPayment; address: string }) => void
  ) {
    this._container = container;
    
    // Находим элементы
    this._form = this._container.querySelector('form') as HTMLFormElement;
    this._cardButton = this._container.querySelector('button[name="card"]') as HTMLButtonElement;
    this._cashButton = this._container.querySelector('button[name="cash"]') as HTMLButtonElement;
    this._addressInput = this._container.querySelector('input[name="address"]') as HTMLInputElement;
    this._submitButton = this._container.querySelector('.order__button') as HTMLButtonElement;
    this._errors = this._container.querySelector('.form__errors') as HTMLElement;

    // Обработчики событий
    this._cardButton.addEventListener('click', () => this.selectPayment('card'));
    this._cashButton.addEventListener('click', () => this.selectPayment('cash'));
    this._addressInput.addEventListener('input', () => this.validateForm());
    this._form.addEventListener('submit', (e) => this.handleSubmit(e));

    this._selectedPayment = null;
  }

  protected _selectedPayment: TPayment | null = null;

  // Выбор способа оплаты
  selectPayment(payment: TPayment) {
    this._selectedPayment = payment;
    
    // Обновляем стили кнопок
    this._cardButton.classList.toggle('button_alt-active', payment === 'card');
    this._cashButton.classList.toggle('button_alt-active', payment === 'cash');
    
    this.validateForm();
  }

  // Валидация формы
  validateForm() {
    const isAddressValid = this._addressInput.value.trim().length > 0;
    const isPaymentValid = this._selectedPayment !== null;

    // Обновляем ошибки
    this._errors.textContent = '';
    if (!isPaymentValid) {
      this._errors.textContent = 'Выберите способ оплаты';
    } else if (!isAddressValid) {
      this._errors.textContent = 'Введите адрес доставки';
    }

    // Активируем/деактивируем кнопку
    this._submitButton.disabled = !(isAddressValid && isPaymentValid);

    return isAddressValid && isPaymentValid;
  }

  // Обработка отправки формы
  protected handleSubmit(event: Event) {
    event.preventDefault();
    
    if (this.validateForm() && this._selectedPayment && this.onSubmit) {
      this.onSubmit({
        payment: this._selectedPayment,
        address: this._addressInput.value.trim()
      });
    }
  }

  render() {
    // Сбрасываем форму при каждом рендере
    this._selectedPayment = null;
    this._cardButton.classList.remove('button_alt-active');
    this._cashButton.classList.remove('button_alt-active');
    this._addressInput.value = '';
    this._errors.textContent = '';
    this._submitButton.disabled = true;

    return this._container;
  }
}