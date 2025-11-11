// View/ContactsForm.ts
import { Form } from './Form'; 
import { IContactsForm } from '../../types'; 

interface ContactsFormData { 
  email: string; 
  phone: string; 
} 

export class ContactsForm extends Form<ContactsFormData> implements IContactsForm { 
  private _emailInput: HTMLInputElement; 
  private _phoneInput: HTMLInputElement; 

  constructor( 
    container: HTMLElement, 
    private buyerModel: any, 
    protected onSubmit?: (data: ContactsFormData) => void 
  ) { 
    super(container); 
    
    this._emailInput = this.container.querySelector('input[name="email"]') as HTMLInputElement; 
    this._phoneInput = this.container.querySelector('input[name="phone"]') as HTMLInputElement; 

    this._emailInput.addEventListener('input', () => this.validate()); 
    this._phoneInput.addEventListener('input', () => this.validate()); 
  } 

  protected validate(): boolean { 
    this.buyerModel.setData({ 
      email: this._emailInput.value.trim(), 
      phone: this._phoneInput.value.trim() 
    }); 
    
    const errors = this.buyerModel.validate(); 
    const contactErrors: string[] = [];
    
    if (errors.email) contactErrors.push(errors.email);
    if (errors.phone) contactErrors.push(errors.phone);
    
    if (contactErrors.length > 0) { 
      this.showErrors(contactErrors.join(', ')); 
    } else { 
      this.clearErrors(); 
    } 

    const isValid = !errors.email && !errors.phone;
    this.setSubmitButtonState(!isValid); 
    return isValid; 
  } 

  protected getFormData(): ContactsFormData {
    return {
      email: this._emailInput.value.trim(),
      phone: this._phoneInput.value.trim()
    };
  }

  setData(email: string, phone: string): void { 
    this._emailInput.value = email || ''; 
    this._phoneInput.value = phone || ''; 
    this.validate(); 
  } 

  render(): this { 
    super.render();
    this._emailInput.value = ''; 
    this._phoneInput.value = ''; 
    return this; 
  } 
} 