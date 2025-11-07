import { Component } from '../base/Component';

export abstract class Form<T> extends Component<T> {
  protected _form: HTMLFormElement;
  protected _submitButton: HTMLButtonElement;
  protected _errors: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    
    // Более гибкий поиск элементов формы
    this._form = this.container.querySelector('form') as HTMLFormElement;
    this._submitButton = this.container.querySelector('button[type="submit"]') as HTMLButtonElement || 
                         this.container.querySelector('.order__button') as HTMLButtonElement ||
                         this.container.querySelector('button[type="button"]') as HTMLButtonElement;
    this._errors = this.container.querySelector('.form__errors') as HTMLElement;

    console.log('📝 Form base elements found:', {
      form: !!this._form,
      submitButton: !!this._submitButton,
      errors: !!this._errors,
      submitButtonText: this._submitButton?.textContent
    });

    if (!this._form) {
      console.error('❌ Form element not found!');
    }
    if (!this._submitButton) {
      console.error('❌ Submit button not found!');
    }
  }

  protected setSubmitButtonState(disabled: boolean): void {
    if (this._submitButton) {
      this._submitButton.disabled = disabled;
      console.log('📝 Submit button state:', disabled ? 'disabled' : 'enabled');
    }
  }

  protected showErrors(message: string): void {
    if (this._errors) {
      this._errors.textContent = message;
      console.log('📝 Error shown:', message);
    }
  }

  protected clearErrors(): void {
    if (this._errors) {
      this._errors.textContent = '';
    }
  }

  protected abstract validate(): boolean;
}