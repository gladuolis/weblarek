// models/BuyerModel.ts
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

  isValid(): boolean {  
    return Object.keys(this.validate()).length === 0;  
  }  

  clearData(): void {  
    this._payment = null;  
    this._email = '';  
    this._phone = '';  
    this._address = '';  
    this.events.emit('buyer:changed', null);  
  }  
}  