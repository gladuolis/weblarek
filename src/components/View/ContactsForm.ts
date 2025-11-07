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

    this.initializeHandlers();
  }

  private initializeHandlers(): void {
    this._emailInput.addEventListener('input', () => this.validate());
    this._phoneInput.addEventListener('input', () => this.validate());
    this._form.addEventListener('submit', (event) => this.handleSubmit(event));
  }

  protected validate(): boolean {
    if (this.buyerModel) {
      this.buyerModel.setData({
        email: this._emailInput.value.trim(),
        phone: this._phoneInput.value.trim()
      });
      
      const errors = this.buyerModel.validateContacts();
      
      if (errors.email || errors.phone) {
        this.showErrors(errors.email || errors.phone || '');
      } else {
        this.clearErrors();
      }

      const isValid = this.buyerModel.isValidContacts();
      this.setSubmitButtonState(!isValid);
      return isValid;
    }

    return false;
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();
    
    if (this.validate() && this.onSubmit) {
      this.onSubmit({
        email: this._emailInput.value.trim(),
        phone: this._phoneInput.value.trim()
      });
    }
  }

  setData(email: string, phone: string): void {
    if (email) {
      this._emailInput.value = email;
    }
    
    if (phone) {
      this._phoneInput.value = phone;
    }
    
    this.validate();
  }

  render(): this {
    this._emailInput.value = '';
    this._phoneInput.value = '';
    this.clearErrors();
    this.setSubmitButtonState(true);
    
    return this;
  }
}