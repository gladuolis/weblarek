import { IBuyer, TPayment, IValidationErrors } from '../../types';
import { EventEmitter } from '../base/Events';

export class BuyerModel {
  private _payment: TPayment | null = null;
  private _email: string = '';
  private _phone: string = '';
  private _address: string = '';
  private events: EventEmitter;

  constructor() {
    this.events = new EventEmitter();
  }

  // Сохраняет данные покупателя (частично или полностью)
  setData(data: Partial<IBuyer>): void {
    if (data.payment !== undefined) this._payment = data.payment;
    if (data.email !== undefined) this._email = data.email;
    if (data.phone !== undefined) this._phone = data.phone;
    if (data.address !== undefined) this._address = data.address;
    
    this.events.emit('buyer:changed', this.getData());
  }

  // Возвращает все данные покупателя
  getData(): IBuyer | null {
    if (this._payment && this._email && this._phone && this._address) {
      return {
        payment: this._payment,
        email: this._email,
        phone: this._phone,
        address: this._address
      };
    }
    return null;
  }

  // Очищает данные покупателя
  clearData(): void {
    this._payment = null;
    this._email = '';
    this._phone = '';
    this._address = '';
    this.events.emit('buyer:changed', null);
  }

  // Проверяет валидность данных и возвращает объект с ошибками
  validate(): IValidationErrors {
    const errors: IValidationErrors = {};

    if (!this._payment) {
      errors.payment = 'Не выбран способ оплаты';
    }

    if (!this._email.trim()) {
      errors.email = 'Укажите email';
    }

    if (!this._phone.trim()) {
      errors.phone = 'Укажите телефон';
    }

    if (!this._address.trim()) {
      errors.address = 'Укажите адрес доставки';
    }

    return errors;
  }

  // Проверяет, все ли данные валидны
  isValid(): boolean {
    const errors = this.validate();
    return Object.keys(errors).length === 0;
  }

  // Метод для подписки на события
  on(event: string, callback: (data: any) => void) {
    this.events.on(event, callback);
  }
}