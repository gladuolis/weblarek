import { IBuyer, TPayment, IValidationErrors } from '../../types'; 
import { EventEmitter } from '../base/Events'; 

export class BuyerModel { 
  private _payment: TPayment | null = null; 
  private _email: string = ''; 
  private _phone: string = ''; 
  private _address: string = ''; 

  constructor(private events: EventEmitter) {} 

  setData(data: Partial<IBuyer>): void { 
    if (data.payment !== undefined) this._payment = data.payment; 
    if (data.email !== undefined) this._email = data.email; 
    if (data.phone !== undefined) this._phone = data.phone; 
    if (data.address !== undefined) this._address = data.address; 
     
    this.events.emit('buyer:changed', this.getData()); 
  } 

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

  // Валидация для формы заказа (только payment и address)
  validateOrder(): IValidationErrors {
    const errors: IValidationErrors = {};

    if (!this._payment) {
      errors.payment = 'Не выбран способ оплаты';
    }

    if (!this._address.trim()) {
      errors.address = 'Укажите адрес доставки';
    }

    return errors;
  }

  // Валидация для формы контактов (только email и phone)
  validateContacts(): IValidationErrors {
    const errors: IValidationErrors = {};

    if (!this._email.trim()) {
      errors.email = 'Укажите email';
    }

    if (!this._phone.trim()) {
      errors.phone = 'Укажите телефон';
    }

    return errors;
  }

  // Полная валидация (для финальной проверки)
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

  isValidOrder(): boolean {
    const errors = this.validateOrder();
    return Object.keys(errors).length === 0;
  }

  isValidContacts(): boolean {
    const errors = this.validateContacts();
    return Object.keys(errors).length === 0;
  }

  isValid(): boolean {
    const errors = this.validate();
    return Object.keys(errors).length === 0;
  }

  clearData(): void { 
    this._payment = null; 
    this._email = ''; 
    this._phone = ''; 
    this._address = ''; 
    this.events.emit('buyer:changed', null); 
  } 
} 