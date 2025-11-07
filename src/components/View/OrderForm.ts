import { Form } from './Form';
import { IBuyer, IOrderForm } from '../../types';

interface OrderFormData {
  payment: string;
  address: string;
}

export class OrderForm extends Form<OrderFormData> implements IOrderForm {
  private _onlineButton: HTMLButtonElement;
  private _cashButton: HTMLButtonElement;
  private _addressInput: HTMLInputElement;
  private _selectedPayment: string = '';

  constructor(
    container: HTMLElement,
    private buyerModel: any,
    protected onSubmit?: (data: OrderFormData) => void
  ) {
    super(container);
    
    this._onlineButton = this.container.querySelector('button[name="card"]') as HTMLButtonElement;
    this._cashButton = this.container.querySelector('button[name="cash"]') as HTMLButtonElement;
    this._addressInput = this.container.querySelector('input[name="address"]') as HTMLInputElement;

    this.initializeHandlers();
  }

  private initializeHandlers(): void {
    this._onlineButton.addEventListener('click', () => this.selectPayment('online'));
    this._cashButton.addEventListener('click', () => this.selectPayment('cash'));
    this._addressInput.addEventListener('input', () => this.validate());
    this._form.addEventListener('submit', (event) => this.handleSubmit(event));
  }

  private selectPayment(method: 'online' | 'cash'): void {
    this._selectedPayment = method;
    this._onlineButton.classList.toggle('button_alt-active', method === 'online');
    this._cashButton.classList.toggle('button_alt-active', method === 'cash');
    this.validate();
  }

  protected validate(): boolean {
    if (this.buyerModel) {
      this.buyerModel.setData({
        payment: this._selectedPayment,
        address: this._addressInput.value.trim()
      });
      
      const errors = this.buyerModel.validateOrder();
      
      if (errors.payment || errors.address) {
        this.showErrors(errors.payment || errors.address || '');
      } else {
        this.clearErrors();
      }

      const isValid = this.buyerModel.isValidOrder();
      this.setSubmitButtonState(!isValid);
      return isValid;
    }

    return false;
  }

  private handleSubmit(event: Event): void {
    event.preventDefault();
    
    if (this.validate() && this.onSubmit) {
      this.onSubmit({
        payment: this._selectedPayment,
        address: this._addressInput.value.trim()
      });
    }
  }

  setData(payment: string, address: string): void {
    if (payment === 'online' || payment === 'cash') {
      this.selectPayment(payment);
    }
    
    if (address) {
      this._addressInput.value = address;
    }
    
    this.validate();
  }

  render(): this {
    this._addressInput.value = '';
    this._selectedPayment = '';
    this._onlineButton.classList.remove('button_alt-active');
    this._cashButton.classList.remove('button_alt-active');
    this.clearErrors();
    this.setSubmitButtonState(true);
    
    return this;
  }
}