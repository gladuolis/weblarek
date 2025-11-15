import { Component } from '../base/Component';

export class SuccessMessage extends Component<{ total: number }> {
  private _description: HTMLElement;
  private _closeButton: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    private onClose?: () => void
  ) {
    super(container);
    
    this._description = this.container.querySelector('.order-success__description') as HTMLElement;
    this._closeButton = this.container.querySelector('.order-success__close') as HTMLButtonElement;

    console.log('✅ SuccessMessage elements:', {
      description: !!this._description,
      closeButton: !!this._closeButton
    });

    if (this._closeButton) {
      this._closeButton.addEventListener('click', () => {
        console.log('✅ Success close button clicked');
        if (this.onClose) {
          this.onClose();
        }
      });
    }
  }

  setTotal(total: number): void {
    if (this._description) {
      this.setText(this._description, `Списано ${total} синапсов`);
      console.log('✅ Success message total set to:', total);
    }
  }

  render(data?: { total: number }): HTMLElement {
    if (data && data.total !== undefined) {
      this.setTotal(data.total);
    }
    return this.container;
  }
}