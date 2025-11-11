// View/Form.ts
export abstract class Form<T> {
  protected container: HTMLElement;
  protected _form: HTMLFormElement;
  protected _submitButton: HTMLButtonElement;
  protected _errorElement: HTMLElement;

  constructor(container: HTMLElement) {
    this.container = container;
    this._form = this.container.querySelector('form') as HTMLFormElement;
    this._submitButton = this.container.querySelector('button[type="submit"]') as HTMLButtonElement;
    this._errorElement = this.container.querySelector('.form__errors') as HTMLElement;

    this._form.addEventListener('submit', (event) => this.handleSubmit(event));
  }

  protected handleSubmit(event: Event): void {
    event.preventDefault();
    if (this.validate() && this.onSubmit) {
      this.onSubmit(this.getFormData());
    }
  }

  protected abstract validate(): boolean;
  protected abstract getFormData(): T;
  protected abstract onSubmit?(data: T): void;

  protected showErrors(message: string): void {
    if (this._errorElement) {
      this._errorElement.textContent = message;
      this._errorElement.style.display = 'block';
    }
  }

  protected clearErrors(): void {
    if (this._errorElement) {
      this._errorElement.textContent = '';
      this._errorElement.style.display = 'none';
    }
  }

  protected setSubmitButtonState(disabled: boolean): void {
    this._submitButton.disabled = disabled;
  }

  render(): this {
    this.clearErrors();
    this.setSubmitButtonState(true);
    return this;
  }
}